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
import googleReviewSettings from './googleReviewSettings'
import blockContent from './blockContent'
import youtubeEmbed from './youtubeEmbed'
import seo from './seo'
import siteSettings from './siteSettings'
import clinicPage from './clinicPage'

import article from './article'
import jobListing from './jobListing'
import privacyPolicyPage from './privacyPolicyPage'
import faq from './faq'
import themePage from './themePage'
import product from './product'
import specialistsPage from './specialistsPage'
import testimonial from './testimonial'
import {
  pageSectionSpecialists,
  pageSectionArticles,
} from './pageSections'


export const schemaTypes = [
  // Pages
  homepage,
  aboutPage,
  contactPage,
  pricingPage,
  insurancePage,
  servicesPage,
  clinicPage,
  
  themePage,
  specialistsPage,

  // Content
  treatmentCategory,
  treatment,
  specialist,
  googleReview,
  googleReviewSettings,
  article,
  jobListing,
  privacyPolicyPage,
  faq,
  product,
  testimonial,
  

  // Shared types
  pageSectionSpecialists,
  pageSectionArticles,
  youtubeEmbed,
  blockContent,
  seo,
  siteSettings,
]
