import { normalizeCategory } from "@/data/articles";

export type NewsFilterOption = {
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

export function resolveArticleCategoryLabel(
  category: string,
  filters: NewsFilterOption[] = [],
): string {
  const normalized = normalizeCategory(category);

  for (const filter of filters) {
    if (
      filter.acceptedArticleCategories.includes(category) ||
      filter.acceptedArticleCategories.includes(normalized)
    ) {
      return filter.label;
    }
  }

  return LEGACY_CATEGORY_LABELS[category] || LEGACY_CATEGORY_LABELS[normalized] || category;
}

export function parseNewsFilters(raw: unknown): NewsFilterOption[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .filter(
      (filter): filter is {
        label?: unknown;
        acceptedArticleCategories?: unknown;
      } => Boolean(filter && typeof filter === "object"),
    )
    .filter((filter) => typeof filter.label === "string")
    .map((filter) => ({
      label: filter.label as string,
      acceptedArticleCategories: Array.isArray(filter.acceptedArticleCategories)
        ? filter.acceptedArticleCategories.filter(
            (category): category is string => typeof category === "string",
          )
        : [],
    }));
}
