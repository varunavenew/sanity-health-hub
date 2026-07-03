import {
  ABOUT_PAGE_QUERY,
  ARTICLE_BY_SLUG_QUERY,
  CONTACT_PAGE_QUERY,
  PRIVACY_POLICY_PAGE_QUERY,
  HOMEPAGE_QUERY,
  INSURANCE_PAGE_QUERY,
  CLINICS_PAGE_QUERY,
  CLINIC_SEO_BY_SLUG_QUERY,
  JOB_LISTING_SEO_BY_SLUG_QUERY,
  NEWS_PAGE_QUERY,
  PRICING_PAGE_QUERY,
  SERVICES_PAGE_QUERY,
  SPECIALIST_BY_SLUG_QUERY,
  SPECIALISTS_PAGE_QUERY,
  SPECIALISTS_LISTING_PAGE_QUERY,
  THEME_PAGE_QUERY,
  TREATMENT_BY_SLUG_QUERY,
  TREATMENT_CATEGORY_BY_SLUG_QUERY,
  CAREERS_PAGE_QUERY,
  GUIDE_PAGE_QUERY,
} from "@/lib/queries";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";
import { isPublishableSanitySpecialist, type RawSanitySpecialist } from "@/lib/sanity/specialist-data";
import { sanityFetchCached } from "@/lib/sanity/sanity-fetch-cached";
import {
  SANITY_CACHE_TAGS,
  SANITY_DATA_REVALIDATE_SEC,
} from "@/lib/sanity/sanity-revalidate";
import type { SanitySeoFields } from "@/lib/seo/seo-fields";

type DocWithSeo = { seo?: SanitySeoFields };

export async function fetchHomepageDocument(
  lang: "no" | "en",
): Promise<DocWithSeo | null> {
  return sanityFetchCached<DocWithSeo | null>({
    query: HOMEPAGE_QUERY,
    params: { lang },
    key: ["sanity", "homepage", lang, HOMEPAGE_QUERY],
    tags: [SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.homepage, SANITY_CACHE_TAGS.type("homepage")],
    revalidate: SANITY_DATA_REVALIDATE_SEC.homepage,
  });
}

