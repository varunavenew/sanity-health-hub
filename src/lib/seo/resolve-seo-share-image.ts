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
  /** Homepage heroBanner.slides (GROQ URLs or raw Sanity objects). */
  homepageHeroBanner?: unknown;
};

function asPlainString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** First homepage hero slide image URL (desktop image preferred). */
export function resolveHomepageHeroImageUrl(heroBanner: unknown): string | undefined {
  const slides = (heroBanner as { slides?: unknown[] } | undefined)?.slides;
  if (!Array.isArray(slides) || slides.length === 0) return undefined;

  const slide = slides[0] as Record<string, unknown>;
  const desktopMediaType =
    slide.desktopMediaType === "video" ? "video" : "image";
  const imageUrl = asPlainString(slide.image);
  const mobileImageUrl = asPlainString(slide.mobileImage);

  if (desktopMediaType === "image") {
    const media = resolveCmsMedia(slide.media, {
      mediaType: "image",
      imageUrl: imageUrl || undefined,
    });
    const fromMedia =
      (media?.kind === "image" ? media.src : media?.poster) || imageUrl;
    if (fromMedia?.trim()) return fromMedia.trim();
  }

  if (mobileImageUrl) return mobileImageUrl;

  const fallbackMedia = resolveCmsMedia(slide.media, { mediaType: "image" });
  if (fallbackMedia?.poster?.trim()) return fallbackMedia.poster.trim();

  return undefined;
}

/** Hero / portrait / homepage slide URL for SEO when custom sharing image is off. */
export function resolveHeroImageUrlForSeo(source: {
  heroImageUrl?: string | null;
  heroMedia?: unknown;
  portraitImageUrl?: string | null;
  homepageHeroBanner?: unknown;
}): string | undefined {
  const portrait = source.portraitImageUrl?.trim();
  if (portrait) return portrait;

  const homepage = resolveHomepageHeroImageUrl(source.homepageHeroBanner);
  if (homepage) return homepage;

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

/** Convenience for singleton pages with optional hero fields on the document. */
export function resolveSeoShareImageFromPage(
  seo: SeoShareImageFields | null | undefined,
  page?: {
    heroImage?: string | null;
    heroMedia?: unknown;
    heroBanner?: unknown;
  },
): string | undefined {
  return resolveSeoShareImageUrl({
    seo,
    heroImageUrl: page?.heroImage,
    heroMedia: page?.heroMedia,
    homepageHeroBanner: page?.heroBanner,
  });
}
