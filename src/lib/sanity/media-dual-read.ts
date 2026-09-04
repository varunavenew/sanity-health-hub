/**
 * Dual-read for the shared Sanity `media` object + legacy hero fields.
 *
 * Shared `media` (preferred):
 *   mediaType = image  → image
 *   mediaType = video  → follow explicit `videoSource`
 *     upload → videoFile
 *     url    → videoUrl (YouTube / Vimeo / direct)
 *
 * Legacy flat fields still dual-read when `media` is empty.
 *
 * Hotspot / crop from Sanity image fields are preserved for responsive framing.
 */

import {
  normalizeFocalPoint,
  type MediaFocalPoint,
  type SanityCrop,
  type SanityHotspot,
} from "../media/focal-point";

export type CmsMediaType = "image" | "video";

/** Explicit video origin on the shared `media` object. */
export type CmsVideoSource = "upload" | "url";

export type ResolvedCmsMedia = {
  kind: CmsMediaType;
  /** Direct image or video file URL (for <img> / <video src>). */
  src?: string;
  /** External watch/page URL (YouTube / Vimeo) — never embed HTML from CMS. */
  externalUrl?: string;
  /** Optional poster / still. */
  poster?: string;
  /** Sanity focal point (0–1), when editors set a hotspot. */
  hotspot?: SanityHotspot | MediaFocalPoint | null;
  /** Optional Sanity crop rectangle (reserved for CDN transforms). */
  crop?: SanityCrop | null;
  /** Echo of CMS videoSource when kind is video (shared media path). */
  videoSource?: CmsVideoSource | null;
};

export type CmsMediaProjection = {
  mediaType?: string | null;
  videoSource?: string | null;
  imageUrl?: string | null;
  imageAssetRef?: string | null;
  videoFileUrl?: string | null;
  videoUrl?: string | null;
  hotspot?: SanityHotspot | null;
  crop?: SanityCrop | null;
};

/**
 * GROQ fragment projecting a `media` object field.
 * Includes videoSource + hotspot/crop so framing and source choice stay explicit.
 */
export const MEDIA_OBJECT_PROJECTION = `{
  mediaType,
  videoSource,
  "imageUrl": image.asset->url,
  "imageAssetRef": image.asset._ref,
  "videoFileUrl": videoFile.asset->url,
  videoUrl,
  "hotspot": image.hotspot,
  "crop": image.crop
}`;

/**
 * GROQ fragment for a standalone Sanity image field with hotspot
 * (e.g. specialist `photo`, card thumbnails).
 */
export const IMAGE_WITH_FOCAL_PROJECTION = `{
  "url": asset->url,
  "asset": { "_ref": asset._ref },
  hotspot,
  crop
}`;

/**
 * Specialist portrait: display URL plus crop/hotspot/asset for the image URL builder.
 */
export const SPECIALIST_PHOTO_PROJECTION = `
  "image": photo.asset->url,
  "imageHotspot": photo.hotspot,
  "imageCrop": photo.crop,
  "imageAssetRef": photo.asset._ref
`;

/**
 * Article `primaryImage`: keep the URL string consumers already use, and
 * project crop/hotspot so listing cards and heroes can frame the same asset.
 */
export const ARTICLE_PRIMARY_IMAGE_PROJECTION = `
  "image": primaryImage.asset->url,
  "imageHotspot": primaryImage.hotspot,
  "imageCrop": primaryImage.crop,
  "imageAssetRef": primaryImage.asset._ref
`;

/** Copy projected hotspot/crop off a GROQ row without dropping nulls. */
export function pickImageFocal(row: {
  imageHotspot?: SanityHotspot | MediaFocalPoint | null;
  imageCrop?: SanityCrop | null;
}): {
  imageHotspot: SanityHotspot | MediaFocalPoint | null;
  imageCrop: SanityCrop | null;
} {
  return {
    imageHotspot: row.imageHotspot ?? null,
    imageCrop: row.imageCrop ?? null,
  };
}

