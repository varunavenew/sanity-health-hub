/** Brand fallback when Sanity `seo.ogImage` is empty. */
export const DEFAULT_OG_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/qmg4FOZcsPVySaA19fmuxrFmWZJ3/uploads/1762763982098-cmedical.png";

export function resolveOgImageUrl(ogImage?: string | null): string {
  const trimmed = ogImage?.trim();
  return trimmed || DEFAULT_OG_IMAGE;
}
