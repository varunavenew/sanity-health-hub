// Centralized Sanity GROQ queries

export const HOMEPAGE_QUERY = `*[_type == "homepage"][0]{
  title, tagline,
  heroBanner{
    slides[]{heading, subheading, ctaText, ctaLink, "image": image.asset->url}
  },
  "serviceCategories": serviceCategories[]->{ _id, title, "slug": slug.current, description, icon, color, "heroImage": heroImage.asset->url },
  valueBadges[]{icon, label},
  statsBar[]{value, label},
  promoBlocks[]{title, description, ctaText, ctaLink, "image": image.asset->url},
  seo
}`;

export const SPECIALISTS_QUERY = `*[_type == "specialist"] | order(name asc){
  _id, name, role, subtitle, specialties, shortBio, education, languages, bookingEnabled, clinics,
  "slug": slug.current,
  "image": photo.asset->url,
  "categories": categories[]->{ _id, title, "slug": slug.current }
}`;

export const SPECIALIST_BY_SLUG_QUERY = `*[_type == "specialist" && slug.current == $slug][0]{
  _id, name, role, subtitle, specialties, shortBio, education, languages, bookingEnabled, clinics,
  "slug": slug.current,
  "image": photo.asset->url,
  "categories": categories[]->{ _id, title, "slug": slug.current }
}`;

export const GOOGLE_REVIEWS_QUERY = `*[_type == "googleReview"] | order(_createdAt desc){
  _id, author, rating, text, date
}`;

export const TREATMENT_CATEGORIES_QUERY = `*[_type == "treatmentCategory"] | order(title asc){
  _id, title, "slug": slug.current, categoryId, description, icon, color,
  "heroImage": heroImage.asset->url,
  stats,
  "treatments": *[_type == "treatment" && references(^._id)] | order(title asc){
    _id, title, "slug": slug.current, description, "heroImage": heroImage.asset->url
  }
}`;

export const TREATMENT_CATEGORY_BY_SLUG_QUERY = `*[_type == "treatmentCategory" && (slug.current == $slug || categoryId == $slug)][0]{
  _id, title, "slug": slug.current, categoryId, description, icon, color,
  "heroImage": heroImage.asset->url,
  stats,
  seo,
  "treatments": *[_type == "treatment" && references(^._id)] | order(title asc){
    _id, title, "slug": slug.current, description, subtitle,
    "heroImage": heroImage.asset->url
  }
}`;

export const TREATMENT_BY_SLUG_QUERY = `*[_type == "treatment" && slug.current == $treatmentSlug && (category->slug.current == $categorySlug || category->categoryId == $categorySlug)][0]{
  _id, title, subtitle, description, benefits, benefitsTitle,
  "heroImage": heroImage.asset->url,
  "parentCategory": category->title,
  "parentSlug": category->slug.current,
  parentCategoryLabel,
  process[]{title, description},
  faqs[]{question, answer},
  sections[]{id, heading, content},
  relatedSpecialists,
  linkedServices[]{label, description, path},
  seo
}`;

export const ABOUT_PAGE_QUERY = `*[_type == "aboutPage"][0]{
  title, subtitle, "heroImage": heroImage.asset->url,
  body,
  values,
  seo
}`;

export const CONTACT_PAGE_QUERY = `*[_type == "contactPage"][0]{
  title, introText, phone, email,
  "heroImage": heroImage.asset->url,
  address{street, city, zip},
  openingHours[]{days, hours},
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

export const CLINICS_QUERY = `*[_type == "clinicPage"] | order(title asc){
  _id, "id": slug.current, "label": title, address, phone, hours, services,
  "slug": slug.current,
  description, email, contactDescription,
  valueProposition,
  locationSearch,
  "primaryImage": primaryImage.asset->url,
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
  "primaryImage": primaryImage.asset->url,
  booking,
  detail,
  faqs[]{question, answer},
  specialists[]->{ name, "slug": slug.current, "image": photo.asset->url, role },
  treatments[]->{ title, "slug": slug.current },
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
  notFoundTitle,
  notFoundText,
  "notFoundImage": notFoundImage.asset->url,
  notFoundCtaLabel,
  notFoundCtaPath
}`;

export const ARTICLES_QUERY = `*[_type == "article"] | order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  excerpt,
  "image": primaryImage.asset->url,
  "imageAlt": primaryImage.alt,
  "date": publishedAt,
  category,
  pinned,
  featured,
}`;

export const ARTICLE_BY_SLUG_QUERY = `*[_type == "article" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  excerpt,
  "image": primaryImage.asset->url,
  "imageAlt": primaryImage.alt,
  "date": publishedAt,
  category,
  body,
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

export const FAQS_QUERY = `*[_type == "faq"] | order(sortOrder asc) { question, answer, category }`;

export const FAQS_BY_CATEGORY_QUERY = `*[_type == "faq" && category == $category] | order(sortOrder asc) { question, answer, category }`;

export const FAQS_BY_TREATMENT_CATEGORY_QUERY = `*[_type == "faq" && relatedTreatmentCategory->slug.current == $slug] | order(sortOrder asc) { question, answer }`;

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

export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0]{
  _id, name, "slug": slug.current, category, price, rating,
  "image": image.asset->url,
  tags, intent, description, benefits, results, howItWorks
}`;
