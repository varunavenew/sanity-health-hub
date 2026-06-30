/**
 * Seed specialistsListingPage.profileUi from former hardcoded specialist profile copy.
 *
 * Usage (from test/):
 *   npm run migrate:specialist-profile-ui:dry
 *   npm run migrate:specialist-profile-ui
 */
import { sanityClient } from './config'
import { i18nString, i18nText } from './lib/category-landing-i18n'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'

const PAGE_IDS = ['specialistsListingPage', 'drafts.specialistsListingPage']

const profileUi = {
  loadingLabel: i18nString('Laster…', 'Loading…'),
  notFoundTitle: i18nString('Spesialist ikke funnet', 'Specialist not found'),
  notFoundBackLabel: i18nString('Gå tilbake', 'Go back'),
  breadcrumbHomeLabel: i18nString('Hjem', 'Home'),
  breadcrumbSpecialistsLabel: i18nString('Spesialister', 'Specialists'),
  bookingCtaLabel: i18nString('Bestill time hos {firstName}', 'Book an appointment with {firstName}'),
  bookingSectionTitle: i18nString('Bestill time hos {firstName}', 'Book an appointment with {firstName}'),
  bookingSectionDescription: i18nText(
    'Velg tjeneste og finn en tid som passer. Ingen henvisning nødvendig.',
    'Choose a service and find a time that suits you. No referral needed.',
  ),
  heroCallUsLabel: i18nString('Ring oss', 'Call us'),
  bioSectionTitle: i18nString('Om {firstName}', 'About {firstName}'),
  reviewsSectionTitle: i18nString('Hva pasientene sier', 'What patients say'),
  featuredServiceCtaLabel: i18nString('Se hele tjenesten', 'View full service'),
  bookingLoadingLabel: i18nString('Henter tjenester…', 'Loading services…'),
  bookingEmptyMessage: i18nText(
    'Ingen bookbare tjenester er tilgjengelig akkurat nå. Prøv booking-siden for full oversikt.',
    'No bookable services are available right now. Try the booking page for the full overview.',
  ),
  bookingViewAllLabel: i18nString('Se alle tjenester og priser', 'See all services and prices'),
  anonymousReviewLabel: i18nString('Anonym', 'Anonymous'),
}

async function run() {
  for (const id of PAGE_IDS) {
    const existing = await sanityClient.fetch<{ profileUi?: { loadingLabel?: unknown } } | null>(
      `*[_id == $id][0]{ profileUi { loadingLabel } }`,
      { id },
    )

    if (!FORCE && existing?.profileUi?.loadingLabel) {
      console.log(`– Skipped ${id} (profileUi already set; use FORCE=1 to overwrite)`)
      continue
    }

    if (DRY_RUN) {
      console.log(`DRY ${id} — would set profileUi (NO/EN)`)
      continue
    }

    await sanityClient.createIfNotExists({ _id: id, _type: 'specialistsListingPage' })
    await sanityClient.patch(id).set({ profileUi }).commit()
    console.log(`✓ ${id}`)
  }

  console.log(DRY_RUN ? '\nDry run complete.' : '\nDone.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
