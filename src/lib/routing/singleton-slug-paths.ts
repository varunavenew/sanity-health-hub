export {
  buildLocalePath,
  pathsForSlugPair,
  pathsForRoute,
  fetchListingSlugPair,
  fetchSingletonLocalizedPaths,
  fetchDetailLocalizedPaths,
  buildArticlePaths,
  buildClinicPaths,
  buildSpecialistPaths,
} from "@/lib/routing/path-builder";

import { fetchCmsRouteIndex } from "@/lib/routing/fetch-route-index";
import {
  localizedPathsFromSlugPair,
  slugForLocale,
  slugPairFromDoc,
} from "@/lib/routing/cms-route-types";
import { categoryRouteSegmentMatches, categorySlugForFetch, behandlingerCategorySegment } from "@/lib/sanity/category-keys";

export async function fetchThemeLocalizedPaths(
  urlSlug: string,
): Promise<{ nbPath: string; enPath: string }> {
  const index = await fetchCmsRouteIndex();
  const segment = urlSlug.replace(/^\/+|\/+$/g, "");
  const theme = index.themes.find((row) => {
    const pair = slugPairFromDoc(row);
    if (!pair) return false;
    return pair.slugNb === segment || pair.slugEn === segment;
  });
  const pair = slugPairFromDoc(theme);
  if (!pair) {
    throw new Error(`Missing CMS slug for theme page: ${urlSlug}`);
  }
  return localizedPathsFromSlugPair(pair);
}

export async function pathsForDetailBySlug(
  collection: "articles" | "clinics" | "specialists" | "jobs",
  listingKey: "newsPage" | "clinicsPage" | "specialistsListingPage" | "careersPage",
  slug: string,
  sanityLang: "no" | "en",
): Promise<{ nbPath: string; enPath: string }> {
  const index = await fetchCmsRouteIndex();
  const listing = index.listings[listingKey];
  if (!listing) {
    throw new Error(`Missing CMS listing slug: ${listingKey}`);
  }
  const docs = index[collection];
  const doc = docs.find((row) => slugForLocale(slugPairFromDoc(row) ?? undefined, sanityLang === "en" ? "en" : "no") === slug);
  const detailPair = slugPairFromDoc(doc);
  if (!detailPair) {
    return {
      nbPath: `/no/${listing.slugNb}/${slug}`,
      enPath: `/en/${listing.slugEn}/${slug}`,
    };
  }
  return {
    nbPath: `/no/${listing.slugNb}/${detailPair.slugNb}`,
    enPath: `/en/${listing.slugEn}/${detailPair.slugEn}`,
  };
}

export async function pathsForCategorySlug(categorySlug: string): Promise<{ nbPath: string; enPath: string }> {
  const index = await fetchCmsRouteIndex();
  const cat = index.categories.find(
    (row) =>
      categoryRouteSegmentMatches(categorySlug, row) ||
      row.categoryId === categorySlug ||
      row.slugNb === categorySlug ||
      row.slugEn === categorySlug,
  );
  const pair = slugPairFromDoc(cat);
  if (!pair) throw new Error(`Missing CMS category slug: ${categorySlug}`);
  return localizedPathsFromSlugPair(pair);
}

function treatmentSlugMatches(
  row: { slugNb?: string; slugEn?: string },
  treatmentSlug: string,
  lang: "no" | "en",
): boolean {
  const pair = slugPairFromDoc(row);
  if (!pair) return false;
  return (
    slugForLocale(pair, lang) === treatmentSlug ||
    pair.slugNb === treatmentSlug ||
    pair.slugEn === treatmentSlug
  );
}

function treatmentMatchesCategory(
  row: {
    categoryId?: string;
    categorySlugNb?: string;
    categorySlugEn?: string;
  },
  categorySlug: string,
  category?: { categoryId?: string },
): boolean {
  if (category?.categoryId && row.categoryId === category.categoryId) return true;
  return (
    categoryRouteSegmentMatches(categorySlug, {
      categoryId: row.categoryId,
      slugNb: row.categorySlugNb,
      slugEn: row.categorySlugEn,
    }) || categorySlug === row.categoryId
  );
}

export async function pathsForTreatment(
  categorySlug: string,
  treatmentSlug: string,
  sanityLang: "no" | "en",
): Promise<{ nbPath: string; enPath: string }> {
  const index = await fetchCmsRouteIndex();
  const lang = sanityLang === "en" ? "en" : "no";
  const normalizedCategory = categorySlugForFetch(categorySlug);

  const cat = index.categories.find(
    (row) =>
      categoryRouteSegmentMatches(categorySlug, row) ||
      row.categoryId === normalizedCategory ||
      row.categoryId === categorySlug ||
      row.slugNb === categorySlug ||
      row.slugEn === categorySlug,
  );

  let treatment = index.treatments.find((row) => {
    if (!treatmentSlugMatches(row, treatmentSlug, lang)) return false;
    return treatmentMatchesCategory(row, categorySlug, cat);
  });

  if (!treatment) {
    treatment = index.treatments.find((row) => {
      if (!treatmentSlugMatches(row, treatmentSlug, lang)) return false;
      return treatmentMatchesCategory(row, normalizedCategory, cat);
    });
  }

  const tPair = slugPairFromDoc(treatment);
  const resolvedCat =
    cat ?? index.categories.find((c) => c.categoryId === treatment?.categoryId);
  const cPair = slugPairFromDoc(resolvedCat);

  if (tPair && cPair) {
    const categoryId = resolvedCat?.categoryId || normalizedCategory;
    const nbCat = behandlingerCategorySegment(categoryId, "no") || cPair.slugNb;
    const enCat = behandlingerCategorySegment(categoryId, "en") || cPair.slugEn;
    return {
      nbPath: `/no/behandlinger/${nbCat}/${tPair.slugNb}`,
      enPath: `/en/behandlinger/${enCat}/${tPair.slugEn}`,
    };
  }

  const nbCat =
    (cat?.categoryId && behandlingerCategorySegment(cat.categoryId, "no")) ||
    categorySlug;
  const enCat =
    (cat?.categoryId && behandlingerCategorySegment(cat.categoryId, "en")) ||
    categorySlug;
  return {
    nbPath: `/no/behandlinger/${nbCat}/${treatmentSlug}`,
    enPath: `/en/behandlinger/${enCat}/${treatmentSlug}`,
  };
}
