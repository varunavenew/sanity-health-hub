import {
  combineGeoJsonLd,
  faqPageJsonLd,
  medicalWebPageJsonLd,
  type GeoFaqItem,
} from "@/lib/seo/geo-jsonld";

export function geoSummaryText(
  geoSummary?: string | null,
  fallback?: string | null,
): string {
  const value = geoSummary?.trim() || fallback?.trim() || "";
  return value.length > 320 ? `${value.slice(0, 319)}…` : value;
}

export function schemaInLanguage(locale?: string): string {
  return locale === "en" ? "en" : "nb-NO";
}

export function buildMedicalWebPageGeoJsonLd(input: {
  name: string;
  geoSummary?: string | null;
  fallbackDescription?: string | null;
  url: string;
  locale?: string;
  about?: string;
  dateModified?: string;
  faqs?: GeoFaqItem[];
  extra?: Array<Record<string, unknown> | null | undefined>;
}): Record<string, unknown> | Record<string, unknown>[] {
  const description = geoSummaryText(input.geoSummary, input.fallbackDescription);
  const blocks = combineGeoJsonLd(
    medicalWebPageJsonLd({
      name: input.name,
      description,
      url: input.url,
      inLanguage: schemaInLanguage(input.locale),
      about: input.about,
      dateModified: input.dateModified,
    }),
    input.faqs?.length ? faqPageJsonLd(input.faqs) : null,
    ...(input.extra ?? []),
  );
  return blocks.length === 1 ? blocks[0] : blocks;
}
