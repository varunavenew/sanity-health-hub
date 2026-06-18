#!/usr/bin/env npx tsx
/**
 * Seed clinicsPage (listing /klinikker) hero + SEO from former static frontend copy.
 *
 * Usage (from test/):
 *   npm run migrate:clinics-page:dry
 *   npm run migrate:clinics-page
 */
import { sanityClient } from './config'
import { i18nString, i18nText } from './lib/category-landing-i18n'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'

const PAGE_IDS = ['clinicsPage', 'drafts.clinicsPage']

const payload = {
  heroEyebrow: i18nString(
    '{count} klinikker · Ingen henvisning · Kort ventetid',
    '{count} clinics · No referral · Short waiting times',
  ),
  heroTitle: i18nString('Finn din nærmeste klinikk', 'Find your nearest clinic'),
  heroDescription: i18nText(
    'Våre klinikker i Norge tilbyr spesialisthjelp uten henvisning og med kort ventetid.',
    'Our clinics in Norway offer specialist care without referral and with short waiting times.',
  ),
  primaryCtaLabel: i18nString('Bestill time', 'Book appointment'),
  primaryCtaPath: '/booking',
  secondaryCtaLabel: i18nString('Kontakt oss', 'Contact us'),
  secondaryCtaPath: '/kontakt',
  seo: {
    _type: 'seo' as const,
    metaTitle: i18nString('Våre klinikker | CMedical', 'Our clinics | CMedical'),
    metaDescription: i18nText(
      'Oversikt over CMedicals fire klinikker i Norge: Oslo Majorstuen, Bekkestua, Moss og Moelv. Adresse, åpningstider, parkering, kollektivtransport og tjenester.',
      "Overview of CMedical's clinics in Norway: Oslo Majorstuen, Bekkestua, Moss and Moelv. Address, opening hours, parking, public transport and services.",
    ),
  },
}

async function run() {
  for (const id of PAGE_IDS) {
    const existing = await sanityClient.fetch<{ heroTitle?: unknown } | null>(
      `*[_id == $id][0]{ heroTitle, seo }`,
      { id },
    )

    if (!FORCE && existing?.heroTitle) {
      console.log(`– Skipped ${id} (content already set; use FORCE=1 to overwrite)`)
      continue
    }

    if (DRY_RUN) {
      console.log(`DRY ${id} — would set hero + seo (NO/EN)`)
      continue
    }

    await sanityClient.createIfNotExists({ _id: id, _type: 'clinicsPage' })
    await sanityClient.patch(id).set(payload).commit()
    console.log(`✓ ${id}`)
  }

  console.log(DRY_RUN ? '\nDry run complete.' : '\nDone.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
