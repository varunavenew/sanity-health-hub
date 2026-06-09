// Centralized Sanity GROQ queries
import { localizedSeoObject } from "@/lib/sanity/seo-groq";
import {
  localizedRefSlugField,
  localizedSlug,
  orderSlugAsc,
  slugMatchesParam,
  slugMatchesRefParam,
} from "@/lib/sanity/slug-groq";

const i18nPageSectionString = (field: string) =>
  `"${field}": coalesce(${field}[language == $lang][0].value, ${field}[_key == $lang][0].value, ${field}[language == "no"][0].value, ${field}[_key == "no"][0].value, ${field})`;

const i18nPageSectionText = (field: string) =>
  `"${field}": coalesce(${field}[language == $lang][0].value, ${field}[_key == $lang][0].value, ${field}[language == "no"][0].value, ${field}[_key == "no"][0].value, ${field})`;

const i18nString = (field: string) =>
  `"${field}": coalesce(${field}[language == $lang][0].value, ${field}[_key == $lang][0].value, ${field}[language == "no"][0].value, ${field}[_key == "no"][0].value, ${field})`;

const i18nText = (field: string) =>
  `"${field}": coalesce(${field}[language == $lang][0].value, ${field}[_key == $lang][0].value, ${field}[language == "no"][0].value, ${field}[_key == "no"][0].value, ${field})`;

/** Active locale only — use with `?? t("key")` fallback when EN is not in CMS yet. */
const i18nStringLocale = (field: string) =>
  `"${field}": coalesce(${field}[language == $lang][0].value, ${field}[_key == $lang][0].value)`;

/** Both locales — for nav path switching and CMS-driven URLs. */
const i18nPathBoth = (field: string) => `
  "pathNb": coalesce(${field}[language == "no"][0].value, ${field}[_key == "no"][0].value, ${field}[0].value),
  "pathEn": coalesce(${field}[language == "en"][0].value, ${field}[_key == "en"][0].value, ${field}[0].value)
`;

/** Both locales — for CMS-driven singleton URLs and static path generation. */
const localizedSlugBoth = `
  "slugNb": coalesce(
    slug[language == "no"][0].value.current,
    slug[_key == "no"][0].value.current,
    slug[0].value.current,
    slug.current
  ),
  "slugEn": coalesce(
    slug[language == "en"][0].value.current,
    slug[_key == "en"][0].value.current,
    slug[language == "no"][0].value.current,
    slug[_key == "no"][0].value.current,
    slug[0].value.current,
    slug.current
  )
`;

const localizedFaqRow = `${i18nString('question')}, ${i18nText('answer')}`;

const publishedClinicFilter = `!(_id in path("drafts.**"))`;

/** Shared row shape for clinic lists (grid, about section, footer). */
export const CLINIC_LIST_ROW_PROJECTION = `
  _id,
  ${localizedSlug},
  "id": coalesce(slug[language == $lang][0].value.current, slug[language == "no"][0].value.current, slug[0].value.current, slug.current),
  "label": coalesce(title[language == $lang][0].value, title[_key == $lang][0].value, title[language == "no"][0].value, title[_key == "no"][0].value, title),
  address,
  phone,
  ${i18nString("hours")}
`;

/** Modular specialists / articles blocks — append inside page GROQ projections */
export const PAGE_SECTIONS_GROQ = `
  pageSections[]{
    _type,
    _key,
    ${i18nPageSectionString("eyebrow")},
    ${i18nPageSectionString("title")},
    ${i18nPageSectionText("description")},
    displayMode,
    categorySlug,
    articleCategory,
    limit,
    variant,
    ${i18nPageSectionString("ctaLabel")},
    ctaPath,
    "treatmentCategory": treatmentCategory->{ categoryId, ${localizedSlug} },
    "specialists": specialists[]->{
      _id, name, role, subtitle, specialties, shortBio, education, languages, bookingEnabled,
      "clinics": clinics[]->title,
      ${localizedSlug},
      "categories": categories[]->{ _id, title, ${localizedSlug} }
    },
    "articles": articles[]->{
      _id,
      "title": coalesce(title[language == $lang][0].value, title[_key == $lang][0].value, title[language == "no"][0].value, title[_key == "no"][0].value, title),
      ${localizedSlug},
      "excerpt": coalesce(excerpt[language == $lang][0].value, excerpt[_key == $lang][0].value, excerpt[language == "no"][0].value, excerpt[_key == "no"][0].value, excerpt),
      "image": primaryImage.asset->url,
      "date": publishedAt,
      category
    }
  }
`;

