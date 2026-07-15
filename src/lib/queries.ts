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

const GEO_SUMMARY = i18nText("geoSummary");

const i18nNestedString = (parent: string, field: string) =>
  `"${field}": coalesce(${parent}.${field}[language == $lang][0].value, ${parent}.${field}[_key == $lang][0].value, ${parent}.${field}[language == "no"][0].value, ${parent}.${field}[_key == "no"][0].value, ${parent}.${field})`;

const i18nNestedText = (parent: string, field: string) =>
  `"${field}": coalesce(${parent}.${field}[language == $lang][0].value, ${parent}.${field}[_key == $lang][0].value, ${parent}.${field}[language == "no"][0].value, ${parent}.${field}[_key == "no"][0].value, ${parent}.${field})`;

const SPECIALIST_PROFILE_UI_GROQ = `
  "profileUi": profileUi {
    ${i18nNestedString("profileUi", "notFoundTitle")},
    ${i18nNestedString("profileUi", "notFoundBackLabel")},
    ${i18nNestedString("profileUi", "breadcrumbHomeLabel")},
    ${i18nNestedString("profileUi", "breadcrumbSpecialistsLabel")},
    ${i18nNestedString("profileUi", "bookingCtaLabel")},
    ${i18nNestedString("profileUi", "bookingSectionTitle")},
    ${i18nNestedText("profileUi", "bookingSectionDescription")},
    ${i18nNestedString("profileUi", "heroCallUsLabel")},
    ${i18nNestedString("profileUi", "bioSectionTitle")},
    ${i18nNestedString("profileUi", "reviewsSectionTitle")},
    ${i18nNestedString("profileUi", "featuredServiceCtaLabel")},
    ${i18nNestedString("profileUi", "bookingLoadingLabel")},
    ${i18nNestedText("profileUi", "bookingEmptyMessage")},
    ${i18nNestedString("profileUi", "bookingViewAllLabel")},
    ${i18nNestedString("profileUi", "anonymousReviewLabel")}
  }
`;

/** Active locale only — use with `?? t("key")` fallback when EN is not in CMS yet. */
const i18nStringLocale = (field: string) =>
  `"${field}": coalesce(${field}[language == $lang][0].value, ${field}[_key == $lang][0].value)`;

const i18nStringArrayLocale = (field: string) =>
  `"${field}": ${field}[]{"value": coalesce(@[language == $lang][0].value, @[_key == $lang][0].value)}`;

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

const localizedFaqRow = `
  "question": coalesce(
    @->question[language == $lang][0].value,
    @->question[_key == $lang][0].value,
    @->question[language == "no"][0].value,
    @->question[_key == "no"][0].value,
    question[language == $lang][0].value,
    question[_key == $lang][0].value,
    question[language == "no"][0].value,
    question[_key == "no"][0].value,
    question
  ),
  "answer": coalesce(
    @->answer[language == $lang][0].value,
    @->answer[_key == $lang][0].value,
    @->answer[language == "no"][0].value,
    @->answer[_key == "no"][0].value,
    answer[language == $lang][0].value,
    answer[_key == $lang][0].value,
    answer[language == "no"][0].value,
    answer[_key == "no"][0].value,
    answer
  )
`;

const localizedGoogleReviewRow = `_id, author, rating, ${i18nText('text')}, date`;

/** Treatment category fields used on specialist profile featured-service block. */
const specialistCategoryProjection = `
  _id, title, ${localizedSlug}, categoryId, categoryNumericId,
  "heroImage": heroImage.asset->url
`;

const i18nBlockContent = (field: string) =>
  `"${field}": coalesce(${field}[language == $lang][0].value, ${field}[_key == $lang][0].value, ${field}[language == "no"][0].value, ${field}[_key == "no"][0].value, ${field})`;

const publishedClinicFilter = `!(_id in path("drafts.**"))`;

