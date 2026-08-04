#!/usr/bin/env npx tsx
/**
 * Initialize / repair contactPage CMS objects for Studio editors.
 *
 * - Does NOT recreate the singleton
 * - Does NOT overwrite i18n values that already have non-empty `value`
 * - Fills empty shells (language keys without value) from frontend defaults
 * - Repairs clinicsSection.showSection when heading was an empty shell
 * - Repairs Contact Request Modal flat fields (same empty-shell problem)
 *
 * Usage (from test/):
 *   npm run migrate:contact-page-cms-defaults:dry
 *   npm run migrate:contact-page-cms-defaults
 */
import {sanityClient} from './config'
import {i18nString, i18nText} from './lib/category-landing-i18n'
import {singletonDocumentIds} from './lib/patch-singleton'

const DRY_RUN = process.env.DRY_RUN === '1'
const CONTACT_ID = 'contactPage'

type I18nRow = {_type?: string; _key?: string; language?: string; value?: unknown}

const DEFAULT_CLINICS_SECTION = {
  showSection: true,
  title: i18nString('Våre klinikker', 'Our clinics'),
  clinics: [] as unknown[],
}

/** Mirrors src/i18n locales contact.* (+ sensible error defaults). */
const DEFAULT_CONTACT_FORM = {
  title: i18nString('Send oss en melding', 'Send us a message'),
  subtitle: i18nText(
    'Vi svarer på alle henvendelser innen 24 timer',
    'We respond to all inquiries within 24 hours',
  ),
  nameLabel: i18nString('Navn', 'Name'),
  namePlaceholder: i18nString('Ditt navn', 'Your name'),
  phoneLabel: i18nString('Telefon', 'Phone'),
  phonePlaceholder: i18nString('+47 000 00 000', '+47 000 00 000'),
  emailLabel: i18nString('E-post', 'Email'),
  emailPlaceholder: i18nString('din@email.no', 'your@email.com'),
  clinicLabel: i18nString('Klinikk', 'Clinic'),
  clinicPlaceholder: i18nString('Velg klinikk', 'Select clinic'),
  subjectLabel: i18nString('Emne', 'Subject'),
  subjectPlaceholder: i18nString('Hva gjelder henvendelsen?', 'What is your inquiry about?'),
  messageLabel: i18nString('Melding', 'Message'),
  messagePlaceholder: i18nText('Beskriv din henvendelse...', 'Describe your inquiry...'),
  submitButton: i18nString('Send melding', 'Send message'),
  successTitle: i18nString('Melding sendt!', 'Message sent!'),
  successDescription: i18nText(
    'Vi vil ta kontakt med deg innen 24 timer.',
    'We will get back to you within 24 hours.',
  ),
  errorTitle: i18nString('Noe gikk galt', 'Something went wrong'),
  errorDescription: i18nText(
    'Kunne ikke sende meldingen. Prøv igjen.',
    'Could not send the message. Please try again.',
  ),
}

