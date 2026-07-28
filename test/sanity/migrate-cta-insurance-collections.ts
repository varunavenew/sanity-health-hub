/**
 * Phase 4 migration: pageSectionInsurance / pageSectionBookingCta → Content Library
 * collections (minimum collections for identical reusable content).
 *
 * Reference: migrate-faq-collections.ts (idempotent, draft sync, never touch legacy).
 *
 * Insurance fingerprint = title + ordered partners (NOT eyebrow — page-level override).
 * CTA fingerprint = title, subtitle, buttons, paths, bookingCategory, quick info.
 *
 * Empty Booking CTA shells are skipped (FE defaults).
 * Legacy inline fields are never deleted.
 *
 * Usage:
 *   cd test
 *   DRY_RUN=1 npx tsx sanity/migrate-cta-insurance-collections.ts
 *   npx tsx sanity/migrate-cta-insurance-collections.ts
 */
import {createHash} from 'crypto'
import {writeFileSync} from 'fs'
import path from 'path'
import {sanityClient as client, DATASET} from './config'
import {pickNo} from '../schemaTypes/i18n'

const DRY_RUN = process.env.DRY_RUN === '1'

type PageHit = {
  _id: string
  _type: string
  title?: unknown
  name?: string
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
  bookingCategory?: {_ref?: string; _type?: string} | null
  quickInfoItems?: Array<{_key?: string; icon?: string; text?: unknown}> | null
  partners?: Array<{_key?: string; key?: string; label?: unknown}> | null
  ctaCollection?: {_ref?: string} | null
  insuranceCollection?: {_ref?: string} | null
  [extra: string]: unknown
}

type BandRef = {
  pageId: string
  pageType: string
  pageLabel: string
  sectionKey: string
  section: SectionRaw
}

type Cluster = {
  hash: string
  bands: BandRef[]
  source: SectionRaw
}

type Report = {
  dataset: string
  dryRun: boolean
  startedAt: string
  finishedAt?: string
  insurance: {
    collectionsCreated: string[]
    collectionsReused: string[]
    pagesLinked: Array<{pageId: string; pageType: string; label: string; collectionId: string; sectionKey: string}>
    skippedAlreadyLinked: number
    skippedEmpty: number
    draftsSynced: number
  }
  cta: {
    collectionsCreated: string[]
    collectionsReused: string[]
    pagesLinked: Array<{pageId: string; pageType: string; label: string; collectionId: string; sectionKey: string}>
    skippedAlreadyLinked: number
    skippedEmpty: number
    draftsSynced: number
  }
  duplicateDetection: {
    insuranceFingerprints: number
    ctaFingerprints: number
    insuranceBandsFingerprinted: number
    ctaBandsFingerprinted: number
  }
  idempotency?: {
    secondPassCollectionsCreated: number
    secondPassLinks: number
  }
  usedOnVerification?: {
    insurance: Array<{collectionId: string; incomingCount: number; expected: number}>
    cta: Array<{collectionId: string; incomingCount: number; expected: number}>
  }
  errors: string[]
}

function plain(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  if (value == null) return ''
  const fromI18n = pickNo(value)
  if (typeof fromI18n === 'string') return fromI18n.trim()
  return String(value).trim()
}

function pageLabel(doc: PageHit): string {
  return plain(doc.title) || doc.name?.trim() || doc._id.replace(/^drafts\./, '')
}

function fingerprintHash(payload: unknown): string {
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex').slice(0, 16)
}

function sanitizeId(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-').slice(0, 128)
}

/** Reusable insurance content only — title + ordered partners (eyebrow is page-owned). */
function insuranceContentFingerprint(section: SectionRaw): {
  hash: string
  usable: boolean
  payload: Record<string, unknown>
} {
  const partners = (section.partners || [])
    .map((p) => ({
      key: (p.key || '').trim(),
      label: plain(p.label),
    }))
    .filter((p) => p.key)

  const payload = {
    title: plain(section.title),
    partners,
  }
  return {
    hash: fingerprintHash(payload),
    usable: partners.length > 0,
    payload,
  }
}

