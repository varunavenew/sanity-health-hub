/**
 * Developer-only cleanup: remove Review Collection documents and unset
 * reviewCollection refs on pages. Does NOT delete googleReview documents.
 *
 * Usage:
 *   cd test
 *   npm run migrate:cleanup-review-collections:dry
 *   npm run migrate:cleanup-review-collections
 */
import {sanityClient as client} from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

async function main() {
  console.log(`Review Collection cleanup — DRY_RUN=${DRY_RUN}`)

  const collectionIds = await client.fetch<string[]>(
    `*[_type == "reviewCollection"]._id`,
  )

  const pagesWithRef = await client.fetch<Array<{_id: string; _type: string}>>(
    `*[defined(reviewCollection)]{_id, _type}`,
  )

  console.log(`Found ${collectionIds.length} reviewCollection document(s)`)
  console.log(`Found ${pagesWithRef.length} document(s) with reviewCollection ref`)

  for (const doc of pagesWithRef) {
    if (DRY_RUN) {
      console.log(`[dry-run] unset reviewCollection on ${doc._type} ${doc._id}`)
      continue
    }
    await client.patch(doc._id).unset(['reviewCollection']).commit()
    console.log(`Unset reviewCollection on ${doc._id}`)
  }

  for (const id of collectionIds) {
    if (DRY_RUN) {
      console.log(`[dry-run] delete ${id}`)
      continue
    }
    await client.delete(id)
    console.log(`Deleted ${id}`)
  }

  console.log(
    JSON.stringify(
      {
        dryRun: DRY_RUN,
        collectionsDeleted: collectionIds.length,
        refsUnset: pagesWithRef.length,
        note: 'googleReview documents were NOT deleted',
      },
      null,
      2,
    ),
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
