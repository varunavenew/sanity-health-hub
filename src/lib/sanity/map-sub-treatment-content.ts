import type { SubTreatmentContent } from "@/components/layout/SubTreatmentLayout";
import type { TreatmentData, TreatmentSection } from "@/lib/sanity/treatment-data";
import {
  categoryLandingPath,
  FLERE_FAGOMRADER_CATEGORY_ID,
  normalizeCategoryFilterKey,
  normalizeCategoryRouteKey,
} from "@/lib/sanity/category-keys";
import { normalizeFlereFagomraderTreatmentLayout } from "@/lib/sanity/flere-fagomrader-treatment-layout";
import { resolveFlereLinkedServiceImage } from "@/lib/sanity/flere-linked-service-media";
import { stripBehandlingerPrefix } from "@/lib/navigation/coerce-path";
import type { Specialist } from "@/lib/sanity/specialist-types";
import type { BookingLinkParams } from "@/lib/bookingLinks";
import { FERTILITETSUTREDNING_BOOKING_OPTIONS } from "@/lib/booking/resolve-booking-service";

function firstHeroParagraph(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  return trimmed.split(/\n\n+/).map((part) => part.trim()).find(Boolean) ?? trimmed;
}

/**
 * Prefer an explicit CMS price label only.
 * Never invent a label from the treatment title — that duplicates the H1
 * on pages where title === heroTitle (common on fertility treatments).
 */
function resolveHeroPriceLabel(
  treatment: TreatmentData,
  _categoryId: string,
): string | undefined {
  const explicit = treatment.heroPriceLabel?.trim();
  return explicit || undefined;
}

/** Demo format is "Pris fra 3.200 kr" / keep EN "from …" as stored. */
function resolveHeroPrice(price: string | undefined, isEn: boolean): string | undefined {
  const trimmed = price?.trim();
  if (!trimmed) return undefined;
  if (isEn) return trimmed;
  if (/^pris\s+fra\b/i.test(trimmed)) return trimmed;
  if (/^fra\b/i.test(trimmed)) return `Pris ${trimmed}`;
  return trimmed;
}

function buildTreatmentBookingParams(
  treatment: TreatmentData,
  categoryId: string,
  treatmentSlug: string,
): BookingLinkParams {
  const kategori = normalizeCategoryFilterKey(categoryId);
  const bookingCategoryId = treatment.bookingCategoryId;
  const bookingActivityId = treatment.bookingActivityId;
  const cmsOptions = (treatment.bookingServiceOptions ?? [])
    .map((value) => value.trim())
    .filter(Boolean);
  const options =
    cmsOptions.length > 0
      ? cmsOptions
      : treatmentSlug === "fertilitetsutredning"
        ? [...FERTILITETSUTREDNING_BOOKING_OPTIONS]
        : [];

  if (
    typeof bookingCategoryId === "number" &&
    bookingCategoryId > 0
  ) {
    const params: BookingLinkParams = { kategori, kategoriId: bookingCategoryId };
    if (typeof bookingActivityId === "number" && bookingActivityId > 0) {
      params.aktivitetId = bookingActivityId;
    } else if (options.length > 1) {
      params.tjenesteValg = options;
    } else if (options.length === 1) {
      params.tjeneste = options[0];
    }
    return params;
  }

  if (options.length > 1) {
    return { kategori, tjenesteValg: options };
  }
  if (options.length === 1) {
    return { kategori, tjeneste: options[0] };
  }
  const single = treatment.bookingService?.trim();
  if (single) {
    return { kategori, tjeneste: single };
  }
  if (typeof bookingActivityId === "number" && bookingActivityId > 0) {
    return { kategori, aktivitetId: bookingActivityId };
  }
  return { kategori };
}

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

/** Legacy `sections[]` (heading/content) → reasons accordion items. */
function reasonsFromLegacySections(
  sections: TreatmentSection[] | undefined,
): { n: string; title: string; desc: string }[] {
  return (sections ?? [])
    .map((section, index) => ({
      n: String(index + 1).padStart(2, "0"),
      title: section.heading.trim(),
      desc: section.content.trim(),
    }))
    .filter((item) => item.title || item.desc);
}

