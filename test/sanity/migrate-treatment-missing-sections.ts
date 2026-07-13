/**
 * Migrate missing treatment-schema sections into existing treatment documents.
 *
 * Adds/fills the following fields (if missing) on every `treatment` document,
 * using Sanity v5 internationalizedArray shape (NO + EN):
 *
 *   1. benefitsTitle (i18n string) + benefits (i18n string[])
 *   2. process (array of {title, description} i18n)                 — old shape
 *   3. sections (array of {id, heading, content} i18n)              — accordion
 *   4. relatedSpecialists (array of references → specialist)        — empty stub
 *   5. linkedServices (array of {label, description, path} i18n)    — "Vårt tverrfaglige team"
 *
 * Idempotent: only writes a field when it's absent/empty.
 * Force overwrite with FORCE=1. Dry-run with DRY_RUN=1.
 *
 * Usage:
 *   SANITY_TOKEN=<token> npx tsx test/sanity/migrate-treatment-missing-sections.ts
 *   DRY_RUN=1 SANITY_TOKEN=<token> npx tsx test/sanity/migrate-treatment-missing-sections.ts
 *   FORCE=1   SANITY_TOKEN=<token> npx tsx test/sanity/migrate-treatment-missing-sections.ts
 */

import { randomUUID } from 'node:crypto'
import { sanityClient } from './config'

const FORCE = process.env.FORCE === '1'
const DRY_RUN = process.env.DRY_RUN === '1'

const k = () => randomUUID().replace(/-/g, '').slice(0, 12)

/* ── i18n helpers (v5 internationalizedArray shape) ───────────────────── */

const i18nStr = (no: string, en?: string) => {
  const arr: any[] = [
    { _key: 'no', _type: 'internationalizedArrayStringValue', value: no },
  ]
  if (en) arr.push({ _key: 'en', _type: 'internationalizedArrayStringValue', value: en })
  return arr
}

const i18nText = (no: string, en?: string) => {
  const arr: any[] = [
    { _key: 'no', _type: 'internationalizedArrayTextValue', value: no },
  ]
  if (en) arr.push({ _key: 'en', _type: 'internationalizedArrayTextValue', value: en })
  return arr
}

const isEmpty = (v: any) =>
  v === undefined || v === null || (Array.isArray(v) && v.length === 0)

/* ── Default seeds (used when the field is missing/empty) ─────────────── */

const defaultBenefitsTitle = () => i18nStr('Fordeler', 'Benefits')

const defaultBenefits = () => [
  i18nStr('Erfarne spesialister', 'Experienced specialists'),
  i18nStr('Moderne utstyr og trygge rammer', 'Modern equipment and safe surroundings'),
  i18nStr('Kort ventetid', 'Short waiting time'),
  i18nStr('Tett oppfølging før og etter behandling', 'Close follow-up before and after treatment'),
]

const defaultProcess = () => [
  {
    _key: k(),
    title: i18nStr('Konsultasjon', 'Consultation'),
    description: i18nText(
      'Vi går gjennom historikken din og planlegger behandlingen sammen.',
      'We review your history and plan the treatment together.',
    ),
  },
  {
    _key: k(),
    title: i18nStr('Undersøkelse', 'Examination'),
    description: i18nText(
      'Grundig undersøkelse hos spesialist for å avklare tiltak.',
      'Thorough examination by a specialist to clarify next steps.',
    ),
  },
  {
    _key: k(),
    title: i18nStr('Behandling', 'Treatment'),
    description: i18nText(
      'Selve behandlingen utføres i trygge og moderne omgivelser.',
      'The treatment is performed in safe and modern surroundings.',
    ),
  },
  {
    _key: k(),
    title: i18nStr('Oppfølging', 'Follow-up'),
    description: i18nText(
      'Vi følger deg opp tett med kontroller og rådgivning.',
      'We follow you up closely with check-ups and guidance.',
    ),
  },
]

