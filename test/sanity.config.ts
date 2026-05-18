import {defineConfig} from 'sanity'
import {structureTool, type DefaultDocumentNodeResolver} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {Iframe} from 'sanity-plugin-iframe-pane'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {schemaTypes} from './schemaTypes'
import TranslateToEnglishAction from './sanity/actions/translateToEnglish'

// Languages enabled for field-level localization across the project.
// Add SE here later if/when Swedish content is added.
export const SUPPORTED_LANGUAGES = [
  {id: 'no', title: 'Norsk'},
  {id: 'en', title: 'English'},
] as const
import {SpecialistIcon, PricingIcon, ReviewIcon} from './schemaTypes/icons'

// Base URL for the frontend preview
// Uses localhost:5173 during local dev, production URL otherwise
const PREVIEW_BASE_URL =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:8080'
    : 'https://sanity-care-craft.lovable.app'

// Map schema types to their frontend URL paths
function resolvePreviewUrl(schemaType: string, slug?: string) {
  const routes: Record<string, string> = {
    article: '/aktuelt/',
    newsItem: '/aktuelt/',
    treatment: '/behandlinger/',
    treatmentCategory: '/tjenester/',
    specialist: '/spesialister/',
    themePage: '/tema/',
    homepage: '/',
    aboutPage: '/om-oss',
    contactPage: '/kontakt',
    pricingPage: '/priser',
    insurancePage: '/forsikring',
    servicesPage: '/tjenester',
    clinicPage: '/klinikker/',
    jobListing: '/karriere/',
  }
  const base = routes[schemaType]
  if (!base) return PREVIEW_BASE_URL
  if (slug) return `${PREVIEW_BASE_URL}${base}${slug}`
  return `${PREVIEW_BASE_URL}${base}`
}

// Default document node with preview pane for content types
const defaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType}) => {
  const previewableTypes = [
    'article', 'newsItem', 'treatment', 'treatmentCategory', 'specialist',
    'themePage', 'homepage', 'aboutPage', 'contactPage',
    'pricingPage', 'insurancePage', 'servicesPage', 'clinicPage', 'jobListing',
  ]

  if (previewableTypes.includes(schemaType)) {
    return S.document().views([
      S.view.form().title('About'),
      S.view.component(Iframe).options({
        url: (doc: any) => {
          const slug = doc?.slug?.current
          return resolvePreviewUrl(schemaType, slug)
        },
        reload: {button: true},
      }).title('View'),
    ])
  }

  return S.document().views([
    S.view.form().title('About'),
  ])
}

const hiddenTypes = ['specialist', 'specialistsPage', 'pricingPage', 'testimonial', 'googleReview', 'googleReviewSettings', 'uiTranslations']

export default defineConfig({
  name: 'default',
  title: 'sanity',

  projectId: process.env.SANITY_PROJECT_ID || '9jhqpk3a',
  dataset: process.env.SANITY_DATASET || 'production',

  plugins: [
    structureTool({
      defaultDocumentNode,
      structure: (S, context) => {
        // Mastermal-typer som har sections[] (fleksibel oppbygging).
        // Gruppert øverst slik at redaktør lett ser hvilke maler som finnes.
        const masterTemplateIds = ['treatmentCategory', 'themePage', 'treatment', 'newsItem', 'article']

        const otherItems = S.documentTypeListItems().filter(
          (item) =>
            !hiddenTypes.includes(item.getId() || '') &&
            item.getId() !== 'article' &&
            !masterTemplateIds.includes(item.getId() || '')
        )
        const mid = Math.floor(otherItems.length / 2)

        const articleItem = S.listItem()
          .title('Fagartikler / Aktuelt')
          .schemaType('article')
          .child(
            S.documentTypeList('article')
              .title('Fagartikler / Aktuelt')
              .defaultOrdering([
                { field: 'pinned', direction: 'desc' },
                { field: 'publishedAt', direction: 'desc' },
              ])
          )

        const newsItemItem = S.listItem()
          .title('Nyheter')
          .schemaType('newsItem')
          .child(
            S.documentTypeList('newsItem')
              .title('Nyheter')
              .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
          )

        const masterTemplatesItem = S.listItem()
          .title('📐 Mastermaler')
          .child(
            S.list()
              .title('Mastermaler')
              .items([
                S.documentTypeListItem('treatmentCategory').title('Fagområder'),
                S.documentTypeListItem('themePage').title('Temasider'),
                S.documentTypeListItem('treatment').title('Underbehandlinger'),
                newsItemItem,
                articleItem,
              ])
          )

        const specialistsItem = S.listItem()
          .title('Specialists')
          .icon(SpecialistIcon)
          .child(
            S.list()
              .title('Specialists')
              .items([
                S.listItem()
                  .title('About our specialists')
                  .icon(SpecialistIcon)
                  .child(
                    S.document()
                      .schemaType('specialistsPage')
                      .documentId('specialistsPage')
                  ),
                S.documentTypeListItem('specialist')
                  .title('Our specialists')
                  .child(
                    S.documentTypeList('specialist')
                      .title('Our specialists')
                      .defaultOrdering([
                        { field: 'sortOrder', direction: 'asc' },
                        { field: 'name', direction: 'asc' },
                      ])
                  ),
              ])
          )

        const priserItem = S.listItem()
          .title('Priser')
          .icon(PricingIcon)
          .child(
            S.list()
              .title('Priser')
              .items([
                S.listItem()
                  .title('Prisliste')
                  .icon(PricingIcon)
                  .child(
                    S.document()
                      .schemaType('pricingPage')
                      .documentId('pricingPage')
                  ),
                S.documentTypeListItem('testimonial')
                  .title('Tilbakemeldinger')
                  .icon(ReviewIcon),
              ])
          )

        const googleReviewsItem = S.listItem()
          .title('Google Reviews')
          .icon(ReviewIcon)
          .child(
            S.list()
              .title('Google Reviews')
              .items([
                S.listItem()
                  .title('Om Google Reviews')
                  .icon(ReviewIcon)
                  .child(
                    S.document()
                      .schemaType('googleReviewSettings')
                      .documentId('googleReviewSettings')
                  ),
                S.documentTypeListItem('googleReview')
                  .title('Google-anmeldelser')
                  .icon(ReviewIcon),
              ])
          )

        const uiTranslationsItem = S.listItem()
          .title('🌐 UI-tekster')
          .child(
            S.document()
              .schemaType('uiTranslations')
              .documentId('uiTranslations')
          )

        return S.list()
          .title('Content')
          .items([
            masterTemplatesItem,
            uiTranslationsItem,
            S.divider(),
            ...otherItems.slice(0, mid),
            specialistsItem,
            priserItem,
            googleReviewsItem,
            ...otherItems.slice(mid),
          ])
      },
    }),
    visionTool(),
    internationalizedArray({
      languages: SUPPORTED_LANGUAGES.map((l) => ({id: l.id, title: l.title})),
      defaultLanguages: ['no'],
      // The base types we want a localized variant of.
      // Studio will register: internationalizedArrayString, internationalizedArrayText,
      // internationalizedArrayBlockContent (Portable Text)
      fieldTypes: ['string', 'text', 'blockContent'],
    }),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      const i18nTypes = new Set([
        'article', 'newsItem', 'aboutPage', 'treatment', 'treatmentCategory',
        'homepage', 'contactPage', 'clinicPage', 'servicesPage',
        'insurancePage', 'themePage', 'pricingPage', 'specialistsPage',
        'specialist',
      ])
      if (!i18nTypes.has(context.schemaType)) return prev
      return [...prev, TranslateToEnglishAction]
    },
  },
})
