#!/usr/bin/env npx tsx
/**
 * Seed careersPage singleton with copy from the former hardcoded Karriere pages.
 *
 * Run:
 *   cd test && npm run migrate:careers-page:dry
 *   cd test && npm run migrate:careers-page
 */
import { randomBytes } from 'crypto'
import { patchSingletonFields } from './lib/patch-singleton'
import { i18nString, i18nText } from './lib/category-landing-i18n'

const DRY_RUN = process.env.DRY_RUN === '1'
const DOCUMENT_ID = 'careersPage'

function randomKey(): string {
  return randomBytes(8).toString('hex')
}

function buildSlugField() {
  return [
    {
      _key: randomKey(),
      _type: 'internationalizedArraySlugValue',
      language: 'no',
      value: { _type: 'slug', current: 'karriere' },
    },
    {
      _key: randomKey(),
      _type: 'internationalizedArraySlugValue',
      language: 'en',
      value: { _type: 'slug', current: 'careers' },
    },
  ]
}

function option(value: string, no: string, en: string) {
  return {
    _key: randomKey(),
    value,
    label: i18nString(no, en),
  }
}

async function run() {
  console.log('▶ Migrate careersPage singleton')
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  const fields = {
    breadcrumbHome: i18nString('Hjem', 'Home'),
    title: i18nString('Karriere', 'Careers'),
    slug: buildSlugField(),
    heroSubtitle: i18nText(
      'Bli en del av CMedical – Norges ledende private helsekonsern. Vi søker dyktige fagfolk som brenner for god pasientbehandling.',
      "Join CMedical – Norway's leading private healthcare group. We are looking for skilled professionals passionate about patient care.",
    ),
    jobsSectionTitle: i18nString('Ledige stillinger', 'Open positions'),
    introText: i18nText(
      'Hos CMedical jobber du i et inspirerende fagmiljø med dyktige kolleger, moderne utstyr og en kultur der pasientens beste alltid står i sentrum. Vi tilbyr konkurransedyktige betingelser og gode utviklingsmuligheter.',
      'At CMedical you work in an inspiring professional environment with skilled colleagues, modern equipment and a culture where the patient always comes first. We offer competitive terms and good development opportunities.',
    ),
    searchPlaceholder: i18nString('Søk etter stilling, sted...', 'Search by role, location...'),
    filterAllLabel: i18nString('Alle', 'All'),
    emptyResultsMessage: i18nString(
      'Ingen ledige stillinger matcher søket ditt.',
      'No open positions match your search.',
    ),
    emptyResultsResetHint: i18nString('Prøv å endre filtrene, eller', 'Try changing the filters, or'),
    emptyResultsResetLabel: i18nString('vis alle stillinger', 'show all positions'),
    deadlineLabel: i18nString('Frist:', 'Deadline:'),
    ongoingLabel: i18nString('Løpende', 'Ongoing'),
    ongoingDeadlineLabel: i18nString('Løpende søknadsfrist', 'Rolling application deadline'),
    spontaneousTitle: i18nString(
      'Finner du ikke stillingen du ser etter?',
      "Can't find the role you're looking for?",
    ),
    spontaneousText: i18nText(
      'Send oss en spontansøknad! Vi er alltid interessert i å høre fra dyktige fagfolk som ønsker å bli en del av CMedical-familien.',
      'Send us an open application! We are always interested in hearing from skilled professionals who want to join the CMedical family.',
    ),
    spontaneousButtonLabel: i18nString('Send spontansøknad', 'Send open application'),
    spontaneousEmail: 'jobb@cmedical.no',
    departmentOptions: [
      option('gynekologi', 'Gynekologi', 'Gynecology'),
      option('fertilitet', 'Fertilitet', 'Fertility'),
      option('urologi', 'Urologi', 'Urology'),
      option('ortopedi', 'Ortopedi', 'Orthopedics'),
      option('hud', 'Hud', 'Dermatology'),
      option('administrasjon', 'Administrasjon', 'Administration'),
      option('it', 'IT / Teknologi', 'IT / Technology'),
      option('annet', 'Annet', 'Other'),
    ],
    employmentTypeOptions: [
      option('fast', 'Fast stilling', 'Permanent position'),
      option('deltid', 'Deltid', 'Part-time'),
      option('vikar', 'Vikar', 'Locum'),
      option('engasjement', 'Engasjement', 'Temporary engagement'),
    ],
    notFoundTitle: i18nString('Stillingen ble ikke funnet', 'Position not found'),
    notFoundDescription: i18nText(
      'Denne stillingen finnes ikke lenger eller lenken er feil.',
      'This position no longer exists or the link is incorrect.',
    ),
    backToJobsLabel: i18nString('Tilbake til ledige stillinger', 'Back to open positions'),
    backLinkLabel: i18nString('Alle ledige stillinger', 'All open positions'),
    applyCardTitle: i18nString('Søk på stillingen', 'Apply for this role'),
    applyExternalLabel: i18nString('Søk her', 'Apply here'),
    applyEmailLabel: i18nString('Send søknad på e-post', 'Apply by email'),
    contactCardTitle: i18nString('Kontaktperson', 'Contact person'),
    jobSeoTitleSuffix: i18nString(' – Karriere hos CMedical', ' – Careers at CMedical'),
    seo: {
      metaTitle: i18nString('Karriere – Bli en del av CMedical', 'Careers – Join CMedical'),
      metaDescription: i18nText(
        'Se ledige stillinger hos CMedical. Vi søker dyktige fagfolk som brenner for god pasientbehandling. Konkurransedyktige betingelser og godt fagmiljø.',
        'See open positions at CMedical. We are looking for skilled professionals passionate about patient care. Competitive terms and a strong professional environment.',
      ),
    },
  }

  if (DRY_RUN) {
    console.log('  Would patch careersPage')
    console.log('\n✓ Dry run complete')
    return
  }

  const patched = await patchSingletonFields(DOCUMENT_ID, fields, 'careersPage')
  console.log(`  Patched: ${patched.join(', ')}`)
  console.log('\n✓ Done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