export async function fetchContactPageDocument(
  lang: "no" | "en",
): Promise<DocWithSeo | null> {
  return sanityFetchCached<DocWithSeo | null>({
    query: CONTACT_PAGE_QUERY,
    params: { lang },
    key: ["sanity", "contactPage", lang, CONTACT_PAGE_QUERY],
    tags: [SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.contactPage, SANITY_CACHE_TAGS.type("contactPage")],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
}

export async function fetchAboutPageDocument(
  lang: "no" | "en",
): Promise<DocWithSeo | null> {
  return sanityFetchCached<DocWithSeo | null>({
    query: ABOUT_PAGE_QUERY,
    params: { lang },
    key: ["sanity", "aboutPage", lang, ABOUT_PAGE_QUERY],
    tags: [SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.aboutPage, SANITY_CACHE_TAGS.type("aboutPage")],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
}

export async function fetchNewsPageDocument(
  lang: "no" | "en",
): Promise<DocWithSeo | null> {
  return sanityFetchCached<DocWithSeo | null>({
    query: NEWS_PAGE_QUERY,
    params: { lang },
    key: ["sanity", "newsPage", lang, NEWS_PAGE_QUERY],
    tags: [SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.newsPage, SANITY_CACHE_TAGS.type("newsPage")],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
}

export async function fetchInsurancePageDocument(
  lang: "no" | "en",
): Promise<DocWithSeo | null> {
  const raw = await sanityFetchCached({
    query: INSURANCE_PAGE_QUERY,
    params: { lang },
    key: ["sanity", "insurancePage", lang, INSURANCE_PAGE_QUERY],
    tags: [SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.type("insurancePage")],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
  if (raw == null) return null;
  return normalizeI18n(raw, lang) as DocWithSeo;
}

export async function fetchServicesPageDocument(
  lang: "no" | "en",
): Promise<(DocWithSeo & { title?: string; introText?: string }) | null> {
  const raw = await sanityFetchCached({
    query: SERVICES_PAGE_QUERY,
    params: { lang },
    key: ["sanity", "servicesPage", lang, SERVICES_PAGE_QUERY],
    tags: [SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.type("servicesPage")],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
  if (raw == null) return null;
  return normalizeI18n(raw, lang) as DocWithSeo & {
    title?: string;
    introText?: string;
  };
}

export type PricingPageDocument = DocWithSeo & {
  title?: string;
  introText?: string;
};

export async function fetchPricingPageDocument(
  lang: "no" | "en",
): Promise<PricingPageDocument | null> {
  const raw = await sanityFetchCached({
    query: PRICING_PAGE_QUERY,
    params: { lang },
    key: ["sanity", "pricingPage", lang, PRICING_PAGE_QUERY],
    tags: [SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.type("pricingPage")],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
  if (raw == null) return null;
  return normalizeI18n(raw, lang) as PricingPageDocument;
}

export type ClinicsPageDocument = DocWithSeo & {
  heroEyebrow?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroImage?: string;
  primaryCtaLabel?: string;
  primaryCtaPath?: string;
  secondaryCtaLabel?: string;
  secondaryCtaPath?: string;
};

export async function fetchClinicsPageDocument(
  lang: "no" | "en",
): Promise<ClinicsPageDocument | null> {
  const raw = await sanityFetchCached({
    query: CLINICS_PAGE_QUERY,
    params: { lang },
    key: ["sanity", "clinicsPage", lang, CLINICS_PAGE_QUERY],
    tags: [SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.type("clinicsPage")],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
  if (raw == null) return null;
  return normalizeI18n(raw, lang) as ClinicsPageDocument;
}

export async function fetchClinicSeo(
  slug: string,
  lang: "no" | "en",
): Promise<(DocWithSeo & { label?: string }) | null> {
  const raw = await sanityFetchCached({
    query: CLINIC_SEO_BY_SLUG_QUERY,
    params: { slug, lang },
    key: ["sanity", "clinic", slug, lang, CLINIC_SEO_BY_SLUG_QUERY],
    tags: [SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.type("clinicPage")],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
  if (raw == null) return null;
  const doc = normalizeI18n(raw, lang) as Record<string, unknown>;
  return {
    label: typeof doc.label === "string" ? doc.label : undefined,
    seo: doc.seo as DocWithSeo["seo"],
  };
}

export async function fetchJobListingSeo(
  slug: string,
  lang: "no" | "en",
): Promise<{ title?: string; excerpt?: string } | null> {
  return sanityFetchCached({
    query: JOB_LISTING_SEO_BY_SLUG_QUERY,
    params: { slug, lang },
    key: ["sanity", "jobListing", slug, lang, JOB_LISTING_SEO_BY_SLUG_QUERY],
    tags: [SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.type("jobListing")],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
}

export type SpecialistsListingPageDocument = DocWithSeo & {
  heroEyebrow?: string;
  heroTitle?: string;
  heroDescription?: string;
  countLabel?: string;
};

export async function fetchSpecialistsListingPageDocument(
  lang: "no" | "en",
): Promise<SpecialistsListingPageDocument | null> {
  const raw = await sanityFetchCached({
    query: SPECIALISTS_LISTING_PAGE_QUERY,
    params: { lang },
    key: ["sanity", "specialistsListingPage", lang, SPECIALISTS_LISTING_PAGE_QUERY],
    tags: [SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.type("specialistsListingPage")],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
  if (raw == null) return null;
  return normalizeI18n(raw, lang) as SpecialistsListingPageDocument;
}

export async function fetchSpecialistsPageDocument(
  lang: "no" | "en",
): Promise<DocWithSeo | null> {
  const raw = await sanityFetchCached({
    query: SPECIALISTS_PAGE_QUERY,
    params: { lang },
    key: ["sanity", "specialistsPage", lang, SPECIALISTS_PAGE_QUERY],
    tags: [SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.type("specialistsPage")],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
  if (raw == null) return null;
  return normalizeI18n(raw, lang) as DocWithSeo;
}

export async function fetchSpecialistSeo(
  slug: string,
  lang: "no" | "en",
): Promise<
  | (DocWithSeo & {
      name?: string;
      role?: string;
      shortBio?: string;
      expertise?: string[];
    })
  | null
> {
  const raw = await sanityFetchCached({
    query: SPECIALIST_BY_SLUG_QUERY,
    params: { slug, lang },
    key: ["sanity", "specialist", slug, lang, SPECIALIST_BY_SLUG_QUERY],
    tags: [
      SANITY_CACHE_TAGS.all,
      SANITY_CACHE_TAGS.type("specialist"),
    ],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
  if (raw == null || !isPublishableSanitySpecialist(raw as RawSanitySpecialist)) return null;
  const doc = normalizeI18n(raw, lang) as Record<string, unknown>;
  const specialties = doc.specialties;
  const expertise = Array.isArray(specialties)
    ? specialties
        .map((entry) => {
          if (typeof entry === "string") return entry;
          if (entry && typeof entry === "object" && "label" in entry) {
            const label = (entry as { label?: unknown }).label;
            return typeof label === "string" ? label : "";
          }
          return "";
        })
        .filter(Boolean)
    : [];
  return {
    name: typeof doc.name === "string" ? doc.name : undefined,
    role: typeof doc.role === "string" ? doc.role : undefined,
    shortBio: typeof doc.shortBio === "string" ? doc.shortBio : undefined,
    expertise,
    seo: doc.seo as DocWithSeo["seo"],
  };
}

export async function fetchPrivacyPolicyPageDocument(lang: "no" | "en"): Promise<{
  title?: string;
  body?: unknown[];
  cookiebotKey?: string;
  seo?: DocWithSeo["seo"];
} | null> {
  return sanityFetchCached({
    query: PRIVACY_POLICY_PAGE_QUERY,
    params: { lang },
    key: ["sanity", "privacyPolicyPage", lang, PRIVACY_POLICY_PAGE_QUERY],
    tags: [
      SANITY_CACHE_TAGS.all,
      SANITY_CACHE_TAGS.privacyPolicyPage,
      SANITY_CACHE_TAGS.type("privacyPolicyPage"),
    ],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
}

export async function fetchArticleSeo(
  slug: string,
  lang: "no" | "en",
): Promise<
  | (DocWithSeo & {
      title?: string;
      excerpt?: string;
      date?: string;
    })
  | null
> {
  const raw = await sanityFetchCached({
    query: ARTICLE_BY_SLUG_QUERY,
    params: { slug, lang },
    key: ["sanity", "article", slug, lang, ARTICLE_BY_SLUG_QUERY],
    tags: [
      SANITY_CACHE_TAGS.all,
      SANITY_CACHE_TAGS.article(slug),
      SANITY_CACHE_TAGS.type("article"),
    ],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
  if (raw == null) return null;
  return normalizeI18n(raw, lang) as DocWithSeo & {
    title?: string;
    excerpt?: string;
    date?: string;
  };
}

export async function fetchTreatmentCategorySeo(
  slug: string,
  lang: "no" | "en",
): Promise<
  | (DocWithSeo & {
      title?: string;
      description?: string;
    })
  | null
> {
  const raw = await sanityFetchCached({
    query: TREATMENT_CATEGORY_BY_SLUG_QUERY,
    params: { slug, lang },
    key: ["sanity", "treatmentCategory", slug, lang, TREATMENT_CATEGORY_BY_SLUG_QUERY],
    tags: [
      SANITY_CACHE_TAGS.all,
      SANITY_CACHE_TAGS.treatmentCategory(slug),
      SANITY_CACHE_TAGS.type("treatmentCategory"),
    ],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
  if (raw == null) return null;
  return normalizeI18n(raw, lang) as DocWithSeo & {
    title?: string;
    description?: string;
  };
}

export async function fetchTreatmentSeo(
  categorySlug: string,
  treatmentSlug: string,
  lang: "no" | "en",
): Promise<
  | (DocWithSeo & {
      title?: string;
      description?: string;
      parentCategory?: string;
    })
  | null
> {
  const raw = await sanityFetchCached({
    query: TREATMENT_BY_SLUG_QUERY,
    params: { categorySlug, treatmentSlug, lang },
    key: [
      "sanity",
      "treatment",
      categorySlug,
      treatmentSlug,
      lang,
      TREATMENT_BY_SLUG_QUERY,
    ],
    tags: [
      SANITY_CACHE_TAGS.all,
      SANITY_CACHE_TAGS.treatment(categorySlug, treatmentSlug),
      SANITY_CACHE_TAGS.type("treatment"),
    ],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
  if (raw == null) return null;
  return normalizeI18n(raw, lang) as DocWithSeo & {
    title?: string;
    description?: string;
    parentCategory?: string;
  };
}

export async function fetchThemePageSeo(
  slug: string,
  lang: "no" | "en",
): Promise<(DocWithSeo & { title?: string }) | null> {
  const raw = await sanityFetchCached({
    query: THEME_PAGE_QUERY,
    params: { slug, lang },
    key: ["sanity", "themePage", slug, lang, THEME_PAGE_QUERY],
    tags: [SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.type("themePage")],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
  if (raw == null) return null;
  return normalizeI18n(raw, lang) as DocWithSeo & { title?: string };
}

export type GuidePageDocument = DocWithSeo & {
  heroTitle?: string;
  heroSubtitle?: string;
};

export type CareersPageDocument = DocWithSeo & {
  title?: string;
  heroSubtitle?: string;
  introText?: string;
  jobSeoTitleSuffix?: string;
};

export async function fetchCareersPageDocument(
  lang: "no" | "en",
): Promise<CareersPageDocument | null> {
  const raw = await sanityFetchCached({
    query: CAREERS_PAGE_QUERY,
    params: { lang },
    key: ["sanity", "careersPage", lang, CAREERS_PAGE_QUERY],
    tags: [SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.type("careersPage")],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
  if (raw == null) return null;
  return normalizeI18n(raw, lang) as CareersPageDocument;
}

export async function fetchGuidePageDocument(
  lang: "no" | "en",
): Promise<GuidePageDocument | null> {
  const raw = await sanityFetchCached({
    query: GUIDE_PAGE_QUERY,
    params: { lang },
    key: ["sanity", "guidePage", lang, GUIDE_PAGE_QUERY],
    tags: [SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.type("guidePage")],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
  if (raw == null) return null;
  return normalizeI18n(raw, lang) as GuidePageDocument;
}
