import type {
  CmsRouteIndex,
  ListingSlugs,
  ResolvedCmsRoute,
  RouteIndexDoc,
  SlugPair,
} from "@/lib/routing/cms-route-types";
import {
  normalizeSlugSegment,
  slugForLocale,
  slugPairFromDoc,
} from "@/lib/routing/cms-route-types";

function listingSlug(
  listings: ListingSlugs,
  key: keyof ListingSlugs,
  locale: string,
): string {
  return slugForLocale(listings[key] ?? undefined, locale);
}

function docSlug(doc: RouteIndexDoc, locale: string): string {
  return slugForLocale(slugPairFromDoc(doc) ?? undefined, locale);
}

function matchDoc(
  docs: RouteIndexDoc[],
  segment: string,
  locale: string,
): RouteIndexDoc | undefined {
  return docs.find((doc) => docSlug(doc, locale) === segment);
}

function buildRoute(
  kind: ResolvedCmsRoute["kind"],
  documentType: string,
  slug: string,
  segments: string[],
  slugPair: SlugPair,
  extra?: Partial<ResolvedCmsRoute>,
): ResolvedCmsRoute {
  return {
    kind,
    documentType,
    slug,
    segments,
    slugPair,
    ...extra,
  };
}

/** Resolve URL path segments to a CMS route (no hardcoded slug fallbacks). */
export function resolveCmsRoute(
  segments: string[],
  locale: string,
  index: CmsRouteIndex,
): ResolvedCmsRoute | null {
  const normalized = segments.map(normalizeSlugSegment).filter(Boolean);
  if (normalized.length === 0) return null;

  const lang = locale === "en" ? "en" : "no";
  const { listings } = index;

  // Legacy: /behandlinger/{category}/{treatment}
  if (normalized[0] === "behandlinger" && normalized.length >= 2) {
    const rest = normalized.slice(1);
    return resolveCmsRoute(rest, locale, index);
  }

  // Two segments: collection detail or category/treatment
  if (normalized.length === 2) {
    const [prefix, detailSlug] = normalized;

    const newsPrefix = listingSlug(listings, "newsPage", lang);
    if (newsPrefix && prefix === newsPrefix) {
      const article = matchDoc(index.articles, detailSlug, lang);
      const pair = slugPairFromDoc(article);
      if (article && pair) {
        return buildRoute("article", "article", detailSlug, normalized, pair, {
          listingType: "newsPage",
        });
      }
    }

    const clinicsPrefix = listingSlug(listings, "clinicsPage", lang);
    if (clinicsPrefix && prefix === clinicsPrefix) {
      const clinic = matchDoc(index.clinics, detailSlug, lang);
      const pair = slugPairFromDoc(clinic);
      if (clinic && pair) {
        return buildRoute("clinic", "clinicPage", detailSlug, normalized, pair, {
          listingType: "clinicsPage",
        });
      }
    }

    const specialistsPrefix = listingSlug(listings, "specialistsListingPage", lang);
    if (specialistsPrefix && prefix === specialistsPrefix) {
      const specialist = matchDoc(index.specialists, detailSlug, lang);
      const pair = slugPairFromDoc(specialist);
      if (specialist && pair) {
        return buildRoute("specialist", "specialist", detailSlug, normalized, pair, {
          listingType: "specialistsListingPage",
        });
      }
    }

    const careersPrefix = listingSlug(listings, "careersPage", lang);
    if (careersPrefix && prefix === careersPrefix) {
      const job = matchDoc(index.jobs, detailSlug, lang);
      const pair = slugPairFromDoc(job);
      if (job && pair) {
        return buildRoute("job", "jobListing", detailSlug, normalized, pair, {
          listingType: "careersPage",
        });
      }
    }

    // Category / treatment
    const category = matchDoc(index.categories, prefix, lang);
    if (category) {
      const treatment = index.treatments.find((t) => {
        if (docSlug(t, lang) !== detailSlug) return false;
        const catSlugNb = normalizeSlugSegment(t.categorySlugNb || category.categoryId || "");
        const catSlugEn = normalizeSlugSegment(t.categorySlugEn || catSlugNb);
        const catSlug = lang === "en" ? catSlugEn : catSlugNb;
        return catSlug === prefix || category.categoryId === t.categoryId;
      });
      const pair = slugPairFromDoc(treatment);
      if (treatment && pair) {
        return buildRoute("treatment", "treatment", detailSlug, normalized, pair, {
          categorySlug: prefix,
          categoryId: category.categoryId || treatment.categoryId,
        });
      }
    }
  }

  // One segment
  if (normalized.length === 1) {
    const [segment] = normalized;

    const page = matchDoc(index.singletons, segment, lang);
    const singletonPair = slugPairFromDoc(page);
    if (page && singletonPair) {
      return buildRoute("singleton", page._type, segment, normalized, singletonPair);
    }

    const theme = matchDoc(index.themes, segment, lang);
    const themePair = slugPairFromDoc(theme);
    if (theme && themePair) {
      return buildRoute("theme", "themePage", segment, normalized, themePair);
    }

    const category = matchDoc(index.categories, segment, lang);
    const categoryPair = slugPairFromDoc(category);
    if (category && categoryPair) {
      return buildRoute("category", "treatmentCategory", segment, normalized, categoryPair, {
        categoryId: category.categoryId,
        categorySlug: segment,
      });
    }

    // Listing pages (news, clinics, specialists, careers)
    for (const [listingType, pair] of Object.entries(listings) as [
      keyof ListingSlugs,
      SlugPair | undefined,
    ][]) {
      if (pair && slugForLocale(pair, lang) === segment) {
        return buildRoute("listing", listingType, segment, normalized, pair, {
          listingType,
        });
      }
    }
  }

  return null;
}

