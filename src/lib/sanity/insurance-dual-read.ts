/**
 * Dual-read Insurance Partners resolution: prefer Insurance Collection when it
 * has usable partners; otherwise fall back to page-section legacy inline fields.
 *
 * Presentation-only `eyebrow` and `title` may stay page-owned: when a collection
 * supplies partners, prefer the band's legacy eyebrow/title if set, else the
 * collection values.
 * Empty partners → PageSectionInsuranceBlock returns null (current behaviour).
 */

import type {
  PageSection,
  PageSectionInsuranceConfig,
  PageSectionInsurancePartner,
} from "@/lib/sanity/page-sections";

export type ResolvedInsuranceBody = {
  eyebrow?: string;
  title?: string;
  partners: PageSectionInsurancePartner[];
};

function str(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return String(value);
}

function mapPartners(value: unknown): PageSectionInsurancePartner[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((p): PageSectionInsurancePartner | null => {
      if (!p || typeof p !== "object") return null;
      const row = p as Record<string, unknown>;
      const key = str(row.key);
      if (!key) return null;
      return {
        key,
        label: str(row.label),
      };
    })
    .filter((x): x is PageSectionInsurancePartner => x != null);
}

/** Map a GROQ-localized collection or inline section body to insurance fields. */
export function mapInsuranceBody(source: unknown): ResolvedInsuranceBody {
  if (!source || typeof source !== "object") {
    return { partners: [] };
  }
  const row = source as Record<string, unknown>;
  return {
    eyebrow: str(row.eyebrow) || undefined,
    title: str(row.title) || undefined,
    partners: mapPartners(row.partners),
  };
}

/**
 * Prefer Insurance Collection when it has at least one partner; otherwise legacy.
 * Eyebrow/title: page-level override when the band still has inline copy.
 */
export function resolveInsuranceFromCollection(
  insuranceCollection: unknown,
  legacyInline: unknown,
): ResolvedInsuranceBody {
  const fromCollection = mapInsuranceBody(insuranceCollection);
  if (fromCollection.partners.length > 0) {
    const legacy = mapInsuranceBody(legacyInline);
    return {
      title: legacy.title || fromCollection.title,
      partners: fromCollection.partners,
      eyebrow: legacy.eyebrow || fromCollection.eyebrow,
    };
  }
  return mapInsuranceBody(legacyInline);
}

/**
 * Treatment insurance: Shared Sections band (collection dual-read) → legacy
 * Page Content fields. When an insurance band exists but has no partners,
 * return null (empty = hide) — do not fall through to legacy defaults.
 */
export function resolveTreatmentInsurance(
  pageSections: PageSection[] | undefined,
  pageContentLegacy: {
    eyebrow?: string;
    title?: string;
    partners?: PageSectionInsurancePartner[];
  },
): PageSectionInsuranceConfig | null {
  const band = pageSections?.find((s) => s._type === "pageSectionInsurance");
  if (band) {
    if ((band.partners?.length ?? 0) > 0) return band;
    return null;
  }

  const partners =
    pageContentLegacy.partners?.filter((p) => p.key && p.label) ?? [];
  if (!partners.length) return null;

  return {
    _type: "pageSectionInsurance",
    eyebrow: pageContentLegacy.eyebrow,
    title: pageContentLegacy.title,
    partners,
  };
}
