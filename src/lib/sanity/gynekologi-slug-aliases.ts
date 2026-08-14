/** URL slug → Sanity treatment document slug for gynekologi sub-pages. */
export const GYNEKOLOGI_SLUG_ALIASES: Record<string, string> = {
  /** Reference / EN marketing slug for PMOS. */
  pcos: "pmos",
  /** Reference short slug for PMS/PMDD. */
  "pms-pmdd": "pms-og-pmdd",
  /** Premature ovarian insufficiency — closest published treatment today. */
  poi: "hormonforstyrrelser",
  /** Nested under vulva care until a dedicated page exists. */
  vaginisme: "vulvalidelser",
  /** Urogynecology overview — maps to incontinence treatment until a dedicated page exists. */
  urogynekologi: "urinlekkasje",
};

export function resolveGynekologiTreatmentSlug(urlSlug: string): string {
  const trimmed = urlSlug.trim();
  if (!trimmed) return trimmed;
  return GYNEKOLOGI_SLUG_ALIASES[trimmed] ?? trimmed;
}
