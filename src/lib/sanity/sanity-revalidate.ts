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
  contactPage: "sanity:contactPage",
  aboutPage: "sanity:aboutPage",
  privacyPolicyPage: "sanity:privacyPolicyPage",
  type: (documentType: string) => `sanity:type:${documentType}`,
  article: (slug: string) => `sanity:article:${slug}`,
  treatment: (categorySlug: string, treatmentSlug: string) =>
    `sanity:treatment:${categorySlug}:${treatmentSlug}`,
  treatmentCategory: (slug: string) => `sanity:treatmentCategory:${slug}`,
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
      paths.add("/nb");
      paths.add("/en");
      break;
    case "contactPage":
      tags.add(SANITY_CACHE_TAGS.contactPage);
      paths.add("/nb/kontakt");
      paths.add("/en/contact");
      break;
    case "aboutPage":
      tags.add(SANITY_CACHE_TAGS.aboutPage);
      paths.add("/nb/om-oss");
      paths.add("/en/about");
      break;
    case "privacyPolicyPage":
      tags.add(SANITY_CACHE_TAGS.privacyPolicyPage);
      paths.add("/nb/personvern");
      paths.add("/en/personvern");
      break;
    case "article": {
      for (const slug of slugValues(doc.slug)) {
        tags.add(SANITY_CACHE_TAGS.article(slug));
        paths.add(`/nb/aktuelt/${slug}`);
        paths.add(`/en/aktuelt/${slug}`);
      }
      paths.add("/nb/aktuelt");
      paths.add("/en/aktuelt");
      break;
    }
    case "treatmentCategory": {
      for (const slug of slugValues(doc.slug)) {
        tags.add(SANITY_CACHE_TAGS.treatmentCategory(slug));
        paths.add(`/nb/behandlinger/${slug}`);
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
          paths.add(`/nb/behandlinger/${categorySlug}/${treatmentSlug}`);
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
