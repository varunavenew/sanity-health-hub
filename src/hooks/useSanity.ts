"use client";

import { useQuery } from "@tanstack/react-query";
import type { Specialist } from "@/lib/sanity/specialist-types";
import { googleReviews } from "@/data/googleReviews";
import { fetchSanityGroqBrowser } from "@/lib/sanity/fetch-groq-browser";
import { useSanityContentLang } from "@/lib/sanity/content-lang";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";
import {
  mapAndSortSanitySpecialists,
  mapSanitySpecialistRow,
  type RawSanitySpecialist,
} from "@/lib/sanity/specialist-data";
import {
  dedupeBySlug,
  filterPublishedDocuments,
} from "@/lib/sanity/published-docs";
import { sortByLabel, sortBySortOrder, textForSort } from "@/lib/sortAlphabetical";
import {
  normalizeClinicRow,
  type SanityClinicBooking,
  type SanityClinicListRow,
} from "@/lib/sanity/clinic-list-row";
import { fetchTreatmentCategoryData } from "@/lib/sanity/category-data";
import { applyListingSort } from "@/lib/sanity/sort-utils";
import { LISTING_SORT_SETTINGS_QUERY } from "@/lib/queries";
import { mapHomepageDocument, mapHomepageSpecialistsSection } from "@/lib/sanity/homepage-data";
import {
  resolveBookingPageCopy,
  type BookingPageCopy,
} from "@/lib/sanity/booking-page-copy";
import { mapStep1CategoryClinicBadges } from "@/lib/sanity/booking-page-step1-clinics";
import {
  resolveContactRequestDialogCopy,
  type ContactRequestDialogCopy,
} from "@/lib/sanity/contact-request-dialog-copy";
import { fetchTreatmentData } from "@/lib/sanity/treatment-data";
import { formatReviewDateLabel } from "@/lib/sanity/format-review-date";
import { resolveFaqsFromCollection } from "@/lib/sanity/faq-dual-read";
import { useCategoryInitialData } from "@/components/providers/CategoryDataProvider";
import { useTreatmentInitialData } from "@/components/providers/TreatmentDataProvider";
import { useHomepageInitialData } from "@/components/homepage/HomepageDataProvider";
import {
  HOMEPAGE_QUERY,
  SPECIALISTS_QUERY,
  SPECIALIST_BY_SLUG_QUERY,
  GOOGLE_REVIEWS_QUERY,
  GOOGLE_REVIEW_SETTINGS_QUERY,
  TREATMENT_CATEGORIES_QUERY,
  TREATMENT_CATEGORY_BY_SLUG_QUERY,
  ABOUT_PAGE_QUERY,
  PRIVACY_POLICY_PAGE_QUERY,
  OPENNESS_ACT_PAGE_QUERY,
  CONTACT_PAGE_QUERY,
  NEWS_PAGE_QUERY,
  PRICING_PAGE_QUERY,
  BOOKING_PAGE_QUERY,
  INSURANCE_PAGE_QUERY,
  CLINICS_QUERY,
  CLINIC_BY_SLUG_QUERY,
  SITE_SETTINGS_QUERY,
  ARTICLES_QUERY,
  ARTICLE_BY_SLUG_QUERY,
  JOB_LISTINGS_QUERY,
  JOB_LISTING_BY_SLUG_QUERY,
  FAQS_QUERY,
  FAQS_BY_CATEGORY_QUERY,
  FAQS_BY_TREATMENT_CATEGORY_QUERY,
  THEME_PAGE_QUERY,
  CLINICIAN_GUIDE_PAGE_QUERY,
  SERVICE_CATEGORIES_DROPDOWN_QUERY,
  PRODUCTS_QUERY,
  SEASONAL_PRODUCTS_QUERY,
  TOP_RATED_PRODUCTS_QUERY,
  TESTIMONIALS_QUERY,
  PRODUCT_BY_SLUG_QUERY,
  SPECIALISTS_PAGE_QUERY,
  SPECIALISTS_LISTING_PAGE_QUERY,
  CAREERS_PAGE_QUERY,
  GUIDE_PAGE_QUERY,
  CLINICS_PAGE_QUERY,
  SOCIAL_POSTS_QUERY,
  CMS_ROUTE_INDEX_QUERY,
  NAV_PATHS_FOR_ROUTE_INDEX_QUERY,
} from "@/lib/queries";
import type { CmsRouteIndex } from "@/lib/routing/cms-route-types";
import { enrichRouteIndexWithNavPaths } from "@/lib/routing/enrich-route-index";
import { normalizePageSections, withPageSections, type PageSection } from "@/lib/sanity/page-sections";
import {
  parseSpecialistProfileUi,
  type SpecialistProfileUi,
} from "@/lib/sanity/specialist-profile-ui";
import {
  behandlingerCategorySegment,
  categoryLandingPath,
  resolveSpecialistPrimaryCategory,
} from "@/lib/sanity/category-keys";
import { FERTILITET_NAV_TREATMENT_SLUGS } from "@/lib/sanity/fertilitet-slug-aliases";
import { GRAVIDITET_NAV_TREATMENT_SLUGS } from "@/lib/sanity/graviditet-slug-aliases";
import {
  fetchServicesPageData,
} from "@/lib/sanity/services-page-data";

const useSanityLang = useSanityContentLang;

// Generic fetcher — auto-normalizes internationalizedArray fields.
// `lang` may be passed explicitly (3rd arg), or via params.lang, otherwise "no".
const fetchSanity = async <T>(
  query: string,
  params?: Record<string, any>,
  lang?: "no" | "en"
): Promise<T> => {
  const resolved: "no" | "en" =
    lang || (params?.lang === "en" ? "en" : "no");
  try {
    const data = await fetchSanityGroqBrowser<T>(query, {
      ...params,
      lang: resolved,
    });
    return normalizeI18n(data, resolved) as T;
  } catch (err) {
      const preview = query.replace(/\s+/g, " ").slice(0, 80);
      console.error("[Sanity] GROQ fetch failed:", preview, err);
    
    throw err;
  }
};

