import { TREATMENT_BY_SLUG_QUERY } from "@/lib/queries";
import {
  categorySlugForFetch,
  FLERE_FAGOMRADER_CATEGORY_ID,
  normalizeCategoryRouteKey,
} from "@/lib/sanity/category-keys";
import { resolveFaqsFromCollection } from "@/lib/sanity/faq-dual-read";
import { resolveFertilitetTreatmentSlug } from "@/lib/sanity/fertilitet-slug-aliases";
import { gynekologiTreatmentSlugCandidates } from "@/lib/sanity/gynekologi-slug-aliases";
import { resolveGraviditetTreatmentSlug } from "@/lib/sanity/graviditet-slug-aliases";
import { urologiTreatmentSlugCandidates } from "@/lib/sanity/urologi-slug-aliases";
import { ortopediTreatmentSlugCandidates } from "@/lib/sanity/ortopedi-slug-aliases";
import { flereFagomraderTreatmentSlugCandidates } from "@/lib/sanity/flere-fagomrader-slug-aliases";
import { normalizeI18nStrict } from "@/lib/sanity/normalize-i18n";
import { normalizePageSections } from "@/lib/sanity/page-sections";
import { fetchSanityGroqBrowser } from "@/lib/sanity/fetch-groq-browser";
import { isRelatedServiceEligible } from "@/lib/sanity/treatment-page-role";
import { formatReviewDateLabel } from "@/lib/sanity/format-review-date";

function asPlainString(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  if (Array.isArray(value)) {
    const first = value[0] as { value?: unknown } | undefined;
    if (first && typeof first.value === "string") return first.value;
    if (value[0] && typeof value[0] === "object" && "_type" in (value[0] as object)) {
      return (value as { children?: { text?: string }[] }[])
        .map((block) =>
          (block.children || []).map((c) => c.text || "").join(""),
        )
        .join("\n");
    }
    if (typeof first === "string") return first;
    if (first && typeof first === "object" && "value" in first) {
      const inner = (first as { value: unknown }).value;
      if (typeof inner === "string") return inner;
    }
  }
  if (typeof value === "object" && "value" in (value as object)) {
    const inner = (value as { value: unknown }).value;
    if (typeof inner === "string") return inner;
  }
  return "";
}

function pathSlug(path: string): string {
  return path.split("/").filter(Boolean).pop() || "";
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => asPlainString(v)).filter(Boolean);
}

function mapTreatmentReviews(
  value: unknown,
  lang: "no" | "en" = "no",
): TreatmentReview[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((row): TreatmentReview | null => {
      if (!row || typeof row !== "object") return null;
      const item = row as Record<string, unknown>;
      const name = asPlainString(item.author);
      const text = asPlainString(item.text);
      if (!name || !text) return null;
      const rating =
        typeof item.rating === "number" && item.rating >= 1 && item.rating <= 5
          ? item.rating
          : 5;
      const date = formatReviewDateLabel(item.date, lang) || undefined;
      return {
        id: asPlainString(item._id) || name,
        name,
        text,
        rating,
        date,
        source: item.source === "legelisten" ? "legelisten" : "google",
      };
    })
    .filter((row): row is TreatmentReview => row != null);
}

export type TreatmentSection = {
  id: string;
  heading: string;
  content: string;
};

export type TreatmentReview = {
  id: string;
  name: string;
  rating: number;
  text: string;
  date?: string;
  source: "google" | "legelisten";
};

