import * as React from "react";
import { assetSrc, type ImageRef } from "@/lib/media";

export type AssetImgProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: ImageRef;
};

/** `<img>` wrapper: accepts string URLs and static image imports (`StaticImageData`). */
export function AssetImg({ src, alt = "", ...props }: AssetImgProps) {
  const resolved = assetSrc(src);
  if (!resolved) return null;
  return <img {...props} src={resolved} alt={alt} />;
}
