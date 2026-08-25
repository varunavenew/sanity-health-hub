"use client";

import type { CSSProperties } from "react";
import { ResponsiveHeroMedia } from "@/components/media/ResponsiveHeroMedia";
import { useParallaxOffset } from "@/components/ui/ParallaxImage";
import { cn } from "@/lib/utils";
import { assetSrc, type ImageRef } from "@/lib/media";
import type { MediaFocalPoint, SanityHotspot } from "@/lib/media/focal-point";
import type { ResolvedCmsMedia } from "@/lib/sanity/media-dual-read";

interface SplitHeroMediaProps {
  src?: ImageRef | string;
  video?: string;
  media?: ResolvedCmsMedia | null;
  alt: string;
  className?: string;
  mediaClassName?: string;
  objectPosition?: string;
  speed?: number;
  loading?: "lazy" | "eager";
  hotspot?: SanityHotspot | MediaFocalPoint | null;
}

export const SplitHeroMedia = ({
  src,
  video,
  media,
  alt,
  className,
  mediaClassName,
  objectPosition,
  speed = 0.14,
  loading = "eager",
  hotspot,
}: SplitHeroMediaProps) => {
  const { ref, offset, reduced } = useParallaxOffset(speed);
  const imageSrc = typeof src === "string" ? src : src ? assetSrc(src) : "";

  const style: CSSProperties = {
    objectPosition,
    transform: reduced ? undefined : `translate3d(0, ${offset}px, 0) scale(1.14)`,
  };

  const fillClass = cn(
    "absolute inset-0 h-full w-full object-cover will-change-transform",
    mediaClassName,
  );

  return (
    <div
      ref={ref}
      data-hero-parallax=""
      className={cn("relative overflow-hidden", className)}
    >
      {media ? (
        <ResponsiveHeroMedia
          media={media}
          alt={alt}
          hotspot={hotspot}
          objectPosition={objectPosition}
          variant="hero"
          loading={loading}
          autoPlay
          interactive={false}
          className={fillClass}
          style={style}
        />
      ) : video ? (
        <video
          src={video}
          poster={imageSrc || undefined}
          autoPlay
          muted
          loop
          playsInline
          aria-label={alt}
          className={fillClass}
          style={style}
        />
      ) : imageSrc ? (
        <ResponsiveHeroMedia
          src={imageSrc}
          alt={alt}
          hotspot={hotspot}
          objectPosition={objectPosition}
          variant="hero"
          loading={loading}
          className={fillClass}
          style={style}
        />
      ) : null}
    </div>
  );
};
