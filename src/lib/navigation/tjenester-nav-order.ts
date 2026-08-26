import { FERTILITET_NAV_TREATMENT_SLUGS } from "@/lib/sanity/fertilitet-slug-aliases";
import { GRAVIDITET_NAV_TREATMENT_SLUGS } from "@/lib/sanity/graviditet-slug-aliases";
import { GYNEKOLOGI_NAV_TREATMENT_SLUGS } from "@/lib/sanity/gynekologi-slug-aliases";
import {
  UROLOGI_NAV_TREATMENT_SLUGS,
  resolveUrologiTreatmentSlug,
} from "@/lib/sanity/urologi-slug-aliases";
import {
  ORTOPEDI_NAV_TREATMENT_SLUGS,
  resolveOrtopediTreatmentSlug,
} from "@/lib/sanity/ortopedi-slug-aliases";
import { FLERE_FAGOMRADER_CATEGORY_ID } from "@/lib/sanity/category-keys";
import { resolveFertilitetTreatmentSlug } from "@/lib/sanity/fertilitet-slug-aliases";
import { resolveGraviditetTreatmentSlug } from "@/lib/sanity/graviditet-slug-aliases";
import { resolveGynekologiTreatmentSlug } from "@/lib/sanity/gynekologi-slug-aliases";
import { resolveFlereFagomraderTreatmentSlug } from "@/lib/sanity/flere-fagomrader-slug-aliases";

/** Left-column Tjenester order (demo). */
export const TJENESTER_CATEGORY_NAV_ORDER = [
  "fertilitet",
  "gynekologi",
  "graviditet",
  "urologi",
  "ortopedi",
  FLERE_FAGOMRADER_CATEGORY_ID,
] as const;

export { UROLOGI_NAV_TREATMENT_SLUGS };

export { ORTOPEDI_NAV_TREATMENT_SLUGS };

export const FLERE_FAGOMRADER_NAV_TREATMENT_SLUGS = [
  "endokrinologi",
  "ernaringsfysiolog",
  "hudhelse",
  "gastrokirurgi",
  "osteopati",
  "psykologi",
  "revmatologi",
  "robotkirurgi",
  "sexologi",
  "areknuter",
] as const;

/** Nested third-column items under Flere tjenester (demo chevrons). */
export const FLERE_FAGOMRADER_NAV_NESTED: Record<string, readonly string[]> = {
  hudhelse: ["hudbehandlinger", "behandlingsutstyr", "hudpleieprodukter"],
  gastrokirurgi: [
    "overvektskirurgi",
    "brokkoperasjon",
    "hemorroider",
  ],
};

const NAV_SLUGS_BY_CATEGORY: Record<string, readonly string[]> = {
  fertilitet: FERTILITET_NAV_TREATMENT_SLUGS,
  gynekologi: GYNEKOLOGI_NAV_TREATMENT_SLUGS,
  graviditet: GRAVIDITET_NAV_TREATMENT_SLUGS,
  urologi: UROLOGI_NAV_TREATMENT_SLUGS,
  ortopedi: ORTOPEDI_NAV_TREATMENT_SLUGS,
  [FLERE_FAGOMRADER_CATEGORY_ID]: FLERE_FAGOMRADER_NAV_TREATMENT_SLUGS,
};

function resolveNavSlug(categoryId: string, slug: string): string {
  if (categoryId === "fertilitet") return resolveFertilitetTreatmentSlug(slug);
  if (categoryId === "graviditet") return resolveGraviditetTreatmentSlug(slug);
  if (categoryId === "gynekologi") return resolveGynekologiTreatmentSlug(slug);
  if (categoryId === "urologi") return resolveUrologiTreatmentSlug(slug);
  if (categoryId === "ortopedi") return resolveOrtopediTreatmentSlug(slug);
  if (categoryId === FLERE_FAGOMRADER_CATEGORY_ID) {
    return resolveFlereFagomraderTreatmentSlug(slug);
  }
  return slug;
}

function slugCandidates(categoryId: string, slug: string): string[] {
  const resolved = resolveNavSlug(categoryId, slug);
  return [...new Set([slug, resolved].filter(Boolean))];
}

