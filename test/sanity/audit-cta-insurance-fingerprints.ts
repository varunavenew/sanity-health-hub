/**
 * Phase 4 pre-migration AUDIT ONLY — no writes.
 *
 * Fingerprints all pageSectionInsurance + pageSectionBookingCta bands
 * across every document that has pageSections. Clusters identical
 * rendered content so migration can create the MINIMUM collections.
 *
 * Usage:
 *   cd test
 *   npx tsx sanity/audit-cta-insurance-fingerprints.ts
 */
import {createHash} from 'crypto'
import {writeFileSync} from 'fs'
import path from 'path'
import {sanityClient as client, DATASET} from './config'
import {pickNo} from '../schemaTypes/i18n'

type PageHit = {
  _id: string
  _type: string
  title?: unknown
  name?: string
  slug?: string
  pageSections?: SectionRaw[] | null
}

type SectionRaw = {
  _key?: string
  _type?: string
  eyebrow?: unknown
  title?: unknown
  subtitle?: unknown
  primaryLabel?: unknown
  primaryPath?: string | null
  secondaryLabel?: unknown
  secondaryPath?: string | null
  showSecondaryButton?: boolean | null
  bookingCategory?: {_ref?: string; categoryId?: string; title?: unknown} | null
  quickInfoItems?: Array<{icon?: string; text?: unknown}> | null
  partners?: Array<{key?: string; label?: unknown}> | null
  ctaCollection?: {_ref?: string} | null
  insuranceCollection?: {_ref?: string} | null
}

type BandRef = {
  pageId: string
  pageType: string
  pageLabel: string
  sectionKey: string
}

function plain(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  if (value == null) return ''
  const fromI18n = pickNo(value)
  if (typeof fromI18n === 'string') return fromI18n.trim()
  return String(value).trim()
}

function pageLabel(doc: PageHit): string {
  return (
    plain(doc.title) ||
    doc.name?.trim() ||
    doc.slug?.trim() ||
    doc._id.replace(/^drafts\./, '')
  )
}

function fingerprintHash(payload: unknown): string {
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex').slice(0, 16)
}

/** Insurance fingerprint = rendered band body (eyebrow, title, ordered partners). */
function insuranceFingerprint(section: SectionRaw): {
  hash: string
  usable: boolean
  summary: string
  payload: Record<string, unknown>
} {
  const partners = (section.partners || [])
    .map((p) => ({
      key: (p.key || '').trim(),
      label: plain(p.label),
    }))
    .filter((p) => p.key)

  const payload = {
    eyebrow: plain(section.eyebrow),
    title: plain(section.title),
    partners,
  }

  const usable = partners.length > 0
  const summary = usable
    ? `${payload.eyebrow || '(no eyebrow)'} · ${payload.title || '(no title)'} · ${partners.length} partners [${partners.map((p) => p.key).join(', ')}]`
    : '(empty partners — skip)'

  return {hash: fingerprintHash(payload), usable, summary, payload}
}

/**
 * CTA fingerprint = fields that affect rendered Booking CTA content.
 * Band-only image/variant omitted (FE forces dark; image unused).
 * Empty shells (no usable content) are skipped — FE defaults only.
 */
function ctaFingerprint(section: SectionRaw): {
  hash: string
  usable: boolean
  summary: string
  payload: Record<string, unknown>
} {
  const quickInfo = (section.quickInfoItems || [])
    .map((item) => ({
      icon: item.icon === 'shield' ? 'shield' : 'clock',
      text: plain(item.text),
    }))
    .filter((item) => item.text)

  const bookingCategoryId =
    section.bookingCategory?.categoryId?.trim() ||
    section.bookingCategory?._ref?.trim() ||
    ''

  const payload = {
    title: plain(section.title),
    subtitle: plain(section.subtitle),
    primaryLabel: plain(section.primaryLabel),
    primaryPath: (section.primaryPath || '').trim(),
    showSecondaryButton: section.showSecondaryButton !== false,
    secondaryLabel: plain(section.secondaryLabel),
    secondaryPath: (section.secondaryPath || '').trim(),
    bookingCategoryId,
    quickInfo,
  }

  const usable = Boolean(
    payload.title ||
      payload.subtitle ||
      payload.primaryLabel ||
      payload.primaryPath ||
      payload.secondaryLabel ||
      payload.secondaryPath ||
      payload.bookingCategoryId ||
      quickInfo.length > 0,
  )

  const summary = usable
    ? [
        payload.title || '(no title)',
        payload.primaryLabel || '(no primary label)',
        payload.primaryPath || '/booking',
        payload.bookingCategoryId ? `cat:${payload.bookingCategoryId}` : null,
        `secondary:${payload.showSecondaryButton ? 'on' : 'off'}`,
        quickInfo.length ? `qi:${quickInfo.length}` : 'qi:default',
      ]
        .filter(Boolean)
        .join(' · ')
    : '(empty shell — skip; FE defaults)'

  return {hash: fingerprintHash(payload), usable, summary, payload}
}

