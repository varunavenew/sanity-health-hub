/**
 * Fix the aboutPage SEO metaTitle, which was truncated mid-sentence in both
 * languages ("...Nordens ledende klinikk for livet og." / "...leading clinic
 * for life and.") — trimmed back to the last complete, grammatical clause
 * rather than guessing what the missing words were meant to say.
 *
 * Also strips a stray trailing "1" character from the NO metaDescription
 * (clear data-entry artifact, not present in the EN value).
 *
 * Uses `.patch().set()` on `seo.metaTitle` / `seo.metaDescription` only —
 * every other field on the document is left untouched.
 *
 * Run:
 *   npx tsx sanity/migrate-about-page-seo-fix.ts
 *   DRY_RUN=1 npx tsx sanity/migrate-about-page-seo-fix.ts
 */

import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

async function main() {
  const doc = await sanityClient.fetch(
    `*[_type == "aboutPage" && !(_id in path("drafts.**"))][0]{ _id, seo }`,
  )
  if (!doc) {
    console.error('aboutPage document not found')
    process.exit(1)
  }

  console.log(`\n[migrate-about-page-seo-fix] target: ${doc._id} — mode=${DRY_RUN ? 'DRY_RUN' : 'WRITE'}\n`)

  const metaTitle = (doc.seo?.metaTitle || []).map((entry: any) => {
    if (entry.language === 'no') {
      return { ...entry, value: 'Om oss | CMedical – Nordens ledende klinikk' }
    }
    if (entry.language === 'en') {
      return { ...entry, value: "About us | CMedical – The Nordic region's leading clinic" }
    }
    return entry
  })

  const metaDescription = (doc.seo?.metaDescription || []).map((entry: any) => {
    if (entry.language === 'no' && typeof entry.value === 'string') {
      return { ...entry, value: entry.value.replace(/1$/, '').trim() }
    }
    return entry
  })

  console.log('New NO metaTitle:', metaTitle.find((e: any) => e.language === 'no')?.value)
  console.log('New EN metaTitle:', metaTitle.find((e: any) => e.language === 'en')?.value)
  console.log('New NO metaDescription:', metaDescription.find((e: any) => e.language === 'no')?.value)

  if (DRY_RUN) {
    console.log('\n(dry run — no writes)\n')
    return
  }

  await sanityClient
    .patch(doc._id)
    .set({ 'seo.metaTitle': metaTitle, 'seo.metaDescription': metaDescription })
    .commit()

  console.log('\n✅ Patched aboutPage SEO fields.\n')
}

main().catch((e) => {
  console.error('❌ Migration failed:', e)
  process.exit(1)
})
