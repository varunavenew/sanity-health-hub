/**
 * Dual-read for the shared Sanity `media` object + legacy hero fields.
 *
 * Priority (video):
 *   1. media.videoFile (upload)
 *   2. media.videoUrl (YouTube / Vimeo / direct)
 *   3. legacy upload / URL fields
 *
 * Image:
 *   media.image → legacy image fields
 */

export type CmsMediaType = "image" | "video";

export type ResolvedCmsMedia = {
  kind: CmsMediaType;
  /** Direct image or video file URL (for <img> / <video src>). */
  src?: string;
  /** External watch/page URL (YouTube / Vimeo) — never embed HTML from CMS. */
  externalUrl?: string;
  /** Optional poster / still. */
  poster?: string;
};

export type CmsMediaProjection = {
  mediaType?: string | null;
  imageUrl?: string | null;
  videoFileUrl?: string | null;
  videoUrl?: string | null;
};

/** GROQ fragment projecting a `media` object field. */
export const MEDIA_OBJECT_PROJECTION = `{
  mediaType,
  "imageUrl": image.asset->url,
  "videoFileUrl": videoFile.asset->url,
  videoUrl
}`;

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
    if (uploadUrl) {
      return { kind: "video", src: uploadUrl, poster: imageUrl };
    }
    if (videoUrl) {
      if (looksLikeExternalHost(videoUrl) && !looksLikeDirectVideoFile(videoUrl)) {
        return { kind: "video", externalUrl: videoUrl, poster: imageUrl };
      }
      return { kind: "video", src: videoUrl, poster: imageUrl };
    }
    // Incomplete video selection — try image still rather than nothing
    if (imageUrl) return { kind: "image", src: imageUrl };
    return null;
  }

  if (imageUrl) return { kind: "image", src: imageUrl };
  return null;
}

export type LegacyHeroMediaInput = {
  mediaType?: string | null;
  imageUrl?: string | null;
  /** Uploaded file URL (category / homepage) or remote URL string (treatment). */
  videoUrl?: string | null;
  /** When true, videoUrl is always treated as a remote/direct URL (treatment). */
  videoIsRemoteUrl?: boolean;
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
          return { kind: "video", externalUrl: videoUrl, poster: imageUrl };
        }
        return { kind: "video", src: videoUrl, poster: imageUrl };
      }
      return { kind: "video", src: videoUrl, poster: imageUrl };
    }
    if (imageUrl) return { kind: "image", src: imageUrl };
    return null;
  }

  if (imageUrl) return { kind: "image", src: imageUrl };
  if (videoUrl) {
    if (looksLikeExternalHost(videoUrl) && !looksLikeDirectVideoFile(videoUrl)) {
      return { kind: "video", externalUrl: videoUrl, poster: imageUrl };
    }
    return { kind: "video", src: videoUrl, poster: imageUrl };
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
