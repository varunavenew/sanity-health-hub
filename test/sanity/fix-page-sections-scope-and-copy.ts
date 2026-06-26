/**
 * Align pageSections with hardcoded frontend scope and copy.
 * - Removes auto-seeded sections from pages that never had hardcoded CTAs
 * - Updates singleton booking CTAs with per-page copy (incl. Priser cta.* text)
 *
 * Usage:
 *   cd test && npm run fix:page-sections-scope:dry
 *   cd test && npm run fix:page-sections-scope
 */
import { sanityClient } from './config'
import { patchSingletonFields } from './lib/patch-singleton'
import {
  PAGE_SECTIONS_EXCLUDED_DOC_IDS,
  PAGE_SECTIONS_EXCLUDED_DOC_TYPES,
  SINGLETON_PAGE_BOOKING_CTA,
} from './data/page-booking-cta-copy'
import {
  buildBookingCtaSectionFromCopy,
  buildCategoryBookingCtaSection,
  hasSectionType,
} from './lib/page-sections-migrate'

const DRY_RUN = process.env.DRY_RUN === '1'

const AUTO_SECTION_TYPES = new Set(['pageSectionBookingCta', 'pageSectionSpecialists'])

function stripAutoSections(sections: unknown[] | undefined): unknown[] {
  if (!Array.isArray(sections)) return []
  return sections.filter((s) => !AUTO_SECTION_TYPES.has((s as { _type?: string })?._type || ''))
}

function upsertBookingCta(sections: unknown[], key: string, copy: (typeof SINGLETON_PAGE_BOOKING_CTA)[string]) {
  const without = stripAutoSections(sections).filter(
    (s) => (s as { _type?: string })?._type !== 'pageSectionBookingCta',
  )
  return [...without, buildBookingCtaSectionFromCopy(`${key}-booking-cta`, copy)]
}

async function cleanupExcludedDocuments() {
  const excluded = (await sanityClient.fetch<{ _id: string; _type: string; pageSections?: unknown[] }[]>(
    `*[
      (_id in $ids || _type in $types) &&
      defined(pageSections) &&
      count(pageSections) > 0
    ]{ _id, _type, pageSections }`,
    {
      ids: [
        ...Array.from(PAGE_SECTIONS_EXCLUDED_DOC_IDS),
        ...Array.from(PAGE_SECTIONS_EXCLUDED_DOC_IDS).map((id) => `drafts.${id}`),
      ],
      types: Array.from(PAGE_SECTIONS_EXCLUDED_DOC_TYPES),
    },
  )) ?? []

  let updated = 0
  for (const doc of excluded) {
    const baseId = doc._id.replace(/^drafts\./, '')
    if (!PAGE_SECTIONS_EXCLUDED_DOC_IDS.has(baseId) && !PAGE_SECTIONS_EXCLUDED_DOC_TYPES.has(doc._type)) {
      continue
    }

    const next = stripAutoSections(doc.pageSections)
    if (next.length === (doc.pageSections?.length ?? 0)) continue

    console.log(`  ✎ remove auto sections: ${doc._type}/${baseId}`)
    if (!DRY_RUN) {
      if (PAGE_SECTIONS_EXCLUDED_DOC_IDS.has(baseId)) {
        await patchSingletonFields(baseId, { pageSections: next }, doc._type)
      } else {
        await sanityClient.patch(doc._id).set({ pageSections: next }).commit()
      }
    }
    updated++
  }
  return updated
}

async function updateSingletonBookingCopy() {
  let updated = 0

  for (const [docId, copy] of Object.entries(SINGLETON_PAGE_BOOKING_CTA)) {
    const doc = await sanityClient.fetch<{ pageSections?: unknown[] } | null>(
      `*[_id == $id][0]{ pageSections }`,
      { id: docId },
    )

    const existing = Array.isArray(doc?.pageSections) ? doc.pageSections : []
    const next = upsertBookingCta(existing, docId, copy)

    const unchanged =
      hasSectionType(existing, 'pageSectionBookingCta') &&
      JSON.stringify(existing) === JSON.stringify(next)
    if (unchanged) continue

    console.log(`  ✎ booking copy: ${docId}`)
    if (!DRY_RUN) {
      await patchSingletonFields(docId, { pageSections: next }, docId)
    }
    updated++
  }

  return updated
}

async function updateCategoryBookingCopy() {
  const categories = await sanityClient.fetch<{ _id: string; categoryId?: string; pageSections?: unknown[] }[]>(
    `*[_type == "treatmentCategory" && !(_id in path("drafts.**"))]{ _id, categoryId, pageSections }`,
  )

  let updated = 0
  for (const cat of categories) {
    const categoryId = cat.categoryId || ''
    const existing = Array.isArray(cat.pageSections) ? cat.pageSections : []
    if (!hasSectionType(existing, 'pageSectionBookingCta')) continue

    const withoutBooking = existing.filter(
      (s) => (s as { _type?: string })?._type !== 'pageSectionBookingCta',
    )
    const next = [...withoutBooking, buildCategoryBookingCtaSection(categoryId, cat._id)]

    console.log(`  ✎ category booking copy: ${categoryId || cat._id}`)
    if (!DRY_RUN) {
      await sanityClient.patch(cat._id).set({ pageSections: next }).commit()
    }
    updated++
  }
  return updated
}

async function run() {
  console.log('▶ Fix page sections scope + per-page booking copy')
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  console.log('── Remove sections from pages without hardcoded CTAs')
  const removed = await cleanupExcludedDocuments()

  console.log('\n── Update singleton booking CTA copy')
  const copied = await updateSingletonBookingCopy()

  console.log('\n── Refresh category booking CTA copy')
  const categories = await updateCategoryBookingCopy()

  console.log('\n──────────────────────────────────────────')
  console.log(`✅ ${DRY_RUN ? 'Would clean' : 'Cleaned'} excluded docs: ${removed}`)
  console.log(`✅ ${DRY_RUN ? 'Would update' : 'Updated'} singleton copy: ${copied}`)
  console.log(`✅ ${DRY_RUN ? 'Would update' : 'Updated'} category booking copy: ${categories}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
