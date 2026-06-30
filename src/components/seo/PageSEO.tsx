"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { JsonLd } from "@/components/seo/JsonLd";
import { useClientDocumentHead } from "@/hooks/use-client-document-head";
import { normalizePageTitle } from "@/lib/seo/metadata-builders";
import { plainMetaString } from "@/lib/seo/seo-fields";

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface PageSEOProps {
  title: string;
  description: string;
  canonical: string;
  breadcrumbs?: BreadcrumbItem[];
  type?: "website" | "article" | "profile";
  noIndex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  ogImage?: string;
  publishedAt?: string;
}

const BASE_URL = "https://cmedical.no";

export const PageSEO = ({
  title,
  description,
  canonical,
  breadcrumbs = [],
  type = "website",
  noIndex = false,
  jsonLd,
  ogImage,
  publishedAt,
}: PageSEOProps) => {
  const { i18n } = useTranslation();
  const lang = (i18n.language || "nb").startsWith("en") ? "en" : "nb";
  const ogLocale = lang === "en" ? "en_US" : "nb_NO";
  const sanityLang = lang === "en" ? "en" : "no";
  const safeTitle = plainMetaString(title, "", sanityLang);
  const safeDescription = plainMetaString(description, "", sanityLang);
  const fullTitle = normalizePageTitle(safeTitle);

  const cleanPath = canonical.startsWith("http")
    ? canonical.replace(BASE_URL, "")
    : canonical;
  const fullCanonical = `${BASE_URL}${cleanPath}`;

  const headSpec = useMemo(
    () => ({
      title: fullTitle,
      description: safeDescription,
      canonical: fullCanonical,
      noIndex,
      ogTitle: fullTitle,
      ogDescription: safeDescription,
      ogType: type,
      ogLocale,
      ogLocaleAlternate: lang === "en" ? "nb_NO" : "en_US",
      ogImage,
      publishedAt,
    }),
    [
      fullTitle,
      safeDescription,
      fullCanonical,
      noIndex,
      type,
      ogLocale,
      lang,
      ogImage,
      publishedAt,
    ],
  );

  useClientDocumentHead(headSpec);

  const breadcrumbJsonLd =
    breadcrumbs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbs.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: `${BASE_URL}${item.path}`,
          })),
        }
      : null;

  const jsonLdArray = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
  const structuredData = [
    ...(breadcrumbJsonLd ? [breadcrumbJsonLd] : []),
    ...jsonLdArray,
  ];

  if (structuredData.length === 0) return null;

  return <JsonLd data={structuredData} />;
};
