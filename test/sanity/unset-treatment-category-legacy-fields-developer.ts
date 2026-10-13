/**
 * Developer-only: strip legacy category fields removed from schema (no frontend use).
 * Run: npx tsx sanity/unset-treatment-category-legacy-fields-developer.ts
 */
import {sanityClient} from './config'

type Audience = {_key?: string; icon?: unknown; [key: string]: unknown}
type SymptomItem = {_key?: string; image?: unknown; imageAlt?: unknown; [key: string]: unknown}
type Review = {_key?: string; date?: unknown; [key: string]: unknown}

function stripAudience(a: Audience) {
  const {icon: _icon, ...rest} = a
  delete rest.icon
  return rest
}

function stripSymptom(item: SymptomItem) {
  const next = {...item}
  delete next.image
  delete next.imageAlt
  return next
}

function stripReview(r: Review) {
  const next = {...r}
  delete next.date
  return next
}

async function cleanDoc(id: string) {
  const doc = await sanityClient.fetch<{
    _id: string
    faqs?: unknown
    landingPage?: {
      hero?: {eyebrow?: unknown}
      segmentsSection?: {eyebrow?: unknown; audiences?: unknown}
      servicesSection?: {eyebrow?: unknown}
      symptomsSection?: {eyebrow?: unknown; items?: SymptomItem[]}
      audiencesSection?: {audiences?: Audience[]}
      reviewsSection?: {reviews?: Review[]}
    }
  } | null>(`*[_id == $id][0]`, {id})

  if (!doc) {
    console.log('skip', id, '(missing)')
    return
  }

  const patch = sanityClient.patch(id).unset(['faqs'])
  const lp = doc.landingPage

  if (lp?.hero?.eyebrow !== undefined) {
    patch.unset(['landingPage.hero.eyebrow'])
  }
  if (lp?.segmentsSection?.eyebrow !== undefined) {
    patch.unset(['landingPage.segmentsSection.eyebrow'])
  }
  if (lp?.servicesSection?.eyebrow !== undefined) {
    patch.unset(['landingPage.servicesSection.eyebrow'])
  }
  if (lp?.symptomsSection?.eyebrow !== undefined) {
    patch.unset(['landingPage.symptomsSection.eyebrow'])
  }

  const audiences = lp?.audiencesSection?.audiences
  if (Array.isArray(audiences) && audiences.some((a) => a?.icon != null)) {
    patch.set({
      'landingPage.audiencesSection.audiences': audiences.map(stripAudience),
    })
  }

  const symptoms = lp?.symptomsSection?.items
  if (
    Array.isArray(symptoms) &&
    symptoms.some((item) => item?.image != null || item?.imageAlt != null)
  ) {
    patch.set({
      'landingPage.symptomsSection.items': symptoms.map(stripSymptom),
    })
  }

  const reviews = lp?.reviewsSection?.reviews
  if (Array.isArray(reviews) && reviews.some((r) => r?.date != null)) {
    patch.set({
      'landingPage.reviewsSection.reviews': reviews.map(stripReview),
    })
  }

  await patch.commit({visibility: 'sync'})
  console.log('cleaned', id)
}

async function main() {
  const ids = await sanityClient.fetch<string[]>(
    `*[_type == "treatmentCategory"]._id`,
  )
  for (const id of ids) {
    await cleanDoc(id)
    const draftId = id.startsWith('drafts.') ? id : `drafts.${id}`
    if (ids.includes(draftId)) continue
    try {
      await cleanDoc(draftId)
    } catch {
      // no draft
    }
  }
  console.log('Done — hard-refresh Studio.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
