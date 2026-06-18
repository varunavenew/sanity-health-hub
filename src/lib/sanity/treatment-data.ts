import { TREATMENT_BY_SLUG_QUERY } from "@/lib/queries";
import { categorySlugForFetch } from "@/lib/sanity/category-keys";
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

export type SubTreatmentLayoutData = {
  eyebrow?: string;
  heroTitle?: string;
  heroDescription?: string;
  heroPoints?: { title: string; desc: string }[];
  rating?: string;
  primaryCtaLabel?: string;
  bookingService?: string;
  flowEyebrow?: string;
  flowTitle?: string;
  flow?: { n: string; title: string; desc: string }[];
  reasonsEyebrow?: string;
  reasonsTitle?: string;
  reasonsLead?: string;
  reasonsLead2?: string;
  reasons?: { n: string; title: string; desc: string }[];
  promises?: { eyebrow: string; title: string; desc: string }[];
  relatedEyebrow?: string;
  relatedTitle?: string;
  related?: { eyebrow: string; title: string; desc: string; path: string }[];
  ctaTitle?: string;
  ctaDescription?: string;
  specialistCtaLabel?: string;
  specialistCtaHref?: string;
};

export type TreatmentBottomCta = {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryPath?: string;
  secondaryPath?: string;
};

export type TreatmentData = {
  title: string;
  subtitle?: string;
  description: string;
  heroImage?: string;
  parentCategory?: string;
  parentSlug?: string;
  categoryNumericId?: number;
  benefitsTitle?: string;
  benefits?: { title: string; description: string }[];
  linkedServicesSectionTitle?: string;
  processSectionTitle?: string;
  quickInfoItems?: string[];
  faqSectionTitle?: string;
  bottomCta?: TreatmentBottomCta;
  process?: { title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
  sections: TreatmentSection[];
  linkedServices?: { label: string; description?: string; path: string }[];
  layout?: SubTreatmentLayoutData;
  relatedSpecialistSlugs?: string[];
  pageSections: ReturnType<typeof normalizePageSections>;
  /** Locale-specific slug from CMS (for canonical redirects). */
  canonicalSlug?: string;
  seo?: Record<string, unknown>;
};

export function mapTreatmentDocument(
  data: Record<string, unknown> | null | undefined,
): TreatmentData | null {
  if (!data) return null;

  const sections = ((data.sections as unknown[]) || [])
    .map((row, i) => {
      const s = row as Record<string, unknown>;
      return {
        id: asPlainString(s.id) || `section-${i}`,
        heading: asPlainString(s.heading),
        content: asPlainString(s.content),
      };
    })
    .filter((s) => s.heading || s.content);

  const layoutRaw = data.layout as Record<string, unknown> | undefined;
  const layout = layoutRaw ? mapLayoutDocument(layoutRaw) : undefined;

  const relatedSpecialists = (data.relatedSpecialists as unknown[]) || [];
  const relatedSpecialistSlugs = relatedSpecialists
    .map((row) => asPlainString((row as Record<string, unknown>).slug))
    .filter(Boolean);

  const bottomCtaRaw = data.bottomCta as Record<string, unknown> | undefined;
  const quickInfoItems = asStringArray(data.quickInfoItems);

  return {
    title: asPlainString(data.title),
    subtitle: asPlainString(data.subtitle) || undefined,
    description: asPlainString(data.description),
    heroImage: asPlainString(data.heroImage) || undefined,
    parentCategory: asPlainString(data.parentCategory) || undefined,
    parentSlug: asPlainString(data.parentSlug) || undefined,
    categoryNumericId:
      typeof data.categoryNumericId === "number"
        ? data.categoryNumericId
        : undefined,
    benefitsTitle: asPlainString(data.benefitsTitle) || undefined,
    linkedServicesSectionTitle:
      asPlainString(data.linkedServicesSectionTitle) || undefined,
    processSectionTitle: asPlainString(data.processSectionTitle) || undefined,
    quickInfoItems: quickInfoItems.length ? quickInfoItems : undefined,
    faqSectionTitle: asPlainString(data.faqSectionTitle) || undefined,
    bottomCta: bottomCtaRaw
      ? {
          title: asPlainString(bottomCtaRaw.title) || undefined,
          subtitle: asPlainString(bottomCtaRaw.subtitle) || undefined,
          primaryLabel: asPlainString(bottomCtaRaw.primaryLabel) || undefined,
          secondaryLabel: asPlainString(bottomCtaRaw.secondaryLabel) || undefined,
          primaryPath: asPlainString(bottomCtaRaw.primaryPath) || undefined,
          secondaryPath: asPlainString(bottomCtaRaw.secondaryPath) || undefined,
        }
      : undefined,
    benefits: ((data.benefits as unknown[]) || []).map((b) => {
      const row = b as Record<string, unknown>;
      if (row && typeof row === 'object' && 'title' in row) {
        return {
          title: asPlainString(row.title),
          description: asPlainString(row.description),
        };
      }
      // Legacy: bare internationalizedArrayString per array item
      return {
        title: asPlainString(b),
        description: '',
      };
    }),
    process: ((data.process as unknown[]) || []).map((p) => {
      const row = p as Record<string, unknown>;
      return {
        title: asPlainString(row.title),
        description: asPlainString(row.description),
      };
    }),
    faqs: ((data.faqs as unknown[]) || []).map((f) => {
      const row = f as Record<string, unknown>;
      return {
        question: asPlainString(row.question),
        answer: asPlainString(row.answer),
      };
    }),
    sections,
    linkedServices: ((data.linkedServices as unknown[]) || []).map((ls) => {
      const row = ls as Record<string, unknown>;
      return {
        label: asPlainString(row.label),
        description: asPlainString(row.description) || undefined,
        path: asPlainString(row.path),
      };
    }),
    layout,
    relatedSpecialistSlugs,
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
  const raw = await sanityClient.fetch<Record<string, unknown> | null>(
    TREATMENT_BY_SLUG_QUERY,
    { categorySlug: categorySlugForFetch(categorySlug), treatmentSlug, lang },
  );
  if (!raw) return null;
  const normalized = normalizeI18n(raw, lang) as Record<string, unknown>;
  const mapped = mapTreatmentDocument(normalized);
  if (mapped && !mapped.canonicalSlug) {
    mapped.canonicalSlug = treatmentSlug;
  }
  return mapped;
}

function mapLayoutDocument(raw: Record<string, unknown>): SubTreatmentLayoutData {
  const row = (key: string) => asPlainString(raw[key]) || undefined;
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

  return {
    eyebrow: row("eyebrow"),
    heroTitle: row("heroTitle"),
    heroDescription: row("heroDescription"),
    heroPoints: mapPoints(raw.heroPoints, { title: "title", desc: "desc" }),
    rating: row("rating"),
    primaryCtaLabel: row("primaryCtaLabel"),
    bookingService: row("bookingService"),
    flowEyebrow: row("flowEyebrow"),
    flowTitle: row("flowTitle"),
    flow: ((raw.flow as unknown[]) || [])
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
    reasons: ((raw.reasons as unknown[]) || [])
      .map((item) => {
        const r = item as Record<string, unknown>;
        return {
          n: asPlainString(r.n),
          title: asPlainString(r.title),
          desc: asPlainString(r.desc),
        };
      })
      .filter((r) => r.title || r.desc),
    promises: ((raw.promises as unknown[]) || [])
      .map((item) => {
        const r = item as Record<string, unknown>;
        return {
          eyebrow: asPlainString(r.eyebrow),
          title: asPlainString(r.title),
          desc: asPlainString(r.desc),
        };
      })
      .filter((p) => p.title),
    relatedEyebrow: row("relatedEyebrow"),
    relatedTitle: row("relatedTitle"),
    related: ((raw.related as unknown[]) || [])
      .map((item) => {
        const r = item as Record<string, unknown>;
        return {
          eyebrow: asPlainString(r.eyebrow),
          title: asPlainString(r.title),
          desc: asPlainString(r.desc),
          path: asPlainString(r.path),
        };
      })
      .filter((r) => r.title && r.path),
    ctaTitle: row("ctaTitle"),
    ctaDescription: row("ctaDescription"),
    specialistCtaLabel: row("specialistCtaLabel"),
    specialistCtaHref: row("specialistCtaHref"),
  };
}
