// Schema index — import all schemas and export as array
// Add this to your sanity.config.ts: schema: { types: schemaTypes }

import homepage from './homepage'
import treatmentCategory from './treatmentCategory'
import treatment from './treatment'
import aboutPage from './aboutPage'
import contactPage from './contactPage'
import specialist from './specialist'
import newsPage from './newsPage'
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
import clinicsPage from './clinicsPage'
import careersPage from './careersPage'
import bookingPage from './bookingPage'
import guidePage from './guidePage'

import article from './article'
import jobListing from './jobListing'
import privacyPolicyPage from './privacyPolicyPage'
import faq from './faq'
import themePage from './themePage'
import product from './product'
import specialistsPage from './specialistsPage'
import specialistsListingPage from './specialistsListingPage'
import testimonial from './testimonial'
import listingSortSettings from './listingSortSettings'
import {
  pageSectionSpecialists,
  pageSectionArticles,
  pageSectionBookingCta,
} from './pageSections'
import { subTreatmentLayoutType } from './subTreatmentLayout'
import { locationSearchType } from './locationSearch'


export const schemaTypes = [
  listingSortSettings,
  // Pages
  homepage,
  aboutPage,
  contactPage,
  newsPage,
  pricingPage,
  insurancePage,
  servicesPage,
  clinicPage,
  clinicsPage,
  careersPage,
  bookingPage,
  guidePage,

  themePage,
  specialistsPage,
  specialistsListingPage,

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
  locationSearchType,
  subTreatmentLayoutType,
  pageSectionSpecialists,
  pageSectionArticles,
  pageSectionBookingCta,
  youtubeEmbed,
  blockContent,
  seo,
  siteSettings,
]
