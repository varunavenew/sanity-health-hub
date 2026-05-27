// Centralized Sanity GROQ queries
import { localizedSeoObject } from "@/lib/sanity/seo-groq";
import {
  localizedRefSlugField,
  localizedSlug,
  orderSlugAsc,
  slugMatchesParam,
  slugMatchesRefParam,
} from "@/lib/sanity/slug-groq";

export const HOMEPAGE_QUERY = `*[_type == "homepage"][0]{
  title, tagline,
  heroBanner{
    slides[]{heading, subheading, ctaText, ctaLink, "image": image.asset->url}
  },
  "serviceCategories": serviceCategories[]->{ _id, title, ${localizedSlug}, description, icon, color, "heroImage": heroImage.asset->url },
  valueBadges[]{icon, label},
  statsBar[]{value, label},
  promoBlocks[]{title, description, ctaText, ctaLink, "image": image.asset->url},
  ${localizedSeoObject}
}`;

export const SPECIALISTS_QUERY = `*[_type == "specialist"] | order(name asc){
  _id, name, role, subtitle, specialties, shortBio, education, languages, bookingEnabled,
  "clinics": clinics[]->title,
  ${localizedSlug},
  "image": photo.asset->url,
  "categories": categories[]->{ _id, title, ${localizedSlug} }
}`;

export const SPECIALIST_BY_SLUG_QUERY = `*[_type == "specialist" && ${slugMatchesParam("slug")}][0]{
  _id, name, role, subtitle, specialties, shortBio, education, languages, bookingEnabled,
  "clinics": clinics[]->title,
  ${localizedSlug},
  "image": photo.asset->url,
  "categories": categories[]->{ _id, title, ${localizedSlug} }
}`;

export const GOOGLE_REVIEWS_QUERY = `*[_type == "googleReview"] | order(_createdAt desc){
  _id, author, rating, text, date
}`;

export const GOOGLE_REVIEW_SETTINGS_QUERY = `*[_type == "googleReviewSettings"][0]{
  heading, subheading, googleAverageRating, legelistenAverageRating, ctaTitle, ctaSubtitle
}`;

export const TREATMENT_CATEGORIES_QUERY = `*[_type == "treatmentCategory"] | order(${orderSlugAsc}){
  _id, title, ${localizedSlug}, categoryId, description, icon, color,
  "heroImage": heroImage.asset->url,
  stats,
  "treatments": *[_type == "treatment" && references(^._id)] | order(${orderSlugAsc}){
    _id, title, ${localizedSlug}, description, "heroImage": heroImage.asset->url
  }
}`;

export const TREATMENT_CATEGORY_BY_SLUG_QUERY = `*[_type == "treatmentCategory" && (${slugMatchesParam("slug")} || categoryId == $slug)][0]{
  _id, title, ${localizedSlug}, categoryId, description, icon, color,
  "heroImage": heroImage.asset->url,
  stats,
  ${localizedSeoObject},
  "treatments": *[_type == "treatment" && references(^._id)] | order(${orderSlugAsc}){
    _id, title, ${localizedSlug}, description, subtitle,
    "heroImage": heroImage.asset->url
  }
}`;

export const TREATMENT_BY_SLUG_QUERY = `*[_type == "treatment" && ${slugMatchesParam("treatmentSlug")} && (${slugMatchesRefParam("category", "categorySlug")} || category->categoryId == $categorySlug)][0]{
  _id, title, subtitle, description, benefits, benefitsTitle,
  "heroImage": heroImage.asset->url,
  "parentCategory": category->title,
  ${localizedRefSlugField("category", "parentSlug")},
  parentCategoryLabel,
  process[]{title, description},
  faqs[]{question, answer},
  sections[]{id, heading, content},
  "relatedSpecialists": relatedSpecialists[]->{
    _id, name, role, subtitle, ${localizedSlug},
    "image": photo.asset->url,
    specialties
  },
  linkedServices[]{label, description, path},
  ${localizedSeoObject}
}`;

