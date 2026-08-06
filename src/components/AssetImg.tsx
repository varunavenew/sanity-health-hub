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
import type { ImageDeliveryPreset } from "@/lib/media/delivery";
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
  const width =
    imageWidth ?? (preset ? defaultWidthForPreset(preset) : undefined);

  let finalSrc = resolved;
  let finalSrcSet = srcSet;
  let finalSizes = sizes;

  if (optimize && isSanity) {
    finalSrc = optimizeSanityImageUrl(resolved, { ...opts, width });
    if (!finalSrcSet) {
      const generated = buildImageSrcSet(resolved, { ...opts, preset });
      if (generated) finalSrcSet = generated;
    }
    if (!finalSizes && preset) {
      finalSizes = defaultSizesForPreset(preset);
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
