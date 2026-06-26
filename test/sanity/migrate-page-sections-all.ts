/**
 * Seed specialists + booking CTA pageSections for pages that had hardcoded
 * BookingCTA / CTASection / Priser CTA section.
 *
 * Usage:
 *   cd test && npm run migrate:page-sections:dry
 *   cd test && npm run migrate:page-sections
 */
import { sanityClient } from './config'
import { patchSingletonFields } from './lib/patch-singleton'
import { SINGLETON_PAGE_BOOKING_CTA } from './data/page-booking-cta-copy'
import {
  buildBookingCtaSectionFromCopy,
  buildCategoryBookingCtaSection,
  buildCategorySpecialistsSection,
  buildHomepageBookingCtaSection,
  buildHomepageSpecialistsSection,
  hasSectionType,
  mergePageSections,
} from './lib/page-sections-migrate'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'
const ONLY = (process.env.ONLY || 'homepage,categories,singletons')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const HOMEPAGE_ID = 'homepage'

type CategoryRow = {
  _id: string
  categoryId?: string
  pageSections?: unknown[]
  landingPage?: {
    specialistsSection?: {
      title?: unknown
      seeAllLabel?: unknown
      seeAllHref?: string
    }
  }
}

async function migrateHomepage() {
  const homepage = await sanityClient.fetch<{ _id: string; pageSections?: unknown[] } | null>(
    `*[_id == $id][0]{ _id, pageSections }`,
    { id: HOMEPAGE_ID },
  )

  if (!homepage) {
    console.warn(`⚠  Homepage "${HOMEPAGE_ID}" not found — skipped`)
    return { updated: 0, skipped: 0 }
  }

  const { sections, changed } = mergePageSections(
    homepage.pageSections,
    [buildHomepageSpecialistsSection(), buildHomepageBookingCtaSection()],
    FORCE,
  )

  if (!changed) {
    console.log('⏭  Homepage already has specialists + booking CTA')
    return { updated: 0, skipped: 1 }
  }

  console.log('  ✎ homepage')
  if (!DRY_RUN) {
    await sanityClient.patch(homepage._id).set({ pageSections: sections }).commit()
  }
  return { updated: 1, skipped: 0 }
}

async function migrateCategories() {
  const categories = await sanityClient.fetch<CategoryRow[]>(
    `*[_type == "treatmentCategory" && !(_id in path("drafts.**"))]{
      _id, categoryId, pageSections,
      landingPage { specialistsSection { title, seeAllLabel, seeAllHref } }
    }`,
  )

  let updated = 0
  let skipped = 0

  for (const cat of categories) {
    const categoryId = cat.categoryId || ''
    const legacy = cat.landingPage?.specialistsSection
    const existing = Array.isArray(cat.pageSections) ? [...cat.pageSections] : []
    const patchSections = [...existing]
    let changed = false

    if (FORCE || !hasSectionType(patchSections, 'pageSectionSpecialists')) {
      patchSections.push(buildCategorySpecialistsSection(categoryId, cat._id, legacy))
      changed = true
    }

    if (FORCE || !hasSectionType(patchSections, 'pageSectionBookingCta')) {
      patchSections.push(buildCategoryBookingCtaSection(categoryId, cat._id))
      changed = true
    }

    if (!changed) {
      skipped++
      continue
    }

    console.log(`  ✎ treatmentCategory/${categoryId || cat._id}`)
    if (!DRY_RUN) {
      await sanityClient
        .patch(cat._id)
        .set({ pageSections: patchSections })
        .unset(['landingPage.specialistsSection'])
        .commit()
    }
    updated++
  }

  return { updated, skipped }
}

async function migrateSingletons() {
  let updated = 0
  let skipped = 0

  for (const [docId, copy] of Object.entries(SINGLETON_PAGE_BOOKING_CTA)) {
    const doc = await sanityClient.fetch<{ pageSections?: unknown[] } | null>(
      `*[_id == $id][0]{ pageSections }`,
      { id: docId },
    )

    const existing = Array.isArray(doc?.pageSections) ? doc.pageSections : []
    const { sections, changed } = mergePageSections(
      existing,
      [buildBookingCtaSectionFromCopy(`${docId}-booking-cta`, copy)],
      FORCE,
    )

    if (!changed) {
      skipped++
      continue
    }

    console.log(`  ✎ ${docId}`)
    if (!DRY_RUN) {
      await patchSingletonFields(docId, { pageSections: sections }, docId)
    }
    updated++
  }

  return { updated, skipped }
}

async function run() {
  console.log('▶ Migrate page sections (hardcoded pages only)')
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}`)
  console.log(`  Force overwrite: ${FORCE ? 'yes' : 'no'}`)
  console.log(`  Targets: ${ONLY.join(', ')}\n`)

  const totals = { updated: 0, skipped: 0 }

  if (ONLY.includes('homepage')) {
    console.log('── Homepage')
    const r = await migrateHomepage()
    totals.updated += r.updated
    totals.skipped += r.skipped
  }

  if (ONLY.includes('categories')) {
    console.log('\n── Treatment categories')
    const r = await migrateCategories()
    totals.updated += r.updated
    totals.skipped += r.skipped
  }

  if (ONLY.includes('singletons')) {
    console.log('\n── Singleton pages (had CTASection / BookingCTA)')
    const r = await migrateSingletons()
    totals.updated += r.updated
    totals.skipped += r.skipped
  }

  console.log('\n──────────────────────────────────────────')
  console.log(`✅ ${DRY_RUN ? 'Would update' : 'Updated'} documents: ${totals.updated}`)
  console.log(`⏭  Skipped (sections already present): ${totals.skipped}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
