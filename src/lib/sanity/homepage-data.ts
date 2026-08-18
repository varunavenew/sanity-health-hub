import { normalizeI18n } from "@/lib/sanity/normalize-i18n";
import { resolveFaqsFromCollection } from "@/lib/sanity/faq-dual-read";
import {
  resolveCmsMedia,
  type ResolvedCmsMedia,
} from "@/lib/sanity/media-dual-read";
import {
  normalizePageSections,
  type PageSectionBookingCtaConfig,
} from "@/lib/sanity/page-sections";
import { formatReviewDateLabel } from "@/lib/sanity/format-review-date";
import type { SortLocale } from "@/lib/sortAlphabetical";
import type { SanitySeoFields } from "@/lib/seo/seo-fields";
import type { Article } from "@/data/articles";
import type { HomepageSpecialistsSectionConfig, HomepageSpecialistsCategoryRef } from "@/lib/sanity/homepage-specialists";
import { resolveSpecialistsDisplayMode } from "@/lib/sanity/specialists-display-mode";

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
  /** Desktop video URL when Desktop Media Type is Video. */
  videoUrl?: string;
  /** Mobile video URL when Mobile Media Type is Video. */
  mobileVideoUrl?: string;
  desktopMediaType: "image" | "video";
  mobileMediaType: "image" | "video";
  media?: ResolvedCmsMedia | null;
  objectPosition: string;
};

export type HomepageCategoryCard = {
  id: string;
  title: string;
  path: string;
  image: string;
  imageAlt?: string;
};

/** Prefer dedicated homepage tile; fall back to legacy hero fields until CMS is filled. */
function resolveHomepageCategoryCardImage(row: Record<string, unknown>): string {
  const dedicated = asPlainString(row.homepageCardImage);
  if (dedicated) return dedicated;

  const media = resolveCmsMedia(row.heroMedia, {
    mediaType: "image",
    imageUrl: asPlainString(row.heroImage),
  });
  return (
    (media?.kind === "image" ? media.src : media?.poster) ||
    asPlainString(row.heroImage)
  );
}

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
  source: "google" | "legelisten";
};

