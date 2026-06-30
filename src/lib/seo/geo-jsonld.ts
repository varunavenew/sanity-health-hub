import { siteUrl } from "@/lib/env";

export type GeoFaqItem = { question: string; answer: string };

export type MedicalWebPageJsonLdInput = {
  name: string;
  description: string;
  url: string;
  inLanguage?: string;
  dateModified?: string;
  about?: string;
};

export type ArticleJsonLdInput = {
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  inLanguage?: string;
};

const CMEDICAL_PROVIDER = {
  "@type": "MedicalOrganization" as const,
  name: "CMedical",
  url: siteUrl(),
  logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/qmg4FOZcsPVySaA19fmuxrFmWZJ3/uploads/1762763982098-cmedical.png",
  telephone: "+47 22 95 75 00",
  address: {
    "@type": "PostalAddress" as const,
    streetAddress: "Bogstadveien 51",
    addressLocality: "Oslo",
    postalCode: "0366",
    addressCountry: "NO",
  },
};

export function absoluteUrl(path: string): string {
  const base = siteUrl();
  if (path.startsWith("http")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function medicalOrganizationJsonLd(
  lang: "nb" | "en" = "nb",
): Record<string, unknown> {
  const description =
    lang === "en"
      ? "The Nordics' most complete private offering within gynecology, fertility, urology and orthopedics."
      : "Nordens mest komplette private tilbud innen gynekologi, fertilitet og urologi.";
  return {
    "@context": "https://schema.org",
    ...CMEDICAL_PROVIDER,
    description,
    inLanguage: lang === "en" ? "en" : "nb-NO",
    medicalSpecialty: [
      "Gynecology",
      "Fertility",
      "Urology",
      "Orthopedics",
      "Obstetrics",
    ],
    sameAs: [
      "https://www.facebook.com/cmedical",
      "https://www.instagram.com/cmedical",
    ],
  };
}

export function medicalWebPageJsonLd(
  input: MedicalWebPageJsonLdInput,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.url),
    inLanguage: input.inLanguage ?? "nb-NO",
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.about
      ? { about: { "@type": "MedicalCondition", name: input.about } }
      : {}),
    publisher: CMEDICAL_PROVIDER,
    isPartOf: {
      "@type": "WebSite",
      name: "CMedical",
      url: siteUrl(),
    },
  };
}

export function articleJsonLd(input: ArticleJsonLdInput): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    description: input.description,
    url: absoluteUrl(input.url),
    inLanguage: input.inLanguage ?? "nb-NO",
    author: CMEDICAL_PROVIDER,
    publisher: CMEDICAL_PROVIDER,
    ...(input.datePublished ? { datePublished: input.datePublished } : {}),
    ...(input.dateModified ? { dateModified: input.dateModified } : {}),
    ...(input.image ? { image: input.image } : {}),
    mainEntityOfPage: absoluteUrl(input.url),
  };
}

export function faqPageJsonLd(faqs: GeoFaqItem[]): Record<string, unknown> | null {
  const items = faqs.filter((f) => f.question?.trim() && f.answer?.trim());
  if (items.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function combineGeoJsonLd(
  ...blocks: Array<Record<string, unknown> | null | undefined>
): Record<string, unknown>[] {
  return blocks.filter((b): b is Record<string, unknown> => Boolean(b));
}
