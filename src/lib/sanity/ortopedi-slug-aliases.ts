/**
 * Tjenester → Ortopedi items, in reference (avenewdemo) order.
 * Production still uses `fot-og-ankel` for the foot/ankle page.
 */
export const ORTOPEDI_NAV_TREATMENT_SLUGS = [
  "fot-ankel",
  "hofte",
  "hand-albue",
  "kne",
  "skulder",
] as const;

/** URL slug → Sanity treatment document slug for ortopedi sub-pages. */
export const ORTOPEDI_SLUG_ALIASES: Record<string, string> = {
  "fot-ankel": "fot-og-ankel",
  "fot-og-ankel": "fot-ankel",
};

export function resolveOrtopediTreatmentSlug(urlSlug: string): string {
  const trimmed = urlSlug.trim();
  if (!trimmed) return trimmed;
  return ORTOPEDI_SLUG_ALIASES[trimmed] ?? trimmed;
}

export function ortopediTreatmentSlugCandidates(urlSlug: string): string[] {
  const trimmed = urlSlug.trim();
  if (!trimmed) return [];
  const resolved = resolveOrtopediTreatmentSlug(trimmed);
  return [...new Set([trimmed, resolved].filter(Boolean))];
}