export const HOMEPAGE_QUERY = `*[_type == "homepage"][0]{
  ${i18nString("title")},
  ${i18nString("tagline")},
  heroBanner{
    slides[]{
      ${i18nString("heading")},
      ${i18nString("subheading")},
      ${i18nString("ctaText")},
      ${i18nString("ctaLink")},
      "image": image.asset->url
    }
  },
  "serviceCategories": serviceCategories[]->{ _id, categoryId, ${i18nString("title")}, ${localizedSlug}, description, icon, color, "heroImage": heroImage.asset->url },
  valueBadges[]{icon, ${i18nString("label")}},
  statsBar[]{value, ${i18nString("label")}},
  ${i18nString("promoBlocksTitle")},
  promoBlocks[]{
    ${i18nString("title")},
    ${i18nText("description")},
    ${i18nString("ctaText")},
    ctaLink,
    "image": image.asset->url
  },
  ${PAGE_SECTIONS_GROQ},
  ${localizedSeoObject}
}`;

export const SPECIALISTS_QUERY = `*[_type == "specialist"] | order(name asc){
  _id, name, role, subtitle, specialties, shortBio, education, languages, bookingEnabled,
  bookingCategoryIds,
  "clinics": clinics[]->title,
  ${localizedSlug},
  "image": photo.asset->url,
  "categories": categories[]->{ _id, title, ${localizedSlug}, categoryId, categoryNumericId }
}`;

export const SPECIALIST_BY_SLUG_QUERY = `*[_type == "specialist" && ${slugMatchesParam("slug")}][0]{
  _id, name, role, subtitle, specialties, shortBio, education, languages, bookingEnabled,
  bookingCategoryIds,
  "clinics": clinics[]->title,
  ${localizedSlug},
  "image": photo.asset->url,
  "categories": categories[]->{ _id, title, ${localizedSlug}, categoryId, categoryNumericId },
  ${localizedSeoObject}
}`;

export const GOOGLE_REVIEWS_QUERY = `*[_type == "googleReview"] | order(_createdAt desc){
  _id, author, rating, ${i18nText("text")}, date
}`;

export const GOOGLE_REVIEW_SETTINGS_QUERY = `*[_type == "googleReviewSettings"][0]{
  ${i18nStringLocale("heading")},
  ${i18nStringLocale("subheading")},
  googleAverageRating,
  legelistenAverageRating,
  ${i18nStringLocale("ctaTitle")},
  ${i18nStringLocale("ctaSubtitle")}
}`;

export const TREATMENT_CATEGORIES_QUERY = `*[_type == "treatmentCategory"] | order(${orderSlugAsc}){
  _id, title, ${localizedSlug}, categoryId, categoryNumericId, description, icon, color,
  "heroImage": heroImage.asset->url,
  stats,
  "treatments": *[_type == "treatment" && references(^._id)] | order(${orderSlugAsc}){
    _id, title, ${localizedSlug}, description, "heroImage": heroImage.asset->url
  }
}`;

