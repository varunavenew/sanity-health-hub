import { siteUrl } from "@/lib/env";

const DEFAULT_DESCRIPTIONS = {
  nb: "Nordens mest komplette private tilbud innen gynekologi, fertilitet og urologi. Ledende spesialister, kort ventetid, ingen henvisning nødvendig.",
  en: "The Nordics' most complete private offering within gynecology, fertility and urology. Leading specialists, short waiting times, no referral needed.",
} as const;

export type HomeJsonLang = "nb" | "en";

export function medicalClinicJsonLd(lang: HomeJsonLang): Record<string, unknown> {
  const description = DEFAULT_DESCRIPTIONS[lang];
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: "CMedical",
    url: siteUrl(),
    logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/qmg4FOZcsPVySaA19fmuxrFmWZJ3/uploads/1762763982098-cmedical.png",
    description,
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
    medicalSpecialty: ["Gynecology", "Urology", "Reproductive Medicine", "Orthopedics"],
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
    sameAs: ["https://www.facebook.com/cmedical", "https://www.instagram.com/cmedical"],
  };
}

export function homeBreadcrumbJsonLd(lang: HomeJsonLang): Record<string, unknown> {
  const base = siteUrl();
  const path = lang === "en" ? "/en" : "/nb";
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: lang === "en" ? "Home" : "Hjem",
        item: `${base}${path}`,
      },
    ],
  };
}
