/**
 * Developer-only Contact page normalization vs avenewdemo reference.
 * SAFETY: refuses non-developer datasets. Production NOT touched.
 *
 * - Reorder clinicsSection to Majorstuen → Bekkestua → Moss → Moelv
 * - Fix ctaCards[1] Norwegian copy: "booking" → "bestilling"
 * - Contact booking CTA: unset shared collection; use inline "bestilling" subtitle
 *   (same pattern as clinicsPage — do not mutate shared collection used by homepage/about/services)
 */
import {createClient} from '@sanity/client'
import {config as loadEnv} from 'dotenv'
import path from 'path'

loadEnv({path: path.join(process.cwd(), '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env')})

const PROJECT_ID =
  process.env.SANITY_STUDIO_PROJECT_ID?.trim() ||
  process.env.SANITY_PROJECT_ID?.trim()
const TOKEN = process.env.SANITY_TOKEN?.trim()
const DATASET = 'developer'
const DRY_RUN = process.env.DRY_RUN === '1'

if (!PROJECT_ID || !TOKEN) {
  console.error('Missing project/token')
  process.exit(1)
}

console.log(`SAFETY CHECK:\nproject=${PROJECT_ID}\ndataset=${DATASET}`)
if (DATASET !== 'developer') {
  throw new Error('Refusing non-developer dataset')
}
if (PROJECT_ID !== '9jhqpk3a') {
  throw new Error(`Unexpected project id: ${PROJECT_ID}`)
}

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: TOKEN,
})

const CLINIC_ORDER = [
  'clinicPage-majorstuen',
  'clinicPage-bekkestua',
  'clinicPage-moss',
  'clinicPage-moelv',
] as const

const i18nText = (no: string, en: string) => [
  {_key: 'no', _type: 'internationalizedArrayTextValue', language: 'no', value: no},
  {_key: 'en', _type: 'internationalizedArrayTextValue', language: 'en', value: en},
]

async function run() {
  const page = await client.fetch<{
    _id: string
    clinicsSection?: {clinics?: {_ref: string; _key?: string; _type?: string}[]}
    ctaCards?: {description?: {language?: string; value?: string}[]}[]
  } | null>(`*[_id=="contactPage"][0]{
    _id,
    clinicsSection{clinics[]{_key,_type,_ref}},
    ctaCards[]{description}
  }`)

  if (!page?._id) {
    throw new Error('contactPage not found on developer')
  }

  const orderedClinics = CLINIC_ORDER.map((id, i) => {
    const existing = page.clinicsSection?.clinics?.find((c) => c._ref === id)
    return {
      _type: 'reference' as const,
      _ref: id,
      _key: existing?._key || `clinic-${i + 1}`,
    }
  })

  const bookingSubtitleNo =
    'Velg tjeneste, klinikk og behandler – alt i én enkel bestilling.'
  const bookingSubtitleEn =
    'Choose service, clinic and practitioner – all in one simple booking.'
  const cardBookingDescNo = bookingSubtitleNo
  const cardBookingDescEn = bookingSubtitleEn

  console.log('Will set clinicsSection order:', CLINIC_ORDER.join(' → '))
  console.log('Will set ctaCards[1].description NO → bestilling')
  console.log('Will unset contactPage-booking-cta.ctaCollection and set inline subtitle')

  if (DRY_RUN) {
    console.log('DRY_RUN=1 — no writes')
    return
  }

  await client
    .patch('contactPage')
    .set({
      'clinicsSection.clinics': orderedClinics,
      'ctaCards[1].description': i18nText(cardBookingDescNo, cardBookingDescEn),
      'pageSections[_key=="contactPage-booking-cta"].subtitle': i18nText(
        bookingSubtitleNo,
        bookingSubtitleEn,
      ),
    })
    .unset(['pageSections[_key=="contactPage-booking-cta"].ctaCollection'])
    .commit({autoGenerateArrayKeys: true})

  console.log('✓ Patched contactPage')
  console.log('Developer Contact normalization complete. Production NOT touched.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
