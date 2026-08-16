#!/usr/bin/env npx tsx
/**
 * Update the homepage patientTrustBanner stat content:
 * "150 000 +" satisfied-patients copy → "60 000 +" patient-visits-per-year copy.
 *
 * Usage (from test/):
 *   npm run migrate:patient-trust-banner:dry
 *   npm run migrate:patient-trust-banner
 *
 * Production (Windows-safe):
 *   npm run migrate:patient-trust-banner:production:dry
 *   npm run migrate:patient-trust-banner:production
 */
import {sanityClient, DATASET, PROJECT_ID} from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

const NEW_VALUE = '60 000 +'
const NEW_LABEL = [
  {_key: 'no', _type: 'internationalizedArrayStringValue', language: 'no', value: 'Pasientbesøk i året.'},
  {_key: 'en', _type: 'internationalizedArrayStringValue', language: 'en', value: 'Patient visits per year.'},
]
const NEW_CTA_TEXT = [
  {_key: 'no', _type: 'internationalizedArrayStringValue', language: 'no', value: 'Se alle våre tjenester'},
  {_key: 'en', _type: 'internationalizedArrayStringValue', language: 'en', value: 'See all our services'},
]

async function run() {
  console.log('=== Homepage patient trust banner migration ===')
  console.log(`  projectId: ${PROJECT_ID}`)
  console.log(`  dataset (resolved): ${DATASET}`)
  console.log(`  DRY_RUN: ${DRY_RUN}`)

  const doc = await sanityClient.fetch<{_id: string; value?: string} | null>(
    `*[_type == "homepage"][0]{_id, "value": patientTrustBanner.value}`,
  )

  if (!doc) {
    console.error('✗ No homepage document found.')
    process.exit(1)
  }

  console.log(`\nFound homepage document: ${doc._id}`)
  console.log(`  current value: ${JSON.stringify(doc.value)}`)
  console.log(`  new value:     ${JSON.stringify(NEW_VALUE)}`)

  if (DRY_RUN) {
    console.log('\n[dry-run] would patch patientTrustBanner.value/label/ctaText')
    return
  }

  await sanityClient
    .patch(doc._id)
    .set({
      'patientTrustBanner.value': NEW_VALUE,
      'patientTrustBanner.label': NEW_LABEL,
      'patientTrustBanner.ctaText': NEW_CTA_TEXT,
    })
    .commit()

  console.log(`\n✔ patched ${doc._id}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
