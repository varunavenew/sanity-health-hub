/**
 * Developer-only: fix homepage publish blocker + seed specialistsSection copy.
 *
 * - Removes weak draft-only treatmentCategory ref b4214fc9-… from Home
 * - Seeds Heading / Intro (NO + EN) from previous i18n defaults
 * - Publishes homepage draft
 *
 * NEVER run against production.
 */
import {randomUUID} from 'crypto'
import {sanityClient as client, DATASET} from './config'

const BAD_CATEGORY_ID = 'b4214fc9-c4dd-4f34-ba39-f4453bea2e78'
const BAD_REF_KEY = '843febf534c6'

const HEADING = {
  no: 'Møt våre spesialister',
  en: 'Meet our specialists',
}
const INTRO = {
  no: 'Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.',
  en: 'Experience, expertise and modern technology in one place.',
}

function i18nString(no: string, en: string, existing?: {_key?: string; language?: string}[]) {
  const noKey =
    existing?.find((e) => e.language === 'no')?._key || randomUUID().replace(/-/g, '').slice(0, 32)
  const enKey =
    existing?.find((e) => e.language === 'en')?._key || randomUUID().replace(/-/g, '').slice(0, 32)
  return [
    {_key: noKey, _type: 'internationalizedArrayStringValue', language: 'no', value: no},
    {_key: enKey, _type: 'internationalizedArrayStringValue', language: 'en', value: en},
  ]
}

function i18nText(no: string, en: string, existing?: {_key?: string; language?: string}[]) {
  const noKey =
    existing?.find((e) => e.language === 'no')?._key || randomUUID().replace(/-/g, '').slice(0, 32)
  const enKey =
    existing?.find((e) => e.language === 'en')?._key || randomUUID().replace(/-/g, '').slice(0, 32)
  return [
    {_key: noKey, _type: 'internationalizedArrayTextValue', language: 'no', value: no},
    {_key: enKey, _type: 'internationalizedArrayTextValue', language: 'en', value: en},
  ]
}

async function publishHomepage() {
  const draft = await client.fetch<Record<string, unknown> | null>(
    `*[_id=="drafts.homepage"][0]`,
  )
  if (!draft) {
    console.log('No draft to publish')
    return
  }
  const doc = {...draft, _id: 'homepage'} as Record<string, unknown>
  delete doc._rev
  delete doc._updatedAt
  delete doc._createdAt
  await client
    .transaction()
    .createOrReplace(doc)
    .delete('drafts.homepage')
    .commit({visibility: 'sync'})
}

async function main() {
  if (DATASET !== 'developer') {
    throw new Error(`Refusing to run: dataset is "${DATASET}", expected "developer"`)
  }

  console.log(`Dataset: ${DATASET}`)

  const draft = await client.fetch<{
    _id: string
    serviceCategories?: {_key: string; _ref: string}[]
    specialistsSection?: {
      heading?: {_key?: string; language?: string}[]
      intro?: {_key?: string; language?: string}[]
    }
  } | null>(`*[_id=="drafts.homepage"][0]{_id,serviceCategories,specialistsSection}`)

  const published = await client.fetch<{
    _id: string
    specialistsSection?: {
      heading?: {_key?: string; language?: string}[]
      intro?: {_key?: string; language?: string}[]
    }
  } | null>(`*[_id=="homepage"][0]{_id,specialistsSection}`)

  if (!draft && !published) {
    throw new Error('No homepage document found')
  }

  const targetId = draft?._id || 'drafts.homepage'
  const section = draft?.specialistsSection || published?.specialistsSection

  // Ensure we edit a draft
  if (!draft) {
    await client.createOrReplace({
      ...(await client.fetch(`*[_id=="homepage"][0]`)),
      _id: 'drafts.homepage',
    })
  }

  const cats = draft?.serviceCategories || []
  const hadBad = cats.some((c) => c._ref === BAD_CATEGORY_ID || c._key === BAD_REF_KEY)
  const cleanedCats = cats.filter(
    (c) => c._ref !== BAD_CATEGORY_ID && c._key !== BAD_REF_KEY,
  )

  const heading = i18nString(HEADING.no, HEADING.en, section?.heading)
  const intro = i18nText(INTRO.no, INTRO.en, section?.intro)

  const patch = client.patch(targetId).set({
    'specialistsSection.heading': heading,
    'specialistsSection.intro': intro,
  })

  if (hadBad) {
    patch.set({serviceCategories: cleanedCats})
  }

  await patch.commit({autoGenerateArrayKeys: true})
  console.log(
    JSON.stringify(
      {
        patched: targetId,
        removedBadCategoryRef: hadBad,
        removedRef: hadBad ? BAD_CATEGORY_ID : null,
        remainingCategories: cleanedCats.length,
        seededHeading: HEADING,
        seededIntro: INTRO,
      },
      null,
      2,
    ),
  )

  // Verify no remaining weak draft-only category refs
  const check = await client.fetch(`*[_id=="drafts.homepage"][0]{
    "badStillPresent": count(serviceCategories[_ref == $bad]) > 0,
    "weakRefs": serviceCategories[_weak == true]{_ref},
    "headingNo": specialistsSection.heading[language=="no"][0].value,
    "headingEn": specialistsSection.heading[language=="en"][0].value,
    "introNo": specialistsSection.intro[language=="no"][0].value,
    "introEn": specialistsSection.intro[language=="en"][0].value
  }`, {bad: BAD_CATEGORY_ID})
  console.log('pre-publish check:', JSON.stringify(check, null, 2))

  if (check.badStillPresent) {
    throw new Error('Bad category ref still present after patch')
  }

  await publishHomepage()
  console.log('Published homepage')

  const after = await client.fetch(`{
    "published": *[_id=="homepage"][0]{
      "badRef": count(serviceCategories[_ref == $bad]),
      "catCount": count(serviceCategories),
      "headingNo": specialistsSection.heading[language=="no"][0].value,
      "introNo": specialistsSection.intro[language=="no"][0].value,
      "displayMode": specialistsSection.displayMode,
      "manualCount": count(specialistsSection.specialists)
    },
    "draftExists": count(*[_id=="drafts.homepage"]),
    "orphanCategoryDraft": count(*[_id==$orphan]),
    "dataset": $dataset
  }`, {bad: BAD_CATEGORY_ID, orphan: `drafts.${BAD_CATEGORY_ID}`, dataset: DATASET})
  console.log('after publish:', JSON.stringify(after, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
