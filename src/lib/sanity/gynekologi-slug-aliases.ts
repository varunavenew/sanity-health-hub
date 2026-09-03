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
  /**
   * Reference URL — no dedicated CMS page; serve Vulvalidelser
   * (vaginal tørrhet is a topic on that treatment).
   */
  "vaginal-torrhet": "vulvalidelser",
  pcos: "pmos",
  pmos: "pcos",
  "multidisciplinary-team": "tverrfaglig",
  "gynaecological-examination": "undersokelse",
  "gynecological-examination": "undersokelse",
  "urinary-incontinence": "urinlekkasje",
  menopause: "overgangsalder",
  "vaginal-prolapse": "vaginale-fremfall",
  urogynaecology: "urogynekologi",
  urogynecology: "urogynekologi",
  "bleeding-disorders": "blodningsforstyrrelser",
  "cell-changes": "celleforandringer",
  "ovarian-cysts": "cyster",
  hysterectomy: "fjerne-livmor",
  "gynaecological-surgery": "kirurgi",
  "gynecological-surgery": "kirurgi",
  labiaplasty: "labiaplastikk",
  /** Demo / nav short path → published treatment slug. */
  robotkirurgi: "robotassistert-kirurgi",
};

export function resolveGynekologiTreatmentSlug(urlSlug: string): string {
  const trimmed = urlSlug.trim();
  if (!trimmed) return trimmed;
  return GYNEKOLOGI_SLUG_ALIASES[trimmed] ?? trimmed;
}

export function gynekologiTreatmentSlugCandidates(urlSlug: string): string[] {
  const trimmed = urlSlug.trim();
  if (!trimmed) return [];
  const resolved = resolveGynekologiTreatmentSlug(trimmed);
  return [...new Set([trimmed, resolved].filter(Boolean))];
}
