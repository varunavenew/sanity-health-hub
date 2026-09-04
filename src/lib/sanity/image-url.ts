/**
 * Client-safe Sanity image URL helpers.
 * Uses NEXT_PUBLIC_* env vars only — safe to import from client components.
 *
 * Prefer passing the full Sanity image object (asset + crop + hotspot) so
 * `@sanity/image-url` can emit `rect` from editor crop. Hotspot is also
 * attached to the source; CSS `object-position` keeps faces visible as the
 * container aspect ratio changes (heroes use object-fit: cover).
 */

import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import {
  IMAGE_QUALITY,
  IMAGE_SRCSET_WIDTHS,
  type ImageDeliveryPreset,
  IMAGE_PRESET,
} from "@/lib/media/delivery";
import type { MediaFocalPoint, SanityCrop, SanityHotspot } from "@/lib/media/focal-point";

function readProjectId(): string {
  return (
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ||
    process.env.SANITY_PROJECT_ID?.trim() ||
    ""
  );
}

function readDataset(): string {
  return (
    process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() ||
    process.env.SANITY_DATASET?.trim() ||
    ""
  );
}

function getBuilder() {
  const projectId = readProjectId();
  const dataset = readDataset();
  if (!projectId || !dataset) return null;
  return createImageUrlBuilder({ projectId, dataset });
}

export type OptimizeImageOptions = {
  width?: number;
  height?: number;
  quality?: number;
  /** Sanity crop (0–1 edges). Applied via the image URL builder as `rect`. */
  crop?: SanityCrop | null;
  /** Sanity hotspot — included on the image source passed to `@sanity/image-url`. */
  hotspot?: SanityHotspot | MediaFocalPoint | null;
  fit?: "max" | "clip" | "crop" | "fill" | "min";
};

function stripUrlQuery(url: string): string {
  const q = url.indexOf("?");
  return q === -1 ? url : url.slice(0, q);
}

function hotspotToSpec(
  hotspot?: SanityHotspot | MediaFocalPoint | null,
): SanityHotspot | undefined {
  if (!hotspot || typeof hotspot !== "object") return undefined;
  const x = typeof hotspot.x === "number" && Number.isFinite(hotspot.x) ? hotspot.x : undefined;
  const y = typeof hotspot.y === "number" && Number.isFinite(hotspot.y) ? hotspot.y : undefined;
  if (x === undefined && y === undefined) return undefined;
  const spec: SanityHotspot = { x: x ?? 0.5, y: y ?? 0.5 };
  if ("width" in hotspot && typeof hotspot.width === "number") spec.width = hotspot.width;
  if ("height" in hotspot && typeof hotspot.height === "number") spec.height = hotspot.height;
  return spec;
}

function hasEffectiveCrop(crop?: SanityCrop | null): crop is SanityCrop {
  if (!crop) return false;
  return (
    (crop.top ?? 0) !== 0 ||
    (crop.bottom ?? 0) !== 0 ||
    (crop.left ?? 0) !== 0 ||
    (crop.right ?? 0) !== 0
  );
}

/**
 * Rebuild a Sanity image source so `@sanity/image-url` receives crop/hotspot,
 * not only a raw CDN URL or asset id.
 */
export function toSanityImageSource(
  urlOrRef: string,
  crop?: SanityCrop | null,
  hotspot?: SanityHotspot | MediaFocalPoint | null,
): SanityImageSource {
  const hotspotSpec = hotspotToSpec(hotspot);
  const image: {
    asset: { _ref?: string; url?: string };
    crop?: SanityCrop;
    hotspot?: SanityHotspot;
  } = urlOrRef.startsWith("http")
    ? { asset: { url: stripUrlQuery(urlOrRef) } }
    : { asset: { _ref: urlOrRef } };
  if (hasEffectiveCrop(crop)) image.crop = crop;
  if (hotspotSpec) image.hotspot = hotspotSpec;
  return image;
}