function ctaContentFingerprint(section: SectionRaw): {
  hash: string
  usable: boolean
  payload: Record<string, unknown>
} {
  const quickInfo = (section.quickInfoItems || [])
    .map((item) => ({
      icon: item.icon === 'shield' ? 'shield' : 'clock',
      text: plain(item.text),
    }))
    .filter((item) => item.text)

  const bookingCategoryRef = section.bookingCategory?._ref?.trim() || ''

  const payload = {
    title: plain(section.title),
    subtitle: plain(section.subtitle),
    primaryLabel: plain(section.primaryLabel),
    primaryPath: (section.primaryPath || '').trim(),
    showSecondaryButton: section.showSecondaryButton !== false,
    secondaryLabel: plain(section.secondaryLabel),
    secondaryPath: (section.secondaryPath || '').trim(),
    bookingCategoryRef,
    quickInfo,
  }

  const usable = Boolean(
    payload.title ||
      payload.subtitle ||
      payload.primaryLabel ||
      payload.primaryPath ||
      payload.secondaryLabel ||
      payload.secondaryPath ||
      payload.bookingCategoryRef ||
      quickInfo.length > 0,
  )

  return {hash: fingerprintHash(payload), usable, payload}
}

function insuranceCollectionId(hash: string): string {
  return sanitizeId(`migrated-insurance-collection.${hash}`)
}

function ctaCollectionId(hash: string): string {
  return sanitizeId(`migrated-cta-collection.${hash}`)
}

function clonePartners(partners: SectionRaw['partners']): unknown[] {
  if (!Array.isArray(partners)) return []
  return partners
    .filter((p) => p && (p.key || '').trim())
    .map((p, i) => ({
      _type: 'object',
      _key: p._key || `partner-${i}-${(p.key || '').trim()}`,
      key: (p.key || '').trim(),
      label: p.label,
    }))
}

function cloneQuickInfo(items: SectionRaw['quickInfoItems']): unknown[] | undefined {
  if (!Array.isArray(items)) return undefined
  const mapped = items
    .map((item, i) => {
      if (!item || !plain(item.text)) return null
      return {
        _type: 'object',
        _key: item._key || `qi-${i}`,
        icon: item.icon === 'shield' ? 'shield' : 'clock',
        text: item.text,
      }
    })
    .filter(Boolean)
  return mapped.length ? mapped : undefined
}

function buildInsuranceCollectionDoc(
  id: string,
  hash: string,
  source: SectionRaw,
  bandCount: number,
  isStandard: boolean,
): Record<string, unknown> {
  const internalName = isStandard
    ? 'Standard Insurance Partners'
    : 'Graviditet Insurance Partners'

  return {
    _id: id,
    _type: 'insuranceCollection',
    internalName,
    description:
      'Shared insurance partners pack. Auto-migrated from identical pageSectionInsurance bands. Eyebrow remains page-owned when set on the band.',
    title: source.title,
    // Collection owns reusable body; eyebrow stays page-level (not copied).
    partners: clonePartners(source.partners),
    sortOrder: isStandard ? 0 : 10,
    notes: [
      'migration: migrate-cta-insurance-collections.ts',
      `fingerprint: ${hash}`,
      `sourceBands: ${bandCount}`,
      'eyebrow: page-level override via dual-read',
      isStandard
        ? 'partners: Vertikal label = Vertikal'
        : 'partners: Vertikal label = Vertikal Helse (content differs from Standard)',
    ].join('\n'),
  }
}

