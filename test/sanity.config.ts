import {defineConfig} from 'sanity'
import {structureTool, type DefaultDocumentNodeResolver} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {schemaTypes} from './schemaTypes'
import TranslateToEnglishAction from './sanity/actions/translateToEnglish'
import {EnglishFlagIcon, NorwegianFlagIcon} from './sanity/components/FlagIcons'
import {createLocalePreviewPane} from './sanity/components/LocalePreviewIframe'

// Languages enabled for field-level localization across the project.
// Add SE here later if/when Swedish content is added.
export const SUPPORTED_LANGUAGES = [
  {id: 'no', title: 'Norsk'},
  {id: 'en', title: 'English'},
] as const
import {SpecialistIcon, PricingIcon, ReviewIcon} from './schemaTypes/icons'

// Default document node with locale-specific preview panes (nb + en)
const defaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType}) => {
  const previewableTypes = [
    'article', 'treatment', 'treatmentCategory', 'specialist',
    'themePage', 'homepage', 'aboutPage', 'contactPage',
    'pricingPage', 'insurancePage', 'servicesPage', 'clinicPage', 'jobListing',
    'newsPage',
    'privacyPolicyPage',
  ]

  if (previewableTypes.includes(schemaType)) {
    const PreviewNb = createLocalePreviewPane({locale: 'nb', schemaType})
    const PreviewEn = createLocalePreviewPane({locale: 'en', schemaType})

    return S.document().views([
      S.view.form().title('About'),
      S.view
        .component(PreviewNb)
        .id('preview-nb')
        .title('View')
        .icon(NorwegianFlagIcon),
      S.view
        .component(PreviewEn)
        .id('preview-en')
        .title('View')
        .icon(EnglishFlagIcon),
    ])
  }

  return S.document().views([
    S.view.form().title('About'),
  ])
}

const hiddenTypes = ['specialist', 'specialistsPage', 'pricingPage', 'testimonial', 'googleReview', 'googleReviewSettings']

export default defineConfig({
  name: 'default',
  title: 'sanity',

  projectId: process.env.SANITY_PROJECT_ID || '9jhqpk3a',
  dataset: process.env.SANITY_DATASET || 'production',

  plugins: [
    structureTool({
      defaultDocumentNode,
      structure: (S, context) => {
        const otherItems = S.documentTypeListItems().filter(
          (item) =>
            !hiddenTypes.includes(item.getId() || '') &&
            item.getId() !== 'article' &&
            item.getId() !== 'clinicPage' &&
            item.getId() !== 'treatmentCategory' &&
            item.getId() !== 'treatment',
        )
        const mid = Math.floor(otherItems.length / 2)

        // Articles section (same pattern as Specialists): singleton + list
        const articleItem = S.listItem()
          .title('Articles')
          .child(
            S.list()
              .title('Articles')
              .items([
                S.listItem()
                  .title('About Articles')
                  .schemaType('newsPage')
                  .child(
                    S.document()
                      .schemaType('newsPage')
                      .documentId('newsPage')
                  ),
                S.listItem()
                  .title('Our Articles')
                  .schemaType('article')
                  .child(
                    S.documentTypeList('article')
                      .title('Our Articles')
                      .defaultOrdering([
                        { field: 'pinned', direction: 'desc' },
                        { field: 'publishedAt', direction: 'desc' },
                      ])
                  ),
              ])
          )

        const clinicItem = S.listItem()
          .title('Klinikk')
          .schemaType('clinicPage')
          .child(
            S.documentTypeList('clinicPage')
              .title('Klinikk')
              .defaultOrdering([{ field: '_updatedAt', direction: 'desc' }])
          )

        const treatmentCategoryItem = S.listItem()
          .title('Behandlingskategori')
          .schemaType('treatmentCategory')
          .child(
            S.documentTypeList('treatmentCategory')
              .title('Behandlingskategori')
              .defaultOrdering([{ field: '_updatedAt', direction: 'desc' }])
          )

        const treatmentItem = S.listItem()
          .title('Behandling')
          .schemaType('treatment')
          .child(
            S.documentTypeList('treatment')
              .title('Behandling')
              .defaultOrdering([{ field: '_updatedAt', direction: 'desc' }])
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

        return S.list()
          .title('Content')
          .items([
            ...otherItems.slice(0, mid),
            articleItem,
            clinicItem,
            treatmentCategoryItem,
            treatmentItem,
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
      // internationalizedArrayBlockContent, internationalizedArraySlug
      fieldTypes: ['string', 'text', 'blockContent', 'slug'],
    }),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    actions: (prev, context) => {
      const i18nTypes = new Set([
        'article', 'aboutPage', 'treatment', 'treatmentCategory',
        'homepage', 'contactPage', 'clinicPage', 'servicesPage',
        'insurancePage', 'themePage', 'pricingPage', 'specialistsPage', 'newsPage',
        'specialist',
        'siteSettings',
      ])
      if (!i18nTypes.has(context.schemaType)) return prev
      return [...prev, TranslateToEnglishAction]
    },
  },
})
