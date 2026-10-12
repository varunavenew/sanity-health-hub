/** Stored `article.contentFormat` values (Studio: «Type innhold»). */
export const ARTICLE_CONTENT_FORMATS = ["article", "podcast", "video"] as const;

export type ArticleContentFormat = (typeof ARTICLE_CONTENT_FORMATS)[number];

const FORMAT_SET = new Set<string>(ARTICLE_CONTENT_FORMATS);

export const ARTICLE_CONTENT_FORMAT_LABELS: Record<
  ArticleContentFormat,
  { no: string; en: string }
> = {
  article: { no: "Artikkel", en: "Article" },
  podcast: { no: "Podcast", en: "Podcast" },
  video: { no: "Video", en: "Video" },
};

/** Missing, empty, or unknown values render as a regular article. */
export function resolveArticleContentFormat(value: unknown): ArticleContentFormat {
  if (typeof value !== "string") return "article";
  const key = value.trim().toLowerCase();
  return FORMAT_SET.has(key) ? (key as ArticleContentFormat) : "article";
}
