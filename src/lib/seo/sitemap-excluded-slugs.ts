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

export function isSitemapExcludedSlug(slug: string | null | undefined): boolean {
  if (!slug) return false;
  return SITEMAP_EXCLUDED_SLUGS.has(slug);
}

export function hasSitemapExcludedSegment(segments: string[]): boolean {
  return segments.some((seg) => isSitemapExcludedSlug(seg));
}
