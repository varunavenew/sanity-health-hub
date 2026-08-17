/**
 * Tjenester → Graviditet items, in reference (avenewdemo) order.
 * Labels come from each treatment's CMS title.
 */
export const GRAVIDITET_NAV_TREATMENT_SLUGS = [
  "ultralyd",
  "nipt",
  "svangerskapsteam",
  "fosterdiagnostikk",
  "fostermedisin",
  "svangerskapsoppfolging",
  "6-ukerskontroll",
  "fodselsskader",
  "spontanabort",
] as const;

/** URL slug → Sanity treatment document slug for graviditet sub-pages. */
export const GRAVIDITET_SLUG_ALIASES: Record<string, string> = {
  /** Legacy long slug after rename to ultralyd. */
  "ultralyd-i-svangerskapet": "ultralyd",
  /**
   * Keep overview page reachable under its Sanity slug.
   * (Previously aliased to `graviditet`, which broke matching.)
   */
  graviditetsoppfolging: "svangerskapsoppfolging",
};

export function resolveGraviditetTreatmentSlug(urlSlug: string): string {
  const trimmed = urlSlug.trim();
  if (!trimmed) return trimmed;
  return GRAVIDITET_SLUG_ALIASES[trimmed] ?? trimmed;
}
