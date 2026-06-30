/**
 * Move homepage reviews section config from googleReviewSettings → homepage.
 *
 * Run:
 *   cd test && npm run migrate:homepage-reviews:dry
 *   npm run migrate:homepage-reviews
 */
import { sanityClient } from './config'
import { i18nString } from './lib/category-landing-i18n'

const DRY_RUN = process.env.DRY_RUN === '1'
const HOMEPAGE_ID = 'homepage'

type I18nRow = { language?: string; _key?: string; value?: string }

function pickNo(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  if (!Array.isArray(value)) return ''
  const hit = value.find(
    (row) => (row as I18nRow).language === 'no' || (row as I18nRow)._key === 'no',
  ) as I18nRow | undefined
  return typeof hit?.value === 'string' ? hit.value.trim() : ''
}

function pickEn(value: unknown, fallbackNo: string): string {
  if (typeof value === 'string') return value.trim()
  if (!Array.isArray(value)) return fallbackNo
  const hit = value.find(
    (row) => (row as I18nRow).language === 'en' || (row as I18nRow)._key === 'en',
  ) as I18nRow | undefined
  return typeof hit?.value === 'string' ? hit.value.trim() : fallbackNo
}

function i18nFromField(value: unknown, fallbackNo: string, fallbackEn: string) {
  const no = pickNo(value) || fallbackNo
  const en = pickEn(value, fallbackEn || no)
  return i18nString(no, en)
}

async function run() {
  const homepage = await sanityClient.fetch<{ googleReviews?: unknown[] } | null>(
    `*[_id == $id][0]{ googleReviews }`,
    { id: HOMEPAGE_ID },
  )

  if (!homepage) {
    console.error(`✗ Missing ${HOMEPAGE_ID}`)
    process.exit(1)
  }

  if (homepage.googleReviews?.length) {
    console.log('✓ homepage already has googleReviews configured')
    return
  }

  const settings = await sanityClient.fetch<{
    heading?: unknown
    subheading?: unknown
    googleAverageRating?: number
    legelistenAverageRating?: number
    ctaTitle?: unknown
    ctaSubtitle?: unknown
  } | null>(`*[_type == "googleReviewSettings"][0]`)

  const reviewIds = await sanityClient.fetch<string[]>(
    `*[_type == "googleReview" && !(_id in path("drafts.**"))] | order(_createdAt desc)._id`,
  )

  const patch = {
    reviewsSubheading: i18nFromField(
      settings?.subheading,
      'Våre pasienter forteller',
      'Our patients share their experiences',
    ),
    reviewsHeading: i18nFromField(
      settings?.heading,
      'Trygghet, omsorg og helsehjelp i livets ulike faser',
      'Safety, care and healthcare through all phases of life',
    ),
    reviewsGoogleRating: settings?.googleAverageRating ?? 4.6,
    reviewsLegelistenRating: settings?.legelistenAverageRating ?? 4.8,
    reviewsCtaTitle: i18nFromField(
      settings?.ctaTitle,
      'Over 150 000 fornøyde pasienter siden 2002',
      'Over 150,000 satisfied patients since 2002',
    ),
    reviewsCtaSubtitle: i18nFromField(
      settings?.ctaSubtitle,
      'Bli en del av vår historie',
      'Become part of our story',
    ),
    googleReviews: reviewIds.map((ref, index) => ({
      _type: 'reference',
      _ref: ref,
      _key: `homepage-review-${index}`,
    })),
  }

  console.log(
    DRY_RUN ? 'Dry run — would patch homepage reviews:' : 'Patching homepage reviews:',
    `${reviewIds.length} review ref(s)`,
  )

  if (!DRY_RUN) {
    await sanityClient.patch(HOMEPAGE_ID).set(patch).commit()
  }

  console.log(`\n${DRY_RUN ? 'Would update' : 'Updated'} ${HOMEPAGE_ID}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
