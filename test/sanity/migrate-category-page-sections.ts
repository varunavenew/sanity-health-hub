/**
 * Move landing specialists + booking CTA into pageSections on treatmentCategory.
 *
 * Usage:
 *   cd test && npm run migrate:category-page-sections:dry
 *   cd test && npm run migrate:category-page-sections
 */
import { sanityClient } from './config'
import {
  buildCategoryBookingCtaSection,
  buildCategorySpecialistsSection,
  hasSectionType,
} from './lib/page-sections-migrate'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'

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

async function run() {
  const categories = await sanityClient.fetch<CategoryRow[]>(
    `*[_type == "treatmentCategory" && !(_id in path("drafts.**"))]{
      _id, categoryId, pageSections,
      landingPage { specialistsSection { title, seeAllLabel, seeAllHref } }
    }`,
  )

  console.log(`▶ Migrate category page sections (${categories.length} categories)`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}`)
  console.log(`  Force overwrite: ${FORCE ? 'yes' : 'no'}\n`)

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

    console.log(`  ✎ ${categoryId || cat._id}`)
    if (!DRY_RUN) {
      await sanityClient
        .patch(cat._id)
        .set({ pageSections: patchSections })
        .unset(['landingPage.specialistsSection'])
        .commit()
    }
    updated++
  }

  console.log('\n──────────────────────────────────────────')
  console.log(`✅ ${DRY_RUN ? 'Would update' : 'Updated'} categories: ${updated}`)
  console.log(`⏭  Skipped (sections already present): ${skipped}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
