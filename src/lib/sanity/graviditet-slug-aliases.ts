/** URL slug → Sanity treatment document slug for graviditet sub-pages. */
export const GRAVIDITET_SLUG_ALIASES: Record<string, string> = {
  /** Legacy long slug after rename to ultralyd. */
  "ultralyd-i-svangerskapet": "ultralyd",
  /**
   * Demo path `/graviditet/svangerskapsoppfolging` shows the Graviditet
   * overview page (not graviditetsoppfølging / svangerskapsteam).
   */
  svangerskapsoppfolging: "graviditet",
};

export function resolveGraviditetTreatmentSlug(urlSlug: string): string {
  const trimmed = urlSlug.trim();
  if (!trimmed) return trimmed;
  return GRAVIDITET_SLUG_ALIASES[trimmed] ?? trimmed;
}
