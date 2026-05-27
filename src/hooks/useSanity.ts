import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { sanityClient } from "@/lib/sanityClient";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";
import { sortByLabel, sortBySlug, textForSort } from "@/lib/sortAlphabetical";
import {
  HOMEPAGE_QUERY,
  SPECIALISTS_QUERY,
  SPECIALIST_BY_SLUG_QUERY,
  GOOGLE_REVIEWS_QUERY,
  GOOGLE_REVIEW_SETTINGS_QUERY,
  TREATMENT_CATEGORIES_QUERY,
  TREATMENT_CATEGORY_BY_SLUG_QUERY,
  TREATMENT_BY_SLUG_QUERY,
  ABOUT_PAGE_QUERY,
  PRIVACY_POLICY_PAGE_QUERY,
  CONTACT_PAGE_QUERY,
  PRICING_PAGE_QUERY,
  INSURANCE_PAGE_QUERY,
  SERVICES_PAGE_QUERY,
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
  SOCIAL_POSTS_QUERY,
} from "@/lib/queries";
import { normalizePageSections } from "@/lib/sanity/page-sections";

/**
 * Map the i18next UI language code to the Sanity language key used by
 * `sanity-plugin-internationalized-array`. UI uses `nb` (Bokmål) but the
 * Studio plugin is configured with `no` for simplicity.
 */
const useSanityLang = (): "no" | "en" => {
  const { i18n } = useTranslation();
  const lang = i18n.language || "nb";
  if (lang.startsWith("en")) return "en";
  return "no";
};

