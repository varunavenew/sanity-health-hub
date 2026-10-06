#!/usr/bin/env npx tsx
/**
 * Ticket #415 — merge duplicate Hysteroskopi pages (Aina 23 Sep 2026).
 *
 * Keep only gynekologi. Unpublish fertilitet duplicate. Clear wrong «fra 2.100»
 * hero price on the surviving page (price list: Office-hysteroskopi 9.500,-).
 *
 * 1. Strip category-fertilitet.treatments[] ref to fert doc
 * 2. Retarget landing «Hva vi tilbyr» / expert area hrefs fert → gyn
 * 3. Replace relatedSection refs fert → gyn (or drop if gyn already listed)
 * 4. Unpublish treatment-fertilitet-hysteroskopi (keep draft)
 * 5. Set gynekologi heroPrice to Office-hysteroskopi 9.500 (remove 2.100)
 *
 * Frontend 301s live in src/lib/seo/legacy-redirects.ts.
 *
 * Usage (from test/):
 *   DRY_RUN=1 npx tsx sanity/merge-hysteroskopi-to-gynekologi-developer.ts
 *   npx tsx sanity/merge-hysteroskopi-to-gynekologi-developer.ts
 *
 * Production:
 *   ALLOW_PRODUCTION_MIGRATION=true SANITY_DATASET=production npx tsx …
 */
import {DATASET, PROJECT_ID, sanityClient} from './config'

const DRY_RUN = process.env.DRY_RUN === '1'
const FERT_ID = 'treatment-fertilitet-hysteroskopi'
const FERT_DRAFT = `drafts.${FERT_ID}`
const GYN_ID = 'treatment-gynekologi-hysteroskopi'
const GYN_DRAFT = `drafts.${GYN_ID}`
const CATEGORY_IDS = ['category-fertilitet', 'drafts.category-fertilitet']

const GYN_HREF_NO = '/gynekologi/hysteroskopi'
const GYN_HREF_BEHANDLINGER = '/behandlinger/gynekologi/hysteroskopi'

function i18nString(no: string, en: string) {
  return [
    {
      _key: 'no',
      _type: 'internationalizedArrayStringValue',
      language: 'no',
      value: no,
    },
    {
      _key: 'en',
      _type: 'internationalizedArrayStringValue',
      language: 'en',
      value: en,
    },
  ]
}

function hrefLooksLikeFertHysteroskopi(href: unknown): boolean {
  if (typeof href !== 'string') return false
  return /fertilitet\/hysteroskopi|fertility\/hysteroskopi|fertility\/diagnostic-hysteroscopy/i.test(
    href,
  )
}

function rewriteFertHysteroskopiHref(href: string): string {
  return href
    .replace(/\/behandlinger\/fertilitet\/hysteroskopi/gi, '/behandlinger/gynekologi/hysteroskopi')
    .replace(/\/behandlinger\/fertility\/hysteroskopi/gi, '/behandlinger/gynecology/hysteroskopi')
    .replace(
      /\/behandlinger\/fertility\/diagnostic-hysteroscopy/gi,
      '/behandlinger/gynecology/hysteroskopi',
    )
    .replace(/\/fertilitet\/hysteroskopi/gi, '/gynekologi/hysteroskopi')
    .replace(/\/fertility\/hysteroskopi/gi, '/gynecology/hysteroskopi')
    .replace(/\/fertility\/diagnostic-hysteroscopy/gi, '/gynecology/hysteroskopi')
}

async function unpublishKeepingDraft(publishedId: string) {
  const published = await sanityClient.getDocument(publishedId)
  if (!published) {
    console.log(`  (no published doc ${publishedId})`)
    return
  }

  const existingDraft = await sanityClient.getDocument(FERT_DRAFT)
  if (!existingDraft) {
    const {_rev: _ignored, ...rest} = published as Record<string, unknown> & {_rev?: string}
    await sanityClient.createOrReplace({...rest, _id: FERT_DRAFT})
    console.log(`  created draft ${FERT_DRAFT}`)
  }

  await sanityClient.delete(publishedId)
  console.log(`  unpublished ${publishedId} (draft retained)`)
}

async function setGynHeroPrice(docId: string, currentPriceNo: string | null | undefined) {
  const priceNo = currentPriceNo || ''
  const already9500 = /9[.\s]?500/.test(priceNo)
  const looksLike2100 = /2[.\s]?100/.test(priceNo)
  if (already9500 && !looksLike2100) {
    console.log(`  ${docId}: heroPrice already 9.500 — leave as is`)
    return
  }

  console.log(
    `  ${docId}: set heroPrice to Office-hysteroskopi 9.500 (was ${JSON.stringify(priceNo)})`,
  )
  if (!DRY_RUN) {
    await sanityClient
      .patch(docId)
      .set({
        heroPrice: i18nString('Pris fra 9.500 kr', 'From NOK 9,500'),
        heroPriceLabel: i18nString('Office-hysteroskopi', 'Office hysteroscopy'),
      })
      .unset(['hideHeroPrice'])
      .commit()
  }
}

