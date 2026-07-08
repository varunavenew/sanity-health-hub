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

/** Map Sanity treatment (flat layout fields at root) to SubTreatmentLayout content. */
export function mapTreatmentToSubTreatmentContent(
  treatment: TreatmentData,
  options: {
    categoryId: string;
    treatmentSlug: string;
    lang: "no" | "en";
  },
): SubTreatmentContent {
  const { categoryId, treatmentSlug } = options;
  const isEn = options.lang === "en";

  const canonical = `/behandlinger/${treatment.parentSlug}/${treatmentSlug}`;
  const parentName = treatment.parentCategory?.trim() || "";
  const parentPath = `/${treatment.parentSlug}`;
  const { title: seoTitle, description: seoDescription } = seoText(treatment);

  const heroPoints = (treatment.heroPoints ?? []).filter((p) => p.title || p.desc);
  const flow = (treatment.flow ?? []).filter((s) => s.title || s.desc);
  const reasons = (treatment.reasons ?? []).filter((r) => r.title || r.desc);
  const promises = (treatment.promises ?? []).filter((p) => p.title);

  const related = (treatment.related ?? []).map((r) => ({
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
    homeBreadcrumbLabel: treatment.homeBreadcrumbLabel || (isEn ? "Home" : "Hjem"),
    srOnlyTitle: treatment.srOnlyTitle || (isEn ? "Treatment page at CMedical" : "Behandlingsside hos CMedical"),
    themesAriaLabel: treatment.themesAriaLabel || (isEn ? "Topics" : "Temaer"),
    seePricesLabel: treatment.seePricesLabel || (isEn ? "See prices" : "Se priser"),
    seePricesHref: treatment.seePricesHref || "/priser",
    callCtaLabel: treatment.callCtaLabel || (isEn ? "Call us" : "Ring oss"),
    expertReadMoreLabel: treatment.expertReadMoreLabel || (isEn ? "Read more" : "Les mer"),
    scrollLeftLabel: treatment.scrollLeftLabel || (isEn ? "Scroll left" : "Scroll venstre"),
    scrollRightLabel: treatment.scrollRightLabel || (isEn ? "Scroll right" : "Scroll høyre"),
    insuranceEyebrow: treatment.insuranceEyebrow || (isEn ? "Insurance partners" : "Forsikringspartnere"),
    insuranceTitle: treatment.insuranceTitle || (isEn ? "We work with the leading insurance providers" : "Vi samarbeider med de største forsikringsselskapene"),
    insurancePartners: treatment.insurancePartners ?? [
      { key: "gjensidige", label: "Gjensidige" },
      { key: "if", label: "If" },
      { key: "fremtind", label: "Fremtind" },
      { key: "storebrand", label: "Storebrand" },
      { key: "tryg", label: "Tryg" },
      { key: "vertikal", label: "Vertikal" },
      { key: "codan", label: "Codan" },
      { key: "eika", label: "Eika" },
    ],
    parent: { name: parentName, path: parentPath },
    title: treatment.title,
    heroTitle: treatment.heroTitle || "",
    heroDescription: treatment.description || treatment.heroDescription || "",
    heroThemes: treatment.heroThemes,
    heroPoints,
    heroAvailability: treatment.heroAvailability,
    heroPrice: treatment.heroPrice,
    hideSeePriser: treatment.hideSeePriser,
    heroImage: treatment.heroImage,
    heroImageAlt: treatment.heroImageAlt,
    heroVideo: treatment.heroVideo,
    rating: treatment.rating,
    booking: {
      kategori: normalizeCategoryFilterKey(categoryId),
      tjeneste: treatment.bookingService,
    },
    primaryCtaLabel: treatment.primaryCtaLabel,
    flowTitle: treatment.flowTitle || "",
    flow,
    flowImage: treatment.flowImage,
    flowImageAlt: treatment.flowImageAlt,
    flowLinkLabel: treatment.flowLinkLabel,
    flowLinkHref: treatment.flowLinkHref,
    reasonsTitle: treatment.reasonsTitle || "",
    reasonsLead: treatment.reasonsLead,
    reasonsLead2: treatment.reasonsLead2,
    reasons,
    reasonsLayout: treatment.reasonsLayout,
    promises: promises.map((p) => ({
      title: p.title,
      desc: p.desc,
      eyebrow: p.eyebrow,
      image: p.image,
      imageAlt: p.imageAlt,
    })),
    expertAreas: treatment.expertAreas
      ? {
          title: treatment.expertAreas.title || "",
          description: treatment.expertAreas.description,
          items: treatment.expertAreas.items.map((item) => ({
            title: item.title,
            desc: item.desc,
            href: item.path,
            image: item.image,
            imageAlt: item.imageAlt,
          })),
        }
      : undefined,
    textSection: treatment.textSection
      ? {
          title: treatment.textSection.title || "",
          lead: treatment.textSection.lead,
          points: treatment.textSection.points,
          image: treatment.textSection.image || "",
          imageAlt: treatment.textSection.imageAlt,
        }
      : undefined,
    relatedTitle: treatment.relatedTitle,
    relatedLead: treatment.relatedLead,
    relatedAsIntro: treatment.relatedAsIntro,
    relatedAsServices: treatment.relatedAsServices,
    relatedSeeAll:
      treatment.relatedSeeAllHref && treatment.relatedSeeAllLabel
        ? {
            href: treatment.relatedSeeAllHref,
            label: treatment.relatedSeeAllLabel,
          }
        : undefined,
    related,
    ctaTitle: treatment.ctaTitle || "",
    ctaDescription: treatment.ctaDescription || "",
    conversationCtaTitle: treatment.conversationCtaTitle,
    specialistCategory,
    specialistSlugs: specialistSlugs.length > 0 ? specialistSlugs : undefined,
    specialistCtaLabel: treatment.specialistCtaLabel,
    specialistCtaHref: treatment.specialistCtaHref,
    specialistTitle: treatment.specialistTitle,
    specialistDescription: treatment.specialistDescription,
  };
}
