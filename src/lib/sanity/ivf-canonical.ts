/** Stable accordion/section id when IVF appears as a section title. */
export const IVF_SECTION_ID = "ivf";

export const ASSISTERT_BEFRUKTNING_SLUG = "assistert-befruktning";

/** @deprecated IVF is a live treatment page again — kept for call-site compatibility. */
export const RETIRED_IVF_SLUG = "ivf";

/** No-op: IVF URLs stay on `/…/ivf` (no longer rewritten to Assistert befruktning). */
export function rewriteRetiredIvfPath(path: string): string {
  return path;
}

/** Always false — IVF is a routable treatment slug. */
export function isRetiredIvfSlug(_slug: string | undefined | null): boolean {
  return false;
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
