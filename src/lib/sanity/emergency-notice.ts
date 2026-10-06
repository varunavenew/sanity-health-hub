import {
  FLERE_FAGOMRADER_CATEGORY_ID,
  normalizeCategoryRouteKey,
} from "@/lib/sanity/category-keys";

export type EmergencyNoticePlacement = "akutt-accordion" | "hero" | null;

/**
 * Category rule: 113 line on Ortopedi, Gynekologi, Øvrige — never Fertilitet.
 * Placement differs: under the Akutt accordion on Ortopedi, under hero CTAs elsewhere.
 */
export function emergencyNoticePlacement(
  categoryId: string,
): EmergencyNoticePlacement {
  const key = normalizeCategoryRouteKey(categoryId);
  if (key === "ortopedi") return "akutt-accordion";
  if (key === "gynekologi" || key === FLERE_FAGOMRADER_CATEGORY_ID) {
    return "hero";
  }
  return null;
}

/** Site Settings text only — empty field hides the notice. */
export function resolveEmergencyNoticeText(
  cmsText: string | null | undefined,
): string | undefined {
  return cmsText?.trim() || undefined;
}

export function isAkuttSegment(id?: string, title?: string): boolean {
  if (id?.trim().toLowerCase() === "akutt") return true;
  const t = title?.trim().toLowerCase() ?? "";
  return t.startsWith("akutt skade") || t.startsWith("acute injury");
}
