/** URL slug → Sanity treatment document slug for flere-fagomrader / ovrige. */
export const FLERE_FAGOMRADER_SLUG_ALIASES: Record<string, string> = {
  /** Typo / legacy without ae → canonical developer slug. */
  ernaringsfysiolog: "ernaeringsfysiolog",
  /** Long slug before rename to hemorroider. */
  "hemorroider-og-endetarmsplager": "hemorroider",
  /** Demo / marketing aliases → overvektskirurgi. */
  "sleeve-gastrektomi": "overvektskirurgi",
  "bariatrisk-kirurgi": "overvektskirurgi",
  overvektsoperasjon: "overvektskirurgi",
  /** Nested gastro path segments used as bare treatment slugs. */
  brokkbehandling: "brokkoperasjon",
  endetarmsplager: "hemorroider",
};

export function resolveFlereFagomraderTreatmentSlug(urlSlug: string): string {
  const trimmed = urlSlug.trim();
  if (!trimmed) return trimmed;
  return FLERE_FAGOMRADER_SLUG_ALIASES[trimmed] ?? trimmed;
}

/** Candidate slugs to try when fetching (resolved alias first, then raw URL slug). */
export function flereFagomraderTreatmentSlugCandidates(urlSlug: string): string[] {
  const trimmed = urlSlug.trim();
  if (!trimmed) return [];
  const resolved = resolveFlereFagomraderTreatmentSlug(trimmed);
  return resolved === trimmed ? [trimmed] : [resolved, trimmed];
}
