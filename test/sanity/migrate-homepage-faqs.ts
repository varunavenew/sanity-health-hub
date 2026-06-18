/**
 * Link default homepage FAQs (generelt category) to the homepage document.
 *
 * Usage:
 *   cd test && npm run migrate:homepage-faqs:dry
 *   cd test && npm run migrate:homepage-faqs
 */
import { sanityClient } from './config'
import { i18nString } from './lib/category-landing-i18n'

const DRY_RUN = process.env.DRY_RUN === '1'
const HOMEPAGE_ID = 'homepage'

export const DEFAULT_HOMEPAGE_FAQ_IDS = [
  'faq-generelt-henvisning',
  'faq-generelt-ventetid',
  'faq-generelt-sykemelding',
  'faq-generelt-utredning',
  'faq-generelt-selskapet',
  'faq-generelt-forsikring',
] as const

function faqRefs() {
  return DEFAULT_HOMEPAGE_FAQ_IDS.map((id) => ({
    _type: 'reference' as const,
    _ref: id,
    _key: id,
  }))
}

async function run() {
  const existingFaqs = await sanityClient.fetch<number>(
    `count(*[_type == "faq" && _id in $ids])`,
    { ids: [...DEFAULT_HOMEPAGE_FAQ_IDS] },
  )
  if (existingFaqs !== DEFAULT_HOMEPAGE_FAQ_IDS.length) {
    console.warn(
      `⚠ Only ${existingFaqs}/${DEFAULT_HOMEPAGE_FAQ_IDS.length} FAQ docs found. Run: npx tsx sanity/migrate-faqs.ts`,
    )
  }

  const patch = {
    faqSectionTitle: i18nString('Ofte stilte spørsmål', 'Frequently asked questions'),
    faqs: faqRefs(),
  }

  console.log(`▶ Link ${DEFAULT_HOMEPAGE_FAQ_IDS.length} FAQs to homepage`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  if (!DRY_RUN) {
    await sanityClient.createIfNotExists({
      _id: HOMEPAGE_ID,
      _type: 'homepage',
      title: [{ _type: 'internationalizedArrayStringValue', _key: 'no', language: 'no', value: 'Forside' }],
    })
    await sanityClient.patch(HOMEPAGE_ID).set(patch).commit({ autoGenerateArrayKeys: true })
  }

  console.log(`✅ ${DRY_RUN ? 'Would update' : 'Updated'} ${HOMEPAGE_ID}`)
}

run().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
