/**
 * Phase 3 — Promote homepage Booking CTA out of Website bands into bookingCta.
 *
 * Copies pageSections[pageSectionBookingCta] → homepage.bookingCta.
 * Leaves pageSections untouched (legacy dual-read).
 *
 * Usage:
 *   cd test
 *   DRY_RUN=1 npx tsx sanity/migrate-homepage-booking-cta.ts
 *   npx tsx sanity/migrate-homepage-booking-cta.ts
 */
import {sanityClient as client} from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

type HomepageDoc = {
  _id: string
  bookingCta?: Record<string, unknown> | null
  pageSections?: Array<Record<string, unknown>> | null
}

async function main() {
  console.log(`Homepage Booking CTA migration — DRY_RUN=${DRY_RUN}`)
  const docs = await client.fetch<HomepageDoc[]>(
    `*[_type == "homepage"]{_id, bookingCta, pageSections}`,
  )

  let migrated = 0
  for (const doc of docs) {
    if (doc.bookingCta && Object.keys(doc.bookingCta).length > 0) {
      console.log(`skip ${doc._id}: bookingCta already set`)
      continue
    }
    const band = (doc.pageSections || []).find(
      (s) => s?._type === 'pageSectionBookingCta',
    )
    if (!band) {
      console.log(`skip ${doc._id}: no Booking CTA band`)
      continue
    }
    const next = {...band}
    delete next._key
    if (DRY_RUN) {
      console.log(`[dry-run] ${doc._id}: copy booking CTA band → bookingCta`)
      migrated += 1
      continue
    }
    await client.patch(doc._id).set({bookingCta: next}).commit({autoGenerateArrayKeys: true})
    console.log(`migrated ${doc._id}`)
    migrated += 1
  }

  console.log(JSON.stringify({dryRun: DRY_RUN, migrated}, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
