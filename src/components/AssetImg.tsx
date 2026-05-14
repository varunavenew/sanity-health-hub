import * as React from "react";
import { assetSrc, type ImageRef } from "@/lib/media";

export type AssetImgProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: ImageRef;
};

/** `<img>` wrapper: accepts string URLs and static image imports (`StaticImageData`). */
export function AssetImg({ src, alt = "", ...props }: AssetImgProps) {
  return <img {...props} src={assetSrc(src)} alt={alt} />;
}
