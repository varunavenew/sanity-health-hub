import {defineConfig} from 'sanity'
import {structureTool, type DefaultDocumentNodeResolver} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {internationalizedArray} from 'sanity-plugin-internationalized-array'
import {schemaTypes} from './schemaTypes'
import TranslateToEnglishAction from './sanity/actions/translateToEnglish'
import {
  NAV_SYNC_PAGE_TYPES,
  PublishWithNavSync,
} from './sanity/actions/publishWithNavSync'
import {EnglishFlagIcon, NorwegianFlagIcon} from './sanity/components/FlagIcons'
import {createLocalePreviewPane} from './sanity/components/LocalePreviewIframe'

// Languages enabled for field-level localization across the project.
// Add SE here later if/when Swedish content is added.
export const SUPPORTED_LANGUAGES = [
  {id: 'no', title: 'Norsk'},
  {id: 'en', title: 'English'},
] as const
import {SpecialistIcon, PricingIcon, ReviewIcon, ClinicIcon} from './schemaTypes/icons'

// Default document node with locale-specific preview panes (no + en)
const defaultDocumentNode: DefaultDocumentNodeResolver = (S, {schemaType}) => {
  const previewableTypes = [
    'article', 'treatment', 'treatmentCategory', 'specialist',
    'themePage', 'homepage', 'aboutPage', 'contactPage',
    'pricingPage', 'insurancePage', 'servicesPage', 'clinicPage', 'jobListing',
    'newsPage',
    'privacyPolicyPage',
  ]

  if (previewableTypes.includes(schemaType)) {
    const PreviewNo = createLocalePreviewPane({locale: 'no', schemaType})
    const PreviewEn = createLocalePreviewPane({locale: 'en', schemaType})

    return S.document().views([
      S.view.form().title('About'),
      S.view
        .component(PreviewNo)
        .id('preview-no')
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

const hiddenTypes = [
  'specialist',
  'specialistsPage',
  'specialistsListingPage',
  'clinicPage',
  'clinicsPage',
  'pricingPage',
  'testimonial',
  'googleReview',
  'googleReviewSettings',
  'newsPage',
]

export default defineConfig({
  name: 'default',
  title: 'sanity',
  // `/` for sanity.studio + sanity.io/@…/studio/… links; `/studio` when embedded in Next.js (see next.config.ts env).
  basePath: process.env.SANITY_STUDIO_BASEPATH || '/',

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
            item.getId() !== 'clinicsPage' &&
            item.getId() !== 'specialistsListingPage' &&
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

        const clinicsItem = S.listItem()
          .title('Clinics')
          .icon(ClinicIcon)
          .child(
            S.list()
              .title('Clinics')
              .items([
                S.listItem()
                  .title('About our clinics')
                  .icon(ClinicIcon)
                  .child(
                    S.document()
                      .schemaType('clinicsPage')
                      .documentId('clinicsPage')
                  ),
                S.documentTypeListItem('clinicPage')
                  .title('Our clinics')
                  .child(
                    S.documentTypeList('clinicPage')
                      .title('Our clinics')
                      .defaultOrdering([
                        { field: 'sortOrder', direction: 'asc' },
                        { field: '_updatedAt', direction: 'desc' },
                      ])
                  ),
              ])
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
                S.listItem()
                  .title('Specialists listing')
                  .icon(SpecialistIcon)
                  .child(
                    S.document()
                      .schemaType('specialistsListingPage')
                      .documentId('specialistsListingPage')
                  ),
                S.documentTypeListItem('specialist')
                  .title('Our specialists')
                  .child(
                    S.documentTypeList('specialist')
                      .title('Our specialists')
                      .defaultOrdering([
                        { field: 'sortOrder', direction: 'asc' },
                        { field: 'name', direction: 'asc' },
                      ]),
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
            clinicsItem,
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
      let actions = prev

      if (NAV_SYNC_PAGE_TYPES.has(context.schemaType)) {
        actions = actions.map((action) =>
          action.action === 'publish' ? PublishWithNavSync : action,
        )
      }

      const i18nTypes = new Set([
        'article', 'aboutPage', 'treatment', 'treatmentCategory',
        'homepage', 'contactPage', 'clinicPage', 'clinicsPage', 'servicesPage',
        'insurancePage', 'themePage', 'pricingPage', 'specialistsPage', 'specialistsListingPage', 'newsPage',
        'specialist',
        'siteSettings',
      ])
      if (!i18nTypes.has(context.schemaType)) return actions
      return [...actions, TranslateToEnglishAction]
    },
  },
})