// ─── Homepage ────────────────────────────────────────────────────────
export const useHomepage = () => {
  const lang = useSanityLang();
  const serverInitial = useHomepageInitialData();
  const serverLangMatches = serverInitial?.lang === lang;
  const serverData = serverLangMatches ? serverInitial?.data ?? undefined : undefined;

  const query = useQuery({
    queryKey: ["sanity", "homepage", lang],
    queryFn: async () => {
      const data = await fetchSanity<Record<string, unknown>>(
        HOMEPAGE_QUERY,
        undefined,
        lang,
      );
      return mapHomepageDocument(data, lang);
    },
    initialData: serverData,
    staleTime: 0,
    /** Refetch when switching /nb ↔ /en so we never keep the other locale in cache. */
    refetchOnMount: "always",
  });

  const data = serverLangMatches ? (query.data ?? serverData) : query.data;

  return {
    ...query,
    data,
    /** False when we already have RSC/server payload, even if the client query is still idle. */
    isPending: !data && query.isPending,
  };
};

// ─── Specialists ─────────────────────────────────────────────────────
export type SanitySpecialist = Specialist & {
  _id?: string;
  bookingEnabled?: boolean;
  experience?: string;
};

function mapSanitySpecialistCategories(
  categories: Array<{
    categoryId?: string;
    slug?: string;
    title?: unknown;
    categoryNumericId?: number;
  }> | undefined,
) {
  if (!categories?.length) return [];
  return categories.map((c) => ({
    categoryId: c.categoryId || c.slug || "",
    slug: c.slug || c.categoryId || "",
    title: typeof c.title === "string" ? c.title : "",
    categoryNumericId: c.categoryNumericId,
  }));
}

function normalizeBookingCategoryIds(value: unknown): number[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id): id is number => typeof id === "number" && id > 0))].sort(
    (a, b) => a - b,
  );
}

type I18nValueItem = { language?: string; _key?: string; value?: string };

const SPECIALIST_EN_KEYWORD_MAP: Array<[string, string]> = [
  ["Gynekologisk kirurg", "Gynecological surgeon"],
  ["Fostermedisiner", "Fetal medicine specialist"],
  ["Fødselslege", "Obstetrician"],
  ["Gastrokirurg", "Gastrointestinal surgeon"],
  ["Robotkirurg", "Robotic surgeon"],
  ["Overvektskirurgi", "Obesity surgery"],
  ["Embryolog", "Embryologist"],
  ["Uroterapeut", "Urotherapist"],
  ["Urologi", "Urology"],
  ["Urolog", "Urologist"],
  ["Ortopedi", "Orthopedics"],
  ["Ortoped", "Orthopedic surgeon"],
  ["Gynekologi", "Gynecology"],
  ["Gynekolog", "Gynecologist"],
  ["Spesialist", "Specialist"],
  ["Kirurg", "Surgeon"],
  ["Fertilitet", "Fertility"],
  ["Endoskopi", "Endoscopy"],
  ["Androlog", "Andrologist"],
  ["Seksolog", "Sexologist"],
];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function translateSpecialistKeywordsForEn(value: string, lang: "no" | "en"): string {
  if (lang !== "en" || !value) return value;
  let result = value;
  const sorted = [...SPECIALIST_EN_KEYWORD_MAP].sort((a, b) => b[0].length - a[0].length);
  for (const [no, en] of sorted) {
    result = result.replace(new RegExp(`\\b${escapeRegExp(no)}\\b`, "gi"), en);
  }
  return result;
}

function readLocalizedString(value: unknown, lang: "no" | "en"): string {
  if (typeof value === "string") {
    const trimmed = value.trim();
    return lang === "en" ? translateSpecialistKeywordsForEn(trimmed, lang) : trimmed;
  }
  if (!Array.isArray(value)) return "";
  const entries = value as I18nValueItem[];
  const matchLang = entries.find((v) => (v.language || v._key) === lang)?.value;
  if (typeof matchLang === "string" && matchLang.trim()) return matchLang;
  const matchNo = entries.find((v) => (v.language || v._key) === "no")?.value;
  if (typeof matchNo === "string" && matchNo.trim()) {
    return translateSpecialistKeywordsForEn(matchNo, lang);
  }
  const first = entries[0]?.value;
  return typeof first === "string" ? translateSpecialistKeywordsForEn(first, lang) : "";
}

function readLocalizedStringArray(value: unknown, lang: "no" | "en"): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((entry) => readLocalizedString(entry, lang))
    .filter((entry): entry is string => Boolean(entry && entry.trim()));
}

