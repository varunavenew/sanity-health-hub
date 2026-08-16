/**
 * Sanity Studio desk structure (Phase 1 — CMS redesign).
 *
 * Studio-only: does not change schemas, document IDs, queries, or frontend.
 * Component Library is intentionally a flat extensible list — add new
 * `S.listItem()` entries under `componentLibraryItems` as library types arrive.
 */
import type {ComponentType} from 'react'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import {
  ArticleIcon,
  CalendarIcon,
  CategoryIcon,
  ClinicIcon,
  CtaIcon,
  FAQIcon,
  HomeIcon,
  InsuranceIcon,
  JobIcon,
  PricingIcon,
  ReviewIcon,
  SettingsIcon,
  SortIcon,
  SpecialistIcon,
  ThemeIcon,
  TreatmentIcon,
} from '../schemaTypes/icons'
import {buildDocumentPageSectionChild, buildPageSectionListItem} from './page-editor/buildPageSectionStructure'
import {homepagePageEditorConfig} from './page-editor/pages/homepageSections'
import {aboutPageEditorConfig} from './page-editor/pages/aboutSections'
import {servicesPageEditorConfig} from './page-editor/pages/servicesSections'
import {insurancePageEditorConfig} from './page-editor/pages/insuranceSections'
import {pricingPageEditorConfig} from './page-editor/pages/pricingSections'
import {clinicsPageEditorConfig} from './page-editor/pages/clinicsSections'
import {contactPageEditorConfig} from './page-editor/pages/contactSections'
import {newsPageEditorConfig} from './page-editor/pages/newsSections'
import {guidePageEditorConfig} from './page-editor/pages/guideSections'
import {careersPageEditorConfig} from './page-editor/pages/careersSections'
import {privacyPageEditorConfig} from './page-editor/pages/privacySections'
import {opennessActPageEditorConfig} from './page-editor/pages/opennessActSections'
import {
  createTreatmentCategoryPageEditorConfig,
  TREATMENT_CATEGORY_EDITORS,
} from './page-editor/pages/treatmentCategorySections'
import {treatmentPageEditorConfig} from './page-editor/pages/treatmentSections'

/** Fixed-ID singleton editor — IDs match existing published documents. */
function singletonListItem(
  S: StructureBuilder,
  options: {
    title: string
    schemaType: string
    documentId: string
    icon?: ComponentType
  },
) {
  let item = S.listItem().title(options.title).schemaType(options.schemaType)
  if (options.icon) {
    item = item.icon(options.icon)
  }
  return item.child(
    S.document().schemaType(options.schemaType).documentId(options.documentId),
  )
}

