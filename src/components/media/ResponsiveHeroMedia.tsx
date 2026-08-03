"use client";

import { CmsMedia } from "@/components/media/CmsMedia";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import type { ResolvedCmsMedia } from "@/lib/sanity/media-dual-read";
import type { MediaFocalPoint, SanityHotspot } from "@/lib/media/focal-point";
import type { MediaVariant } from "@/lib/media/variants";
import type { ImageRef } from "@/lib/media";
import type { CSSProperties } from "react";

export type ResponsiveHeroMediaProps = {
  /** Preferred CMS media (image / video / embed). */
  media?: ResolvedCmsMedia | null;
  /** Fallback image when media is missing. */
  src?: ImageRef | null;
  alt: string;
  variant?: MediaVariant;
  /** Explicit hotspot when media doesn't carry one (legacy URL fields). */
  hotspot?: SanityHotspot | MediaFocalPoint | null;
  objectPosition?: string;
  className?: string;
  style?: CSSProperties;
  loading?: "eager" | "lazy";
  autoPlay?: boolean;
  interactive?: boolean;
};

/**
 * Drop-in fill media for hero / split-hero / profile columns.
 *
 * Parents keep their existing layout boxes (`absolute inset-0`, min-heights).
 * This only centralizes fit + focal-point behaviour.
 */
export function ResponsiveHeroMedia({
  media,
  src,
  alt,
  variant = "hero",
  hotspot,
  objectPosition,
  className = "absolute inset-0 w-full h-full",
  style,
  loading = "lazy",
  autoPlay = true,
  interactive = true,
}: ResponsiveHeroMediaProps) {
  if (media) {
    return (
      <CmsMedia
        media={media}
        alt={alt}
        variant={variant}
        hotspot={hotspot}
        objectPosition={objectPosition}
        className={className}
        style={style}
        loading={loading}
        autoPlay={autoPlay}
        interactive={interactive}
      />
    );
  }

  if (src) {
    return (
      <ResponsiveImage
        src={src}
        alt={alt}
        variant={variant}
        hotspot={hotspot ?? undefined}
        objectPosition={objectPosition}
        className={className}
        style={style}
        loading={loading}
      />
    );
  }

  return null;
}
