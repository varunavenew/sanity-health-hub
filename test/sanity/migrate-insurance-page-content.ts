#!/usr/bin/env npx tsx
/**
 * Backfill insurancePage body content (NO + EN) without wiping hero/seo/sections.
 * Uses patchSingletonFields — never creates an empty draft.
 *
 * Usage (from test/):
 *   npm run migrate:insurance-page-content:dry
 *   npm run migrate:insurance-page-content
 */
import { sanityClient } from './config'
import { i18nString, i18nText } from './lib/category-landing-i18n'
import {
  INSURANCE_PARTNERS,
  buildInsuranceBenefits,
  buildInsuranceSteps,
  buildPartnersLocalized,
} from './lib/insurance-page-defaults'
import { patchSingletonFields } from './lib/patch-singleton'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'

type I18nEntry = { language?: string; _key?: string; value?: string }

function pickNo(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  if (!Array.isArray(value)) return ''
  const no = value.find(
    (e) => (e as I18nEntry).language === 'no' || (e as I18nEntry)._key === 'no',
  ) as I18nEntry | undefined
  return no?.value ? String(no.value).trim() : ''
}

function pickEn(value: unknown): string {
  if (!Array.isArray(value)) return ''
  const en = value.find(
    (e) => (e as I18nEntry).language === 'en' || (e as I18nEntry)._key === 'en',
  ) as I18nEntry | undefined
  return en?.value ? String(en.value).trim() : ''
}

function isI18nField(value: unknown): boolean {
  if (!Array.isArray(value) || value.length === 0) return false
  const first = value[0] as { _type?: string }
  return typeof first._type === 'string' && first._type.startsWith('internationalizedArray')
}

function needsMigration(doc: Record<string, unknown> | null): boolean {
  if (!doc) return true
  if (!pickNo(doc.title)) return true
  if (!pickNo(doc.introText)) return true
  const steps = doc.steps as unknown[] | undefined
  if (!steps?.length) return true
  const first = steps[0] as Record<string, unknown> | undefined
  if (first && typeof first.title === 'string') return true
  if (first && !isI18nField(first.title)) return true
  return false
}

function buildPayload(doc: Record<string, unknown> | null) {
  const partners =
    Array.isArray(doc?.partners) && (doc.partners as string[]).length > 0
      ? (doc.partners as string[])
      : [...INSURANCE_PARTNERS]

  const titleNo = pickNo(doc?.title) || 'Helseforsikring'
  const titleEn = pickEn(doc?.title) || 'Health Insurance'
  const introNo =
    pickNo(doc?.introText) || 'Bruk forsikringen din til raskere behandling hos oss'
  const introEn =
    pickEn(doc?.introText) || 'Use your insurance for faster treatment with us'

  const firstStep = (doc?.steps as unknown[])?.[0] as Record<string, unknown> | undefined
  const firstBenefit = (doc?.benefits as unknown[])?.[0] as Record<string, unknown> | undefined
  const firstPartner = (doc?.partnersLocalized as unknown[])?.[0] as Record<
    string,
    unknown
  > | undefined

  return {
    title: isI18nField(doc?.title) ? doc!.title : i18nString(titleNo, titleEn),
    introText: isI18nField(doc?.introText)
      ? doc!.introText
      : i18nText(introNo, introEn),
    partners,
    partnersLocalized: isI18nField(firstPartner?.name)
      ? doc?.partnersLocalized
      : buildPartnersLocalized(partners),
    steps: isI18nField(firstStep?.title) ? doc?.steps : buildInsuranceSteps(),
    benefits: isI18nField(firstBenefit?.title) ? doc?.benefits : buildInsuranceBenefits(),
  }
}

async function run() {
  const published = await sanityClient.fetch<Record<string, unknown> | null>(
    `*[_id == "insurancePage"][0]`,
  )
  const draft = await sanityClient.fetch<Record<string, unknown> | null>(
    `*[_id == "drafts.insurancePage"][0]`,
  )

  const source = published || draft

  if (!FORCE && source && !needsMigration(source)) {
    console.log('insurancePage content looks migrated — use FORCE=1 to overwrite.')
    return
  }

  const payload = buildPayload(source)

  if (DRY_RUN) {
    console.log('Dry run — would patch insurancePage (published + draft):')
    console.log('  fields:', Object.keys(payload).join(', '))
    console.log('  preserves: heroImage, seo, pageSections (unchanged by this script)')
    return
  }

  const patched = await patchSingletonFields('insurancePage', payload, 'insurancePage')
  console.log(`✓ insurancePage content — ${patched.join(', ')}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