/** Shared row shape for clinic lists (grid, about section, footer). */
export const CLINIC_LIST_ROW_PROJECTION = `
  _id,
  _createdAt,
  ${localizedSlug},
  "id": coalesce(slug[language == $lang][0].value.current, slug[language == "no"][0].value.current, slug[0].value.current, slug.current),
  "label": coalesce(title[language == $lang][0].value, title[_key == $lang][0].value, title[language == "no"][0].value, title[_key == "no"][0].value, title),
  sortOrder,
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
    ${i18nPageSectionString("seeAllLabel")},
    seeAllHref,
    ${i18nPageSectionString("primaryLabel")},
    ${i18nPageSectionString("secondaryLabel")},
    secondaryPath,
    primaryPath,
    ${i18nPageSectionText("subtitle")},
    showSecondaryButton,
    "image": image.asset->url,
    "imageAlt": coalesce(image.alt[language == $lang][0].value, image.alt[_key == $lang][0].value, image.alt[language == "no"][0].value, image.alt[_key == "no"][0].value, image.alt),
    "bookingCategory": bookingCategory->{ categoryId },
    quickInfoItems[]{
      icon,
      "text": coalesce(text[language == $lang][0].value, text[_key == $lang][0].value, text[language == "no"][0].value, text[_key == "no"][0].value, text)
    },
    "treatmentCategory": treatmentCategory->{ categoryId, ${localizedSlug} },
    "specialists": specialists[]->{
      _id, name, role, subtitle, specialties, shortBio, education, languages, bookingEnabled,
      "clinics": clinics[]->title,
      ${localizedSlug},
      "image": photo.asset->url,
      "categories": categories[]->{ _id, title, ${localizedSlug}, categoryId, categoryNumericId }
    },
    "articles": articles[]->{
      _id,
      "title": coalesce(title[language == $lang][0].value, title[_key == $lang][0].value, title[language == "no"][0].value, title[_key == "no"][0].value, title),
      ${localizedSlug},
      "excerpt": coalesce(excerpt[language == $lang][0].value, excerpt[_key == $lang][0].value, excerpt[language == "no"][0].value, excerpt[_key == "no"][0].value, excerpt),
      "image": primaryImage.asset->url,
      "date": publishedAt,
      category
    },
    partners[]{
      key,
      "label": coalesce(label[language == $lang][0].value, label[_key == $lang][0].value, label[language == "no"][0].value, label[_key == "no"][0].value, label)
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
      "image": image.asset->url,
      "mobileImage": mobileImage.asset->url,
      "videoUrl": videoFile.asset->url
    }
  },
  "serviceCategories": serviceCategories[]->{ _id, categoryId, sortOrder, ${i18nString("title")}, ${localizedSlug}, "heroImage": heroImage.asset->url },
  valueBadges[]{icon, ${i18nString("label")}},
  patientTrustBanner{
    value,
    ${i18nString("label")},
    ${i18nString("ctaText")},
    ctaLink,
    "backgroundImage": backgroundImage.asset->url
  },
  newsSplitSection{
    ${i18nString("heading")},
    ${i18nText("description")},
    ${i18nString("ctaLabel")},
    ctaPath
  },
  "featuredArticles": featuredArticles[]->{
    _id,
    "title": coalesce(title[language == $lang][0].value, title[_key == $lang][0].value, title[language == "no"][0].value, title[_key == "no"][0].value, title),
    ${localizedSlug},
    "excerpt": coalesce(excerpt[language == $lang][0].value, excerpt[_key == $lang][0].value, excerpt[language == "no"][0].value, excerpt[_key == "no"][0].value, excerpt),
    "image": primaryImage.asset->url,
    "date": publishedAt,
    category,
  },
  resultsStatsSection{
    ${i18nString("title")},
    ${i18nText("description")},
    ${i18nString("category")},
    ${i18nString("footnote")},
    stats[]{
      value,
      ${i18nString("label")},
      ${i18nString("sub")}
    }
  },
  statsBar[]{value, ${i18nString("label")}},
  ${i18nString("promoBlocksTitle")},
  promoBlocks[]{
    ${i18nString("title")},
    ${i18nText("description")},
    ${i18nString("ctaText")},
    ctaLink,
    "image": image.asset->url
  },
  ${i18nString("faqSectionTitle")},
  "faqs": faqs[]->{
    sortOrder,
    ${localizedFaqRow}
  },
  ${i18nString("reviewsSubheading")},
  ${i18nString("reviewsHeading")},
  reviewsGoogleRating,
  reviewsLegelistenRating,
  ${i18nString("reviewsCtaTitle")},
  ${i18nString("reviewsCtaSubtitle")},
  "googleReviews": googleReviews[]->{
    _id,
    author,
    rating,
    ${i18nText("text")},
    date
  },
  ${PAGE_SECTIONS_GROQ},
  ${GEO_SUMMARY},
  ${localizedSeoObject}
}`;

export const SPECIALISTS_QUERY = `*[_type == "specialist" && !(_id in path("drafts.**"))]{
  _id, _createdAt, name, role, subtitle, specialties, shortBio, education, languages, bookingEnabled,
  bookingCategoryIds, sortOrder,
  "clinics": clinics[]->title,
  ${localizedSlug},
  "image": photo.asset->url,
  "categories": categories[]->{ _id, title, ${localizedSlug}, categoryId, categoryNumericId },
  ${GEO_SUMMARY},
  ${localizedSeoObject}
}`;

