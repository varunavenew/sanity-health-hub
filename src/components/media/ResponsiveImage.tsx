"use client";

import { AssetImg, type AssetImgProps } from "@/components/AssetImg";
import {
  focalPointStyle,
  normalizeFocalPoint,
  resolveObjectPosition,
  type MediaFocalPoint,
  type SanityHotspot,
} from "@/lib/media/focal-point";
import {
  mergeMediaClassName,
  mediaVariantFallbackPosition,
  type MediaVariant,
} from "@/lib/media/variants";
import type { CSSProperties } from "react";

export type ResponsiveImageProps = Omit<AssetImgProps, "style"> & {
  /** Framing strategy — see `MediaVariant`. Default: hero */
  variant?: MediaVariant;
  /** Sanity hotspot (0–1) or normalized focal point */
  hotspot?: SanityHotspot | MediaFocalPoint | null;
  /** Explicit CSS object-position overrides hotspot */
  objectPosition?: string;
  style?: CSSProperties;
};

/**
 * Project-wide responsive image primitive.
 * Applies variant fit rules + Sanity focal point without changing layout boxes.
 */
export function ResponsiveImage({
  variant = "hero",
  hotspot,
  objectPosition,
  className,
  style,
  alt = "",
  ...props
}: ResponsiveImageProps) {
  const fallback = mediaVariantFallbackPosition(variant);
  const position = resolveObjectPosition({
    objectPosition,
    hotspot: normalizeFocalPoint(hotspot) ?? hotspot,
    fallback,
  });
  const focal = focalPointStyle(
    normalizeFocalPoint(hotspot),
    position,
  );

  return (
    <AssetImg
      {...props}
      alt={alt}
      className={mergeMediaClassName(variant, className)}
      style={{
        ...style,
        objectPosition: position,
        // CSS variable for variant utilities / background-position consumers
        ["--media-focal" as string]: focal["--media-focal"] ?? position,
      }}
    />
  );
}
