import { resolveCmsMedia } from "@/lib/sanity/media-dual-read";
import { getImageUrl } from "@/lib/sanity/image-url";

export type SeoShareImageFields = {
  useCustomOgImage?: boolean | null;
  ogImage?: unknown;
};

export type SeoShareImageSource = {
  seo?: SeoShareImageFields | null;
  heroImageUrl?: string | null;
  heroMedia?: unknown;
  /** Specialist portrait (resolved URL). */
  portraitImageUrl?: string | null;
};

/** Hero / portrait URL for SEO when custom sharing image is off. */
export function resolveHeroImageUrlForSeo(source: {
  heroImageUrl?: string | null;
  heroMedia?: unknown;
  portraitImageUrl?: string | null;
}): string | undefined {
  const portrait = source.portraitImageUrl?.trim();
  if (portrait) return portrait;

  const hero = source.heroImageUrl?.trim();
  if (hero) return hero;

  const media = resolveCmsMedia(source.heroMedia, { mediaType: "image" });
  if (media?.kind === "image" && media.src?.trim()) {
    return media.src.trim();
  }
  if (media?.poster?.trim()) {
    return media.poster.trim();
  }

  return undefined;
}

/**
 * Custom SEO image when `useCustomOgImage` is on; otherwise hero / portrait.
 * Returns undefined when neither is set (caller may fall back to brand logo).
 */
export function resolveSeoShareImageUrl(
  source: SeoShareImageSource,
  options?: { width?: number },
): string | undefined {
  const width = options?.width ?? 1200;

  if (source.seo?.useCustomOgImage === true && source.seo.ogImage) {
    const custom = getImageUrl(source.seo.ogImage, { width });
    if (custom?.trim()) return custom.trim();
  }

  return resolveHeroImageUrlForSeo(source);
}
