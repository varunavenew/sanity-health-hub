/** CMS placeholder slugs that must not appear in sitemap or search indexes. */
export const TEST_CONTENT_SLUGS = new Set(["new-treatment", "new-category"]);

export function isTestContentSlug(slug: string | null | undefined): boolean {
  if (!slug) return false;
  return TEST_CONTENT_SLUGS.has(slug);
}

export function hasTestContentSegment(segments: string[]): boolean {
  return segments.some((seg) => isTestContentSlug(seg));
}
