import { siteUrl } from "@/lib/env";

/**
 * Default social share image — matches legacy cmedical-web.vercel.app brand fallback
 * (Sanity asset d2af824…, 1200×630 wordmark on skin texture). Served from /public.
 */
export const DEFAULT_OG_IMAGE = "/og-default.png";

/** Brand fallback when no page-specific share image is available. */
export function defaultOgImageUrl(): string {
  return `${siteUrl()}${DEFAULT_OG_IMAGE}`;
}

/** Square CM mark for JSON-LD / schema.org logo (from cm-initials.png). */
export function brandLogoUrl(): string {
  return `${siteUrl()}/brand-logo.png`;
}

/** Alt text for the brand default sharing image (og-default.png). */
export const DEFAULT_OG_IMAGE_ALT =
  "CMedical – privat spesialisthelse innen kvinnehelse, fertilitet og urologi";

export function resolveOgImageUrl(ogImage?: string | null): string {
  const trimmed = ogImage?.trim();
  if (!trimmed) return defaultOgImageUrl();
  if (trimmed.startsWith("/")) return `${siteUrl()}${trimmed}`;
  return trimmed;
}
