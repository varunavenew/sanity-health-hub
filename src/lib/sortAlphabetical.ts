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
