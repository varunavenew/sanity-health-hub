/**
 * Remove legacy top-level `*_en` fields from documents.
 * These were added by translate-all-content.ts before internationalizedArray fields.
 *
 * Run:
 *   cd test && npm run cleanup:legacy-en:dry
 *   cd test && npm run cleanup:legacy-en
 */
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

type DocRef = { _id: string; _type: string }

function legacyEnKeys(doc: Record<string, unknown>): string[] {
  return Object.keys(doc).filter((key) => {
    if (!key.endsWith('_en')) return false
    if (key.startsWith('_')) return false
    return true
  })
}

async function run() {
  const refs = await sanityClient.fetch<DocRef[]>(
    `*[!(_id in path("drafts.**"))]{ _id, _type }`,
  )

  console.log(`▶ Scanning ${refs.length} published documents for legacy *_en fields`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  let docCount = 0
  let keyCount = 0

  for (const ref of refs) {
    const doc = await sanityClient.getDocument(ref._id)
    if (!doc) continue

    const keys = legacyEnKeys(doc as Record<string, unknown>)
    if (!keys.length) continue

    docCount += 1
    keyCount += keys.length
    console.log(`  ✎ ${ref._type} ${ref._id} — unset ${keys.length}: ${keys.join(', ')}`)

    if (!DRY_RUN) {
      await sanityClient.patch(ref._id).unset(keys).commit()
    }
  }

  console.log(
    `\n✅ ${DRY_RUN ? 'Would remove' : 'Removed'} ${keyCount} legacy keys across ${docCount} documents`,
  )
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
