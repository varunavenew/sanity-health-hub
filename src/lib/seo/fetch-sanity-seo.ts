import {
  ABOUT_PAGE_QUERY,
  ARTICLE_BY_SLUG_QUERY,
  CONTACT_PAGE_QUERY,
  HOMEPAGE_QUERY,
  THEME_PAGE_QUERY,
  TREATMENT_BY_SLUG_QUERY,
  TREATMENT_CATEGORY_BY_SLUG_QUERY,
} from "@/lib/queries";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";
import { sanityFetchCached } from "@/lib/sanity/sanity-fetch-cached";
import {
  SANITY_CACHE_TAGS,
  SANITY_DATA_REVALIDATE_SEC,
} from "@/lib/sanity/sanity-revalidate";
import type { SanitySeoFields } from "@/lib/seo/seo-fields";

type DocWithSeo = { seo?: SanitySeoFields };

export async function fetchHomepageDocument(
  lang: "no" | "en",
): Promise<DocWithSeo | null> {
  return sanityFetchCached<DocWithSeo | null>({
    query: HOMEPAGE_QUERY,
    params: { lang },
    key: ["sanity", "homepage", lang, HOMEPAGE_QUERY],
    tags: [SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.homepage, SANITY_CACHE_TAGS.type("homepage")],
    revalidate: SANITY_DATA_REVALIDATE_SEC.homepage,
  });
}

export async function fetchContactPageDocument(
  lang: "no" | "en",
): Promise<DocWithSeo | null> {
  return sanityFetchCached<DocWithSeo | null>({
    query: CONTACT_PAGE_QUERY,
    params: { lang },
    key: ["sanity", "contactPage", lang, CONTACT_PAGE_QUERY],
    tags: [SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.contactPage, SANITY_CACHE_TAGS.type("contactPage")],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
}

export async function fetchAboutPageDocument(
  lang: "no" | "en",
): Promise<DocWithSeo | null> {
  return sanityFetchCached<DocWithSeo | null>({
    query: ABOUT_PAGE_QUERY,
    params: { lang },
    key: ["sanity", "aboutPage", lang, ABOUT_PAGE_QUERY],
    tags: [SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.aboutPage, SANITY_CACHE_TAGS.type("aboutPage")],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
}

export async function fetchArticleSeo(
  slug: string,
  lang: "no" | "en",
): Promise<
  | (DocWithSeo & {
      title?: string;
      excerpt?: string;
      date?: string;
    })
  | null
> {
  const raw = await sanityFetchCached({
    query: ARTICLE_BY_SLUG_QUERY,
    params: { slug, lang },
    key: ["sanity", "article", slug, lang, ARTICLE_BY_SLUG_QUERY],
    tags: [
      SANITY_CACHE_TAGS.all,
      SANITY_CACHE_TAGS.article(slug),
      SANITY_CACHE_TAGS.type("article"),
    ],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
  if (raw == null) return null;
  return normalizeI18n(raw, lang) as DocWithSeo & {
    title?: string;
    excerpt?: string;
    date?: string;
  };
}

export async function fetchTreatmentCategorySeo(
  slug: string,
  lang: "no" | "en",
): Promise<
  | (DocWithSeo & {
      title?: string;
      description?: string;
    })
  | null
> {
  const raw = await sanityFetchCached({
    query: TREATMENT_CATEGORY_BY_SLUG_QUERY,
    params: { slug, lang },
    key: ["sanity", "treatmentCategory", slug, lang, TREATMENT_CATEGORY_BY_SLUG_QUERY],
    tags: [
      SANITY_CACHE_TAGS.all,
      SANITY_CACHE_TAGS.treatmentCategory(slug),
      SANITY_CACHE_TAGS.type("treatmentCategory"),
    ],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
  if (raw == null) return null;
  return normalizeI18n(raw, lang) as DocWithSeo & {
    title?: string;
    description?: string;
  };
}

export async function fetchTreatmentSeo(
  categorySlug: string,
  treatmentSlug: string,
  lang: "no" | "en",
): Promise<
  | (DocWithSeo & {
      title?: string;
      description?: string;
      parentCategory?: string;
    })
  | null
> {
  const raw = await sanityFetchCached({
    query: TREATMENT_BY_SLUG_QUERY,
    params: { categorySlug, treatmentSlug, lang },
    key: [
      "sanity",
      "treatment",
      categorySlug,
      treatmentSlug,
      lang,
      TREATMENT_BY_SLUG_QUERY,
    ],
    tags: [
      SANITY_CACHE_TAGS.all,
      SANITY_CACHE_TAGS.treatment(categorySlug, treatmentSlug),
      SANITY_CACHE_TAGS.type("treatment"),
    ],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
  if (raw == null) return null;
  return normalizeI18n(raw, lang) as DocWithSeo & {
    title?: string;
    description?: string;
    parentCategory?: string;
  };
}

export async function fetchThemePageSeo(
  slug: string,
  lang: "no" | "en",
): Promise<(DocWithSeo & { title?: string }) | null> {
  const raw = await sanityFetchCached({
    query: THEME_PAGE_QUERY,
    params: { slug, lang },
    key: ["sanity", "themePage", slug, lang, THEME_PAGE_QUERY],
    tags: [SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.type("themePage")],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
  if (raw == null) return null;
  return normalizeI18n(raw, lang) as DocWithSeo & { title?: string };
}