const CATEGORY_LANDING_GROQ = `
  landingPage{
    ${i18nStringLocale("documentTitle")},
    ${i18nStringLocale("srOnlyTitle")},
    hero{
      ${i18nStringLocale("eyebrow")},
      ${i18nStringLocale("heading")},
      ${i18nStringLocale("headingEmphasis")},
      ${i18nText("body")},
      bullets,
      ${i18nStringLocale("primaryCtaLabel")},
      ${i18nStringLocale("secondaryCtaLabel")},
      ${i18nStringLocale("heroImageAlt")},
      ${i18nStringLocale("secondaryImageAlt")}
    },
    segmentsSection{
      ${i18nStringLocale("eyebrow")},
      ${i18nStringLocale("title")},
      ${i18nStringLocale("titleLine2")},
      segments[]{
        id,
        ${i18nStringLocale("title")},
        ${i18nText("description")},
        tags,
        ${i18nStringLocale("ctaLabel")},
        href
      }
    },
    whySection{
      ${i18nStringLocale("eyebrow")},
      ${i18nStringLocale("title")},
      ${i18nText("description")},
      steps[]{
        number,
        ${i18nStringLocale("title")},
        ${i18nText("description")}
      }
    },
    audiencesSection{
      ${i18nStringLocale("eyebrow")},
      ${i18nStringLocale("title")},
      ${i18nStringLocale("titleAccent")},
      ${i18nStringLocale("readMoreLabel")},
      audiences[]{
        ${i18nStringLocale("title")},
        ${i18nText("description")},
        href,
        icon
      }
    },
    symptomsSection{
      ${i18nStringLocale("title")},
      ${i18nText("description")},
      items[]{
        ${i18nStringLocale("symptom")},
        ${i18nStringLocale("service")},
        href
      }
    },
    servicesSection{
      ${i18nStringLocale("eyebrow")},
      ${i18nStringLocale("title")},
      ${i18nText("description")}
    },
    resultsSection{
      ${i18nStringLocale("eyebrow")},
      ${i18nStringLocale("title")},
      ${i18nText("description")},
      ${i18nStringLocale("categoryLabel")},
      ${i18nStringLocale("footnote")}
    },
    reviewsSection{
      ${i18nStringLocale("eyebrow")},
      ${i18nStringLocale("title")},
      reviews[]{
        ${i18nText("text")},
        author,
        ${i18nStringLocale("date")}
      }
    },
    specialistsSection{
      ${i18nStringLocale("title")},
      ${i18nStringLocale("seeAllLabel")},
      seeAllHref
    }
  }
`;

export const TREATMENT_CATEGORY_BY_SLUG_QUERY = `*[_type == "treatmentCategory" && (${slugMatchesParam("slug")} || categoryId == $slug)][0]{
  _id, title, ${localizedSlug}, categoryId, categoryNumericId, description, icon, color,
  "heroImage": heroImage.asset->url,
  quickInfoItems,
  ${i18nStringLocale("linkedServicesSectionTitle")},
  ${i18nStringLocale("processSectionTitle")},
  ${i18nStringLocale("faqSectionTitle")},
  bottomCta{
    ${i18nStringLocale("title")},
    ${i18nText("subtitle")},
    ${i18nStringLocale("primaryLabel")},
    ${i18nStringLocale("secondaryLabel")},
    primaryPath,
    secondaryPath
  },
  stats[]{
    value,
    ${i18nStringLocale("label")},
    ${i18nStringLocale("sub")}
  },
  ${localizedSeoObject},
  "treatments": *[_type == "treatment" && references(^._id)] | order(${orderSlugAsc}){
    _id, title, ${localizedSlug}, description, subtitle,
    "heroImage": heroImage.asset->url
  },
  ${CATEGORY_LANDING_GROQ},
  ${PAGE_SECTIONS_GROQ}
}`;

const localizedParentCategory = `"parentCategory": coalesce(
  parentCategoryLabel[language == $lang][0].value,
  parentCategoryLabel[_key == $lang][0].value,
  parentCategoryLabel[language == "no"][0].value,
  parentCategoryLabel[_key == "no"][0].value,
  category->title[language == $lang][0].value,
  category->title[_key == $lang][0].value,
  category->title[language == "no"][0].value,
  category->title[_key == "no"][0].value
)`;

