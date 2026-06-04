#!/usr/bin/env npx tsx
/**
 * Seed aboutPage.clinicsSection (heading NO/EN). Does not create empty drafts.
 *
 * Usage (from test/):
 *   npm run migrate:about-clinics-section:dry
 *   npm run migrate:about-clinics-section
 */
import { i18nString } from './lib/category-landing-i18n'
import { patchSingletonFields } from './lib/patch-singleton'

const DRY_RUN = process.env.DRY_RUN === '1'

const clinicsSection = {
  showSection: true,
  title: i18nString('Våre klinikker', 'Our clinics'),
  clinics: [],
}

async function run() {
  if (DRY_RUN) {
    console.log('Dry run — would set aboutPage.clinicsSection (title NO/EN, all clinics on site)')
    return
  }

  const patched = await patchSingletonFields(
    'aboutPage',
    { clinicsSection },
    'aboutPage',
  )
  console.log(`✓ aboutPage.clinicsSection — ${patched.join(', ')}`)
  console.log(
    'Clinic rows come from Klinikk documents. Leave «Klinikker» empty in Studio to show all published clinics.',
  )
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
