/**
 * Fix common article publish blockers:
 * - missing publishedAt (required in schema)
 * - SEO i18n entries with language but no value (invalid empty shells)
 *
 * Run:
 *   cd test && DRY_RUN=1 npx tsx sanity/fix-article-validation.ts
 *   npx tsx sanity/fix-article-validation.ts
 */
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

function cleanI18nArray(arr: unknown): unknown[] | undefined {
  if (!Array.isArray(arr)) return undefined
  const cleaned = arr.filter((entry) => {
    if (!entry || typeof entry !== 'object') return false
    const v = (entry as { value?: unknown }).value
    if (v === undefined || v === null) return false
    if (typeof v === 'string' && !v.trim()) return false
    return true
  })
  return cleaned
}

function cleanSeo(seo: Record<string, unknown> | null | undefined) {
  if (!seo || typeof seo !== 'object') return undefined

  const next: Record<string, unknown> = { _type: seo._type ?? 'seo' }
  let changed = false

  for (const key of ['metaTitle', 'metaDescription'] as const) {
    const original = seo[key]
    const cleaned = cleanI18nArray(original) ?? []
    if (cleaned.length > 0) next[key] = cleaned
    if (JSON.stringify(original ?? null) !== JSON.stringify(cleaned.length ? cleaned : undefined)) {
      changed = true
    }
  }

  for (const key of ['ogImage', 'noIndex'] as const) {
    if (seo[key] !== undefined) next[key] = seo[key]
  }

  return changed ? next : undefined
}

async function run() {
  const docs = await sanityClient.fetch<
    { _id: string; publishedAt?: string | null; seo?: Record<string, unknown> }[]
  >(`*[_type == "article"]{ _id, publishedAt, seo }`)

  console.log(`▶ Fix article validation blockers (${docs.length} docs)`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  let fixed = 0

  for (const doc of docs) {
    const patch: Record<string, unknown> = {}

    if (!doc.publishedAt) {
      patch.publishedAt = new Date().toISOString()
    }

    const seo = cleanSeo(doc.seo)
    if (seo) patch.seo = seo

    if (Object.keys(patch).length === 0) continue

    console.log(`  ✎ ${doc._id}`, Object.keys(patch).join(', '))
    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).set(patch).commit()
    }
    fixed++
  }

  console.log(`\n✓ ${DRY_RUN ? 'Would fix' : 'Fixed'} ${fixed} document(s)`)
}

run().catch((e) => {
  console.error('✗ Failed:', e)
  process.exit(1)
})
