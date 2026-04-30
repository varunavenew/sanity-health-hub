// Synonym- og intent-mapping: utvider søkeordet med relevante termer
// slik at folkelige/symptom-baserte søk finner riktige behandlinger.
// Eksempel: "vondt i magen" → matcher endometriose, cyster, blødningsforstyrrelser.

export const synonymMap: Record<string, string[]> = {
  // Symptomer → behandlinger
  "vondt i magen": ["endometriose", "cyster", "blødningsforstyrrelser", "underlivssmerter"],
  "magesmerter": ["endometriose", "cyster", "blødningsforstyrrelser"],
  "menssmerter": ["endometriose", "blødningsforstyrrelser", "pms"],
  "kraftig menstruasjon": ["blødningsforstyrrelser", "endometriose"],
  "uregelmessig mens": ["blødningsforstyrrelser", "hormonforstyrrelser", "pcos"],
  "uteblitt mens": ["overgangsalder", "hormonforstyrrelser"],
  "humørsvingninger": ["pms", "pmdd", "overgangsalder"],
  "hetetokter": ["overgangsalder", "hormoner"],
  "tørr underliv": ["vaginal tørrhet", "overgangsalder"],
  "kløe underliv": ["vulvalidelser", "vaginal tørrhet"],
  "smerter ved samleie": ["vulvalidelser", "vaginisme", "endometriose"],
  "lekker urin": ["urinlekkasje", "inkontinens"],
  "tisser ofte": ["urinlekkasje", "blære"],

  // Livsfaser / intent
  "vil ha barn": ["fertilitet", "ivf", "assistert befruktning", "infertilitet"],
  "blir ikke gravid": ["infertilitet", "fertilitet", "ivf", "hormonforstyrrelser"],
  "barnløshet": ["infertilitet", "fertilitet", "ivf"],
  "fryse egg": ["eggfrys", "fertilitet"],
  "utsette barn": ["eggfrys", "fertilitet"],
  "single mor": ["donorbehandling", "assistert befruktning"],
  "lesbisk par": ["donorbehandling", "assistert befruktning"],
  "gravid": ["ultralyd", "nipt", "fostermedisin", "graviditet"],
  "etter fødsel": ["6-ukerskontroll", "traumatisk fødsel"],
  "redd for å føde": ["fødselsangst"],

  // Kjønn / kategorier
  "menn": ["urologi", "prostata", "mannlig infertilitet", "forhud"],
  "mann": ["urologi", "prostata", "mannlig infertilitet"],
  "kvinne": ["gynekologi", "kvinnehelse"],
  "kvinner": ["gynekologi", "kvinnehelse"],

  // Ortopedi
  "vondt i kne": ["kne", "ortopedi"],
  "vondt i hofte": ["hofte", "ortopedi"],
  "vondt i fot": ["fot og ankel", "ortopedi"],
  "tennisalbue": ["hånd og albue", "ortopedi"],

  // Generelle
  "hpv": ["celleforandringer", "celleprøve"],
  "papillom": ["celleforandringer"],
  "klump": ["cyster", "gynekologi"],
  "operasjon": ["kirurgi", "robotassistert kirurgi"],
  "kikkert": ["hysteroskopi", "robotassistert kirurgi"],
  "slanking": ["overvektskirurgi", "ernæringsfysiolog"],
  "vekt": ["overvektskirurgi", "ernæringsfysiolog", "endokrinologi"],
  "hud": ["hudlege"],
  "kvise": ["hudlege"],
  "utslett": ["hudlege"],
  "psykolog": ["psykologi"],
  "samliv": ["sexologi", "psykologi"],
  "sex": ["sexologi"],
};

/**
 * Utvider et søkeord med synonymer/intent-mapping.
 * Returnerer original query + alle matchende synonym-termer.
 */
export function expandQuery(query: string): string {
  const normalized = query.toLowerCase().trim();
  if (!normalized) return query;

  const additions: string[] = [];
  for (const [phrase, terms] of Object.entries(synonymMap)) {
    if (normalized.includes(phrase)) {
      additions.push(...terms);
    }
  }

  if (additions.length === 0) return query;
  return `${query} ${additions.join(" ")}`;
}
