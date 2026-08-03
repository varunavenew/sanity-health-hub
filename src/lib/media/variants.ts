/**
 * Shared responsive media variants for CMedical.
 *
 * These control object-fit / framing only — not page layout or spacing.
 */

export type MediaVariant = "hero" | "profile" | "card" | "background" | "gallery";

export type MediaFitMode = "cover" | "contain";

type VariantConfig = {
  /** Base object-fit */
  fit: MediaFitMode;
  /**
   * On large desktops / ultrawide, prefer contain for portraits so faces aren't
   * side-cropped. Cover remains the default for marketing heroes.
   */
  largeScreenFit?: MediaFitMode;
  /** Default object-position when no Sanity hotspot is present */
  fallbackPosition: string;
  /** Utility class applied to the media element */
  className: string;
};

export const MEDIA_VARIANT_CONFIG: Record<MediaVariant, VariantConfig> = {
  hero: {
    fit: "cover",
    fallbackPosition: "50% 50%",
    className: "cm-media cm-media--hero",
  },
  profile: {
    fit: "cover",
    // Prefer full subject on wide half-columns (specialist / portrait heroes).
    largeScreenFit: "contain",
    fallbackPosition: "50% 20%",
    className: "cm-media cm-media--profile",
  },
  card: {
    fit: "cover",
    fallbackPosition: "50% 20%",
    className: "cm-media cm-media--card",
  },
  background: {
    fit: "cover",
    fallbackPosition: "50% 50%",
    className: "cm-media cm-media--background",
  },
  gallery: {
    fit: "cover",
    fallbackPosition: "50% 50%",
    className: "cm-media cm-media--gallery",
  },
};

export function mediaVariantClass(variant: MediaVariant = "hero"): string {
  return MEDIA_VARIANT_CONFIG[variant].className;
}

export function mediaVariantFallbackPosition(variant: MediaVariant = "hero"): string {
  return MEDIA_VARIANT_CONFIG[variant].fallbackPosition;
}

/**
 * Merge caller className with variant utilities.
 * Strips conflicting object-fit / object-position utilities so the variant owns framing.
 */
export function mergeMediaClassName(
  variant: MediaVariant,
  className?: string,
): string {
  const cleaned = (className || "")
    .split(/\s+/)
    .filter(Boolean)
    .filter(
      (token) =>
        !token.startsWith("object-") &&
        token !== "object-cover" &&
        token !== "object-contain" &&
        token !== "object-fill" &&
        token !== "object-none" &&
        token !== "object-scale-down",
    )
    .join(" ");

  return [mediaVariantClass(variant), cleaned].filter(Boolean).join(" ");
}