function pagesSection(S: StructureBuilder) {
  const pricingItem = S.listItem()
    .title('Pricing')
    .icon(PricingIcon)
    .child(
      S.list()
        .title('Pricing')
        .items([
          buildPageSectionListItem(S, {
            title: 'Pricing Page',
            schemaType: 'pricingPage',
            documentId: 'pricingPage',
            icon: PricingIcon,
            config: pricingPageEditorConfig,
            withLocalePreviews: true,
          }),
          S.documentTypeListItem('testimonial')
            .title('Testimonials')
            .icon(ReviewIcon),
        ]),
    )

  const newsItem = S.listItem()
    .title('News')
    .icon(ArticleIcon)
    .child(
      S.list()
        .title('News')
        .items([
          buildPageSectionListItem(S, {
            title: 'News Page',
            schemaType: 'newsPage',
            documentId: 'newsPage',
            icon: ArticleIcon,
            config: newsPageEditorConfig,
            withLocalePreviews: true,
          }),
          S.listItem()
            .title('Articles')
            .schemaType('article')
            .child(
              S.documentTypeList('article')
                .title('Articles')
                .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
            ),
        ]),
    )

  const careersItem = S.listItem()
    .title('Careers')
    .icon(JobIcon)
    .child(
      S.list()
        .title('Careers')
        .items([
          buildPageSectionListItem(S, {
            title: 'Careers Page',
            schemaType: 'careersPage',
            documentId: 'careersPage',
            icon: JobIcon,
            config: careersPageEditorConfig,
            withLocalePreviews: true,
          }),
          S.documentTypeListItem('jobListing')
            .title('Job Listings')
            .icon(JobIcon)
            .child(
              S.documentTypeList('jobListing')
                .title('Job Listings')
                .defaultOrdering([{field: 'publishedAt', direction: 'desc'}]),
            ),
        ]),
    )

  return S.listItem()
    .title('Pages')
    .icon(HomeIcon)
    .child(
      S.list()
        .title('Pages')
        .items([
          buildPageSectionListItem(S, {
            title: 'Home',
            schemaType: 'homepage',
            documentId: 'homepage',
            icon: HomeIcon,
            config: homepagePageEditorConfig,
            withLocalePreviews: true,
          }),
          buildPageSectionListItem(S, {
            title: 'About',
            schemaType: 'aboutPage',
            documentId: 'aboutPage',
            config: aboutPageEditorConfig,
            withLocalePreviews: true,
          }),
          buildPageSectionListItem(S, {
            title: 'Services',
            schemaType: 'servicesPage',
            documentId: 'servicesPage',
            icon: TreatmentIcon,
            config: servicesPageEditorConfig,
            withLocalePreviews: true,
          }),
          buildPageSectionListItem(S, {
            title: 'Insurance',
            schemaType: 'insurancePage',
            documentId: 'insurancePage',
            config: insurancePageEditorConfig,
            withLocalePreviews: true,
          }),
          pricingItem,
          buildPageSectionListItem(S, {
            title: 'Clinics',
            schemaType: 'clinicsPage',
            documentId: 'clinicsPage',
            icon: ClinicIcon,
            config: clinicsPageEditorConfig,
            withLocalePreviews: true,
          }),
          buildPageSectionListItem(S, {
            title: 'Contact',
            schemaType: 'contactPage',
            documentId: 'contactPage',
            config: contactPageEditorConfig,
            withLocalePreviews: true,
          }),
          newsItem,
          buildPageSectionListItem(S, {
            title: 'Guide',
            schemaType: 'guidePage',
            documentId: 'guidePage',
            config: guidePageEditorConfig,
            withLocalePreviews: true,
          }),
          careersItem,
          buildPageSectionListItem(S, {
            title: 'Privacy Policy',
            schemaType: 'privacyPolicyPage',
            documentId: 'privacyPolicyPage',
            config: privacyPageEditorConfig,
            withLocalePreviews: true,
          }),
          buildPageSectionListItem(S, {
            title: 'Transparency Act 2025',
            schemaType: 'opennessActPage',
            documentId: 'opennessActPage',
            config: opennessActPageEditorConfig,
            withLocalePreviews: true,
          }),
        ]),
    )
}

function medicalContentSection(S: StructureBuilder) {
  const specialistsItem = S.listItem()
    .id('medical-content-specialists')
    .title('Specialists')
    .icon(SpecialistIcon)
    .child(
      S.list()
        .id('medical-content-specialists-root')
        .title('Specialists')
        .items([
          S.listItem()
            .title('Specialists Page')
            .icon(SpecialistIcon)
            .child(
              S.document()
                .schemaType('specialistsPage')
                .documentId('specialistsPage'),
            ),
          S.listItem()
            .title('Specialists Listing Page')
            .icon(SpecialistIcon)
            .child(
              S.document()
                .schemaType('specialistsListingPage')
                .documentId('specialistsListingPage'),
            ),
          S.documentTypeListItem('specialist')
            .id('medical-content-specialist-documents')
            .title('Specialists')
            .child(
              S.documentTypeList('specialist')
                .id('medical-content-specialist-documents-list')
                .title('Specialists')
                .defaultOrdering([
                  {field: 'sortOrder', direction: 'asc'},
                  {field: 'name', direction: 'asc'},
                ]),
            ),
        ]),
    )

  return S.listItem()
    .id('medical-content')
    .title('Medical Content')
    .icon(TreatmentIcon)
    .child(
      S.list()
        .title('Medical Content')
        .items([
          S.listItem()
            .title('Treatment Categories')
            .icon(CategoryIcon)
            .schemaType('treatmentCategory')
            .child(
              S.list()
                .title('Treatment Categories')
                .items(
                  TREATMENT_CATEGORY_EDITORS.map((entry) =>
                    buildPageSectionListItem(S, {
                      title: entry.title,
                      schemaType: 'treatmentCategory',
                      documentId: entry.documentId,
                      icon: CategoryIcon,
                      config: createTreatmentCategoryPageEditorConfig({title: entry.title}),
                      withLocalePreviews: true,
                    }),
                  ),
                ),
            ),
          S.listItem()
            .title('Treatments')
            .icon(TreatmentIcon)
            .schemaType('treatment')
            .child(
              S.documentTypeList('treatment')
                .title('Treatments')
                .defaultOrdering([{field: '_updatedAt', direction: 'desc'}])
                .child((documentId) =>
                  buildDocumentPageSectionChild(S, {
                    documentId,
                    schemaType: 'treatment',
                    config: treatmentPageEditorConfig,
                    withLocalePreviews: true,
                  }),
                ),
            ),
          specialistsItem,
          S.listItem()
            .title('Clinic Locations')
            .icon(ClinicIcon)
            .schemaType('clinicPage')
            .child(
              S.documentTypeList('clinicPage')
                .title('Clinic Locations')
                .defaultOrdering([
                  {field: 'sortOrder', direction: 'asc'},
                  {field: '_updatedAt', direction: 'desc'},
                ]),
            ),
          S.listItem()
            .title('Clinician Guides')
            .icon(ThemeIcon)
            .schemaType('clinicianGuidePage')
            .child(
              S.documentTypeList('clinicianGuidePage')
                .title('Clinician Guides')
                .defaultOrdering([{field: '_updatedAt', direction: 'desc'}]),
            ),
        ]),
    )
}