export const TREATMENT_BY_SLUG_QUERY = `*[_type == "treatment" && ${slugMatchesParam("treatmentSlug")} && (${slugMatchesRefParam("category", "categorySlug")} || category->categoryId == $categorySlug)][0]{
  _id,
  ${localizedSlug},
  ${i18nString('title')},
  ${i18nString('subtitle')},
  ${i18nText('description')},
  ${i18nString('benefitsTitle')},
  benefits,
  "heroImage": heroImage.asset->url,
  ${localizedParentCategory},
  ${localizedRefSlugField("category", "parentSlug")},
  "categoryNumericId": category->categoryNumericId,
  process[]{
    ${i18nString('title')},
    ${i18nText('description')}
  },
  faqs[]{${localizedFaqRow}},
  sections[]{
    id,
    ${i18nString('heading')},
    ${i18nText('content')}
  },
  "relatedSpecialists": relatedSpecialists[]->{
    _id, name, role, subtitle, ${localizedSlug},
    "image": photo.asset->url,
    specialties
  },
  linkedServices[]{
    ${i18nString('label')},
    ${i18nText('description')},
    path
  },
  ${PAGE_SECTIONS_GROQ},
  ${localizedSeoObject}
}`;

const i18nBlockContent = (field: string) =>
  `"${field}": coalesce(${field}[language == $lang][0].value, ${field}[_key == $lang][0].value, ${field}[language == "no"][0].value, ${field}[_key == "no"][0].value, ${field})`;

export const PRIVACY_POLICY_PAGE_QUERY = `*[_type == "privacyPolicyPage"][0]{
  ${i18nString('title')},
  ${i18nBlockContent('body')},
  cookiebotKey
}`;

export const ABOUT_PAGE_QUERY = `*[_type == "aboutPage"][0]{
  "title": coalesce(title[language == $lang][0].value, title[_key == $lang][0].value, title[language == "no"][0].value, title[_key == "no"][0].value, title),
  "subtitle": coalesce(subtitle[language == $lang][0].value, subtitle[_key == $lang][0].value, subtitle[language == "no"][0].value, subtitle[_key == "no"][0].value, subtitle),
  "heroImage": heroImage.asset->url,
  "body": coalesce(body[language == $lang][0].value, body[_key == $lang][0].value, body[language == "no"][0].value, body[_key == "no"][0].value, body),
  values,
  clinicsSection{
    showSection,
    "title": coalesce(title[language == $lang][0].value, title[_key == $lang][0].value, title[language == "no"][0].value, title[_key == "no"][0].value, title),
    "clinics": clinics[]->{
      ${CLINIC_LIST_ROW_PROJECTION}
    }
  },
  ${PAGE_SECTIONS_GROQ},
  ${localizedSeoObject}
}`;

export const CONTACT_PAGE_QUERY = `*[_type == "contactPage"][0]{
  ${i18nString("title")},
  ${i18nText("introText")},
  phone,
  email,
  "heroImage": heroImage.asset->url,
  address{street, city, zip},
  openingHours[]{
    ${i18nString("days")},
    ${i18nString("hours")}
  },
  ctaCards[]{
    icon,
    ${i18nString("title")},
    ${i18nText("description")},
    ${i18nString("ctaText")},
    ctaAction,
    ctaLink,
    variant
  },
  ${PAGE_SECTIONS_GROQ},
  ${localizedSeoObject}
}`;

export const NEWS_PAGE_QUERY = `*[_type == "newsPage"][0]{
  ${i18nString("label")},
  ${i18nString("title")},
  ${i18nText("subtitle")},
  ${i18nString("searchPlaceholder")},
  ${i18nString("moreArticlesTitle")},
  ${i18nString("noArticlesText")},
  ${i18nString("readMoreLabel")},
  ${i18nString("specialistsEyebrowAll")},
  ${i18nString("specialistsEyebrowWithin")},
  ${i18nString("specialistsTitle")},
  ${i18nString("specialistsSeeAllLabel")},
  ${i18nString("socialSectionTitle")},
  ${i18nString("filterAllLabel")},
  ${i18nString("filterPatientStoriesLabel")},
  ${i18nString("filterMediaLabel")},
  ${i18nString("filterArticlesLabel")},
  ${i18nString("filterUpdatesLabel")},
  "featuredArticles": featuredArticles[]->{
    _id,
    "title": coalesce(title[language == $lang][0].value, title[_key == $lang][0].value, title[language == "no"][0].value, title[_key == "no"][0].value, title),
    ${localizedSlug},
    "excerpt": coalesce(excerpt[language == $lang][0].value, excerpt[_key == $lang][0].value, excerpt[language == "no"][0].value, excerpt[_key == "no"][0].value, excerpt),
    "image": primaryImage.asset->url,
    "date": publishedAt,
    category,
    pinned,
    featured
  },
  ${localizedSeoObject}
}`;