function asUrl(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function looksLikeDirectVideoFile(url: string): boolean {
  try {
    const path = new URL(url).pathname.toLowerCase();
    return path.endsWith(".mp4") || path.endsWith(".webm") || path.endsWith(".mov") || path.endsWith(".ogg");
  } catch {
    return false;
  }
}

function looksLikeExternalHost(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtu.be" ||
      host === "vimeo.com" ||
      host === "player.vimeo.com"
    );
  } catch {
    return false;
  }
}

function attachFocal(
  base: ResolvedCmsMedia,
  hotspot?: SanityHotspot | null,
  crop?: SanityCrop | null,
): ResolvedCmsMedia {
  const focal = normalizeFocalPoint(hotspot);
  return {
    ...base,
    hotspot: hotspot && focal ? { ...hotspot, ...focal } : focal,
    crop: crop || null,
  };
}

function resolveVideoFromUrl(
  videoUrl: string,
  imageUrl: string | undefined,
  hotspot: SanityHotspot | null | undefined,
  crop: SanityCrop | null | undefined,
  videoSource: CmsVideoSource,
): ResolvedCmsMedia {
  if (looksLikeExternalHost(videoUrl) && !looksLikeDirectVideoFile(videoUrl)) {
    return attachFocal(
      { kind: "video", externalUrl: videoUrl, poster: imageUrl, videoSource },
      hotspot,
      crop,
    );
  }
  return attachFocal(
    { kind: "video", src: videoUrl, poster: imageUrl, videoSource },
    hotspot,
    crop,
  );
}

/**
 * Resolve explicit `videoSource`.
 *
 * Pre-migration docs may lack `videoSource`. In that case only, derive source from
 * which field is populated (upload if file exists, else URL) so visuals stay stable
 * until `migrate-media-video-source` has run. Once `videoSource` is set, it is
 * authoritative — no upload-wins when source is `url`.
 */
export function resolveExplicitVideoSource(
  media: Pick<CmsMediaProjection, "videoSource" | "videoFileUrl" | "videoUrl">,
): CmsVideoSource | null {
  if (media.videoSource === "upload" || media.videoSource === "url") {
    return media.videoSource;
  }
  if (asUrl(media.videoFileUrl)) return "upload";
  if (asUrl(media.videoUrl)) return "url";
  return null;
}

/**
 * Resolve preferred `media` object. Returns null when empty so callers can
 * fall back to legacy fields.
 */
export function resolveMediaObject(media: unknown): ResolvedCmsMedia | null {
  if (!media || typeof media !== "object") return null;
  const m = media as CmsMediaProjection;
  const type: CmsMediaType = m.mediaType === "video" ? "video" : "image";
  const imageUrl = asUrl(m.imageUrl);
  const uploadUrl = asUrl(m.videoFileUrl);
  const videoUrl = asUrl(m.videoUrl);

  if (type === "video") {
    const source = resolveExplicitVideoSource(m);

    if (source === "upload") {
      if (uploadUrl) {
        return attachFocal(
          { kind: "video", src: uploadUrl, poster: imageUrl, videoSource: "upload" },
          m.hotspot,
          m.crop,
        );
      }
      // Explicit upload source but missing file — do not fall through to URL.
      if (imageUrl) {
        return attachFocal(
          { kind: "image", src: imageUrl, videoSource: "upload" },
          m.hotspot,
          m.crop,
        );
      }
      return null;
    }

    if (source === "url") {
      if (videoUrl) {
        return resolveVideoFromUrl(videoUrl, imageUrl, m.hotspot, m.crop, "url");
      }
      if (imageUrl) {
        return attachFocal(
          { kind: "image", src: imageUrl, videoSource: "url" },
          m.hotspot,
          m.crop,
        );
      }
      return null;
    }

    // No source and no usable video fields — try image still
    if (imageUrl) {
      return attachFocal({ kind: "image", src: imageUrl }, m.hotspot, m.crop);
    }
    return null;
  }

  if (imageUrl) {
    return attachFocal({ kind: "image", src: imageUrl }, m.hotspot, m.crop);
  }
  return null;
}

