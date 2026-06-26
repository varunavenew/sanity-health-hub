#!/usr/bin/env npx tsx
/**
 * Seed guidePage singleton with hero + CTA copy from the former hardcoded Guide page.
 *
 * Run:
 *   cd test && npm run migrate:guide-page:dry
 *   cd test && npm run migrate:guide-page
 */
import { randomBytes } from 'crypto'
import { patchSingletonFields } from './lib/patch-singleton'
import { i18nString, i18nText } from './lib/category-landing-i18n'

const DRY_RUN = process.env.DRY_RUN === '1'
const DOCUMENT_ID = 'guidePage'

function randomKey(): string {
  return randomBytes(8).toString('hex')
}

function buildSlugField() {
  return [
    {
      _key: randomKey(),
      _type: 'internationalizedArraySlugValue',
      language: 'no',
      value: { _type: 'slug', current: 'guide' },
    },
    {
      _key: randomKey(),
      _type: 'internationalizedArraySlugValue',
      language: 'en',
      value: { _type: 'slug', current: 'guide' },
    },
  ]
}

async function run() {
  console.log('▶ Migrate guidePage singleton')
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  const fields = {
    heroTitle: i18nString('Våre Behandlinger', 'Our Treatments'),
    slug: buildSlugField(),
    heroSubtitle: i18nText(
      'Spesialiserte behandlinger for kvinnen og mannens underliv',
      "Specialized treatments for women's and men's intimate health",
    ),
    showCategorySections: true,
    ctaTitle: i18nString('Klar til å starte?', 'Ready to get started?'),
    ctaSubtitle: i18nText(
      'Book en time hos våre spesialister i dag. Ingen henvisning nødvendig.',
      'Book an appointment with our specialists today. No referral needed.',
    ),
    ctaButtonLabel: i18nString('Book time nå', 'Book now'),
    ctaButtonPath: '/booking',
  }

  if (DRY_RUN) {
    console.log('  Would patch guidePage with:', JSON.stringify(fields, null, 2))
    console.log('\n✓ Dry run complete')
    return
  }

  const patched = await patchSingletonFields(DOCUMENT_ID, fields, 'guidePage')
  console.log(`  Patched: ${patched.join(', ')}`)
  console.log('\n✓ Done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
