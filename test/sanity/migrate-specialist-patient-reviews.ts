/**
 * Populate specialist.patientReviews from the same auto-match rules as the live site.
 *
 * Usage:
 *   cd test && npm run migrate:specialist-patient-reviews:dry
 *   cd test && npm run migrate:specialist-patient-reviews
 */
import { resolveSpecialistPrimaryCategory } from '../../src/lib/sanity/category-keys'
import { getAutoMatchedReviews } from '../../src/lib/sanity/specialist-review-match'
import { pickNo } from '../schemaTypes/i18n'
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'

type GoogleReviewRow = {
  _id: string
  author?: string
  text?: unknown
}

type SpecialistRow = {
  _id: string
  name?: string
  patientReviews?: Array<{ _ref?: string }>
  categories?: Array<{ categoryId?: string; slug?: string }>
}

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
      text: reviewTextForMatch(r.text),
    }))
    .filter((r) => r.text.length > 0)

  console.log(`▶ Auto-match patient reviews for specialists`)
  console.log(`  Google reviews (with NO text): ${matchPool.length}`)
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}`)
  console.log(`  Force overwrite: ${FORCE ? 'yes' : 'no'}\n`)

  if (matchPool.length === 0) {
    console.warn('⚠ No googleReview documents with Norwegian text found.')
    return
  }

  const specialists = await sanityClient.fetch<SpecialistRow[]>(
    `*[_type == "specialist" && !(_id in path("drafts.**"))]{
      _id, name,
      patientReviews[]{ _ref },
      "categories": categories[]->{ categoryId, "slug": slug.current }
    }`,
  )

  let updated = 0
  let skipped = 0
  let empty = 0

  for (const doc of specialists) {
    const name = String(doc.name || '').trim()
    if (!name) {
      empty++
      continue
    }

    const hasReviews = Array.isArray(doc.patientReviews) && doc.patientReviews.length > 0
    if (hasReviews && !FORCE) {
      skipped++
      continue
    }

    const category = resolveSpecialistPrimaryCategory(doc.categories)
    const matched = getAutoMatchedReviews(name, category, matchPool)

    if (matched.length === 0) {
      console.log(`  – ${name}: no matches`)
      empty++
      continue
    }

    const refs = patientReviewRefs(matched.map((r) => r.id))
    console.log(`  ✎ ${name}: ${refs.length} review(s) [${category || 'no category'}]`)

    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).set({ patientReviews: refs }).commit()
    }
    updated++
  }

  console.log('\n──────────────────────────────────────────')
  console.log(`✅ ${DRY_RUN ? 'Would update' : 'Updated'}: ${updated}`)
  console.log(`⏭  Skipped (already has patientReviews): ${skipped}`)
  console.log(`–  No name or no matches: ${empty}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
