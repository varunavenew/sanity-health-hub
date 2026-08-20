#!/usr/bin/env npx tsx
/**
 * Retire Plastikkirurgi — CMedical does not offer plastic surgery.
 *
 * 1. Strip listing refs (category treatments[], landing expert cards,
 *    relatedSection items) so unpublish is not blocked by references
 * 2. Unpublish `treatment-flere-fagomrader-plastikkirurgi` (keep draft)
 *
 * Frontend 301s live in next.config.ts (→ /ovrige or /other). Confirm destination
 * with Erlend (SEO) before production deploy.
 *
 * Usage (from test/):
 *   DRY_RUN=1 npx tsx sanity/unpublish-plastikkirurgi-developer.ts
 *   npx tsx sanity/unpublish-plastikkirurgi-developer.ts
 *
 * Production:
 *   ALLOW_PRODUCTION_MIGRATION=true SANITY_DATASET=production npx tsx …
 */
import {sanityClient, DATASET, PROJECT_ID} from './config'

const DRY_RUN = process.env.DRY_RUN === '1'
const DOC_ID = 'treatment-flere-fagomrader-plastikkirurgi'
const DRAFT_ID = `drafts.${DOC_ID}`
const CATEGORY_IDS = ['category-flere-fagomrader', 'drafts.category-flere-fagomrader']

function hrefLooksLikePlastikkirurgi(href: unknown): boolean {
  if (typeof href !== 'string') return false
  return /plastikkirurgi|plastic-surgery|procedure-reconstructive-surg/i.test(href)
}

function titleLooksLikePlastikkirurgi(title: unknown): boolean {
  if (!Array.isArray(title)) return false
  return title.some((entry) => {
    const value = typeof entry?.value === 'string' ? entry.value : ''
    return /plastikkirurgi|plastic surgery/i.test(value)
  })
}

async function unpublishKeepingDraft(publishedId: string) {
  const published = await sanityClient.getDocument(publishedId)
  if (!published) {
    console.log(`  (no published doc ${publishedId})`)
    return
  }

  const existingDraft = await sanityClient.getDocument(DRAFT_ID)
  if (!existingDraft) {
    const {_rev: _ignored, ...rest} = published as Record<string, unknown> & {_rev?: string}
    await sanityClient.createOrReplace({...rest, _id: DRAFT_ID})
    console.log(`  created draft ${DRAFT_ID}`)
  }

  await sanityClient.delete(publishedId)
  console.log(`  unpublished ${publishedId} (draft retained)`)
}

async function main() {
  console.log(`\n[unpublish-plastikkirurgi] project=${PROJECT_ID} dataset=${DATASET} dry=${DRY_RUN}\n`)

  const snapshot = await sanityClient.fetch<{
    treatment?: {_id: string; _type: string} | null
    draft?: {_id: string} | null
    categories: Array<{
      _id: string
      treatments?: Array<{_key?: string; _ref?: string}>
      areas?: Array<{_key?: string; href?: string; title?: unknown}>
    }>
    relatedRefs: Array<{
      _id: string
      items?: Array<{_key?: string; _ref?: string}>
    }>
  }>(
    `{
      "treatment": *[_id == $id][0]{_id, _type},
      "draft": *[_id == $draftId][0]{_id},
      "categories": *[_id in $categoryIds]{
        _id,
        treatments[]{_key, _ref},
        "areas": landingPage.expertAreasSection.areas[]{_key, href, title}
      },
      "relatedRefs": *[
        _type == "treatment" &&
        references($id)
      ]{
        _id,
        "items": relatedSection.items[]{_key, _ref}
      }
    }`,
    {id: DOC_ID, draftId: DRAFT_ID, categoryIds: CATEGORY_IDS},
  )

  console.log('Before:', JSON.stringify(snapshot, null, 2))

  for (const cat of snapshot.categories || []) {
    const treatmentKeys = (cat.treatments || [])
      .filter((t) => t._ref === DOC_ID || t._ref === DRAFT_ID)
      .map((t) => t._key)
      .filter(Boolean) as string[]

    const areaKeys = (cat.areas || [])
      .filter(
        (a) =>
          hrefLooksLikePlastikkirurgi(a.href) || titleLooksLikePlastikkirurgi(a.title),
      )
      .map((a) => a._key)
      .filter(Boolean) as string[]

    if (!treatmentKeys.length && !areaKeys.length) {
      console.log(`  ${cat._id}: no plastikkirurgi listing refs`)
      continue
    }

    console.log(
      `  ${cat._id}: remove treatments[${treatmentKeys.join(',')}] areas[${areaKeys.join(',')}]`,
    )

    if (!DRY_RUN) {
      let patch = sanityClient.patch(cat._id)
      for (const key of treatmentKeys) {
        patch = patch.unset([`treatments[_key=="${key}"]`])
      }
      for (const key of areaKeys) {
        patch = patch.unset([`landingPage.expertAreasSection.areas[_key=="${key}"]`])
      }
      await patch.commit()
    }
  }

  for (const doc of snapshot.relatedRefs || []) {
    const keys = (doc.items || [])
      .filter((i) => i._ref === DOC_ID || i._ref === DRAFT_ID)
      .map((i) => i._key)
      .filter(Boolean) as string[]
    if (!keys.length) continue
    console.log(`  relatedSection on ${doc._id}: remove ${keys.join(',')}`)
    if (!DRY_RUN) {
      let patch = sanityClient.patch(doc._id)
      for (const key of keys) {
        patch = patch.unset([`relatedSection.items[_key=="${key}"]`])
      }
      await patch.commit()
    }
  }

  if (DRY_RUN) {
    console.log('\n(dry run — no writes). Re-run without DRY_RUN to apply.\n')
    return
  }

  if (snapshot.treatment?._id === DOC_ID) {
    await unpublishKeepingDraft(DOC_ID)
  } else {
    console.log(`  published ${DOC_ID} already absent`)
  }

  const after = await sanityClient.fetch(
    `{
      "publishedGone": !defined(*[_id == $id][0]._id),
      "draftKept": defined(*[_id == $draftId][0]._id),
      "stillReferenced": count(*[references($id) || references($draftId)]),
      "categoryTreatments": *[_id in $categoryIds].treatments[]._ref
    }`,
    {id: DOC_ID, draftId: DRAFT_ID, categoryIds: CATEGORY_IDS},
  )
  console.log('\nAfter:', JSON.stringify(after, null, 2))
  console.log('\n✓ Plastikkirurgi unpublished; listings cleaned.\n')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
