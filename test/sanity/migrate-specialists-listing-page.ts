#!/usr/bin/env npx tsx
/**
 * Seed specialistsListingPage (/spesialister) hero + SEO from former i18n/static copy.
 *
 * Usage (from test/):
 *   npm run migrate:specialists-listing-page:dry
 *   npm run migrate:specialists-listing-page
 */
import { sanityClient } from './config'
import { i18nString, i18nText } from './lib/category-landing-i18n'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'

const PAGE_IDS = ['specialistsListingPage', 'drafts.specialistsListingPage']

const payload = {
  heroEyebrow: i18nString('Vårt team', 'Our team'),
  heroTitle: i18nString('Møt våre spesialister', 'Meet our specialists'),
  heroDescription: i18nText(
    'Erfaring, spisskompetanse og moderne teknologi – samlet på ett sted.',
    'Experience, cutting-edge expertise and modern technology all in one place.',
  ),
  countLabel: i18nString('{count} spesialister', '{count} specialists'),
  seo: {
    _type: 'seo' as const,
    metaTitle: i18nString(
      'Våre spesialister – Ledende eksperter samlet på ett sted',
      'Our specialists – Leading experts in one place',
    ),
    metaDescription: i18nText(
      'Møt CMedicals spesialister innen gynekologi, fertilitet, urologi og ortopedi. Erfaring, spisskompetanse og moderne teknologi – ingen henvisning nødvendig.',
      "Meet CMedical's specialists in gynecology, fertility, urology and orthopedics. Experience, expertise and modern technology – no referral needed.",
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

    await sanityClient.createIfNotExists({ _id: id, _type: 'specialistsListingPage' })
    await sanityClient.patch(id).set(payload).commit()
    console.log(`✓ ${id}`)
  }

  console.log(DRY_RUN ? '\nDry run complete.' : '\nDone.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
