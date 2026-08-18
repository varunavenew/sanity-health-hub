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
import { categoryRouteSegmentMatches, categorySlugForFetch, behandlingerCategorySegment, FLERE_FAGOMRADER_CATEGORY_ID } from "@/lib/sanity/category-keys";
import { fertilitetTreatmentSlugCandidates } from "@/lib/sanity/fertilitet-slug-aliases";
import { gynekologiTreatmentSlugCandidates } from "@/lib/sanity/gynekologi-slug-aliases";
import { graviditetTreatmentSlugCandidates } from "@/lib/sanity/graviditet-slug-aliases";
import { urologiTreatmentSlugCandidates } from "@/lib/sanity/urologi-slug-aliases";
import { ortopediTreatmentSlugCandidates } from "@/lib/sanity/ortopedi-slug-aliases";
import { flereFagomraderTreatmentSlugCandidates } from "@/lib/sanity/flere-fagomrader-slug-aliases";

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
  row: { slugNb?: string; slugEn?: string; categoryId?: string },
  treatmentSlug: string,
  lang: "no" | "en",
): boolean {
  const pair = slugPairFromDoc(row);
  if (!pair) return false;
  const categoryId = row.categoryId;
  const candidates =
    categoryId === "fertilitet"
      ? fertilitetTreatmentSlugCandidates(treatmentSlug)
      : categoryId === "gynekologi"
        ? gynekologiTreatmentSlugCandidates(treatmentSlug)
        : categoryId === "graviditet"
          ? graviditetTreatmentSlugCandidates(treatmentSlug)
          : categoryId === "urologi"
            ? urologiTreatmentSlugCandidates(treatmentSlug)
            : categoryId === "ortopedi"
              ? ortopediTreatmentSlugCandidates(treatmentSlug)
              : categoryId === FLERE_FAGOMRADER_CATEGORY_ID
                ? flereFagomraderTreatmentSlugCandidates(treatmentSlug)
                : [treatmentSlug];
  return candidates.some(
    (candidate) =>
      slugForLocale(pair, lang) === candidate ||
      pair.slugNb === candidate ||
      pair.slugEn === candidate,
  );
}

function treatmentMatchesCategory(
  row: {
    categoryId?: string;
    categoryIds?: string[];
    categorySlugNb?: string;
    categorySlugEn?: string;
  },
  categorySlug: string,
  category?: { categoryId?: string },
): boolean {
  if (category?.categoryId) {
    if (row.categoryId === category.categoryId) return true;
    if (row.categoryIds?.includes(category.categoryId)) return true;
  }
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
    return {
      nbPath: `/no/${cPair.slugNb}/${tPair.slugNb}`,
      enPath: `/en/${cPair.slugEn}/${tPair.slugEn}`,
    };
  }

  const nbCat =
    cat?.slugNb ||
    (cat?.categoryId && behandlingerCategorySegment(cat.categoryId, "no")) ||
    categorySlug;
  const enCat =
    cat?.slugEn ||
    (cat?.categoryId && behandlingerCategorySegment(cat.categoryId, "en")) ||
    categorySlug;
  return {
    nbPath: `/no/${nbCat}/${treatmentSlug}`,
    enPath: `/en/${enCat}/${treatmentSlug}`,
  };
}