/** Keep CMS reasons; append leftover legacy sections that are not already titles. */
function mergeReasonsWithLegacySections(
  reasons: { n: string; title: string; desc: string }[],
  sections: TreatmentSection[] | undefined,
): { n: string; title: string; desc: string }[] {
  const fromSections = reasonsFromLegacySections(sections);
  if (fromSections.length === 0) return reasons;
  if (reasons.length === 0) return fromSections;

  const existingTitles = new Set(
    reasons.map((item) => item.title.trim().toLowerCase()).filter(Boolean),
  );
  const extra = fromSections.filter(
    (item) => item.title && !existingTitles.has(item.title.trim().toLowerCase()),
  );
  if (extra.length === 0) return reasons;

  return [...reasons, ...extra].map((item, index) => ({
    ...item,
    n: String(index + 1).padStart(2, "0"),
  }));
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
  const categoryKey = normalizeCategoryRouteKey(categoryId) || categoryId;
  // Always follow the URL category so dual-tagged treatments (e.g. miscarriage
  // under /pregnancy) breadcrumb to Pregnancy, not the CMS primary category.
  const parentPath = stripBehandlingerPrefix(
    categoryLandingPath(categoryKey, options.lang),
  );

  const canonical = treatmentSlug ? `${parentPath}/${treatmentSlug}` : parentPath;
  const parentName = treatment.parentCategory?.trim() || "";
  const { title: seoTitle, description: seoDescription } = seoText(treatment);

  const heroPoints = (treatment.heroPoints ?? []).filter((p) => p.title || p.desc);
  const flow = (treatment.flow ?? []).filter((s) => s.title || s.desc);
  const mappedReasons = (treatment.reasons ?? []).filter((r) => r.title || r.desc);
  const reasons = mergeReasonsWithLegacySections(
    mappedReasons,
    treatment.sections,
  );
  const promises = (treatment.promises ?? []).filter((p) => p.title);

  const related = (treatment.related ?? []).map((r) => ({
    title: r.title,
    desc: r.desc || "",
    href: stripBehandlingerPrefix(r.path || ""),
    image: r.image,
    imageAlt: r.imageAlt,
  }));

  const specialistCategory = normalizeCategoryFilterKey(
    categoryId,
  ) as Specialist["category"];

  const specialistSlugs = treatment.relatedSpecialistSlugs?.filter(Boolean) ?? [];

  const mappedExpertAreas = treatment.expertAreas
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
    : undefined;

  const relatedSeeAll =
    treatment.relatedSeeAllHref && treatment.relatedSeeAllLabel
      ? {
          href: treatment.relatedSeeAllHref,
          label: treatment.relatedSeeAllLabel,
        }
      : undefined;

  const flereLayout =
    categoryId === FLERE_FAGOMRADER_CATEGORY_ID
      ? normalizeFlereFagomraderTreatmentLayout({
          treatmentSlug,
          canonicalSlug: treatment.canonicalSlug,
          lang: options.lang,
          reasons,
          reasonsTitle: treatment.reasonsTitle || "",
          reasonsLead: treatment.reasonsLead,
          heroThemes: treatment.heroThemes,
          expertAreas: mappedExpertAreas,
          relatedSeeAll,
        })
      : null;

  const resolvedReasons = flereLayout?.reasons ?? reasons;
  const resolvedReasonsTitle = flereLayout?.reasonsTitle ?? treatment.reasonsTitle ?? "";
  const resolvedReasonsLead = flereLayout?.reasonsLead ?? treatment.reasonsLead;
  const resolvedExpertAreas = flereLayout?.expertAreas ?? mappedExpertAreas;
  const resolvedRelatedSeeAll = flereLayout?.relatedSeeAll ?? relatedSeeAll;

  const flereHeroPath =
    categoryId === FLERE_FAGOMRADER_CATEGORY_ID && treatmentSlug
      ? `${parentPath}/${treatmentSlug}`
      : "";
  const flereMappedHero = flereHeroPath
    ? resolveFlereLinkedServiceImage(flereHeroPath)
    : undefined;
  const resolvedHeroImage =
    flereHeroPath
      ? resolveFlereLinkedServiceImage(flereHeroPath, treatment.heroImage) ??
        treatment.heroImage
      : treatment.heroImage;
  const resolvedHeroMedia =
    flereMappedHero && categoryId === FLERE_FAGOMRADER_CATEGORY_ID
      ? undefined
      : treatment.heroMedia;

  return {
    seoTitle,
    seoDescription,
    canonical,
    // Generic UI chrome — never per-document content, and CMS documents have
    // repeatedly been backfilled with the Norwegian value under the English
    // slot (e.g. callCtaLabel.en = "Ring oss"). Always use the app-level
    // locale default instead of trusting the CMS override for these.
    homeBreadcrumbLabel: isEn ? "Home" : "Hjem",
    themesAriaLabel: treatment.themesAriaLabel || "",
    seePricesLabel: treatment.seePricesLabel || (isEn ? "See prices" : "Se priser"),
    seePricesHref: treatment.seePricesHref || "/priser",
    callCtaLabel: isEn ? "Call us" : "Ring oss",
    expertReadMoreLabel: treatment.expertReadMoreLabel || (isEn ? "Read more" : "Les mer"),
    scrollLeftLabel: treatment.scrollLeftLabel || (isEn ? "Scroll left" : "Scroll venstre"),
    scrollRightLabel: treatment.scrollRightLabel || (isEn ? "Scroll right" : "Scroll høyre"),
    insuranceEyebrow: treatment.insuranceEyebrow || (isEn ? "Insurance partners" : "Forsikringspartnere"),
    insuranceTitle: treatment.insuranceTitle || (isEn ? "We work with the leading insurance providers" : "Vi samarbeider med de største forsikringsselskapene"),
    // Partners come from CMS / Insurance Collection dual-read. Empty = section hidden.
    insurancePartners: treatment.insurancePartners ?? [],
    parent: { name: parentName, path: parentPath },
    title: treatment.title,
    heroTitle: treatment.heroTitle || treatment.title || "",
    heroDescription: firstHeroParagraph(
      treatment.heroDescription || treatment.description || "",
    ),
    heroThemes: treatment.heroThemes,
    heroPoints,
    heroAvailability: treatment.heroAvailability,
    heroPrice: resolveHeroPrice(treatment.heroPrice, isEn),
    heroPriceLabel: resolveHeroPriceLabel(treatment, categoryId),
    hideSeePriser: treatment.hideSeePriser,
    heroImage: resolvedHeroImage,
    heroImageAlt: treatment.heroImageAlt,
    heroVideo: treatment.heroVideo,
    heroMedia: resolvedHeroMedia,
    rating: treatment.rating,
    booking: buildTreatmentBookingParams(treatment, categoryId, treatmentSlug),
    primaryCtaLabel: treatment.primaryCtaLabel,
    flowTitle: treatment.flowTitle || "",
    flow,
    flowImage: treatment.flowImage,
    flowImageAlt: treatment.flowImageAlt,
    flowLinkLabel: treatment.flowLinkLabel,
    flowLinkHref: treatment.flowLinkHref,
    reasonsTitle: resolvedReasonsTitle,
    reasonsLead: resolvedReasonsLead,
    reasonsLead2: treatment.reasonsLead2,
    reasons: resolvedReasons,
    reasonsLayout: "accordion",
    promises: promises.map((p) => ({
      title: p.title,
      desc: p.desc,
      eyebrow: p.eyebrow,
      image: p.image,
      imageAlt: p.imageAlt,
    })),
    expertAreas: resolvedExpertAreas,
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
    relatedSeeAll: resolvedRelatedSeeAll,
    related,
    ctaTitle: treatment.ctaTitle || "",
    ctaDescription: treatment.ctaDescription || "",
    conversationCtaTitle: treatment.conversationCtaTitle,
    midCtaPrimaryLabel: treatment.midCtaPrimaryLabel,
    midCtaCallLabel: treatment.midCtaCallLabel,
    midCtaShowCallButton: treatment.midCtaShowCallButton !== false,
    reviewsSectionTitle: treatment.reviewsSectionTitle,
    googleReviews: treatment.googleReviews,
    legelistenReviews: treatment.legelistenReviews,
    specialistCategory,
    specialistSlugs: specialistSlugs.length > 0 ? specialistSlugs : undefined,
    specialistCtaLabel: treatment.specialistCtaLabel,
    specialistCtaHref: treatment.specialistCtaHref,
    specialistTitle: treatment.specialistTitle,
    specialistDescription: treatment.specialistDescription,
  };
}
