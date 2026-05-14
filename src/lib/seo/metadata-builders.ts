import type { Metadata } from "next";
import { siteUrl } from "@/lib/env";

export type AppLocaleStr = "nb" | "en";

export function appLocaleFromParam(locale: string): AppLocaleStr {
  return locale === "en" ? "en" : "nb";
}

export interface LocalizedPaths {
  nbPath: string;
  enPath: string;
}

function displayTitle(title: string): string {
  return title.includes("CMedical") ? title : `${title} | CMedical`;
}

/**
 * Builds Next.js Metadata with correct nb/en alternates (unlike legacy PageSEO,
 * which pointed every hreflang to the same URL).
 */
export function buildPageMetadata(opts: {
  locale: string;
  paths: LocalizedPaths;
  title: string;
  description: string;
  ogImage?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  publishedTime?: string;
}): Metadata {
  const base = siteUrl();
  const loc = appLocaleFromParam(opts.locale);
  const title = typeof opts.title === "string" ? opts.title : "";
  const description = typeof opts.description === "string" ? opts.description : "";
  const canonicalPath = loc === "en" ? opts.paths.enPath : opts.paths.nbPath;
  const canonical = `${base}${canonicalPath}`;
  const nbAbsolute = `${base}${opts.paths.nbPath}`;
  const enAbsolute = `${base}${opts.paths.enPath}`;

  const ogLocale = loc === "en" ? "en_US" : "nb_NO";
  const ogLocaleAlt = loc === "en" ? "nb_NO" : "en_US";
  const resolvedTitle = displayTitle(title);

  const titleField: Metadata["title"] = title.includes("CMedical")
    ? { absolute: title }
    : title;

  return {
    title: titleField,
    description,
    alternates: {
      canonical,
      languages: {
        "nb-NO": nbAbsolute,
        en: enAbsolute,
        "x-default": nbAbsolute,
      },
    },
    robots: opts.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: resolvedTitle,
      description,
      url: canonical,
      type: opts.type ?? "website",
      locale: ogLocale,
      alternateLocale: [ogLocaleAlt],
      siteName: "CMedical",
      ...(opts.ogImage ? { images: [{ url: opts.ogImage }] } : {}),
      ...(opts.publishedTime ? { publishedTime: opts.publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      ...(opts.ogImage ? { images: [opts.ogImage] } : {}),
    },
  };
}