function proposeCtaInternalName(section: SectionRaw, bandCount: number): string {
  const title = plain(section.title)
  const path = (section.primaryPath || '').trim()
  const catRef = section.bookingCategory?._ref || ''

  if (bandCount >= 5 && !catRef && (path === '/booking' || path === '')) {
    return 'Default Booking CTA'
  }
  if (catRef.includes('gynekologi')) return 'Gynekologi Booking CTA'
  if (catRef.includes('fertilitet')) return 'Fertilitet Booking CTA'
  if (catRef.includes('urologi')) return 'Urologi Booking CTA'
  if (catRef.includes('ortopedi')) return 'Ortopedi Booking CTA'
  if (catRef.includes('flere-fagomrader')) return 'Flere fagområder Booking CTA'
  if (catRef.includes('graviditet') && title.includes('neste steg')) {
    return 'Graviditet category Booking CTA'
  }
  if (catRef.includes('graviditet') && path.includes('fosterdiagnostikk')) {
    return 'Fosterdiagnostikk Booking CTA'
  }
  if (catRef.includes('graviditet')) return 'Graviditet treatments Booking CTA'
  if (path.includes('klinikk=bekkestua')) return 'Bekkestua clinic Booking CTA'
  if (path.includes('klinikk=moelv')) return 'Moelv clinic Booking CTA'
  if (path.includes('klinikk=moss')) return 'Moss clinic Booking CTA'
  if (path.includes('klinikk=ski')) return 'Ski clinic Booking CTA'
  if (title.toLowerCase().includes('prisliste') || title.includes('Ta vare')) {
    return 'Pricing Booking CTA'
  }
  if (title) return `Booking CTA — ${title.slice(0, 48)}`
  return `Booking CTA pack ${fingerprintHash(path || catRef).slice(0, 8)}`
}

function buildCtaCollectionDoc(
  id: string,
  hash: string,
  source: SectionRaw,
  bandCount: number,
): Record<string, unknown> {
  const doc: Record<string, unknown> = {
    _id: id,
    _type: 'ctaCollection',
    internalName: proposeCtaInternalName(source, bandCount),
    description: `Auto-migrated Booking CTA pack (${bandCount} page band(s)). Legacy inline fields left intact.`,
    title: source.title,
    subtitle: source.subtitle,
    primaryLabel: source.primaryLabel,
    primaryPath: source.primaryPath || '/booking',
    showSecondaryButton: source.showSecondaryButton !== false,
    secondaryLabel: source.secondaryLabel,
    secondaryPath: source.secondaryPath || undefined,
    sortOrder: 0,
    notes: [
      'migration: migrate-cta-insurance-collections.ts',
      `fingerprint: ${hash}`,
      `sourceBands: ${bandCount}`,
    ].join('\n'),
  }

  const qi = cloneQuickInfo(source.quickInfoItems)
  if (qi) doc.quickInfoItems = qi

  const catRef = source.bookingCategory?._ref
  if (catRef) {
    doc.bookingCategory = {_type: 'reference', _ref: catRef}
  }

  return doc
}

function assignRefOnSections(
  sections: SectionRaw[] | null | undefined,
  sectionKey: string,
  field: 'ctaCollection' | 'insuranceCollection',
  collectionId: string,
): {sections: SectionRaw[]; changed: boolean; skippedAlready: boolean} {
  if (!Array.isArray(sections)) {
    return {sections: [], changed: false, skippedAlready: false}
  }

  let changed = false
  let skippedAlready = false
  const next = sections.map((section) => {
    if (!section || section._key !== sectionKey) return section
    const existing = section[field]?._ref
    if (existing === collectionId) {
      skippedAlready = true
      return section
    }
    if (existing) {
      // Already linked to another collection — do not overwrite
      skippedAlready = true
      return section
    }
    changed = true
    return {
      ...section,
      [field]: {_type: 'reference', _ref: collectionId},
    }
  })

  return {sections: next, changed, skippedAlready}
}

