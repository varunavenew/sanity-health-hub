#!/usr/bin/env npx tsx
import { sanityClient } from './config'

const i18nString = (no: string, en: string) => [
  { _type: 'internationalizedArrayStringValue', _key: 'no', language: 'no', value: no },
  { _type: 'internationalizedArrayStringValue', _key: 'en', language: 'en', value: en },
]

const i18nText = (no: string, en: string) => [
  { _type: 'internationalizedArrayTextValue', _key: 'no', language: 'no', value: no },
  { _type: 'internationalizedArrayTextValue', _key: 'en', language: 'en', value: en },
]

async function run() {
  const doc = {
    _id: 'newsPage',
    _type: 'newsPage',
    label: i18nString('Nyheter & Fagartikler', 'News & Articles'),
    title: i18nString('Aktuelt', 'News'),
    subtitle: i18nText(
      'Hold deg oppdatert på det siste innen medisin og nyheter fra CMedical.',
      'Stay updated on the latest in medicine and news from CMedical.',
    ),
    searchPlaceholder: i18nString('Søk i artikler...', 'Search articles...'),
    moreArticlesTitle: i18nString('Flere artikler', 'More articles'),
    noArticlesText: i18nString(
      'Ingen artikler funnet for dette filteret.',
      'No articles found for this filter.',
    ),
    readMoreLabel: i18nString('Les mer', 'Read more'),
    specialistsEyebrowAll: i18nString('Møt teamet', 'Meet the team'),
    specialistsEyebrowWithin: i18nString('Innen {{category}}', 'Within {{category}}'),
    specialistsTitle: i18nString(
      'Spesialister du kan bestille time hos',
      'Specialists you can book an appointment with',
    ),
    specialistsSeeAllLabel: i18nString('Se alle', 'See all'),
    socialSectionTitle: i18nString('Følg oss på sosiale medier', 'Follow us on social media'),
    filterAllLabel: i18nString('Alle', 'All'),
    filterPatientStoriesLabel: i18nString('Pasienthistorier', 'Patient stories'),
    filterMediaLabel: i18nString('Oss i media', 'In the media'),
    filterArticlesLabel: i18nString('Fagartikler', 'Articles'),
    filterUpdatesLabel: i18nString('Nytt fra oss', 'News from us'),
    featuredSpecialists: [],
    featuredArticles: [],
    seo: {
      _type: 'seo',
      metaTitle: i18nString('Aktuelt – Nyheter og fagartikler', 'News – Articles and updates'),
      metaDescription: i18nText(
        'Hold deg oppdatert på det siste innen medisin og nyheter fra CMedical. Fagartikler, nyheter og innsikt fra våre spesialister.',
        'Stay updated on the latest in medicine and news from CMedical. Articles, updates and insights from our specialists.',
      ),
    },
  }

  await sanityClient.createOrReplace(doc)
  await sanityClient.createOrReplace({ ...doc, _id: 'drafts.newsPage' })
  console.log('✓ newsPage (published + draft) seeded')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
