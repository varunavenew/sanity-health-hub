#!/usr/bin/env npx tsx
/**
 * Restore insurancePage after a migration left Studio fields empty.
 * Usually caused by `createIfNotExists` on drafts.insurancePage (empty draft)
 * while only `seo` was patched.
 *
 * Usage (from test/):
 *   npm run migrate:insurance-page-restore:dry
 *   npm run migrate:insurance-page-restore
 */
import { sanityClient } from './config'
import {
  INSURANCE_PARTNERS,
  buildInsurancePageContent,
  DEFAULT_INSURANCE_SEO,
} from './lib/insurance-page-defaults'
import { patchSingletonFields } from './lib/patch-singleton'

const DRY_RUN = process.env.DRY_RUN === '1'

type I18nEntry = { language?: string; _key?: string; value?: string }

function pickLang(value: unknown, lang: 'no' | 'en'): string {
  if (typeof value === 'string') return value.trim()
  if (!Array.isArray(value)) return ''
  const match = value.find(
    (e) => (e as I18nEntry).language === lang || (e as I18nEntry)._key === lang,
  ) as I18nEntry | undefined
  if (match?.value) return String(match.value).trim()
  if (lang === 'en') return ''
  const first = value[0] as I18nEntry | undefined
  return first?.value ? String(first.value).trim() : ''
}

function hasContent(doc: Record<string, unknown> | null): boolean {
  if (!doc) return false
  return Boolean(pickLang(doc.title, 'no') || pickLang(doc.introText, 'no'))
}

async function run() {
  const published = await sanityClient.fetch<Record<string, unknown> | null>(
    `*[_id == "insurancePage"][0]`,
  )
  const draft = await sanityClient.fetch<Record<string, unknown> | null>(
    `*[_id == "drafts.insurancePage"][0]`,
  )

  const partners =
    Array.isArray(published?.partners) && (published.partners as string[]).length > 0
      ? (published.partners as string[])
      : Array.isArray(draft?.partners) && (draft.partners as string[]).length > 0
        ? (draft.partners as string[])
        : [...INSURANCE_PARTNERS]

  const defaults = buildInsurancePageContent(partners)

  const payload: Record<string, unknown> = {
    ...defaults,
    heroImage: published?.heroImage ?? draft?.heroImage,
    pageSections: published?.pageSections ?? draft?.pageSections,
    seo: published?.seo ?? draft?.seo ?? DEFAULT_INSURANCE_SEO,
  }

  console.log('Published has content:', hasContent(published))
  console.log('Draft has content:', hasContent(draft))
  console.log('Hero image kept:', Boolean(payload.heroImage))

  if (DRY_RUN) {
    console.log('\nDry run — would restore insurancePage (published + draft) with:')
    console.log('  title, introText, partners, steps, benefits, seo (+ hero if existed)')
    return
  }

  const patched = await patchSingletonFields('insurancePage', payload, 'insurancePage')
  console.log(`✓ Restored insurancePage — ${patched.join(', ')}`)
  console.log('Refresh Studio (hard reload). Publish if the editor still shows an old empty draft.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