/** Same defaults as migrate-contact-request-dialog.ts */
const DEFAULT_MODAL_COPY = {
  dialogTitle: i18nString(
    'Vil du at vi skal kontakte deg?',
    'Would you like us to contact you?',
  ),
  dialogDescription: i18nText(
    'Fyll inn skjemaet, så ringer en av våre rådgivere deg tilbake.',
    'Fill in the form and one of our advisors will call you back.',
  ),
  nameLabel: i18nString('Navn', 'Name'),
  namePlaceholder: i18nString('Ditt navn', 'Your name'),
  phoneLabel: i18nString('Telefon', 'Phone'),
  phonePlaceholder: i18nString('+47 000 00 000', '+47 000 00 000'),
  clinicLabel: i18nString('Klinikk', 'Clinic'),
  clinicPlaceholder: i18nString('Velg klinikk', 'Choose clinic'),
  categoryLabel: i18nString('Fagområde', 'Specialty'),
  categoryPlaceholder: i18nString('Velg fagområde', 'Choose specialty'),
  categoryOtherLabel: i18nString('Annet / vet ikke', 'Other / not sure'),
  timingLabel: i18nString(
    'Når ønsker du å bli kontaktet?',
    'When would you like to be contacted?',
  ),
  timingAsapLabel: i18nString('Snarest mulig', 'As soon as possible'),
  timingSpecificLabel: i18nString('Velg dag og tid', 'Choose day and time'),
  dayLabel: i18nString('Dag', 'Day'),
  timeOfDayLabel: i18nString('Tidspunkt', 'Time of day'),
  timeOfDayPlaceholder: i18nString('Velg tidspunkt', 'Choose time'),
  timeMorningLabel: i18nString('Formiddag (08–12)', 'Morning (08–12)'),
  timeAfternoonLabel: i18nString('Ettermiddag (12–16)', 'Afternoon (12–16)'),
  timeEveningLabel: i18nString('Kveld (16–20)', 'Evening (16–20)'),
  detailsLabel: i18nString(
    'Utdyp gjerne hva det handler om',
    'Please describe what it is about',
  ),
  detailsOptionalSuffix: i18nString('(valgfritt)', '(optional)'),
  detailsPlaceholder: i18nText(
    'Kort beskrivelse av hva henvendelsen gjelder...',
    'Brief description of what your inquiry is about...',
  ),
  cancelButton: i18nString('Avbryt', 'Cancel'),
  submitButton: i18nString('Send forespørsel', 'Send request'),
  submittingButton: i18nString('Sender...', 'Sending...'),
  privacyNote: i18nText(
    'Vi behandler dine personopplysninger i samsvar med GDPR.',
    'We process your personal data in accordance with GDPR.',
  ),
  toastValidationTitle: i18nString('Sjekk skjemaet', 'Please check the form'),
  toastValidationDescription: i18nString(
    'Vennligst fyll inn alle påkrevde felt',
    'Please fill in all required fields',
  ),
  validationNameRequired: i18nString('Vennligst fyll inn navn', 'Please enter your name'),
  validationPhoneRequired: i18nString(
    'Vennligst fyll inn telefonnummer',
    'Please enter your phone number',
  ),
  validationClinicRequired: i18nString('Velg klinikk', 'Please choose a clinic'),
  validationCategoryRequired: i18nString('Velg fagområde', 'Please choose a specialty'),
  toastSuccessTitle: i18nString('Forespørsel mottatt', 'Request received'),
  toastSuccessDescription: i18nText(
    'Vi tar kontakt med deg så snart som mulig.',
    'We will contact you as soon as possible.',
  ),
}

function i18nHasValue(value: unknown): boolean {
  if (!Array.isArray(value)) return false
  return value.some(
    (row) =>
      row &&
      typeof row === 'object' &&
      typeof (row as I18nRow).value === 'string' &&
      String((row as I18nRow).value).trim().length > 0,
  )
}

function mergeI18nField(existing: unknown, fallback: I18nRow[]): I18nRow[] {
  if (!i18nHasValue(existing)) return fallback
  return existing as I18nRow[]
}

function mergeRecord(
  existing: Record<string, unknown> | null | undefined,
  defaults: Record<string, I18nRow[]>,
): {merged: Record<string, unknown>; filledKeys: string[]} {
  const filledKeys: string[] = []
  const merged: Record<string, unknown> = {}
  for (const [key, fallback] of Object.entries(defaults)) {
    const current = existing?.[key]
    if (i18nHasValue(current)) {
      merged[key] = current
    } else {
      merged[key] = fallback
      filledKeys.push(key)
    }
  }
  return {merged, filledKeys}
}

function mergeClinicsSection(
  existing: Record<string, unknown> | null | undefined,
): {
  section: Record<string, unknown>
  created: boolean
  repairedTitle: boolean
  repairedVisibility: boolean
  needsWrite: boolean
} {
  if (!existing || typeof existing !== 'object') {
    return {
      section: {...DEFAULT_CLINICS_SECTION},
      created: true,
      repairedTitle: true,
      repairedVisibility: true,
      needsWrite: true,
    }
  }

  const repairedTitle = !i18nHasValue(existing.title)
  const title = mergeI18nField(existing.title, DEFAULT_CLINICS_SECTION.title)
  const clinics = Array.isArray(existing.clinics) ? existing.clinics : []

  let showSection = existing.showSection !== false
  let repairedVisibility = false
  if (existing.showSection === false && repairedTitle) {
    showSection = true
    repairedVisibility = true
  }

  return {
    section: {showSection, title, clinics},
    created: false,
    repairedTitle,
    repairedVisibility,
    needsWrite: repairedTitle || repairedVisibility || !Array.isArray(existing.clinics),
  }
}

