import { TREATMENT_BY_SLUG_QUERY } from "@/lib/queries";
import { categorySlugForFetch } from "@/lib/sanity/category-keys";
import { resolveFertilitetTreatmentSlug } from "@/lib/sanity/fertilitet-slug-aliases";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";
import { normalizePageSections } from "@/lib/sanity/page-sections";
import { sanityClient } from "@/lib/sanityClient";

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

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => asPlainString(v)).filter(Boolean);
}

export type TreatmentSection = {
  id: string;
  heading: string;
  content: string;
};

export type TreatmentData = {
  title: string;
  subtitle?: string;
  description: string;
  heroImage?: string;
  heroImageAlt?: string;
  parentCategory?: string;
  parentSlug?: string;
  categoryNumericId?: number;
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
  specialistTitle?: string;
  specialistDescription?: string;
  specialistCtaLabel?: string;
  specialistCtaHref?: string;
  relatedSpecialistSlugs?: string[];
  related?: { eyebrow?: string; title: string; desc: string; path: string; image?: string; imageAlt?: string }[];
  pageSections: ReturnType<typeof normalizePageSections>;
  /** Locale-specific slug from CMS (for canonical redirects). */
  canonicalSlug?: string;
  geoSummary?: string;
  seo?: Record<string, unknown>;
};

export function mapTreatmentDocument(
  data: Record<string, unknown> | null | undefined,
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

  return {
    title: asPlainString(data.title),
    subtitle: row("subtitle"),
    description: asPlainString(data.description),
    geoSummary: row("geoSummary"),
    heroImage: row("heroImage"),
    heroImageAlt: row("heroImageAlt"),
    parentCategory: row("parentCategory"),
    parentSlug: row("parentSlug"),
    categoryNumericId:
      typeof data.categoryNumericId === "number" ? data.categoryNumericId : undefined,
    faqs: ((data.faqs as unknown[]) || []).map((f) => {
      const r = f as Record<string, unknown>;
      return {
        question: asPlainString(r.question),
        answer: asPlainString(r.answer),
      };
    }),
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
    insurancePartners: ((data.insurancePartners as unknown[]) || [])
      .filter(Boolean)
      .map((item) => {
        const r = item as Record<string, unknown>;
        return { key: asPlainString(r.key), label: asPlainString(r.label) };
      })
      .filter((item) => item.key && item.label),
    eyebrow: row("eyebrow"),
    heroTitle: row("heroTitle"),
    heroDescription: row("heroDescription"),
    heroPoints: mapPoints(data.heroPoints, { title: "title", desc: "desc" }),
    heroThemes: asStringArray(data.heroThemes),
    heroAvailability: row("heroAvailability"),
    heroPrice: row("heroPrice"),
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
            image: asPlainString(r.image) || undefined,
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
      return {
        title: asPlainString(ts.title) || undefined,
        lead: asPlainString(ts.lead) || undefined,
        points: points.length ? points : undefined,
        image: asPlainString(ts.image) || undefined,
        imageAlt: asPlainString(ts.imageAlt) || undefined,
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
    specialistTitle: row("specialistTitle"),
    specialistDescription: row("specialistDescription"),
    specialistCtaLabel: row("specialistCtaLabel"),
    specialistCtaHref: row("specialistCtaHref"),
    relatedSpecialistSlugs,
    related: (() => {
      const rs = data.relatedSection as Record<string, unknown> | undefined;
      return ((rs?.items as unknown[]) || [])
        .filter(Boolean)
        .map((item) => {
          const r = item as Record<string, unknown>;
          return {
            eyebrow: asPlainString(r.eyebrow),
            title: asPlainString(r.title),
            desc: asPlainString(r.desc),
            path: asPlainString(r.path),
            image: asPlainString(r.image) || undefined,
            imageAlt: asPlainString(r.imageAlt) || undefined,
          };
        })
        .filter((r) => r.title && r.path);
    })(),
    pageSections: normalizePageSections(data.pageSections),
    canonicalSlug: asPlainString(data.slug) || undefined,
    seo: data.seo as Record<string, unknown> | undefined,
  };
}

/** Server-side treatment payload — always hits Sanity directly (matches local dev). */
export async function fetchTreatmentData(
  categorySlug: string,
  treatmentSlug: string,
  lang: "no" | "en",
): Promise<TreatmentData | null> {
  const resolvedSlug =
    categorySlug === "fertilitet"
      ? resolveFertilitetTreatmentSlug(treatmentSlug)
      : treatmentSlug;
  const raw = await sanityClient.fetch<Record<string, unknown> | null>(
    TREATMENT_BY_SLUG_QUERY,
    { categorySlug: categorySlugForFetch(categorySlug), treatmentSlug: resolvedSlug, lang },
  );
  if (!raw) return null;
  const normalized = normalizeI18n(raw, lang) as Record<string, unknown>;
  const mapped = mapTreatmentDocument(normalized);
  if (mapped && !mapped.canonicalSlug) {
    mapped.canonicalSlug = resolvedSlug;
  }
  return mapped;
}


