/**
 * Migrate missing treatments from src/data/treatmentContent.ts into Sanity.
 *
 * Behaviour:
 *   • Reads every entry in `treatmentContent` (key = "<categoryId>/<subId>").
 *   • For each entry, checks whether a `treatment` document already exists in
 *     Sanity — matched by category slug + treatment slug (order-independent
 *     against `_id`). If yes → SKIPPED (never overwritten).
 *   • If missing, creates it with the full v5 i18n payload (Norwegian values,
 *     English left empty for later translation). Fields written:
 *       title, slug, category (ref), parentCategoryLabel, subtitle,
 *       description, benefitsTitle, benefits, process, faqs, sections,
 *       linkedServices, sortOrder
 *   • `heroImage` is intentionally NOT set (image assets need a separate
 *     upload pass — see other upload-*.ts scripts).
 *   • Uses deterministic `_id` = `treatment.<categoryId>.<subIdWithDashes>`
 *     to match the existing `seed-treatments.ts` convention.
 *
 * Modes:
 *   DRY_RUN=1  → show what would be created, no writes
 *   FORCE=1    → recreate missing content on existing docs (patch-set fields
 *                that are currently empty; existing values are still kept)
 *
 * Run:
 *   SANITY_TOKEN=<token> bun run test/sanity/migrate-missing-treatments.ts
 */

import { randomUUID } from 'node:crypto'
import { sanityClient } from './config'
import { treatmentContent } from '../../src/data/treatmentContent'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'

const k = () => randomUUID().replace(/-/g, '').slice(0, 12)

/* ── i18n helpers (v5 internationalizedArray shape) ─────────────────── */

const i18nStr = (no: string) =>
  no
    ? [{ _key: 'no', _type: 'internationalizedArrayStringValue', value: no }]
    : undefined

const i18nText = (no: string) =>
  no
    ? [{ _key: 'no', _type: 'internationalizedArrayTextValue', value: no }]
    : undefined

const CATEGORY_LABELS: Record<string, string> = {
  gynekologi: 'Gynekologi',
  fertilitet: 'Fertilitet',
  urologi: 'Urologi',
  ortopedi: 'Ortopedi',
  graviditet: 'Graviditet',
  'flere-fagomrader': 'Flere fagområder',
}

const catDocId = (categoryId: string) => `treatmentCategory.${categoryId}`
const treatmentDocId = (categoryId: string, subId: string) =>
  `treatment.${categoryId}.${subId.replace(/\//g, '-')}`
const slugLeaf = (subId: string) => subId.split('/').filter(Boolean).slice(-1)[0]

/* ── Build doc payload from TreatmentData ───────────────────────────── */

function buildDoc(categoryId: string, subId: string, data: any) {
  const doc: Record<string, any> = {
    _id: treatmentDocId(categoryId, subId),
    _type: 'treatment',
    title: i18nStr(data.title),
    slug: { _type: 'slug', current: slugLeaf(subId) },
    category: { _type: 'reference', _ref: catDocId(categoryId) },
    parentCategoryLabel: i18nStr(data.parentCategory || CATEGORY_LABELS[categoryId] || categoryId),
  }

  if (data.subtitle) doc.subtitle = i18nStr(data.subtitle)
  if (data.description) doc.description = i18nText(data.description)

  if (data.benefitsTitle) doc.benefitsTitle = i18nStr(data.benefitsTitle)
  if (Array.isArray(data.benefits) && data.benefits.length) {
    doc.benefits = data.benefits.map((b: string) => i18nStr(b))
  }

  if (Array.isArray(data.process) && data.process.length) {
    doc.process = data.process.map((p: any) => ({
      _key: k(),
      title: i18nStr(p.title),
      description: i18nText(p.description),
    }))
  }

  if (Array.isArray(data.faqs) && data.faqs.length) {
    doc.faqs = data.faqs.map((f: any) => ({
      _key: k(),
      question: i18nStr(f.question),
      answer: i18nText(f.answer),
    }))
  }

  if (Array.isArray(data.sections) && data.sections.length) {
    doc.sections = data.sections.map((s: any) => ({
      _key: k(),
      id: s.id || undefined,
      heading: i18nStr(s.heading),
      content: i18nText(s.content),
    }))
  }

  if (Array.isArray(data.linkedServices) && data.linkedServices.length) {
    doc.linkedServices = data.linkedServices.map((l: any) => ({
      _key: k(),
      label: i18nStr(l.label),
      description: l.description ? i18nText(l.description) : undefined,
      path: l.path,
    }))
  }

  return doc
}

/* ── Run ────────────────────────────────────────────────────────────── */

async function main() {
  const entries = Object.entries(treatmentContent)
  console.log(`\n[missing-treatments] scanning ${entries.length} content keys…\n`)

  // Fetch all existing treatments (id + category slug + slug) for match check.
  const existing: Array<{ _id: string; slug?: string; catSlug?: string }> =
    await sanityClient.fetch(
      `*[_type == "treatment"]{ _id, "slug": slug.current, "catSlug": category->slug.current }`,
    )

  const existsBySlug = new Set(
    existing
      .filter((d) => d.catSlug && d.slug)
      .map((d) => `${d.catSlug}/${d.slug}`),
  )
  const existsById = new Set(existing.map((d) => d._id))

  let created = 0
  let skipped = 0
  let patched = 0

  const tx = sanityClient.transaction()

  for (const [key, data] of entries) {
    const [categoryId, ...rest] = key.split('/')
    const subId = rest.join('/')
    if (!subId) continue

    const leaf = slugLeaf(subId)
    const bySlugKey = `${categoryId}/${leaf}`
    const detId = treatmentDocId(categoryId, subId)

    const alreadyExists = existsById.has(detId) || existsBySlug.has(bySlugKey)

    if (alreadyExists && !FORCE) {
      skipped++
      console.log(`  ⏭  ${key}  (exists)`)
      continue
    }

    const doc = buildDoc(categoryId, subId, data)

    if (alreadyExists && FORCE) {
      // Only fill missing fields on existing doc — never overwrite.
      const setIfMissing: Record<string, any> = {}
      for (const [f, v] of Object.entries(doc)) {
        if (f.startsWith('_') || f === 'slug' || f === 'category') continue
        if (v === undefined) continue
        setIfMissing[f] = v
      }
      // Match by whichever id the existing doc actually has.
      const existingDoc = existing.find(
        (d) => d._id === detId || `${d.catSlug}/${d.slug}` === bySlugKey,
      )!
      console.log(`  ✎  ${key}  (setIfMissing on ${existingDoc._id})`)
      if (!DRY_RUN) {
        tx.patch(existingDoc._id, (p) => p.setIfMissing(setIfMissing))
      }
      patched++
      continue
    }

    console.log(`  ✦  ${key}  → create ${detId}`)
    if (!DRY_RUN) tx.createIfNotExists(doc as any)
    created++
  }

  console.log(
    `\nSummary: ${created} to create, ${patched} to patch (FORCE), ${skipped} skipped.`,
  )

  if (DRY_RUN) {
    console.log('\n(dry run — no writes)\n')
    return
  }

  if (created === 0 && patched === 0) {
    console.log('\n✅ Nothing to do.\n')
    return
  }

  const res = await tx.commit({ visibility: 'async' })
  console.log(`\n✅ Committed ${res.results.length} mutations.\n`)
}

main().catch((e) => {
  console.error('❌ Migration failed:', e)
  process.exit(1)
})