export type TjenesterNavItem = {
  id: string;
  label: string;
  path: string;
  items?: Array<{ label: string; anchor?: string; path?: string }>;
};

function findNavItem(
  items: TjenesterNavItem[],
  categoryId: string,
  slug: string,
): TjenesterNavItem | undefined {
  const wanted = new Set(slugCandidates(categoryId, slug));
  const exact = items.find((item) => wanted.has(item.id));
  if (exact) return exact;
  // Alias fallback only when the canonical nav slug is missing (e.g. IVF → Assistert befruktning).
  return items.find((item) =>
    slugCandidates(categoryId, item.id).some((candidate) => wanted.has(candidate)),
  );
}

/** True when a treatment belongs in the Tjenester dropdown for this category. */
export function isTjenesterNavTreatmentSlug(
  categoryId: string,
  slug: string,
): boolean {
  const order = NAV_SLUGS_BY_CATEGORY[categoryId];
  if (!order) return false;
  const wanted = new Set(slugCandidates(categoryId, slug));
  return order.some((navSlug) =>
    slugCandidates(categoryId, navSlug).some((candidate) => wanted.has(candidate)),
  );
}

export function orderTjenesterSubcategories(
  categoryId: string,
  items: TjenesterNavItem[],
): TjenesterNavItem[] {
  const order = NAV_SLUGS_BY_CATEGORY[categoryId];
  if (!order) return items;

  const nested = categoryId === FLERE_FAGOMRADER_CATEGORY_ID
    ? FLERE_FAGOMRADER_NAV_NESTED
    : undefined;
  const nestedSlugs = new Set(
    nested ? Object.values(nested).flatMap((slugs) => [...slugs]) : [],
  );

  const ordered = order
    .map((slug) => {
      const item = findNavItem(items, categoryId, slug);
      if (!item) return null;
      const childSlugs = nested?.[slug];
      if (!childSlugs?.length) return item;
      const children = childSlugs
        .map((childSlug) => findNavItem(items, categoryId, childSlug))
        .filter((child): child is TjenesterNavItem => Boolean(child))
        .map((child) => ({
          label: child.label,
          path: child.path,
        }));
      return children.length > 0 ? { ...item, items: children } : item;
    })
    .filter((item): item is TjenesterNavItem => Boolean(item))
    .filter((item) => {
      if (nestedSlugs.has(item.id)) return false;
      return !slugCandidates(categoryId, item.id).some((slug) =>
        nestedSlugs.has(slug),
      );
    });

  const seen = new Set(
    ordered.flatMap((item) => slugCandidates(categoryId, item.id)),
  );
  const rest = items.filter((item) => {
    const candidates = slugCandidates(categoryId, item.id);
    if (candidates.some((slug) => seen.has(slug) || nestedSlugs.has(slug))) {
      return false;
    }
    candidates.forEach((slug) => seen.add(slug));
    return true;
  });

  return [...ordered, ...rest];
}

/** Keep category `treatments[]` drag order, then append other linked treatments. */
export function mergeCategoryNavTreatments<T extends { _id: string }>(
  referenced: T[],
  categoryTreatmentsOrder: Array<T | null | undefined>,
): T[] {
  const byId = new Map(referenced.map((row) => [row._id, row]));
  const seen = new Set<string>();
  const ordered: T[] = [];

  for (const row of categoryTreatmentsOrder) {
    const id = row?._id;
    if (!id) continue;
    const match = byId.get(id);
    if (!match || seen.has(id)) continue;
    seen.add(id);
    ordered.push(match);
  }

  for (const row of referenced) {
    if (seen.has(row._id)) continue;
    seen.add(row._id);
    ordered.push(row);
  }

  return ordered;
}

export function orderTjenesterCategories<T extends { id: string }>(
  categories: T[],
): T[] {
  const rank = new Map<string, number>(
    TJENESTER_CATEGORY_NAV_ORDER.map((id, index) => [id, index]),
  );
  return [...categories].sort((a, b) => {
    const aRank = rank.get(a.id) ?? 100;
    const bRank = rank.get(b.id) ?? 100;
    if (aRank !== bRank) return aRank - bRank;
    return 0;
  });
}
