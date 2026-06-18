/**
 * Ensure homepage has specialists + booking CTA modular sections.
 *
 * Usage:
 *   cd test && npm run migrate:homepage-page-sections:dry
 *   cd test && npm run migrate:homepage-page-sections
 */
import { i18nString, i18nText } from './lib/category-landing-i18n'
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'
const HOMEPAGE_ID = 'homepage'

const DEFAULT_BOOKING_NO = {
  title: 'Bestill time hos spesialist',
  subtitle: 'Velg tjeneste, klinikk og behandler – alt i én enkel booking.',
  primaryLabel: 'Bestill time nå',
  secondaryLabel: 'Ring oss',
  quickInfo: [
    { icon: 'clock', no: 'Ledig time innen 1–3 dager', en: 'Available appointments within 1–3 days' },
    { icon: 'shield', no: 'Ingen henvisning nødvendig', en: 'No referral needed' },
  ],
}

const DEFAULT_BOOKING_EN = {
  title: 'Book an appointment with a specialist',
  subtitle: 'Choose service, clinic and practitioner – all in one simple booking.',
  primaryLabel: 'Book now',
  secondaryLabel: 'Call us',
}

function hasSectionType(sections: unknown[] | undefined, type: string): boolean {
  if (!Array.isArray(sections)) return false
  return sections.some((s) => (s as { _type?: string })?._type === type)
}

async function run() {
  const homepage = await sanityClient.fetch<{ _id: string; pageSections?: unknown[] } | null>(
    `*[_id == $id][0]{ _id, pageSections }`,
    { id: HOMEPAGE_ID },
  )

  if (!homepage) {
    console.error(`Homepage document "${HOMEPAGE_ID}" not found`)
    process.exit(1)
  }

  console.log('▶ Migrate homepage modular sections')
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}`)
  console.log(`  Force overwrite: ${FORCE ? 'yes' : 'no'}\n`)

  const existing = Array.isArray(homepage.pageSections) ? [...homepage.pageSections] : []
  const patchSections = [...existing]
  let changed = false

  if (FORCE || !hasSectionType(patchSections, 'pageSectionSpecialists')) {
    patchSections.push({
      _type: 'pageSectionSpecialists',
      _key: 'homepage-specialists',
      eyebrow: i18nString('Våre eksperter', 'Our experts'),
      title: i18nString('Møt våre spesialister', 'Meet our specialists'),
      description: i18nString(
        'Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.',
        'Experience, expertise and modern technology in one place.',
      ),
      displayMode: 'all',
      seeAllLabel: i18nString('Se alle spesialister', 'See all specialists'),
      seeAllHref: '/spesialister',
      limit: 24,
      variant: 'carousel',
    })
    changed = true
  }

  if (FORCE || !hasSectionType(patchSections, 'pageSectionBookingCta')) {
    patchSections.push({
      _type: 'pageSectionBookingCta',
      _key: 'homepage-booking-cta',
      title: i18nString(DEFAULT_BOOKING_NO.title, DEFAULT_BOOKING_EN.title),
      subtitle: i18nText(DEFAULT_BOOKING_NO.subtitle, DEFAULT_BOOKING_EN.subtitle),
      primaryLabel: i18nString(
        DEFAULT_BOOKING_NO.primaryLabel,
        DEFAULT_BOOKING_EN.primaryLabel,
      ),
      primaryPath: '/booking',
      secondaryLabel: i18nString(
        DEFAULT_BOOKING_NO.secondaryLabel,
        DEFAULT_BOOKING_EN.secondaryLabel,
      ),
      quickInfoItems: DEFAULT_BOOKING_NO.quickInfo.map((item) => ({
        _key: item.icon,
        icon: item.icon,
        text: i18nString(item.no, item.en),
      })),
    })
    changed = true
  }

  if (!changed) {
    console.log('⏭  Homepage already has specialists + booking CTA sections')
    return
  }

  console.log('  ✎ homepage')
  if (!DRY_RUN) {
    await sanityClient.patch(homepage._id).set({ pageSections: patchSections }).commit()
  }

  console.log(`\n✅ ${DRY_RUN ? 'Would update' : 'Updated'} homepage pageSections`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
