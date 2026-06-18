import type { SubTreatmentContent } from "@/components/layout/SubTreatmentLayout";
import type { TreatmentData, SubTreatmentLayoutData } from "@/lib/sanity/treatment-data";
import {
  behandlingerCategorySegment,
  categoryLandingPath,
  normalizeCategoryFilterKey,
} from "@/lib/sanity/category-keys";
import type { Specialist } from "@/lib/sanity/specialist-types";

const DEFAULT_PROMISES_NB = [
  {
    eyebrow: "Trygghet",
    title: "Du bestemmer hva du er komfortabel med",
    desc: "Alle undersøkelser og inngrep gjøres i ditt tempo. Du kan stoppe når som helst, stille spørsmål underveis, og ta med noen om du ønsker det.",
  },
  {
    eyebrow: "Kompetanse",
    title: "Spesialister med dybde",
    desc: "Hos oss møter du leger som har spesialisert seg innenfor sitt fagfelt — ikke en generalist på utplassering.",
  },
  {
    eyebrow: "Helhet",
    title: "Alt under samme tak",
    desc: "Trenger du videre utredning, kirurgi eller psykologhjelp — vi koordinerer hele forløpet for deg.",
  },
];

const DEFAULT_PROMISES_EN = [
  {
    eyebrow: "Safety",
    title: "You decide what you are comfortable with",
    desc: "All examinations and procedures are done at your pace. You can stop at any time and ask questions along the way.",
  },
  {
    eyebrow: "Expertise",
    title: "Specialists with depth",
    desc: "You meet doctors who have specialised in their field — not a generalist on rotation.",
  },
  {
    eyebrow: "Holistic care",
    title: "Everything under one roof",
    desc: "If you need further assessment, surgery or psychological support, we coordinate the whole pathway for you.",
  },
];

function padReasonIndex(i: number): string {
  return String(i + 1).padStart(2, "0");
}

function localizeHref(path: string, categoryId: string, lang: "no" | "en"): string {
  const trimmed = path.trim();
  if (!trimmed) return trimmed;
  if (lang === "no") return trimmed;

  const noCat = behandlingerCategorySegment(categoryId, "no");
  const enCat = behandlingerCategorySegment(categoryId, "en");
  if (noCat !== enCat) {
    return trimmed.replace(`/behandlinger/${noCat}/`, `/behandlinger/${enCat}/`);
  }
  return trimmed;
}

function seoText(
  treatment: TreatmentData,
  lang: "no" | "en",
): { title: string; description: string } {
  const seo = treatment.seo as
    | { metaTitle?: string; metaDescription?: string }
    | undefined;
  const metaTitle = (seo?.metaTitle || "").trim();
  const metaDescription = (seo?.metaDescription || "").trim();
  return {
    title: metaTitle || `${treatment.title} | CMedical`,
    description:
      metaDescription ||
      treatment.description ||
      (lang === "en"
        ? `Learn more about ${treatment.title} at CMedical.`
        : `Les mer om ${treatment.title} hos CMedical.`),
  };
}

export function mapTreatmentToSubTreatmentContent(
  treatment: TreatmentData,
  options: {
    categoryId: string;
    treatmentSlug: string;
    lang: "no" | "en";
  },
): SubTreatmentContent {
  const { categoryId, treatmentSlug, lang } = options;
  const layout = treatment.layout;
  const catSegment = behandlingerCategorySegment(categoryId, lang);
  const canonical = `/behandlinger/${catSegment}/${treatmentSlug}`;
  const parentName =
    treatment.parentCategory?.trim() || categoryId;
  const parentPath = categoryLandingPath(categoryId, lang);
  const { title: seoTitle, description: seoDescription } = seoText(treatment, lang);

  const heroPoints =
    layout?.heroPoints?.filter((p) => p.title || p.desc) ??
    (treatment.benefits || [])
      .filter((b) => b.title || b.description)
      .map((b) => ({ title: b.title, desc: b.description }));

  const flow =
    layout?.flow?.filter((s) => s.title || s.desc) ??
    (treatment.process || []).map((p, i) => ({
      n: padReasonIndex(i),
      title: p.title,
      desc: p.description,
    }));

  const reasons =
    layout?.reasons?.filter((r) => r.title || r.desc) ??
    (treatment.sections || []).map((s, i) => ({
      n: padReasonIndex(i),
      title: s.heading,
      desc: s.content,
    }));

  const relatedFromLayout =
    layout?.related?.map((r) => ({
      eyebrow: r.eyebrow || (lang === "en" ? "Related" : "Relatert"),
      title: r.title,
      desc: r.desc || "",
      href: localizeHref(r.path, categoryId, lang),
    })) ?? [];

  const related =
    relatedFromLayout.length > 0
      ? relatedFromLayout
      : (treatment.linkedServices || []).map((ls) => ({
          eyebrow: lang === "en" ? "Related" : "Relatert",
          title: ls.label,
          desc: ls.description || "",
          href: localizeHref(ls.path, categoryId, lang),
        }));

  const promises =
    layout?.promises?.filter((p) => p.title) ??
    (lang === "en" ? DEFAULT_PROMISES_EN : DEFAULT_PROMISES_NB);

  const specialistCategory = normalizeCategoryFilterKey(
    categoryId,
  ) as Specialist["category"];

  const specialistSlugs =
    treatment.relatedSpecialistSlugs?.filter(Boolean) ?? [];

  return {
    seoTitle,
    seoDescription,
    canonical,
    parent: { name: parentName, path: parentPath },
    title: treatment.title,
    eyebrow: layout?.eyebrow || treatment.subtitle || parentName,
    heroTitle: layout?.heroTitle || treatment.title,
    heroDescription: layout?.heroDescription || treatment.description || "",
    heroPoints,
    rating: layout?.rating,
    booking: {
      kategori: normalizeCategoryFilterKey(categoryId),
      tjeneste: layout?.bookingService,
    },
    primaryCtaLabel: layout?.primaryCtaLabel,
    flowEyebrow: layout?.flowEyebrow || (lang === "en" ? "The pathway" : "Forløpet"),
    flowTitle:
      layout?.flowTitle ||
      (lang === "en" ? "What happens when you visit us" : "Hva skjer når du er hos oss"),
    flow,
    reasonsEyebrow:
      layout?.reasonsEyebrow || (lang === "en" ? "Who it is for" : "Hvem passer det for"),
    reasonsTitle:
      layout?.reasonsTitle ||
      (lang === "en" ? "When treatment may be relevant" : "Når kan behandling være aktuelt?"),
    reasonsLead: layout?.reasonsLead,
    reasonsLead2: layout?.reasonsLead2,
    reasons,
    promises,
    relatedEyebrow: layout?.relatedEyebrow,
    relatedTitle: layout?.relatedTitle,
    related,
    ctaTitle:
      layout?.ctaTitle ||
      (lang === "en"
        ? `Book a consultation for ${treatment.title.toLowerCase()}`
        : `Bestill samtale om ${treatment.title.toLowerCase()}`),
    ctaDescription:
      layout?.ctaDescription ||
      (lang === "en"
        ? "Short waiting times. No referral required."
        : "Kort ventetid. Ingen henvisning nødvendig."),
    specialistCategory,
    specialistSlugs: specialistSlugs.length > 0 ? specialistSlugs : undefined,
    specialistCtaLabel: layout?.specialistCtaLabel,
    specialistCtaHref: layout?.specialistCtaHref,
  };
}
