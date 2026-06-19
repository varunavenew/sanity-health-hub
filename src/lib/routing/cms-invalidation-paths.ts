import type { CmsRouteIndex, ListingSlugs, SlugPair } from "@/lib/routing/cms-route-types";
import {
  localizedPathsFromSlugPair,
  normalizeSlugSegment,
  slugPairFromDoc,
} from "@/lib/routing/cms-route-types";
import { listingSlugPair } from "@/lib/routing/listing-default-slugs";
export type SanityDocRef = {
  _type?: string;
  slug?:
    | { current?: string }
    | string
    | Array<{ language?: string; _key?: string; value?: { current?: string } }>;
  /** Previous slug values — include in webhook projection when a slug changes. */
  slugBefore?:
    | { current?: string }
    | string
    | Array<{ language?: string; _key?: string; value?: { current?: string } }>;
  parentSlug?: string | Array<{ value?: { current?: string } }>;
  categorySlug?: string | Array<{ value?: { current?: string } }>;
};

function slugValues(slug: SanityDocRef["slug"]): string[] {
  if (!slug) return [];
  if (typeof slug === "string") return [slug];
  if (typeof slug === "object" && "current" in slug && typeof slug.current === "string") {
    return [slug.current];
  }
  if (Array.isArray(slug)) {
    return [
      ...new Set(
        slug
          .map((e) => e?.value?.current)
          .filter((s): s is string => typeof s === "string" && s.length > 0),
      ),
    ];
  }
  return [];
}

export function slugPairFromDocRef(doc: SanityDocRef): SlugPair | null {
  if (Array.isArray(doc.slug)) {
    const no = doc.slug.find((e) => (e.language || e._key) === "no")?.value?.current;
    const en = doc.slug.find((e) => (e.language || e._key) === "en")?.value?.current;
    return slugPairFromDoc({ slugNb: no, slugEn: en });
  }
  const legacy = slugValues(doc.slug)[0];
  return slugPairFromDoc({ slugNb: legacy, slugEn: legacy });
}

function slugPairsForDoc(doc: SanityDocRef): SlugPair[] {
  const pairs: SlugPair[] = [];
  const current = slugPairFromDocRef(doc);
  if (current) pairs.push(current);
  if (doc.slugBefore) {
    const previous = slugPairFromDocRef({ slug: doc.slugBefore });
    if (previous) pairs.push(previous);
  }
  return pairs;
}

function addPairPaths(paths: Set<string>, pair: SlugPair) {
  const { nbPath, enPath } = localizedPathsFromSlugPair(pair);
  paths.add(nbPath);
  paths.add(enPath);
}

function addDetailPaths(
  paths: Set<string>,
  listing: SlugPair,
  detail: SlugPair,
) {
  paths.add(`/no/${listing.slugNb}/${detail.slugNb}`);
  paths.add(`/en/${listing.slugEn}/${detail.slugEn}`);
  // Alternate-locale listing prefixes (bookmarks / legacy links).
  paths.add(`/en/${listing.slugNb}/${detail.slugNb}`);
  paths.add(`/no/${listing.slugEn}/${detail.slugEn}`);
}

function categorySlugValues(doc: SanityDocRef): SlugPair[] {
  const rows: SlugPair[] = [];
  for (const field of [doc.parentSlug, doc.categorySlug]) {
    if (!field) continue;
    if (typeof field === "string") {
      const normalized = normalizeSlugSegment(field);
      if (normalized) rows.push({ slugNb: normalized, slugEn: normalized });
      continue;
    }
    if (Array.isArray(field)) {
      const no = field.find((e) => (e as { language?: string }).language === "no")?.value?.current;
      const en = field.find((e) => (e as { language?: string }).language === "en")?.value?.current;
      const pair = slugPairFromDoc({ slugNb: no, slugEn: en });
      if (pair) rows.push(pair);
    }
  }
  return rows;
}

