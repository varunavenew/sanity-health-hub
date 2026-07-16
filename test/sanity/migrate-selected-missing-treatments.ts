/**
 * Migrate a fixed list of treatment pages from src/data/treatmentContent.ts
 * into Sanity, using the v5 internationalized-array shape (with `language`
 * field) and the new `treatment` schema (heroTitle, heroDescription,
 * reasons, flow, expertAreas, promises, faqs, etc.).
 *
 * OVERRIDE semantics: uses `createOrReplace`, so existing docs with the
 * same `_id` are fully replaced.
 *
 * Run:
 *   SANITY_TOKEN=<token> bun run test/sanity/migrate-selected-missing-treatments.ts
 *   DRY_RUN=1 SANITY_TOKEN=<token> bun run test/sanity/migrate-selected-missing-treatments.ts
 */

import { randomUUID } from 'node:crypto'
import { sanityClient } from './config'
import { treatmentContent } from '../../src/data/treatmentContent'

const DRY_RUN = process.env.DRY_RUN === '1'

/* ── target keys (categoryId/subId) ─────────────────────────────────── */

const TARGET_KEYS = [
  'gynekologi/fodselsskader',
  'gynekologi/fostermedisin',
  'gynekologi/pmos',
  'fertilitet/assistert-befruktning-for-par-og-single',
  'flere-fagomrader/hudbehandlinger',
  'flere-fagomrader/hudbehandlinger/pigmentforandringer-og-solskader',
  'flere-fagomrader/hudbehandlinger/rodhet-og-synlige-blodkar',
  'flere-fagomrader/hudbehandlinger/forbedring-av-hudstruktur',
  'flere-fagomrader/hudbehandlinger/kosmetisk-dermatologi',
  'flere-fagomrader/hudbehandlinger/elastisitet-og-volum',
  'flere-fagomrader/hudbehandlinger/foflekksjekk',
  'flere-fagomrader/behandlingsutstyr',
  'flere-fagomrader/hudpleieprodukter',
  'flere-fagomrader/gastrokirurgi/brokkoperasjon',
  'flere-fagomrader/gastrokirurgi/hemorroider-og-endetarmsplager',
]

const k = () => randomUUID().replace(/-/g, '').slice(0, 12)

/* ── i18n helpers (v5 shape with `language`) ────────────────────────── */

const i18nStr = (no: string) =>
  no
    ? [{ _key: 'no', _type: 'internationalizedArrayStringValue', language: 'no', value: no }]
    : undefined

const i18nText = (no: string) =>
  no
    ? [{ _key: 'no', _type: 'internationalizedArrayTextValue', language: 'no', value: no }]
    : undefined

const i18nSlug = (noSlug: string) => [
  {
    _key: 'no',
    _type: 'internationalizedArraySlugValue',
    language: 'no',
    value: { _type: 'slug', current: noSlug },
  },
  {
    _key: 'en',
    _type: 'internationalizedArraySlugValue',
    language: 'en',
    value: { _type: 'slug', current: '' },
  },
]

const CATEGORY_LABELS: Record<string, string> = {
  gynekologi: 'Gynekologi',
  fertilitet: 'Fertilitet',
  urologi: 'Urologi',
  ortopedi: 'Ortopedi',
  graviditet: 'Graviditet',
  'flere-fagomrader': 'Flere fagområder',
}

const catDocId = (categoryId: string) => `category-${categoryId}`
const treatmentDocId = (categoryId: string, subId: string) =>
  `treatment.${categoryId}.${subId.replace(/\//g, '-')}`
const slugLeaf = (subId: string) => subId.split('/').filter(Boolean).slice(-1)[0]

const firstParagraph = (text: string) =>
  (text || '').split(/\n\s*\n/)[0]?.trim() || ''

const truncate = (s: string, max: number) => {
  const t = (s || '').replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return t.slice(0, max - 1).trimEnd() + '…'
}

/* ── Build doc payload from TreatmentData ───────────────────────────── */

