import { createClient } from "@sanity/client";

const SANITY_PROJECT_ID = import.meta.env.VITE_SANITY_PROJECT_ID || "8auguusb";
const SANITY_DATASET = import.meta.env.VITE_SANITY_DATASET || "production";

export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: "2024-01-01",
  useCdn: false,
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
  return `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${id}.${format}`;
};

// Helper to get image URL from a Sanity image object
export const getImageUrl = (image: any): string => {
  if (!image) return "";
  if (typeof image === "string") return image;
  if (image.asset?._ref) return urlFor(image.asset._ref);
  if (image.asset?.url) return image.asset.url;
  return "";
};
