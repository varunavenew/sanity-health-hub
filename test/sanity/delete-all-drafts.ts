/**
 * Delete all draft documents to reduce dataset attribute path count.
 *
 * Run:
 *   cd test && npx cross-env DRY_RUN=1 tsx sanity/delete-all-drafts.ts
 *   cd test && npx tsx sanity/delete-all-drafts.ts
 */
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

async function run() {
  const ids = await sanityClient.fetch<string[]>(`*[_id in path("drafts.**")]._id`)
  console.log(`▶ Found ${ids.length} draft documents`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  for (const id of ids) {
    console.log(`  🗑 ${id}`)
    if (!DRY_RUN) {
      await sanityClient.delete(id)
    }
  }

  console.log(`\n✅ ${DRY_RUN ? 'Would delete' : 'Deleted'} ${ids.length} drafts`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
