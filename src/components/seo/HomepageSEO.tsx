"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { JsonLd } from "@/components/seo/JsonLd";
import { useClientDocumentHead } from "@/hooks/use-client-document-head";
import { resolveSeoShareImageFromPage } from "@/lib/seo/resolve-seo-share-image";
import { brandLogoUrl } from "@/lib/seo/defaults";
import { resolveOgImageAlt } from "@/lib/seo/seo-fields";

const DEFAULTS = {
  nb: {
    title: "CMedical – Skandinavias ledende helhetskonsept",
    description:
      "Nordens mest komplette private tilbud innen gynekologi, fertilitet og urologi. Ledende spesialister, kort ventetid, ingen henvisning nødvendig.",
  },
  en: {
    title: "CMedical – Scandinavia's leading healthcare concept",
    description:
      "The Nordics' most complete private offering within gynecology, fertility and urology. Leading specialists, short waiting times, no referral needed.",
  },
};
const URL = "https://cmedical.no/";

const buildJsonLd = (lang: "nb" | "en") => ({
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  name: "CMedical",
  url: "https://cmedical.no",
  logo: brandLogoUrl(),
  description: DEFAULTS[lang].description,
  inLanguage: lang === "en" ? "en" : "nb-NO",
  telephone: "+47 22 95 75 00",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Bogstadveien 51",
    addressLocality: "Oslo",
    postalCode: "0366",
    addressCountry: "NO",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 59.9271,
    longitude: 10.7195,
  },
  medicalSpecialty: [
    "Gynecology",
    "Urology",
    "Reproductive Medicine",
    "Orthopedics",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    ratingCount: "1000",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "16:00",
    },
  ],
  sameAs: [
    "https://www.facebook.com/cmedical",
    "https://www.instagram.com/cmedical",
  ],
});

const buildBreadcrumb = (lang: "nb" | "en") => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: lang === "en" ? "Home" : "Hjem",
      item: "https://cmedical.no",
    },
  ],
});

interface HomepageSEOProps {
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: unknown;
    ogImageAlt?: string;
    useCustomOgImage?: boolean;
    noIndex?: boolean;
  } | null;
  /** First hero slide image URL when custom sharing image is off. */
  heroImageUrl?: string;
}

export const HomepageSEO = ({ seo, heroImageUrl }: HomepageSEOProps) => {
  const { i18n } = useTranslation();
  const lang: "nb" | "en" = (i18n.language || "nb").startsWith("en") ? "en" : "nb";
  const ogLocale = lang === "en" ? "en_US" : "nb_NO";

  const title = seo?.metaTitle || DEFAULTS[lang].title;
  const description = seo?.metaDescription || DEFAULTS[lang].description;
  const ogImage = resolveSeoShareImageFromPage(seo, { heroImage: heroImageUrl });
  const ogImageAlt = resolveOgImageAlt(seo, lang, title);

  const headSpec = useMemo(
    () => ({
      title,
      description,
      canonical: URL,
      noIndex: seo?.noIndex,
      ogTitle: title,
      ogDescription: description,
      ogType: "website" as const,
      ogLocale,
      ogLocaleAlternate: lang === "en" ? "nb_NO" : "en_US",
      ogImage,
      ogImageAlt,
    }),
    [title, description, seo?.noIndex, ogLocale, lang, ogImage, ogImageAlt],
  );

  useClientDocumentHead(headSpec);

  return <JsonLd data={[buildJsonLd(lang), buildBreadcrumb(lang)]} />;
};
