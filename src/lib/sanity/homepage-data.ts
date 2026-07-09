import { HOMEPAGE_QUERY } from "@/lib/queries";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";
import {
  normalizePageSections,
  type PageSectionBookingCtaConfig,
} from "@/lib/sanity/page-sections";
import type { SortLocale } from "@/lib/sortAlphabetical";
import type { SanitySeoFields } from "@/lib/seo/seo-fields";
import { sanityClient } from "@/lib/sanityClient";

function asPlainString(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  if (Array.isArray(value)) {
    const first = value[0] as { value?: unknown } | undefined;
    if (first && typeof first.value === "string") return first.value;
  }
  if (typeof value === "object" && "value" in (value as object)) {
    const inner = (value as { value: unknown }).value;
    if (typeof inner === "string") return inner;
  }
  return "";
}

export type HomepageHeroSlide = {
  id: string;
  label: string;
  subtitle: string;
  cta: string;
  ctaPath: string;
  image: string;
  mobileImage?: string;
  videoUrl?: string;
  objectPosition: string;
};

export type HomepageCategoryCard = {
  id: string;
  title: string;
  path: string;
  image: string;
};

export type HomepageFaq = {
  question: string;
  answer: string;
};

export type HomepageReview = {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
};

export type HomepageReviewsSection = {
  subheading: string;
  heading: string;
  googleAverageRating: number;
  legelistenAverageRating: number;
  ctaTitle: string;
  ctaSubtitle: string;
  reviews: HomepageReview[];
};

export type HomepagePatientTrustBanner = {
  value: string;
  label: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage?: string;
};

export type HomepageNewsSplitSection = {
  heading: string;
  description: string;
  ctaLabel: string;
  ctaPath: string;
};

export type HomepageResultStat = {
  value: string;
  label: string;
  sub?: string;
};

export type HomepageResultsStatsSection = {
  title: string;
  description?: string;
  category?: string;
  footnote?: string;
  stats: HomepageResultStat[];
};

export type HomepageData = {
  tagline?: string;
  promoBlocksTitle: string;
  faqSectionTitle?: string;
  faqs: HomepageFaq[];
  reviewsSection: HomepageReviewsSection | null;
  statsBar: { value: string; label: string }[];
  heroSlides: HomepageHeroSlide[];
  categoryCards: HomepageCategoryCard[];
  valueBadges: string[];
  promoBlocks: {
    id: string;
    title: string;
    description: string;
    cta: string;
    path: string;
    image: string;
  }[];
  patientTrustBanner: HomepagePatientTrustBanner;
  newsSplitSection: HomepageNewsSplitSection;
  resultsStatsSection: HomepageResultsStatsSection;
  pageSections: ReturnType<typeof normalizePageSections>;
  seo?: SanitySeoFields;
  geoSummary?: string;
};

export function defaultPatientTrustBanner(lang: SortLocale): HomepagePatientTrustBanner {
  return lang === "en"
    ? {
        value: "150 000 +",
        label: "Satisfied patients since 2002.",
        ctaText: "See our services",
        ctaLink: "/services",
      }
    : {
        value: "150 000 +",
        label: "Fornøyde pasienter siden 2002.",
        ctaText: "Se våre tjenester",
        ctaLink: "/tjenester",
      };
}

export function defaultNewsSplitSection(lang: SortLocale): HomepageNewsSplitSection {
  return lang === "en"
    ? {
        heading: "News and articles from CMedical",
        description:
          "Expert content, patient stories and updates from our specialists — written for you who want to understand more about your own health.",
        ctaLabel: "See all articles",
        ctaPath: "/aktuelt",
      }
    : {
        heading: "Nyheter og artikler fra CMedical",
        description:
          "Fagstoff, pasienthistorier og oppdateringer fra spesialistene våre — skrevet for deg som vil forstå mer om egen helse.",
        ctaLabel: "Se alle artikler",
        ctaPath: "/aktuelt",
      };
}

export function defaultResultsStatsSection(lang: SortLocale): HomepageResultsStatsSection {
  return lang === "en"
    ? {
        title: "Numbers that tell a story.",
        description:
          "You deserve transparency. Here are some figures that describe our everyday work — across specialties, clinics and patient encounters.",
        category: "CMedical total",
        footnote: "Figures updated Q1 2026. Results vary individually.",
        stats: [
          { value: "45 000+", label: "Consultations", sub: "Per year" },
          { value: "40+", label: "Specialists", sub: "Across disciplines" },
          { value: "98%", label: "Would recommend us", sub: "Patient survey" },
          { value: "< 3 days", label: "Waiting time", sub: "Average to first appointment" },
        ],
      }
    : {
        title: "Tall som forteller en historie.",
        description:
          "Du fortjener åpenhet. Her er noen av tallene som beskriver hverdagen vår — på tvers av spesialiteter, klinikker og pasientmøter.",
        category: "CMedical totalt",
        footnote: "Tall oppdatert per Q1 2026. Resultater varierer individuelt.",
        stats: [
          { value: "45 000+", label: "Konsultasjoner", sub: "Per år" },
          { value: "40+", label: "Spesialister", sub: "På tvers av fagfelt" },
          { value: "98%", label: "Vil anbefale oss", sub: "Pasientundersøkelse" },
          { value: "< 3 dager", label: "Ventetid", sub: "Snitt til første time" },
        ],
      };
}

