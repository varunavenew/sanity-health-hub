/**
 * Seed homepage layout sections: patient trust banner, news split copy, results stats.
 *
 * Run:
 *   cd test && npm run migrate:homepage-layout-sections:dry
 *   npm run migrate:homepage-layout-sections
 */
import { sanityClient } from './config'
import { i18nString, i18nText } from './lib/category-landing-i18n'

const DRY_RUN = process.env.DRY_RUN === '1'
const FORCE = process.env.FORCE === '1'
const HOMEPAGE_ID = 'homepage'

async function run() {
  const homepage = await sanityClient.fetch<{
    patientTrustBanner?: unknown
    newsSplitSection?: unknown
    resultsStatsSection?: unknown
  } | null>(`*[_id == $id][0]{
    patientTrustBanner,
    newsSplitSection,
    resultsStatsSection
  }`, { id: HOMEPAGE_ID })

  if (!homepage) {
    console.error(`✗ Missing ${HOMEPAGE_ID}`)
    process.exit(1)
  }

  const patch: Record<string, unknown> = {}

  if (FORCE || !homepage.patientTrustBanner) {
    patch.patientTrustBanner = {
      value: '150 000 +',
      label: i18nString('Fornøyde pasienter siden 2002.', 'Satisfied patients since 2002.'),
      ctaText: i18nString('Se våre tjenester', 'See our services'),
      ctaLink: '/tjenester',
    }
  }

  if (FORCE || !homepage.newsSplitSection) {
    patch.newsSplitSection = {
      heading: i18nString('Nyheter og artikler fra CMedical', 'News and articles from CMedical'),
      description: i18nText(
        'Fagstoff, pasienthistorier og oppdateringer fra spesialistene våre — skrevet for deg som vil forstå mer om egen helse.',
        'Expert content, patient stories and updates from our specialists — written for you who want to understand more about your own health.',
      ),
      ctaLabel: i18nString('Se alle artikler', 'See all articles'),
      ctaPath: '/aktuelt',
    }
  }

  if (FORCE || !homepage.resultsStatsSection) {
    patch.resultsStatsSection = {
      title: i18nString('Tall som forteller en historie.', 'Numbers that tell a story.'),
      description: i18nText(
        'Du fortjener åpenhet. Her er noen av tallene som beskriver hverdagen vår — på tvers av spesialiteter, klinikker og pasientmøter.',
        'You deserve transparency. Here are some figures that describe our everyday work — across specialties, clinics and patient encounters.',
      ),
      category: i18nString('CMedical totalt', 'CMedical total'),
      footnote: i18nString(
        'Tall oppdatert per Q1 2026. Resultater varierer individuelt.',
        'Figures updated Q1 2026. Results vary individually.',
      ),
      stats: [
        {
          value: '45 000+',
          label: i18nString('Konsultasjoner', 'Consultations'),
          sub: i18nString('Per år', 'Per year'),
        },
        {
          value: '40+',
          label: i18nString('Spesialister', 'Specialists'),
          sub: i18nString('På tvers av fagfelt', 'Across disciplines'),
        },
        {
          value: '98%',
          label: i18nString('Vil anbefale oss', 'Would recommend us'),
          sub: i18nString('Pasientundersøkelse', 'Patient survey'),
        },
        {
          value: '< 3 dager',
          label: i18nString('Ventetid', 'Waiting time'),
          sub: i18nString('Snitt til første time', 'Average to first appointment'),
        },
      ],
    }
  }

  if (Object.keys(patch).length === 0) {
    console.log('✓ homepage layout sections already configured (use FORCE=1 to overwrite)')
    return
  }

  console.log('Patch keys:', Object.keys(patch).join(', '))

  if (DRY_RUN) {
    console.log('DRY_RUN — no changes written')
    return
  }

  await sanityClient.patch(HOMEPAGE_ID).set(patch).commit()
  console.log('✓ homepage layout sections migrated')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
