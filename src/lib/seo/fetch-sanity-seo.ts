import { ABOUT_PAGE_QUERY, CONTACT_PAGE_QUERY, HOMEPAGE_QUERY } from "@/lib/queries";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";
import { sanityFetchCached } from "@/lib/sanity/sanity-fetch-cached";
import {
  SANITY_CACHE_TAGS,
  SANITY_DATA_REVALIDATE_SEC,
} from "@/lib/sanity/sanity-revalidate";

export type SanitySeoFields = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: unknown;
  noIndex?: boolean;
} | null;

export async function fetchHomepageDocument(
  lang: "no" | "en",
): Promise<{ seo?: SanitySeoFields } | null> {
  const raw = await sanityFetchCached<Record<string, unknown> | null>({
    query: HOMEPAGE_QUERY,
    key: ["sanity", "homepage", lang, HOMEPAGE_QUERY],
    tags: [SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.homepage, SANITY_CACHE_TAGS.type("homepage")],
    revalidate: SANITY_DATA_REVALIDATE_SEC.homepage,
  });
  if (raw == null) return null;
  return normalizeI18n(raw, lang) as { seo?: SanitySeoFields };
}

export async function fetchContactPageDocument(
  lang: "no" | "en",
): Promise<{ seo?: SanitySeoFields } | null> {
  const raw = await sanityFetchCached<Record<string, unknown> | null>({
    query: CONTACT_PAGE_QUERY,
    key: ["sanity", "contactPage", lang, CONTACT_PAGE_QUERY],
    tags: [SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.contactPage, SANITY_CACHE_TAGS.type("contactPage")],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
  if (raw == null) return null;
  return normalizeI18n(raw, lang) as { seo?: SanitySeoFields };
}

export async function fetchAboutPageDocument(
  lang: "no" | "en",
): Promise<{ seo?: SanitySeoFields } | null> {
  const raw = await sanityFetchCached<Record<string, unknown> | null>({
    query: ABOUT_PAGE_QUERY,
    params: { lang },
    key: ["sanity", "aboutPage", lang, ABOUT_PAGE_QUERY],
    tags: [SANITY_CACHE_TAGS.all, SANITY_CACHE_TAGS.aboutPage, SANITY_CACHE_TAGS.type("aboutPage")],
    revalidate: SANITY_DATA_REVALIDATE_SEC.singletonPage,
  });
  if (raw == null) return null;
  return normalizeI18n(raw, lang) as { seo?: SanitySeoFields };
}