export const PRICING_PAGE_QUERY = `*[_type == "pricingPage"][0]{
  ${i18nString("title")},
  ${i18nText("introText")},
  ${i18nText("insuranceNote")},
  "heroImage": heroImage.asset->url,
  priceCategories[]{
    ${i18nString("categoryName")},
    "categoryRef": category->{ _id, title, ${localizedSlug} },
    items[]{
      ${i18nString("name")},
      price,
      ${i18nString("priceLabel")},
      ${i18nString("note")}
    }
  },
  ${PAGE_SECTIONS_GROQ},
  ${localizedSeoObject}
}`;

export const INSURANCE_PAGE_QUERY = `*[_type == "insurancePage"][0]{
  ${i18nString("title")},
  ${i18nText("introText")},
  "heroImage": heroImage.asset->url,
  partners,
  "partnersLocalized": partnersLocalized[]{
    "name": coalesce(name[language == $lang][0].value, name[_key == $lang][0].value, name[language == "no"][0].value, name[_key == "no"][0].value, name)
  },
  steps[]{
    ${i18nString("title")},
    ${i18nText("description")}
  },
  benefits[]{
    ${i18nString("title")},
    ${i18nText("description")}
  },
  ${PAGE_SECTIONS_GROQ},
  ${localizedSeoObject}
}`;

export const SERVICES_PAGE_QUERY = `*[_type == "servicesPage"][0]{
  ${i18nString("breadcrumbHome")},
  ${i18nString("title")},
  ${i18nString("eyebrow")},
  ${i18nText("introText")},
  ${i18nString("searchPlaceholder")},
  ${i18nString("featuredSectionTitle")},
  ${i18nString("faqSectionTitle")},
  faqCategory,
  faqs[]{
    ${i18nString("question")},
    ${i18nText("answer")}
  },
  badges[]{
    ${i18nString("label")}
  },
  moreServicesSection{
    ${i18nString("eyebrow")},
    ${i18nString("title")},
    ${i18nText("description")}
  },
  "featuredCategories": featuredCategories[]->{
    categoryId,
    title,
    ${localizedSlug},
    "heroImage": heroImage.asset->url,
    "treatments": *[_type == "treatment" && references(^._id)] | order(${orderSlugAsc}){
      title,
      ${localizedSlug}
    }
  },
  moreServicesCategories[]{
    displayMode,
    "category": category->{
      categoryId,
      title,
      ${localizedSlug},
      "treatments": *[_type == "treatment" && references(^._id)] | order(${orderSlugAsc}){
        title,
        ${localizedSlug}
      }
    }
  },
  "categories": categories[]->{
    categoryId,
    title,
    ${localizedSlug},
    "heroImage": heroImage.asset->url
  },
  ${PAGE_SECTIONS_GROQ},
  ${localizedSeoObject}
}`;

export const CLINICS_QUERY = `*[_type == "clinicPage" && ${publishedClinicFilter}] | order(${orderSlugAsc}){
  ${CLINIC_LIST_ROW_PROJECTION},
  services,
  description, email, contactDescription,
  valueProposition,
  locationSearch,
  sortOrder,
  "primaryImage": primaryImage.asset->url,
  booking,
  detail,
  faqs[]{${localizedFaqRow}},
  seo
}`;

