/**
 * Migration: Convert legacy `slug: { current }` to internationalizedArraySlug (NO seed).
 *
 * ENV:
 *   DRY_RUN=1
 *   ONLY=type1,type2
 *
 * Run:
 *   cd test && npx tsx sanity/migrate-i18n-slugs.ts
 */
import { randomBytes } from 'crypto'
import { sanityClient } from './config'

function randomKey(): string {
  return randomBytes(8).toString('hex')
}

const DRY_RUN = process.env.DRY_RUN === '1'
const ONLY = (process.env.ONLY || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

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
    typeof (val[0] as { _type?: string })._type === 'string' &&
    String((val[0] as { _type: string })._type).startsWith('internationalizedArraySlug')
  )
}

function wrapSlug(current: string) {
  return [
    {
      _key: randomKey(),
      _type: 'internationalizedArraySlugValue',
      language: 'no',
      value: { _type: 'slug', current },
    },
  ]
}

async function run() {
  const types = ONLY.length ? TYPES.filter((t) => ONLY.includes(t)) : TYPES

  console.log('▶ Migrate slugs → internationalizedArraySlug')
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}`)
  if (ONLY.length) console.log(`  Types:   ${types.join(', ')}`)
  console.log()

  for (const type of types) {
    const docs = await sanityClient.fetch<{ _id: string; slug?: unknown }[]>(
      `*[_type == "${type}" && defined(slug)]{ _id, slug }`,
    )
    console.log(`📄 ${type} — ${docs.length} doc(s)`)

    for (const doc of docs) {
      const slug = doc.slug

      if (isI18nSlugArray(slug)) {
        const missingKeys = slug.some((e) => !e._key)
        if (missingKeys) {
          console.log(`  ✎ ${doc._id} — add _key`)
          if (!DRY_RUN) {
            await sanityClient
              .patch(doc._id)
              .set({ slug })
              .commit({ autoGenerateArrayKeys: true })
          }
        } else {
          console.log(`  · ${doc._id} — ok`)
        }
        continue
      }

      const current =
        slug &&
        typeof slug === 'object' &&
        !Array.isArray(slug) &&
        typeof (slug as { current?: string }).current === 'string'
          ? (slug as { current: string }).current.trim()
          : ''

      if (!current) {
        console.log(`  · ${doc._id} — no slug.current, skip`)
        continue
      }

      const next = wrapSlug(current)
      console.log(`  ✎ ${doc._id} — migrate ${current}`)
      if (!DRY_RUN) {
        await sanityClient
          .patch(doc._id)
          .set({ slug: next })
          .commit({ autoGenerateArrayKeys: true })
      }
    }
  }

  console.log('\n✓ Done')
}

run().catch((e) => {
  console.error('✗ Migration failed:', e)
  process.exit(1)
})