export const useSpecialists = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "specialists", lang],
    queryFn: async () => {
      const [specialists, sortSettings] = await Promise.all([
        fetchSanity<RawSanitySpecialist[]>(SPECIALISTS_QUERY, undefined, lang),
        fetchSanity<any>(LISTING_SORT_SETTINGS_QUERY, undefined, lang),
      ]);
      const mapped = (specialists || [])
        .map((row) => mapSanitySpecialistRow(row, lang))
        .filter((row): row is Specialist => row !== null);
      return applyListingSort(
        mapped,
        sortSettings?.specialistsSort,
        lang,
        (s) => s.name,
        (s) => s.sortOrder,
        (s) => s._createdAt
      );
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useSpecialist = (slug: string) => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "specialist", slug, lang],
    queryFn: async () => {
      const data = await fetchSanity<RawSanitySpecialist | null>(
        SPECIALIST_BY_SLUG_QUERY,
        { slug },
        lang,
      );
      if (!data) return null;
      return mapSanitySpecialistRow(data, lang);
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Google Reviews ──────────────────────────────────────────────────
export interface SanityReview {
  _id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
  source?: "google" | "legelisten";
}

function formatSanityReviewDate(value: unknown, lang: "no" | "en"): string {
  return formatReviewDateLabel(value, lang);
}

export const useGoogleReviews = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "googleReviews", lang],
    queryFn: async () => {
      const data = await fetchSanity<any[]>(GOOGLE_REVIEWS_QUERY, undefined, lang);
      return (data || []).map((r) => {
        const name = r.author || "";
        const text = typeof r.text === "string" ? r.text : "";
        let source: "google" | "legelisten" =
          r.source === "legelisten" ? "legelisten" : "google";
        if (r.source == null) {
          const seed = googleReviews.find(
            (g) =>
              g.name === name ||
              (text && g.text.slice(0, 40) === text.slice(0, 40)),
          );
          if (seed) source = seed.source;
        }
        return {
          ...r,
          name,
          text,
          date: formatSanityReviewDate(r.date, lang),
          source,
        };
      }) as SanityReview[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useGoogleReviewSettings = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "googleReviewSettings", lang],
    queryFn: () =>
      fetchSanity<{
        heading: string;
        subheading: string;
        googleAverageRating: number;
        legelistenAverageRating: number;
        ctaTitle: string;
        ctaSubtitle: string;
      }>(GOOGLE_REVIEW_SETTINGS_QUERY, undefined, lang),
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Treatment Categories ────────────────────────────────────────────
const sortCategoryTreatments = (categories: any[], lang: "no" | "en") =>
  sortBySortOrder(categories, (c) => c.sortOrder, (c) => c.title || c.slug, lang).map((cat) => ({
    ...cat,
    treatments: sortBySortOrder(
      cat.treatments || [],
      (t: any) => t.sortOrder,
      (t: any) => t.title || t.slug,
      lang,
    ),
  }));

export const useTreatmentCategories = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "treatmentCategories", lang],
    queryFn: async () => {
      const [categories, sortSettings] = await Promise.all([
        fetchSanity<any[]>(TREATMENT_CATEGORIES_QUERY, undefined, lang),
        fetchSanity<any>(LISTING_SORT_SETTINGS_QUERY, undefined, lang),
      ]);
      if (!categories?.length) return categories;

      const sortedCategories = applyListingSort(
        categories,
        sortSettings?.categoriesSort,
        lang,
        (c) => c.title || c.slug,
        (c) => c.sortOrder,
        (c) => c._createdAt
      );

      return sortedCategories.map((cat: any) => ({
        ...cat,
        treatments: applyListingSort(
          cat.treatments || [],
          sortSettings?.treatmentsSort,
          lang,
          (t: any) => t.title || t.slug,
          (t: any) => t.sortOrder,
          (t: any) => t._createdAt
        ),
      }));
    },
    staleTime: 0,
    refetchOnMount: "always",
  });
};