export const CLINIC_BY_SLUG_QUERY = `*[_type == "clinicPage" && ${publishedClinicFilter} && ${slugMatchesParam("slug")}][0]{
  ${CLINIC_LIST_ROW_PROJECTION},
  services,
  description, email, contactDescription,
  valueProposition,
  locationSearch,
  sortOrder,
  "primaryImage": primaryImage.asset->url,
  booking,
  detail,
  faqs[]{${localizedFaqRow}},
  specialists[]->{ name, ${localizedSlug}, "image": photo.asset->url, role },
  treatments[]->{ title, ${localizedSlug}, ${localizedRefSlugField("category", "categorySlug")}, "categoryLabel": parentCategoryLabel },
  seo
}`;

export const CMS_ROUTE_INDEX_QUERY = `{
  "listings": {
    "newsPage": *[_type == "newsPage"][0]{ ${localizedSlugBoth} },
    "clinicsPage": *[_type == "clinicsPage"][0]{ ${localizedSlugBoth} },
    "specialistsListingPage": *[_type == "specialistsListingPage"][0]{ ${localizedSlugBoth} },
    "careersPage": *[_type == "careersPage"][0]{ ${localizedSlugBoth} }
  },
  "singletons": *[_type in [
    "aboutPage", "contactPage", "newsPage", "pricingPage", "insurancePage",
    "servicesPage", "specialistsPage", "specialistsListingPage", "clinicsPage",
    "privacyPolicyPage", "careersPage"
  ]]{
    _type,
    ${localizedSlugBoth}
  },
  "themes": *[_type == "themePage"]{
    _id,
    _type,
    ${localizedSlugBoth}
  },
  "categories": *[_type == "treatmentCategory"]{
    _id,
    _type,
    categoryId,
    ${localizedSlugBoth}
  },
  "treatments": *[_type == "treatment"]{
    _id,
    _type,
    ${localizedSlugBoth},
    "categoryId": category->categoryId,
    "categorySlugNb": coalesce(
      category->slug[language == "no"][0].value.current,
      category->slug[_key == "no"][0].value.current,
      category->slug[0].value.current
    ),
    "categorySlugEn": coalesce(
      category->slug[language == "en"][0].value.current,
      category->slug[_key == "en"][0].value.current,
      category->slug[language == "no"][0].value.current,
      category->slug[_key == "no"][0].value.current,
      category->slug[0].value.current
    )
  },
  "clinics": *[_type == "clinicPage" && ${publishedClinicFilter}]{
    _id,
    _type,
    ${localizedSlugBoth}
  },
  "specialists": *[_type == "specialist"]{
    _id,
    _type,
    ${localizedSlugBoth}
  },
  "articles": *[_type == "article"]{
    _id,
    _type,
    ${localizedSlugBoth}
  },
  "jobs": *[_type == "jobListing" && active == true]{
    _id,
    _type,
    ${localizedSlugBoth}
  },
  "products": *[_type == "product"]{
    _id,
    _type,
    ${localizedSlugBoth}
  }
}`;

/** @deprecated Use CMS_ROUTE_INDEX_QUERY + resolveCmsRoute */
export const CMS_PAGE_SLUG_INDEX_QUERY = CMS_ROUTE_INDEX_QUERY;

