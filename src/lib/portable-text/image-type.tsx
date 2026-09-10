import type { PortableTextTypeComponent } from "@portabletext/react";
import { AssetImg } from "@/components/AssetImg";
import { urlForImage } from "@/lib/sanity/image-url";
import type { SanityCrop, SanityHotspot } from "@/lib/media/focal-point";

type PortableTextImageValue = {
  _type?: string;
  asset?: { _ref?: string; _id?: string; url?: string } | string;
  alt?: string;
  caption?: string;
  crop?: SanityCrop | null;
  hotspot?: SanityHotspot | null;
  url?: string;
  src?: string;
};

/**
 * Build a CDN URL from a portable-text image block (or any Sanity image object).
 * Never return a raw `image-…` asset id — crawlers treat that as a broken src.
 */
export function portableTextImageSrc(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return urlForImage(value);

  const src = urlForImage(value);
  if (src) return src;

  if (typeof value !== "object") return "";
  const v = value as PortableTextImageValue;
  const asset = v.asset;
  if (typeof asset === "string") return urlForImage(asset);
  if (asset && typeof asset === "object") {
    if (typeof asset.url === "string" && asset.url) return urlForImage(asset.url);
    if (typeof asset._ref === "string" && asset._ref) return urlForImage(asset._ref);
    if (typeof asset._id === "string" && asset._id) return urlForImage(asset._id);
  }
  if (typeof v.url === "string" && v.url) return urlForImage(v.url);
  if (typeof v.src === "string" && v.src) return urlForImage(v.src);
  return "";
}

function PortableTextImage({
  value,
  className,
}: {
  value: PortableTextImageValue | undefined;
  className?: string;
}) {
  const src = portableTextImageSrc(value);
  if (!src) return null;

  return (
    <figure className="my-8">
      <AssetImg
        src={src}
        alt={value?.alt || ""}
        preset="gallery"
        loading="lazy"
        hotspot={value?.hotspot}
        className={className ?? "w-full rounded-sm"}
      />
      {value?.caption ? (
        <figcaption className="text-sm text-muted-foreground mt-2">
          {value.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export const portableTextImageType: Record<
  string,
  PortableTextTypeComponent<PortableTextImageValue>
> = {
  image: ({ value }) => <PortableTextImage value={value} />,
};