export const SPECIALIST_BY_SLUG_QUERY = `*[_type == "specialist" && !(_id in path("drafts.**")) && ${slugMatchesParam("slug")}][0]{
  _id, name, role, subtitle, specialties, shortBio, education, languages, bookingEnabled,
  bookingCategoryIds, sortOrder,
  "clinicRefs": clinics[]->{
    "label": coalesce(title[language == $lang][0].value, title[_key == $lang][0].value, title[language == "no"][0].value, title[_key == "no"][0].value, title),
    ${localizedSlug}
  },
  ${localizedSlug},
  "image": photo.asset->url,
  ${i18nBlockContent("bio")},
  "categories": categories[]->{ ${specialistCategoryProjection} },
  ${i18nStringLocale("faqSectionTitle")},
  "faqs": faqs[]->{
    sortOrder,
    category,
    ${localizedFaqRow}
  },
  "patientReviews": patientReviews[]->{
    ${localizedGoogleReviewRow}
  },
  "relatedSpecialistsSection": relatedSpecialistsSection{
    ${i18nStringLocale("eyebrow")},
    ${i18nStringLocale("heading")},
    ${i18nStringLocale("ctaLabel")},
    ctaPath,
    "specialists": specialists[]->{
      _id, name, role, subtitle, specialties, shortBio, education, languages, bookingEnabled,
      bookingCategoryIds, sortOrder,
      "clinicRefs": clinics[]->{
        "label": coalesce(title[language == $lang][0].value, title[_key == $lang][0].value, title[language == "no"][0].value, title[_key == "no"][0].value, title),
        ${localizedSlug}
      },
      ${localizedSlug},
      "image": photo.asset->url,
      "categories": categories[]->{ ${specialistCategoryProjection} },
      ${localizedSeoObject}
    }
  },
  ${GEO_SUMMARY},
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

const CATEGORY_TREATMENT_ROW = `
  _id, _createdAt, title, sortOrder, ${localizedSlug}, description, subtitle,
  "heroImage": heroImage.asset->url
`;

/** Explicit Behandlinger[] on category doc, else treatments whose Kategori points here. */
const CATEGORY_TREATMENTS_GROQ = `
  "treatments": select(
    count(treatments) > 0 => treatments[]->{${CATEGORY_TREATMENT_ROW}},
    *[_type == "treatment" && references(^._id)]{${CATEGORY_TREATMENT_ROW}}
  )