function mapPatientTrustBanner(raw: unknown, lang: SortLocale): HomepagePatientTrustBanner {
  const defaults = defaultPatientTrustBanner(lang);
  if (!raw || typeof raw !== "object") return defaults;
  const row = raw as Record<string, unknown>;
  return {
    value: asPlainString(row.value) || defaults.value,
    label: asPlainString(row.label) || defaults.label,
    ctaText: asPlainString(row.ctaText) || defaults.ctaText,
    ctaLink: asPlainString(row.ctaLink) || defaults.ctaLink,
    backgroundImage: asPlainString(row.backgroundImage) || undefined,
  };
}

function mapNewsSplitSection(raw: unknown, lang: SortLocale): HomepageNewsSplitSection {
  const defaults = defaultNewsSplitSection(lang);
  if (!raw || typeof raw !== "object") return defaults;
  const row = raw as Record<string, unknown>;
  return {
    heading: asPlainString(row.heading) || defaults.heading,
    description: asPlainString(row.description) || defaults.description,
    ctaLabel: asPlainString(row.ctaLabel) || defaults.ctaLabel,
    ctaPath: asPlainString(row.ctaPath) || defaults.ctaPath,
  };
}

function mapResultsStatsSection(raw: unknown, lang: SortLocale): HomepageResultsStatsSection {
  const defaults = defaultResultsStatsSection(lang);
  if (!raw || typeof raw !== "object") return defaults;
  const row = raw as Record<string, unknown>;
  const statsRaw = Array.isArray(row.stats) ? row.stats : [];
  const stats = statsRaw
    .map((item) => {
      const stat = item as Record<string, unknown>;
      const value = asPlainString(stat.value);
      const label = asPlainString(stat.label);
      if (!value || !label) return null;
      const sub = asPlainString(stat.sub);
      return { value, label, ...(sub ? { sub } : {}) };
    })
    .filter((stat): stat is HomepageResultStat => Boolean(stat));

  return {
    title: asPlainString(row.title) || defaults.title,
    description: asPlainString(row.description) || defaults.description,
    category: asPlainString(row.category) || defaults.category,
    footnote: asPlainString(row.footnote) || defaults.footnote,
    stats: stats.length > 0 ? stats : defaults.stats,
  };
}

export function findHomepageBookingCta(
  pageSections: ReturnType<typeof normalizePageSections>,
): PageSectionBookingCtaConfig | undefined {
  return pageSections.find(
    (section): section is PageSectionBookingCtaConfig =>
      section._type === "pageSectionBookingCta",
  );
}

function mapHomepageFaqs(value: unknown): HomepageFaq[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((row) => {
      const faq = row as { question?: unknown; answer?: unknown; sortOrder?: number };
      return {
        question: asPlainString(faq.question),
        answer: asPlainString(faq.answer),
        sortOrder: typeof faq.sortOrder === "number" ? faq.sortOrder : 0,
      };
    })
    .filter((faq) => faq.question && faq.answer)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(({ question, answer }) => ({ question, answer }));
}