export const useTreatmentCategory = (slug: string) => {
  const lang = useSanityLang();
  const serverInitial = useCategoryInitialData();
  const serverMatches =
    serverInitial?.lang === lang && serverInitial?.categorySlug === slug;
  const serverData = serverMatches ? serverInitial?.data ?? undefined : undefined;

  const query = useQuery({
    queryKey: ["sanity", "treatmentCategory", slug, lang],
    queryFn: () => fetchTreatmentCategoryData(slug, lang),
    initialData: serverData,
    enabled: !!slug,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const data = serverMatches ? (query.data ?? serverData) : query.data;

  const legacy = data
    ? {
        ...data,
        slug: data.slug ?? data.categoryId,
        services: data.treatments.map((t) => ({
          name: t.title,
          path: t.href,
        })),
        faqs: data.faqs ?? [],
        faqSectionTitle: data.faqSectionTitle,
      }
    : null;

  return {
    ...query,
    data: legacy,
    isPending: !legacy && query.isPending,
  };
};

// ─── Treatment (sub-treatment) ───────────────────────────────────────
export const useTreatment = (categorySlug: string, treatmentSlug: string) => {
  const lang = useSanityLang();
  const serverInitial = useTreatmentInitialData();
  const serverMatches =
    serverInitial?.lang === lang &&
    serverInitial?.categorySlug === categorySlug &&
    serverInitial?.treatmentSlug === treatmentSlug;
  const serverData = serverMatches ? serverInitial?.data ?? undefined : undefined;

  const query = useQuery({
    queryKey: ["sanity", "treatment", categorySlug, treatmentSlug, lang],
    queryFn: () => fetchTreatmentData(categorySlug, treatmentSlug, lang),
    initialData: serverData,
    enabled: !!categorySlug && !!treatmentSlug,
    staleTime: 0,
    refetchOnMount: "always",
  });

  const data = serverMatches ? (query.data ?? serverData) : query.data;

  return {
    ...query,
    data,
    isPending: !data && query.isPending,
  };
};

// ─── About Page ──────────────────────────────────────────────────────
export const useAboutPage = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "aboutPage", lang],
    queryFn: async () => {
      const data = await fetchSanity<any>(ABOUT_PAGE_QUERY, { lang }, lang);
      if (!data) return null;
      // Normalize array-typed leftovers if any
      const title = typeof data.title === "string" ? data.title : (data.title?.[0]?.value ?? "");
      const subtitle = typeof data.subtitle === "string" ? data.subtitle : (data.subtitle?.[0]?.value ?? "");
      const body = Array.isArray(data.body) && data.body[0]?._type === "block" ? data.body : (data.body?.[0]?.value ?? data.body);
      // Preserve Portable Text block styles (h2/h3/normal) — About renders headings from style.
      const bodyBlocks = (body || [])
        .filter((block: any) => block && block._type === "block")
        .map((block: any) => ({
          _key: block._key,
          style: typeof block.style === "string" ? block.style : "normal",
          text: (block.children || []).map((c: any) => c.text).join(""),
        }))
        .filter((block: { text: string }) => Boolean(block.text?.trim()));
      // Legacy shape kept for any callers that still expect flat paragraphs.
      const sections = bodyBlocks.map((block: { text: string }) => ({
        title: "",
        content: block.text,
      }));
      const rawSection = data.clinicsSection as
        | {
            showSection?: boolean;
            title?: string;
            clinics?: unknown[];
          }
        | undefined;
      const curatedClinics = rawSection?.clinics?.length
        ? mapClinicListRows(rawSection.clinics, lang)
        : undefined;
      const clinicsSection = rawSection
        ? {
            showSection: rawSection.showSection !== false,
            title:
              typeof rawSection.title === "string" ? rawSection.title.trim() : "",
            clinics: curatedClinics,
          }
        : undefined;

      return {
        ...data,
        title,
        subtitle,
        body,
        bodyBlocks,
        sections,
        clinicsSection,
        pageSections: normalizePageSections(data.pageSections),
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Privacy Policy Page ─────────────────────────────────────────────
export const usePrivacyPolicyPage = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "privacyPolicyPage", lang],
    queryFn: async () => {
      const data = await fetchSanity<{
        title?: string;
        slug?: string;
        body?: unknown[];
        emptyMessage?: string;
        geoSummary?: string;
        cookiebotKey?: string;
        pageSections?: unknown;
        seo?: {
          metaTitle?: string;
          metaDescription?: string;
          ogImage?: unknown;
          noIndex?: boolean;
        };
      }>(PRIVACY_POLICY_PAGE_QUERY, { lang }, lang);
      if (!data) return null;
      const title = typeof data.title === "string" ? data.title : "";
      const firstBlock = Array.isArray(data.body)
        ? (data.body[0] as { _type?: string } | undefined)
        : undefined;
      const body =
        firstBlock?._type === "block"
          ? data.body
          : Array.isArray(data.body)
            ? data.body
            : [];
      return { ...data, title, body, pageSections: normalizePageSections(data.pageSections) };
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Transparency Act Page ───────────────────────────────────────────
export const useOpennessActPage = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "opennessActPage", lang],
    queryFn: async () => {
      const data = await fetchSanity<{
        title?: string;
        breadcrumbHome?: string;
        slug?: string;
        subtitle?: string;
        body?: unknown[];
        emptyMessage?: string;
        showPracticalInfoSection?: boolean;
        geoSummary?: string;
        pageSections?: unknown;
        seo?: {
          metaTitle?: string;
          metaDescription?: string;
          ogImage?: unknown;
          noIndex?: boolean;
        };
      }>(OPENNESS_ACT_PAGE_QUERY, { lang }, lang);
      if (!data) return null;
      const title = typeof data.title === "string" ? data.title : "";
      const firstBlock = Array.isArray(data.body)
        ? (data.body[0] as { _type?: string } | undefined)
        : undefined;
      const body =
        firstBlock?._type === "block"
          ? data.body
          : Array.isArray(data.body)
            ? data.body
            : [];
      return {
        ...data,
        title,
        body,
        showPracticalInfoSection: data.showPracticalInfoSection !== false,
        pageSections: normalizePageSections(data.pageSections),
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Contact Page ────────────────────────────────────────────────────
export type ContactFormCopy = {
  title: string;
  subtitle: string;
  nameLabel: string;
  namePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  clinicLabel: string;
  clinicPlaceholder: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitButton: string;
  successTitle: string;
  successDescription: string;
  errorTitle: string;
  errorDescription: string;
};

function mapContactForm(raw: Record<string, unknown> | null | undefined): ContactFormCopy | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");
  const mapped: ContactFormCopy = {
    title: str(raw.title),
    subtitle: str(raw.subtitle),
    nameLabel: str(raw.nameLabel),
    namePlaceholder: str(raw.namePlaceholder),
    phoneLabel: str(raw.phoneLabel),
    phonePlaceholder: str(raw.phonePlaceholder),
    emailLabel: str(raw.emailLabel),
    emailPlaceholder: str(raw.emailPlaceholder),
    clinicLabel: str(raw.clinicLabel),
    clinicPlaceholder: str(raw.clinicPlaceholder),
    subjectLabel: str(raw.subjectLabel),
    subjectPlaceholder: str(raw.subjectPlaceholder),
    messageLabel: str(raw.messageLabel),
    messagePlaceholder: str(raw.messagePlaceholder),
    submitButton: str(raw.submitButton),
    successTitle: str(raw.successTitle),
    successDescription: str(raw.successDescription),
    errorTitle: str(raw.errorTitle),
    errorDescription: str(raw.errorDescription),
  };
  const hasAny = Object.values(mapped).some((v) => v.length > 0);
  return hasAny ? mapped : undefined;
}

export const useContactPage = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "contactPage", lang],
    queryFn: async () => {
      const data = await fetchSanity<any>(CONTACT_PAGE_QUERY, undefined, lang);
      if (!data) return null;
      const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");
      const ctaCards = (data.ctaCards || []).map((card: Record<string, unknown>) => ({
        ...card,
        title: str(card.title),
        description: str(card.description),
        ctaText: str(card.ctaText),
        ctaLink: str(card.ctaLink),
        icon: str(card.icon) || "Calendar",
        ctaAction: str(card.ctaAction) || "navigate",
        variant: str(card.variant) || "solid",
      }));
      const rawSection = data.clinicsSection as
        | {
            showSection?: boolean;
            title?: string;
            clinics?: unknown[];
          }
        | undefined;
      const curatedClinics = rawSection?.clinics?.length
        ? mapClinicListRows(rawSection.clinics, lang, { preserveOrder: true })
        : undefined;
      const clinicsSection = rawSection
        ? {
            showSection: rawSection.showSection !== false,
            title:
              typeof rawSection.title === "string" ? rawSection.title.trim() : "",
            clinics: curatedClinics,
          }
        : undefined;
      return {
        ...data,
        title: str(data.title),
        introText: str(data.introText),
        subtitle: str(data.introText),
        ctaCards,
        clinicsSection,
        contactForm: mapContactForm(data.contactForm),
        pageSections: normalizePageSections(data.pageSections),
        contactRequestDialog: resolveContactRequestDialogCopy(
          data as Partial<ContactRequestDialogCopy>,
        ),
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useContactRequestDialogCopy = () => {
  const { data, isLoading } = useContactPage();
  return {
    copy: data?.contactRequestDialog ?? null,
    isLoading,
  };
};

export const useNewsPage = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "newsPage", lang],
    queryFn: async () => {
      const data = await fetchSanity<any>(NEWS_PAGE_QUERY, undefined, lang);
      return withPageSections(data);
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Pricing Page ────────────────────────────────────────────────────
export const usePricingPage = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "pricingPage", lang, "src-v2"],
    queryFn: async () => {
      const data = await fetchSanity<any>(PRICING_PAGE_QUERY, undefined, lang);
      const withSections = withPageSections(data);
      const pageSections = (withSections?.pageSections ?? []).filter(
        (section: { _type?: string }) => section?._type !== "pageSectionSpecialists",
      );
      return {
        ...withSections,
        pageSections,
        faqs: resolveFaqsFromCollection(withSections?.faqCollection, withSections?.faqs),
        specialistsSection: mapHomepageSpecialistsSection(
          withSections?.specialistsSection,
          lang,
        ),
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useBookingPage = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "bookingPage", lang],
    queryFn: async () => {
      const data = await fetchSanity<
        Partial<BookingPageCopy> & {
          geoSummary?: string;
          step1CategoryClinicBadges?: unknown;
        } | null
      >(
        BOOKING_PAGE_QUERY,
        undefined,
        lang,
      );
      return {
        ...resolveBookingPageCopy(data),
        step1CategoryClinicBadges: mapStep1CategoryClinicBadges(
          data?.step1CategoryClinicBadges as Parameters<typeof mapStep1CategoryClinicBadges>[0],
        ),
        geoSummary:
          typeof data?.geoSummary === "string" ? data.geoSummary.trim() : undefined,
      } as BookingPageCopy & { geoSummary?: string };
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Insurance Page ──────────────────────────────────────────────────
export const useInsurancePage = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "insurancePage", lang],
    queryFn: async () => {
      const data = await fetchSanity<any>(INSURANCE_PAGE_QUERY, undefined, lang);
      if (!data) return null;
      const localizedPartners = (data.partnersLocalized || [])
        .map((p: any) => p?.name)
        .filter(Boolean);
      const partnerNames = localizedPartners.length > 0 ? localizedPartners : data.partners || [];
      return {
        ...data,
        subtitle: data.introText || "",
        companies: partnerNames.map((p: string) => ({ name: p })),
        steps: (data.steps || []).map((s: any, i: number) => ({
          num: String(i + 1),
          title: s.title,
          desc: s.description,
        })),
        benefits: (data.benefits || []).map((b: any) => ({
          title: b.title,
          desc: b.description,
        })),
        pageSections: normalizePageSections(data.pageSections),
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Services Page ───────────────────────────────────────────────────
export const useServicesPage = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "servicesPage", lang],
    queryFn: async () => {
      const [pageData, sortSettings] = await Promise.all([
        fetchServicesPageData(lang),
        fetchSanity<any>(LISTING_SORT_SETTINGS_QUERY, undefined, lang),
      ]);
      if (!pageData) return null;

      if (pageData.featuredCategories && pageData.featuredCategories.length > 0) {
        pageData.featuredCategories = applyListingSort(
          pageData.featuredCategories,
          sortSettings?.categoriesSort,
          lang,
          (cat) => cat.title,
          (cat) => cat.sortOrder,
          (cat) => cat._createdAt
        );
      }

      return pageData;
    },
    staleTime: 0,
    refetchOnMount: "always",
  });
};

// ─── Clinics ─────────────────────────────────────────────────────────
export type { SanityClinicBooking, SanityClinicListRow };

export function mapClinicListRows(
  rows: unknown[] | null | undefined,
  lang: "no" | "en",
  options?: { preserveOrder?: boolean },
): SanityClinicListRow[] {
  const published = filterPublishedDocuments(rows || [])
    .map((c) => normalizeClinicRow(c as Record<string, unknown>))
    .filter((c) => c.label && c.address);
  const deduped = dedupeBySlug(published);
  if (options?.preserveOrder) {
    // Keep Sanity reference-array order (Contact curated list / drag-and-drop).
    return deduped;
  }
  return sortBySortOrder(deduped, (c) => c.sortOrder, (c) => c.label, lang);
}

export const useClinics = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "clinics", lang],
    queryFn: async () => {
      const [clinics, sortSettings] = await Promise.all([
        fetchSanity<unknown[]>(CLINICS_QUERY, undefined, lang),
        fetchSanity<any>(LISTING_SORT_SETTINGS_QUERY, undefined, lang),
      ]);
      const published = filterPublishedDocuments(clinics || [])
        .map((c) => normalizeClinicRow(c as Record<string, unknown>))
        .filter((c) => c.label && c.address);
      const deduped = dedupeBySlug(published);
      return applyListingSort(
        deduped,
        sortSettings?.clinicsSort,
        lang,
        (c) => c.label,
        (c) => c.sortOrder,
        (c) => c._createdAt
      );
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useClinic = (slug: string) => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "clinic", slug, lang],
    queryFn: async (): Promise<any> => {
      const data = await fetchSanity<any>(CLINIC_BY_SLUG_QUERY, { slug }, lang);
      if (!data) return null;
      return {
        ...data,
        ...normalizeClinicRow(data as Record<string, unknown>),
        faqs: resolveFaqsFromCollection(data.faqCollection, data.faqs),
        pageSections: normalizePageSections(data.pageSections),
      };
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

// ─── CMS route index (dynamic slugs) ─────────────────────────────────
export const useCmsRouteIndex = (initialData?: CmsRouteIndex) => {
  return useQuery({
    queryKey: ["sanity", "cmsRouteIndex"],
    queryFn: async () => {
      const [index, navItems] = await Promise.all([
        fetchSanity<CmsRouteIndex>(CMS_ROUTE_INDEX_QUERY, undefined, "no"),
        fetchSanity<import("@/lib/routing/enrich-route-index").NavPathSource[]>(
          NAV_PATHS_FOR_ROUTE_INDEX_QUERY,
          undefined,
          "no",
        ),
      ]);
      return enrichRouteIndexWithNavPaths(index, navItems ?? []);
    },
    initialData,
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Site Settings ───────────────────────────────────────────────────
export interface SanitySocialMedia {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
}

export const useSiteSettings = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "siteSettings", lang],
    queryFn: async () => {
      const data = await fetchSanity<any>(SITE_SETTINGS_QUERY, undefined, lang);
      return data || null;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Articles ────────────────────────────────────────────────────────
export interface SanityArticle {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  geoSummary?: string;
  image: string;
  imageAlt?: string;
  date: string;
  category: string;
  externalUrl?: string;
  body?: any[];
  pageSections?: PageSection[];
}

export const useArticles = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "articles", lang],
    queryFn: async () => {
      const data = await fetchSanity<any[]>(ARTICLES_QUERY, { lang }, lang);
      return (data || []).map((a) => ({
        ...a,
        title: typeof a.title === "string" ? a.title : (a.title?.[0]?.value ?? ""),
        excerpt: typeof a.excerpt === "string" ? a.excerpt : (a.excerpt?.[0]?.value ?? ""),
        image: a.image || "",
        date: a.date || "",
        category: a.category || "Nytt fra oss",
      })) as SanityArticle[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useArticle = (slug: string) => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "article", slug, lang],
    queryFn: async () => {
      const data = await fetchSanity<any>(ARTICLE_BY_SLUG_QUERY, { slug, lang }, lang);
      if (!data) return null;
      return {
        ...data,
        title: typeof data.title === "string" ? data.title : (data.title?.[0]?.value ?? ""),
        excerpt: typeof data.excerpt === "string" ? data.excerpt : (data.excerpt?.[0]?.value ?? ""),
        geoSummary: typeof data.geoSummary === "string" ? data.geoSummary.trim() : "",
        image: data.image || "",
        imageAlt: typeof data.imageAlt === "string" ? data.imageAlt : "",
        date: data.date || "",
        category: data.category || "Nytt fra oss",
        pageSections: normalizePageSections(data.pageSections),
      } as SanityArticle;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Job Listings ────────────────────────────────────────────────────
export const useJobListings = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "jobListings", lang],
    queryFn: async () => {
      const data = await fetchSanity<any[]>(JOB_LISTINGS_QUERY, undefined, lang);
      return (data || []).map((j) => ({
        ...j,
        id: j._id,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useJobListing = (slug: string) => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "jobListing", slug, lang],
    queryFn: async () => {
      const data = await fetchSanity<any>(JOB_LISTING_BY_SLUG_QUERY, { slug }, lang);
      if (!data) return null;
      return { ...data, id: data._id, pageSections: normalizePageSections(data.pageSections) };
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

// ─── FAQs ────────────────────────────────────────────────────────────
export const useFaqs = (category?: string, enabled = true) => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "faqs", category, lang],
    queryFn: () =>
      fetchSanity<{ question: string; answer: string; category?: string }[]>(
        category ? FAQS_BY_CATEGORY_QUERY : FAQS_QUERY,
        category ? { category } : undefined,
        lang
      ),
    staleTime: 5 * 60 * 1000,
    enabled,
  });
};

export const useFaqsByTreatmentCategory = (categorySlug?: string) => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "faqs", "treatment", categorySlug, lang],
    queryFn: () =>
      fetchSanity<{ question: string; answer: string }[]>(
        FAQS_BY_TREATMENT_CATEGORY_QUERY,
        { slug: categorySlug },
        lang
      ),
    enabled: !!categorySlug,
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Theme Pages (Kvinnehelse, etc.) ─────────────────────────────────
export const useThemePage = (slug: string) => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "themePage", slug, lang],
    queryFn: async () => {
      const data = await fetchSanity<{
        title: string;
        geoSummary?: string;
        heroImage?: string;
        introTexts?: string[];
        sections?: { heading: string; paragraphs?: string[]; bulletPoints?: string[] }[];
        lifePhases?: { title: string; text: string }[];
        ctaText?: string;
        ctaLink?: string;
        pageSections?: unknown;
        seo?: { metaTitle?: string; metaDescription?: string; ogImage?: any; noIndex?: boolean };
      }>(THEME_PAGE_QUERY, { slug }, lang);
      if (!data) return null;

      const introTexts = Array.isArray(data.introTexts)
        ? data.introTexts
            .map((text) => (typeof text === "string" ? text.trim() : ""))
            .filter(Boolean)
        : [];

      const sections = Array.isArray(data.sections)
        ? data.sections
            .map((section) => ({
              heading: typeof section.heading === "string" ? section.heading.trim() : "",
              paragraphs: Array.isArray(section.paragraphs)
                ? section.paragraphs
                    .map((p) => (typeof p === "string" ? p.trim() : ""))
                    .filter(Boolean)
                : [],
              bulletPoints: Array.isArray(section.bulletPoints)
                ? section.bulletPoints
                    .map((p) => (typeof p === "string" ? p.trim() : ""))
                    .filter(Boolean)
                : [],
            }))
            .filter(
              (section) =>
                section.heading || section.paragraphs.length > 0 || section.bulletPoints.length > 0,
            )
        : [];

      const lifePhases = Array.isArray(data.lifePhases)
        ? data.lifePhases
            .map((phase) => ({
              title: typeof phase.title === "string" ? phase.title.trim() : "",
              text: typeof phase.text === "string" ? phase.text.trim() : "",
            }))
            .filter((phase) => phase.title && phase.text)
        : [];

      return {
        ...data,
        title: typeof data.title === "string" ? data.title.trim() : "",
        geoSummary: typeof data.geoSummary === "string" ? data.geoSummary.trim() : "",
        introTexts,
        sections,
        lifePhases,
        ctaText: typeof data.ctaText === "string" ? data.ctaText.trim() : "",
        ctaLink: typeof data.ctaLink === "string" ? data.ctaLink.trim() : "",
        pageSections: normalizePageSections(data.pageSections),
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Clinician Guide Pages (Fastlegeveiledere) ───────────────────────
export type ClinicianGuideBlock = {
  _key: string;
  _type: "guideSubheading" | "guideParagraph" | "guideList" | "guideQuote";
  level?: "h3" | "h4";
  style?: string;
  text?: string;
  source?: string;
  items?: string[];
};

export type ClinicianGuideSection = {
  _key: string;
  heading: string;
  blocks: ClinicianGuideBlock[];
};

export type ClinicianGuidePageData = {
  title: string;
  slug: string;
  subtitle?: string;
  backLinkLabel?: string;
  backLinkUrl?: string;
  introTexts: string[];
  disclaimer?: string;
  sections: ClinicianGuideSection[];
  sources: string[];
  closingNote?: string;
  ctaText?: string;
  ctaLink?: string;
  seo?: { metaTitle?: string; metaDescription?: string; ogImage?: unknown; noIndex?: boolean };
};

export const useClinicianGuidePage = (slug: string) => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "clinicianGuidePage", slug, lang],
    queryFn: async () => {
      const data = await fetchSanity<{
        title?: string;
        slug?: string;
        subtitle?: string;
        backLinkLabel?: string;
        backLinkUrl?: string;
        introTexts?: { text?: string }[];
        disclaimer?: string;
        sections?: {
          _key: string;
          heading?: string;
          blocks?: {
            _key: string;
            _type: ClinicianGuideBlock["_type"];
            level?: "h3" | "h4";
            style?: string;
            text?: string;
            source?: string;
            items?: { text?: string }[];
          }[];
        }[];
        sources?: { text?: string }[];
        closingNote?: string;
        ctaText?: string;
        ctaLink?: string;
        seo?: ClinicianGuidePageData["seo"];
      } | null>(CLINICIAN_GUIDE_PAGE_QUERY, { slug }, lang);
      if (!data) return null;

      const textList = (arr?: { text?: string }[]) =>
        (arr || [])
          .map((item) => (typeof item.text === "string" ? item.text.trim() : ""))
          .filter(Boolean);

      const sections: ClinicianGuideSection[] = (data.sections || []).map((section) => ({
        _key: section._key,
        heading: typeof section.heading === "string" ? section.heading.trim() : "",
        blocks: (section.blocks || []).map((block) => ({
          _key: block._key,
          _type: block._type,
          level: block.level,
          style: block.style,
          text: typeof block.text === "string" ? block.text : undefined,
          source: typeof block.source === "string" ? block.source : undefined,
          items: block._type === "guideList" ? textList(block.items) : undefined,
        })),
      }));

      const result: ClinicianGuidePageData = {
        title: typeof data.title === "string" ? data.title.trim() : "",
        slug: typeof data.slug === "string" ? data.slug : slug,
        subtitle: typeof data.subtitle === "string" ? data.subtitle.trim() : "",
        backLinkLabel: typeof data.backLinkLabel === "string" ? data.backLinkLabel.trim() : "",
        backLinkUrl: typeof data.backLinkUrl === "string" ? data.backLinkUrl.trim() : "",
        introTexts: textList(data.introTexts),
        disclaimer: typeof data.disclaimer === "string" ? data.disclaimer.trim() : "",
        sections,
        sources: textList(data.sources),
        closingNote: typeof data.closingNote === "string" ? data.closingNote.trim() : "",
        ctaText: typeof data.ctaText === "string" ? data.ctaText.trim() : "",
        ctaLink: typeof data.ctaLink === "string" ? data.ctaLink.trim() : "",
        seo: data.seo,
      };
      return result;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Service Categories (for dropdown menu) ─────────────────────────
export const useServiceCategoriesFromSanity = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "serviceCategories", lang, "nav-v2"],
    queryFn: async () => {
      const [data, sortSettings] = await Promise.all([
        fetchSanity<any[]>(SERVICE_CATEGORIES_DROPDOWN_QUERY, undefined, lang),
        fetchSanity<any>(LISTING_SORT_SETTINGS_QUERY, undefined, lang),
      ]);
      if (!data || data.length === 0) return null;

      const seen = new Set<string>();
      const unique = data.filter((cat) => {
        const id =
          typeof cat.categoryId === "string" ? cat.categoryId.trim() : "";
        if (!id) return false;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });

      const sortedCategories = applyListingSort(
        unique,
        sortSettings?.categoriesSort,
        lang,
        (cat) => cat.title || cat.slug,
        (cat) => cat.sortOrder,
        (cat) => cat._createdAt
      );

      return sortedCategories
        .map((cat) => {
          const categoryId =
            typeof cat.categoryId === "string" ? cat.categoryId.trim() : "";
          const label =
            textForSort(cat.title, lang) || categoryId || cat.slug || "";
          if (!categoryId || !label) return null;

          // Drop null join slots + draft treatments before sort/map (never crash).
          const explicitTreatments = (cat.treatments || []).filter(
            (t: any) =>
              Boolean(t) &&
              typeof t._id === "string" &&
              !t._id.startsWith("drafts."),
          );
          const linkedFallback = (cat.linkedTreatmentsFallback || []).filter(
            (t: any) =>
              Boolean(t) &&
              typeof t._id === "string" &&
              !t._id.startsWith("drafts."),
          );
          const categoryTeamTreatments = (cat.categoryTeamTreatments || []).filter(
            (t: any) =>
              Boolean(t) &&
              typeof t._id === "string" &&
              !t._id.startsWith("drafts."),
          );
          const seenTreatmentIds = new Set(
            explicitTreatments.map((t: { _id: string }) => t._id),
          );
          const treatments = [
            ...explicitTreatments,
            ...linkedFallback.filter(
              (t: { _id: string }) => !seenTreatmentIds.has(t._id),
            ),
            ...categoryTeamTreatments.filter((t: { _id: string }) => {
              if (seenTreatmentIds.has(t._id)) return false;
              seenTreatmentIds.add(t._id);
              return true;
            }),
          ];

          const mapped = applyListingSort(
            treatments,
            sortSettings?.treatmentsSort,
            lang,
            (t: any) => t.title || t.slug,
            (t: any) => t.sortOrder,
            (t: any) => t._createdAt
          )
            .map((t: any) => {
              const slug = typeof t.slug === "string" ? t.slug.trim() : "";
              const treatmentLabel =
                textForSort(t.title, lang) || slug || "";
              if (!slug || !treatmentLabel) return null;
              if (t.pageRole === "team") return null;
              if (slug === "new-treatment" || treatmentLabel.toLowerCase() === "new treatment") {
                return null;
              }
              return {
                id: slug,
                label: treatmentLabel,
                path: `/${behandlingerCategorySegment(
                  categoryId,
                  lang,
                )}/${slug}`,
                items: sortByLabel(t.subItems || [], (item: any) => item.label)
                  .map((item: any) => ({
                    label:
                      typeof item.label === "string" ? item.label.trim() : "",
                    anchor: item.anchor || undefined,
                    path: item.path || undefined,
                  }))
                  .filter((item) => item.label.length > 0),
              };
            })
            .filter(
              (sub): sub is NonNullable<typeof sub> => sub !== null,
            );

          const subcategories =
            categoryId === "fertilitet"
              ? FERTILITET_NAV_TREATMENT_SLUGS.map((slug) =>
                  mapped.find((item) => item.id === slug),
                ).filter((item): item is NonNullable<typeof item> => Boolean(item))
              : categoryId === "graviditet"
                ? GRAVIDITET_NAV_TREATMENT_SLUGS.map((slug) =>
                    mapped.find((item) => item.id === slug),
                  ).filter((item): item is NonNullable<typeof item> => Boolean(item))
              : mapped;

          return {
            id: categoryId,
            label,
            path: categoryLandingPath(categoryId, lang),
            subcategories,
          };
        })
        .filter((cat): cat is NonNullable<typeof cat> => cat !== null);
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Clinics listing page ────────────────────────────────────────────
export const useClinicsPage = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "clinicsPage", lang],
    queryFn: async () => {
      const data = await fetchSanity<{
        heroEyebrow?: string;
        heroTitle?: string;
        heroDescription?: string;
        heroImage?: string;
        primaryCtaLabel?: string;
        primaryCtaPath?: string;
        secondaryCtaLabel?: string;
        secondaryCtaPath?: string;
        seo?: { metaTitle?: string; metaDescription?: string; ogImage?: unknown; noIndex?: boolean };
        geoSummary?: string;
        pageSections?: unknown;
      }>(CLINICS_PAGE_QUERY, undefined, lang);
      return withPageSections(data);
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useGuidePage = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "guidePage", lang],
    queryFn: async () => {
      const data = await fetchSanity<{
        breadcrumbHome?: string;
        heroTitle?: string;
        heroSubtitle?: string;
        heroMedia?: unknown;
        primaryCtaLabel?: string;
        primaryCtaPath?: string;
        categoriesIntroTitle?: string;
        categoriesIntroDescription?: string;
        guideSections?: Array<{
          _key?: string;
          title?: string;
          description?: unknown;
          image?: string;
        }>;
        seo?: { metaTitle?: string; metaDescription?: string; ogImage?: unknown; noIndex?: boolean };
        geoSummary?: string;
        pageSections?: unknown;
      }>(GUIDE_PAGE_QUERY, undefined, lang);
      return withPageSections(data);
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCareersPage = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "careersPage", lang],
    queryFn: async () => withPageSections(await fetchSanity<any>(CAREERS_PAGE_QUERY, undefined, lang)),
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Specialists listing page (/spesialister) ────────────────────────
export const useSpecialistsListingPage = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "specialistsListingPage", lang],
    queryFn: async () => {
      const raw = await fetchSanity<{
        heroEyebrow?: string;
        heroTitle?: string;
        heroDescription?: string;
        countLabel?: string;
        geoSummary?: string;
        profileUi?: Partial<SpecialistProfileUi>;
        seo?: { metaTitle?: string; metaDescription?: string; ogImage?: unknown; noIndex?: boolean };
        pageSections?: unknown;
      }>(SPECIALISTS_LISTING_PAGE_QUERY, undefined, lang);
      return withPageSections({
        ...raw,
        profileUi: parseSpecialistProfileUi(raw.profileUi, lang),
      });
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ─── About specialists page (/om-spesialister) ───────────────────────
export const useSpecialistsPage = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "specialistsPage", lang],
    queryFn: async () =>
      withPageSections(
        await fetchSanity<{
          heroEyebrow?: string;
          title?: string;
          subtitle?: string;
          slugNb?: string;
          slugEn?: string;
          geoSummary?: string;
          body?: any;
          seo?: { metaTitle?: string; metaDescription?: string; ogImage?: any; noIndex?: boolean };
          pageSections?: unknown;
        }>(SPECIALISTS_PAGE_QUERY, undefined, lang),
      ),
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Products ────────────────────────────────────────────────────────
export interface SanityProduct {
  _id: string;
  name: string;
  slug: string;
  category: string;
  price: string;
  rating: number;
  image: string;
  tags: string[];
  intent: string;
  description: string;
  benefits?: string[];
  results?: string;
  howItWorks?: string;
  isSeasonal?: boolean;
  seasonalOrder?: number;
}

export const useProducts = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "products", lang],
    queryFn: async () => {
      const data = await fetchSanity<any[]>(PRODUCTS_QUERY, undefined, lang);
      return (data || []) as SanityProduct[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useSeasonalProducts = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "seasonalProducts", lang],
    queryFn: async () => {
      const data = await fetchSanity<any[]>(SEASONAL_PRODUCTS_QUERY, undefined, lang);
      return (data || []) as SanityProduct[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useTopRatedProducts = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "topRatedProducts", lang],
    queryFn: async () => {
      const data = await fetchSanity<any[]>(TOP_RATED_PRODUCTS_QUERY, undefined, lang);
      return (data || []) as SanityProduct[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useProduct = (slug: string) => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "product", slug, lang],
    queryFn: async () => {
      const data = await fetchSanity<any>(PRODUCT_BY_SLUG_QUERY, { slug }, lang);
      return data as SanityProduct | null;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

export interface SanityTestimonial {
  _id: string;
  name: string;
  age?: number;
  rating: number;
  text: string;
  location?: string;
  treatment?: string;
}

export const useTestimonials = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "testimonials", lang],
    queryFn: async () => {
      const data = await fetchSanity<SanityTestimonial[]>(TESTIMONIALS_QUERY, undefined, lang);
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Social Posts ────────────────────────────────────────────────────
export interface SanitySocialPost {
  _id: string;
  platform: "instagram" | "linkedin" | "facebook" | "youtube";
  image: string;
  caption?: string;
  postUrl?: string;
  alt?: string;
  sortOrder?: number;
}

export const useSocialPosts = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "socialPosts", lang],
    queryFn: async () => {
      const data = await fetchSanity<SanitySocialPost[]>(SOCIAL_POSTS_QUERY, undefined, lang);
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};
