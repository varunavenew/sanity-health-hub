import {
  localizedPathsFromSlugPair,
  slugPairFromDoc,
} from "@/lib/routing/cms-route-types";

/**
 * ISR + webhook invalidation for Sanity-backed Next.js routes.
 * - Segment `export const revalidate` uses these same intervals where applicable.
 * - `unstable_cache` on GROQ fetches uses matching `revalidate` + `tags` for `revalidateTag`.
 */

export const SANITY_DATA_REVALIDATE_SEC = {
  /** Marketing home + shared singletons that change often */
  homepage: 300,
  /** Contact / about singleton documents */
  singletonPage: 600,
} as const;

/** Tags passed to `unstable_cache` / consumed by `/api/revalidate` */
export const SANITY_CACHE_TAGS = {
  /** Bust all tagged Sanity fetches (use sparingly from webhook). */
  all: "sanity",
  homepage: "sanity:homepage",
  newsPage: "sanity:newsPage",
  contactPage: "sanity:contactPage",
  aboutPage: "sanity:aboutPage",
  privacyPolicyPage: "sanity:privacyPolicyPage",
  type: (documentType: string) => `sanity:type:${documentType}`,
  article: (slug: string) => `sanity:article:${slug}`,
  treatment: (categorySlug: string, treatmentSlug: string) =>
    `sanity:treatment:${categorySlug}:${treatmentSlug}`,
  treatmentCategory: (slug: string) => `sanity:treatmentCategory:${slug}`,
  cmsPageSlugIndex: "sanity:cmsPageSlugIndex",
  cmsRouteIndex: "sanity:cmsRouteIndex",
} as const;

export type SanityDocRef = {
  _type?: string;
  slug?:
    | { current?: string }
    | string
    | Array<{ language?: string; _key?: string; value?: { current?: string } }>;
  /** Optional webhook projection fields for nested routes */
  parentSlug?: string | Array<{ value?: { current?: string } }>;
  categorySlug?: string | Array<{ value?: { current?: string } }>;
};

export type SanityInvalidationPlan = {
  tags: string[];
  paths: string[];
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

function slugPairFromDocRef(doc: SanityDocRef) {
  if (Array.isArray(doc.slug)) {
    const no = doc.slug.find((e) => (e.language || e._key) === "no")?.value?.current;
    const en = doc.slug.find((e) => (e.language || e._key) === "en")?.value?.current;
    return slugPairFromDoc({ slugNb: no, slugEn: en });
  }
  const legacy = slugValues(doc.slug)[0];
  return slugPairFromDoc({ slugNb: legacy, slugEn: legacy });
}

function addLocalizedSlugPaths(
  paths: Set<string>,
  doc: SanityDocRef,
) {
  const pair = slugPairFromDocRef(doc);
  if (!pair) return;
  const { nbPath, enPath } = localizedPathsFromSlugPair(pair);
  paths.add(nbPath);
  paths.add(enPath);
}

function addSingletonPaths(
  paths: Set<string>,
  tags: Set<string>,
  doc: SanityDocRef,
) {
  addLocalizedSlugPaths(paths, doc);
  tags.add(SANITY_CACHE_TAGS.cmsRouteIndex);
}

/**
 * Maps a published Sanity document shape (from a webhook projection) to
 * `revalidateTag` targets and locale-prefixed `revalidatePath` entries.
 */
export function invalidationPlanFromSanityDoc(doc: SanityDocRef): SanityInvalidationPlan {
  const tags = new Set<string>([SANITY_CACHE_TAGS.all]);
  const paths = new Set<string>();

  const t = doc._type;
  if (t) {
    tags.add(SANITY_CACHE_TAGS.type(t));
  }

  switch (t) {
    case "homepage":
      tags.add(SANITY_CACHE_TAGS.homepage);
      paths.add("/no");
      paths.add("/en");
      break;
    case "contactPage":
      tags.add(SANITY_CACHE_TAGS.contactPage);
      addSingletonPaths(paths, tags, doc);
      break;
    case "aboutPage":
      tags.add(SANITY_CACHE_TAGS.aboutPage);
      addSingletonPaths(paths, tags, doc);
      break;
    case "privacyPolicyPage":
      tags.add(SANITY_CACHE_TAGS.privacyPolicyPage);
      addSingletonPaths(paths, tags, doc);
      break;
    case "pricingPage":
    case "insurancePage":
    case "servicesPage":
    case "specialistsPage":
    case "specialistsListingPage":
    case "clinicsPage":
    case "careersPage":
      addSingletonPaths(paths, tags, doc);
      break;
    case "themePage":
      addLocalizedSlugPaths(paths, doc);
      tags.add(SANITY_CACHE_TAGS.cmsRouteIndex);
      break;
    case "article": {
      for (const slug of slugValues(doc.slug)) {
        tags.add(SANITY_CACHE_TAGS.article(slug));
        paths.add(`/no/aktuelt/${slug}`);
        paths.add(`/en/news/${slug}`);
        paths.add(`/en/aktuelt/${slug}`);
      }
      paths.add("/no/aktuelt");
      paths.add("/en/news");
      break;
    }
    case "newsPage":
      tags.add(SANITY_CACHE_TAGS.newsPage);
      addSingletonPaths(paths, tags, doc);
      break;
    case "treatmentCategory": {
      for (const slug of slugValues(doc.slug)) {
        tags.add(SANITY_CACHE_TAGS.treatmentCategory(slug));
        paths.add(`/no/behandlinger/${slug}`);
        paths.add(`/en/behandlinger/${slug}`);
      }
      tags.add(SANITY_CACHE_TAGS.type("treatment"));
      break;
    }
    case "treatment": {
      const treatmentSlugs = slugValues(doc.slug);
      const categorySlugs = slugValues(doc.parentSlug ?? doc.categorySlug);
      tags.add(SANITY_CACHE_TAGS.type("treatment"));
      for (const categorySlug of categorySlugs.length ? categorySlugs : [doc.categorySlug].filter(Boolean) as string[]) {
        for (const treatmentSlug of treatmentSlugs) {
          tags.add(SANITY_CACHE_TAGS.treatment(categorySlug, treatmentSlug));
          paths.add(`/no/behandlinger/${categorySlug}/${treatmentSlug}`);
          paths.add(`/en/behandlinger/${categorySlug}/${treatmentSlug}`);
        }
      }
      break;
    }
    default:
      break;
  }

  return { tags: [...tags], paths: [...paths] };
}