async function main() {
  console.log(
    `\n[merge-hysteroskopi] project=${PROJECT_ID} dataset=${DATASET} dry=${DRY_RUN}\n`,
  )

  const snapshot = await sanityClient.fetch<{
    fert?: {_id: string} | null
    gyn?: {
      _id: string
      priceNo?: string | null
    } | null
    gynDraft?: {
      _id: string
      priceNo?: string | null
    } | null
    categories: Array<{
      _id: string
      treatments?: Array<{_key?: string; _ref?: string}>
    }>
    relatedRefs: Array<{
      _id: string
      items?: Array<{_key?: string; _ref?: string}>
    }>
  }>(
    `{
      "fert": *[_id == $fertId][0]{_id},
      "gyn": *[_id == $gynId][0]{
        _id,
        "priceNo": heroPrice[_key=="no"][0].value
      },
      "gynDraft": *[_id == $gynDraftId][0]{
        _id,
        "priceNo": heroPrice[_key=="no"][0].value
      },
      "categories": *[_id in $categoryIds]{
        _id,
        treatments[]{_key, _ref}
      },
      "relatedRefs": *[
        _type == "treatment" &&
        references($fertId)
      ]{
        _id,
        "items": relatedSection.items[]{_key, _ref}
      }
    }`,
    {fertId: FERT_ID, gynId: GYN_ID, gynDraftId: GYN_DRAFT, categoryIds: CATEGORY_IDS},
  )

  console.log('Before gyn hero:', snapshot.gyn)
  console.log(
    'Fert published:',
    Boolean(snapshot.fert),
    '| related refs:',
    (snapshot.relatedRefs || []).length,
  )

  // 1. Strip fert from category treatments[]
  for (const cat of snapshot.categories || []) {
    const treatmentKeys = (cat.treatments || [])
      .filter((t) => t._ref === FERT_ID || t._ref === FERT_DRAFT)
      .map((t) => t._key)
      .filter(Boolean) as string[]

    if (!treatmentKeys.length) {
      console.log(`  ${cat._id}: no fert hysteroskopi in treatments[]`)
      continue
    }

    console.log(`  ${cat._id}: remove treatments[${treatmentKeys.join(',')}]`)
    if (!DRY_RUN) {
      let patch = sanityClient.patch(cat._id)
      for (const key of treatmentKeys) {
        patch = patch.unset([`treatments[_key=="${key}"]`])
      }
      await patch.commit()
    }
  }

  // 2. Rewrite landing hrefs fert → gyn
  const landingDocs = await sanityClient.fetch<
    Array<{
      _id: string
      groups?: Array<{
        _key?: string
        items?: Array<{_key?: string; href?: string}>
      }>
      areas?: Array<{_key?: string; href?: string}>
    }>
  >(
    `*[
      defined(landingPage.servicesSection) ||
      defined(landingPage.expertAreasSection)
    ]{
      _id,
      "groups": landingPage.servicesSection.groups[]{
        _key,
        items[]{_key, href}
      },
      "areas": landingPage.expertAreasSection.areas[]{_key, href}
    }`,
  )

  for (const doc of landingDocs || []) {
    const sets: Record<string, string> = {}
    for (const group of doc.groups || []) {
      for (const item of group.items || []) {
        if (item._key && group._key && hrefLooksLikeFertHysteroskopi(item.href)) {
          const path = `landingPage.servicesSection.groups[_key=="${group._key}"].items[_key=="${item._key}"].href`
          sets[path] = rewriteFertHysteroskopiHref(item.href!)
        }
      }
    }
    for (const area of doc.areas || []) {
      if (area._key && hrefLooksLikeFertHysteroskopi(area.href)) {
        const path = `landingPage.expertAreasSection.areas[_key=="${area._key}"].href`
        sets[path] = rewriteFertHysteroskopiHref(area.href!)
      }
    }
    const count = Object.keys(sets).length
    if (!count) continue

    console.log(`  ${doc._id}: rewrite ${count} href(s) → ${GYN_HREF_NO}`)
    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).set(sets).commit()
    }
  }

  // 3. relatedSection: swap fert ref → gyn, or drop if gyn already present
  for (const doc of snapshot.relatedRefs || []) {
    const items = doc.items || []
    const fertKeys = items
      .filter((i) => i._ref === FERT_ID || i._ref === FERT_DRAFT)
      .map((i) => i._key)
      .filter(Boolean) as string[]
    if (!fertKeys.length) continue

    const hasGyn = items.some((i) => i._ref === GYN_ID || i._ref === GYN_DRAFT)

    if (hasGyn) {
      console.log(`  relatedSection on ${doc._id}: remove fert (gyn already listed)`)
      if (!DRY_RUN) {
        let patch = sanityClient.patch(doc._id)
        for (const key of fertKeys) {
          patch = patch.unset([`relatedSection.items[_key=="${key}"]`])
        }
        await patch.commit()
      }
      continue
    }

    const [first, ...rest] = fertKeys
    console.log(`  relatedSection on ${doc._id}: retarget ${first} → ${GYN_ID}`)
    if (!DRY_RUN) {
      let patch = sanityClient.patch(doc._id).set({
        [`relatedSection.items[_key=="${first}"]._ref`]: GYN_ID,
      })
      for (const key of rest) {
        patch = patch.unset([`relatedSection.items[_key=="${key}"]`])
      }
      await patch.commit()
    }
  }

  // 4. Unpublish fert treatment
  if (DRY_RUN) {
    console.log(`  DRY: would unpublish ${FERT_ID}`)
  } else {
    await unpublishKeepingDraft(FERT_ID)
  }

  // 5. Fix gynekologi hero price — remove 2.100, set Office-hysteroskopi 9.500
  if (snapshot.gyn) {
    await setGynHeroPrice(GYN_ID, snapshot.gyn.priceNo)
  } else {
    console.log(`  (no published ${GYN_ID})`)
  }
  if (snapshot.gynDraft) {
    await setGynHeroPrice(GYN_DRAFT, snapshot.gynDraft.priceNo)
  }

  console.log('\nDone. Verify:')
  console.log(`  - ${GYN_HREF_NO} shows Pris fra 9.500 kr`)
  console.log(`  - /fertilitet/hysteroskopi 301s (frontend redirects)`)
  console.log(`  - price list Office-hysteroskopi → ${GYN_HREF_BEHANDLINGER}`)
  console.log('')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
