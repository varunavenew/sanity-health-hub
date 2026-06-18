/**
 * Remove deprecated icon + color fields from treatmentCategory documents.
 *
 * Usage:
 *   cd test && npm run cleanup:category-icon-color:dry
 *   cd test && npm run cleanup:category-icon-color
 */
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

async function run() {
  const categories = await sanityClient.fetch<{ _id: string; categoryId?: string }[]>(
    `*[_type == "treatmentCategory" && !(_id in path("drafts.**"))]{ _id, categoryId }`,
  )

  console.log(`▶ Remove icon/color from ${categories.length} categories`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  for (const cat of categories) {
    console.log(`  ✎ ${cat.categoryId ?? cat._id}`)
    if (!DRY_RUN) {
      await sanityClient.patch(cat._id).unset(['icon', 'color']).commit()
    }
  }

  console.log(`\n✅ ${DRY_RUN ? 'Would clean' : 'Cleaned'} ${categories.length} documents`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
