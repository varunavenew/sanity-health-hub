/**
 * Tjenester → Urologi items, in reference (avenewdemo) order.
 * Production still uses longer NO slugs for a few pages; keep both URL forms.
 */
export const UROLOGI_NAV_TREATMENT_SLUGS = [
  "blaere",
  "forhud",
  "infertilitet",
  "nyrer",
  "prostata",
  "refertilisering",
  "robotkirurgi",
  "sterilisering",
  "testikler",
] as const;

/** URL slug → Sanity treatment document slug for urologi sub-pages. */
export const UROLOGI_SLUG_ALIASES: Record<string, string> = {
  /** Nav / demo short path ↔ production long slug. */
  blaere: "blaere-og-urinveier",
  "blaere-og-urinveier": "blaere",
  testikler: "testikler-og-pung",
  "testikler-og-pung": "testikler",
  /**
   * Production urologi infertility page still carries the fertility-style slug.
   */
  infertilitet: "fertilitet-infertilitet",
  "fertilitet-infertilitet": "infertilitet",
  "bladder-and-urinary-tract": "blaere",
  foreskin: "forhud",
  "7-56-male-infertility-disorders": "infertilitet",
  "male-infertility": "infertilitet",
  refertilization: "refertilisering",
  /** Demo / nav short path → published treatment slug. */
  robotkirurgi: "robotassistert-kirurgi",
  "robot-assisted-surgery": "robotassistert-kirurgi",
  sterilization: "sterilisering",
  sterilize: "sterilisering",
  "testicles-and-scrotum": "testikler",
};

export function resolveUrologiTreatmentSlug(urlSlug: string): string {
  const trimmed = urlSlug.trim();
  if (!trimmed) return trimmed;
  return UROLOGI_SLUG_ALIASES[trimmed] ?? trimmed;
}

/** Candidate slugs to try when fetching (URL slug + production/developer alias). */
export function urologiTreatmentSlugCandidates(urlSlug: string): string[] {
  const trimmed = urlSlug.trim();
  if (!trimmed) return [];
  const resolved = resolveUrologiTreatmentSlug(trimmed);
  return [...new Set([trimmed, resolved].filter(Boolean))];
}
