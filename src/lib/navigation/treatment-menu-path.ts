import { coercePath } from "@/lib/navigation/coerce-path";
import {
  behandlingerCategorySegment,
  categoryLandingPath,
  normalizeCategoryRouteKey,
} from "@/lib/sanity/category-keys";
import { rewriteRetiredIvfPath } from "@/lib/sanity/ivf-canonical";

export type MenuPathParentNode = {
  slug?: string | null;
  slugNo?: string | null;
  parent?: MenuPathParentNode | null;
};

export type MenuPathTreatmentLink = {
  pageRole?: string | null;
  hideFromWebsite?: boolean | null;
  slug?: string | null;
  slugNo?: string | null;
  categorySegment?: string | null;
  parent?: MenuPathParentNode | null;
};

function slugForLang(
  doc: { slug?: string | null; slugNo?: string | null },
  lang: "no" | "en",
): string {
  const localized = lang === "en" ? doc.slug?.trim() : doc.slugNo?.trim();
  const fallback = doc.slugNo?.trim() || doc.slug?.trim() || "";
  return localized || fallback;
}

/** Parent slugs top-down (e.g. ernaringsfysiolog for Gravid). */
function parentSlugChain(parent: MenuPathParentNode | null | undefined, lang: "no" | "en"): string[] {
  const chain: string[] = [];
  for (let node = parent; node; node = node.parent ?? undefined) {
    const s = slugForLang(node, lang);
    if (s) chain.push(s);
  }
  return chain.reverse();
}

/**
 * Public path for a treatment linked from the Tjenester megamenu (column 3).
 * Respects `parent` for nested pages (e.g. Flere fagområder → Ernæringsfysiolog → Gravid).
 */
export function treatmentMenuPathFromDocument(
  link: MenuPathTreatmentLink | null | undefined,
  lang: "no" | "en",
): string | undefined {
  if (!link || link.pageRole === "team" || link.hideFromWebsite) return undefined;

  const leafSlug = slugForLang(link, lang);
  if (!leafSlug) return undefined;

  const categoryKey =
    normalizeCategoryRouteKey(link.categorySegment?.trim() || "") ||
    link.categorySegment?.trim() ||
    "";
  if (!categoryKey) return undefined;

  const categoryPath = categoryLandingPath(categoryKey, lang);
  const segments = [...parentSlugChain(link.parent, lang), leafSlug];
  const raw = rewriteRetiredIvfPath(`${categoryPath}/${segments.join("/")}`);
  return coercePath(raw, lang) || undefined;
}

export function resolveMegamenuSubItemPath(
  item: {
    path?: string | null;
    link?: MenuPathTreatmentLink | null;
  },
  lang: "no" | "en",
): string | undefined {
  const manual = item.path?.trim();
  if (manual) {
    return coercePath(manual, lang) || undefined;
  }
  return treatmentMenuPathFromDocument(item.link, lang);
}
