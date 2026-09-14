/**
 * CMS slugs that resolve only to redirects — must not appear in sitemap.xml.
 * Final destinations (e.g. /ovrige/hudhelse, /specialists) are listed separately.
 */
export const SITEMAP_EXCLUDED_SLUGS = new Set([
  /** Fertilitet team page → specialists listing with ?kategori=fertilitet */
  "teamet",
  "fertilitetsteamet",
  /** Renamed to hudhelse (301 in next.config.ts) */
  "hudlege",
  /** Retired treatment → category landing /ovrige or /en/other */
  "plastikkirurgi",
  "procedure-reconstructive-surg",
]);

/**
 * Locale paths that 301/308 and must not be listed even if a leftover CMS slug remains.
 * Do not include `/en/…/blodningsfortyrrelser` — that is still the live EN treatment slug.
 */
export const SITEMAP_EXCLUDED_PATHS = new Set([
  "/no/gynekologi/blodningsfortyrrelser",
  "/nb/gynekologi/blodningsfortyrrelser",
  "/no/fertilitet/teamet",
  "/en/fertility/fertilitetsteamet",
  "/en/fertility/teamet",
  "/no/ovrige/plastikkirurgi",
  "/en/other/procedure-reconstructive-surg",
  "/no/ovrige/hudlege",
]);

export function isSitemapExcludedSlug(slug: string | null | undefined): boolean {
  if (!slug) return false;
  return SITEMAP_EXCLUDED_SLUGS.has(slug);
}

export function hasSitemapExcludedSegment(segments: string[]): boolean {
  return segments.some((seg) => isSitemapExcludedSlug(seg));
}

export function isSitemapExcludedPath(locale: string, segments: string[]): boolean {
  if (hasSitemapExcludedSegment(segments)) return true;
  const path = `/${locale}/${segments.join("/")}`;
  return SITEMAP_EXCLUDED_PATHS.has(path);
}
