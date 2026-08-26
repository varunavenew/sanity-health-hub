import { resolveFaqsFromCollection } from "@/lib/sanity/faq-dual-read";
import { mapHomepageSpecialistsSection } from "@/lib/sanity/homepage-data";
import { withPageSections } from "@/lib/sanity/page-sections";

/** Maps a normalized pricingPage document to the shape `usePricingPage` returns. */
export function mapPricingPageData(
  data: Record<string, unknown> | null,
  lang: "no" | "en",
) {
  const withSections = withPageSections(data);
  if (!withSections) return null;
  const pageSections = (withSections.pageSections ?? []).filter(
    (section: { _type?: string }) => section?._type !== "pageSectionSpecialists",
  );
  return {
    ...withSections,
    pageSections,
    faqs: resolveFaqsFromCollection(withSections.faqCollection, withSections.faqs),
    specialistsSection: mapHomepageSpecialistsSection(
      withSections.specialistsSection,
      lang,
    ),
  };
}
