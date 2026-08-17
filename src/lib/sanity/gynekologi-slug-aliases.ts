/**
 * Tjenester → Gynekologi items, in reference (avenewdemo) order.
 * Labels come from each treatment's CMS title.
 */
export const GYNEKOLOGI_NAV_TREATMENT_SLUGS = [
  "tverrfaglig",
  "undersokelse",
  "urinlekkasje",
  "endometriose",
  "overgangsalder",
  "vaginale-fremfall",
  "urogynekologi",
  "blodningsforstyrrelser",
  "celleforandringer",
  "cyster",
  "fjerne-livmor",
  "kirurgi",
  "hysteroskopi",
  "labiaplastikk",
  "pmos",
  "pms-pmdd",
  "robotkirurgi",
  "vulvalidelser",
] as const;

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
