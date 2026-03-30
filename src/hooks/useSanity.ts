import { useQuery } from "@tanstack/react-query";
import { sanityClient } from "@/lib/sanityClient";
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
} from "@/lib/queries";

// Map Sanity treatmentCategory slugs to the internal category keys used by filters
const mapSanityCategorySlug = (slug: string): string => {
  const mapping: Record<string, string> = {
    "flere-fagomrader": "annet",
  };
  return mapping[slug] || slug;
};

// Generic fetcher
const fetchSanity = <T>(query: string, params?: Record<string, any>): Promise<T> =>
  sanityClient.fetch(query, params);

// ─── Homepage ────────────────────────────────────────────────────────
export const useHomepage = () =>
  useQuery({
    queryKey: ["sanity", "homepage"],
    queryFn: async () => {
      const data = await fetchSanity<any>(HOMEPAGE_QUERY);
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
        categoryCards: (data.serviceCategories || []).map((c: any) => ({
          id: c.slug,
          title: c.title,
          path: `/${c.slug}`,
          image: c.heroImage || "",
        })),
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
        seo: data.seo,
      };
    },
    staleTime: 5 * 60 * 1000,
  });

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

export const useSpecialists = () =>
  useQuery({
    queryKey: ["sanity", "specialists"],
    queryFn: async () => {
      const data = await fetchSanity<any[]>(SPECIALISTS_QUERY);
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

export const useSpecialist = (slug: string) =>
  useQuery({
    queryKey: ["sanity", "specialist", slug],
    queryFn: async () => {
      const data = await fetchSanity<any>(SPECIALIST_BY_SLUG_QUERY, { slug });
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

// ─── Google Reviews ──────────────────────────────────────────────────
export interface SanityReview {
  _id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}

export const useGoogleReviews = () =>
  useQuery({
    queryKey: ["sanity", "googleReviews"],
    queryFn: async () => {
      const data = await fetchSanity<any[]>(GOOGLE_REVIEWS_QUERY);
      return (data || []).map((r) => ({
        ...r,
        name: r.author || "",
      })) as SanityReview[];
    },
    staleTime: 5 * 60 * 1000,
  });

export const useGoogleReviewSettings = () =>
  useQuery({
    queryKey: ["sanity", "googleReviewSettings"],
    queryFn: () =>
      fetchSanity<{
        heading: string;
        subheading: string;
        googleAverageRating: number;
        legelistenAverageRating: number;
        ctaTitle: string;
        ctaSubtitle: string;
      }>(GOOGLE_REVIEW_SETTINGS_QUERY),
    staleTime: 5 * 60 * 1000,
  });

// ─── Treatment Categories ────────────────────────────────────────────
export const useTreatmentCategories = () =>
  useQuery({
    queryKey: ["sanity", "treatmentCategories"],
    queryFn: () => fetchSanity<any[]>(TREATMENT_CATEGORIES_QUERY),
    staleTime: 5 * 60 * 1000,
  });

export const useTreatmentCategory = (slug: string) =>
  useQuery({
    queryKey: ["sanity", "treatmentCategory", slug],
    queryFn: async () => {
      const data = await fetchSanity<any>(TREATMENT_CATEGORY_BY_SLUG_QUERY, { slug });
      if (!data) return null;
      return {
        ...data,
        services: (data.treatments || []).map((t: any) => ({
          name: t.title,
          path: `/behandlinger/${data.categoryId || data.slug}/${t.slug}`,
        })),
        faqs: [],
      };
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

// ─── Treatment (sub-treatment) ───────────────────────────────────────
export const useTreatment = (categorySlug: string, treatmentSlug: string) =>
  useQuery({
    queryKey: ["sanity", "treatment", categorySlug, treatmentSlug],
    queryFn: () =>
      fetchSanity<any>(TREATMENT_BY_SLUG_QUERY, { categorySlug, treatmentSlug }),
    enabled: !!categorySlug && !!treatmentSlug,
    staleTime: 5 * 60 * 1000,
  });

// ─── About Page ──────────────────────────────────────────────────────
export const useAboutPage = () =>
  useQuery({
    queryKey: ["sanity", "aboutPage"],
    queryFn: async () => {
      const data = await fetchSanity<any>(ABOUT_PAGE_QUERY);
      if (!data) return null;
      const sections = (data.body || [])
        .filter((block: any) => block._type === "block")
        .map((block: any) => ({
          title: "",
          content: (block.children || []).map((c: any) => c.text).join(""),
        }));
      return { ...data, sections };
    },
    staleTime: 5 * 60 * 1000,
  });

// ─── Contact Page ────────────────────────────────────────────────────
export const useContactPage = () =>
  useQuery({
    queryKey: ["sanity", "contactPage"],
    queryFn: async () => {
      const data = await fetchSanity<any>(CONTACT_PAGE_QUERY);
      if (!data) return null;
      return { ...data, subtitle: data.introText || "" };
    },
    staleTime: 5 * 60 * 1000,
  });

// ─── Pricing Page ────────────────────────────────────────────────────
export const usePricingPage = () =>
  useQuery({
    queryKey: ["sanity", "pricingPage"],
    queryFn: () => fetchSanity<any>(PRICING_PAGE_QUERY),
    staleTime: 5 * 60 * 1000,
  });

// ─── Insurance Page ──────────────────────────────────────────────────
export const useInsurancePage = () =>
  useQuery({
    queryKey: ["sanity", "insurancePage"],
    queryFn: async () => {
      const data = await fetchSanity<any>(INSURANCE_PAGE_QUERY);
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

// ─── Services Page ───────────────────────────────────────────────────
export const useServicesPage = () =>
  useQuery({
    queryKey: ["sanity", "servicesPage"],
    queryFn: () => fetchSanity<any>(SERVICES_PAGE_QUERY),
    staleTime: 5 * 60 * 1000,
  });

// ─── Clinics ─────────────────────────────────────────────────────────
export const useClinics = () =>
  useQuery({
    queryKey: ["sanity", "clinics"],
    queryFn: () => fetchSanity<any[]>(CLINICS_QUERY),
    staleTime: 5 * 60 * 1000,
  });

export const useClinic = (slug: string) =>
  useQuery({
    queryKey: ["sanity", "clinic", slug],
    queryFn: () => fetchSanity<any>(CLINIC_BY_SLUG_QUERY, { slug }),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

// ─── Site Settings ───────────────────────────────────────────────────
export interface SanitySocialMedia {
  instagram?: string;
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
}

export const useSiteSettings = () =>
  useQuery({
    queryKey: ["sanity", "siteSettings"],
    queryFn: async () => {
      const data = await fetchSanity<any>(SITE_SETTINGS_QUERY);
      return data || null;
    },
    staleTime: 5 * 60 * 1000,
  });

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
}

export const useArticles = () =>
  useQuery({
    queryKey: ["sanity", "articles"],
    queryFn: async () => {
      const data = await fetchSanity<any[]>(ARTICLES_QUERY);
      return (data || []).map((a) => ({
        ...a,
        image: a.image || "",
        date: a.date || "",
        category: a.category || "Nyheter",
        excerpt: a.excerpt || "",
      })) as SanityArticle[];
    },
    staleTime: 5 * 60 * 1000,
  });

export const useArticle = (slug: string) =>
  useQuery({
    queryKey: ["sanity", "article", slug],
    queryFn: async () => {
      const data = await fetchSanity<any>(ARTICLE_BY_SLUG_QUERY, { slug });
      if (!data) return null;
      return {
        ...data,
        image: data.image || "",
        date: data.date || "",
        category: data.category || "Nyheter",
        excerpt: data.excerpt || "",
      } as SanityArticle;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

// ─── Job Listings ────────────────────────────────────────────────────
export const useJobListings = () =>
  useQuery({
    queryKey: ["sanity", "jobListings"],
    queryFn: async () => {
      const data = await fetchSanity<any[]>(JOB_LISTINGS_QUERY);
      return (data || []).map((j) => ({
        ...j,
        id: j._id,
      }));
    },
    staleTime: 5 * 60 * 1000,
  });

export const useJobListing = (slug: string) =>
  useQuery({
    queryKey: ["sanity", "jobListing", slug],
    queryFn: async () => {
      const data = await fetchSanity<any>(JOB_LISTING_BY_SLUG_QUERY, { slug });
      if (!data) return null;
      return { ...data, id: data._id };
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

// ─── FAQs ────────────────────────────────────────────────────────────
export const useFaqs = (category?: string) =>
  useQuery({
    queryKey: ["sanity", "faqs", category],
    queryFn: () =>
      fetchSanity<{ question: string; answer: string; category?: string }[]>(
        category ? FAQS_BY_CATEGORY_QUERY : FAQS_QUERY,
        category ? { category } : undefined
      ),
    staleTime: 5 * 60 * 1000,
  });

export const useFaqsByTreatmentCategory = (categorySlug?: string) =>
  useQuery({
    queryKey: ["sanity", "faqs", "treatment", categorySlug],
    queryFn: () =>
      fetchSanity<{ question: string; answer: string }[]>(
        FAQS_BY_TREATMENT_CATEGORY_QUERY,
        { slug: categorySlug }
      ),
    enabled: !!categorySlug,
    staleTime: 5 * 60 * 1000,
  });

// ─── Theme Pages (Kvinnehelse, etc.) ─────────────────────────────────
export const useThemePage = (slug: string) =>
  useQuery({
    queryKey: ["sanity", "themePage", slug],
    queryFn: () =>
      fetchSanity<{
        title: string;
        heroImage?: string;
        introTexts?: string[];
        sections?: { heading: string; paragraphs?: string[]; bulletPoints?: string[] }[];
        lifePhases?: { title: string; text: string }[];
        ctaText?: string;
        ctaLink?: string;
        seo?: { metaTitle?: string; metaDescription?: string; ogImage?: any; noIndex?: boolean };
      }>(THEME_PAGE_QUERY, { slug }),
    staleTime: 5 * 60 * 1000,
  });

// ─── Service Categories (for dropdown menu) ─────────────────────────
const CATEGORY_ORDER = [
  "gynekologi",
  "graviditet",
  "fertilitet",
  "urologi",
  "ortopedi",
  "flere",
];

export const useServiceCategoriesFromSanity = () =>
  useQuery({
    queryKey: ["sanity", "serviceCategories"],
    queryFn: async () => {
      const data = await fetchSanity<any[]>(SERVICE_CATEGORIES_DROPDOWN_QUERY);
      if (!data || data.length === 0) return null;

      const seen = new Set<string>();
      const unique = data.filter((cat) => {
        const id = cat.categoryId || cat.slug;
        if (seen.has(id)) return false;
        seen.add(id);
        return true;
      });

      const sorted = [...unique].sort((a, b) => {
        const idA = a.categoryId || a.slug;
        const idB = b.categoryId || b.slug;
        const orderA = CATEGORY_ORDER.indexOf(idA);
        const orderB = CATEGORY_ORDER.indexOf(idB);
        return (orderA === -1 ? 999 : orderA) - (orderB === -1 ? 999 : orderB);
      });

      return sorted.map((cat) => ({
        id: cat.categoryId || cat.slug,
        label: cat.title,
        path: `/${cat.categoryId || cat.slug}`,
        subcategories: (cat.treatments || []).map((t: any) => ({
          label: t.title,
          path: `/behandlinger/${cat.categoryId || cat.slug}/${t.slug}`,
          items: (t.subItems || []).map((item: any) => ({
            label: item.label,
            anchor: item.anchor || undefined,
            path: item.path || undefined,
          })),
        })),
      }));
    },
    staleTime: 5 * 60 * 1000,
  });

// ─── Specialists Page ────────────────────────────────────────────────
export const useSpecialistsPage = () =>
  useQuery({
    queryKey: ["sanity", "specialistsPage"],
    queryFn: () =>
      fetchSanity<{
        title?: string;
        subtitle?: string;
        body?: any;
        seo?: { metaTitle?: string; metaDescription?: string; ogImage?: any; noIndex?: boolean };
      }>(SPECIALISTS_PAGE_QUERY),
    staleTime: 5 * 60 * 1000,
  });

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

export const useProducts = () =>
  useQuery({
    queryKey: ["sanity", "products"],
    queryFn: async () => {
      const data = await fetchSanity<any[]>(PRODUCTS_QUERY);
      return (data || []) as SanityProduct[];
    },
    staleTime: 5 * 60 * 1000,
  });

export const useSeasonalProducts = () =>
  useQuery({
    queryKey: ["sanity", "seasonalProducts"],
    queryFn: async () => {
      const data = await fetchSanity<any[]>(SEASONAL_PRODUCTS_QUERY);
      return (data || []) as SanityProduct[];
    },
    staleTime: 5 * 60 * 1000,
  });

export const useTopRatedProducts = () =>
  useQuery({
    queryKey: ["sanity", "topRatedProducts"],
    queryFn: async () => {
      const data = await fetchSanity<any[]>(TOP_RATED_PRODUCTS_QUERY);
      return (data || []) as SanityProduct[];
    },
    staleTime: 5 * 60 * 1000,
  });

export const useProduct = (slug: string) =>
  useQuery({
    queryKey: ["sanity", "product", slug],
    queryFn: async () => {
      const data = await fetchSanity<any>(PRODUCT_BY_SLUG_QUERY, { slug });
      return data as SanityProduct | null;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

export interface SanityTestimonial {
  _id: string;
  name: string;
  age?: number;
  rating: number;
  text: string;
  location?: string;
  treatment?: string;
}

export const useTestimonials = () =>
  useQuery({
    queryKey: ["sanity", "testimonials"],
    queryFn: async () => {
      const data = await fetchSanity<SanityTestimonial[]>(TESTIMONIALS_QUERY);
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });
