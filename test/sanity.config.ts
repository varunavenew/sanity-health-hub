import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {SpecialistIcon} from './schemaTypes/icons'

export default defineConfig({
  name: 'default',
  title: 'sanity',

  projectId: process.env.SANITY_PROJECT_ID || '9jhqpk3a',
  dataset: process.env.SANITY_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Homepage
            S.listItem()
              .title('Homepage')
              .child(
                S.document().schemaType('homepage').documentId('homepage')
              ),
            // Categories
            S.documentTypeListItem('treatmentCategory').title('Categories'),
            // Clinics
            S.documentTypeListItem('clinicPage').title('Clinics'),
            // Specialists group
            S.listItem()
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
              ),
            S.divider(),
            // Treatments
            S.documentTypeListItem('treatment').title('Treatments'),
            // Articles
            S.documentTypeListItem('article').title('Articles'),
            // Job listings
            S.documentTypeListItem('jobListing').title('Job listings'),
            // Products
            S.documentTypeListItem('product').title('Products'),
            // FAQs
            S.documentTypeListItem('faq').title('FAQs'),
            // Google reviews
            S.documentTypeListItem('googleReview').title('Google Reviews'),
            S.divider(),
            // Pages
            S.listItem()
              .title('Pages')
              .child(
                S.list()
                  .title('Pages')
                  .items([
                    S.listItem().title('About').child(S.document().schemaType('aboutPage').documentId('aboutPage')),
                    S.listItem().title('Contact').child(S.document().schemaType('contactPage').documentId('contactPage')),
                    S.listItem().title('Pricing').child(S.document().schemaType('pricingPage').documentId('pricingPage')),
                    S.listItem().title('Insurance').child(S.document().schemaType('insurancePage').documentId('insurancePage')),
                    S.listItem().title('Services').child(S.document().schemaType('servicesPage').documentId('servicesPage')),
                    S.listItem().title('Privacy Policy').child(S.document().schemaType('privacyPolicyPage').documentId('privacyPolicyPage')),
                    S.documentTypeListItem('themePage').title('Theme Pages'),
                    S.documentTypeListItem('clinicListPage').title('Clinic List Page'),
                  ])
              ),
            S.divider(),
            // Site settings
            S.listItem()
              .title('Site Settings')
              .child(
                S.document().schemaType('siteSettings').documentId('siteSettings')
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
