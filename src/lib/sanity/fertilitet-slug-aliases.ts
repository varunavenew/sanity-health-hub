/**
 * Tjenester → Fertilitet items, in reference (avenewdemo) order.
 * Audience pages and the IVF alias stay routable but are not top-level nav.
 */
export const FERTILITET_NAV_TREATMENT_SLUGS = [
  "infertilitet",
  "assistert-befruktning",
  "fertilitetsutredning",
  "eggfrys",
  "donorbehandling",
  "assistert-befruktning-for-par-og-single",
  "hysteroskopi",
  "saedanalyse",
] as const;

/** URL slug → Sanity treatment document slug for fertilitet sub-pages. */
export const FERTILITET_SLUG_ALIASES: Record<string, string> = {
  nedfrysing: "eggfrys",
  "nedfrysing-av-egg": "eggfrys",
  /** Reference serves Assistert befruktning content at `/…/ivf`. */
  ivf: "assistert-befruktning",
  /** Demo short path → full Sanity slug. */
  "par-og-single": "assistert-befruktning-for-par-og-single",
  /**
   * Legacy / mistaken production slug — keep both URL forms resolving whether
   * the CMS slug is `infertilitet` or `fertilitet-infertilitet` (incl. ISR lag).
   */
  "fertilitet-infertilitet": "infertilitet",
  infertilitet: "fertilitet-infertilitet",
};

export function resolveFertilitetTreatmentSlug(urlSlug: string): string {
  const trimmed = urlSlug.trim();
  if (!trimmed) return trimmed;
  return FERTILITET_SLUG_ALIASES[trimmed] ?? trimmed;
}
