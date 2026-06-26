// Synonym- og intent-mapping: utvider søkeordet med relevante termer
// slik at folkelige/symptom-baserte søk finner riktige behandlinger.
// Eksempel: "vondt i magen" → matcher endometriose, cyster, blødningsforstyrrelser.

export const synonymMap: Record<string, string[]> = {
  // ─────────────── Symptomer → behandlinger ───────────────
  "vondt i magen": ["endometriose", "cyster", "blødningsforstyrrelser", "underlivssmerter"],
  "magesmerter": ["endometriose", "cyster", "blødningsforstyrrelser"],
  "menssmerter": ["endometriose", "blødningsforstyrrelser", "pms"],
  "vondt i mensen": ["endometriose", "blødningsforstyrrelser", "pms"],
  "kraftig menstruasjon": ["blødningsforstyrrelser", "endometriose"],
  "uregelmessig mens": ["blødningsforstyrrelser", "hormonforstyrrelser", "pcos"],
  "uteblitt mens": ["overgangsalder", "hormonforstyrrelser"],
  "mellomblødning": ["blødningsforstyrrelser"],
  "humørsvingninger": ["pms", "pmdd", "overgangsalder"],
  "hetetokter": ["overgangsalder", "hormoner"],
  "tørr underliv": ["vaginal tørrhet", "overgangsalder"],
  "kløe underliv": ["vulvalidelser", "vaginal tørrhet"],
  "sviing underliv": ["vulvalidelser"],
  "smerter ved samleie": ["vulvalidelser", "vaginisme", "endometriose"],
  "lekker urin": ["urinlekkasje", "inkontinens"],
  "tisser ofte": ["urinlekkasje", "blære", "prostata"],
  "tyngdefølelse": ["vaginale fremfall", "prolaps"],

  // ─────────────── Livsfaser / intent ───────────────
  "vil ha barn": ["fertilitet", "ivf", "assistert befruktning", "infertilitet"],
  "blir ikke gravid": ["infertilitet", "fertilitet", "ivf", "hormonforstyrrelser"],
  "barnløshet": ["infertilitet", "fertilitet", "ivf"],
  "fryse egg": ["eggfrys", "nedfrysning av egg", "fertilitet"],
  "fryse ned egg": ["eggfrys", "nedfrysning av egg"],
  "utsette barn": ["eggfrys", "fertilitet"],
  "single mor": ["donorbehandling", "assistert befruktning for par og single"],
  "lesbisk par": ["donorbehandling", "assistert befruktning for par og single"],
  "enslig": ["donorbehandling", "assistert befruktning for par og single"],
  "gravid": ["ultralyd", "nipt", "fostermedisin", "graviditet"],
  "etter fødsel": ["6-ukerskontroll", "fødselsskader"],
  "redd for å føde": ["fødselsangst", "svangerskapsteam"],

  // ─────────────── Kjønn / kategorier ───────────────
  "menn": ["urologi", "prostata", "mannlig infertilitet", "forhud", "testikler"],
  "mann": ["urologi", "prostata", "mannlig infertilitet"],
  "kvinne": ["gynekologi", "kvinnehelse"],
  "kvinner": ["gynekologi", "kvinnehelse"],

  // ─────────────── Urologi-symptomer ───────────────
  "vondt i pungen": ["testikler", "urologi"],
  "kul i pungen": ["testikler"],
  "blod i urinen": ["blære og urinveier", "urologi"],
  "vannlatningsproblemer": ["prostata", "blære og urinveier"],
  "trang forhud": ["forhud"],
  "vasektomi": ["sterilisering", "refertilisering"],

  // ─────────────── Ortopedi ───────────────
  "vondt i kne": ["kne", "ortopedi"],
  "vondt i hofte": ["hofte", "ortopedi"],
  "vondt i fot": ["fot og ankel", "ortopedi"],
  "vondt i skulder": ["skulder", "ortopedi"],
  "tennisalbue": ["hånd og albue", "ortopedi"],
  "musearm": ["hånd og albue", "ortopedi"],
  "meniskskade": ["kne", "ortopedi"],
  "korsbånd": ["kne", "ortopedi"],
  "frossen skulder": ["skulder", "ortopedi"],

  // ─────────────── Generelle ───────────────
  "hpv": ["celleforandringer", "celleprøve"],
  "papillom": ["celleforandringer"],
  "klump": ["cyster", "gynekologi"],
  "operasjon": ["kirurgi", "robotassistert kirurgi"],
  "kikkert": ["hysteroskopi", "robotassistert kirurgi"],
  "kikkertkirurgi": ["robotassistert kirurgi", "hysteroskopi"],
  "robot": ["robotassistert kirurgi"],
  "slanking": ["overvektskirurgi", "ernæringsfysiolog"],
  "vekt": ["overvektskirurgi", "ernæringsfysiolog", "endokrinologi"],
  "fedme": ["overvektskirurgi", "ernæringsfysiolog"],
  "hud": ["hudhelse", "hudbehandlinger"],
  "kvise": ["hudhelse"],
  "akne": ["hudhelse"],
  "utslett": ["hudhelse"],
  "eksem": ["hudhelse"],
  "føflekk": ["hudhelse", "hudbehandlinger"],
  "hudlege": ["hudhelse"],
  "laser": ["hudbehandlinger"],
  "psykolog": ["psykologi"],
  "terapi": ["psykologi", "sexologi"],
  "angst": ["psykologi"],
  "depresjon": ["psykologi"],
  "samliv": ["sexologi", "psykologi"],
  "sex": ["sexologi"],
  "ernæring": ["ernæringsfysiolog"],
  "kosthold": ["ernæringsfysiolog"],
  "diabetes": ["endokrinologi"],
  "stoffskifte": ["endokrinologi"],
  "leddgikt": ["revmatologi"],
  "åreknute": ["åreknuter"],

  // ─────────────── Pris / praktisk ───────────────
  "hva koster": ["priser"],
  "prisliste": ["priser"],
  "helseforsikring": ["forsikring"],
  "lege": ["spesialister"],
  "behandler": ["spesialister"],
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
