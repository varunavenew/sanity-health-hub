import { TREATMENT_BY_SLUG_QUERY } from "@/lib/queries";
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
  }
  if (typeof value === "object" && "value" in (value as object)) {
    const inner = (value as { value: unknown }).value;
    if (typeof inner === "string") return inner;
  }
  return "";
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
  parentCategory?: string;
  parentSlug?: string;
  categoryNumericId?: number;
  benefitsTitle?: string;
  benefits?: { title: string; description: string }[];
  process?: { title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
  sections: TreatmentSection[];
  linkedServices?: { label: string; description?: string; path: string }[];
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
    benefits: ((data.benefits as unknown[]) || []).map((b) => {
      const row = b as Record<string, unknown>;
      return {
        title: asPlainString(row.title),
        description: asPlainString(row.description),
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
    { categorySlug, treatmentSlug, lang },
  );
  if (!raw) return null;
  const normalized = normalizeI18n(raw, lang) as Record<string, unknown>;
  const mapped = mapTreatmentDocument(normalized);
  if (mapped && !mapped.canonicalSlug) {
    mapped.canonicalSlug = treatmentSlug;
  }
  return mapped;
}
