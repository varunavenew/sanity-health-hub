/**
 * Dual-read aggregate ratings: prefer Site Settings → Business Reputation,
 * then legacy googleReviewSettings, then optional page-level overrides.
 */

export type BusinessReputationRatings = {
  googleAverageRating: number;
  legelistenAverageRating: number;
};

const DEFAULT_GOOGLE = 4.6;
const DEFAULT_LEGE = 4.8;

function readRating(value: unknown, fallback: number): number {
  return typeof value === "number" && value >= 1 && value <= 5 ? value : fallback;
}

export function resolveBusinessReputationRatings(
  siteSettingsReputation: unknown,
  legacySettings: unknown,
  pageGoogleRating?: unknown,
  pageLegelistenRating?: unknown,
): BusinessReputationRatings {
  const siteRep =
    siteSettingsReputation && typeof siteSettingsReputation === "object"
      ? (siteSettingsReputation as Record<string, unknown>)
      : null;
  const legacy =
    legacySettings && typeof legacySettings === "object"
      ? (legacySettings as Record<string, unknown>)
      : null;

  const googleFromSite = siteRep ? readRating(siteRep.googleAverageRating, NaN) : NaN;
  const legeFromSite = siteRep ? readRating(siteRep.legelistenAverageRating, NaN) : NaN;

  const googleFromLegacy = legacy
    ? readRating(legacy.googleAverageRating, NaN)
    : NaN;
  const legeFromLegacy = legacy
    ? readRating(legacy.legelistenAverageRating, NaN)
    : NaN;

  return {
    googleAverageRating: readRating(
      pageGoogleRating,
      Number.isFinite(googleFromSite)
        ? googleFromSite
        : Number.isFinite(googleFromLegacy)
          ? googleFromLegacy
          : DEFAULT_GOOGLE,
    ),
    legelistenAverageRating: readRating(
      pageLegelistenRating,
      Number.isFinite(legeFromSite)
        ? legeFromSite
        : Number.isFinite(legeFromLegacy)
          ? legeFromLegacy
          : DEFAULT_LEGE,
    ),
  };
}
