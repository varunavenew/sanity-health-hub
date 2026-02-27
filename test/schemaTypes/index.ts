// Schema index — import all schemas and export as array
// Add this to your sanity.config.ts: schema: { types: schemaTypes }

import homepage from './homepage'
import treatmentCategory from './treatmentCategory'
import treatment from './treatment'
import aboutPage from './aboutPage'
import contactPage from './contactPage'
import specialist from './specialist'
import pricingPage from './pricingPage'
import insurancePage from './insurancePage'
import servicesPage from './servicesPage'
import googleReview from './googleReview'
import blockContent from './blockContent'
import seo from './seo'

export const schemaTypes = [
  // Pages
  homepage,
  aboutPage,
  contactPage,
  pricingPage,
  insurancePage,
  servicesPage,

  // Content
  treatmentCategory,
  treatment,
  specialist,
  googleReview,

  // Shared types
  blockContent,
  seo,
]
