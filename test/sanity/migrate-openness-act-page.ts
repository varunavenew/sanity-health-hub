#!/usr/bin/env npx tsx
/**
 * Seed opennessActPage singleton (Transparency Act / Åpenhetsloven 2025).
 *
 * Run:
 *   cd test && DRY_RUN=1 npx tsx sanity/migrate-openness-act-page.ts
 *   cd test && npx tsx sanity/migrate-openness-act-page.ts
 */
import { randomBytes } from 'crypto'
import { patchSingletonFields } from './lib/patch-singleton'
import { i18nString, i18nText } from './lib/category-landing-i18n'

const DRY_RUN = process.env.DRY_RUN === '1'
const DOCUMENT_ID = 'opennessActPage'

function randomKey(): string {
  return randomBytes(8).toString('hex')
}

function textBlock(text: string): Record<string, unknown> {
  return {
    _type: 'block',
    _key: randomKey(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: randomKey(), text, marks: [] }],
  }
}

function i18nBlockContent(no: string, en: string) {
  return [
    {
      _key: randomKey(),
      _type: 'internationalizedArrayBlockContentValue',
      language: 'no',
      value: [textBlock(no)],
    },
    {
      _key: randomKey(),
      _type: 'internationalizedArrayBlockContentValue',
      language: 'en',
      value: [textBlock(en)],
    },
  ]
}

function buildSlugField() {
  return [
    {
      _key: randomKey(),
      _type: 'internationalizedArraySlugValue',
      language: 'no',
      value: { _type: 'slug', current: 'aapenhetsloven-2025' },
    },
    {
      _key: randomKey(),
      _type: 'internationalizedArraySlugValue',
      language: 'en',
      value: { _type: 'slug', current: 'transparency-act-2025' },
    },
  ]
}

const BODY_NO =
  'CMedical er Nordens ledende klinikk for kvinnen og mannens underliv med flere spesialistklinikker i Norge og Sverige. Selskapet har blant annet bygget opp egne fertilitetsklinikker i Stockholm, Uppsala og Oslo, og kjøpte senest opp Livio i Oslo. CMedical kjøpte også opp den kjente kvinnehelsetjenesten HerCare i Sverige. CMedical har ellers store fagmiljøer på gynekologi, ortopedi og urologi.'

const BODY_EN =
  'CMedical is the leading Nordic clinic for women’s and men’s intimate health, with several specialist clinics in Norway and Sweden. The company has built its own fertility clinics in Stockholm, Uppsala and Oslo, and most recently acquired Livio in Oslo. CMedical also acquired the well-known women’s health service HerCare in Sweden. CMedical has large professional environments in gynecology, orthopedics and urology.'

async function run() {
  console.log('▶ Migrate opennessActPage singleton')
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  const fields = {
    breadcrumbHome: i18nString('Hjem', 'Home'),
    title: i18nString('Åpenhetsloven 2025', 'Transparency Act 2025'),
    slug: buildSlugField(),
    subtitle: i18nText(
      'Redgjørelse rapporteringsåret 2025. Aktsomhetsvurderinger for bærekraftig forretningspraksis for CMedical Group AS.',
      'Disclosure for the 2025 reporting year. Due diligence assessments for sustainable business practices for CMedical Group AS.',
    ),
    body: i18nBlockContent(BODY_NO, BODY_EN),
    showPracticalInfoSection: true,
    seo: {
      _type: 'seo',
      metaTitle: i18nString('Åpenhetsloven 2025 | CMedical', 'Transparency Act 2025 | CMedical'),
      metaDescription: i18nText(
        'Redgjørelse rapporteringsåret 2025. Aktsomhetsvurderinger for bærekraftig forretningspraksis for CMedical Group AS.',
        'Disclosure for the 2025 reporting year. Due diligence assessments for sustainable business practices for CMedical Group AS.',
      ),
      noIndex: false,
    },
  }

  if (DRY_RUN) {
    console.log('  Would patch opennessActPage with:', JSON.stringify(fields, null, 2))
    console.log('\n✓ Dry run complete')
    return
  }

  const patched = await patchSingletonFields(DOCUMENT_ID, fields, 'opennessActPage')
  console.log(`  Patched: ${patched.join(', ')}`)
  console.log('\n✓ Done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
