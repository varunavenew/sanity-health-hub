/**
 * Link pricing page testimonials + section titles (CMS-only priser content).
 *
 * Run:
 *   cd test && DRY_RUN=1 npx tsx sanity/migrate-pricing-page-testimonials.ts
 *   npx tsx sanity/migrate-pricing-page-testimonials.ts
 */
import { sanityClient } from './config'
import { i18nString } from './lib/category-landing-i18n'
import { patchSingletonFields } from './lib/patch-singleton'

const DRY_RUN = process.env.DRY_RUN === '1'
const PRICING_PAGE_ID = 'pricingPage'

const TESTIMONIAL_REFS = [
  'testimonial-maria-s-',
  'testimonial-anders-l-',
  'testimonial-sofie-h-',
]

const FAQ_REFS = [
  'faq-priser-henvisning',
  'faq-priser-betaling',
  'faq-priser-forsikring',
  'faq-priser-avbestilling',
]

async function run() {
  const existingDocs = await sanityClient.fetch<Array<{
    _id: string
    testimonials?: unknown[]
    faqs?: unknown[]
    testimonialsTitle?: unknown
    faqTitle?: unknown
  }>>(`*[_id in [$id, $draftId]]{
    _id,
    testimonials,
    faqs,
    testimonialsTitle,
    faqTitle
  }`, { id: PRICING_PAGE_ID, draftId: `drafts.${PRICING_PAGE_ID}` })

  if (existingDocs.length === 0) {
    console.error(`✗ Missing ${PRICING_PAGE_ID} document`)
    process.exit(1)
  }

  const patch: Record<string, unknown> = {}

  const anyDocMissingArray = (field: 'testimonials' | 'faqs') =>
    existingDocs.some((doc) => !Array.isArray(doc[field]) || doc[field].length === 0)

  const anyDocMissingValue = (field: 'testimonialsTitle' | 'faqTitle') =>
    existingDocs.some((doc) => !doc[field])

  if (anyDocMissingArray('testimonials')) {
    patch.testimonials = TESTIMONIAL_REFS.map((ref, i) => ({
      _type: 'reference',
      _ref: ref,
      _key: `pricing-testimonial-${i}`,
    }))
  }

  if (anyDocMissingArray('faqs')) {
    patch.faqs = FAQ_REFS.map((ref, i) => ({
      _type: 'reference',
      _ref: ref,
      _key: `pricing-faq-${i}`,
    }))
  }

  if (anyDocMissingValue('testimonialsTitle')) {
    patch.testimonialsTitle = i18nString(
      'Det sier pasientene våre',
      'What our patients say',
    )
  }

  if (anyDocMissingValue('faqTitle')) {
    patch.faqTitle = i18nString(
      'Ofte stilte spørsmål om priser',
      'Frequently asked questions about pricing',
    )
  }

  if (Object.keys(patch).length === 0) {
    console.log('✓ pricingPage already has testimonials, FAQs, and section titles')
    return
  }

  const targetIds = existingDocs
    .filter((doc) =>
      Object.entries(patch).some(([field, value]) => {
        const current = doc[field as keyof typeof doc]
        return Array.isArray(value)
          ? !Array.isArray(current) || current.length === 0
          : !current
      }),
    )
    .map((doc) => doc._id)

  console.log(
    DRY_RUN ? 'Dry run — would patch:' : 'Patching pricingPage:',
    Object.keys(patch).join(', '),
    'on',
    targetIds.join(', ') || PRICING_PAGE_ID,
  )

  if (!DRY_RUN) {
    const patched = await patchSingletonFields(PRICING_PAGE_ID, patch, 'pricingPage')
    console.log('Patched documents:', patched.join(', '))
  }

  console.log(`\n${DRY_RUN ? 'Would update' : 'Updated'} ${PRICING_PAGE_ID}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