async function patchPageSectionRef(opts: {
  pageId: string
  sectionKey: string
  field: 'ctaCollection' | 'insuranceCollection'
  collectionId: string
  report: Report
  kind: 'insurance' | 'cta'
  linkedKeys: Set<string>
}): Promise<'linked' | 'skipped' | 'error'> {
  const {pageId, sectionKey, field, collectionId, report, kind, linkedKeys} = opts
  const linkKey = `${pageId}::${sectionKey}::${field}`

  if (linkedKeys.has(linkKey)) {
    if (kind === 'insurance') report.insurance.skippedAlreadyLinked++
    else report.cta.skippedAlreadyLinked++
    return 'skipped'
  }

  const published = await client.fetch<PageHit | null>(
    `*[_id == $id][0]{ _id, _type, title, name, pageSections }`,
    {id: pageId},
  )
  if (!published) {
    report.errors.push(`missing page ${pageId}`)
    return 'error'
  }

  const pubResult = assignRefOnSections(
    published.pageSections,
    sectionKey,
    field,
    collectionId,
  )

  if (pubResult.skippedAlready && !pubResult.changed) {
    linkedKeys.add(linkKey)
    if (kind === 'insurance') report.insurance.skippedAlreadyLinked++
    else report.cta.skippedAlreadyLinked++
    return 'skipped'
  }

  if (!pubResult.changed) {
    report.errors.push(`${pageId} section ${sectionKey}: no matching section`)
    return 'error'
  }

  const draftId = `drafts.${pageId}`
  const draft = await client.fetch<PageHit | null>(
    `*[_id == $id][0]{ _id, pageSections }`,
    {id: draftId},
  )

  if (DRY_RUN) {
    linkedKeys.add(linkKey)
    report[kind].pagesLinked.push({
      pageId,
      pageType: published._type,
      label: pageLabel(published),
      collectionId,
      sectionKey,
    })
    if (draft) {
      report[kind].draftsSynced++
    }
    return 'linked'
  }

  const tx = client.transaction()
  tx.patch(pageId, (p) => p.set({pageSections: pubResult.sections}))

  if (draft) {
    const draftSections = Array.isArray(draft.pageSections)
      ? draft.pageSections.map((section) => {
          if (!section || section._key !== sectionKey) return section
          return {
            ...section,
            [field]: {_type: 'reference', _ref: collectionId},
          }
        })
      : pubResult.sections
    const hasKey = draftSections.some((s) => s?._key === sectionKey)
    tx.patch(draftId, (p) =>
      p.set({pageSections: hasKey ? draftSections : pubResult.sections}),
    )
    report[kind].draftsSynced++
  }

  await tx.commit({visibility: 'async'})
  linkedKeys.add(linkKey)

  report[kind].pagesLinked.push({
    pageId,
    pageType: published._type,
    label: pageLabel(published),
    collectionId,
    sectionKey,
  })
  return 'linked'
}

async function ensureCollection(
  doc: Record<string, unknown>,
  knownIds: Set<string>,
  created: string[],
  reused: string[],
): Promise<void> {
  const id = String(doc._id)
  if (knownIds.has(id)) {
    reused.push(id)
    return
  }

  const exists = await client.fetch<string | null>('*[_id == $id][0]._id', {id})
  if (exists) {
    knownIds.add(id)
    reused.push(id)
    return
  }

  if (DRY_RUN) {
    knownIds.add(id)
    created.push(id)
    return
  }

  await client.createIfNotExists(doc)
  knownIds.add(id)
  created.push(id)
}

async function verifyUsedOn(
  report: Report,
  insuranceExpected: Map<string, number>,
  ctaExpected: Map<string, number>,
): Promise<void> {
  const insuranceIds = [...insuranceExpected.keys()]
  const ctaIds = [...ctaExpected.keys()]

  const insuranceCounts =
    insuranceIds.length === 0
      ? []
      : await client.fetch<Array<{_id: string; count: number}>>(
          `*[_type == "insuranceCollection" && _id in $ids]{
            _id,
            "count": count(*[
              !(_id in path("drafts.**"))
              && references(^._id)
            ])
          }`,
          {ids: insuranceIds},
        )

  const ctaCounts =
    ctaIds.length === 0
      ? []
      : await client.fetch<Array<{_id: string; count: number}>>(
          `*[_type == "ctaCollection" && _id in $ids]{
            _id,
            "count": count(*[
              !(_id in path("drafts.**"))
              && references(^._id)
            ])
          }`,
          {ids: ctaIds},
        )

  report.usedOnVerification = {
    insurance: insuranceCounts.map((row) => ({
      collectionId: row._id,
      incomingCount: row.count,
      expected: insuranceExpected.get(row._id) || 0,
    })),
    cta: ctaCounts.map((row) => ({
      collectionId: row._id,
      incomingCount: row.count,
      expected: ctaExpected.get(row._id) || 0,
    })),
  }
}

