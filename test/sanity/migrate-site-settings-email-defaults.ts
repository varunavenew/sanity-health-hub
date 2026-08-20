#!/usr/bin/env npx tsx
/**
 * Seed Site Settings → Email Settings defaults (idempotent).
 *
 * - Never overwrites non-empty editor content (except stock English visitor confirmation copy)
 * - Creates emailSettings when missing on siteSettings / drafts.siteSettings
 * - Only fills missing / empty scalar fields and nested template fields
 * - Does NOT touch SMTP credentials (env-only)
 *
 * Usage (from test/):
 *   npm run migrate:site-settings-email-defaults:dry
 *   npm run migrate:site-settings-email-defaults
 *
 * Production (Windows-safe — prefer this over bash-style env prefixes):
 *   npm run migrate:site-settings-email-defaults:production:dry
 *   npm run migrate:site-settings-email-defaults:production
 */
import {sanityClient, DATASET, PROJECT_ID} from './config'
import {singletonDocumentIds} from './lib/patch-singleton'

const DRY_RUN = process.env.DRY_RUN === '1'
const SITE_SETTINGS_ID = 'siteSettings'

/** En-dash subject (–), matching Studio copy. */
const CLINIC_SUBJECT = 'New Contact Form Submission – {{clinic}}'

const CLINIC_BODY = `Hello,

A new contact form enquiry has been submitted through the CMedical website.

Name:
{{name}}

Email:
{{email}}

Phone:
{{phone}}

Clinic:
{{clinic}}

Subject:
{{subject}}

Message:
{{message}}

Submitted:
{{date}}

Please reply directly to this email to contact the patient.

Regards,
CMedical Website`

/** Previous English stock copy — replaced when still present in CMS. */
const LEGACY_CONFIRMATION_SUBJECTS = [
  'Thank you for contacting CMedical',
  'We received your message',
]

const CONFIRMATION_SUBJECT = 'Takk for at du kontaktet CMedical'

const CONFIRMATION_BODY = `Hei {{name}},

Takk for din henvendelse. Vi har mottatt meldingen din, og den er videresendt til valgt klinikk. Vi tar kontakt så snart som mulig.

Oppsummering

Klinikk:
{{clinic}}

Emne:
{{subject}}

Melding:
{{message}}

Ønsket dag:
{{when}}

Med vennlig hilsen,
CMedical`

const DEFAULTS = {
  enableContactEmails: true,
  senderName: 'CMedical',
  senderEmail: 'hi@cmedical.no',
  fallbackEmail: 'post@cmedical.no',
  contactFormSubject: CLINIC_SUBJECT,
  clinicEmailTemplate: {
    subject: CLINIC_SUBJECT,
    body: CLINIC_BODY,
  },
  confirmationEmail: {
    enabled: true,
    subject: CONFIRMATION_SUBJECT,
    body: CONFIRMATION_BODY,
  },
} as const

type ClinicTemplate = {
  subject?: string | null
  body?: string | null
}

type ConfirmationTemplate = {
  enabled?: boolean | null
  subject?: string | null
  body?: string | null
}

type EmailSettings = {
  enableContactEmails?: boolean | null
  senderName?: string | null
  senderEmail?: string | null
  fallbackEmail?: string | null
  contactFormSubject?: string | null
  clinicEmailTemplate?: ClinicTemplate | null
  confirmationEmail?: ConfirmationTemplate | null
}

type SiteSettingsDoc = {
  _id: string
  _type?: string
  email?: string | null
  emailSettings?: EmailSettings | null
}

function isEmptyString(value: unknown): boolean {
  return typeof value !== 'string' || value.trim().length === 0
}

/** Only seed booleans when the field has never been set (null/undefined). */
function isUnsetBoolean(value: unknown): boolean {
  return value !== true && value !== false
}

function isLegacyEnglishConfirmationSubject(value: unknown): boolean {
  if (typeof value !== 'string') return false
  return LEGACY_CONFIRMATION_SUBJECTS.includes(value.trim())
}

function isLegacyEnglishConfirmationBody(value: unknown): boolean {
  if (typeof value !== 'string') return false
  const body = value.trim()
  return (
    body.includes('Your enquiry summary') ||
    body.includes('Thank you for contacting') ||
    body.includes('We have received your enquiry') ||
    body.includes('We have received your message')
  )
}