function mergeImageSource(
  source: SanityImageSource,
  crop?: SanityCrop | null,
  hotspot?: SanityHotspot | MediaFocalPoint | null,
): SanityImageSource {
  if (typeof source === "string") {
    return toSanityImageSource(source, crop, hotspot);
  }
  if (!source || typeof source !== "object") return source;
  const obj = source as {
    crop?: SanityCrop;
    hotspot?: SanityHotspot;
    asset?: { _ref?: string; url?: string };
    url?: string;
  };
  const hotspotSpec = hotspotToSpec(hotspot) ?? obj.hotspot;
  const nextCrop = crop ?? obj.crop;
  return {
    ...obj,
    ...(hasEffectiveCrop(nextCrop) ? { crop: nextCrop } : {}),
    ...(hotspotSpec ? { hotspot: hotspotSpec } : {}),
  } as SanityImageSource;
}

function buildFromSource(
  source: SanityImageSource,
  options: OptimizeImageOptions,
): string | null {
  const builder = getBuilder();
  if (!builder) return null;
  try {
    let img = builder
      .image(mergeImageSource(source, options.crop, options.hotspot))
      .auto("format")
      .quality(options.quality ?? IMAGE_QUALITY)
      .fit(
        options.fit ??
          (options.width != null && options.height != null ? "crop" : "max"),
      );
    if (options.width) img = img.width(options.width);
    if (options.height) img = img.height(options.height);
    return img.url();
  } catch {
    return null;
  }
}

/** True when URL is a Sanity image CDN asset. */
export function isSanityCdnUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname;
    return host === "cdn.sanity.io" && url.includes("/images/");
  } catch {
    return false;
  }
}

/**
 * Parse `…/{id}-{w}x{h}.{ext}` from a Sanity image CDN URL.
 */
function parseSanityImagePath(url: string): {
  originAndPath: string;
  width: number;
  height: number;
} | null {
  try {
    const u = new URL(url);
    const match = u.pathname.match(/\/([^/]+)-(\d+)x(\d+)\.([a-z0-9]+)$/i);
    if (!match) return null;
    return {
      originAndPath: `${u.origin}${u.pathname}`,
      width: Number(match[2]),
      height: Number(match[3]),
    };
  } catch {
    return null;
  }
}

/**
 * Apply Sanity fractional crop as a `rect` query on a CDN URL.
 */
function applyCropRect(url: string, crop: SanityCrop | null | undefined): string {
  if (!crop || !isSanityCdnUrl(url)) return url;
  const parsed = parseSanityImagePath(url);
  if (!parsed) return url;
  const { width: iw, height: ih } = parsed;
  const left = Math.max(0, Math.min(1, crop.left ?? 0));
  const top = Math.max(0, Math.min(1, crop.top ?? 0));
  const right = Math.max(0, Math.min(1, crop.right ?? 0));
  const bottom = Math.max(0, Math.min(1, crop.bottom ?? 0));
  const x = Math.round(left * iw);
  const y = Math.round(top * ih);
  const w = Math.max(1, Math.round(iw * (1 - left - right)));
  const h = Math.max(1, Math.round(ih * (1 - top - bottom)));
  if (w >= iw && h >= ih && x === 0 && y === 0) return url;
  return withSanityParams(url, { rect: `${x},${y},${w},${h}` });
}

function withSanityParams(
  url: string,
  params: Record<string, string | number | undefined>,
): string {
  try {
    const u = new URL(url);
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === "") continue;
      u.searchParams.set(key, String(value));
    }
    return u.toString();
  } catch {
    return url;
  }
}

/**
 * Optimize an existing Sanity CDN URL (or pass-through non-Sanity URLs).
 * Uses `@sanity/image-url` with crop/hotspot when present so requests are
 * not limited to a raw asset + `fit=max`.
 */
export function optimizeSanityImageUrl(
  url: string,
  options: OptimizeImageOptions = {},
): string {
  if (!url) return "";
  if (!isSanityCdnUrl(url)) return url;

  const built = buildFromSource(toSanityImageSource(url, options.crop, options.hotspot), options);
  if (built) return built;

  let next = applyCropRect(url, options.crop);
  const quality = options.quality ?? IMAGE_QUALITY;
  const fit =
    options.fit ??
    (options.width != null && options.height != null ? "crop" : "max");
  const hotspotSpec = hotspotToSpec(options.hotspot);
  next = withSanityParams(next, {
    auto: "format",
    q: quality,
    fit,
    ...(options.width ? { w: options.width } : {}),
    ...(options.height ? { h: options.height } : {}),
    ...(fit === "crop" && hotspotSpec
      ? { crop: "focalpoint", "fp-x": hotspotSpec.x, "fp-y": hotspotSpec.y }
      : {}),
  });
  return next;
}

