import {defineConfig} from 'sanity'
import {structureTool, type DefaultDocumentNodeResolver} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {Iframe} from 'sanity-plugin-iframe-pane'
import {schemaTypes} from './schemaTypes'
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
    'article', 'treatment', 'treatmentCategory', 'specialist',
    'themePage', 'homepage', 'aboutPage', 'contactPage',
    'pricingPage', 'insurancePage', 'servicesPage', 'clinicPage', 'jobListing',
  ]

  if (previewableTypes.includes(schemaType)) {
    return S.document().views([
      S.view.form(),
      S.view.component(Iframe).options({
        url: (doc: any) => {
          const slug = doc?.slug?.current
          return resolvePreviewUrl(schemaType, slug)
        },
        reload: {button: true},
      }).title('View'),
    ])
  }

  return S.document().views([S.view.form()])
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
          (item) => !hiddenTypes.includes(item.getId() || '')
        )
        const mid = Math.floor(otherItems.length / 2)

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
                S.documentTypeListItem('specialist').title('Our specialists'),
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
            specialistsItem,
            priserItem,
            googleReviewsItem,
            ...otherItems.slice(mid),
          ])
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