function formatReviewDate(value: unknown, lang: SortLocale): string {
  if (typeof value === "string" && value.trim()) {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString(lang === "en" ? "en-GB" : "nb-NO", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
    return value;
  }
  return "";
}

function mapHomepageReviews(
  rows: unknown,
  lang: SortLocale,
  googleAverageRating: unknown,
  legelistenAverageRating: unknown,
  subheading: unknown,
  heading: unknown,
  ctaTitle: unknown,
  ctaSubtitle: unknown,
): HomepageReviewsSection | null {
  if (!Array.isArray(rows)) return null;

  const reviews = rows
    .map((row) => {
      const review = row as {
        _id?: string;
        author?: string;
        rating?: number;
        text?: unknown;
        date?: unknown;
      } | null;
      if (!review?._id) return null;
      const text = asPlainString(review.text);
      const name = typeof review.author === "string" ? review.author.trim() : "";
      if (!name || !text) return null;
      return {
        id: review._id,
        name,
        rating: typeof review.rating === "number" ? review.rating : 5,
        text,
        date: formatReviewDate(review.date, lang),
      };
    })
    .filter((review): review is HomepageReview => Boolean(review));

  if (reviews.length === 0) return null;

  return {
    subheading: asPlainString(subheading),
    heading: asPlainString(heading),
    googleAverageRating:
      typeof googleAverageRating === "number" ? googleAverageRating : 4.6,
    legelistenAverageRating:
      typeof legelistenAverageRating === "number" ? legelistenAverageRating : 4.8,
    ctaTitle: asPlainString(ctaTitle),
    ctaSubtitle: asPlainString(ctaSubtitle),
    reviews,
  };
}

export function mapHomepageDocument(
  data: Record<string, unknown> | null | undefined,
  lang: SortLocale,
): HomepageData | null {
  if (!data) return null;

  const heroBanner = data.heroBanner as { slides?: unknown[] } | undefined;
  const serviceCategories = (data.serviceCategories as unknown[]) || [];
  const valueBadges = (data.valueBadges as unknown[]) || [];
  const promoBlocks = (data.promoBlocks as unknown[]) || [];
  const statsBar = (data.statsBar as unknown[]) || [];

  return {
    tagline: asPlainString(data.tagline) || undefined,
    promoBlocksTitle:
      typeof data.promoBlocksTitle === "string" ? data.promoBlocksTitle : "",
    faqSectionTitle: asPlainString(data.faqSectionTitle) || undefined,
    faqs: mapHomepageFaqs(data.faqs),
    reviewsSection: mapHomepageReviews(
      data.googleReviews,
      lang,
      data.reviewsGoogleRating,
      data.reviewsLegelistenRating,
      data.reviewsSubheading,
      data.reviewsHeading,
      data.reviewsCtaTitle,
      data.reviewsCtaSubtitle,
    ),
    statsBar: statsBar.map((s) => {
      const row = s as { value?: string; label?: string };
      return { value: row.value || "", label: row.label || "" };
    }),
    heroSlides: (heroBanner?.slides || [])
      .map((slide, i) => {
        const s = slide as Record<string, unknown>;
        return {
          id: `slide-${i}`,
          label: asPlainString(s.heading),
          subtitle: asPlainString(s.subheading),
          cta: asPlainString(s.ctaText) || "Les mer",
          ctaPath: asPlainString(s.ctaLink) || "/",
          image: asPlainString(s.image),
          mobileImage: asPlainString(s.mobileImage) || undefined,
          videoUrl: asPlainString(s.videoUrl) || undefined,
          objectPosition: "center 30%",
        };
      })
      .filter((s) => (s.image || s.videoUrl) && s.label),
    categoryCards: serviceCategories
      .map((c) => {
        const row = c as Record<string, unknown> | null;
        if (!row) return null;
        const categoryId = asPlainString(row.categoryId);
        const slug = asPlainString(row.slug);
        const routeKey = categoryId || slug;
        return {
          id: routeKey,
          title: asPlainString(row.title),
          // Preserve homepage.serviceCategories array order (Studio drag-and-drop).
          path: routeKey ? `/${routeKey}` : "",
          image: asPlainString(row.heroImage),
        };
      })
      .filter((c): c is HomepageCategoryCard => Boolean(c?.id && c?.title && c?.image)),
    valueBadges: valueBadges.map((v) => {
      if (typeof v === "string") return v;
      const row = v as { label?: string };
      return row.label || "";
    }),
    promoBlocks: promoBlocks.map((p, i) => {
      const row = p as Record<string, unknown>;
      return {
        id: `promo-${i}`,
        title: (row.title as string) || "",
        description: (row.description as string) || "",
        cta: (row.ctaText as string) || "Les mer",
        path: asPlainString(row.ctaLink) || "/",
        image: (row.image as string) || "",
      };
    }),
    patientTrustBanner: mapPatientTrustBanner(data.patientTrustBanner, lang),
    newsSplitSection: mapNewsSplitSection(data.newsSplitSection, lang),
    resultsStatsSection: mapResultsStatsSection(data.resultsStatsSection, lang),
    pageSections: normalizePageSections(data.pageSections),
    seo: data.seo as SanitySeoFields | undefined,
    geoSummary: asPlainString(data.geoSummary) || undefined,
  };
}

async function fetchHomepageRaw(
  lang: "no" | "en",
): Promise<Record<string, unknown> | null> {
  return sanityClient.fetch<Record<string, unknown> | null>(HOMEPAGE_QUERY, { lang });
}

/**
 * Server-side homepage payload for RSC + React Query hydration.
 * Always hits Sanity directly (no unstable_cache) so Vercel matches local `next dev`.
 */
export async function fetchHomepageData(
  lang: "no" | "en",
): Promise<HomepageData | null> {
  const raw = await fetchHomepageRaw(lang);
  if (!raw) return null;
  return mapHomepageDocument(normalizeI18n(raw, lang) as Record<string, unknown>, lang);
}