async function repairDraftMismatches(report: Report): Promise<void> {
  const mismatches = await client.fetch<
    Array<{
      _id: string
      draftId: string
      pageSections: SectionRaw[]
      draftSections: SectionRaw[] | null
    }>
  >(
    `*[
      defined(pageSections)
      && !(_id in path("drafts.**"))
      && count(*[_id == ("drafts." + ^._id)]) > 0
    ]{
      _id,
      "draftId": "drafts." + _id,
      pageSections,
      "draftSections": *[_id == ("drafts." + ^._id)][0].pageSections
    }`,
  )

  for (const row of mismatches) {
    const draftSections = Array.isArray(row.draftSections) ? [...row.draftSections] : null
    if (!draftSections || !Array.isArray(row.pageSections)) continue

    let changed = false
    const next = draftSections.map((draftSec) => {
      if (!draftSec?._key) return draftSec
      const pub = row.pageSections.find((s) => s?._key === draftSec._key)
      if (!pub) return draftSec

      let section = draftSec
      if (
        pub.insuranceCollection?._ref &&
        pub.insuranceCollection._ref !== draftSec.insuranceCollection?._ref
      ) {
        section = {
          ...section,
          insuranceCollection: {
            _type: 'reference',
            _ref: pub.insuranceCollection._ref,
          },
        }
        changed = true
      }
      if (
        pub.ctaCollection?._ref &&
        pub.ctaCollection._ref !== draftSec.ctaCollection?._ref
      ) {
        section = {
          ...section,
          ctaCollection: {_type: 'reference', _ref: pub.ctaCollection._ref},
        }
        changed = true
      }
      return section
    })

    if (!changed) continue

    console.log(`  ✎  draft repair ${row.draftId}`)
    if (DRY_RUN) {
      report.insurance.draftsSynced++
      continue
    }
    try {
      await client.patch(row.draftId).set({pageSections: next}).commit({visibility: 'async'})
      report.insurance.draftsSynced++
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      report.errors.push(`draft repair ${row.draftId}: ${msg}`)
    }
  }
}