export function staticParamsFromRouteIndex(
  index: CmsRouteIndex,
): Array<{ locale: string; segments: string[] }> {
  const params: Array<{ locale: string; segments: string[] }> = [];
  const seen = new Set<string>();

  const push = (locale: string, segments: string[]) => {
    const key = `${locale}:${segments.join("/")}`;
    if (!segments.length || seen.has(key)) return;
    seen.add(key);
    params.push({ locale, segments });
  };

  for (const locale of ["no", "en"] as const) {
    const lang = locale === "en" ? "en" : "no";

    for (const doc of index.singletons) {
      const pair = slugPairFromDoc(doc);
      const slug = slugForLocale(pair ?? undefined, lang);
      if (slug) push(locale, [slug]);
    }

    for (const doc of index.themes) {
      const pair = slugPairFromDoc(doc);
      const slug = slugForLocale(pair ?? undefined, lang);
      if (slug) push(locale, [slug]);
    }

    for (const doc of index.categories) {
      const pair = slugPairFromDoc(doc);
      const slug = slugForLocale(pair ?? undefined, lang);
      if (slug) push(locale, [slug]);
    }

    for (const listingType of Object.keys(index.listings) as (keyof ListingSlugs)[]) {
      const pair = index.listings[listingType];
      const slug = slugForLocale(pair, lang);
      if (slug) push(locale, [slug]);
    }

    const newsPrefix = listingSlug(index.listings, "newsPage", lang);
    for (const doc of index.articles) {
      const slug = docSlug(doc, lang);
      if (newsPrefix && slug) push(locale, [newsPrefix, slug]);
    }

    const clinicsPrefix = listingSlug(index.listings, "clinicsPage", lang);
    for (const doc of index.clinics) {
      const slug = docSlug(doc, lang);
      if (clinicsPrefix && slug) push(locale, [clinicsPrefix, slug]);
    }

    const specialistsPrefix = listingSlug(index.listings, "specialistsListingPage", lang);
    for (const doc of index.specialists) {
      const slug = docSlug(doc, lang);
      if (specialistsPrefix && slug) push(locale, [specialistsPrefix, slug]);
    }

    const careersPrefix = listingSlug(index.listings, "careersPage", lang);
    for (const doc of index.jobs) {
      const slug = docSlug(doc, lang);
      if (careersPrefix && slug) push(locale, [careersPrefix, slug]);
    }

    for (const doc of index.treatments) {
      const treatmentSlug = docSlug(doc, lang);
      const categorySlug = normalizeSlugSegment(
        lang === "en" ? doc.categorySlugEn || doc.categorySlugNb || "" : doc.categorySlugNb || "",
      );
      if (categorySlug && treatmentSlug) {
        push(locale, [categorySlug, treatmentSlug]);
      }
    }
  }

  return params;
}
