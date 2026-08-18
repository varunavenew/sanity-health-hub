/** URL slug → Sanity treatment document slug for flere-fagomrader / ovrige. */
export const FLERE_FAGOMRADER_SLUG_ALIASES: Record<string, string> = {
  /** Typo / legacy without ae → canonical developer slug. */
  ernaringsfysiolog: "ernaeringsfysiolog",
  /** Long slug before rename to hemorroider. */
  "hemorroider-og-endetarmsplager": "hemorroider",
  hemorroider: "hemorroider-og-endetarmsplager",
  /** Production still uses the marketing long slug. */
  areknuter: "areknutebehandling",
  areknutebehandling: "areknuter",
  /** Demo / marketing aliases → overvektskirurgi. */
  "sleeve-gastrektomi": "overvektskirurgi",
  "bariatrisk-kirurgi": "overvektskirurgi",
  overvektsoperasjon: "overvektskirurgi",
  /** Nested gastro path segments used as bare treatment slugs. */
  brokkbehandling: "brokkoperasjon",
  endetarmsplager: "hemorroider",
  physician: "hudlege",
  "skin-health": "hudhelse",
  dietitian: "ernaeringsfysiolog",
  "digestive-system-surg-procedure": "gastrokirurgi",
  "med-osteopathic": "osteopati",
  "obesity-surgery": "overvektskirurgi",
  "procedure-reconstructive-surg": "plastikkirurgi",
  psychol: "psykologi",
  rheumatol: "revmatologi",
  sexol: "sexologi",
};

export function resolveFlereFagomraderTreatmentSlug(urlSlug: string): string {
  const trimmed = urlSlug.trim();
  if (!trimmed) return trimmed;
  return FLERE_FAGOMRADER_SLUG_ALIASES[trimmed] ?? trimmed;
}

/** Candidate slugs to try when fetching (URL slug + production/developer alias). */
export function flereFagomraderTreatmentSlugCandidates(urlSlug: string): string[] {
  const trimmed = urlSlug.trim();
  if (!trimmed) return [];
  const resolved = resolveFlereFagomraderTreatmentSlug(trimmed);
  return [...new Set([trimmed, resolved].filter(Boolean))];
}