// Map Sanity treatmentCategory slugs to the internal category keys used by filters
const mapSanityCategorySlug = (slug: string): string => {
  const mapping: Record<string, string> = {
    "flere-fagomrader": "annet",
  };
  return mapping[slug] || slug;
};

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
  return useQuery({
    queryKey: ["sanity", "homepage", lang],
    queryFn: async () => {
      const data = await fetchSanity<any>(HOMEPAGE_QUERY, undefined, lang);
      if (!data) return null;

      return {
        tagline: data.tagline,
        statsBar: (data.statsBar || []).map((s: any) => ({
          value: s.value,
          label: s.label,
        })),
        heroSlides: (data.heroBanner?.slides || []).map((s: any, i: number) => ({
          id: `slide-${i}`,
          label: s.heading || "",
          subtitle: s.subheading || "",
          cta: s.ctaText || "Les mer",
          ctaPath: s.ctaLink || "/",
          image: s.image || "",
          objectPosition: "center 30%",
        })),
        categoryCards: sortBySlug(
          (data.serviceCategories || []).map((c: any) => ({
            id: c.slug,
            title: c.title,
            path: `/${c.slug}`,
            image: c.heroImage || "",
          })),
          (c: { id?: string; title?: string }) => c.id || c.title,
          lang,
        ),
        valueBadges: (data.valueBadges || []).map((v: any) =>
          typeof v === "string" ? v : v.label
        ),
        promoBlocks: (data.promoBlocks || []).map((p: any, i: number) => ({
          id: `promo-${i}`,
          title: p.title,
          description: p.description,
          cta: p.ctaText || "Les mer",
          path: p.ctaLink || "/",
          image: p.image || "",
        })),
        pageSections: normalizePageSections(data.pageSections),
        seo: data.seo,
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Specialists ─────────────────────────────────────────────────────
export interface SanitySpecialist {
  _id: string;
  name: string;
  title: string;
  subtitle?: string;
  expertise: string[];
  image: string;
  category: string;
  slug: string;
  bio?: string;
  education?: string;
  experience?: string;
  languages?: string[];
  clinics?: string[];
  bookingEnabled?: boolean;
}

export const useSpecialists = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "specialists", lang],
    queryFn: async () => {
      const data = await fetchSanity<any[]>(SPECIALISTS_QUERY, undefined, lang);
      return (data || []).map((s) => ({
        ...s,
        title: s.role || "",
        subtitle: s.subtitle || "",
        expertise: s.specialties || [],
        bio: s.shortBio || "",
        category: mapSanityCategorySlug(s.categories?.[0]?.slug || ""),
        clinics: s.clinics || [],
      })) as SanitySpecialist[];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useSpecialist = (slug: string) => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "specialist", slug, lang],
    queryFn: async () => {
      const data = await fetchSanity<any>(SPECIALIST_BY_SLUG_QUERY, { slug }, lang);
      if (!data) return null;
      return {
        ...data,
        title: data.role || "",
        subtitle: data.subtitle || "",
        expertise: data.specialties || [],
        bio: data.shortBio || "",
        category: data.categories?.[0]?.slug || "",
        clinics: data.clinics || [],
      } as SanitySpecialist;
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

function formatSanityReviewDate(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value).toLocaleDateString("nb-NO");
  }
  if (value instanceof Date) return value.toLocaleDateString("nb-NO");
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
        date: formatSanityReviewDate(r.date),
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
  sortBySlug(categories, (c) => c.slug || c.title, lang).map((cat) => ({
    ...cat,
    treatments: sortBySlug(cat.treatments || [], (t: any) => t.slug || t.title, lang),
  }));

export const useTreatmentCategories = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "treatmentCategories", lang],
    queryFn: async () => {
      const data = await fetchSanity<any[]>(TREATMENT_CATEGORIES_QUERY, undefined, lang);
      return data?.length ? sortCategoryTreatments(data, lang) : data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useTreatmentCategory = (slug: string) => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "treatmentCategory", slug, lang],
    queryFn: async () => {
      const data = await fetchSanity<any>(TREATMENT_CATEGORY_BY_SLUG_QUERY, { slug }, lang);
      if (!data) return null;
      return {
        ...data,
        services: sortBySlug(data.treatments || [], (t: any) => t.slug || t.title, lang).map(
          (t: any) => ({
            name: t.title,
            path: `/behandlinger/${data.categoryId || data.slug}/${t.slug}`,
          }),
        ),
        faqs: [],
        pageSections: normalizePageSections(data.pageSections),
      };
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Treatment (sub-treatment) ───────────────────────────────────────
export const useTreatment = (categorySlug: string, treatmentSlug: string) => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "treatment", categorySlug, treatmentSlug, lang],
    queryFn: async () => {
      const data = await fetchSanity<any>(TREATMENT_BY_SLUG_QUERY, { categorySlug, treatmentSlug }, lang);
      if (!data) return null;
      return {
        ...data,
        pageSections: normalizePageSections(data.pageSections),
      };
    },
    enabled: !!categorySlug && !!treatmentSlug,
    staleTime: 5 * 60 * 1000,
  });
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
      return { ...data, title, subtitle, body, sections, pageSections: normalizePageSections(data.pageSections) };
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
        body?: unknown[];
        cookiebotKey?: string;
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
      return { ...data, title, body };
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
      return { ...data, subtitle: data.introText || "" };
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Pricing Page ────────────────────────────────────────────────────
export const usePricingPage = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "pricingPage", lang],
    queryFn: () => fetchSanity<any>(PRICING_PAGE_QUERY, undefined, lang),
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
      return {
        ...data,
        subtitle: data.introText || "",
        companies: (data.partners || []).map((p: string) => ({ name: p })),
        steps: (data.steps || []).map((s: any, i: number) => ({
          num: String(i + 1),
          title: s.title,
          desc: s.description,
        })),
        benefits: (data.benefits || []).map((b: any) => ({
          title: b.title,
          desc: b.description,
        })),
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
      const data = await fetchSanity<any>(SERVICES_PAGE_QUERY, undefined, lang);
      if (!data?.categories?.length) return data;
      return {
        ...data,
        categories: sortBySlug(data.categories, (c: any) => c.slug || c.title, lang),
      };
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Clinics ─────────────────────────────────────────────────────────
export const useClinics = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "clinics", lang],
    queryFn: async () => {
      const data = await fetchSanity<any[]>(CLINICS_QUERY, undefined, lang);
      return sortBySlug(data || [], (c) => c.slug || c.label, lang);
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useClinic = (slug: string) => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "clinic", slug, lang],
    queryFn: () => fetchSanity<any>(CLINIC_BY_SLUG_QUERY, { slug }, lang),
    enabled: !!slug,
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
  image: string;
  date: string;
  category: string;
  pinned?: boolean;
  featured?: boolean;
  body?: any[];
  videoUrl?: string;
  videoThumbnail?: string;
  videoCaption?: string;
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
        image: data.image || "",
        date: data.date || "",
        category: data.category || "Nytt fra oss",
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
      return { ...data, id: data._id };
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

// ─── FAQs ────────────────────────────────────────────────────────────
export const useFaqs = (category?: string) => {
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
      return {
        ...data,
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

      return sortBySlug(unique, (cat) => cat.slug || cat.title, lang).map((cat) => ({
        id: cat.categoryId || cat.slug,
        label: textForSort(cat.title) || cat.categoryId || cat.slug,
        path: `/${cat.categoryId || cat.slug}`,
        subcategories: sortBySlug(cat.treatments || [], (t: any) => t.slug || t.title, lang).map(
          (t: any) => ({
            label: textForSort(t.title) || t.slug,
            path: `/behandlinger/${cat.categoryId || cat.slug}/${t.slug}`,
            items: sortByLabel(t.subItems || [], (item: any) => item.label).map(
              (item: any) => ({
                label: item.label,
                anchor: item.anchor || undefined,
                path: item.path || undefined,
              }),
            ),
          }),
        ),
      }));
    },
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Specialists Page ────────────────────────────────────────────────
export const useSpecialistsPage = () => {
  const lang = useSanityLang();
  return useQuery({
    queryKey: ["sanity", "specialistsPage", lang],
    queryFn: () =>
      fetchSanity<{
        title?: string;
        subtitle?: string;
        body?: any;
        seo?: { metaTitle?: string; metaDescription?: string; ogImage?: any; noIndex?: boolean };
      }>(SPECIALISTS_PAGE_QUERY, undefined, lang),
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
  date?: string;
  likes?: number;
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
