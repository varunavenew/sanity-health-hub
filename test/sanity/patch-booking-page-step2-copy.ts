#!/usr/bin/env npx tsx
/**
 * Fill bookingPage step-2 copy from CMS defaults.
 *
 * - Does not recreate the singleton
 * - Fills empty i18n shells (language keys without `value`)
 * - Adds missing supportFooterText
 *
 * Usage (from test/):
 *   npx tsx sanity/patch-booking-page-step2-copy.ts
 */
import { sanityClient } from './config'
import { i18nString, i18nText } from './lib/category-landing-i18n'
import { patchSingletonFields } from './lib/patch-singleton'

type I18nRow = { _type?: string; _key?: string; language?: string; value?: unknown }

const STEP2_HEADING = i18nString('Velg klinikk', 'Choose a clinic')
const STEP2_EMPTY_TITLE = i18nString(
  'Denne tjenesten kan ikke bestilles online akkurat nå',
  "This service can't be booked online right now",
)
const STEP2_EMPTY_MESSAGE = i18nText(
  'Denne spesifikke tjenesten er dessverre ikke tilgjengelig for nettbestilling for øyeblikket. Ring oss, så hjelper vi deg å finne en time.',
  "This particular service is currently not available for online booking. Please give us a call and we'll help you find a suitable appointment.",
)
const STEP2_EMPTY_BUTTON = i18nString(
  'Ring oss så hjelper vi deg',
  'Call us and we will help',
)
const SUPPORT_FOOTER = i18nText(
  'Hvis du opplever utfordringer med nettbestilling, er du velkommen til å ringe oss på {{phone}}.\nVi er tilgjengelige fra 08:00 – 20:00 alle hverdager.',
  'If you experience any challenges with online booking, you are welcome to call us at {{phone}}.\nWe are available from 08:00 – 20:00 every weekday.',
)

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

async function run() {
  const doc = await sanityClient.fetch<Record<string, unknown> | null>(
    `*[_id == "bookingPage"][0]{ step2Heading, step2EmptyTitle, step2EmptyMessage, step2EmptyButtonLabel, step2EmptyPhone, supportFooterText }`,
  )

  const fields: Record<string, unknown> = {}
  if (!i18nHasValue(doc?.step2Heading)) fields.step2Heading = STEP2_HEADING
  if (!i18nHasValue(doc?.step2EmptyTitle)) fields.step2EmptyTitle = STEP2_EMPTY_TITLE
  if (!i18nHasValue(doc?.step2EmptyMessage)) fields.step2EmptyMessage = STEP2_EMPTY_MESSAGE
  if (!i18nHasValue(doc?.step2EmptyButtonLabel)) fields.step2EmptyButtonLabel = STEP2_EMPTY_BUTTON
  if (typeof doc?.step2EmptyPhone !== 'string' || !String(doc.step2EmptyPhone).trim()) {
    fields.step2EmptyPhone = '22 60 00 50'
  }
  if (!i18nHasValue(doc?.supportFooterText)) fields.supportFooterText = SUPPORT_FOOTER

  const patched = await patchSingletonFields('bookingPage', fields, 'bookingPage')
  console.log('✓ bookingPage patched:', patched.join(', '))
  console.log('  fields:', Object.keys(fields).join(', '))
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
