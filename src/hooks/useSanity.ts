"use client";

import { useQuery } from "@tanstack/react-query";
import type { Specialist } from "@/lib/sanity/specialist-types";
import { sanityClient } from "@/lib/sanityClient";
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
import { sortByLabel, sortBySortOrder, textForSort, parseSortOrder } from "@/lib/sortAlphabetical";
import { fetchTreatmentCategoryData } from "@/lib/sanity/category-data";
import { mapHomepageDocument } from "@/lib/sanity/homepage-data";
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
    const data = await sanityClient.fetch<T>(query, {
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
      const data = await fetchSanity<RawSanitySpecialist[]>(SPECIALISTS_QUERY, undefined, lang);
      return mapAndSortSanitySpecialists(data, lang);
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
}

function formatSanityReviewDate(value: unknown, lang: "no" | "en"): string {
  if (value == null) return "";
  const locale = lang === "en" ? "en-GB" : "nb-NO";
  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return value;
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value).toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  if (value instanceof Date) {
    return value.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  return String(value);
}

export const useGoogleReviews = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "googleReviews", lang],
    queryFn: async () => {
      const data = await fetchSanity<any[]>(GOOGLE_REVIEWS_QUERY, undefined, lang);
      return (data || []).map((r) => ({
        ...r,
        name: r.author || "",
        text: typeof r.text === "string" ? r.text : "",
        date: formatSanityReviewDate(r.date, lang),
      })) as SanityReview[];
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
      const data = await fetchSanity<any[]>(TREATMENT_CATEGORIES_QUERY, undefined, lang);
      return data?.length ? sortCategoryTreatments(data, lang) : data;
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
        faqs: [] as { question: string; answer: string }[],
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
      const sections = (body || [])
        .filter((block: any) => block && block._type === "block")
        .map((block: any) => ({
          title: "",
          content: (block.children || []).map((c: any) => c.text).join(""),
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
        loadingLabel?: string;
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

// ─── Contact Page ────────────────────────────────────────────────────
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
      return {
        ...data,
        title: str(data.title),
        introText: str(data.introText),
        subtitle: str(data.introText),
        ctaCards,
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
    queryKey: ["sanity", "pricingPage", lang],
    queryFn: async () => {
      const data = await fetchSanity<any>(PRICING_PAGE_QUERY, undefined, lang);
      return withPageSections(data);
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
      const data = await fetchServicesPageData(lang);
      return data;
    },
    staleTime: 0,
    refetchOnMount: "always",
  });
};

// ─── Clinics ─────────────────────────────────────────────────────────
import type { ClinicLocation } from "@/lib/maps/clinic-location";
import { clinicMapsUrl } from "@/lib/maps/clinic-location";

export type SanityClinicBooking = {
  method?: "info" | "pasientsky" | "metodika" | "closed";
  serviceProviderId?: string;
  metodikaLocationId?: number;
  externalBookingUrl?: string;
};

export type SanityClinicListRow = {
  id: string;
  slug: string;
  label: string;
  address: string;
  phone?: string;
  hours?: string;
  sortOrder?: number;
  primaryImage?: string;
  locationSearch?: ClinicLocation;
  mapsUrl?: string;
  services?: string[];
  booking?: SanityClinicBooking;
};

function normalizeClinicRow(c: Record<string, unknown>): SanityClinicListRow {
  const label =
    typeof c.label === "string"
      ? c.label
      : typeof c.title === "string"
        ? c.title
        : "";
  const locationSearch = c.locationSearch as ClinicLocation | undefined;
  const address = typeof c.address === "string" ? c.address : "";
  const bookingRaw = c.booking as Record<string, unknown> | undefined;
  const booking =
    bookingRaw && typeof bookingRaw === "object"
      ? {
          method: bookingRaw.method as SanityClinicBooking["method"] | undefined,
          serviceProviderId:
            typeof bookingRaw.serviceProviderId === "string"
              ? bookingRaw.serviceProviderId
              : undefined,
          metodikaLocationId:
            typeof bookingRaw.metodikaLocationId === "number"
              ? bookingRaw.metodikaLocationId
              : undefined,
          externalBookingUrl:
            typeof bookingRaw.externalBookingUrl === "string"
              ? bookingRaw.externalBookingUrl
              : undefined,
        }
      : undefined;
  const services = Array.isArray(c.services)
    ? c.services.filter((item): item is string => typeof item === "string")
    : undefined;
  const primaryImage =
    typeof c.primaryImage === "string" && c.primaryImage.trim()
      ? c.primaryImage.trim()
      : undefined;
  return {
    label: label.trim(),
    slug: (c.slug as string) || (c.id as string) || "",
    id: (c.id as string) || (c.slug as string) || "",
    address,
    phone: typeof c.phone === "string" ? c.phone : undefined,
    hours: typeof c.hours === "string" ? c.hours : undefined,
    sortOrder: parseSortOrder(c.sortOrder) ?? undefined,
    primaryImage,
    locationSearch,
    mapsUrl: clinicMapsUrl(locationSearch, address),
    services,
    booking,
  };
}

export function mapClinicListRows(
  rows: unknown[] | null | undefined,
  lang: "no" | "en",
): SanityClinicListRow[] {
  const published = filterPublishedDocuments(rows || [])
    .map((c) => normalizeClinicRow(c as Record<string, unknown>))
    .filter((c) => c.label && c.address);
  return sortBySortOrder(dedupeBySlug(published), (c) => c.sortOrder, (c) => c.label, lang);
}

export const useClinics = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "clinics", lang],
    queryFn: async () => {
      const data = await fetchSanity<unknown[]>(CLINICS_QUERY, undefined, lang);
      return mapClinicListRows(data, lang);
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
      return { ...data, ...normalizeClinicRow(data as Record<string, unknown>), pageSections: normalizePageSections(data.pageSections) };
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

// ─── Service Categories (for dropdown menu) ─────────────────────────
export const useServiceCategoriesFromSanity = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "serviceCategories", lang],
    queryFn: async () => {
      const data = await fetchSanity<any[]>(SERVICE_CATEGORIES_DROPDOWN_QUERY, undefined, lang);
      if (!data || data.length === 0) return null;

      const seen = new Set<string>();
      const unique = data.filter((cat) => {
        const id = cat.categoryId || cat.slug;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });

      return sortBySortOrder(unique, (cat) => cat.sortOrder, (cat) => cat.title || cat.slug, lang).map((cat) => ({
        id: cat.categoryId || cat.slug,
        label: textForSort(cat.title, lang) || cat.categoryId || cat.slug,
        path: categoryLandingPath(cat.categoryId || cat.slug, lang),
        subcategories: sortBySortOrder(
          cat.treatments || [],
          (t: any) => t.sortOrder,
          (t: any) => t.title || t.slug,
          lang,
        ).map((t: any) => ({
          id: t.slug,
          label: textForSort(t.title, lang) || t.slug,
          path: `/behandlinger/${behandlingerCategorySegment(
            cat.categoryId || cat.slug,
            lang,
          )}/${t.slug}`,
          items: sortByLabel(t.subItems || [], (item: any) => item.label)
            .map((item: any) => ({
              label: typeof item.label === "string" ? item.label.trim() : "",
              anchor: item.anchor || undefined,
              path: item.path || undefined,
            }))
            .filter((item) => item.label.length > 0),
        })),
      }));
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
        heroTitle?: string;
        heroSubtitle?: string;
        showCategorySections?: boolean;
        ctaTitle?: string;
        ctaSubtitle?: string;
        ctaButtonLabel?: string;
        ctaButtonPath?: string;
        categories?: Array<{
          title?: string;
          slug?: string;
          description?: string;
          heroImage?: string;
          treatments?: Array<{ title?: string }>;
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
