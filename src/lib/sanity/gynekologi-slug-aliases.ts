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
  "poi",
] as const;

/** URL slug → Sanity treatment document slug for gynekologi sub-pages. */
export const GYNEKOLOGI_SLUG_ALIASES: Record<string, string> = {
  /** Legacy short URL / old CMS slug → published gynekologisk-undersokelse page. */
  undersokelse: "gynekologisk-undersokelse",
  /**
   * Ticket #185 — old mixed hormone page. Canonical pages are PMOS and POI.
   * `/hormonforstyrrelser` 301s to `/poi` (see legacy-redirects); keep the
   * alias so leftover CMS lookups still resolve to POI, not PMOS.
   */
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
  "gynaecological-examination": "gynekologisk-undersokelse",
  "gynecological-examination": "gynekologisk-undersokelse",
  "test-klamydia-gonorre": "test-for-klamydia-gonore",
  "test-for-chlamydia-gonorrhea": "test-for-klamydia-gonore",
  "test-for-chlamydia-gonorrhoea": "test-for-klamydia-gonore",
  "urinary-incontinence": "urinlekkasje",
  menopause: "overgangsalder",
  "vaginal-prolapse": "vaginale-fremfall",
  urogynaecology: "urogynekologi",
  urogynecology: "urogynekologi",
  /** Legacy misspelling (missing "s" in forstyrrelser) → published slug. */
  blodningsfortyrrelser: "blodningsforstyrrelser",
  "bleeding-disorders": "blodningsforstyrrelser",
  "cell-changes": "celleforandringer",
  "cone-biopsy": "konisering",
  conisation: "konisering",
  conization: "konisering",
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
  const reverseAliases = Object.entries(GYNEKOLOGI_SLUG_ALIASES)
    .filter(([, target]) => target === trimmed || target === resolved)
    .map(([alias]) => alias);
  // Canonical slug first so leftover `hormonforstyrrelser` documents cannot
  // win over the dedicated POI page.
  return [...new Set([resolved, trimmed, ...reverseAliases].filter(Boolean))];
}
