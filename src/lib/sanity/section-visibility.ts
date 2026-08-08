/**
 * Shared section visibility — meaningful content checks for Treatment (and reusable bands).
 *
 * Editors clear content + publish to hide a section. No "Hide section" toggle.
 * Keep helpers pure and side-effect free so layouts can gate render without duplicating rules.
 */

import {
  isUsableBookingCtaBody,
  mapBookingCtaBody,
} from "@/lib/sanity/cta-dual-read";
import type {
  PageSection,
  PageSectionArticlesConfig,
  PageSectionBookingCtaConfig,
  PageSectionInsuranceConfig,
  PageSectionSpecialistsConfig,
} from "@/lib/sanity/page-sections";
import {
  resolveArticlesDisplayMode,
  resolveSpecialistsDisplayMode,
} from "@/lib/sanity/specialists-display-mode";

/** Non-empty trimmed string (or ReactNode treated as present). */
export function hasText(value: unknown): boolean {
  if (typeof value === "string") return value.trim().length > 0;
  if (value == null || value === false) return false;
  // ReactNode / numbers / etc. — treat as meaningful if truthy
  return Boolean(value);
}

/** Array with at least one item. */
export function hasItems(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0;
}

/**
 * Portable Text / block content: empty when missing, empty array, or only blank spans.
 */
export function hasPortableText(value: unknown): boolean {
  if (!Array.isArray(value) || value.length === 0) return false;
  return value.some((block) => {
    if (!block || typeof block !== "object") return false;
    const row = block as { _type?: string; children?: unknown[] };
    if (row._type && row._type !== "block") return true;
    if (!Array.isArray(row.children) || row.children.length === 0) return false;
    return row.children.some((child) => {
      if (!child || typeof child !== "object") return false;
      const text = (child as { text?: unknown }).text;
      return typeof text === "string" ? text.trim().length > 0 : Boolean(text);
    });
  });
}

/** Image asset / URL / CMS media object with usable payload. */
export function hasImage(value: unknown): boolean {
  if (!value) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  if (row.asset || row._ref || row.url || row.src) return true;
  if (row.mediaType === "image" && row.image) return true;
  if (row.mediaType === "video") return true;
  if (row.image || row.videoUrl) return true;
  return false;
}

export function hasCmsMedia(value: unknown): boolean {
  return hasImage(value);
}

const REASONS_BLACKLIST = [
  "erfarne spesialister",
  "våre spesialister",
  "spesialister med dybde",
  "ingen ventetid",
  "ingen henvisning",
  "korte ventetider",
  "kort ventetid",
  "alt under samme tak",
];

export function isBlacklistedReasonTitle(title: unknown): boolean {
  if (typeof title !== "string") return false;
  const normalized = title.trim().toLowerCase();
  return REASONS_BLACKLIST.some(
    (blacklisted) =>
      normalized === blacklisted || normalized.startsWith(blacklisted),
  );
}

type ReasonItem = {title?: unknown; desc?: unknown};
type FlowItem = unknown;
type PromiseItem = unknown;
type ExpertAreas = { items?: unknown[] } | null | undefined;
type TextSectionBand = {
  title?: unknown;
  lead?: unknown;
  points?: unknown[];
  image?: unknown;
} | null | undefined;

/**
 * Single rule for Symptoms / reasons items — shared by visibility gate and renderer.
 * Blacklisted titles excluded; item must have a non-empty description.
 */
export function isMeaningfulReasonItem(item: ReasonItem): boolean {
  if (isBlacklistedReasonTitle(item.title)) return false;
  if (typeof item.desc === "string") return item.desc.trim().length > 0;
  return Boolean(item.desc);
}

/** Symptoms / reasons — same rule as ReasonsEditorial clean-items filter. */
export function hasSymptomsSection(content: { reasons?: ReasonItem[] }): boolean {
  return (content.reasons ?? []).some(isMeaningfulReasonItem);
}

export function hasProcessSection(content: { flow?: FlowItem[] }): boolean {
  return hasItems(content.flow);
}

export function hasBenefitsSection(content: { promises?: PromiseItem[] }): boolean {
  return hasItems(content.promises);
}

export function hasExpertAreasSection(content: { expertAreas?: ExpertAreas }): boolean {
  return hasItems(content.expertAreas?.items);
}

export function hasTextSection(content: { textSection?: TextSectionBand }): boolean {
  const band = content.textSection;
  if (!band) return false;
  return (
    hasText(band.title) ||
    hasText(band.lead) ||
    hasItems(band.points) ||
    hasImage(band.image)
  );
}

export function hasRelatedSection(content: { related?: unknown[] }): boolean {
  return hasItems(content.related);
}

export function hasFaqSection(faqs: unknown): boolean {
  return hasItems(faqs);
}

export function hasMidCtaSection(content: {
  conversationCtaTitle?: unknown;
  ctaTitle?: unknown;
}): boolean {
  return hasText(content.conversationCtaTitle) || hasText(content.ctaTitle);
}

/** Booking CTA after dual-read / normalize — image counts as content. */
export function hasBookingCtaSection(
  config: PageSectionBookingCtaConfig | null | undefined,
): boolean {
  if (!config) return false;
  if (hasImage(config.image)) return true;
  return isUsableBookingCtaBody(mapBookingCtaBody(config));
}

export function hasInsuranceSection(
  config: PageSectionInsuranceConfig | null | undefined,
): boolean {
  return hasItems(config?.partners);
}

/**
 * Specialists / articles bands may resolve clientside; require an explicit
 * stored displayMode so missing config never silently becomes "all"/"latest".
 */
export function hasSpecialistsBand(
  config: PageSectionSpecialistsConfig | null | undefined,
): boolean {
  return (
    config?._type === "pageSectionSpecialists" &&
    Boolean(resolveSpecialistsDisplayMode(config.displayMode))
  );
}

export function hasArticlesBand(
  config: PageSectionArticlesConfig | null | undefined,
): boolean {
  return (
    config?._type === "pageSectionArticles" &&
    Boolean(resolveArticlesDisplayMode(config.displayMode))
  );
}

export function hasPageSection(section: PageSection | null | undefined): boolean {
  if (!section) return false;
  switch (section._type) {
    case "pageSectionBookingCta":
      return hasBookingCtaSection(section);
    case "pageSectionInsurance":
      return hasInsuranceSection(section);
    case "pageSectionSpecialists":
      return hasSpecialistsBand(section);
    case "pageSectionArticles":
      return hasArticlesBand(section);
    default:
      return false;
  }
}

/** Filter pageSections to those with meaningful content (stable order preserved). */
export function filterMeaningfulPageSections(
  sections: PageSection[] | null | undefined,
): PageSection[] {
  if (!sections?.length) return [];
  return sections.filter((section) => hasPageSection(section));
}

/**
 * Ensure every page section has a unique React/list key.
 * Prefers Sanity `_key`; synthesizes `${_type}-${index}` when missing.
 */
export function ensurePageSectionKeys<T extends {_type: string; _key?: string}>(
  sections: T[],
): Array<T & {_key: string}> {
  const seen = new Set<string>();
  return sections.map((section, index) => {
    const base =
      typeof section._key === "string" && section._key.trim()
        ? section._key.trim()
        : `${section._type}-${index}`;
    let key = base;
    let n = 1;
    while (seen.has(key)) {
      key = `${base}-${n}`;
      n += 1;
    }
    seen.add(key);
    return { ...section, _key: key };
  });
}