export type LegacyHeroMediaInput = {
  mediaType?: string | null;
  imageUrl?: string | null;
  /** Uploaded file URL (category / homepage) or remote URL string (treatment). */
  videoUrl?: string | null;
  /** When true, videoUrl is always treated as a remote/direct URL (treatment). */
  videoIsRemoteUrl?: boolean;
  hotspot?: SanityHotspot | null;
  crop?: SanityCrop | null;
};

/** Map legacy flat hero fields into the same resolved shape. */
export function resolveLegacyHeroMedia(legacy: LegacyHeroMediaInput): ResolvedCmsMedia | null {
  const preferVideo = legacy.mediaType === "video";
  const imageUrl = asUrl(legacy.imageUrl);
  const videoUrl = asUrl(legacy.videoUrl);

  if (preferVideo) {
    if (videoUrl) {
      if (
        legacy.videoIsRemoteUrl ||
        looksLikeExternalHost(videoUrl) ||
        looksLikeDirectVideoFile(videoUrl)
      ) {
        if (looksLikeExternalHost(videoUrl) && !looksLikeDirectVideoFile(videoUrl)) {
          return attachFocal(
            { kind: "video", externalUrl: videoUrl, poster: imageUrl, videoSource: "url" },
            legacy.hotspot,
            legacy.crop,
          );
        }
        return attachFocal(
          { kind: "video", src: videoUrl, poster: imageUrl, videoSource: "url" },
          legacy.hotspot,
          legacy.crop,
        );
      }
      return attachFocal(
        { kind: "video", src: videoUrl, poster: imageUrl, videoSource: "url" },
        legacy.hotspot,
        legacy.crop,
      );
    }
    if (imageUrl) {
      return attachFocal({ kind: "image", src: imageUrl }, legacy.hotspot, legacy.crop);
    }
    return null;
  }

  if (imageUrl) {
    return attachFocal({ kind: "image", src: imageUrl }, legacy.hotspot, legacy.crop);
  }
  if (videoUrl) {
    if (looksLikeExternalHost(videoUrl) && !looksLikeDirectVideoFile(videoUrl)) {
      return attachFocal(
        { kind: "video", externalUrl: videoUrl, poster: imageUrl, videoSource: "url" },
        legacy.hotspot,
        legacy.crop,
      );
    }
    return attachFocal(
      { kind: "video", src: videoUrl, poster: imageUrl, videoSource: "url" },
      legacy.hotspot,
      legacy.crop,
    );
  }
  return null;
}

/** Prefer new media object, then legacy. */
export function resolveCmsMedia(
  media: unknown,
  legacy: LegacyHeroMediaInput,
): ResolvedCmsMedia | null {
  return resolveMediaObject(media) || resolveLegacyHeroMedia(legacy);
}

/** Resolve a standalone image field projected with IMAGE_WITH_FOCAL_PROJECTION. */
export function resolveImageWithFocal(image: unknown): {
  url: string;
  hotspot: MediaFocalPoint | null;
  crop: SanityCrop | null;
} | null {
  if (!image) return null;
  if (typeof image === "string") {
    const url = asUrl(image);
    return url ? { url, hotspot: null, crop: null } : null;
  }
  if (typeof image !== "object") return null;
  const row = image as {
    url?: string | null;
    asset?: { url?: string | null };
    hotspot?: SanityHotspot | null;
    crop?: SanityCrop | null;
  };
  const url = asUrl(row.url) || asUrl(row.asset?.url);
  if (!url) return null;
  return {
    url,
    hotspot: normalizeFocalPoint(row.hotspot),
    crop: row.crop || null,
  };
}
