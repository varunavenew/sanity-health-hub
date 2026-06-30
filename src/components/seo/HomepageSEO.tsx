"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { JsonLd } from "@/components/seo/JsonLd";
import { useClientDocumentHead } from "@/hooks/use-client-document-head";
import { getImageUrl } from "@/lib/sanityClient";

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
  logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/qmg4FOZcsPVySaA19fmuxrFmWZJ3/uploads/1762763982098-cmedical.png",
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
    noIndex?: boolean;
  } | null;
}

export const HomepageSEO = ({ seo }: HomepageSEOProps) => {
  const { i18n } = useTranslation();
  const lang: "nb" | "en" = (i18n.language || "nb").startsWith("en") ? "en" : "nb";
  const ogLocale = lang === "en" ? "en_US" : "nb_NO";

  const title = seo?.metaTitle || DEFAULTS[lang].title;
  const description = seo?.metaDescription || DEFAULTS[lang].description;
  const ogImage = seo?.ogImage ? getImageUrl(seo.ogImage) : undefined;

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
    }),
    [title, description, seo?.noIndex, ogLocale, lang, ogImage],
  );

  useClientDocumentHead(headSpec);

  return <JsonLd data={[buildJsonLd(lang), buildBreadcrumb(lang)]} />;
};
