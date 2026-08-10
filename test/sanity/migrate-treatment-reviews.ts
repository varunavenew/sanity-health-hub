import { sanityClient } from './config'
import { pickNo } from '../schemaTypes/i18n'

const DRY_RUN = process.env.DRY_RUN !== '0'

type GoogleReviewRow = {
  _id: string
  author?: string
  text?: unknown
}

type TreatmentRow = {
  _id: string
  title?: unknown
  category?: { _ref: string }
  categoryId?: string
  categoryTitleNo?: string
  categoryTitleEn?: string
}

const categoryKeywords: Record<string, string[]> = {
  gynekologi: ["gynekolog", "kvinne", "ida", "siri", "eggfrys", "egg", "ivf", "osteopat", "ingvild"],
  fertilitet: ["fertil", "ivf", "eggfrys", "egg", "prøverør", "befruktning", "embryo", "jackson", "birgitte"],
  urologi: ["urolog", "prostata", "nicolai", "wessel", "robot"],
  ortopedi: ["skulder", "kne", "hånd", "fot", "operasjon", "kirurg", "haugstvedt", "warholm", "kristian"],
  graviditet: ["gravid", "foster", "fødsel", "ultralyd", "nipt"],
};

const categoryTitleMapping: Record<string, { no: string; en: string }> = {
  gynekologi: { no: "gynekologi", en: "gynecology" },
  fertilitet: { no: "fertilitet", en: "fertility" },
  urologi: { no: "urologi", en: "urology" },
  ortopedi: { no: "ortopedi", en: "orthopedics" },
  graviditet: { no: "graviditet", en: "pregnancy" },
  'flere-fagomrader': { no: "flere fagområder", en: "other specialties" }
};

function reviewTextForMatch(text: unknown): string {
  return pickNo(text).trim()
}

function patientReviewRefs(reviewIds: string[]) {
  return reviewIds.map((id) => ({
    _type: 'reference' as const,
    _ref: id,
    _key: id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 12) || id,
  }))
}

async function run() {
  const reviews = await sanityClient.fetch<GoogleReviewRow[]>(
    `*[_type == "googleReview" && !(_id in path("drafts.**"))] | order(_createdAt desc){
      _id, author, text
    }`,
  )

  const matchPool = reviews
    .map((r) => ({
      id: r._id,
      author: String(r.author || '').trim(),
      text: reviewTextForMatch(r.text),
    }))
    .filter((r) => r.text.length > 0)

  console.log(`▶ Auto-match patient reviews for treatments`)
  console.log(`  Google reviews in pool: ${matchPool.length}`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  if (matchPool.length === 0) {
    console.warn('⚠ No googleReview documents with Norwegian/English text found.')
    return
  }

  const treatments = await sanityClient.fetch<TreatmentRow[]>(
    `*[_type == "treatment" && !(_id in path("drafts.**"))]{
      _id,
      title,
      category,
      "categoryId": category->categoryId,
      "categoryTitleNo": category->title[language == "no"][0].value,
      "categoryTitleEn": category->title[language == "en"][0].value
    }`,
  )

  let updated = 0
  let skipped = 0

  for (const doc of treatments) {
    const title = pickNo(doc.title).trim()
    const catId = doc.categoryId || ''
    if (!catId) {
      console.log(`  – ${title || doc._id}: skipped (no category reference)`)
      skipped++
      continue
    }

    const mapping = categoryTitleMapping[catId] || {
      no: doc.categoryTitleNo || catId,
      en: doc.categoryTitleEn || catId
    }

    const categoryTitleNo = mapping.no
    const categoryTitleEn = mapping.en

    // Generate heading and eyebrow
    const eyebrowNo = "Pasienterfaringer"
    const eyebrowEn = "Patient experiences"

    const headingNo = `Hva pasientene sier om ${categoryTitleNo.toLowerCase()}`
    const headingEn = `What patients say about ${categoryTitleEn.toLowerCase()}`

    // Match reviews using the keywords
    const keywords = categoryKeywords[catId] || []
    
    // We filter reviews matching keywords
    let matched = matchPool.filter((r) =>
      keywords.some(
        (kw) =>
          r.text.toLowerCase().includes(kw) || r.author.toLowerCase().includes(kw)
      )
    )

    // Take up to 6 reviews. If fewer than 6, backfill with top reviews from pool
    if (matched.length < 6) {
      const remaining = matchPool.filter((r) => !matched.includes(r))
      matched = [...matched, ...remaining]
    }
    const selectedReviews = matched.slice(0, 6)
    const refs = patientReviewRefs(selectedReviews.map((r) => r.id))

    console.log(`  ✎ ${title}: ${refs.length} review(s) [Category: ${catId}]`)
    console.log(`    NO: Heading: "${headingNo}" | Eyebrow: "${eyebrowNo}"`)
    console.log(`    EN: Heading: "${headingEn}" | Eyebrow: "${eyebrowEn}"`)

    if (!DRY_RUN) {
      await sanityClient
        .patch(doc._id)
        .set({
          reviewsEyebrow: [
            { _key: 'no', language: 'no', value: eyebrowNo },
            { _key: 'en', language: 'en', value: eyebrowEn }
          ],
          reviewsTitle: [
            { _key: 'no', language: 'no', value: headingNo },
            { _key: 'en', language: 'en', value: headingEn }
          ],
          patientReviews: refs
        })
        .commit()
    }
    updated++
  }

  console.log('\n──────────────────────────────────────────')
  console.log(`✅ ${DRY_RUN ? 'Would update' : 'Updated'}: ${updated}`)
  console.log(`⏭  Skipped: ${skipped}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