/**
 * Build a complete emailSettings object, filling only empty/unset fields.
 * Always returns a full object so Sanity receives a valid nested structure
 * even when emailSettings was previously null.
 */
function mergeEmailSettings(existing: EmailSettings | null | undefined): {
  merged: EmailSettings
  filledKeys: string[]
  skippedKeys: string[]
  createdObject: boolean
} {
  const createdObject = existing == null
  const src = existing ?? {}
  const filledKeys: string[] = []
  const skippedKeys: string[] = []

  if (createdObject) {
    filledKeys.push('emailSettings (created)')
  }

  const merged: EmailSettings = {}

  if (isUnsetBoolean(src.enableContactEmails)) {
    merged.enableContactEmails = DEFAULTS.enableContactEmails
    filledKeys.push('enableContactEmails')
  } else {
    merged.enableContactEmails = src.enableContactEmails
    skippedKeys.push('enableContactEmails')
  }

  if (isEmptyString(src.senderName)) {
    merged.senderName = DEFAULTS.senderName
    filledKeys.push('senderName')
  } else {
    merged.senderName = src.senderName
    skippedKeys.push('senderName')
  }

  if (isEmptyString(src.senderEmail)) {
    merged.senderEmail = DEFAULTS.senderEmail
    filledKeys.push('senderEmail')
  } else {
    merged.senderEmail = src.senderEmail
    skippedKeys.push('senderEmail')
  }

  if (isEmptyString(src.fallbackEmail)) {
    merged.fallbackEmail = DEFAULTS.fallbackEmail
    filledKeys.push('fallbackEmail')
  } else {
    merged.fallbackEmail = src.fallbackEmail
    skippedKeys.push('fallbackEmail')
  }

  if (isEmptyString(src.contactFormSubject)) {
    merged.contactFormSubject = DEFAULTS.contactFormSubject
    filledKeys.push('contactFormSubject')
  } else {
    merged.contactFormSubject = src.contactFormSubject
    skippedKeys.push('contactFormSubject')
  }

  const clinicSrc = src.clinicEmailTemplate ?? {}
  const clinic: ClinicTemplate = {}
  if (isEmptyString(clinicSrc.subject)) {
    clinic.subject = DEFAULTS.clinicEmailTemplate.subject
    filledKeys.push('clinicEmailTemplate.subject')
  } else {
    clinic.subject = clinicSrc.subject
    skippedKeys.push('clinicEmailTemplate.subject')
  }
  if (isEmptyString(clinicSrc.body)) {
    clinic.body = DEFAULTS.clinicEmailTemplate.body
    filledKeys.push('clinicEmailTemplate.body')
  } else {
    clinic.body = clinicSrc.body
    skippedKeys.push('clinicEmailTemplate.body')
  }
  merged.clinicEmailTemplate = clinic

  const confirmSrc = src.confirmationEmail ?? {}
  const confirmation: ConfirmationTemplate = {}
  if (isUnsetBoolean(confirmSrc.enabled)) {
    confirmation.enabled = DEFAULTS.confirmationEmail.enabled
    filledKeys.push('confirmationEmail.enabled')
  } else {
    confirmation.enabled = confirmSrc.enabled
    skippedKeys.push('confirmationEmail.enabled')
  }
  if (
    isEmptyString(confirmSrc.subject) ||
    isLegacyEnglishConfirmationSubject(confirmSrc.subject)
  ) {
    confirmation.subject = DEFAULTS.confirmationEmail.subject
    filledKeys.push('confirmationEmail.subject')
  } else {
    confirmation.subject = confirmSrc.subject
    skippedKeys.push('confirmationEmail.subject')
  }
  if (isEmptyString(confirmSrc.body) || isLegacyEnglishConfirmationBody(confirmSrc.body)) {
    confirmation.body = DEFAULTS.confirmationEmail.body
    filledKeys.push('confirmationEmail.body')
  } else {
    confirmation.body = confirmSrc.body
    skippedKeys.push('confirmationEmail.body')
  }
  merged.confirmationEmail = confirmation

  return {merged, filledKeys, skippedKeys, createdObject}
}

