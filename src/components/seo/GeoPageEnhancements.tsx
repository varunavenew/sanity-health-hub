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
  /** When false, also render a visible direct-answer block (default: JSON-LD only). */
  showVisibleSnippet?: boolean;
};

/** MedicalWebPage JSON-LD for GEO; optional visible snippet when `showVisibleSnippet` is set. */
export function GeoPageEnhancements({
  name,
  geoSummary,
  fallbackDescription,
  path,
  locale,
  faqs,
  className,
  showVisibleSnippet = false,
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
      {showVisibleSnippet ? (
        <GeoAnswerSnippet text={geoSummary} className={className} />
      ) : null}
      <JsonLd data={jsonLd} />
    </>
  );
}
