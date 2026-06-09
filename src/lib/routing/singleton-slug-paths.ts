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
      row.categoryId === categorySlug ||
      row.slugNb === categorySlug ||
      row.slugEn === categorySlug,
  );
  const pair = slugPairFromDoc(cat);
  if (!pair) throw new Error(`Missing CMS category slug: ${categorySlug}`);
  return localizedPathsFromSlugPair(pair);
}

export async function pathsForTreatment(
  categorySlug: string,
  treatmentSlug: string,
  sanityLang: "no" | "en",
): Promise<{ nbPath: string; enPath: string }> {
  const index = await fetchCmsRouteIndex();
  const lang = sanityLang === "en" ? "en" : "no";
  const treatment = index.treatments.find((row) => {
    if (slugForLocale(slugPairFromDoc(row) ?? undefined, lang) !== treatmentSlug) return false;
    const catNb = row.categorySlugNb || row.categoryId || "";
    const catEn = row.categorySlugEn || catNb;
    return categorySlug === catNb || categorySlug === catEn || categorySlug === row.categoryId;
  });
  const tPair = slugPairFromDoc(treatment);
  const cat = index.categories.find((c) => c.categoryId === treatment?.categoryId);
  const cPair = slugPairFromDoc(cat);
  if (!tPair || !cPair) {
    throw new Error(`Missing CMS treatment path: ${categorySlug}/${treatmentSlug}`);
  }
  return {
    nbPath: `/no/${cPair.slugNb}/${tPair.slugNb}`,
    enPath: `/en/${cPair.slugEn}/${tPair.slugEn}`,
  };
}
