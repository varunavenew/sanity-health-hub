/**
 * Client-safe Sanity image URL helpers.
 * Uses NEXT_PUBLIC_* env vars only — safe to import from client components.
 *
 * Builds CDN URLs with auto=format, quality, width, and fit=max so the
 * browser never downloads full originals for display.
 */

import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import {
  IMAGE_QUALITY,
  IMAGE_SRCSET_WIDTHS,
  type ImageDeliveryPreset,
  IMAGE_PRESET,
} from "@/lib/media/delivery";
import type { SanityCrop } from "@/lib/media/focal-point";

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
  /** Sanity crop (0–1 edges). Applied when source is a builder-compatible image. */
  crop?: SanityCrop | null;
  fit?: "max" | "clip" | "crop" | "fill" | "min";
};

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
 * Always sets auto=format, q, fit=max when touching Sanity assets.
 */
export function optimizeSanityImageUrl(
  url: string,
  options: OptimizeImageOptions = {},
): string {
  if (!url) return "";
  if (!isSanityCdnUrl(url)) return url;

  let next = applyCropRect(url, options.crop);
  const quality = options.quality ?? IMAGE_QUALITY;
  next = withSanityParams(next, {
    auto: "format",
    q: quality,
    fit: options.fit ?? "max",
    ...(options.width ? { w: options.width } : {}),
    ...(options.height ? { h: options.height } : {}),
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

  const builder = getBuilder();
  const width = options.width;
  const quality = options.quality ?? IMAGE_QUALITY;

  if (builder) {
    try {
      let img = builder.image(ref).auto("format").quality(quality).fit(options.fit ?? "max");
      if (width) img = img.width(width);
      if (options.height) img = img.height(options.height);
      return img.url();
    } catch {
      /* fall through to manual URL */
    }
  }

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

  const builder = getBuilder();
  const quality = options.quality ?? IMAGE_QUALITY;
  if (builder) {
    try {
      let img = builder
        .image(source)
        .auto("format")
        .quality(quality)
        .fit(options.fit ?? "max");
      if (options.width) img = img.width(options.width);
      if (options.height) img = img.height(options.height);
      return img.url();
    } catch {
      /* fall through */
    }
  }

  const obj = source as { asset?: { _ref?: string; url?: string }; url?: string };
  if (obj.asset?._ref) return urlForImageRef(obj.asset._ref, options);
  if (obj.asset?.url) return optimizeSanityImageUrl(obj.asset.url, options);
  if (typeof obj.url === "string") return optimizeSanityImageUrl(obj.url, options);
  return "";
}

export function getImageUrl(
  image: unknown,
  options: OptimizeImageOptions = {},
): string {
  if (!image) return "";
  if (typeof image === "string") return urlForImageRef(image, options);
  if (typeof image === "object" && image !== null) {
    const obj = image as {
      asset?: { _ref?: string; url?: string };
      url?: string;
    };
    if (obj.asset?._ref) return urlForImageRef(obj.asset._ref, options);
    if (obj.asset?.url) return optimizeSanityImageUrl(obj.asset.url, options);
    if (typeof obj.url === "string") return optimizeSanityImageUrl(obj.url, options);
  }
  return "";
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
  const baseUrl = urlOrRef.startsWith("http")
    ? urlOrRef
    : urlForImageRef(urlOrRef, { quality: options.quality, crop: options.crop });
  if (!isSanityCdnUrl(baseUrl) && !urlOrRef.startsWith("image-")) return "";

  const widths =
    options.widths ??
    (options.preset ? IMAGE_PRESET[options.preset].widths : IMAGE_SRCSET_WIDTHS);

  return widths
    .map((w) => {
      const src = urlOrRef.startsWith("image-")
        ? urlForImageRef(urlOrRef, { ...options, width: w })
        : optimizeSanityImageUrl(baseUrl, { ...options, width: w });
      return `${src} ${w}w`;
    })
    .join(", ");
}

export function defaultSizesForPreset(preset: ImageDeliveryPreset): string {
  return IMAGE_PRESET[preset].sizes;
}

export function defaultWidthForPreset(preset: ImageDeliveryPreset): number {
  return IMAGE_PRESET[preset].defaultWidth;
}
