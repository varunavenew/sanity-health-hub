export type AppLocaleStr = "nb" | "en";

export function appLocaleFromParam(locale: string): AppLocaleStr {
  return locale === "en" ? "en" : "nb";
}

export interface LocalizedPaths {
  nbPath: string;
  enPath: string;
}

const BRAND_SUFFIX_RE = /\s*\|\s*CMedical\s*$/i;

/** Single brand suffix — avoids doubling with root layout `title.template` or PageSEO. */
export function normalizePageTitle(title: unknown): string {
  let t = typeof title === "string" ? title.trim() : "";
  if (!t) return "CMedical";
  while (BRAND_SUFFIX_RE.test(t)) {
    t = t.replace(BRAND_SUFFIX_RE, "").trim();
  }
  return `${t} | CMedical`;
}
