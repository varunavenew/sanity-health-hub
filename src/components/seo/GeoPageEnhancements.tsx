import { GeoAnswerSnippet } from "@/components/seo/GeoAnswerSnippet";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildMedicalWebPageGeoJsonLd } from "@/lib/seo/geo-page";
import type { GeoFaqItem } from "@/lib/seo/geo-jsonld";

type GeoPageEnhancementsProps = {
  name: string;
  geoSummary?: string | null;
  fallbackDescription?: string | null;
  path: string;
  locale?: string;
  faqs?: GeoFaqItem[];
  className?: string;
  /** When true, only emit JSON-LD (PageSEO handles head tags). */
  jsonLdOnly?: boolean;
};

/** Visible GEO snippet + MedicalWebPage JSON-LD for singleton/listing pages. */
export function GeoPageEnhancements({
  name,
  geoSummary,
  fallbackDescription,
  path,
  locale,
  faqs,
  className,
  jsonLdOnly = false,
}: GeoPageEnhancementsProps) {
  const jsonLd = buildMedicalWebPageGeoJsonLd({
    name,
    geoSummary,
    fallbackDescription,
    url: path,
    locale,
    faqs,
  });

  return (
    <>
      {!jsonLdOnly ? <GeoAnswerSnippet text={geoSummary} className={className} /> : null}
      <JsonLd data={jsonLd} />
    </>
  );
}
