import { HOMEPAGE_QUERY } from "@/lib/queries";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";
import { normalizePageSections } from "@/lib/sanity/page-sections";
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
  pageSections: ReturnType<typeof normalizePageSections>;
  seo?: SanitySeoFields;
  geoSummary?: string;
};

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
          objectPosition: "center 30%",
        };
      })
      .filter((s) => s.image && s.label),
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
