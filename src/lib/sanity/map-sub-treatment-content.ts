import type { SubTreatmentContent } from "@/components/layout/SubTreatmentLayout";
import type { TreatmentData } from "@/lib/sanity/treatment-data";
import { normalizeCategoryFilterKey } from "@/lib/sanity/category-keys";
import type { Specialist } from "@/lib/sanity/specialist-types";

function seoText(treatment: TreatmentData): { title: string; description: string } {
  const seo = treatment.seo as
    | { metaTitle?: string; metaDescription?: string }
    | undefined;
  const metaTitle = (seo?.metaTitle || "").trim();
  const metaDescription = (seo?.metaDescription || "").trim();
  return {
    title: metaTitle,
    description: metaDescription,
  };
}

/** Map Sanity treatment + layout block to SubTreatmentLayout content (no static fallbacks). */
export function mapTreatmentToSubTreatmentContent(
  treatment: TreatmentData,
  options: {
    categoryId: string;
    treatmentSlug: string;
    lang: "no" | "en";
  },
): SubTreatmentContent {
  const { categoryId, treatmentSlug } = options;
  const layout = treatment.layout;
  if (!layout) {
    throw new Error("Treatment layout is required for SubTreatmentLayout");
  }

  const canonical = `/behandlinger/${treatment.parentSlug}/${treatmentSlug}`;
  const parentName = treatment.parentCategory?.trim() || "";
  const parentPath = `/${treatment.parentSlug}`;
  const { title: seoTitle, description: seoDescription } = seoText(treatment);

  const heroPoints = (layout.heroPoints ?? []).filter((p) => p.title || p.desc);
  const flow = (layout.flow ?? []).filter((s) => s.title || s.desc);
  const reasons = (layout.reasons ?? []).filter((r) => r.title || r.desc);
  const promises = (layout.promises ?? []).filter((p) => p.title);

  const related = (layout.related ?? []).map((r) => ({
      title: r.title,
      desc: r.desc || "",
      href: r.path,
      image: r.image,
      imageAlt: r.imageAlt,
    }));

  const specialistCategory = normalizeCategoryFilterKey(
    categoryId,
  ) as Specialist["category"];

  const specialistSlugs = treatment.relatedSpecialistSlugs?.filter(Boolean) ?? [];

  return {
    seoTitle,
    seoDescription,
    canonical,
    homeBreadcrumbLabel: layout.homeBreadcrumbLabel || "",
    srOnlyTitle: layout.srOnlyTitle || "",
    themesAriaLabel: layout.themesAriaLabel || "",
    seePricesLabel: layout.seePricesLabel || "",
    seePricesHref: layout.seePricesHref || "",
    callCtaLabel: layout.callCtaLabel || "",
    expertReadMoreLabel: layout.expertReadMoreLabel || "",
    scrollLeftLabel: layout.scrollLeftLabel || "",
    scrollRightLabel: layout.scrollRightLabel || "",
    insuranceEyebrow: layout.insuranceEyebrow || "",
    insuranceTitle: layout.insuranceTitle || "",
    insurancePartners: layout.insurancePartners ?? [],
    parent: { name: parentName, path: parentPath },
    title: treatment.title,
    heroTitle: layout.heroTitle || "",
    heroDescription: layout.heroDescription || "",
    heroThemes: layout.heroThemes,
    heroPoints,
    heroAvailability: layout.heroAvailability,
    heroPrice: layout.heroPrice,
    hideSeePriser: layout.hideSeePriser,
    heroImage: layout.heroImage,
    heroImageAlt: layout.heroImageAlt,
    heroVideo: layout.heroVideo,
    rating: layout.rating,
    booking: {
      kategori: normalizeCategoryFilterKey(categoryId),
      tjeneste: layout.bookingService,
    },
    primaryCtaLabel: layout.primaryCtaLabel,
    flowTitle: layout.flowTitle || "",
    flow,
    flowImage: layout.flowImage,
    flowImageAlt: layout.flowImageAlt,
    flowLinkLabel: layout.flowLinkLabel,
    flowLinkHref: layout.flowLinkHref,
    reasonsTitle: layout.reasonsTitle || "",
    reasonsLead: layout.reasonsLead,
    reasonsLead2: layout.reasonsLead2,
    reasons,
    reasonsLayout: layout.reasonsLayout,
    promises: promises.map((p) => ({
      title: p.title,
      desc: p.desc,
      eyebrow: p.eyebrow,
      image: p.image,
      imageAlt: p.imageAlt,
    })),
    expertAreas: layout.expertAreas
      ? {
          title: layout.expertAreas.title || "",
          description: layout.expertAreas.description,
          items: layout.expertAreas.items.map((item) => ({
            title: item.title,
            desc: item.desc,
            href: item.path,
            image: item.image,
            imageAlt: item.imageAlt,
          })),
        }
      : undefined,
    textSection: layout.textSection
      ? {
          title: layout.textSection.title || "",
          lead: layout.textSection.lead,
          points: layout.textSection.points,
          image: layout.textSection.image || "",
          imageAlt: layout.textSection.imageAlt,
        }
      : undefined,
    relatedTitle: layout.relatedTitle,
    relatedLead: layout.relatedLead,
    relatedAsIntro: layout.relatedAsIntro,
    relatedAsServices: layout.relatedAsServices,
    relatedSeeAll:
      layout.relatedSeeAllHref && layout.relatedSeeAllLabel
        ? {
            href: layout.relatedSeeAllHref,
            label: layout.relatedSeeAllLabel,
          }
        : undefined,
    related,
    ctaTitle: layout.ctaTitle || "",
    ctaDescription: layout.ctaDescription || "",
    conversationCtaTitle: layout.conversationCtaTitle,
    specialistCategory,
    specialistSlugs: specialistSlugs.length > 0 ? specialistSlugs : undefined,
    specialistCtaLabel: layout.specialistCtaLabel,
    specialistCtaHref: layout.specialistCtaHref,
    specialistTitle: layout.specialistTitle,
    specialistDescription: layout.specialistDescription,
  };
}
