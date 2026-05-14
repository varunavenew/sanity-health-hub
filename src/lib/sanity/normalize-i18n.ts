/**
 * Flattens `sanity-plugin-internationalized-array` shapes for a given language.
 * Shared by client hooks and server-side GROQ fetchers (e.g. generateMetadata).
 */

const isI18nEntry = (v: unknown): boolean =>
  Boolean(
    v &&
      typeof v === "object" &&
      typeof (v as { _type?: string })._type === "string" &&
      (v as { _type: string })._type.startsWith("internationalizedArray") &&
      "value" in (v as object),
  );

const isI18nEntryArray = (arr: unknown[]): boolean =>
  arr.length > 0 && arr.every(isI18nEntry);

const pickI18nValue = (arr: unknown[], lang: "no" | "en"): unknown => {
  const match = arr.find((e) => {
    const o = e as { language?: string; _key?: string };
    return (o.language || o._key) === lang;
  });
  if (match) return (match as { value: unknown }).value;
  const fallback =
    arr.find((e) => {
      const o = e as { language?: string; _key?: string };
      return (o.language || o._key) === "no";
    }) || arr[0];
  return (fallback as { value?: unknown })?.value;
};

/**
 * Recursively replace internationalizedArray value arrays with plain values.
 */
export function normalizeI18n(input: unknown, lang: "no" | "en"): unknown {
  if (input == null) return input;
  if (Array.isArray(input)) {
    if (isI18nEntryArray(input)) {
      return normalizeI18n(pickI18nValue(input, lang), lang);
    }
    return input.map((item) => normalizeI18n(item, lang));
  }
  if (typeof input === "object") {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(input as object)) {
      out[k] = normalizeI18n((input as Record<string, unknown>)[k], lang);
    }
    return out;
  }
  return input;
}

/** App `[locale]` param → Sanity content language (`nb` UI → `no` in Studio). */
export function sanityContentLangFromLocale(locale: string): "no" | "en" {
  return locale === "en" ? "en" : "no";
}
