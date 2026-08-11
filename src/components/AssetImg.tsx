import * as React from "react";
import { assetSrc, type ImageRef } from "@/lib/media";
import {
  buildImageSrcSet,
  defaultSizesForPreset,
  defaultWidthForPreset,
  isSanityCdnUrl,
  optimizeSanityImageUrl,
  type OptimizeImageOptions,
} from "@/lib/sanity/image-url";
import {
  DEFAULT_CONTENT_SIZES,
  DEFAULT_CONTENT_WIDTH,
  type ImageDeliveryPreset,
} from "@/lib/media/delivery";
import type { SanityCrop } from "@/lib/media/focal-point";

export type AssetImgProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: ImageRef;
  /** Delivery preset for default width / sizes / srcset */
  preset?: ImageDeliveryPreset;
  /** Explicit width for the default `src` (overrides preset default) */
  imageWidth?: number;
  quality?: number;
  crop?: SanityCrop | null;
  /** When false, skip CDN optimization (rare). Default true. */
  optimize?: boolean;
};

/**
 * `<img>` wrapper: accepts string URLs and static image imports.
 * Sanity CDN URLs get auto=format, quality, width, srcset, and sizes.
 *
 * When no preset/width is provided for a Sanity asset, a safe content
 * default is applied so the browser never downloads the full original.
 */
export function AssetImg({
  src,
  alt = "",
  preset,
  imageWidth,
  quality,
  crop,
  optimize = true,
  loading,
  decoding,
  sizes,
  srcSet,
  ...props
}: AssetImgProps) {
  const resolved = assetSrc(src);
  if (!resolved) return null;

  const opts: OptimizeImageOptions = { quality, crop };
  const isSanity = isSanityCdnUrl(resolved) || resolved.startsWith("image-");

  // Sanity images without an explicit delivery intent get content defaults.
  const effectivePreset: ImageDeliveryPreset | undefined =
    preset ?? (optimize && isSanity && imageWidth == null ? "content" : undefined);

  const width =
    imageWidth ??
    (effectivePreset ? defaultWidthForPreset(effectivePreset) : undefined) ??
    (optimize && isSanity ? DEFAULT_CONTENT_WIDTH : undefined);

  let finalSrc = resolved;
  let finalSrcSet = srcSet;
  let finalSizes = sizes;

  if (optimize && isSanity) {
    finalSrc = optimizeSanityImageUrl(resolved, { ...opts, width });
    if (!finalSrcSet) {
      const generated = buildImageSrcSet(resolved, {
        ...opts,
        preset: effectivePreset,
      });
      if (generated) finalSrcSet = generated;
    }
    if (!finalSizes) {
      finalSizes = effectivePreset
        ? defaultSizesForPreset(effectivePreset)
        : DEFAULT_CONTENT_SIZES;
    }
  }

  return (
    <img
      {...props}
      src={finalSrc}
      srcSet={finalSrcSet}
      sizes={finalSizes}
      alt={alt}
      loading={loading}
      decoding={decoding ?? (loading === "eager" ? "sync" : "async")}
    />
  );
}
