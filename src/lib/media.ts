import type { StaticImageData } from "next/image";

/** URL string (CMS / remote) or a static image import from `*.jpg` / `*.png` etc. */
export type ImageRef = string | StaticImageData;

export function assetSrc(src: ImageRef | undefined | null): string {
  if (src == null) return "";
  if (typeof src === "string") return src;
  if (typeof src === "object" && "src" in src && typeof src.src === "string") {
    return src.src;
  }
  if (typeof src === "object" && "default" in src) {
    return assetSrc((src as { default: ImageRef }).default);
  }
  return "";
}
