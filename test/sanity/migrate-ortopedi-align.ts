/**
 * Align Orthopedics category landing with Lovable reference.
 *
 * Verified against https://sanity-care-craft.lovable.app/ortopedi:
 *  - sectionOrder: results before services (same pattern as Urology)
 *  - specialists: title, description, limit matching reference (~15 cards)
 *
 * Note: symptomsSection.background was previously written here but the field
 * was removed from schema; do not reintroduce it (Studio "Unknown field").
 *
 * Developer is source of truth for content already correct (reviews, services,
 * expert areas, journey). Production receives only mismatched fields.
 *
 * Does NOT overwrite Production stats (different but valid values).
 * Does NOT duplicate assets.
 *
 * Usage:
 *   cd test && DRY_RUN=1 npx tsx sanity/migrate-ortopedi-align.ts
 *   cd test && npx tsx sanity/migrate-ortopedi-align.ts
 *   cd test && ALLOW_PRODUCTION_MIGRATION=true npx tsx sanity/migrate-ortopedi-align.ts --production
 */
import {createClient, type SanityClient} from '@sanity/client'
import {config as loadEnv} from 'dotenv'
import path from 'path'
import {requireSanityProjectId} from './dataset-env'

loadEnv({path: path.join(process.cwd(), '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env')})

const DRY_RUN = process.env.DRY_RUN === '1'
const DO_PRODUCTION =
  process.argv.includes('--production') ||
  process.env.ALLOW_PRODUCTION_MIGRATION === 'true'

const PROJECT_ID = requireSanityProjectId()
const TOKEN = process.env.SANITY_TOKEN?.trim()
if (!TOKEN) {
  console.error('Missing SANITY_TOKEN')
  process.exit(1)
}

const DOC_ID = 'category-ortopedi'

/** Match Lovable / Urology: symptoms → results → services → reviews. */
const SECTION_ORDER = [
  'segments',
  'why',
  'audiences',
  'expertAreas',
  'symptoms',
  'results',
  'services',
  'support',
  'reviews',
  'spotlight',
  'journey',
]

function i18nString(no: string, en: string) {
  return [
    {
      _type: 'internationalizedArrayStringValue',
      _key: 'no',
      language: 'no',
      value: no,
    },
    {
      _type: 'internationalizedArrayStringValue',
      _key: 'en',
      language: 'en',
      value: en,
    },
  ]
}

function i18nText(no: string, en: string) {
  return [
    {
      _type: 'internationalizedArrayTextValue',
      _key: 'no',
      language: 'no',
      value: no,
    },
    {
      _type: 'internationalizedArrayTextValue',
      _key: 'en',
      language: 'en',
      value: en,
    },
  ]
}

function clientFor(dataset: string): SanityClient {
  return createClient({
    projectId: PROJECT_ID,
    dataset,
    apiVersion: '2024-01-01',
    token: TOKEN,
    useCdn: false,
  })
}

function sameOrder(a: unknown, b: string[]) {
  if (!Array.isArray(a) || a.length !== b.length) return false
  return a.every((v, i) => v === b[i])
}

type Snap = {
  _id: string
  sectionOrder?: string[] | null
  symptomsBg?: string | null
  specialists?: Array<{
    _key: string
    titleNo?: string | null
    descriptionNo?: string | null
    limit?: number | null
    seeAllLabelNo?: string | null
  }>
}

const SNAP_Q = `*[_id == $id][0]{
  _id,
  "sectionOrder": landingPage.sectionOrder,
  "symptomsBg": landingPage.symptomsSection.background,
  "specialists": pageSections[_type == "pageSectionSpecialists"]{
    _key,
    "titleNo": coalesce(title[language=="no"][0].value, title[_key=="no"][0].value),
    "descriptionNo": coalesce(description[language=="no"][0].value, description[_key=="no"][0].value),
    limit,
    "seeAllLabelNo": coalesce(seeAllLabel[language=="no"][0].value, seeAllLabel[_key=="no"][0].value)
  }
}`

async function patchOrtopedi(client: SanityClient, label: string) {
  const snap = await client.fetch<Snap | null>(SNAP_Q, {id: DOC_ID})
  if (!snap) {
    console.log(`  ✗ ${label}: missing ${DOC_ID}`)
    return
  }

  console.log(`  ${label} before:`, {
    sectionOrder: snap.sectionOrder,
    symptomsBg: snap.symptomsBg,
    specialists: snap.specialists?.map((s) => ({
      _key: s._key,
      titleNo: s.titleNo,
      limit: s.limit,
      descriptionNo: s.descriptionNo,
    })),
  })

  const patch: Record<string, unknown> = {}

  if (!sameOrder(snap.sectionOrder, SECTION_ORDER)) {
    patch['landingPage.sectionOrder'] = SECTION_ORDER
  }

  const spec = snap.specialists?.[0]
  if (spec?._key) {
    const k = spec._key
    if (spec.titleNo !== 'Ortopedene som følger deg.') {
      patch[`pageSections[_key=="${k}"].title`] = i18nString(
        'Ortopedene som følger deg.',
        'The orthopedists who support you.',
      )
    }
    if (
      !spec.descriptionNo ||
      spec.descriptionNo !==
        'Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.'
    ) {
      patch[`pageSections[_key=="${k}"].description`] = i18nText(
        'Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.',
        'Experience, specialist expertise and modern technology in one place.',
      )
    }
    // Lovable shows all category specialists (~15); keep enough headroom.
    if (spec.limit == null || spec.limit < 16) {
      patch[`pageSections[_key=="${k}"].limit`] = 16
    }
    if (spec.seeAllLabelNo !== 'Se alle ortopeder') {
      patch[`pageSections[_key=="${k}"].seeAllLabel`] = i18nString(
        'Se alle ortopeder',
        'See all orthopedists',
      )
    }
  }

  if (Object.keys(patch).length === 0) {
    console.log(`  · ${label}: already aligned`)
    return
  }

  console.log(`  ${label} patch keys:`, Object.keys(patch))
  if (DRY_RUN) {
    console.log('  · DRY_RUN — skip write')
    return
  }
  await client.patch(DOC_ID).set(patch).commit({autoGenerateArrayKeys: false})
  console.log(`  ✓ ${label} patched`)
}

async function run() {
  console.log(DRY_RUN ? '🔍 DRY_RUN' : '✍️  WRITE')
  console.log(`Production writes: ${DO_PRODUCTION ? 'yes' : 'no'}`)

  await patchOrtopedi(clientFor('developer'), 'developer')

  if (DO_PRODUCTION) {
    await patchOrtopedi(clientFor('production'), 'production')
  } else {
    console.log(
      '  · Skipping Production (pass --production or ALLOW_PRODUCTION_MIGRATION=true)',
    )
  }

  console.log('\nDone.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
