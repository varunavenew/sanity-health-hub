// Centralized Sanity GROQ queries

export const HOMEPAGE_QUERY = `*[_type == "homepage"][0]{
  title, title_en, tagline, tagline_en,
  heroBanner{
    slides[]{heading, heading_en, subheading, subheading_en, ctaText, ctaText_en, ctaLink, "image": image.asset->url}
  },
  "serviceCategories": serviceCategories[]->{ _id, title, title_en, "slug": slug.current, description, description_en, icon, color, "heroImage": heroImage.asset->url },
  valueBadges[]{icon, label, label_en},
  statsBar[]{value, label, label_en},
  promoBlocks[]{title, title_en, description, description_en, ctaText, ctaText_en, ctaLink, "image": image.asset->url},
  seo
}`;

export const SPECIALISTS_QUERY = `*[_type == "specialist"] | order(name asc){
  _id, name, role, role_en, subtitle, subtitle_en, specialties, specialties_en, shortBio, shortBio_en, education, languages, bookingEnabled,
  "clinics": clinics[]->title,
  "slug": slug.current,
  "image": photo.asset->url,
  "categories": categories[]->{ _id, title, title_en, "slug": slug.current }
}`;

export const SPECIALIST_BY_SLUG_QUERY = `*[_type == "specialist" && slug.current == $slug][0]{
  _id, name, role, role_en, subtitle, subtitle_en, specialties, specialties_en, shortBio, shortBio_en, education, languages, bookingEnabled,
  "clinics": clinics[]->title,
  "slug": slug.current,
  "image": photo.asset->url,
  "categories": categories[]->{ _id, title, title_en, "slug": slug.current }
}`;

export const GOOGLE_REVIEWS_QUERY = `*[_type == "googleReview"] | order(_createdAt desc){
  _id, author, rating, text, text_en, date
}`;

export const GOOGLE_REVIEW_SETTINGS_QUERY = `*[_type == "googleReviewSettings"][0]{
  heading, heading_en, subheading, subheading_en, googleAverageRating, legelistenAverageRating, ctaTitle, ctaTitle_en, ctaSubtitle, ctaSubtitle_en
}`;

export const TREATMENT_CATEGORIES_QUERY = `*[_type == "treatmentCategory"] | order(title asc){
  _id, title, title_en, "slug": slug.current, categoryId, description, description_en, icon, color,
  "heroImage": heroImage.asset->url,
  stats,
  "treatments": *[_type == "treatment" && references(^._id)] | order(title asc){
    _id, title, title_en, "slug": slug.current, description, description_en, "heroImage": heroImage.asset->url
  }
}`;

export const TREATMENT_CATEGORY_BY_SLUG_QUERY = `*[_type == "treatmentCategory" && (slug.current == $slug || categoryId == $slug)][0]{
  _id, title, title_en, "slug": slug.current, categoryId, description, description_en, icon, color,
  "heroImage": heroImage.asset->url,
  stats,
  subtitle, subtitle_en,
  servicesHeading, servicesHeading_en,
  servicesIntro, servicesIntro_en,
  serviceGroups[]{ _key, label, label_en, caption, caption_en, serviceNames },
  journey[]{ _key, icon, label, label_en, title, title_en, body, body_en },
  staticFaqs[]{ _key, question, question_en, answer, answer_en },
  closingTitle, closingTitle_en,
  closingBody, closingBody_en,
  closingCta, closingCta_en,
  bookingPath,
  sections[]{
    ...,
    _type, _key,
    treatmentRefs[]->{ _id, title, "slug": slug.current, "categorySlug": category->slug.current },
    manualRefs[]->{ _id, name, "slug": slug.current, role, "image": photo.asset->url },
    themes[]->{ _id, title, "slug": slug.current }
  },
  seo,
  "treatments": *[_type == "treatment" && references(^._id)] | order(title asc){
    _id, title, title_en, "slug": slug.current, description, description_en, subtitle, subtitle_en,
    "heroImage": heroImage.asset->url
  }
}`;

