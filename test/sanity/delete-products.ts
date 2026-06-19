/**
 * Delete product documents to reduce dataset attribute path count.
 * Products are optional catalog items; site falls back to mockData.
 *
 * Run:
 *   cd test && npx cross-env DRY_RUN=1 tsx sanity/delete-products.ts
 *   cd test && npx tsx sanity/delete-products.ts
 */
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

async function run() {
  const ids = await sanityClient.fetch<string[]>(
    `*[_type == "product" && !(_id in path("drafts.**"))]._id`,
  )
  console.log(`▶ Found ${ids.length} product documents`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  for (const id of ids) {
    console.log(`  🗑 ${id}`)
    if (!DRY_RUN) await sanityClient.delete(id)
  }

  console.log(`\n✅ ${DRY_RUN ? 'Would delete' : 'Deleted'} ${ids.length} products`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
