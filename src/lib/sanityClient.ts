import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "sh2sj585",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

// Helper to build image URLs from Sanity image references
export const urlFor = (ref: string) => {
  if (!ref) return "";
  // If it's already a URL, return as-is
  if (ref.startsWith("http")) return ref;
  // Parse Sanity image reference: image-{id}-{dimensions}-{format}
  const parts = ref.replace("image-", "").split("-");
  const format = parts.pop();
  const id = parts.join("-");
  return `https://cdn.sanity.io/images/sh2sj585/production/${id}.${format}`;
};

// Helper to get image URL from a Sanity image object
export const getImageUrl = (image: any): string => {
  if (!image) return "";
  if (typeof image === "string") return image;
  if (image.asset?._ref) return urlFor(image.asset._ref);
  if (image.asset?.url) return image.asset.url;
  return "";
};