const i18nString = (field: string) =>
  `"${field}": coalesce(${field}[language == $lang][0].value, ${field}[_key == $lang][0].value, ${field}[language == "no"][0].value, ${field}[_key == "no"][0].value, ${field})`;

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
  ${localizedSeoObject}
}`;

export const CONTACT_PAGE_QUERY = `*[_type == "contactPage"][0]{
  title, introText, phone, email,
  "heroImage": heroImage.asset->url,
  address{street, city, zip},
  openingHours[]{days, hours},
  ctaCards[]{icon, title, description, ctaText, ctaAction, ctaLink, variant},
  ${localizedSeoObject}
}`;

export const PRICING_PAGE_QUERY = `*[_type == "pricingPage"][0]{
  title, introText, insuranceNote,
  "heroImage": heroImage.asset->url,
  priceCategories[]{
    categoryName,
    "categoryRef": category->{ _id, title, ${localizedSlug} },
    items[]{name, price, priceLabel, note}
  },
  seo
}`;

export const INSURANCE_PAGE_QUERY = `*[_type == "insurancePage"][0]{
  title, introText,
  "heroImage": heroImage.asset->url,
  partners,
  steps[]{title, description},
  benefits[]{title, description},
  seo
}`;

export const SERVICES_PAGE_QUERY = `*[_type == "servicesPage"][0]{
  title, introText,
  "categories": categories[]->{ _id, title, ${localizedSlug}, description, icon, color, "heroImage": heroImage.asset->url },
  seo
}`;

export const CLINICS_QUERY = `*[_type == "clinicPage"] | order(${orderSlugAsc}){
  _id, ${localizedSlug}, "id": coalesce(slug[language == $lang][0].value.current, slug[language == "no"][0].value.current, slug[0].value.current, slug.current), "label": title, address, phone, hours, services,
  description, email, contactDescription,
  valueProposition,
  locationSearch,
  sortOrder,
  "primaryImage": primaryImage.asset->url,
  booking,
  detail,
  faqs[]{question, answer},
  seo
}`;

export const CLINIC_BY_SLUG_QUERY = `*[_type == "clinicPage" && ${slugMatchesParam("slug")}][0]{
  _id, ${localizedSlug}, "id": coalesce(slug[language == $lang][0].value.current, slug[language == "no"][0].value.current, slug[0].value.current, slug.current), "label": title, address, phone, hours, services,
  description, email, contactDescription,
  valueProposition,
  locationSearch,
  sortOrder,
  "primaryImage": primaryImage.asset->url,
  booking,
  detail,
  faqs[]{question, answer},
  specialists[]->{ name, ${localizedSlug}, "image": photo.asset->url, role },
  treatments[]->{ title, ${localizedSlug}, ${localizedRefSlugField("category", "categorySlug")}, "categoryLabel": parentCategoryLabel },
  seo
}`;

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  title,
  phone,
  email,
  address,
  socialMedia,
  mainNavigation[]{
    _key,
    label,
    path,
    isServicesDropdown
  },
  ctaButton{ label, path },
  footerAboutLinks[]{
    _key,
    label,
    path
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

export const FAQS_QUERY = `*[_type == "faq"] | order(sortOrder asc) { question, answer, category }`;

export const FAQS_BY_CATEGORY_QUERY = `*[_type == "faq" && category == $category] | order(sortOrder asc) { question, answer, category }`;

export const FAQS_BY_TREATMENT_CATEGORY_QUERY = `*[_type == "faq" && ${slugMatchesRefParam("relatedTreatmentCategory", "slug")}] | order(sortOrder asc) { question, answer }`;

export const THEME_PAGE_QUERY = `*[_type == "themePage" && ${slugMatchesParam("slug")}][0]{
  "title": coalesce(title[language == $lang][0].value, title[_key == $lang][0].value, title[language == "no"][0].value, title[_key == "no"][0].value, title),
  "heroImage": heroImage.asset->url,
  introTexts,
  sections[]{heading, paragraphs, bulletPoints},
  lifePhases[]{title, text},
  ctaText, ctaLink,
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
  title, subtitle, body, seo
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
