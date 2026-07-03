/** URL slug → Sanity treatment document slug for fertilitet sub-pages. */
export const FERTILITET_SLUG_ALIASES: Record<string, string> = {
  nedfrysing: "eggfrys",
  "nedfrysing-av-egg": "eggfrys",
};

export function resolveFertilitetTreatmentSlug(urlSlug: string): string {
  const trimmed = urlSlug.trim();
  if (!trimmed) return trimmed;
  return FERTILITET_SLUG_ALIASES[trimmed] ?? trimmed;
}