async function runPass(
  report: Report,
  knownIds: Set<string>,
  insuranceExpected: Map<string, number>,
  ctaExpected: Map<string, number>,
  linkedKeys: Set<string>,
  options?: {countEmpties?: boolean},
): Promise<{insuranceCreated: number; ctaCreated: number; links: number}> {
  const countEmpties = options?.countEmpties !== false
  const docs = await client.fetch<PageHit[]>(
    `*[defined(pageSections) && count(pageSections) > 0 && !(_id in path("drafts.**"))]{
      _id,
      _type,
      title,
      name,
      pageSections[]{
        ...,
        bookingCategory,
        ctaCollection,
        insuranceCollection
      }
    }`,
  )

  const insuranceClusters = new Map<string, Cluster>()
  const ctaClusters = new Map<string, Cluster>()

  for (const doc of docs) {
    for (const section of doc.pageSections || []) {
      if (section._type === 'pageSectionInsurance') {
        const fp = insuranceContentFingerprint(section)
        if (!fp.usable) {
          if (countEmpties) report.insurance.skippedEmpty++
          continue
        }
        const band: BandRef = {
          pageId: doc._id,
          pageType: doc._type,
          pageLabel: pageLabel(doc),
          sectionKey: section._key || '',
          section,
        }
        const existing = insuranceClusters.get(fp.hash)
        if (existing) existing.bands.push(band)
        else {
          insuranceClusters.set(fp.hash, {
            hash: fp.hash,
            bands: [band],
            source: section,
          })
        }
      }

      if (section._type === 'pageSectionBookingCta') {
        const fp = ctaContentFingerprint(section)
        if (!fp.usable) {
          if (countEmpties) report.cta.skippedEmpty++
          continue
        }
        const band: BandRef = {
          pageId: doc._id,
          pageType: doc._type,
          pageLabel: pageLabel(doc),
          sectionKey: section._key || '',
          section,
        }
        const existing = ctaClusters.get(fp.hash)
        if (existing) existing.bands.push(band)
        else {
          ctaClusters.set(fp.hash, {
            hash: fp.hash,
            bands: [band],
            source: section,
          })
        }
      }
    }
  }

  report.duplicateDetection = {
    insuranceFingerprints: insuranceClusters.size,
    ctaFingerprints: ctaClusters.size,
    insuranceBandsFingerprinted: [...insuranceClusters.values()].reduce(
      (n, c) => n + c.bands.length,
      0,
    ),
    ctaBandsFingerprinted: [...ctaClusters.values()].reduce(
      (n, c) => n + c.bands.length,
      0,
    ),
  }

  let insuranceCreated = 0
  let ctaCreated = 0
  let links = 0

  // --- Insurance (largest cluster first → "Standard") ---
  const insuranceSorted = [...insuranceClusters.values()].sort(
    (a, b) => b.bands.length - a.bands.length,
  )
  for (const [index, cluster] of insuranceSorted.entries()) {
    const id = insuranceCollectionId(cluster.hash)
    const before = report.insurance.collectionsCreated.length
    const doc = buildInsuranceCollectionDoc(
      id,
      cluster.hash,
      cluster.source,
      cluster.bands.length,
      index === 0,
    )
    await ensureCollection(
      doc,
      knownIds,
      report.insurance.collectionsCreated,
      report.insurance.collectionsReused,
    )
    if (report.insurance.collectionsCreated.length > before) insuranceCreated++
    insuranceExpected.set(id, cluster.bands.length)

    console.log(
      `\nInsurance ${doc.internalName} (${id}) — ${cluster.bands.length} band(s)`,
    )

    for (const band of cluster.bands) {
      if (!band.sectionKey) {
        report.errors.push(`${band.pageId}: insurance section missing _key`)
        continue
      }
      console.log(`  ✎  [${band.pageType}] ${band.pageLabel}`)
      const result = await patchPageSectionRef({
        pageId: band.pageId,
        sectionKey: band.sectionKey,
        field: 'insuranceCollection',
        collectionId: id,
        report,
        kind: 'insurance',
        linkedKeys,
      })
      if (result === 'linked') links++
    }
  }

  // --- CTA ---
  const ctaSorted = [...ctaClusters.values()].sort(
    (a, b) => b.bands.length - a.bands.length,
  )
  for (const cluster of ctaSorted) {
    const id = ctaCollectionId(cluster.hash)
    const before = report.cta.collectionsCreated.length
    await ensureCollection(
      buildCtaCollectionDoc(id, cluster.hash, cluster.source, cluster.bands.length),
      knownIds,
      report.cta.collectionsCreated,
      report.cta.collectionsReused,
    )
    if (report.cta.collectionsCreated.length > before) ctaCreated++
    ctaExpected.set(id, cluster.bands.length)

    const name = proposeCtaInternalName(cluster.source, cluster.bands.length)
    console.log(`\nCTA ${name} (${id}) — ${cluster.bands.length} band(s)`)

    for (const band of cluster.bands) {
      if (!band.sectionKey) {
        report.errors.push(`${band.pageId}: CTA section missing _key`)
        continue
      }
      console.log(`  ✎  [${band.pageType}] ${band.pageLabel}`)
      const result = await patchPageSectionRef({
        pageId: band.pageId,
        sectionKey: band.sectionKey,
        field: 'ctaCollection',
        collectionId: id,
        report,
        kind: 'cta',
        linkedKeys,
      })
      if (result === 'linked') links++
    }
  }

  return {insuranceCreated, ctaCreated, links}
}