/**
 * Extensible library section.
 * Phase 2: FAQ Collections + FAQ Items.
 * V3 Phase 2: CTA Collections + Insurance Collections.
 * Google Reviews: shared review entities (no Review Collections).
 * CTA Modules (deprecated) + Hero Modules: hidden from this list (schemas still
 * registered — hard-delete in a later cleanup pass).
 * Future modules = add one list item here when schemas exist.
 */
function componentLibrarySection(S: StructureBuilder) {
  const componentLibraryItems = [
    S.listItem()
      .title('FAQ Collections')
      .icon(FAQIcon)
      .schemaType('faqCollection')
      .child(
        S.documentTypeList('faqCollection')
          .title('FAQ Collections')
          .defaultOrdering([
            {field: 'sortOrder', direction: 'asc'},
            {field: 'title', direction: 'asc'},
          ]),
      ),
    S.listItem()
      .title('FAQ Items')
      .icon(FAQIcon)
      .schemaType('faq')
      .child(
        S.documentTypeList('faq')
          .title('FAQ Items')
          .defaultOrdering([{field: 'sortOrder', direction: 'asc'}]),
      ),
    S.listItem()
      .title('CTA Collections')
      .icon(CtaIcon)
      .schemaType('ctaCollection')
      .child(
        S.documentTypeList('ctaCollection')
          .title('CTA Collections')
          .defaultOrdering([
            {field: 'sortOrder', direction: 'asc'},
            {field: 'internalName', direction: 'asc'},
          ]),
      ),
    S.listItem()
      .title('Insurance Collections')
      .icon(InsuranceIcon)
      .schemaType('insuranceCollection')
      .child(
        S.documentTypeList('insuranceCollection')
          .title('Insurance Collections')
          .defaultOrdering([
            {field: 'sortOrder', direction: 'asc'},
            {field: 'internalName', direction: 'asc'},
          ]),
      ),
    S.documentTypeListItem('googleReview')
      .title('Google & Legelisten Reviews')
      .icon(ReviewIcon)
      .child(
        S.documentTypeList('googleReview')
          .title('Google & Legelisten Reviews')
          .defaultOrdering([{field: '_createdAt', direction: 'desc'}]),
      ),
    // Future:
    // S.listItem().title('Statistics Blocks')...
    // S.listItem().title('Partner Logos')...
  ]

  return S.listItem()
    .title('Content Library')
    .icon(FAQIcon)
    .child(S.list().title('Content Library').items(componentLibraryItems))
}

function settingsSection(S: StructureBuilder) {
  return S.listItem()
    .title('Settings')
    .icon(SettingsIcon)
    .child(
      S.list()
        .title('Settings')
        .items([
          singletonListItem(S, {
            title: 'Site Settings',
            schemaType: 'siteSettings',
            documentId: 'siteSettings',
          }),
          singletonListItem(S, {
            title: 'Booking',
            schemaType: 'bookingPage',
            documentId: 'bookingPage',
            icon: CalendarIcon,
          }),
          S.listItem()
            .title('Sorting Preferences')
            .icon(SortIcon)
            .child(
              S.document()
                .schemaType('listingSortSettings')
                .documentId('listingSortSettings'),
            ),
        ]),
    )
}

/**
 * Types intentionally omitted from the desk (schemas remain registered):
 * - themePage (Homepage Carousel)
 * - product (Products)
 *
 * Everything else is reached via an explicit group below — no leftover
 * auto-list splice (that was the previous editor-unfriendly layout).
 */
export const deskStructure: StructureResolver = (S) =>
  S.list()
    .title('Menu')
    .items([
      pagesSection(S),
      medicalContentSection(S),
      componentLibrarySection(S),
      settingsSection(S),
    ])