function summarizePayload(emailSettings: EmailSettings) {
  return {
    enableContactEmails: emailSettings.enableContactEmails,
    senderName: emailSettings.senderName,
    senderEmail: emailSettings.senderEmail,
    fallbackEmail: emailSettings.fallbackEmail,
    contactFormSubject: emailSettings.contactFormSubject,
    clinicSubject: emailSettings.clinicEmailTemplate?.subject,
    clinicBodyLen: emailSettings.clinicEmailTemplate?.body?.length ?? 0,
    confirmEnabled: emailSettings.confirmationEmail?.enabled,
    confirmSubject: emailSettings.confirmationEmail?.subject,
    confirmBodyLen: emailSettings.confirmationEmail?.body?.length ?? 0,
  }
}

async function patchDoc(id: string, emailSettings: EmailSettings) {
  const payload = summarizePayload(emailSettings)
  console.log(`  patch payload for ${id}:`, payload)

  if (DRY_RUN) {
    console.log(`[dry-run] would set ${id}.emailSettings (no commit)`)
    return
  }

  const result = await sanityClient
    .patch(id)
    .setIfMissing({emailSettings: {}})
    .set({emailSettings})
    .commit({autoGenerateArrayKeys: true})

  console.log(`✓ patched ${id} (rev=${result._rev ?? 'n/a'})`)
}