export const TREATMENT_BY_SLUG_QUERY = `*[_type == "treatment" && slug.current == $treatmentSlug && (category->slug.current == $categorySlug || category->categoryId == $categorySlug)][0]{
  _id, title, title_en, subtitle, subtitle_en, description, description_en, benefits, benefits_en, benefitsTitle, benefitsTitle_en,
  "heroImage": heroImage.asset->url,
  "parentCategory": category->title,
  "parentSlug": category->slug.current,
  parentCategoryLabel, parentCategoryLabel_en,
  process[]{title, title_en, description, description_en},
  faqs[]{question, question_en, answer, answer_en},
  sections[]{id, heading, heading_en, content, content_en},
  "relatedSpecialists": relatedSpecialists[]->{
    _id, name, role, role_en, subtitle, subtitle_en, "slug": slug.current,
    "image": photo.asset->url,
    specialties, specialties_en
  },
  linkedServices[]{label, label_en, description, description_en, path},
  sections[]{
    ...,
    _type, _key,
    treatmentRefs[]->{ _id, title, "slug": slug.current, "categorySlug": category->slug.current },
    manualRefs[]->{ _id, name, "slug": slug.current, role, "image": photo.asset->url }
  },
  seo
}`;

export const ABOUT_PAGE_QUERY = `*[_type == "aboutPage"][0]{
  "title": coalesce(title[language == $lang][0].value, title[_key == $lang][0].value, title[language == "no"][0].value, title[_key == "no"][0].value, title),
  "subtitle": coalesce(subtitle[language == $lang][0].value, subtitle[_key == $lang][0].value, subtitle[language == "no"][0].value, subtitle[_key == "no"][0].value, subtitle),
  "heroImage": heroImage.asset->url,
  "body": coalesce(body[language == $lang][0].value, body[_key == $lang][0].value, body[language == "no"][0].value, body[_key == "no"][0].value, body),
  values,
  seo
}`;

export const CONTACT_PAGE_QUERY = `*[_type == "contactPage"][0]{
  title, introText, phone, email,
  "heroImage": heroImage.asset->url,
  address{street, city, zip},
  openingHours[]{days, hours},
  ctaCards[]{icon, title, description, ctaText, ctaAction, ctaLink, variant},
  seo
}`;

export const PRICING_PAGE_QUERY = `*[_type == "pricingPage"][0]{
  title, introText, insuranceNote,
  "heroImage": heroImage.asset->url,
  priceCategories[]{
    categoryName,
    "categoryRef": category->{ _id, title, "slug": slug.current },
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
  "categories": categories[]->{ _id, title, "slug": slug.current, description, icon, color, "heroImage": heroImage.asset->url },
  seo
}`;

export const CLINICS_QUERY = `*[_type == "clinicPage"] | order(sortOrder asc, title asc){
  _id, "id": slug.current, "label": title, address, phone, hours, services,
  "slug": slug.current,
  description, email, contactDescription,
  valueProposition,
  locationSearch,
  sortOrder,
  "primaryImage": primaryImage.asset->url,
  "gallery": gallery[]{ "src": asset->url, alt },
  booking,
  detail,
  faqs[]{question, answer},
  seo
}`;

export const CLINIC_BY_SLUG_QUERY = `*[_type == "clinicPage" && slug.current == $slug][0]{
  _id, "id": slug.current, "label": title, address, phone, hours, services,
  "slug": slug.current,
  description, email, contactDescription,
  valueProposition,
  locationSearch,
  sortOrder,
  "primaryImage": primaryImage.asset->url,
  booking,
  detail,
  faqs[]{question, answer},
  specialists[]->{ name, "slug": slug.current, "image": photo.asset->url, role },
  treatments[]->{ title, "slug": slug.current, "categorySlug": category->slug.current, "categoryLabel": parentCategoryLabel },
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
  notFoundCtaPath,
  insuranceSectionTitle,
  insurancePartners
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
  "slug": slug.current,
  "excerpt": coalesce(excerpt[language == $lang][0].value, excerpt[_key == $lang][0].value, excerpt[language == "no"][0].value, excerpt[_key == "no"][0].value, excerpt),
  "image": primaryImage.asset->url,
  "imageAlt": coalesce(primaryImage.alt[language == $lang][0].value, primaryImage.alt[_key == $lang][0].value, primaryImage.alt[language == "no"][0].value, primaryImage.alt[_key == "no"][0].value, primaryImage.alt),
  "date": publishedAt,
  category,
  pinned,
  featured,
}`;