/** Build locale-prefixed paths to revalidate for a published Sanity document. */
export function cmsInvalidationPaths(
  doc: SanityDocRef,
  index?: CmsRouteIndex | null,
): string[] {
  const paths = new Set<string>();
  const listings: ListingSlugs = index?.listings ?? {};
  const type = doc._type;

  const pairs = slugPairsForDoc(doc);
  if (!pairs.length && type !== "homepage") return [];

  switch (type) {
    case "homepage":
      paths.add("/no");
      paths.add("/en");
      break;

    case "aboutPage":
    case "contactPage":
    case "privacyPolicyPage":
    case "pricingPage":
    case "insurancePage":
    case "servicesPage":
    case "specialistsPage":
    case "themePage":
      for (const pair of pairs) addPairPaths(paths, pair);
      break;

    case "newsPage":
    case "clinicsPage":
    case "specialistsListingPage":
    case "careersPage":
      for (const pair of pairs) addPairPaths(paths, pair);
      break;

    case "article": {
      const listing = listingSlugPair(listings, "newsPage");
      if (listing) {
        for (const pair of pairs) addDetailPaths(paths, listing, pair);
        addPairPaths(paths, listing);
      }
      break;
    }

    case "clinicPage": {
      const listing = listingSlugPair(listings, "clinicsPage");
      if (listing) {
        for (const pair of pairs) addDetailPaths(paths, listing, pair);
        addPairPaths(paths, listing);
      }
      break;
    }

    case "specialist": {
      const listing = listingSlugPair(listings, "specialistsListingPage");
      if (listing) {
        for (const pair of pairs) addDetailPaths(paths, listing, pair);
        addPairPaths(paths, listing);
      }
      break;
    }

    case "jobListing": {
      const listing = listingSlugPair(listings, "careersPage");
      if (listing) {
        for (const pair of pairs) addDetailPaths(paths, listing, pair);
        addPairPaths(paths, listing);
      }
      break;
    }

    case "treatmentCategory": {
      for (const pair of pairs) {
        addPairPaths(paths, pair);
        paths.add(`/no/behandlinger/${pair.slugNb}`);
        paths.add(`/en/behandlinger/${pair.slugEn}`);
      }
      break;
    }

    case "treatment": {
      const categoryPairs = categorySlugValues(doc);
      if (!categoryPairs.length && index?.treatments) {
        const treatmentSlug = pairs[0]?.slugNb;
        const match = index.treatments.find(
          (row) =>
            row.slugNb === treatmentSlug ||
            row.slugEn === treatmentSlug ||
            row.slugNb === pairs[0]?.slugEn,
        );
        const catPair = slugPairFromDoc(match);
        if (catPair) categoryPairs.push(catPair);
        const catNb = normalizeSlugSegment(match?.categorySlugNb || "");
        const catEn = normalizeSlugSegment(match?.categorySlugEn || catNb);
        if (catNb) categoryPairs.push({ slugNb: catNb, slugEn: catEn || catNb });
      }

      for (const detail of pairs) {
        for (const category of categoryPairs.length
          ? categoryPairs
          : [{ slugNb: "", slugEn: "" }]) {
          if (!category.slugNb && !category.slugEn) continue;
          paths.add(`/no/${category.slugNb}/${detail.slugNb}`);
          paths.add(`/en/${category.slugEn}/${detail.slugEn}`);
          paths.add(`/no/behandlinger/${category.slugNb}/${detail.slugNb}`);
          paths.add(`/en/behandlinger/${category.slugEn}/${detail.slugEn}`);
        }
      }
      break;
    }

    case "product":
      for (const pair of pairs) {
        paths.add(`/no/produkt/${pair.slugNb}`);
        paths.add(`/en/produkt/${pair.slugEn}`);
      }
      break;

    case "siteSettings":
      paths.add("/no");
      paths.add("/en");
      break;

    default:
      for (const pair of pairs) addPairPaths(paths, pair);
      break;
  }

  return [...paths];
}
