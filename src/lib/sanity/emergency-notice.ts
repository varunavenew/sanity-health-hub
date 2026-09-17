import {
  FLERE_FAGOMRADER_CATEGORY_ID,
  normalizeCategoryRouteKey,
} from "@/lib/sanity/category-keys";

/** Default NO copy — Marte user test #60 / Aina 7 Sep. Edit in Site Settings. */
export const DEFAULT_EMERGENCY_NOTICE_NO =
  "Ved livstruende akutte behov — ring 113.";

export const DEFAULT_EMERGENCY_NOTICE_EN =
  "In life-threatening emergencies — call 113.";

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

export function resolveEmergencyNoticeText(
  cmsText: string | null | undefined,
  lang: "no" | "en",
): string {
  const fromCms = cmsText?.trim();
  if (fromCms) return fromCms;
  return lang === "en"
    ? DEFAULT_EMERGENCY_NOTICE_EN
    : DEFAULT_EMERGENCY_NOTICE_NO;
}

export function isAkuttSegment(id?: string, title?: string): boolean {
  if (id?.trim().toLowerCase() === "akutt") return true;
  const t = title?.trim().toLowerCase() ?? "";
  return t.startsWith("akutt skade") || t.startsWith("acute injury");
}
