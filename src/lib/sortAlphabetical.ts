const NB = "nb";

export type SortLocale = "no" | "en";

function collatorLocale(locale: SortLocale): string {
  return locale === "en" ? "en" : NB;
}

/** Resolve plain string or internationalizedArray entry for A–Å sorting. */
export function textForSort(value: unknown, locale: SortLocale = "no"): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    const lang = locale === "en" ? "en" : "no";
    const entry = value.find(
      (x: { language?: string; _key?: string; value?: string }) =>
        (x.language || x._key) === lang,
    );
    const fallback = value.find(
      (x: { language?: string; _key?: string; value?: string }) =>
        (x.language || x._key) === "no",
    );
    return (entry?.value ?? fallback?.value ?? value[0]?.value ?? "") as string;
  }
  return "";
}

export function compareAlphabetical(a: string, b: string, locale: SortLocale = "no"): number {
  return a.localeCompare(b, collatorLocale(locale), { sensitivity: "base" });
}

/** Parse Sanity `sortOrder` — null/undefined/empty/NaN are treated as missing. */
export function parseSortOrder(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

/**
 * Items with a valid `sortOrder` first (ascending), then items without `sortOrder`
 * sorted alphabetically by title/name for the active locale.
 */
export function sortBySortOrder<T>(
  items: T[],
  getSortOrder: (item: T) => unknown,
  getLabel: (item: T) => unknown,
  locale: SortLocale = "no",
): T[] {
  const withOrder: { item: T; order: number }[] = [];
  const withoutOrder: T[] = [];

  for (const item of items) {
    const order = parseSortOrder(getSortOrder(item));
    if (order === null) {
      withoutOrder.push(item);
    } else {
      withOrder.push({ item, order });
    }
  }

  withOrder.sort((a, b) => a.order - b.order);
  const sortedWithout = sortByLabel(withoutOrder, getLabel, locale);

  return [...withOrder.map((row) => row.item), ...sortedWithout];
}

export function sortByLabel<T>(
  items: T[],
  getLabel: (item: T) => unknown,
  locale: SortLocale = "no",
): T[] {
  return [...items].sort((a, b) =>
    compareAlphabetical(textForSort(getLabel(a)), textForSort(getLabel(b)), locale),
  );
}

/** A–Å by URL slug for the active content locale (`/nb` → no, `/en` → en). */
export function sortBySlug<T>(
  items: T[],
  getSlug: (item: T) => unknown,
  locale: SortLocale = "no",
): T[] {
  return [...items].sort((a, b) =>
    compareAlphabetical(textForSort(getSlug(a)), textForSort(getSlug(b)), locale),
  );
}
