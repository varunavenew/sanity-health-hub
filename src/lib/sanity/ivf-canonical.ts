/** Stable accordion/section id on Assistert befruktning. */
export const IVF_SECTION_ID = "ivf";

/** Norwegian (and CMS document) slug for the assisted-fertilisation page. */
export const ASSISTERT_BEFRUKTNING_SLUG = "assistert-befruktning";

/** English locale URL slug (CMS `slug.en`). */
export const ASSISTED_REPRODUCTION_SLUG_EN = "assisted-reproduction";

/** Retired IVF page slug — 301 to Assistert befruktning #ivf. */
export const RETIRED_IVF_SLUG = "ivf";

const IVF_PAGE_RE =
  /^(\/(?:no|nb|en))?(\/(?:behandlinger\/)?(?:fertilitet|fertility))\/ivf$/i;

function splitPathParts(path: string): {
  base: string;
  query: string;
  hash: string;
} {
  const hashIdx = path.indexOf("#");
  const hash = hashIdx >= 0 ? path.slice(hashIdx) : "";
  const withoutHash = hashIdx >= 0 ? path.slice(0, hashIdx) : path;
  const qIdx = withoutHash.indexOf("?");
  const query = qIdx >= 0 ? withoutHash.slice(qIdx) : "";
  const base = (qIdx >= 0 ? withoutHash.slice(0, qIdx) : withoutHash).replace(
    /\/+$/,
    "",
  ) || "/";
  return { base, query, hash };
}

function destinationSlug(localePrefix: string, categoryPath: string): string {
  const isEn =
    localePrefix === "/en" || /\/fertility$/i.test(categoryPath);
  return isEn ? ASSISTED_REPRODUCTION_SLUG_EN : ASSISTERT_BEFRUKTNING_SLUG;
}

function destinationCategory(
  localePrefix: string,
  categoryPath: string,
): string {
  if (localePrefix === "/en" && /\/fertilitet$/i.test(categoryPath)) {
    return "/fertility";
  }
  return categoryPath;
}

/**
 * Map a retired IVF treatment URL to Assistert befruktning with `#ivf`.
 * Idempotent — already-canonical paths are returned unchanged.
 */
export function rewriteRetiredIvfPath(path: string): string {
  if (!path) return path;
  const { base, query } = splitPathParts(path.trim());
  const match = base.match(IVF_PAGE_RE);
  if (!match) return path;

  const localePrefix = match[1] ?? "";
  const categoryWithOptionalBehandlinger = match[2] ?? "/fertilitet";
  const category = categoryWithOptionalBehandlinger.replace(
    /^\/behandlinger/,
    "",
  );
  const destCategory = destinationCategory(localePrefix, category);
  const destSlug = destinationSlug(localePrefix, destCategory);
  const destBase = `${localePrefix}${destCategory}/${destSlug}`;
  return `${destBase}${query}#${IVF_SECTION_ID}`;
}

export function isRetiredIvfSlug(slug: string | undefined | null): boolean {
  return (slug ?? "").trim().toLowerCase() === RETIRED_IVF_SLUG;
}

/** DOM id for a reasons accordion item. IVF titles always resolve to `ivf`. */
export function reasonAnchorId(title: string, explicitId?: string): string {
  const explicit = explicitId?.trim();
  if (explicit) return explicit;
  const t = title.trim().toLowerCase();
  if (/^ivf\b/.test(t) || t.includes("in vitro")) return IVF_SECTION_ID;
  const slug = t
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "section";
}
