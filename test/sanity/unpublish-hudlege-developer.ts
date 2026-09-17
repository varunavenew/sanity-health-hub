#!/usr/bin/env npx tsx
/**
 * Remove duplicate Hudlege from Flere tjenester — keep Hudhelse only.
 *
 * - Strip listing refs to `treatment-flere-fagomrader-hudlege`
 * - Unpublish published hudlege (keep/create draft)
 * - Delete orphan draft if requested via DELETE_DRAFT=1
 * - Fix Norwegian title on hudhelse when it still says "Hudlege"
 *
 * Usage (from test/):
 *   DRY_RUN=1 npx tsx sanity/unpublish-hudlege-developer.ts
 *   npx tsx sanity/unpublish-hudlege-developer.ts
 *
 * Production (where the live megamenu duplicate is):
 *   ALLOW_PRODUCTION_MIGRATION=true SANITY_DATASET_FORCE=production npx tsx sanity/unpublish-hudlege-developer.ts
 */
import {sanityClient, DATASET, PROJECT_ID} from './config'

const DRY_RUN = process.env.DRY_RUN === '1'
const DELETE_DRAFT = process.env.DELETE_DRAFT === '1'
const DOC_ID = 'treatment-flere-fagomrader-hudlege'
const DRAFT_ID = `drafts.${DOC_ID}`
const HUDHELSE_ID = 'treatment-flere-fagomrader-hudhelse'
const CATEGORY_IDS = ['category-flere-fagomrader', 'drafts.category-flere-fagomrader']

function hrefLooksLikeHudlege(href: unknown): boolean {
  if (typeof href !== 'string') return false
  // Only retire the old /hudlege path — /hudhelse stays.
  return /\/hudlege(\/|$|\?)/i.test(href) && !/\/hudhelse(\/|$|\?)/i.test(href)
}

function titleLooksLikeHudlegeOnly(_title: unknown): boolean {
  // Do not match on title alone — production briefly titled Hudhelse as "Hudlege".
  return false
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
  console.log(`\n[unpublish-hudlege] project=${PROJECT_ID} dataset=${DATASET} dry=${DRY_RUN}\n`)

  const inventory = await sanityClient.fetch(
    `*[
      _type == "treatment" && (
        _id in [$hudlege, $draft, $hudhelse] ||
        count(slug[value.current in ["hudlege","hudhelse","physician","skin-health"]]) > 0
      )
    ] | order(_id asc) {
      _id,
      "slugs": slug[].value.current,
      "titles": title[]{language, value}
    }`,
    {hudlege: DOC_ID, draft: DRAFT_ID, hudhelse: HUDHELSE_ID},
  )
  console.log('Skin treatments inventory:', JSON.stringify(inventory, null, 2))

  const snapshot = await sanityClient.fetch<{
    treatment?: {_id: string} | null
    draft?: {_id: string} | null
    hudhelse?: {
      _id: string
      title?: Array<{_key?: string; language?: string; value?: string}>
    } | null
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
      "treatment": *[_id == $id][0]{_id},
      "draft": *[_id == $draftId][0]{_id},
      "hudhelse": *[_id == $hudhelseId][0]{_id, title},
      "categories": *[_id in $categoryIds]{
        _id,
        treatments[]{_key, _ref},
        "areas": landingPage.expertAreasSection.areas[]{_key, href, title}
      },
      "relatedRefs": *[
        _type == "treatment" &&
        (references($id) || references($draftId))
      ]{
        _id,
        "items": relatedSection.items[]{_key, _ref}
      }
    }`,
    {
      id: DOC_ID,
      draftId: DRAFT_ID,
      hudhelseId: HUDHELSE_ID,
      categoryIds: CATEGORY_IDS,
    },
  )

  console.log('Before categories/refs:', JSON.stringify({
    treatment: snapshot.treatment,
    draft: snapshot.draft,
    hudhelseTitles: snapshot.hudhelse?.title,
    categories: snapshot.categories,
    relatedRefs: snapshot.relatedRefs,
  }, null, 2))

  for (const cat of snapshot.categories || []) {
    const treatmentKeys = (cat.treatments || [])
      .filter((t) => t._ref === DOC_ID || t._ref === DRAFT_ID)
      .map((t) => t._key)
      .filter(Boolean) as string[]

    const areaKeys = (cat.areas || [])
      .filter(
        (a) => hrefLooksLikeHudlege(a.href) || titleLooksLikeHudlegeOnly(a.title),
      )
      .map((a) => a._key)
      .filter(Boolean) as string[]

    if (!treatmentKeys.length && !areaKeys.length) {
      console.log(`  ${cat._id}: no hudlege listing refs`)
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

  const noTitle = snapshot.hudhelse?.title?.find(
    (row) => row.language === 'no' || row._key === 'no',
  )
  if (noTitle?.value?.trim() === 'Hudlege') {
    console.log(`  ${HUDHELSE_ID}: rename NO title Hudlege → Hudhelse`)
    if (!DRY_RUN) {
      const nextTitle = (snapshot.hudhelse?.title || []).map((row) =>
        row.language === 'no' || row._key === 'no'
          ? {...row, value: 'Hudhelse'}
          : row,
      )
      await sanityClient.patch(HUDHELSE_ID).set({title: nextTitle}).commit()
    }
  } else {
    console.log(`  ${HUDHELSE_ID}: NO title already ok (${noTitle?.value ?? 'missing'})`)
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

  if (DELETE_DRAFT) {
    const draft = await sanityClient.getDocument(DRAFT_ID)
    if (draft) {
      await sanityClient.delete(DRAFT_ID)
      console.log(`  deleted draft ${DRAFT_ID}`)
    }
  }

  const after = await sanityClient.fetch(
    `{
      "publishedGone": !defined(*[_id == $id][0]._id),
      "draftKept": defined(*[_id == $draftId][0]._id),
      "hudhelseTitleNo": *[_id == $hudhelseId][0].title[language == "no"][0].value,
      "categoryTreatments": *[_id == "category-flere-fagomrader"][0].treatments[]->{
        _id,
        "slug": slug[language == "no"][0].value.current,
        "titleNo": title[language == "no"][0].value
      }
    }`,
    {id: DOC_ID, draftId: DRAFT_ID, hudhelseId: HUDHELSE_ID},
  )
  console.log('\nAfter:', JSON.stringify(after, null, 2))
  console.log('\n✓ Hudlege removed from listings; Hudhelse kept.\n')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
