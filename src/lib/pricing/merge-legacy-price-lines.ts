/** Normalize treatment name for deduping legacy vs subcategory price lines. */
export function normalizePriceLineName(name: string): string {
  return name.replace(/\s+/g, " ").trim().toLowerCase();
}

type RawPriceLine = {
  name?: string;
  price?: number;
  priceLabel?: string;
  note?: string;
  source?: string;
  apiActivityId?: number;
  _key?: string;
};

/**
 * When a category has both subcategories and legacy flat `items`, Studio only
 * edits subcategories[].items — legacy rows were hidden but still in the document.
 * Merge legacy into the first subcategory (dedupe by name) so CMS and site match.
 */
export function mergeLegacyItemsIntoSubcategories<T extends { items?: RawPriceLine[] }>(
  subcategories: T[],
  legacyItems: RawPriceLine[],
  nameOf: (line: RawPriceLine) => string,
): T[] {
  if (!legacyItems.length || !subcategories.length) return subcategories;

  const subs = subcategories.map((sub) => ({
    ...sub,
    items: [...(sub.items ?? [])],
  }));

  const target = subs[0];
  const existing = new Set(
    (target.items ?? [])
      .map((item) => normalizePriceLineName(nameOf(item)))
      .filter(Boolean),
  );

  for (const legacy of legacyItems) {
    const label = nameOf(legacy);
    if (!label) continue;
    const key = normalizePriceLineName(label);
    if (existing.has(key)) continue;
    existing.add(key);
    target.items = [...(target.items ?? []), legacy];
  }

  return subs;
}
