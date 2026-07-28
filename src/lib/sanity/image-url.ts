/**
 * Client-safe Sanity image URL helpers.
 * Uses NEXT_PUBLIC_* env vars only — safe to import from client components.
 */

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

export function urlForImageRef(ref: string): string {
  if (!ref) return "";
  if (ref.startsWith("http")) return ref;
  const projectId = readProjectId();
  const dataset = readDataset();
  if (!projectId || !dataset) return "";
  const parts = ref.replace("image-", "").split("-");
  const format = parts.pop();
  const id = parts.join("-");
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.${format}`;
}

/** Alias used by portable text and legacy imports. */
export const urlFor = urlForImageRef;

export function getImageUrl(image: unknown): string {
  if (!image) return "";
  if (typeof image === "string") return image;
  if (typeof image === "object" && image !== null) {
    const obj = image as { asset?: { _ref?: string; url?: string } };
    if (obj.asset?._ref) return urlForImageRef(obj.asset._ref);
    if (obj.asset?.url) return obj.asset.url;
  }
  return "";
}