export type TreatmentData = {
  title: string;
  subtitle?: string;
  description: string;
  heroImage?: string;
  heroImageAlt?: string;
  heroMedia?: unknown;
  parentCategory?: string;
  parentSlug?: string;
  categoryNumericId?: number;
  faqSectionTitle?: string;
  faqs?: { question: string; answer: string }[];
  // Layout fields (formerly nested under layout{})
  homeBreadcrumbLabel?: string;
  srOnlyTitle?: string;
  themesAriaLabel?: string;
  seePricesLabel?: string;
  seePricesHref?: string;
  callCtaLabel?: string;
  expertReadMoreLabel?: string;
  scrollLeftLabel?: string;
  scrollRightLabel?: string;
  insuranceEyebrow?: string;
  insuranceTitle?: string;
  insurancePartners?: { key: string; label: string }[];
  eyebrow?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroPoints?: { title: string; desc: string }[];
  heroThemes?: string[];
  heroAvailability?: string;
  heroPrice?: string;
  heroPriceLabel?: string;
  hideSeePriser?: boolean;
  heroVideo?: string;
  rating?: string;
  primaryCtaLabel?: string;
  bookingService?: string;
  flowEyebrow?: string;
  flowTitle?: string;
  flowImage?: string;
  flowImageAlt?: string;
  flowLinkLabel?: string;
  flowLinkHref?: string;
  flow?: { n: string; title: string; desc: string }[];
  reasonsEyebrow?: string;
  reasonsTitle?: string;
  reasonsLead?: string;
  reasonsLead2?: string;
  reasonsLayout?: "prose" | "accordion" | "auto";
  reasons?: { n: string; title: string; desc: string }[];
  promises?: { eyebrow: string; title: string; desc: string; image?: string; imageAlt?: string }[];
  expertAreas?: {
    title?: string;
    description?: string;
    items: { title: string; desc: string; path: string; image?: string; imageAlt?: string }[];
  };
  textSection?: {
    title?: string;
    lead?: string;
    points?: { n: string; title: string; desc: string }[];
    image?: string;
    imageAlt?: string;
  };
  relatedSection?: {
    eyebrow?: string;
    title?: string;
    lead?: string;
    asIntro?: boolean;
    asServices?: boolean;
    seeAllHref?: string;
    seeAllLabel?: string;
    items?: { eyebrow?: string; title: string; desc: string; path: string; image?: string; imageAlt?: string }[];
  };
  relatedEyebrow?: string;
  relatedTitle?: string;
  relatedLead?: string;
  relatedAsIntro?: boolean;
  relatedAsServices?: boolean;
  relatedSeeAllHref?: string;
  relatedSeeAllLabel?: string;
  ctaTitle?: string;
  ctaDescription?: string;
  conversationCtaTitle?: string;
  midCtaPrimaryLabel?: string;
  midCtaCallLabel?: string;
  midCtaShowCallButton?: boolean;
  reviewsSectionTitle?: string;
  googleReviews?: TreatmentReview[];
  legelistenReviews?: TreatmentReview[];
  specialistTitle?: string;
  specialistDescription?: string;
  specialistCtaLabel?: string;
  specialistCtaHref?: string;
  relatedSpecialistSlugs?: string[];
  related?: { eyebrow?: string; title: string; desc: string; path: string; image?: string; imageAlt?: string }[];
  pageSections: ReturnType<typeof normalizePageSections>;
  /** Locale-specific slug from CMS (for canonical redirects). */
  canonicalSlug?: string;
  /** `team` pages redirect to the specialists listing (reference parity). */
  pageRole?: string;
  geoSummary?: string;
  seo?: Record<string, unknown>;
};