async function patchDoc(id: string, fields: Record<string, unknown>) {
  if (DRY_RUN) {
    console.log(`[dry-run] would patch ${id}:`, Object.keys(fields).join(', '))
    return
  }
  await sanityClient.patch(id).set(fields).commit({autoGenerateArrayKeys: true})
  console.log(`✓ patched ${id}`)
}

async function run() {
  console.log(`Dataset migration: contactPage CMS defaults (DRY_RUN=${DRY_RUN ? '1' : '0'})`)

  const ids = singletonDocumentIds(CONTACT_ID)
  const projection = [
    '_id',
    'clinicsSection',
    'contactForm',
    ...Object.keys(DEFAULT_MODAL_COPY),
  ].join(', ')

  let docs = await sanityClient.fetch<Array<Record<string, unknown>>>(
    `*[_id in $ids]{ ${projection} }`,
    {ids},
  )

  if (!docs.length) {
    console.error(`✗ Missing ${CONTACT_ID} — refusing to recreate.`)
    process.exit(1)
  }

  // If only published exists, still patch it; Studio reads published when no draft.
  for (const doc of docs) {
    const id = String(doc._id)
    const clinics = mergeClinicsSection(
      doc.clinicsSection as Record<string, unknown> | null | undefined,
    )
    const formMerge = mergeRecord(
      doc.contactForm as Record<string, unknown> | null | undefined,
      DEFAULT_CONTACT_FORM,
    )
    const modalMerge = mergeRecord(doc, DEFAULT_MODAL_COPY)

    const fields: Record<string, unknown> = {}
    if (clinics.needsWrite) fields.clinicsSection = clinics.section
    if (!doc.contactForm || formMerge.filledKeys.length > 0) {
      fields.contactForm = formMerge.merged
    }
    for (const key of modalMerge.filledKeys) {
      fields[key] = modalMerge.merged[key]
    }

    if (Object.keys(fields).length === 0) {
      console.log(`✓ ${id} — already populated`)
      continue
    }

    console.log(`→ ${id}`)
    if (fields.clinicsSection) {
      console.log(
        `  clinicsSection: created=${clinics.created} repairedTitle=${clinics.repairedTitle} repairedVisibility=${clinics.repairedVisibility}`,
      )
    }
    if (fields.contactForm) {
      console.log(
        `  contactForm: fill ${formMerge.filledKeys.length ? formMerge.filledKeys.join(', ') : '(ensure object)'}`,
      )
    }
    if (modalMerge.filledKeys.length) {
      console.log(`  modal: fill ${modalMerge.filledKeys.join(', ')}`)
    }

    await patchDoc(id, fields)
  }

  // Sync draft from published when draft missing (editors often work on draft)
  const published = await sanityClient.fetch<Record<string, unknown> | null>(
    `*[_id == $id][0]`,
    {id: CONTACT_ID},
  )
  const draftExists = await sanityClient.fetch<boolean>(
    `defined(*[_id == $id][0]._id)`,
    {id: `drafts.${CONTACT_ID}`},
  )
  if (published && !draftExists && !DRY_RUN) {
    await sanityClient.createOrReplace({
      ...published,
      _id: `drafts.${CONTACT_ID}`,
    })
    console.log(`✓ synced drafts.${CONTACT_ID} from published`)
  }

  const after = await sanityClient.fetch(
    `*[_id in $ids]{
      _id,
      "show": clinicsSection.showSection,
      "clinicTitle": clinicsSection.title[language == "no"][0].value,
      "formTitle": contactForm.title[language == "no"][0].value,
      "dialogTitle": dialogTitle[language == "no"][0].value
    }`,
    {ids: singletonDocumentIds(CONTACT_ID)},
  )
  console.log('\nVerification:', JSON.stringify(after, null, 2))
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
