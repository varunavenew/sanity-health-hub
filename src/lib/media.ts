import type { StaticImageData } from "next/image";

/** URL string (CMS / remote) or a static image import from `*.jpg` / `*.png` etc. */
export type ImageRef = string | StaticImageData;

export function assetSrc(src: ImageRef | undefined | null): string {
  if (src == null) return "";
  return typeof src === "string" ? src : src.src;
}