export const ARTICLE_BY_SLUG_QUERY = `*[_type == "article" && slug.current == $slug][0]{
  _id,
  "title": coalesce(title[language == $lang][0].value, title[_key == $lang][0].value, title[language == "no"][0].value, title[_key == "no"][0].value, title),
  "slug": slug.current,
  "excerpt": coalesce(excerpt[language == $lang][0].value, excerpt[_key == $lang][0].value, excerpt[language == "no"][0].value, excerpt[_key == "no"][0].value, excerpt),
  "image": primaryImage.asset->url,
  "imageAlt": coalesce(primaryImage.alt[language == $lang][0].value, primaryImage.alt[_key == $lang][0].value, primaryImage.alt[language == "no"][0].value, primaryImage.alt[_key == "no"][0].value, primaryImage.alt),
  "date": publishedAt,
  category,
  "body": coalesce(body[language == $lang][0].value, body[_key == $lang][0].value, body[language == "no"][0].value, body[_key == "no"][0].value, body),
  videoUrl,
  videoCaption,
  "videoThumbnail": videoThumbnail.asset->url,
}`;

export const JOB_LISTINGS_QUERY = `*[_type == "jobListing" && active == true] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
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

export const JOB_LISTING_BY_SLUG_QUERY = `*[_type == "jobListing" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
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

export const FAQS_QUERY = `*[_type == "faq"] | order(sortOrder asc) { question, question_en, answer, answer_en, category }`;

export const FAQS_BY_CATEGORY_QUERY = `*[_type == "faq" && category == $category] | order(sortOrder asc) { question, question_en, answer, answer_en, category }`;

export const FAQS_BY_TREATMENT_CATEGORY_QUERY = `*[_type == "faq" && relatedTreatmentCategory->slug.current == $slug] | order(sortOrder asc) { question, question_en, answer, answer_en }`;

export const THEME_PAGE_QUERY = `*[_type == "themePage" && slug.current == $slug][0]{
  title,
  "heroImage": heroImage.asset->url,
  introTexts,
  sections[]{heading, paragraphs, bulletPoints},
  lifePhases[]{title, text},
  ctaText, ctaLink,
  seo
}`;

export const SERVICE_CATEGORIES_DROPDOWN_QUERY = `*[_type == "treatmentCategory"]{
  _id, title, categoryId, "slug": slug.current,
  "treatments": treatments[]->{ 
    _id, title, "slug": slug.current,
    subItems[]{label, anchor, path}
  }
}`;

export const SPECIALISTS_PAGE_QUERY = `*[_type == "specialistsPage"][0]{
  title, subtitle, body, seo
}`;

export const PRODUCTS_QUERY = `*[_type == "product"] | order(sortOrder asc){
  _id, name, "slug": slug.current, category, price, rating,
  "image": image.asset->url,
  tags, intent, description, benefits, results, howItWorks,
  isSeasonal, seasonalOrder
}`;

export const SEASONAL_PRODUCTS_QUERY = `*[_type == "product" && isSeasonal == true] | order(seasonalOrder asc){
  _id, name, "slug": slug.current, category, price, rating,
  "image": image.asset->url,
  tags, intent, description
}`;

export const TOP_RATED_PRODUCTS_QUERY = `*[_type == "product"] | order(rating desc)[0..3]{
  _id, name, "slug": slug.current, category, price, rating,
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

export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0]{
  _id, name, "slug": slug.current, category, price, rating,
  "image": image.asset->url,
  tags, intent, description, benefits, results, howItWorks
}`;