/**
 * Build a CDN URL from an image asset `_ref` (or pass through http URLs).
 */
export function urlForImageRef(
  ref: string,
  options: OptimizeImageOptions = {},
): string {
  if (!ref) return "";
  if (ref.startsWith("http")) {
    return optimizeSanityImageUrl(ref, options);
  }

  const built = buildFromSource(toSanityImageSource(ref, options.crop, options.hotspot), options);
  if (built) return built;

  const projectId = readProjectId();
  const dataset = readDataset();
  if (!projectId || !dataset) return "";
  const parts = ref.replace("image-", "").split("-");
  const format = parts.pop();
  const id = parts.join("-");
  const base = `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.${format}`;
  return optimizeSanityImageUrl(base, options);
}

/** Alias used by portable text and legacy imports. */
export const urlFor = urlForImageRef;

/**
 * Build from a full Sanity image object (asset + hotspot/crop) when available.
 */
export function urlForImage(
  source: SanityImageSource | string | null | undefined,
  options: OptimizeImageOptions = {},
): string {
  if (!source) return "";
  if (typeof source === "string") return urlForImageRef(source, options);

  const built = buildFromSource(source, options);
  if (built) return built;

  const obj = source as {
    asset?: { _ref?: string; url?: string };
    url?: string;
    crop?: SanityCrop;
    hotspot?: SanityHotspot;
  };
  const merged: OptimizeImageOptions = {
    ...options,
    crop: options.crop ?? obj.crop,
    hotspot: options.hotspot ?? obj.hotspot,
  };
  if (obj.asset?._ref) return urlForImageRef(obj.asset._ref, merged);
  if (obj.asset?.url) return optimizeSanityImageUrl(obj.asset.url, merged);
  if (typeof obj.url === "string") return optimizeSanityImageUrl(obj.url, merged);
  return "";
}

export function getImageUrl(
  image: unknown,
  options: OptimizeImageOptions = {},
): string {
  return urlForImage(image as SanityImageSource, options);
}

export type SrcSetOptions = OptimizeImageOptions & {
  widths?: readonly number[];
  preset?: ImageDeliveryPreset;
};

/** Build a responsive srcset for a Sanity CDN image (or empty for non-CDN). */
export function buildImageSrcSet(
  urlOrRef: string,
  options: SrcSetOptions = {},
): string {
  if (!urlOrRef) return "";
  const source = toSanityImageSource(urlOrRef, options.crop, options.hotspot);
  const probe = urlForImage(source, { quality: options.quality, crop: options.crop, hotspot: options.hotspot });
  if (!isSanityCdnUrl(probe) && !urlOrRef.startsWith("image-") && !isSanityCdnUrl(urlOrRef)) {
    return "";
  }

  const widths =
    options.widths ??
    (options.preset ? IMAGE_PRESET[options.preset].widths : IMAGE_SRCSET_WIDTHS);

  return widths
    .map((w) => `${urlForImage(source, { ...options, width: w })} ${w}w`)
    .join(", ");
}

export function defaultSizesForPreset(preset: ImageDeliveryPreset): string {
  return IMAGE_PRESET[preset].sizes;
}

export function defaultWidthForPreset(preset: ImageDeliveryPreset): number {
  return IMAGE_PRESET[preset].defaultWidth;
}

/**
 * Optimize a Sanity CDN URL for CSS `background-image` (no srcset).
 * Non-Sanity URLs pass through unchanged.
 */
export function optimizeBackgroundImageUrl(
  url: string,
  options: OptimizeImageOptions = {},
): string {
  if (!url) return "";
  return optimizeSanityImageUrl(url, {
    width: options.width ?? IMAGE_PRESET.hero.defaultWidth,
    quality: options.quality ?? IMAGE_QUALITY,
    fit: options.fit ?? "max",
    crop: options.crop,
    hotspot: options.hotspot,
    height: options.height,
  });
}
