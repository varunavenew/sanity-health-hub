import type { AppLocaleStr } from "@/lib/seo/metadata-builders";

export type SanitySeoFields = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: unknown;
  noIndex?: boolean;
} | null;

/** Coerce Sanity / legacy shapes to a plain meta string. */
export function plainMetaString(value: unknown, fallback: string): string {
  if (typeof value === "string") {
    const t = value.trim();
    return t || fallback;
  }
  if (value && typeof value === "object" && "value" in value) {
    const inner = (value as { value: unknown }).value;
    if (typeof inner === "string") {
      const t = inner.trim();
      return t || fallback;
    }
  }
  return fallback;
}

/** Use CMS SEO for the active locale; fall back to static defaults only when CMS is empty. */
export function resolveMetaStrings(
  seo: SanitySeoFields | undefined,
  lang: AppLocaleStr,
  fallbacks: {
    nb: { title: string; description: string };
    en: { title: string; description: string };
  },
): { title: string; description: string } {
  const fb = fallbacks[lang];
  return {
    title: plainMetaString(seo?.metaTitle, fb.title),
    description: plainMetaString(seo?.metaDescription, fb.description),
  };
}
