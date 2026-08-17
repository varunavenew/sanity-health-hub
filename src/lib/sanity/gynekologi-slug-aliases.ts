/** URL slug → Sanity treatment document slug for gynekologi sub-pages. */
export const GYNEKOLOGI_SLUG_ALIASES: Record<string, string> = {
  /** Demo / marketing long form → published undersokelse page. */
  "gynekologisk-undersokelse": "undersokelse",
  /** Legacy / alternate hormone pages → dedicated POI treatment. */
  hormonforstyrrelser: "poi",
  hormonbehandling: "poi",
  /** Legacy slug after rename to pms-pmdd. */
  "pms-og-pmdd": "pms-pmdd",
};

export function resolveGynekologiTreatmentSlug(urlSlug: string): string {
  const trimmed = urlSlug.trim();
  if (!trimmed) return trimmed;
  return GYNEKOLOGI_SLUG_ALIASES[trimmed] ?? trimmed;
}