const defaultSections = () => [
  {
    _key: k(),
    id: 'om-behandlingen',
    heading: i18nStr('Om behandlingen', 'About the treatment'),
    content: i18nText(
      'Beskriv behandlingen her. Støtter **fet**, _kursiv_, - lister og [lenker](url).',
      'Describe the treatment here. Supports **bold**, _italic_, - lists and [links](url).',
    ),
  },
  {
    _key: k(),
    id: 'forberedelser',
    heading: i18nStr('Forberedelser', 'Preparation'),
    content: i18nText(
      'Hvordan du forbereder deg til behandlingen.',
      'How to prepare for the treatment.',
    ),
  },
  {
    _key: k(),
    id: 'etter-behandling',
    heading: i18nStr('Etter behandlingen', 'After the treatment'),
    content: i18nText(
      'Hva du kan forvente etter behandlingen og videre oppfølging.',
      'What to expect after the treatment and further follow-up.',
    ),
  },
]

/** The four standard "Vårt tverrfaglige team" cards. */
const defaultLinkedServices = () => [
  {
    _key: k(),
    label: i18nStr('Osteopat', 'Osteopath'),
    description: i18nText(
      'Behandling av muskel- og skjelettplager for å støtte kroppen din.',
      'Treatment of musculoskeletal complaints to support your body.',
    ),
    path: '/behandlinger/osteopati',
  },
  {
    _key: k(),
    label: i18nStr('Sexolog', 'Sexologist'),
    description: i18nText(
      'Rådgivning om intimliv, relasjoner og seksuell helse.',
      'Counseling on intimacy, relationships and sexual health.',
    ),
    path: '/behandlinger/sexolog',
  },
  {
    _key: k(),
    label: i18nStr('Psykolog', 'Psychologist'),
    description: i18nText(
      'Psykologisk støtte gjennom livets ulike faser.',
      'Psychological support through life’s different phases.',
    ),
    path: '/behandlinger/psykolog',
  },
  {
    _key: k(),
    label: i18nStr('Ernæringsfysiolog', 'Nutritionist'),
    description: i18nText(
      'Kostholdsveiledning tilpasset dine behov.',
      'Dietary guidance tailored to your needs.',
    ),
    path: '/behandlinger/ernaeringsfysiolog',
  },
]

/* ── Runner ───────────────────────────────────────────────────────────── */

async function main() {
  const docs = await sanityClient.fetch(
    `*[_type == "treatment"]{ _id, title, benefitsTitle, benefits, process, sections, relatedSpecialists, linkedServices }`,
  )
  console.log(`\n[treatment] found ${docs.length} document(s)\n`)

  let updated = 0
  for (const doc of docs) {
    const patch: Record<string, any> = {}

    if (FORCE || isEmpty(doc.benefitsTitle)) patch.benefitsTitle = defaultBenefitsTitle()
    if (FORCE || isEmpty(doc.benefits)) patch.benefits = defaultBenefits()
    if (FORCE || isEmpty(doc.process)) patch.process = defaultProcess()
    if (FORCE || isEmpty(doc.sections)) patch.sections = defaultSections()
    if (FORCE || isEmpty(doc.relatedSpecialists)) patch.relatedSpecialists = []
    if (FORCE || isEmpty(doc.linkedServices)) patch.linkedServices = defaultLinkedServices()

    const keys = Object.keys(patch)
    if (keys.length === 0) {
      console.log(`  ⏭  ${doc._id} — all fields already populated`)
      continue
    }

    console.log(`  ✦ ${doc._id} → set: ${keys.join(', ')}`)
    if (DRY_RUN) continue

    await sanityClient.patch(doc._id).set(patch).commit()
    updated++
  }

  console.log(
    `\n✅ Done. ${DRY_RUN ? '(dry-run, no writes)' : `${updated} document(s) updated.`}`,
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
