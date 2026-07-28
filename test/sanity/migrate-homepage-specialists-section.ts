/**
 * Phase 3.2 — Seed homepage `specialistsSection` with defaults that preserve current behaviour.
 *
 * Defaults: displayMode=all, layout=carousel, no maxItems (show all), no CMS copy (i18n fallback).
 *
 * Usage:
 *   cd test
 *   DRY_RUN=1 npx tsx sanity/migrate-homepage-specialists-section.ts
 *   npx tsx sanity/migrate-homepage-specialists-section.ts
 */
import {sanityClient as client} from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

const DEFAULT_SPECIALISTS_SECTION = {
  displayMode: 'all',
  layout: 'carousel',
  randomizeOrder: false,
}

type HomepageDoc = {
  _id: string
  specialistsSection?: Record<string, unknown> | null
}

function hasSpecialistsSection(doc: HomepageDoc): boolean {
  const section = doc.specialistsSection
  if (!section || typeof section !== 'object') return false
  return Object.keys(section).length > 0
}

async function main() {
  console.log(`Homepage Specialists section migration — DRY_RUN=${DRY_RUN}`)
  const docs = await client.fetch<HomepageDoc[]>(
    `*[_type == "homepage"]{_id, specialistsSection}`,
  )

  let migrated = 0
  for (const doc of docs) {
    if (hasSpecialistsSection(doc)) {
      console.log(`skip ${doc._id}: specialistsSection already set`)
      continue
    }

    if (DRY_RUN) {
      console.log(`[dry-run] ${doc._id}: set specialistsSection defaults`)
      migrated += 1
      continue
    }

    await client
      .patch(doc._id)
      .set({specialistsSection: DEFAULT_SPECIALISTS_SECTION})
      .commit({autoGenerateArrayKeys: true})
    console.log(`migrated ${doc._id}`)
    migrated += 1
  }

  console.log(JSON.stringify({dryRun: DRY_RUN, migrated}, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
