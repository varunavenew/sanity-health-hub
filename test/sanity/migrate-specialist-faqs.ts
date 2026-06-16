/**
 * Link default specialist profile FAQs (finansiering + praktisk) to every specialist.
 *
 * Usage:
 *   cd test && npm run migrate:specialist-faqs:dry
 *   cd test && npm run migrate:specialist-faqs
 */
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'

/** Matches SpecialistFAQBlock fallback (Price, Insurance, …). */
export const DEFAULT_SPECIALIST_FAQ_IDS = [
  'faq-finansiering-pris',
  'faq-finansiering-forsikring',
  'faq-finansiering-nedbetaling',
  'faq-praktisk-henvisning',
  'faq-praktisk-ventetid',
  'faq-praktisk-sykemelding',
  'faq-praktisk-utredning',
  'faq-praktisk-personvern',
] as const

function faqRefs() {
  return DEFAULT_SPECIALIST_FAQ_IDS.map((id) => ({
    _type: 'reference' as const,
    _ref: id,
    _key: id,
  }))
}

type SpecialistRow = {
  _id: string
  name?: string
  faqs?: Array<{ _ref?: string }>
}

async function run() {
  const existingFaqs = await sanityClient.fetch<number>(
    `count(*[_type == "faq" && _id in $ids])`,
    { ids: [...DEFAULT_SPECIALIST_FAQ_IDS] },
  )
  if (existingFaqs !== DEFAULT_SPECIALIST_FAQ_IDS.length) {
    console.warn(
      `⚠ Only ${existingFaqs}/${DEFAULT_SPECIALIST_FAQ_IDS.length} FAQ docs found. Run: npx tsx sanity/migrate-faqs.ts`,
    )
  }

  const specialists = await sanityClient.fetch<SpecialistRow[]>(
    `*[_type == "specialist" && !(_id in path("drafts.**"))]{ _id, name, faqs[]{ _ref } }`,
  )

  console.log(`▶ Link default FAQs to ${specialists.length} specialists`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}`)
  console.log(`  Force overwrite: ${FORCE ? 'yes' : 'no'}\n`)

  let updated = 0
  let skipped = 0

  for (const doc of specialists) {
    const hasFaqs = Array.isArray(doc.faqs) && doc.faqs.length > 0
    if (hasFaqs && !FORCE) {
      skipped++
      continue
    }

    console.log(`  ✎ ${doc.name ?? doc._id}`)
    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).set({ faqs: faqRefs() }).commit()
    }
    updated++
  }

  console.log('\n──────────────────────────────────────────')
  console.log(`✅ ${DRY_RUN ? 'Would update' : 'Updated'}: ${updated}`)
  console.log(`⏭  Skipped (already has FAQs): ${skipped}`)
}

run().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