async function run() {
  const publishedId = SITE_SETTINGS_ID
  const draftId = `drafts.${SITE_SETTINGS_ID}`
  const forceDataset =
    process.env.SANITY_DATASET_FORCE?.trim() ||
    process.env.SANITY_STUDIO_FORCE_DATASET?.trim() ||
    '(none)'
  const allowProd = process.env.ALLOW_PRODUCTION_MIGRATION === 'true'

  console.log('=== Email Settings migration — runtime target ===')
  console.log(`  projectId: ${PROJECT_ID}`)
  console.log(`  dataset (resolved): ${DATASET}`)
  console.log(`  SANITY_DATASET_FORCE / STUDIO_FORCE: ${forceDataset}`)
  console.log(`  ALLOW_PRODUCTION_MIGRATION: ${allowProd}`)
  console.log(`  DRY_RUN: ${DRY_RUN}`)
  console.log(`  published ID: ${publishedId}`)
  console.log(`  draft ID: ${draftId}`)
  console.log('SMTP credentials are never written to Sanity.')

  if (DATASET !== 'production' && allowProd) {
    console.warn(
      '⚠ ALLOW_PRODUCTION_MIGRATION=true but resolved dataset is NOT production.',
      'Check SANITY_DATASET_FORCE=production (Windows: use npm run …:production).',
    )
  }

  const ids = singletonDocumentIds(SITE_SETTINGS_ID)
  console.log(`Target document IDs: ${ids.join(', ')}`)

  const docs = await sanityClient.fetch<SiteSettingsDoc[]>(
    `*[_id in $ids]{
      _id,
      _type,
      email,
      emailSettings{
        enableContactEmails,
        senderName,
        senderEmail,
        fallbackEmail,
        contactFormSubject,
        clinicEmailTemplate{subject, body},
        confirmationEmail{enabled, subject, body}
      }
    }`,
    {ids},
  )

  console.log(
    `Documents found: ${docs.length} → ${docs.map((d) => d._id).join(', ') || '(none)'}`,
  )

  if (!docs.length) {
    console.error(`✗ Missing ${SITE_SETTINGS_ID} — refusing to recreate the singleton.`)
    process.exit(1)
  }

  for (const expectedId of ids) {
    if (!docs.some((d) => d._id === expectedId)) {
      console.log(`⚠ ${expectedId} not found (will skip; sync may create draft later)`)
    }
  }

  for (const doc of docs) {
    const id = doc._id
    if (doc._type && doc._type !== 'siteSettings') {
      console.error(`✗ Unexpected _type on ${id}: ${doc._type}`)
      process.exit(1)
    }

    const beforeNull = doc.emailSettings == null
    console.log(
      `\n${id}: emailSettings ${beforeNull ? 'MISSING (will create)' : 'present (will merge empty fields only)'}`,
    )
    if (!beforeNull) {
      console.log('  before:', summarizePayload(doc.emailSettings ?? {}))
    }

    const {merged, filledKeys, skippedKeys, createdObject} = mergeEmailSettings(
      doc.emailSettings,
    )

    const realFills = filledKeys.filter((k) => k !== 'emailSettings (created)')
    if (realFills.length === 0) {
      console.log(`✓ ${id} — Email Settings already populated (nothing to seed)`)
      continue
    }

    console.log(`→ ${id}`)
    if (createdObject) console.log('  creating emailSettings object')
    console.log(`  will seed: ${realFills.join(', ')}`)
    if (skippedKeys.length) {
      console.log(`  keep existing: ${skippedKeys.join(', ')}`)
    }
    if (doc.email?.trim() && realFills.includes('fallbackEmail')) {
      console.log(
        `  note: General → Email is "${doc.email.trim()}" — seeding Fallback Email only because it was empty`,
      )
    }

    await patchDoc(id, merged)
  }

  // Sync draft from published when draft is missing (Studio often edits draft).
  const published = await sanityClient.fetch<Record<string, unknown> | null>(
    `*[_id == $id][0]`,
    {id: publishedId},
  )
  const draftExists = await sanityClient.fetch<boolean>(
    `defined(*[_id == $id][0]._id)`,
    {id: draftId},
  )
  if (published && !draftExists && !DRY_RUN) {
    await sanityClient.createOrReplace({
      ...published,
      _id: draftId,
    })
    console.log(`✓ synced ${draftId} from published`)
  } else if (published && !draftExists && DRY_RUN) {
    console.log(`[dry-run] would sync ${draftId} from published`)
  }

  const after = await sanityClient.fetch(
    `*[_id in $ids]{
      _id,
      "generalEmail": email,
      emailSettings{
        enableContactEmails,
        senderName,
        senderEmail,
        fallbackEmail,
        contactFormSubject,
        clinicEmailTemplate{subject, body},
        confirmationEmail{enabled, subject, body}
      }
    }`,
    {ids},
  )
  console.log('\n=== POST-MIGRATION VERIFICATION ===')
  console.log(`projectId=${PROJECT_ID} dataset=${DATASET}`)
  console.log(JSON.stringify(after, null, 2))

  if (DRY_RUN) {
    console.log('\n✓ Dry-run complete — no writes. Re-run without DRY_RUN to apply.')
    return
  }

  const expected = {
    enableContactEmails: true,
    senderName: 'CMedical',
    senderEmail: 'hi@cmedical.no',
    fallbackEmail: 'post@cmedical.no',
    clinicSubject: CLINIC_SUBJECT,
    confirmEnabled: true,
    confirmSubject: CONFIRMATION_SUBJECT,
  }

  let ok = true
  for (const row of after as Array<{
    _id: string
    emailSettings?: {
      enableContactEmails?: boolean
      senderName?: string
      senderEmail?: string
      fallbackEmail?: string
      clinicEmailTemplate?: {subject?: string; body?: string}
      confirmationEmail?: {enabled?: boolean; subject?: string; body?: string}
    } | null
  }>) {
    const es = row.emailSettings
    const checks: Array<[string, unknown, unknown]> = [
      ['enableContactEmails', es?.enableContactEmails, expected.enableContactEmails],
      ['senderName', es?.senderName, expected.senderName],
      ['senderEmail', es?.senderEmail, expected.senderEmail],
      ['fallbackEmail', es?.fallbackEmail, expected.fallbackEmail],
      ['clinicEmailTemplate.subject', es?.clinicEmailTemplate?.subject, expected.clinicSubject],
      [
        'clinicEmailTemplate.body ok',
        (es?.clinicEmailTemplate?.body || '').includes('{{name}}') &&
          (es?.clinicEmailTemplate?.body || '').includes('CMedical Website'),
        true,
      ],
      ['confirmationEmail.enabled', es?.confirmationEmail?.enabled, expected.confirmEnabled],
      ['confirmationEmail.subject', es?.confirmationEmail?.subject, expected.confirmSubject],
      [
        'confirmationEmail.body ok',
        (es?.confirmationEmail?.body || '').includes('{{name}}') &&
          (es?.confirmationEmail?.body || '').includes('Oppsummering'),
        true,
      ],
    ]
    console.log(`\nChecks for ${row._id}:`)
    for (const [label, actual, want] of checks) {
      const pass = actual === want
      if (!pass) ok = false
      console.log(`  ${pass ? '✓' : '✗'} ${label}: ${JSON.stringify(actual)}`)
    }
  }

  if (!ok) {
    console.error('\n✗ Verification failed — see checks above')
    process.exit(1)
  }
  console.log(
    `\n✓ All Email Settings fields populated as expected on dataset "${DATASET}" (project ${PROJECT_ID})`,
  )
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})

