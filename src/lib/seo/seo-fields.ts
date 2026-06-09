import type { AppLocaleStr } from "@/lib/seo/metadata-builders";

export type SanitySeoFields = {
  metaTitle?: string | null;
  metaDescription?: string | null;
  ogImage?: unknown;
  noIndex?: boolean;
} | null;

function pickI18nMetaString(value: unknown, lang: "no" | "en"): string {
  if (!Array.isArray(value)) return "";
  const match = value.find((e) => {
    const o = e as { language?: string; _key?: string; value?: unknown };
    return (o.language || o._key) === lang;
  }) as { value?: unknown } | undefined;
  if (typeof match?.value === "string") return match.value.trim();
  const no = value.find((e) => {
    const o = e as { language?: string; _key?: string; value?: unknown };
    return (o.language || o._key) === "no";
  }) as { value?: unknown } | undefined;
  if (typeof no?.value === "string") return no.value.trim();
  const first = value[0] as { value?: unknown } | undefined;
  return typeof first?.value === "string" ? first.value.trim() : "";
}

/** Coerce Sanity / legacy shapes to a plain meta string. */
export function plainMetaString(
  value: unknown,
  fallback: string,
  lang: "no" | "en" = "no",
): string {
  if (typeof value === "string") {
    const t = value.trim();
    return t || fallback;
  }
  if (Array.isArray(value)) {
    const t = pickI18nMetaString(value, lang);
    return t || fallback;
  }
  if (value && typeof value === "object") {
    const obj = value as { _type?: string; value?: unknown; language?: string; _key?: string };
    if (typeof obj._type === "string" && obj._type.startsWith("internationalizedArray")) {
      return "";
    }
    if ("value" in value) {
      const inner = obj.value;
      if (typeof inner === "string") {
        const t = inner.trim();
        return t || fallback;
      }
    }
  }
  return fallback;
}

/** Use CMS SEO for the active locale; fall back to static defaults only when CMS is empty. */
export function resolveMetaStrings(
  seo: SanitySeoFields | undefined,
  lang: AppLocaleStr,
  fallbacks: {
    nb: { title: string; description: string };
    en: { title: string; description: string };
  },
): { title: string; description: string } {
  const fb = fallbacks[lang];
  const sanityLang = lang === "en" ? "en" : "no";
  return {
    title: plainMetaString(seo?.metaTitle, fb.title, sanityLang),
    description: plainMetaString(seo?.metaDescription, fb.description, sanityLang),
  };
}
