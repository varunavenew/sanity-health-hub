import type { Metadata } from "next";
import { siteUrl } from "@/lib/env";
import { resolveOgImageUrl } from "@/lib/seo/defaults";

export type AppLocaleStr = "nb" | "en";

export function appLocaleFromParam(locale: string): AppLocaleStr {
  return locale === "en" ? "en" : "nb";
}

export interface LocalizedPaths {
  nbPath: string;
  enPath: string;
}

const BRAND_SUFFIX_RE = /\s*\|\s*CMedical\s*$/i;

/** Single brand suffix — avoids doubling with root layout `title.template` or PageSEO. */
export function normalizePageTitle(title: string): string {
  let t = title.trim();
  if (!t) return "CMedical";
  while (BRAND_SUFFIX_RE.test(t)) {
    t = t.replace(BRAND_SUFFIX_RE, "").trim();
  }
  return `${t} | CMedical`;
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

  return {
    // Absolute title — do not use layout template `%s | CMedical` (would duplicate suffix).
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
    robots: opts.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      type: opts.type ?? "website",
      locale: ogLocale,
      alternateLocale: [ogLocaleAlt],
      siteName: "CMedical",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "CMedical",
        },
      ],
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