async function main() {
  console.log('▶ Phase 4 — migrate Insurance + CTA collections')
  console.log(`  Dataset: ${DATASET}`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}`)
  console.log('  Legacy inline fields: untouched')
  console.log('  Empty CTA shells: skipped')
  console.log('  Insurance eyebrow: page-level override (not in fingerprint)\n')

  const report: Report = {
    dataset: DATASET,
    dryRun: DRY_RUN,
    startedAt: new Date().toISOString(),
    insurance: {
      collectionsCreated: [],
      collectionsReused: [],
      pagesLinked: [],
      skippedAlreadyLinked: 0,
      skippedEmpty: 0,
      draftsSynced: 0,
    },
    cta: {
      collectionsCreated: [],
      collectionsReused: [],
      pagesLinked: [],
      skippedAlreadyLinked: 0,
      skippedEmpty: 0,
      draftsSynced: 0,
    },
    duplicateDetection: {
      insuranceFingerprints: 0,
      ctaFingerprints: 0,
      insuranceBandsFingerprinted: 0,
      ctaBandsFingerprinted: 0,
    },
    errors: [],
  }

  const existingIds = await client.fetch<string[]>(
    `*[_type in ["insuranceCollection", "ctaCollection"] && (
      _id match "migrated-insurance-collection.*" ||
      _id match "migrated-cta-collection.*"
    )]._id`,
  )
  const knownIds = new Set(existingIds || [])
  const insuranceExpected = new Map<string, number>()
  const ctaExpected = new Map<string, number>()
  const linkedKeys = new Set<string>()

  const first = await runPass(
    report,
    knownIds,
    insuranceExpected,
    ctaExpected,
    linkedKeys,
    {countEmpties: true},
  )

  console.log('\n── Draft mismatch repair ──')
  await repairDraftMismatches(report)

  // Idempotency second pass (counts only — should create 0 / link 0)
  console.log('\n── Idempotency second pass ──')
  const secondReport: Report = {
    dataset: report.dataset,
    dryRun: DRY_RUN,
    startedAt: new Date().toISOString(),
    insurance: {
      collectionsCreated: [],
      collectionsReused: [],
      pagesLinked: [],
      skippedAlreadyLinked: 0,
      skippedEmpty: 0,
      draftsSynced: 0,
    },
    cta: {
      collectionsCreated: [],
      collectionsReused: [],
      pagesLinked: [],
      skippedAlreadyLinked: 0,
      skippedEmpty: 0,
      draftsSynced: 0,
    },
    duplicateDetection: {
      insuranceFingerprints: 0,
      ctaFingerprints: 0,
      insuranceBandsFingerprinted: 0,
      ctaBandsFingerprinted: 0,
    },
    errors: [],
  }
  const second = await runPass(
    secondReport,
    knownIds,
    new Map(),
    new Map(),
    linkedKeys,
    {countEmpties: false},
  )
  report.idempotency = {
    secondPassCollectionsCreated: second.insuranceCreated + second.ctaCreated,
    secondPassLinks: second.links,
  }

  if (!DRY_RUN) {
    await verifyUsedOn(report, insuranceExpected, ctaExpected)
  }

  report.finishedAt = new Date().toISOString()

  // Deduplicate created lists (second pass may have polluted — use first pass stats)
  // Actually second pass used separate arrays; first pass numbers are in report already
  // but second pass mutated report.duplicateDetection. Restore first pass detection:
  report.duplicateDetection = {
    insuranceFingerprints: insuranceExpected.size || report.duplicateDetection.insuranceFingerprints,
    ctaFingerprints: ctaExpected.size || report.duplicateDetection.ctaFingerprints,
    insuranceBandsFingerprinted: [...insuranceExpected.values()].reduce((a, b) => a + b, 0),
    ctaBandsFingerprinted: [...ctaExpected.values()].reduce((a, b) => a + b, 0),
  }

  const outJson = path.join(process.cwd(), '..', 'docs', 'PHASE_4_MIGRATION_REPORT.json')
  writeFileSync(outJson, JSON.stringify(report, null, 2), 'utf8')

  console.log('\n──────────────────────────────────────────')
  console.log(`Insurance collections created: ${report.insurance.collectionsCreated.length}`)
  console.log(`Insurance pages linked:        ${report.insurance.pagesLinked.length}`)
  console.log(`CTA collections created:       ${report.cta.collectionsCreated.length}`)
  console.log(`CTA pages linked:              ${report.cta.pagesLinked.length}`)
  console.log(`CTA empty skipped:             ${report.cta.skippedEmpty}`)
  console.log(`Drafts synced (ins+cta):       ${report.insurance.draftsSynced + report.cta.draftsSynced}`)
  console.log(
    `Idempotency 2nd pass:          created=${report.idempotency.secondPassCollectionsCreated} linked=${report.idempotency.secondPassLinks}`,
  )
  console.log(`Errors:                        ${report.errors.length}`)
  console.log(`Report: ${outJson}`)
  console.log('──────────────────────────────────────────')

  // Merge second-pass skip noise: first pass alreadyLinked counts got a second bump
  // Fix: subtract approximate — actually first pass already recorded links; second pass
  // incremented skippedAlreadyLinked on a separate object. Good.

  if (report.errors.length) {
    console.log('\nErrors:')
    for (const e of report.errors) console.log(`  - ${e}`)
  }

  console.log(
    `\n✅ ${DRY_RUN ? 'Dry run complete' : 'Migration complete'} (first pass created I:${first.insuranceCreated} C:${first.ctaCreated})`,
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
