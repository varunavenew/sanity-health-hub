import { normalizeFocalPoint } from "@/lib/media/focal-point";
import { sanityImagePixelSize } from "@/lib/sanity/image-url";
import type { ResolvedCmsMedia } from "@/lib/sanity/media-dual-read";

export type CategoryHeroLayout = "split" | "full";

export type CategoryHeroFraming = {
  /** CSS object-position when no meaningful editor hotspot */
  objectPosition?: string;
  /** Parallax zoom — lower keeps more of portrait faces in frame */
  coverScale: number;
  parallaxSpeed: number;
};

function isPortraitSource(src: string): boolean {
  const size = sanityImagePixelSize(src);
  if (!size || size.width <= 0) return false;
  return size.height / size.width > 1.05;
}

function isLandscapeSource(src: string): boolean {
  const size = sanityImagePixelSize(src);
  if (!size || size.height <= 0) return false;
  return size.width / size.height > 1.15;
}

/** Default center hotspot from Sanity — treat as “unset” for auto framing. */
function isDefaultCenterHotspot(media: ResolvedCmsMedia): boolean {
  const fp = normalizeFocalPoint(media.hotspot);
  if (!fp) return true;
  return Math.abs(fp.x - 0.5) < 0.02 && Math.abs(fp.y - 0.5) < 0.02;
}

/**
 * Split category heroes use a tall half-column; portrait uploads need a higher
 * focal bias unless editors set a non-center hotspot.
 */
export function categoryHeroFraming(
  media: ResolvedCmsMedia | null,
  layout: CategoryHeroLayout,
): CategoryHeroFraming {
  const isSplit = layout === "split";

  const base: CategoryHeroFraming = {
    coverScale: isSplit ? 1.02 : 1.08,
    parallaxSpeed: isSplit ? 0.1 : 0.14,
  };

  if (!media || media.kind !== "image" || !media.src) {
    return base;
  }

  if (!isDefaultCenterHotspot(media)) {
    return base;
  }

  if (isSplit) {
    if (isPortraitSource(media.src)) {
      return { ...base, objectPosition: "50% 32%" };
    }
    if (isLandscapeSource(media.src)) {
      return { ...base, objectPosition: "50% 48%" };
    }
    return { ...base, objectPosition: "50% 38%" };
  }

  // Full-width banner
  if (isPortraitSource(media.src)) {
    return { ...base, objectPosition: "50% 36%" };
  }
  return { ...base, objectPosition: "50% 42%" };
}
