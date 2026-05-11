import {migrateToLanguageField} from 'sanity-plugin-internationalized-array/migrations'

// All document types that use internationalizedArrayString / internationalizedArrayText.
// `seo` is an object (not a document) and is migrated as part of its parent docs.
export default migrateToLanguageField([
  'article',
  'aboutPage',
  'treatment',
  'treatmentCategory',
  'homepage',
  'contactPage',
  'clinicPage',
  'servicesPage',
  'insurancePage',
  'themePage',
  'pricingPage',
  'specialistsPage',
  'specialist',
])
