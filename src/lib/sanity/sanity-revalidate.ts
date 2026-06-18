import { CMS_ROUTE_INDEX_QUERY, NAV_PATHS_FOR_ROUTE_INDEX_QUERY } from "@/lib/queries";
import {
  cmsInvalidationPaths,
  type SanityDocRef,
} from "@/lib/routing/cms-invalidation-paths";
import type { CmsRouteIndex } from "@/lib/routing/cms-route-types";
import { enrichRouteIndexWithNavPaths } from "@/lib/routing/enrich-route-index";
import { sanityClient } from "@/lib/sanityClient";

export type { SanityDocRef };

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

export type SanityInvalidationPlan = {
  tags: string[];
  paths: string[];
};

const LISTING_OWNER_TYPES = new Set([
  "newsPage",
  "clinicsPage",
  "specialistsListingPage",
  "careersPage",
]);

async function fetchRouteIndexForInvalidation(): Promise<CmsRouteIndex | null> {
  try {
    const [index, navItems] = await Promise.all([
      sanityClient.fetch<CmsRouteIndex>(CMS_ROUTE_INDEX_QUERY),
      sanityClient.fetch<import("@/lib/routing/enrich-route-index").NavPathSource[]>(
        NAV_PATHS_FOR_ROUTE_INDEX_QUERY,
      ),
    ]);
    return enrichRouteIndexWithNavPaths(index, navItems ?? []);
  } catch {
    return null;
  }
}

function addSlugTags(tags: Set<string>, doc: SanityDocRef) {
  const slugValues = (slug: SanityDocRef["slug"]): string[] => {
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
  };

  for (const slug of [...slugValues(doc.slug), ...slugValues(doc.slugBefore)]) {
    if (doc._type === "article") tags.add(SANITY_CACHE_TAGS.article(slug));
    if (doc._type === "treatmentCategory") tags.add(SANITY_CACHE_TAGS.treatmentCategory(slug));
  }
}

/**
 * Maps a published Sanity document shape (from a webhook projection) to
 * `revalidateTag` targets and locale-prefixed `revalidatePath` entries.
 */
export async function invalidationPlanFromSanityDoc(
  doc: SanityDocRef,
): Promise<SanityInvalidationPlan> {
  const tags = new Set<string>([SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.cmsRouteIndex]);
  const paths = new Set<string>();

  const t = doc._type;
  if (t) {
    tags.add(SANITY_CACHE_TAGS.type(t));
  }

  if (t === "homepage") {
    tags.add(SANITY_CACHE_TAGS.homepage);
  }
  if (t === "contactPage") tags.add(SANITY_CACHE_TAGS.contactPage);
  if (t === "aboutPage") tags.add(SANITY_CACHE_TAGS.aboutPage);
  if (t === "privacyPolicyPage") tags.add(SANITY_CACHE_TAGS.privacyPolicyPage);
  if (t === "newsPage") tags.add(SANITY_CACHE_TAGS.newsPage);

  addSlugTags(tags, doc);

  const index = await fetchRouteIndexForInvalidation();
  for (const path of cmsInvalidationPaths(doc, index)) {
    paths.add(path);
  }

  // When a listing prefix slug changes, child detail pages must re-resolve too.
  if (t && LISTING_OWNER_TYPES.has(t)) {
    paths.add("/no");
    paths.add("/en");
  }

  return { tags: [...tags], paths: [...paths] };
}
