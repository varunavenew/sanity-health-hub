/**
 * Add missing `_key` on internationalizedArraySlug entries (API migrations omit them).
 *
 * Run:
 *   cd test && DRY_RUN=1 npx tsx sanity/fix-slug-keys.ts
 *   npx tsx sanity/fix-slug-keys.ts
 */
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

const TYPES = [
  'article',
  'clinicPage',
  'treatmentCategory',
  'treatment',
  'specialist',
  'themePage',
  'jobListing',
  'product',
  'privacyPolicyPage',
]

function isI18nSlugArray(val: unknown): val is Record<string, unknown>[] {
  return (
    Array.isArray(val) &&
    val.length > 0 &&
    typeof val[0] === 'object' &&
    val[0] !== null &&
    String((val[0] as { _type?: string })._type).startsWith('internationalizedArraySlug')
  )
}

function needsKeys(slug: Record<string, unknown>[]): boolean {
  return slug.some((entry) => entry && typeof entry === 'object' && !entry._key)
}

async function run() {
  console.log('▶ Add missing _key on internationalizedArraySlug')
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  let fixed = 0

  for (const type of TYPES) {
    const docs = await sanityClient.fetch<{ _id: string; slug?: unknown }[]>(
      `*[_type == "${type}" && defined(slug)]{ _id, slug }`,
    )

    for (const doc of docs) {
      const slug = doc.slug
      if (!isI18nSlugArray(slug) || !needsKeys(slug)) continue

      console.log(`  ✎ ${doc._id}`)
      if (!DRY_RUN) {
        await sanityClient.patch(doc._id).set({ slug }).commit({ autoGenerateArrayKeys: true })
      }
      fixed++
    }
  }

  console.log(`\n✓ ${DRY_RUN ? 'Would fix' : 'Fixed'} ${fixed} document(s)`)
}

run().catch((e) => {
  console.error('✗ Failed:', e)
  process.exit(1)
})
