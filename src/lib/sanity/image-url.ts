function viteEnv(name: string): string | undefined {
  try {
    return (import.meta as unknown as { env?: Record<string, string> }).env?.[name];
  } catch {
    return undefined;
  }
}

const projectId =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SANITY_PROJECT_ID) ||
  viteEnv("VITE_SANITY_PROJECT_ID") ||
  "9jhqpk3a";

const dataset =
  (typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SANITY_DATASET) ||
  viteEnv("VITE_SANITY_DATASET") ||
  "production";

export function urlForImageRef(ref: string): string {
  if (!ref) return "";
  if (ref.startsWith("http")) return ref;
  const parts = ref.replace("image-", "").split("-");
  const format = parts.pop();
  const id = parts.join("-");
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}.${format}`;
}

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
