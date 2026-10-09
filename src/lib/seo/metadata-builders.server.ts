import type { Metadata } from "next";
import {
  canonicalSiteOrigin,
  shouldBlockSearchEngineIndexing,
} from "@/lib/seo/staging-crawl-block.server";
import {
  PRODUCTION_ROBOTS_METADATA,
  STAGING_ROBOTS_METADATA,
} from "@/lib/seo/staging-crawl-block";
import { resolveOgImageUrl, DEFAULT_OG_IMAGE_ALT } from "@/lib/seo/defaults";
import {
  appLocaleFromParam,
  normalizePageTitle,
  type LocalizedPaths,
} from "@/lib/seo/metadata-builders";

export type { AppLocaleStr, LocalizedPaths } from "@/lib/seo/metadata-builders";
export { appLocaleFromParam } from "@/lib/seo/metadata-builders";

/**
 * Builds Next.js Metadata with correct nb/en alternates (unlike legacy PageSEO,
 * which pointed every hreflang to the same URL).
 */
export async function buildPageMetadata(opts: {
  locale: string;
  paths: LocalizedPaths;
  title: string;
  description: string;
  ogImage?: string;
  ogImageAlt?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
}): Promise<Metadata> {
  const base = await canonicalSiteOrigin();
  const blockByHost = await shouldBlockSearchEngineIndexing();
  const loc = appLocaleFromParam(opts.locale);
  const title = typeof opts.title === "string" ? opts.title.trim() : "";
  const description =
    (typeof opts.description === "string" ? opts.description.trim() : "") ||
    "CMedical – privat spesialisthelse.";
  const canonicalPath = loc === "en" ? opts.paths.enPath : opts.paths.nbPath;
  const canonical = `${base}${canonicalPath}`;
  const nbAbsolute = `${base}${opts.paths.nbPath}`;
  const enAbsolute = `${base}${opts.paths.enPath}`;

  const ogLocale = loc === "en" ? "en_US" : "nb_NO";
  const ogLocaleAlt = loc === "en" ? "nb_NO" : "en_US";
  const pageTitle = normalizePageTitle(title);

  const ogImage = resolveOgImageUrl(opts.ogImage);
  const ogImageAlt =
    (typeof opts.ogImageAlt === "string" ? opts.ogImageAlt.trim() : "") ||
    DEFAULT_OG_IMAGE_ALT;

  return {
    title: { absolute: pageTitle },
    description,
    alternates: {
      canonical,
      languages: {
        "nb-NO": nbAbsolute,
        en: enAbsolute,
        "x-default": nbAbsolute,
      },
    },
    robots: opts.noIndex || blockByHost
      ? STAGING_ROBOTS_METADATA
      : PRODUCTION_ROBOTS_METADATA,
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      type: opts.type ?? "website",
      locale: ogLocale,
      alternateLocale: [ogLocaleAlt],
      siteName: "CMedical",
      images: [{ url: ogImage, alt: ogImageAlt }],
      ...(opts.publishedTime ? { publishedTime: opts.publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [ogImage],
    },
  };
}
