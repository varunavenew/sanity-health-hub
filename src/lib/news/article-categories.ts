/** Canonical article.category values stored in Sanity and shown on the site. */
export const ARTICLE_CATEGORIES = [
  "Pasienthistorier",
  "Oss i media",
  "Fagartikler",
  "Nytt fra oss",
] as const;

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export const ARTICLE_CATEGORY_EN_LABELS: Record<ArticleCategory, string> = {
  Pasienthistorier: "Patient stories",
  "Oss i media": "Us in the media",
  Fagartikler: "Professional articles",
  "Nytt fra oss": "News from us",
};

const ARTICLE_CATEGORY_SET = new Set<string>(ARTICLE_CATEGORIES);

/** Legacy / schema aliases → the four stored category strings. */
const CATEGORY_ALIASES: Record<string, ArticleCategory> = {
  Pasienthistorier: "Pasienthistorier",
  "Oss i media": "Oss i media",
  Fagartikler: "Fagartikler",
  Fagartiklar: "Fagartikler",
  fagartikkel: "Fagartikler",
  "Nytt fra oss": "Nytt fra oss",
  Nyheter: "Nytt fra oss",
  nyheter: "Nytt fra oss",
  news: "Nytt fra oss",
  Teknologi: "Nytt fra oss",
};

export function isArticleCategory(value: string): value is ArticleCategory {
  return ARTICLE_CATEGORY_SET.has(value);
}

/** Map stored article.category (including legacy aliases) to the canonical field value. */
export function normalizeArticleCategory(category: string): string {
  if (!category) return category;
  return CATEGORY_ALIASES[category] || category;
}

export function articleCategoryLabel(
  category: string,
  locale: "en" | "no" | "nb" = "no",
): string {
  const normalized = normalizeArticleCategory(category);
  if (locale === "en" && isArticleCategory(normalized)) {
    return ARTICLE_CATEGORY_EN_LABELS[normalized];
  }
  return normalized;
}
