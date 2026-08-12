/**
 * The 'pmos' treatment's English content is titled "PCOS" (both the page
 * title and seo.metaTitle already say PCOS — that's the term English
 * searchers actually use), but the English URL slug was still "pmos" — the
 * Norwegian abbreviation. This patches ONLY the English slug value to
 * "pcos"; the Norwegian slug stays "pmos" (correct, that's the NO term).
 *
 * Uses `.patch().set()` on the single `slug[_key=="en"].value` entry — no
 * other field is touched. The frontend's route matching checks both
 * language slugs regardless of active locale, so this does not break
 * existing bookmarks/links to /en/gynecology/pmos on its own — a redirect
 * to the new canonical path is added in next.config.ts separately.
 *
 * Run:
 *   npx tsx sanity/migrate-pmos-slug-to-pcos.ts
 *   DRY_RUN=1 npx tsx sanity/migrate-pmos-slug-to-pcos.ts
 */

import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'
const DOC_ID = 'treatment-gynekologi-pmos'

async function main() {
  const doc = await sanityClient.fetch(`*[_id == $id][0]{ _id, slug }`, { id: DOC_ID })
  if (!doc) {
    console.error(`${DOC_ID} not found`)
    process.exit(1)
  }

  console.log(`\n[migrate-pmos-slug-to-pcos] target: ${doc._id} — mode=${DRY_RUN ? 'DRY_RUN' : 'WRITE'}\n`)
  console.log('Current slug entries:', JSON.stringify(doc.slug, null, 2))

  const enIndex = (doc.slug || []).findIndex((e: any) => e.language === 'en')
  if (enIndex === -1) {
    console.error('No EN slug entry found on this document')
    process.exit(1)
  }

  const newSlug = [...doc.slug]
  newSlug[enIndex] = {
    ...newSlug[enIndex],
    value: { _type: 'slug', current: 'pcos' },
  }

  console.log('\nNew EN slug: pcos (NO slug unchanged: pmos)')

  if (DRY_RUN) {
    console.log('\n(dry run — no writes)\n')
    return
  }

  await sanityClient.patch(doc._id).set({ slug: newSlug }).commit()
  console.log('\n✅ Patched EN slug: pmos → pcos\n')
}

main().catch((e) => {
  console.error('❌ Migration failed:', e)
  process.exit(1)
})
