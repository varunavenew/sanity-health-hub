import { createClient } from "@sanity/client";

function viteEnv(name: string): string | undefined {
  try {
    return (import.meta as unknown as { env?: Record<string, string> }).env?.[name];
  } catch {
    return undefined;
  }
}

/** Prefer NEXT_PUBLIC_* (or next.config env mirror); fall back to Vite; then Studio default. */
export const SANITY_PROJECT_ID =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SANITY_PROJECT_ID) ||
  viteEnv("VITE_SANITY_PROJECT_ID") ||
  "9jhqpk3a";
export const SANITY_DATASET =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SANITY_DATASET) ||
  viteEnv("VITE_SANITY_DATASET") ||
  "production";

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
