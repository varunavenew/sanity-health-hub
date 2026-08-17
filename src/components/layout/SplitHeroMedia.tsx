"use client";

import { ResponsiveHeroMedia } from "@/components/media/ResponsiveHeroMedia";
import { assetSrc, type ImageRef } from "@/lib/media";
import type { MediaFocalPoint, SanityHotspot } from "@/lib/media/focal-point";

interface SplitHeroMediaProps {
  src: ImageRef | string;
  alt: string;
  className?: string;
  mediaClassName?: string;
  loading?: "eager" | "lazy";
  hotspot?: SanityHotspot | MediaFocalPoint | null;
}

/** Right-column media for split-screen heroes — fills its parent box. */
export function SplitHeroMedia({
  src,
  alt,
  className = "split-media",
  mediaClassName,
  loading = "eager",
  hotspot,
}: SplitHeroMediaProps) {
  const imageSrc = typeof src === "string" ? src : assetSrc(src);

  if (!imageSrc) return null;

  return (
    <div className={className}>
      <ResponsiveHeroMedia
        src={imageSrc}
        alt={alt}
        hotspot={hotspot}
        variant="hero"
        loading={loading}
        className={`absolute inset-0 w-full h-full${mediaClassName ? ` ${mediaClassName}` : ""}`}
      />
    </div>
  );
}
