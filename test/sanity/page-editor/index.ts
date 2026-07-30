/**
 * Reusable Page Editor Framework
 *
 * Page documents supply a `PageEditorConfig` (section registry).
 * Shared components never hardcode page-specific field paths.
 *
 * Presentation: Structure section list → native document form (filtered members).
 */
export type {PageEditorConfig, PageSectionDefinition} from './types'
export {
  ALL_FIELDS_GROUP_NAME,
  filterMembersByFieldNames,
  listMemberFieldNames,
  memberTreeHasFieldNames,
  resolveMembersForSectionFiltering,
} from './filterMembers'
export {
  chipsFromDocument,
  countArray,
  countChip,
  countReferenceArray,
} from './documentMeta'
export {
  definePageEditorConfig,
  definePageSections,
  getSectionById,
  listMappedFieldNames,
} from './SectionRegistry'
export {buildPageSectionListItem} from './buildPageSectionStructure'
export {PageSectionListPane} from './components/PageSectionListPane'
export {
  createPageSectionDocumentInput,
  resolveSectionId,
} from './components/PageSectionDocumentInput'
export {PageSectionsArrayInput} from './components/PageSectionsArrayInput'
export {SectionList, SectionCard, SectionPreview} from './components/SectionList'
export {Inspector, InspectorHeader, InspectorContent} from './components/Inspector'
export {
  OpenCollectionButton,
  OpenDocumentById,
  OpenEntityButton,
  SectionNotice,
} from './components/OpenCollectionButton'
export {homepagePageEditorConfig} from './pages/homepageSections'
export {aboutPageEditorConfig} from './pages/aboutSections'
export {servicesPageEditorConfig} from './pages/servicesSections'
export {insurancePageEditorConfig} from './pages/insuranceSections'
export {pricingPageEditorConfig} from './pages/pricingSections'
export {clinicsPageEditorConfig} from './pages/clinicsSections'
export {contactPageEditorConfig} from './pages/contactSections'
export {newsPageEditorConfig} from './pages/newsSections'
export {guidePageEditorConfig} from './pages/guideSections'
export {careersPageEditorConfig} from './pages/careersSections'
export {privacyPageEditorConfig} from './pages/privacySections'
export {
  createTreatmentCategoryPageEditorConfig,
  fertilitetPageEditorConfig,
  graviditetPageEditorConfig,
  gynekologiPageEditorConfig,
  urologiPageEditorConfig,
  ortopediPageEditorConfig,
  flereFagomraderPageEditorConfig,
  treatmentCategoryPageEditorConfig,
  TREATMENT_CATEGORY_EDITORS,
} from './pages/treatmentCategorySections'
export {
  articlesBandSection,
  bookingCtaBandSection,
  faqCollectionSection,
  heroSection,
  i18nPreview,
  insuranceBandSection,
  seoSection,
  specialistsBandSection,
} from './sharedSectionBuilders'

