/**
 * Populate treatment.categories from legacy treatment.category.
 *
 * DEPRECATED — do not run. `treatment.categories` is not in the schema
 * (singular `category` is the source of truth). Orphan `categories` arrays
 * are removed by `repair-unknown-fields.ts`. Keeping this file for history.
 *
 * Idempotent: only patches docs that have a legacy category ref and either
 * missing categories or an empty categories array. Does not change other fields.
 * Does not remove or overwrite existing non-empty categories[].
 *
 * Copy rule: category → categories[0] (same _ref).
 *
 * Run (developer):
 *   cd test && DRY_RUN=1 npx tsx sanity/migrate-treatment-categories.ts
 *   cd test && npx tsx sanity/migrate-treatment-categories.ts
 *
 * Run (production — explicit only):
 *   cd test && SANITY_DATASET=production ALLOW_PRODUCTION_MIGRATION=true DRY_RUN=1 npx tsx sanity/migrate-treatment-categories.ts
 *   cd test && SANITY_DATASET=production ALLOW_PRODUCTION_MIGRATION=true npx tsx sanity/migrate-treatment-categories.ts
 */
import { sanityClient } from './config'
import { DATASET } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

type Ref = {_type: 'reference'; _ref: string; _key?: string}
type TreatmentRow = {
  _id: string
  category?: {_ref?: string} | null
  categories?: {_ref?: string}[] | null
}

function needsCategories(doc: TreatmentRow): Ref | null {
  const legacyRef = doc.category?._ref
  if (!legacyRef) return null

  const existing = Array.isArray(doc.categories)
    ? doc.categories.filter((c) => Boolean(c?._ref))
    : []
  if (existing.length > 0) return null

  return {_type: 'reference', _ref: legacyRef}
}

async function run() {
  console.log(`\nTreatment categories migration → dataset: ${DATASET}`)
  console.log(`Mode: ${DRY_RUN ? 'DRY_RUN (no writes)' : 'WRITE'}\n`)

  const docs = await sanityClient.fetch<TreatmentRow[]>(
    `*[_type == "treatment"]{ _id, category, categories } | order(_id asc)`,
  )

  let wouldUpdate = 0
  let skipped = 0

  for (const doc of docs) {
    const next = needsCategories(doc)
    if (!next) {
      skipped++
      continue
    }

    wouldUpdate++
    console.log(`  ✎ ${doc._id} — category → categories[0] (${next._ref})`)

    if (!DRY_RUN) {
      await sanityClient
        .patch(doc._id)
        .set({categories: [next]})
        .commit({autoGenerateArrayKeys: true})
    }
  }

  console.log(
    `\n✓ ${DRY_RUN ? 'Would update' : 'Updated'} ${wouldUpdate} treatment(s); skipped ${skipped} (already has categories or no legacy category) on ${DATASET}`,
  )
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