`;

export const TREATMENT_CATEGORIES_QUERY = `*[_type == "treatmentCategory"]{
  _id, _createdAt, title, sortOrder, ${localizedSlug}, categoryId, categoryNumericId,
  "heroImage": heroImage.asset->url,
  stats,
  ${CATEGORY_TREATMENTS_GROQ}
}`;

const CATEGORY_LANDING_GROQ = `
  landingPage{
    ${i18nStringLocale("srOnlyTitle")},
    ${i18nStringLocale("breadcrumbHomeLabel")},
    hero{
      layout,
      ${i18nStringLocale("eyebrow")},
      ${i18nStringLocale("heading")},
      ${i18nStringLocale("headingEmphasis")},
      ${i18nText("body")},
      "bullets": bullets[]{
        "value": coalesce(
          title[language == $lang][0].value,
          title[_key == $lang][0].value,
          title[language == \"no\"][0].value,
          title[_key == \"no\"][0].value
        )
      },
      ${i18nStringLocale("primaryCtaLabel")},
      ${i18nStringLocale("secondaryCtaLabel")},
      ${i18nStringLocale("heroImageAlt")},
      primaryBookingService,
      ${i18nStringLocale("entryPriceLabel")},
      ${i18nStringLocale("entryPriceValue")},
    },
    segmentsSection{
      ${i18nStringLocale("eyebrow")},
      ${i18nStringLocale("title")},
      ${i18nStringLocale("titleLine2")},
      layout,
      segments[]{
        id,
        ${i18nStringLocale("title")},
        ${i18nText("description")},
        ${i18nStringArrayLocale("tags")},
        tagLinks[]{
          ${i18nStringLocale("label")},
          href
        },
        ${i18nStringLocale("ctaLabel")},
        href
      }
    },
    whySection{
      ${i18nStringLocale("eyebrow")},
      ${i18nStringLocale("title")},
      ${i18nText("description")},
      "image": image.asset->url,
      ${i18nStringLocale("imageAlt")},
      ${i18nStringLocale("footerLinkLabel")},
      footerLinkHref,
      steps[]{
        number,
        ${i18nStringLocale("title")},
        ${i18nText("description")}
      }
    },
    expertAreasSection{
      ${i18nStringLocale("eyebrow")},
      ${i18nStringLocale("title")},
      ${i18nText("description")},
      layout,
      ${i18nStringLocale("readMoreLabel")},
      areas[]{
        ${i18nStringLocale("title")},
        ${i18nText("description")},
        href,
        "image": image.asset->url,
        ${i18nStringLocale("imageAlt")}
      }
    },
    supportSection{
      ${i18nStringLocale("title")},
      ${i18nText("description")},
      ${i18nStringLocale("readMoreLabel")},
      areas[]{
        ${i18nStringLocale("title")},
        ${i18nText("description")},
        href,
        "image": image.asset->url,
        ${i18nStringLocale("imageAlt")}
      }
    },
    journeySection{
      ${i18nStringLocale("title")},
      ${i18nText("description")},
      ${i18nStringLocale("ctaLabel")},
      ctaHref,
      steps[]{
        number,
        ${i18nStringLocale("title")},
        ${i18nText("description")}
      }
    },
    spotlightSection{
      ${i18nStringLocale("title")},
      ${i18nStringLocale("titleEmphasis")},
      ${i18nText("text")},
      ${i18nStringLocale("ctaLabel")},
      ctaHref,
      "image": image.asset->url,
      ${i18nStringLocale("imageAlt")}
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
        icon,
        "image": image.asset->url
      }
    },
    symptomsSection{
      ${i18nStringLocale("eyebrow")},
      ${i18nStringLocale("title")},
      ${i18nText("description")},
      items[]{
        ${i18nStringLocale("symptom")},
        ${i18nStringLocale("service")},
        href,
        "image": image.asset->url,
        ${i18nStringLocale("imageAlt")}
      }
    },
    servicesSection{
      ${i18nStringLocale("eyebrow")},
      ${i18nStringLocale("title")},
      ${i18nText("description")},
      groups[]{
        ${i18nStringLocale("label")},
        items[]{
          ${i18nStringLocale("title")},
          ${i18nStringLocale("description")},
          href
        }
      }
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
    }
  }
`;

export const TREATMENT_CATEGORY_BY_SLUG_QUERY = `*[_type == "treatmentCategory" && (${slugMatchesParam("slug")} || categoryId == $slug)][0]{
  _id, title, ${localizedSlug}, categoryId, categoryNumericId,
  ${i18nText('geoSummary')},
  ${i18nText('missingLandingMessage')},
  "heroImage": heroImage.asset->url,
  "heroVideo": heroVideo.asset->url,
  stats[]{
    value,
    ${i18nStringLocale("label")},
    ${i18nStringLocale("sub")}
  },
  ${localizedSeoObject},
  ${CATEGORY_TREATMENTS_GROQ},
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
  ${i18nText('geoSummary')},
  "heroImage": heroImage.asset->url,
  ${i18nString('heroImageAlt')},
  ${localizedParentCategory},
  ${localizedRefSlugField("category", "parentSlug")},
  "categoryNumericId": category->categoryNumericId,
  faqs[]{${localizedFaqRow}},
  "relatedSpecialists": relatedSpecialists[]->{
    _id, name, role, subtitle, ${localizedSlug},
    "image": photo.asset->url,
    specialties
  },
  ${i18nStringLocale('homeBreadcrumbLabel')},
  ${i18nStringLocale('srOnlyTitle')},
  ${i18nStringLocale('themesAriaLabel')},
  ${i18nStringLocale('seePricesLabel')},
  seePricesHref,
  ${i18nStringLocale('callCtaLabel')},
  ${i18nStringLocale('expertReadMoreLabel')},
  ${i18nStringLocale('scrollLeftLabel')},
  ${i18nStringLocale('scrollRightLabel')},
  ${i18nStringLocale('insuranceEyebrow')},
  ${i18nStringLocale('insuranceTitle')},
  insurancePartners[]{ key, ${i18nStringLocale('label')} },
  ${i18nStringLocale('eyebrow')},
  ${i18nStringLocale('heroTitle')},
  ${i18nText('heroDescription')},
  ${i18nStringLocale('rating')},
  ${i18nStringLocale('heroPrice')},
  hideSeePriser,
  ${i18nStringLocale('heroAvailability')},
  heroThemes,
  heroVideo,
  ${i18nStringLocale('primaryCtaLabel')},
  bookingService,
  ${i18nStringLocale('flowEyebrow')},
  ${i18nStringLocale('flowTitle')},
  "flowImage": flowImage.asset->url,
  ${i18nStringLocale('flowImageAlt')},
  ${i18nStringLocale('flowLinkLabel')},
  flowLinkHref,
  ${i18nStringLocale('reasonsEyebrow')},
  ${i18nStringLocale('reasonsTitle')},
  ${i18nText('reasonsLead')},
  ${i18nText('reasonsLead2')},
  reasonsLayout,
  ${i18nStringLocale('ctaTitle')},
  ${i18nText('ctaDescription')},
  ${i18nStringLocale('conversationCtaTitle')},
  ${i18nStringLocale('specialistTitle')},
  ${i18nText('specialistDescription')},
  ${i18nStringLocale('specialistCtaLabel')},
  specialistCtaHref,
  relatedSection{
    ${i18nString('eyebrow')},
    ${i18nString('title')},
    ${i18nText('lead')},
    asIntro,
    asServices,
    seeAllHref,
    ${i18nString('seeAllLabel')},
    items[]->{
      _id,
      ${i18nString('eyebrow')},
      ${i18nString('title')},
      ${i18nText('desc')},
      "path": "/behandlinger/" + category->slug[language == $lang][0].value.current + "/" + slug[language == $lang][0].value.current,
      "image": heroImage.asset->url,
      ${i18nString('heroImageAlt')}
    }
  },
  heroPoints[]{ ${i18nString('title')}, ${i18nText('desc')} },
  flow[]{ ${i18nString('n')}, ${i18nString('title')}, ${i18nText('desc')} },
  reasons[]{ ${i18nString('n')}, ${i18nString('title')}, ${i18nText('desc')} },
  promises[]{
    ${i18nString('eyebrow')},
    ${i18nString('title')},
    ${i18nText('desc')},
    "image": image.asset->url,
    ${i18nString('imageAlt')}
  },
  expertAreas{
    ${i18nString('title')},
    ${i18nText('description')},
    items[]{
      ${i18nString('title')},
      ${i18nText('desc')},
      path,
      "image": image.asset->url,
      ${i18nString('imageAlt')}
    }
  },
  textSection{
    ${i18nString('title')},
    ${i18nText('lead')},
    points[]{ ${i18nString('n')}, ${i18nString('title')}, ${i18nText('desc')} },
    "image": image.asset->url,
    ${i18nString('imageAlt')}
  },
  ${PAGE_SECTIONS_GROQ},
  ${localizedSeoObject}
}`;

export const PRIVACY_POLICY_PAGE_QUERY = `*[_type == "privacyPolicyPage"][0]{
  ${i18nString('title')},
  ${localizedSlug},
  ${i18nBlockContent('body')},
  ${i18nText('emptyMessage')},
  cookiebotKey,
  ${PAGE_SECTIONS_GROQ},
  ${GEO_SUMMARY},
  ${localizedSeoObject}
}`;

export const ABOUT_PAGE_QUERY = `*[_type == "aboutPage"][0]{
  "title": coalesce(title[language == $lang][0].value, title[_key == $lang][0].value, title[language == "no"][0].value, title[_key == "no"][0].value, title),
  ${localizedSlug},
  ${i18nString('heroEyebrow')},
  "subtitle": coalesce(subtitle[language == $lang][0].value, subtitle[_key == $lang][0].value, subtitle[language == "no"][0].value, subtitle[_key == "no"][0].value, subtitle),
  "heroImage": heroImage.asset->url,
  ${i18nString('heroImageAlt')},
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
  ${GEO_SUMMARY},
  ${localizedSeoObject}
}`;

const CONTACT_REQUEST_DIALOG_I18N_FIELDS = [
  "dialogTitle",
  "dialogDescription",
  "nameLabel",
  "namePlaceholder",
  "phoneLabel",
  "phonePlaceholder",
  "clinicLabel",
  "clinicPlaceholder",
  "categoryLabel",
  "categoryPlaceholder",
  "categoryOtherLabel",
  "timingLabel",
  "timingAsapLabel",
  "timingSpecificLabel",
  "dayLabel",
  "timeOfDayLabel",
  "timeOfDayPlaceholder",
  "timeMorningLabel",
  "timeAfternoonLabel",
  "timeEveningLabel",
  "detailsLabel",
  "detailsOptionalSuffix",
  "detailsPlaceholder",
  "cancelButton",
  "submitButton",
  "submittingButton",
  "privacyNote",
  "toastValidationTitle",
  "toastValidationDescription",
  "validationNameRequired",
  "validationPhoneRequired",
  "validationClinicRequired",
  "validationCategoryRequired",
  "toastSuccessTitle",
  "toastSuccessDescription",
].map((field) =>
  field === "dialogDescription" ||
  field === "privacyNote" ||
  field === "toastSuccessDescription"
    ? i18nText(field)
    : i18nString(field),
);

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
  ${CONTACT_REQUEST_DIALOG_I18N_FIELDS.join(",\n  ")},
  ${PAGE_SECTIONS_GROQ},
  ${GEO_SUMMARY},
  ${localizedSeoObject}
}`;

export const NEWS_PAGE_QUERY = `*[_type == "newsPage"][0]{
  ${localizedSlug},
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
  ${i18nString("breadcrumbHomeLabel")},
  socialMode,
  socialPostLimit,
  socialPosts[]{
    _key,
    platform,
    caption,
    postUrl,
    alt,
    imageUrl,
    "image": coalesce(image.asset->url, imageUrl),
  },
  "filters": filters[]{
    key,
    ${i18nString("label")},
    acceptedArticleCategories
  },
  listSize,
  "featuredArticles": featuredArticles[]->{
    _id,
    "title": coalesce(title[language == $lang][0].value, title[_key == $lang][0].value, title[language == "no"][0].value, title[_key == "no"][0].value, title),
    ${localizedSlug},
    "excerpt": coalesce(excerpt[language == $lang][0].value, excerpt[_key == $lang][0].value, excerpt[language == "no"][0].value, excerpt[_key == "no"][0].value, excerpt),
    "image": primaryImage.asset->url,
    "date": publishedAt,
    category,
  },
  ${PAGE_SECTIONS_GROQ},
  ${GEO_SUMMARY},
  ${localizedSeoObject}
}`;

const BOOKING_PAGE_I18N_FIELDS = [
  "pageTitle",
  "closeAriaLabel",
  "backLabel",
  "stepProgressTemplate",
  "stepLabelService",
  "stepLabelClinic",
  "stepLabelSpecialist",
  "stepLabelTime",
  "stepLabelConfirm",
  "summaryServiceLabel",
  "summaryClinicLabel",
  "summarySpecialistLabel",
  "supportPhoneLabel",
  "step1Heading",
  "step1HeadingFiltered",
  "step1ShowAllServices",
  "step1Loading",
  "step1AllClinicsBadge",
  "step1EmptyTitle",
  "step1PriceFree",
  "step1PriceFrom",
  "step1LoadingDuration",
  "step2Heading",
  "step2Loading",
  "step2EmptyTitle",
  "step3Heading",
  "step3Loading",
  "step3FirstAvailableTitle",
  "step3EmptyNoCaregiversTitle",
  "step3EmptyFetchTitle",
  "step4Heading",
  "step4SelectedDayLabel",
  "step4NotOnlineTitle",
  "step4NoSlotsTitle",
  "step5Heading",
  "step5OrderTitle",
  "step5LabelService",
  "step5LabelPrice",
  "step5LabelClinic",
  "step5LabelDuration",
  "step5LabelDate",
  "step5LabelTime",
  "step5PriceFree",
  "step5PriceFrom",
  "step5PersonalInfoTitle",
  "step5SubmitLabel",
  "step5SubmittingLabel",
  "formFirstNameLabel",
  "formFirstNamePlaceholder",
  "formLastNameLabel",
  "formLastNamePlaceholder",
  "formBirthNumberLabel",
  "formBirthNumberPlaceholder",
  "formPhoneLabel",
  "formPhonePlaceholder",
  "formEmailLabel",
  "formEmailPlaceholder",
  "formTermsPageTeaser",
  "formTermsLinkText",
  "formTermsInlineLinkText",
  "formTermsCheckbox",
  "formPrivacyLinkText",
  "formMarketingCheckbox",
  "successTitle",
  "successMessageSms",
  "successMessageSmsEmail",
  "successLabelTreatment",
  "successLabelClinic",
  "successClinicPrefix",
  "successLabelDateTime",
  "successLabelSpecialist",
  "successBackHome",
].map((field) => i18nString(field));

const BOOKING_PAGE_I18N_TEXT_FIELDS = [
  "step1EmptyMessage",
  "step2EmptyMessage",
  "step3Subtitle",
  "step3FirstAvailableSubtitle",
  "step3EmptyNoCaregiversMessage",
  "step3EmptyFetchMessage",
  "step4NotOnlineMessage",
  "step4NoSlotsMessage",
  "step5PriceNote",
  "formBirthNumberHelp",
  "formPhoneHelp",
  "formEmailHelp",
  "formCancellationRules",
  "formPrivacyCheckbox",
  "errorMissingData",
  "errorActivityType",
  "errorSubmit",
  "errorSubmitNetwork",
].map((field) => i18nText(field));

export const BOOKING_PAGE_QUERY = `*[_type == "bookingPage"][0]{
  ${BOOKING_PAGE_I18N_FIELDS.join(",\n  ")},
  ${BOOKING_PAGE_I18N_TEXT_FIELDS.join(",\n  ")},
  supportPhone,
  step1CategoryClinicBadges[]{
    categoryKeys,
    badges[]{
      badgeKey,
      label,
      sortOrder,
      metodikaLocationId,
      "clinicId": coalesce(
        clinic->slug[language == $lang][0].value.current,
        clinic->slug[language == "no"][0].value.current,
        clinic->slug[0].value.current,
        clinic->slug.current
      ),
      "image": coalesce(badgeImage.asset->url, clinic->primaryImage.asset->url)
    }
  },
  ${GEO_SUMMARY},
  ${localizedSeoObject}
}`;

export const PRICING_PAGE_QUERY = `*[_type == "pricingPage"][0]{
  ${i18nString("title")},
  ${i18nText("introText")},
  ${i18nText("insuranceNote")},
  ${i18nString("testimonialsTitle")},
  ${i18nString("faqTitle")},
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
  testimonials[]->{
    _id,
    name,
    rating,
    text,
    treatment
  },
  faqs[]->{
    _id,
    sortOrder,
    ${localizedFaqRow}
  },
  ${PAGE_SECTIONS_GROQ},
  ${GEO_SUMMARY},
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
  ${GEO_SUMMARY},
  ${localizedSeoObject}
}`;

export const SERVICES_PAGE_QUERY = `*[_type == "servicesPage"][0]{
  ${localizedSlug},
  ${i18nString("breadcrumbHome")},
  ${i18nString("title")},
  ${i18nString("eyebrow")},
  ${i18nText("introText")},
  ${i18nString("searchPlaceholder")},
  ${i18nString("featuredSectionTitle")},
  ${i18nString("faqSectionTitle")},
  ${i18nText("emptyCategoriesMessage")},
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
    _id,
    _createdAt,
    categoryId,
    sortOrder,
    title,
    ${localizedSlug},
    "heroImage": heroImage.asset->url,
    ${CATEGORY_TREATMENTS_GROQ}
  },
  moreServicesCategories[]{
    displayMode,
    "category": category->{
      _id,
      _createdAt,
      categoryId,
      sortOrder,
      title,
      ${localizedSlug},
      ${CATEGORY_TREATMENTS_GROQ}
    }
  },
  ${PAGE_SECTIONS_GROQ},
  ${GEO_SUMMARY},
  ${localizedSeoObject}
}`;

export const CLINICS_QUERY = `*[_type == "clinicPage" && ${publishedClinicFilter}]{
  ${CLINIC_LIST_ROW_PROJECTION},
  services,
  description, email, contactDescription,
  ${i18nText('geoSummary')},
  valueProposition,
  locationSearch,
  "primaryImage": primaryImage.asset->url,
  booking,
  detail,
  faqs[]{${localizedFaqRow}},
  ${localizedSeoObject}
}`;

export const CLINIC_BY_SLUG_QUERY = `*[_type == "clinicPage" && ${publishedClinicFilter} && ${slugMatchesParam("slug")}][0]{
  ${CLINIC_LIST_ROW_PROJECTION},
  services,
  description, email, contactDescription,
  ${i18nText('geoSummary')},
  valueProposition,
  locationSearch,
  "primaryImage": primaryImage.asset->url,
  "gallery": gallery[]{
    "url": asset->url,
    alt
  },
  booking,
  detail,
  faqs[]{${localizedFaqRow}},
  specialists[]->{ name, ${localizedSlug}, "image": photo.asset->url, role },
  treatments[]->{ title, ${localizedSlug}, ${localizedRefSlugField("category", "categorySlug")}, "categoryLabel": parentCategoryLabel },
  ${PAGE_SECTIONS_GROQ},
  ${localizedSeoObject}
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
    "privacyPolicyPage", "careersPage", "guidePage"
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
  "specialists": *[_type == "specialist" && !(_id in path("drafts.**"))]{
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

/** Nav paths only — used to backfill missing singleton/listing slugs for routing. */
export const NAV_PATHS_FOR_ROUTE_INDEX_QUERY = `*[_type == "siteSettings"][0].mainNavigation[]{
  navId,
  ${i18nPathBoth("path")}
}`;

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  title,
  phone,
  email,
  address,
  socialMedia,
  "treatmentPageUi": treatmentPageUi{
    ${i18nNestedString("treatmentPageUi", "notFoundTitle")},
    ${i18nNestedText("treatmentPageUi", "notFoundBody")},
    ${i18nNestedString("treatmentPageUi", "backLabel")}
  },
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
export const ARTICLES_QUERY = `*[_type == "article"] | order(publishedAt desc){
  _id,
  "title": coalesce(title[language == $lang][0].value, title[_key == $lang][0].value, title[language == "no"][0].value, title[_key == "no"][0].value, title),
  ${localizedSlug},
  "excerpt": coalesce(excerpt[language == $lang][0].value, excerpt[_key == $lang][0].value, excerpt[language == "no"][0].value, excerpt[_key == "no"][0].value, excerpt),
  "image": primaryImage.asset->url,
  "imageAlt": coalesce(primaryImage.alt[language == $lang][0].value, primaryImage.alt[_key == $lang][0].value, primaryImage.alt[language == "no"][0].value, primaryImage.alt[_key == "no"][0].value, primaryImage.alt),
  "date": publishedAt,
  category,
}`;

export const ARTICLE_BY_SLUG_QUERY = `*[_type == "article" && ${slugMatchesParam("slug")}][0]{
  _id,
  "title": coalesce(title[language == $lang][0].value, title[_key == $lang][0].value, title[language == "no"][0].value, title[_key == "no"][0].value, title),
  ${localizedSlug},
  "excerpt": coalesce(excerpt[language == $lang][0].value, excerpt[_key == $lang][0].value, excerpt[language == "no"][0].value, excerpt[_key == "no"][0].value, excerpt),
  ${i18nText('geoSummary')},
  "image": primaryImage.asset->url,
  "imageAlt": coalesce(primaryImage.alt[language == $lang][0].value, primaryImage.alt[_key == $lang][0].value, primaryImage.alt[language == "no"][0].value, primaryImage.alt[_key == "no"][0].value, primaryImage.alt),
  "date": publishedAt,
  category,
  "body": coalesce(body[language == $lang][0].value, body[_key == $lang][0].value, body[language == "no"][0].value, body[_key == "no"][0].value, body),
  ${PAGE_SECTIONS_GROQ},
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
  ${PAGE_SECTIONS_GROQ}
}`;

export const FAQS_QUERY = `*[_type == "faq"] | order(sortOrder asc) { ${localizedFaqRow}, category }`;

export const FAQS_BY_CATEGORY_QUERY = `*[_type == "faq" && category == $category] | order(sortOrder asc) { ${localizedFaqRow}, category }`;

export const FAQS_BY_TREATMENT_CATEGORY_QUERY = `*[_type == "faq" && ${slugMatchesRefParam("relatedTreatmentCategory", "slug")}] | order(sortOrder asc) { ${localizedFaqRow} }`;

export const THEME_PAGE_QUERY = `*[_type == "themePage" && ${slugMatchesParam("slug")}][0]{
  "title": coalesce(title[language == $lang][0].value, title[_key == $lang][0].value, title[language == "no"][0].value, title[_key == "no"][0].value, title),
  "heroImage": heroImage.asset->url,
  introTexts,
  ${i18nText('geoSummary')},
  sections[]{heading, paragraphs, bulletPoints},
  lifePhases[]{title, text},
  ctaText, ctaLink,
  ${PAGE_SECTIONS_GROQ},
  ${localizedSeoObject}
}`;

export const SERVICE_CATEGORIES_DROPDOWN_QUERY = `*[_type == "treatmentCategory"]{
  _id, _createdAt, ${i18nString("title")}, sortOrder, categoryId, ${localizedSlug},
  "treatments": treatments[]->{
    _id, _createdAt, ${i18nString("title")}, sortOrder, ${localizedSlug},
    subItems[]{
      ${i18nString("label")},
      anchor,
      path
    }
  }
}`;

export const CAREERS_PAGE_QUERY = `*[_type == "careersPage"][0]{
  ${i18nString("breadcrumbHome")},
  ${i18nString("title")},
  ${i18nText("heroSubtitle")},
  ${i18nString("jobsSectionTitle")},
  ${i18nText("introText")},
  ${i18nString("searchPlaceholder")},
  ${i18nString("filterAllLabel")},
  ${i18nString("emptyResultsMessage")},
  ${i18nString("emptyResultsResetHint")},
  ${i18nString("emptyResultsResetLabel")},
  ${i18nString("deadlineLabel")},
  ${i18nString("ongoingLabel")},
  ${i18nString("ongoingDeadlineLabel")},
  ${i18nString("spontaneousTitle")},
  ${i18nText("spontaneousText")},
  ${i18nString("spontaneousButtonLabel")},
  spontaneousEmail,
  departmentOptions[]{ value, ${i18nString("label")} },
  employmentTypeOptions[]{ value, ${i18nString("label")} },
  ${i18nString("notFoundTitle")},
  ${i18nText("notFoundDescription")},
  ${i18nString("backToJobsLabel")},
  ${i18nString("backLinkLabel")},
  ${i18nString("applyCardTitle")},
  ${i18nString("applyExternalLabel")},
  ${i18nString("applyEmailLabel")},
  ${i18nString("contactCardTitle")},
  ${i18nString("jobSeoTitleSuffix")},
  ${PAGE_SECTIONS_GROQ},
  ${GEO_SUMMARY},
  ${localizedSeoObject}
}`;

export const SPECIALISTS_PAGE_QUERY = `*[_type == "specialistsPage"][0]{
  ${i18nString("heroEyebrow")},
  ${i18nString("title")},
  ${i18nText("subtitle")},
  ${i18nBlockContent("body")},
  ${localizedSlugBoth},
  ${PAGE_SECTIONS_GROQ},
  ${GEO_SUMMARY},
  ${localizedSeoObject}
}`;

export const SPECIALISTS_LISTING_PAGE_QUERY = `*[_type == "specialistsListingPage"][0]{
  ${i18nString("heroEyebrow")},
  ${i18nString("heroTitle")},
  ${i18nText("heroDescription")},
  ${i18nString("countLabel")},
  ${SPECIALIST_PROFILE_UI_GROQ},
  ${PAGE_SECTIONS_GROQ},
  ${GEO_SUMMARY},
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
  ${PAGE_SECTIONS_GROQ},
  ${GEO_SUMMARY},
  ${localizedSeoObject}
}`;

const GUIDE_CATEGORY_ROW = `
  _id, title, sortOrder, ${localizedSlug}, categoryId,
  "heroImage": heroImage.asset->url,
  "description": coalesce(
    landingPage.hero.body[language == $lang][0].value,
    landingPage.hero.body[_key == $lang][0].value,
    landingPage.whySection.description[language == $lang][0].value,
    landingPage.whySection.description[_key == $lang][0].value
  ),
  ${CATEGORY_TREATMENTS_GROQ}
`;

export const GUIDE_PAGE_QUERY = `*[_type == "guidePage"][0]{
  ${i18nString("heroTitle")},
  ${i18nText("heroSubtitle")},
  showCategorySections,
  ${i18nString("ctaTitle")},
  ${i18nText("ctaSubtitle")},
  ${i18nString("ctaButtonLabel")},
  ctaButtonPath,
  "categories": select(
    showCategorySections != false && count(featuredCategories) > 0 => featuredCategories[]->{${GUIDE_CATEGORY_ROW}},
    showCategorySections != false => *[_type == "treatmentCategory"] | order(sortOrder asc){${GUIDE_CATEGORY_ROW}},
    []
  ),
  ${PAGE_SECTIONS_GROQ},
  ${GEO_SUMMARY},
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

export const SOCIAL_POSTS_QUERY = `*[_type == "socialPost" && published != false] | order(sortOrder asc, _createdAt desc)[0..11]{
  _id, platform, caption, postUrl, alt, sortOrder,
  "image": image.asset->url
}`;

export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && ${slugMatchesParam("slug")}][0]{
  _id, name, ${localizedSlug}, category, price, rating,
  "image": image.asset->url,
  tags, intent, description, benefits, results, howItWorks
}`;

export const LISTING_SORT_SETTINGS_QUERY = `*[_type == "listingSortSettings"][0]{
  specialistsSort,
  clinicsSort,
  categoriesSort,
  treatmentsSort
}`;
