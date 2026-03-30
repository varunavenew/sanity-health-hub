import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {SpecialistIcon, PricingIcon, ReviewIcon} from './schemaTypes/icons'

const hiddenTypes = ['specialist', 'specialistsPage', 'pricingPage', 'testimonial', 'googleReview', 'googleReviewSettings']

export default defineConfig({
  name: 'default',
  title: 'sanity',

  projectId: process.env.SANITY_PROJECT_ID || '9jhqpk3a',
  dataset: process.env.SANITY_DATASET || 'production',

  plugins: [
    structureTool({
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