export type HomepageReviewsSection = {
  subheading: string;
  heading: string;
  googleAverageRating: number;
  legelistenAverageRating: number;
  ctaTitle: string;
  ctaSubtitle: string;
  /** Review cards from homepage.googleReviews references in Sanity. */
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
  featuredArticles?: Article[];
  resultsStatsSection: HomepageResultsStatsSection;
  pageSections: ReturnType<typeof normalizePageSections>;
  /** Preferred dedicated Booking CTA; dual-read with pageSections band. */
  bookingCta?: unknown;
  /** Homepage-owned specialists display settings (profiles stay in Medical Content). */
  specialistsSection?: HomepageSpecialistsSectionConfig;
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

function defaultSpecialistsSeeAllHref(lang: SortLocale): string {
  return lang === "en" ? "/specialists" : "/spesialister";
}

function resolveSpecialistsSeeAllHref(link: unknown, lang: SortLocale): string {
  const fallback = defaultSpecialistsSeeAllHref(lang);
  if (!link || typeof link !== "object") return fallback;
  const row = link as { _type?: string; slug?: string };
  const slug = typeof row.slug === "string" ? row.slug.trim() : "";
  if (slug) return slug.startsWith("/") ? slug : `/${slug}`;
  if (row._type === "specialistsListingPage" || row._type === "specialistsPage") {
    return fallback;
  }
  return fallback;
}

function mapSpecialistsSection(
  raw: unknown,
  lang: SortLocale,
): HomepageSpecialistsSectionConfig | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const row = raw as Record<string, unknown>;

  // Stored value only — never invent "all" for missing/invalid displayMode.
  const mode = resolveSpecialistsDisplayMode(row.displayMode);

  const specialistsRaw = Array.isArray(row.specialists) ? row.specialists : [];
  const specialists = specialistsRaw
    .map((item) => {
      const spec = item as { slug?: string };
      return typeof spec.slug === "string" && spec.slug.trim()
        ? { slug: spec.slug.trim() }
        : null;
    })
    .filter((item): item is { slug: string } => Boolean(item));

  const categoriesRaw = Array.isArray(row.categories) ? row.categories : [];
  const categories = categoriesRaw
    .map((item) => {
      const cat = item as { categoryId?: string; slug?: string };
      const categoryId =
        typeof cat.categoryId === "string" && cat.categoryId.trim()
          ? cat.categoryId.trim()
          : undefined;
      const slug =
        typeof cat.slug === "string" && cat.slug.trim() ? cat.slug.trim() : undefined;
      if (!categoryId && !slug) return null;
      return { categoryId, slug } as HomepageSpecialistsCategoryRef;
    })
    .filter((item): item is HomepageSpecialistsCategoryRef => Boolean(item));

  const heading = asPlainString(row.heading);
  const intro = asPlainString(row.intro);
  const eyebrow = asPlainString(row.eyebrow);
  const seeAllLabel = asPlainString(row.seeAllLabel);
  const maxItems = typeof row.maxItems === "number" ? row.maxItems : undefined;
  const layout =
    row.layout === "grid" || row.layout === "carousel" ? row.layout : undefined;
  const randomizeOrder = row.randomizeOrder === true;

  const hasContent =
    eyebrow ||
    heading ||
    intro ||
    seeAllLabel ||
    typeof maxItems === "number" ||
    Boolean(layout) ||
    randomizeOrder ||
    Boolean(mode) ||
    specialists.length > 0 ||
    categories.length > 0 ||
    row.seeAllLink;

  if (!hasContent) return undefined;

  return {
    eyebrow: eyebrow || undefined,
    heading: heading || undefined,
    intro: intro || undefined,
    displayMode: mode,
    specialists: specialists.length > 0 ? specialists : undefined,
    categories: categories.length > 0 ? categories : undefined,
    seeAllLabel: seeAllLabel || undefined,
    seeAllHref: resolveSpecialistsSeeAllHref(row.seeAllLink, lang),
    maxItems,
    layout,
    randomizeOrder,
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
  bookingCta?: unknown,
): PageSectionBookingCtaConfig | undefined {
  if (bookingCta && typeof bookingCta === "object") {
    const normalized = normalizePageSections([
      { ...(bookingCta as object), _type: "pageSectionBookingCta" },
    ]);
    const fromField = normalized.find(
      (section): section is PageSectionBookingCtaConfig =>
        section._type === "pageSectionBookingCta",
    );
    if (fromField) return fromField;
  }
  return pageSections.find(
    (section): section is PageSectionBookingCtaConfig =>
      section._type === "pageSectionBookingCta",
  );
}

/**
 * Dual-read: prefer FAQ Collection questions when the collection has at least
 * one usable Q&A; otherwise keep the legacy homepage `faqs[]` item list.
 * Empty collection reference (or collection with no valid questions) falls back.
 */
export function resolveHomepageFaqs(
  faqCollection: unknown,
  legacyFaqs: unknown,
): HomepageFaq[] {
  return resolveFaqsFromCollection(faqCollection, legacyFaqs);
}

function mapHomepageReviews(
  value: unknown,
  lang: SortLocale,
): HomepageReview[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((row): HomepageReview | null => {
      if (!row || typeof row !== "object") return null;
      const item = row as Record<string, unknown>;
      const name = asPlainString(item.author);
      const text = asPlainString(item.text);
      if (!name || !text) return null;
      const rating =
        typeof item.rating === "number" && item.rating >= 1 && item.rating <= 5
          ? item.rating
          : 5;
      const date = formatReviewDateLabel(item.date, lang === "en" ? "en" : "no");
      return {
        id: asPlainString(item._id) || name,
        name,
        rating,
        text,
        date,
        source: item.source === "legelisten" ? "legelisten" : "google",
      };
    })
    .filter((row): row is HomepageReview => row != null);
}

function mapHomepageReviewsSection(
  googleAverageRating: unknown,
  legelistenAverageRating: unknown,
  subheading: unknown,
  heading: unknown,
  ctaTitle: unknown,
  ctaSubtitle: unknown,
  googleReviews: unknown,
  lang: SortLocale,
): HomepageReviewsSection {
  return {
    subheading: asPlainString(subheading),
    heading: asPlainString(heading),
    googleAverageRating:
      typeof googleAverageRating === "number" ? googleAverageRating : 4.6,
    legelistenAverageRating:
      typeof legelistenAverageRating === "number" ? legelistenAverageRating : 4.8,
    ctaTitle: asPlainString(ctaTitle),
    ctaSubtitle: asPlainString(ctaSubtitle),
    reviews: mapHomepageReviews(googleReviews, lang),
  };
}

export function mapHomepageSpecialistsSection(
  raw: unknown,
  lang: SortLocale,
): HomepageSpecialistsSectionConfig | undefined {
  return mapSpecialistsSection(raw, lang);
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
    faqs: resolveHomepageFaqs(data.faqCollection, data.faqs),
    reviewsSection: mapHomepageReviewsSection(
      data.reviewsGoogleRating,
      data.reviewsLegelistenRating,
      data.reviewsSubheading,
      data.reviewsHeading,
      data.reviewsCtaTitle,
      data.reviewsCtaSubtitle,
      data.googleReviews,
      lang,
    ),
    statsBar: statsBar.map((s) => {
      const row = s as { value?: string; label?: string };
      return { value: row.value || "", label: row.label || "" };
    }),
    heroSlides: (heroBanner?.slides || [])
      .map((slide, i) => {
        const s = slide as Record<string, unknown>;
        const mediaRow =
          s.media && typeof s.media === "object"
            ? (s.media as Record<string, unknown>)
            : undefined;
        const desktopMediaType: "image" | "video" =
          s.desktopMediaType === "video" || s.desktopMediaType === "image"
            ? s.desktopMediaType
            : mediaRow?.mediaType === "video"
              ? "video"
              : "image";
        const mobileMediaType: "image" | "video" =
          s.mobileMediaType === "video" ? "video" : "image";
        const desktopVideoUrl =
          asPlainString(s.desktopVideoUrl) || asPlainString(s.videoUrl);
        const media = resolveCmsMedia(
          desktopMediaType === "image" && mediaRow
            ? {...mediaRow, mediaType: "image"}
            : s.media,
          {
            mediaType: desktopMediaType,
            imageUrl: asPlainString(s.image),
            videoUrl: desktopMediaType === "video" ? desktopVideoUrl : undefined,
          },
        );
        const image =
          (media?.kind === "image" ? media.src : media?.poster) ||
          asPlainString(s.image);
        return {
          id: `slide-${i}`,
          label: asPlainString(s.heading),
          subtitle: asPlainString(s.subheading),
          cta: asPlainString(s.ctaText) || "Les mer",
          ctaPath: asPlainString(s.ctaLink) || "/",
          image,
          mobileImage: asPlainString(s.mobileImage) || undefined,
          videoUrl:
            desktopMediaType === "video" ? desktopVideoUrl || undefined : undefined,
          mobileVideoUrl:
            mobileMediaType === "video"
              ? asPlainString(s.mobileVideoUrl) || undefined
              : undefined,
          desktopMediaType,
          mobileMediaType,
          media,
          objectPosition: "center 30%",
        };
      })
      .filter(
        (s) =>
          (s.image || s.videoUrl || s.mobileVideoUrl || s.media) && s.label,
      ),
    categoryCards: serviceCategories
      .map((c) => {
        const row = c as Record<string, unknown> | null;
        if (!row) return null;
        const categoryId = asPlainString(row.categoryId);
        const slug = asPlainString(row.slug);
        const routeKey = categoryId || slug;
        const image = resolveHomepageCategoryCardImage(row);
        const imageAlt = asPlainString(row.homepageCardImageAlt);
        return {
          id: routeKey,
          title: asPlainString(row.title),
          // Preserve homepage.serviceCategories array order (Studio drag-and-drop).
          path: routeKey ? `/${routeKey}` : "",
          image,
          ...(imageAlt ? { imageAlt } : {}),
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
    featuredArticles: Array.isArray(data.featuredArticles)
      ? data.featuredArticles.map((a: any): Article & { id?: string } => ({
          id: asPlainString(a._id) || asPlainString(a.slug),
          slug: asPlainString(a.slug),
          title: asPlainString(a.title),
          excerpt: asPlainString(a.excerpt),
          image: asPlainString(a.image),
          date: asPlainString(a.date),
          category: asPlainString(a.category),
          externalUrl: asPlainString(a.externalUrl) || undefined,
        }))
      : undefined,
    resultsStatsSection: mapResultsStatsSection(data.resultsStatsSection, lang),
    pageSections: normalizePageSections(data.pageSections),
    bookingCta: data.bookingCta,
    specialistsSection: mapSpecialistsSection(data.specialistsSection, lang),
    seo: data.seo as SanitySeoFields | undefined,
    geoSummary: asPlainString(data.geoSummary) || undefined,
  };
}
