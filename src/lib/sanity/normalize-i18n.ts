/**
 * Flattens `sanity-plugin-internationalized-array` shapes for a given language.
 * Shared by client hooks and server-side GROQ fetchers (e.g. generateMetadata).
 */

const isI18nEntry = (v: unknown): boolean =>
  Boolean(
    v &&
      typeof v === "object" &&
      typeof (v as { _type?: string })._type === "string" &&
      (v as { _type: string })._type.startsWith("internationalizedArray"),
  );

const isI18nEntryArray = (arr: unknown[]): boolean =>
  arr.length > 0 && arr.every(isI18nEntry);

function entryValue(entry: unknown): unknown {
  if (!entry || typeof entry !== "object") return "";
  const value = (entry as { value?: unknown }).value;
  if (value === undefined || value === null) return "";
  return unwrapSlugValue(value);
}

function unwrapSlugValue(value: unknown): unknown {
  if (
    value &&
    typeof value === "object" &&
    "current" in value &&
    typeof (value as { current?: unknown }).current === "string"
  ) {
    return (value as { current: string }).current;
  }
  return value;
}

const pickI18nValue = (
  arr: unknown[],
  lang: "no" | "en",
  options?: { strict?: boolean },
): unknown => {
  const match = arr.find((e) => {
    const o = e as { language?: string; _key?: string };
    return (o.language || o._key) === lang;
  });
  if (match) {
    const value = entryValue(match);
    const isEmpty =
      value === "" ||
      value === null ||
      value === undefined ||
      (Array.isArray(value) && value.length === 0);
    if (!isEmpty) return value;
  }
  // Strict mode: never cross-fill the other language (avoids mixed NO/EN pages).
  if (options?.strict) return "";
  const fallback =
    arr.find((e) => {
      const o = e as { language?: string; _key?: string };
      return (o.language || o._key) === "no";
    }) || arr[0];
  return entryValue(fallback);
};

function normalizeI18nInternal(
  input: unknown,
  lang: "no" | "en",
  options?: { strict?: boolean },
): unknown {
  if (input == null) return input;
  if (isI18nEntry(input)) return entryValue(input);
  if (Array.isArray(input)) {
    if (isI18nEntryArray(input)) {
      return normalizeI18nInternal(pickI18nValue(input, lang, options), lang, options);
    }
    return input.map((item) => normalizeI18nInternal(item, lang, options));
  }
  if (typeof input === "object") {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(input as object)) {
      out[k] = normalizeI18nInternal(
        (input as Record<string, unknown>)[k],
        lang,
        options,
      );
    }
    return out;
  }
  return input;
}

/**
 * Recursively replace internationalizedArray value arrays with plain values.
 * Empty requested-language values fall back to Norwegian (legacy behaviour).
 */
export function normalizeI18n(input: unknown, lang: "no" | "en"): unknown {
  return normalizeI18nInternal(input, lang, { strict: false });
}

/**
 * Locale-strict flatten: never substitute another language when the requested
 * language entry is missing/empty. Used for treatment category + treatment pages.
 */
export function normalizeI18nStrict(input: unknown, lang: "no" | "en"): unknown {
  return normalizeI18nInternal(input, lang, { strict: true });
}

/** App `[locale]` param → Sanity content language (`nb` UI → `no` in Studio). */
export function sanityContentLangFromLocale(locale: string): "no" | "en" {
  return locale === "en" ? "en" : "no";
}