export function mapTreatmentDocument(
  data: Record<string, unknown> | null | undefined,
  lang: "no" | "en" = "no",
): TreatmentData | null {
  if (!data) return null;

  const row = (key: string) => asPlainString(data[key]) || undefined;
  const mapPoints = (items: unknown, keys: { title: string; desc: string }) =>
    ((items as unknown[]) || [])
      .map((item) => {
        const r = item as Record<string, unknown>;
        return {
          title: asPlainString(r[keys.title]),
          desc: asPlainString(r[keys.desc]),
        };
      })
      .filter((p) => p.title || p.desc);

  const relatedSpecialists = (data.relatedSpecialists as unknown[]) || [];
  const relatedSpecialistSlugs = relatedSpecialists
    .map((r) => asPlainString((r as Record<string, unknown>).slug))
    .filter(Boolean);

  const related = (() => {
    const rs = data.relatedSection as Record<string, unknown> | undefined;
    return ((rs?.items as unknown[]) || [])
      .filter(Boolean)
      .map((item) => {
        const r = item as Record<string, unknown>;
        return {
          pageRole: asPlainString(r.pageRole) || undefined,
          eyebrow: asPlainString(r.eyebrow),
          title: asPlainString(r.title),
          desc: asPlainString(r.desc),
          path: asPlainString(r.path),
          image: asPlainString(r.image) || undefined,
          imageAlt:
            asPlainString(r.imageAlt) ||
            asPlainString(r.heroImageAlt) ||
            undefined,
        };
      })
      .filter((r) => r.title && r.path && isRelatedServiceEligible(r.pageRole));
  })();

  const relatedImageBySlug = new Map(
    related
      .filter((item) => item.image)
      .map((item) => [pathSlug(item.path), item.image!] as const)
      .filter(([slug]) => Boolean(slug)),
  );

  return {
    title: asPlainString(data.title),
    subtitle: row("subtitle"),
    description: asPlainString(data.description),
    geoSummary: row("geoSummary"),
    heroImage: row("heroImage"),
    heroImageAlt: row("heroImageAlt"),
    heroMedia: data.heroMedia,
    parentCategory: row("parentCategory"),
    parentSlug: row("parentSlug"),
    categoryNumericId:
      typeof data.categoryNumericId === "number" ? data.categoryNumericId : undefined,
    faqSectionTitle: row("faqSectionTitle"),
    faqs: resolveFaqsFromCollection(data.faqCollection, data.faqs),
    // Flat layout fields
    homeBreadcrumbLabel: row("homeBreadcrumbLabel"),
    srOnlyTitle: row("srOnlyTitle"),
    themesAriaLabel: row("themesAriaLabel"),
    seePricesLabel: row("seePricesLabel"),
    seePricesHref: row("seePricesHref"),
    callCtaLabel: row("callCtaLabel"),
    expertReadMoreLabel: row("expertReadMoreLabel"),
    scrollLeftLabel: row("scrollLeftLabel"),
    scrollRightLabel: row("scrollRightLabel"),
    insuranceEyebrow: row("insuranceEyebrow"),
    insuranceTitle: row("insuranceTitle"),
    insurancePartners: (() => {
      const partners = ((data.insurancePartners as unknown[]) || [])
        .filter(Boolean)
        .map((item) => {
          const r = item as Record<string, unknown>;
          return { key: asPlainString(r.key), label: asPlainString(r.label) };
        })
        .filter((item) => item.key && item.label);
      return partners.length > 0 ? partners : undefined;
    })(),
    eyebrow: row("eyebrow"),
    heroTitle: row("heroTitle"),
    heroDescription: row("heroDescription"),
    heroPoints: mapPoints(data.heroPoints, { title: "title", desc: "desc" }),
    heroThemes: asStringArray(data.heroThemes),
    heroAvailability: row("heroAvailability"),
    heroPrice: row("heroPrice"),
    heroPriceLabel: row("heroPriceLabel"),
    hideSeePriser: data.hideSeePriser === true,
    heroVideo: row("heroVideo"),
    rating: row("rating"),
    primaryCtaLabel: row("primaryCtaLabel"),
    bookingService: row("bookingService"),
    flowEyebrow: row("flowEyebrow"),
    flowTitle: row("flowTitle"),
    flowImage: row("flowImage"),
    flowImageAlt: row("flowImageAlt"),
    flowLinkLabel: row("flowLinkLabel"),
    flowLinkHref: row("flowLinkHref"),
    flow: ((data.flow as unknown[]) || [])
      .filter(Boolean)
      .map((item) => {
        const r = item as Record<string, unknown>;
        return {
          n: asPlainString(r.n),
          title: asPlainString(r.title),
          desc: asPlainString(r.desc),
        };
      })
      .filter((s) => s.title || s.desc),
    reasonsEyebrow: row("reasonsEyebrow"),
    reasonsTitle: row("reasonsTitle"),
    reasonsLead: row("reasonsLead"),
    reasonsLead2: row("reasonsLead2"),
    reasonsLayout:
      data.reasonsLayout === "accordion" || data.reasonsLayout === "auto"
        ? data.reasonsLayout
        : "prose",
    reasons: ((data.reasons as unknown[]) || [])
      .filter(Boolean)
      .map((item) => {
        const r = item as Record<string, unknown>;
        return {
          n: asPlainString(r.n),
          title: asPlainString(r.title),
          desc: asPlainString(r.desc),
        };
      })
      .filter((r) => r.title || r.desc),
    promises: ((data.promises as unknown[]) || [])
      .filter(Boolean)
      .map((item) => {
        const r = item as Record<string, unknown>;
        return {
          eyebrow: asPlainString(r.eyebrow),
          title: asPlainString(r.title),
          desc: asPlainString(r.desc),
          image: asPlainString(r.image) || undefined,
          imageAlt: asPlainString(r.imageAlt) || undefined,
        };
      })
      .filter((p) => p.title),
    expertAreas: (() => {
      const ea = data.expertAreas as Record<string, unknown> | undefined;
      if (!ea) return undefined;
      const items = ((ea.items as unknown[]) || [])
        .filter(Boolean)
        .map((item) => {
          const r = item as Record<string, unknown>;
          return {
            title: asPlainString(r.title),
            desc: asPlainString(r.desc),
            path: asPlainString(r.path),
            image:
              asPlainString(r.image) ||
              relatedImageBySlug.get(pathSlug(asPlainString(r.path))) ||
              relatedImageBySlug.get(
                resolveFertilitetTreatmentSlug(pathSlug(asPlainString(r.path))),
              ) ||
              undefined,
            imageAlt: asPlainString(r.imageAlt) || undefined,
          };
        })
        .filter((i) => i.title && i.path);
      if (items.length === 0) return undefined;
      return {
        title: asPlainString(ea.title) || undefined,
        description: asPlainString(ea.description) || undefined,
        items,
      };
    })(),
    textSection: (() => {
      const ts = data.textSection as Record<string, unknown> | undefined;
      if (!ts) return undefined;
      const points = ((ts.points as unknown[]) || [])
        .filter(Boolean)
        .map((item) => {
          const r = item as Record<string, unknown>;
          return {
            n: asPlainString(r.n),
            title: asPlainString(r.title),
            desc: asPlainString(r.desc),
          };
        })
        .filter((p) => p.title);
      const title = asPlainString(ts.title) || undefined;
      const lead = asPlainString(ts.lead) || undefined;
      const image = asPlainString(ts.image) || undefined;
      const imageAlt = asPlainString(ts.imageAlt) || undefined;

      if (!title && !lead && !points.length && !image) {
        return undefined;
      }

      return {
        title,
        lead,
        points: points.length ? points : undefined,
        image,
        imageAlt,
      };
    })(),
    relatedEyebrow: data.relatedSection && typeof data.relatedSection === "object" ? asPlainString((data.relatedSection as any).eyebrow) : undefined,
    relatedTitle: data.relatedSection && typeof data.relatedSection === "object" ? asPlainString((data.relatedSection as any).title) : undefined,
    relatedLead: data.relatedSection && typeof data.relatedSection === "object" ? asPlainString((data.relatedSection as any).lead) : undefined,
    relatedAsIntro: data.relatedSection && typeof data.relatedSection === "object" ? (data.relatedSection as any).asIntro === true : false,
    relatedAsServices: data.relatedSection && typeof data.relatedSection === "object" ? (data.relatedSection as any).asServices === true : false,
    relatedSeeAllHref: data.relatedSection && typeof data.relatedSection === "object" ? asPlainString((data.relatedSection as any).seeAllHref) : undefined,
    relatedSeeAllLabel: data.relatedSection && typeof data.relatedSection === "object" ? asPlainString((data.relatedSection as any).seeAllLabel) : undefined,
    ctaTitle: row("ctaTitle"),
    ctaDescription: row("ctaDescription"),
    conversationCtaTitle: row("conversationCtaTitle"),
    midCtaPrimaryLabel: row("midCtaPrimaryLabel"),
    midCtaCallLabel: row("midCtaCallLabel"),
    midCtaShowCallButton: data.midCtaShowCallButton !== false,
    reviewsSectionTitle: row("reviewsSectionTitle"),
    googleReviews: mapTreatmentReviews(data.googleReviews, lang),
    legelistenReviews: mapTreatmentReviews(data.legelistenReviews, lang),
    specialistTitle: row("specialistTitle"),
    specialistDescription: row("specialistDescription"),
    specialistCtaLabel: row("specialistCtaLabel"),
    specialistCtaHref: row("specialistCtaHref"),
    relatedSpecialistSlugs,
    related,
    pageSections: normalizePageSections(data.pageSections),
    canonicalSlug: asPlainString(data.slug) || undefined,
    pageRole: row("pageRole"),
    seo: data.seo as Record<string, unknown> | undefined,
  };
}

