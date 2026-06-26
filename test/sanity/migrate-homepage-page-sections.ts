/**
 * Ensure homepage has specialists + booking CTA modular sections.
 *
 * Usage:
 *   cd test && npm run migrate:homepage-page-sections:dry
 *   cd test && npm run migrate:homepage-page-sections
 */
import { sanityClient } from './config'
import {
  buildHomepageBookingCtaSection,
  buildHomepageSpecialistsSection,
  mergePageSections,
} from './lib/page-sections-migrate'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'
const HOMEPAGE_ID = 'homepage'

async function run() {
  const homepage = await sanityClient.fetch<{ _id: string; pageSections?: unknown[] } | null>(
    `*[_id == $id][0]{ _id, pageSections }`,
    { id: HOMEPAGE_ID },
  )

  if (!homepage) {
    console.error(`Homepage document "${HOMEPAGE_ID}" not found`)
    process.exit(1)
  }

  console.log('▶ Migrate homepage modular sections')
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}`)
  console.log(`  Force overwrite: ${FORCE ? 'yes' : 'no'}\n`)

  const { sections, changed } = mergePageSections(
    homepage.pageSections,
    [buildHomepageSpecialistsSection(), buildHomepageBookingCtaSection()],
    FORCE,
  )

  if (!changed) {
    console.log('⏭  Homepage already has specialists + booking CTA sections')
    return
  }

  console.log('  ✎ homepage')
  if (!DRY_RUN) {
    await sanityClient.patch(homepage._id).set({ pageSections: sections }).commit()
  }

  console.log(`\n✅ ${DRY_RUN ? 'Would update' : 'Updated'} homepage pageSections`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