function buildDoc(categoryId: string, subId: string, data: any) {
  const parentLabel = data.parentCategory || CATEGORY_LABELS[categoryId] || categoryId
  const heroDesc = data.subtitle?.trim() || firstParagraph(data.description)

  const doc: Record<string, any> = {
    _id: treatmentDocId(categoryId, subId),
    _type: 'treatment',
    title: i18nStr(data.title),
    slug: i18nSlug(slugLeaf(subId)),
    category: { _type: 'reference', _ref: catDocId(categoryId) },
    parentCategoryLabel: i18nStr(parentLabel),
    description: i18nText(data.description),
    // Hero
    heroTitle: i18nStr(data.title),
    heroDescription: i18nText(heroDesc),
    homeBreadcrumbLabel: i18nStr('Hjem'),
  }

  // FAQs (inline objects — schema supports both refs and inline)
  if (Array.isArray(data.faqs) && data.faqs.length) {
    doc.faqs = data.faqs.map((f: any) => ({
      _key: k(),
      _type: 'object',
      question: i18nStr(f.question),
      answer: i18nText(f.answer),
    }))
  }

  // Reasons ← sections
  if (Array.isArray(data.sections) && data.sections.length) {
    doc.reasons = data.sections.map((s: any, i: number) => ({
      _key: k(),
      n: i18nStr(String(i + 1).padStart(2, '0')),
      title: i18nStr(s.heading),
      desc: i18nText(s.content),
    }))
  }

  // Flow ← process
  if (Array.isArray(data.process) && data.process.length) {
    doc.flow = data.process.map((p: any, i: number) => ({
      _key: k(),
      n: i18nStr(String(i + 1).padStart(2, '0')),
      title: i18nStr(p.title),
      desc: i18nText(p.description),
    }))
  }

  // Expert areas ← linkedServices
  if (Array.isArray(data.linkedServices) && data.linkedServices.length) {
    doc.expertAreas = {
      title: i18nStr(data.relatedTitleOverride || 'Relaterte tjenester'),
      description: data.relatedLead ? i18nText(data.relatedLead) : undefined,
      items: data.linkedServices.map((l: any) => ({
        _key: k(),
        title: i18nStr(l.label),
        desc: l.description ? i18nText(l.description) : undefined,
        path: l.path,
      })),
    }
  }

  // SEO (meta-title ≤60, meta-description ≤160)
  doc.seo = {
    _type: 'seo',
    metaTitle: i18nStr(truncate(data.title, 60)),
    metaDescription: i18nText(truncate(heroDesc || data.description || '', 160)),
    noIndex: false,
  }

  return doc
}

/* ── Run ────────────────────────────────────────────────────────────── */

async function main() {
  console.log(`\n[migrate-selected] ${TARGET_KEYS.length} keys — mode=${DRY_RUN ? 'DRY_RUN' : 'WRITE (override)'}\n`)

  const tx = sanityClient.transaction()
  let queued = 0
  const missing: string[] = []

  for (const key of TARGET_KEYS) {
    const data = (treatmentContent as any)[key]
    if (!data) {
      missing.push(key)
      console.log(`  ⚠  ${key}  (not found in treatmentContent — SKIPPED)`)
      continue
    }
    const [categoryId, ...rest] = key.split('/')
    const subId = rest.join('/')
    const doc = buildDoc(categoryId, subId, data)
    console.log(`  ⇢  ${key}  → createOrReplace ${doc._id}`)
    if (!DRY_RUN) tx.createOrReplace(doc as any)
    queued++
  }

  console.log(`\nSummary: ${queued} queued, ${missing.length} missing from treatmentContent.`)

  if (DRY_RUN) {
    console.log('\n(dry run — no writes)\n')
    return
  }
  if (queued === 0) return

  const res = await tx.commit({ visibility: 'async' })
  console.log(`\n✅ Committed ${res.results.length} mutations.\n`)
}

main().catch((e) => {
  console.error('❌ Migration failed:', e)
  process.exit(1)
})
