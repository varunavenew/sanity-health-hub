import { FERTILITET_NAV_TREATMENT_SLUGS } from "@/lib/sanity/fertilitet-slug-aliases";
import { GRAVIDITET_NAV_TREATMENT_SLUGS } from "@/lib/sanity/graviditet-slug-aliases";
import { GYNEKOLOGI_NAV_TREATMENT_SLUGS } from "@/lib/sanity/gynekologi-slug-aliases";
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

export const UROLOGI_NAV_TREATMENT_SLUGS = [
  "blaere",
  "forhud",
  "infertilitet",
  "nyrer",
  "prostata",
  "refertilisering",
  "robotkirurgi",
  "sterilisering",
  "testikler",
] as const;

export const ORTOPEDI_NAV_TREATMENT_SLUGS = [
  "fot-ankel",
  "hofte",
  "hand-albue",
  "kne",
  "skulder",
] as const;

export const FLERE_FAGOMRADER_NAV_TREATMENT_SLUGS = [
  "endokrinologi",
  "ernaringsfysiolog",
  "hudhelse",
  "gastrokirurgi",
  "osteopati",
  "plastikkirurgi",
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
    "hemorroider-og-endetarmsplager",
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
  return items.find((item) => {
    if (wanted.has(item.id)) return true;
    return slugCandidates(categoryId, item.id).some((candidate) =>
      wanted.has(candidate),
    );
  });
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

  return order
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
    .filter((item) => !nestedSlugs.has(item.id));
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