/** @deprecated Use resolveCmsRoute from route index */
export const CMS_PAGE_BY_SLUG_QUERY = `*[
  (
    _type in [
      "aboutPage", "contactPage", "newsPage", "pricingPage", "insurancePage",
      "servicesPage", "specialistsPage", "specialistsListingPage", "clinicsPage",
      "privacyPolicyPage"
    ]
    || _type == "themePage"
  )
  && ${slugMatchesParam("slug")}
][0]{
  _id,
  _type,
  ${localizedSlugBoth}
}`;

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  title,
  phone,
  email,
  address,
  socialMedia,
  mainNavigation[]{
    _key,
    ${i18nString("label")},
    navId,
    ${i18nString("path")},
    ${i18nPathBoth("path")},
    isServicesDropdown
  },
  ctaButton{
    ${i18nString("label")},
    ${i18nString("path")},
    ${i18nPathBoth("path")}
  },
  footerAboutLinks[]{
    _key,
    ${i18nString("label")},
    navId,
    ${i18nString("path")},
    ${i18nPathBoth("path")}
  },
  notFoundTitle,
  notFoundText,
  "notFoundImage": notFoundImage.asset->url,
  notFoundCtaLabel,
  notFoundCtaPath
}`;

// ─── Articles (localized) ────────────────────────────────────────────
// `title`, `excerpt`, `body` are internationalizedArray fields stored as
// [{language:'no', value:...},{language:'en', value:...}]. We pick the entry that
// matches $lang and fall back to the Norwegian entry. Legacy un-migrated
// docs may still hold plain strings — we coalesce both shapes and let the
// frontend hook normalize.
export const ARTICLES_QUERY = `*[_type == "article"] | order(pinned desc, publishedAt desc){
  _id,
  "title": coalesce(title[language == $lang][0].value, title[_key == $lang][0].value, title[language == "no"][0].value, title[_key == "no"][0].value, title),
  ${localizedSlug},
  "excerpt": coalesce(excerpt[language == $lang][0].value, excerpt[_key == $lang][0].value, excerpt[language == "no"][0].value, excerpt[_key == "no"][0].value, excerpt),
  "image": primaryImage.asset->url,
  "imageAlt": coalesce(primaryImage.alt[language == $lang][0].value, primaryImage.alt[_key == $lang][0].value, primaryImage.alt[language == "no"][0].value, primaryImage.alt[_key == "no"][0].value, primaryImage.alt),
  "date": publishedAt,
  category,
  pinned,
  featured,
}`;

export const ARTICLE_BY_SLUG_QUERY = `*[_type == "article" && ${slugMatchesParam("slug")}][0]{
  _id,
  "title": coalesce(title[language == $lang][0].value, title[_key == $lang][0].value, title[language == "no"][0].value, title[_key == "no"][0].value, title),
  ${localizedSlug},
  "excerpt": coalesce(excerpt[language == $lang][0].value, excerpt[_key == $lang][0].value, excerpt[language == "no"][0].value, excerpt[_key == "no"][0].value, excerpt),
  "image": primaryImage.asset->url,
  "imageAlt": coalesce(primaryImage.alt[language == $lang][0].value, primaryImage.alt[_key == $lang][0].value, primaryImage.alt[language == "no"][0].value, primaryImage.alt[_key == "no"][0].value, primaryImage.alt),
  "date": publishedAt,
  category,
  "body": coalesce(body[language == $lang][0].value, body[_key == $lang][0].value, body[language == "no"][0].value, body[_key == "no"][0].value, body),
  videoUrl,
  videoCaption,
  "videoThumbnail": videoThumbnail.asset->url,
  ${localizedSeoObject}
}`;

export const JOB_LISTINGS_QUERY = `*[_type == "jobListing" && active == true] | order(publishedAt desc){
  _id,
  title,
  ${localizedSlug},
  department,
  location,
  employmentType,
  excerpt,
  "publishedAt": publishedAt,
  deadline,
  contactName,
  contactEmail,
  contactPhone,
  applyUrl,
}`;

export const CLINIC_SEO_BY_SLUG_QUERY = `*[_type == "clinicPage" && ${publishedClinicFilter} && ${slugMatchesParam("slug")}][0]{
  "label": coalesce(title[language == $lang][0].value, title[_key == $lang][0].value, title[language == "no"][0].value, title[_key == "no"][0].value, title),
  ${localizedSeoObject}
}`;

export const JOB_LISTING_SEO_BY_SLUG_QUERY = `*[_type == "jobListing" && active == true && ${slugMatchesParam("slug")}][0]{
  title,
  excerpt,
  ${localizedSlug}
}`;

export const JOB_LISTING_BY_SLUG_QUERY = `*[_type == "jobListing" && ${slugMatchesParam("slug")}][0]{
  _id,
  title,
  ${localizedSlug},
  department,
  location,
  employmentType,
  excerpt,
  "publishedAt": publishedAt,
  deadline,
  contactName,
  contactEmail,
  contactPhone,
  applyUrl,
  body,
}`;

export const FAQS_QUERY = `*[_type == "faq"] | order(sortOrder asc) { ${localizedFaqRow}, category }`;

export const FAQS_BY_CATEGORY_QUERY = `*[_type == "faq" && category == $category] | order(sortOrder asc) { ${localizedFaqRow}, category }`;

export const FAQS_BY_TREATMENT_CATEGORY_QUERY = `*[_type == "faq" && ${slugMatchesRefParam("relatedTreatmentCategory", "slug")}] | order(sortOrder asc) { ${localizedFaqRow} }`;

export const THEME_PAGE_QUERY = `*[_type == "themePage" && ${slugMatchesParam("slug")}][0]{
  "title": coalesce(title[language == $lang][0].value, title[_key == $lang][0].value, title[language == "no"][0].value, title[_key == "no"][0].value, title),
  "heroImage": heroImage.asset->url,
  introTexts,
  sections[]{heading, paragraphs, bulletPoints},
  lifePhases[]{title, text},
  ctaText, ctaLink,
  ${PAGE_SECTIONS_GROQ},
  ${localizedSeoObject}
}`;

export const SERVICE_CATEGORIES_DROPDOWN_QUERY = `*[_type == "treatmentCategory"] | order(${orderSlugAsc}){
  _id, title, categoryId, ${localizedSlug},
  "treatments": treatments[]->{
    _id, title, ${localizedSlug},
    subItems[]{label, anchor, path}
  } | order(${orderSlugAsc})
}`;

export const SPECIALISTS_PAGE_QUERY = `*[_type == "specialistsPage"][0]{
  title, subtitle, body,
  ${localizedSeoObject}
}`;

export const SPECIALISTS_LISTING_PAGE_QUERY = `*[_type == "specialistsListingPage"][0]{
  ${i18nString("heroEyebrow")},
  ${i18nString("heroTitle")},
  ${i18nText("heroDescription")},
  ${i18nString("countLabel")},
  ${localizedSeoObject}
}`;

export const CLINICS_PAGE_QUERY = `*[_type == "clinicsPage"][0]{
  ${i18nString("heroEyebrow")},
  ${i18nString("heroTitle")},
  ${i18nText("heroDescription")},
  "heroImage": heroImage.asset->url,
  ${i18nString("primaryCtaLabel")},
  primaryCtaPath,
  ${i18nString("secondaryCtaLabel")},
  secondaryCtaPath,
  ${localizedSeoObject}
}`;

export const PRODUCTS_QUERY = `*[_type == "product"] | order(sortOrder asc){
  _id, name, ${localizedSlug}, category, price, rating,
  "image": image.asset->url,
  tags, intent, description, benefits, results, howItWorks,
  isSeasonal, seasonalOrder
}`;

export const SEASONAL_PRODUCTS_QUERY = `*[_type == "product" && isSeasonal == true] | order(seasonalOrder asc){
  _id, name, ${localizedSlug}, category, price, rating,
  "image": image.asset->url,
  tags, intent, description
}`;

export const TOP_RATED_PRODUCTS_QUERY = `*[_type == "product"] | order(rating desc)[0..3]{
  _id, name, ${localizedSlug}, category, price, rating,
  "image": image.asset->url,
  tags, intent, description
}`;

export const TESTIMONIALS_QUERY = `*[_type == "testimonial"] | order(_createdAt desc){
  _id, name, age, rating, text, location, treatment
}`;

export const SOCIAL_POSTS_QUERY = `*[_type == "socialPost"] | order(sortOrder asc, date desc)[0..5]{
  _id, platform, caption, postUrl, date, likes,
  "image": image.asset->url
}`;

export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && ${slugMatchesParam("slug")}][0]{
  _id, name, ${localizedSlug}, category, price, rating,
  "image": image.asset->url,
  tags, intent, description, benefits, results, howItWorks
}`;
