/**
 * Wrap googleReview.text and googleReviewSettings copy in internationalizedArray
 * shape and set professional English translations.
 *
 * Idempotent — safe to re-run (skips fields that already have EN).
 *
 * ENV:
 *   DRY_RUN=1  – log only, no writes
 *
 * Run:
 *   cd test && npm run migrate:reviews:en
 */
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

const SETTINGS_EN = {
  heading: 'Safety, care and healthcare through all phases of life',
  subheading: 'Our patients share their experiences',
  ctaTitle: 'Over 150,000 satisfied patients since 2002',
  ctaSubtitle: 'Become part of our story',
}

const SETTINGS_NO = {
  heading: 'Trygghet, omsorg og helsehjelp i livets ulike faser',
  subheading: 'Våre pasienter forteller',
  ctaTitle: 'Over 150 000 fornøyde pasienter siden 2002',
  ctaSubtitle: 'Bli en del av vår historie',
}

/** English review text keyed by Sanity document _id */
const REVIEW_EN: Record<string, string> = {
  'review-1':
    'Fantastic experience – friendly and highly skilled doctor. She made me feel very safe and gave me useful information. The doctor is Siri Kløkstad.',
  'review-2':
    'I had a very pleasant and positive experience with egg freezing at CMedical. My doctor Jackson was highly skilled and reassuring.',
  'review-3':
    'Good service and follow-through. Fantastic staff, beautiful facilities and good food.',
  'review-4':
    'From start to finish after the operation, everything has run smoothly. Very satisfied.',
  'review-5':
    'After robot-assisted surgery for prostate cancer with surgeon Nicolai Wessel, I am extremely satisfied.',
  'review-6':
    'Top marks on every point from reception through to aftercare. The responsible physician was Trond Jørgensen.',
  'review-7':
    'Exceptionally skilled hand surgeon Jan Ragnar Haugstvedt! The whole experience was fantastic.',
  'review-8':
    'A very positive experience at CMedical. Gynaecologist Ida was thorough and made me feel safe.',
  'review-9':
    'A particularly good experience with shoulder surgery performed by senior consultant Kristian Marstrand Warholm.',
  'review-10': 'A pleasant and positive experience. I felt well looked after :)',
  'review-11':
    'A lovely place with wonderful people. A great experience with egg freezing.',
  'review-12': 'I had IVF here in 2023 and ended up with a beautiful boy after three attempts.',
  'review-13': 'Very professional treatment, friendly and conscientious staff.',
  'review-14':
    "Ingvild Aanerud is a skilled osteopath with extensive knowledge of women's health.",
}

type I18nItem = { _type: string; language: string; value: string }

function isI18nArray(val: unknown): val is I18nItem[] {
  return (
    Array.isArray(val) &&
    val.length > 0 &&
    typeof val[0] === 'object' &&
    val[0] !== null &&
    typeof (val[0] as I18nItem)._type === 'string' &&
    (val[0] as I18nItem)._type.startsWith('internationalizedArray')
  )
}

function pickNo(val: unknown): string {
  if (typeof val === 'string') return val.trim()
  if (!isI18nArray(val)) return ''
  const no =
    val.find((i) => i.language === 'no' || (i as { _key?: string })._key === 'no') || val[0]
  return typeof no?.value === 'string' ? no.value.trim() : ''
}

function hasEn(val: unknown): boolean {
  if (!isI18nArray(val)) return false
  const en = val.find((i) => i.language === 'en' || (i as { _key?: string })._key === 'en')
  return typeof en?.value === 'string' && en.value.trim().length > 0
}

function i18nText(no: string, en: string): I18nItem[] {
  return [
    { _type: 'internationalizedArrayTextValue', language: 'no', value: no },
    { _type: 'internationalizedArrayTextValue', language: 'en', value: en },
  ]
}

function i18nString(no: string, en: string): I18nItem[] {
  return [
    { _type: 'internationalizedArrayStringValue', language: 'no', value: no },
    { _type: 'internationalizedArrayStringValue', language: 'en', value: en },
  ]
}

async function migrateReviews() {
  const docs = await sanityClient.fetch<
    { _id: string; author: string; text: unknown }[]
  >(`*[_type == "googleReview"] | order(_id asc)`)

  let updated = 0
  for (const doc of docs) {
    const no = pickNo(doc.text)
    const en = REVIEW_EN[doc._id]
    if (!no || !en) {
      console.warn(`  ⚠ ${doc._id} — missing NO text or EN map entry, skipped`)
      continue
    }
    if (isI18nArray(doc.text) && hasEn(doc.text)) {
      console.log(`  · ${doc._id} — EN already set`)
      continue
    }

    const patch = { text: i18nText(no, en) }
    console.log(`  ✎ ${doc._id} (${doc.author})`)
    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).set(patch).commit({ autoGenerateArrayKeys: true })
    }
    updated++
  }
  return updated
}

async function migrateSettings() {
  const docs = await sanityClient.fetch<{ _id: string; heading?: unknown }[]>(
    `*[_type == "googleReviewSettings"]`
  )
  if (docs.length === 0) {
    console.log('  · no googleReviewSettings document found')
    return 0
  }

  let updated = 0
  for (const doc of docs) {
    if (isI18nArray(doc.heading) && hasEn(doc.heading)) {
      console.log(`  · ${doc._id} — EN already set`)
      continue
    }

    const patch = {
      heading: i18nString(SETTINGS_NO.heading, SETTINGS_EN.heading),
      subheading: i18nString(SETTINGS_NO.subheading, SETTINGS_EN.subheading),
      ctaTitle: i18nString(SETTINGS_NO.ctaTitle, SETTINGS_EN.ctaTitle),
      ctaSubtitle: i18nString(SETTINGS_NO.ctaSubtitle, SETTINGS_EN.ctaSubtitle),
    }

    console.log(`  ✎ ${doc._id} — settings headings + CTA`)
    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).set(patch).commit({ autoGenerateArrayKeys: true })
    }
    updated++
  }
  return updated
}

async function run() {
  console.log('▶ Migrate Google reviews → i18n (NO + EN)')
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  console.log('Reviews:')
  const reviewCount = await migrateReviews()

  console.log('\nSettings:')
  const settingsCount = await migrateSettings()

  console.log(
    `\n✓ Done — ${reviewCount} review(s), ${settingsCount} settings doc(s)${DRY_RUN ? ' (dry run)' : ' written'}`
  )
}

run().catch((e) => {
  console.error('✗ Migration failed:', e)
  process.exit(1)
})