/** Browser/client treatment payload — uses `/api/sanity/groq` proxy. */
export async function fetchTreatmentData(
  categorySlug: string,
  treatmentSlug: string,
  lang: "no" | "en",
): Promise<TreatmentData | null> {
  const categoryKey = normalizeCategoryRouteKey(categorySlug) || categorySlug;
  const slugCandidates =
    categoryKey === FLERE_FAGOMRADER_CATEGORY_ID
      ? flereFagomraderTreatmentSlugCandidates(treatmentSlug)
      : categoryKey === "urologi"
        ? urologiTreatmentSlugCandidates(treatmentSlug)
        : categoryKey === "ortopedi"
          ? ortopediTreatmentSlugCandidates(treatmentSlug)
          : categoryKey === "gynekologi"
            ? gynekologiTreatmentSlugCandidates(treatmentSlug)
            : [
                categoryKey === "fertilitet"
                  ? resolveFertilitetTreatmentSlug(treatmentSlug)
                  : categoryKey === "graviditet"
                    ? resolveGraviditetTreatmentSlug(treatmentSlug)
                    : treatmentSlug,
              ];

  let raw: Record<string, unknown> | null = null;
  let resolvedSlug = slugCandidates[0] || treatmentSlug;
  for (const candidate of slugCandidates) {
    raw = await fetchSanityGroqBrowser<Record<string, unknown> | null>(
      TREATMENT_BY_SLUG_QUERY,
      {
        categorySlug: categorySlugForFetch(categorySlug),
        treatmentSlug: candidate,
        lang,
      },
    );
    if (raw) {
      resolvedSlug = candidate;
      break;
    }
  }
  if (!raw) return null;
  const normalized = normalizeI18nStrict(raw, lang) as Record<string, unknown>;
  const mapped = mapTreatmentDocument(normalized, lang);
  if (mapped && !mapped.canonicalSlug) {
    mapped.canonicalSlug = resolvedSlug;
  }
  return mapped;
}


