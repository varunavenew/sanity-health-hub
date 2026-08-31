import {
  ARTICLE_CATEGORIES,
  ARTICLE_CATEGORY_EN_LABELS,
  isArticleCategory,
  normalizeArticleCategory,
} from "@/lib/news/article-categories";

export type NewsFilterOption = {
  key?: string;
  label: string;
  acceptedArticleCategories: string[];
};

const LEGACY_CATEGORY_LABELS: Record<string, string> = {
  fagartikkel: "Fagartikler",
  Fagartiklar: "Fagartikler",
  Fagartikler: "Fagartikler",
  news: "Nytt fra oss",
  nyheter: "Nytt fra oss",
  Nyheter: "Nytt fra oss",
  "Nytt fra oss": "Nytt fra oss",
  Pasienthistorier: "Pasienthistorier",
  "Oss i media": "Oss i media",
  prisliste: "Prisliste",
  stillingsutlysning: "Stillingsutlysning",
  Teknologi: "Nytt fra oss",
};

const FILTER_KEYS: Record<(typeof ARTICLE_CATEGORIES)[number], string> = {
  Pasienthistorier: "patientStories",
  "Oss i media": "media",
  Fagartikler: "professional",
  "Nytt fra oss": "newsFromUs",
};

export function resolveArticleCategoryLabel(
  category: string,
  filters: NewsFilterOption[] = [],
  locale: "en" | "no" | "nb" = "no",
): string {
  const normalized = normalizeArticleCategory(category);

  for (const filter of filters) {
    if (
      filter.acceptedArticleCategories.includes(category) ||
      filter.acceptedArticleCategories.includes(normalized)
    ) {
      return filter.label;
    }
  }

  if (locale === "en" && isArticleCategory(normalized)) {
    return ARTICLE_CATEGORY_EN_LABELS[normalized];
  }

  return (
    LEGACY_CATEGORY_LABELS[category] ||
    LEGACY_CATEGORY_LABELS[normalized] ||
    normalized ||
    category
  );
}

export function parseNewsFilters(raw: unknown): NewsFilterOption[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter(
      (filter): filter is {
        key?: unknown;
        label?: unknown;
        acceptedArticleCategories?: unknown;
      } => Boolean(filter && typeof filter === "object"),
    )
    .filter((filter) => typeof filter.label === "string")
    .map((filter) => ({
      key: typeof filter.key === "string" ? filter.key : undefined,
      label: filter.label as string,
      acceptedArticleCategories: Array.isArray(filter.acceptedArticleCategories)
        ? filter.acceptedArticleCategories.filter(
            (category): category is string => typeof category === "string",
          )
        : [],
    }));
}

/** Alle + the four article.category values, used when News page filters are empty. */
export function defaultNewsFilterOptions(
  locale: "en" | "no" | "nb" = "no",
): Array<{
  key: string;
  label: string;
  acceptedArticleCategories: string[];
}> {
  const isEn = locale === "en";
  return [
    {
      key: "all",
      label: isEn ? "All" : "Alle",
      acceptedArticleCategories: [],
    },
    ...ARTICLE_CATEGORIES.map((category) => ({
      key: FILTER_KEYS[category],
      label: isEn ? ARTICLE_CATEGORY_EN_LABELS[category] : category,
      acceptedArticleCategories: [category],
    })),
  ];
}

/**
 * News chips: CMS filters when present, otherwise the four article.category values.
 * Category labels always fall back to the article field.
 */
export function resolveNewsFilterOptions(
  raw: unknown,
  locale: "en" | "no" | "nb" = "no",
): Array<{
  key: string;
  label: string;
  acceptedArticleCategories: string[];
}> {
  const parsed = parseNewsFilters(raw).filter(
    (filter): filter is NewsFilterOption & { key: string } =>
      typeof filter.key === "string" && filter.key.length > 0,
  );
  if (parsed.length > 0) return parsed;
  return defaultNewsFilterOptions(locale);
}
