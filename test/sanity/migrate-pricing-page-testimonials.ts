/**
 * Link pricing page testimonials + section titles (CMS-only priser content).
 *
 * Run:
 *   cd test && DRY_RUN=1 npx tsx sanity/migrate-pricing-page-testimonials.ts
 *   npx tsx sanity/migrate-pricing-page-testimonials.ts
 */
import { sanityClient } from './config'
import { i18nString } from './lib/category-landing-i18n'

const DRY_RUN = process.env.DRY_RUN === '1'
const PRICING_PAGE_ID = 'pricingPage'

const TESTIMONIAL_REFS = [
  'testimonial-maria-s-',
  'testimonial-anders-l-',
  'testimonial-sofie-h-',
]

async function run() {
  const existing = await sanityClient.fetch<{
    testimonials?: unknown[]
    testimonialsTitle?: unknown
    faqTitle?: unknown
  } | null>(`*[_id == $id][0]{
    testimonials,
    testimonialsTitle,
    faqTitle
  }`, { id: PRICING_PAGE_ID })

  if (!existing) {
    console.error(`✗ Missing ${PRICING_PAGE_ID} document`)
    process.exit(1)
  }

  const patch: Record<string, unknown> = {}

  if (!existing.testimonials?.length) {
    patch.testimonials = TESTIMONIAL_REFS.map((ref, i) => ({
      _type: 'reference',
      _ref: ref,
      _key: `pricing-testimonial-${i}`,
    }))
  }

  if (!existing.testimonialsTitle) {
    patch.testimonialsTitle = i18nString(
      'Det sier pasientene våre',
      'What our patients say',
    )
  }

  if (!existing.faqTitle) {
    patch.faqTitle = i18nString(
      'Ofte stilte spørsmål om priser',
      'Frequently asked questions about pricing',
    )
  }

  if (Object.keys(patch).length === 0) {
    console.log('✓ pricingPage already has testimonials and section titles')
    return
  }

  console.log(DRY_RUN ? 'Dry run — would patch:' : 'Patching pricingPage:', Object.keys(patch).join(', '))

  if (!DRY_RUN) {
    await sanityClient.patch(PRICING_PAGE_ID).set(patch).commit()
  }

  console.log(`\n${DRY_RUN ? 'Would update' : 'Updated'} ${PRICING_PAGE_ID}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