function proposeInsuranceName(payload: Record<string, unknown>, index: number): string {
  const partners = payload.partners as Array<{key: string; label: string}>
  const keys = partners.map((p) => p.key).join('-')
  if (index === 0) return 'Standard Insurance Partners'
  const title = String(payload.title || '').slice(0, 40)
  return title ? `Insurance Partners — ${title}` : `Insurance Partners — ${keys || index + 1}`
}

function proposeCtaName(payload: Record<string, unknown>, index: number, pageCount: number): string {
  const title = String(payload.title || '').trim()
  const cat = String(payload.bookingCategoryId || '').trim()
  if (index === 0 && pageCount >= 5 && !cat) return 'Default Booking CTA'
  if (cat) return `Booking CTA — ${cat}${title ? ` (${title.slice(0, 32)})` : ''}`
  if (title) return `Booking CTA — ${title.slice(0, 48)}`
  return `Booking CTA pack ${index + 1}`
}

async function main() {
  console.log(`\nPhase 4 fingerprint audit — dataset: ${DATASET}\n`)

  const docs = await client.fetch<PageHit[]>(
    `*[defined(pageSections) && count(pageSections) > 0 && !(_id in path("drafts.**"))]{
      _id,
      _type,
      title,
      name,
      "slug": coalesce(slug[language == "no"][0].value.current, slug[0].value.current, slug.current),
      pageSections[]{
        _key,
        _type,
        eyebrow,
        title,
        subtitle,
        primaryLabel,
        primaryPath,
        secondaryLabel,
        secondaryPath,
        showSecondaryButton,
        "bookingCategory": bookingCategory->{ _id, categoryId, title },
        quickInfoItems[]{ icon, text },
        partners[]{ key, label },
        ctaCollection,
        insuranceCollection
      }
    }`,
  )

  type Cluster = {
    hash: string
    summary: string
    payload: Record<string, unknown>
    bands: BandRef[]
    alreadyLinked: number
  }

  const insuranceClusters = new Map<string, Cluster>()
  const ctaClusters = new Map<string, Cluster>()

  let insuranceBands = 0
  let insuranceEmpty = 0
  let insuranceAlreadyLinked = 0
  let ctaBands = 0
  let ctaEmpty = 0
  let ctaAlreadyLinked = 0

  const insuranceByType = new Map<string, number>()
  const ctaByType = new Map<string, number>()

  for (const doc of docs) {
    const sections = doc.pageSections || []
    for (const section of sections) {
      if (section._type === 'pageSectionInsurance') {
        insuranceBands++
        insuranceByType.set(doc._type, (insuranceByType.get(doc._type) || 0) + 1)
        if (section.insuranceCollection?._ref) insuranceAlreadyLinked++

        const fp = insuranceFingerprint(section)
        if (!fp.usable) {
          insuranceEmpty++
          continue
        }

        const existing = insuranceClusters.get(fp.hash)
        const ref: BandRef = {
          pageId: doc._id,
          pageType: doc._type,
          pageLabel: pageLabel(doc),
          sectionKey: section._key || '',
        }
        if (existing) {
          existing.bands.push(ref)
          if (section.insuranceCollection?._ref) existing.alreadyLinked++
        } else {
          insuranceClusters.set(fp.hash, {
            hash: fp.hash,
            summary: fp.summary,
            payload: fp.payload,
            bands: [ref],
            alreadyLinked: section.insuranceCollection?._ref ? 1 : 0,
          })
        }
      }

      if (section._type === 'pageSectionBookingCta') {
        ctaBands++
        ctaByType.set(doc._type, (ctaByType.get(doc._type) || 0) + 1)
        if (section.ctaCollection?._ref) ctaAlreadyLinked++

        const fp = ctaFingerprint(section)
        if (!fp.usable) {
          ctaEmpty++
          continue
        }

        const existing = ctaClusters.get(fp.hash)
        const ref: BandRef = {
          pageId: doc._id,
          pageType: doc._type,
          pageLabel: pageLabel(doc),
          sectionKey: section._key || '',
        }
        if (existing) {
          existing.bands.push(ref)
          if (section.ctaCollection?._ref) existing.alreadyLinked++
        } else {
          ctaClusters.set(fp.hash, {
            hash: fp.hash,
            summary: fp.summary,
            payload: fp.payload,
            bands: [ref],
            alreadyLinked: section.ctaCollection?._ref ? 1 : 0,
          })
        }
      }
    }
  }

  const insuranceSorted = [...insuranceClusters.values()].sort(
    (a, b) => b.bands.length - a.bands.length,
  )
  const ctaSorted = [...ctaClusters.values()].sort((a, b) => b.bands.length - a.bands.length)

  const insuranceProposed = insuranceSorted.map((c, i) => ({
    proposedName: proposeInsuranceName(c.payload, i),
    hash: c.hash,
    bandCount: c.bands.length,
    alreadyLinked: c.alreadyLinked,
    summary: c.summary,
    payload: c.payload,
    pages: c.bands.map((b) => ({
      type: b.pageType,
      id: b.pageId,
      label: b.pageLabel,
      sectionKey: b.sectionKey,
    })),
    pagesByType: countBy(c.bands.map((b) => b.pageType)),
  }))

  const ctaProposed = ctaSorted.map((c, i) => ({
    proposedName: proposeCtaName(c.payload, i, c.bands.length),
    hash: c.hash,
    bandCount: c.bands.length,
    alreadyLinked: c.alreadyLinked,
    summary: c.summary,
    payload: c.payload,
    pages: c.bands.map((b) => ({
      type: b.pageType,
      id: b.pageId,
      label: b.pageLabel,
      sectionKey: b.sectionKey,
    })),
    pagesByType: countBy(c.bands.map((b) => b.pageType)),
  }))

  const report = {
    dataset: DATASET,
    auditedAt: new Date().toISOString(),
    philosophy: 'Minimum collections for identical rendered content — not one per page.',
    insurance: {
      totalBands: insuranceBands,
      emptySkipped: insuranceEmpty,
      alreadyLinked: insuranceAlreadyLinked,
      uniqueFingerprints: insuranceSorted.length,
      proposedCollections: insuranceSorted.length,
      bandsByPageType: Object.fromEntries(insuranceByType),
      collections: insuranceProposed,
    },
    cta: {
      totalBands: ctaBands,
      emptySkipped: ctaEmpty,
      alreadyLinked: ctaAlreadyLinked,
      uniqueFingerprints: ctaSorted.length,
      proposedCollections: ctaSorted.length,
      singletonPacks: ctaSorted.filter((c) => c.bands.length === 1).length,
      multiPagePacks: ctaSorted.filter((c) => c.bands.length > 1).length,
      bandsByPageType: Object.fromEntries(ctaByType),
      collections: ctaProposed,
    },
  }

  const outPath = path.join(process.cwd(), '..', 'docs', 'PHASE_4_FINGERPRINT_AUDIT.json')
  writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf8')

  // Human summary to stdout
  console.log('=== INSURANCE ===')
  console.log(`Total bands: ${insuranceBands}`)
  console.log(`Empty (skip): ${insuranceEmpty}`)
  console.log(`Unique fingerprints / proposed collections: ${insuranceSorted.length}`)
  console.log(`Already linked: ${insuranceAlreadyLinked}`)
  console.log('By page type:', Object.fromEntries(insuranceByType))
  for (const [i, c] of insuranceProposed.entries()) {
    console.log(`\n[${i + 1}] ${c.proposedName} (${c.bandCount} pages) hash=${c.hash}`)
    console.log(`    ${c.summary}`)
    console.log(`    types: ${JSON.stringify(c.pagesByType)}`)
    for (const p of c.pages) {
      console.log(`    - [${p.type}] ${p.label} (${p.id})`)
    }
  }

  console.log('\n=== BOOKING CTA ===')
  console.log(`Total bands: ${ctaBands}`)
  console.log(`Empty shells (skip): ${ctaEmpty}`)
  console.log(`Unique fingerprints / proposed collections: ${ctaSorted.length}`)
  console.log(`Multi-page packs: ${report.cta.multiPagePacks} · Singletons: ${report.cta.singletonPacks}`)
  console.log(`Already linked: ${ctaAlreadyLinked}`)
  console.log('By page type:', Object.fromEntries(ctaByType))
  for (const [i, c] of ctaProposed.entries()) {
    console.log(`\n[${i + 1}] ${c.proposedName} (${c.bandCount} pages) hash=${c.hash}`)
    console.log(`    ${c.summary}`)
    console.log(`    types: ${JSON.stringify(c.pagesByType)}`)
    if (c.bandCount <= 20) {
      for (const p of c.pages) {
        console.log(`    - [${p.type}] ${p.label} (${p.id})`)
      }
    } else {
      for (const p of c.pages.slice(0, 8)) {
        console.log(`    - [${p.type}] ${p.label} (${p.id})`)
      }
      console.log(`    … +${c.bandCount - 8} more (see JSON)`)
    }
  }

  console.log(`\nFull JSON written to ${outPath}`)
  console.log('NO WRITES — audit only. Await approval before migration.\n')
}

function countBy(keys: string[]): Record<string, number> {
  const out: Record<string, number> = {}
  for (const k of keys) out[k] = (out[k] || 0) + 1
  return out
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
