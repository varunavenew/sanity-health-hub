import { TREATMENT_CATEGORY_BY_SLUG_QUERY } from "@/lib/queries";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";
import { normalizePageSections } from "@/lib/sanity/page-sections";
import { sortBySlug } from "@/lib/sortAlphabetical";
import { sanityClient } from "@/lib/sanityClient";

function asPlainString(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  if (Array.isArray(value)) {
    const first = value[0];
    if (typeof first === "string") return first;
    if (first && typeof first === "object" && "value" in first) {
      const inner = (first as { value: unknown }).value;
      if (typeof inner === "string") return inner;
    }
  }
  return "";
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => asPlainString(v)).filter(Boolean);
}

export type CategoryLandingSegment = {
  id?: string;
  title: string;
  desc: string;
  tags: string[];
  cta: string;
  href: string;
};

export type CategoryLandingStep = {
  n: string;
  title: string;
  desc: string;
};

export type CategoryLandingAudience = {
  title: string;
  desc: string;
  href: string;
  icon: "couple" | "horizon" | "arch";
};

export type CategoryLandingSymptom = {
  symptom: string;
  service: string;
  href: string;
};

export type CategoryLandingReview = {
  text: string;
  author: string;
  date: string;
};

export type CategoryLandingPage = {
  documentTitle?: string;
  srOnlyTitle?: string;
  hero: {
    eyebrow: string;
    heading: string;
    headingEmphasis: string;
    body: string;
    bullets: string[];
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    heroImageAlt: string;
    secondaryImageAlt: string;
  };
  segmentsSection: {
    eyebrow: string;
    title: string;
    titleLine2: string;
    segments: CategoryLandingSegment[];
  };
  whySection: {
    eyebrow: string;
    title: string;
    description: string;
    steps: CategoryLandingStep[];
  };
  audiencesSection: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    readMoreLabel: string;
    audiences: CategoryLandingAudience[];
  };
  symptomsSection: {
    title: string;
    description: string;
    items: CategoryLandingSymptom[];
  };
  servicesSection: {
    eyebrow: string;
    title: string;
    description: string;
  };
  resultsSection: {
    eyebrow: string;
    title: string;
    description: string;
    categoryLabel: string;
    footnote: string;
  };
  reviewsSection: {
    eyebrow: string;
    title: string;
    reviews: CategoryLandingReview[];
  };
  specialistsSection: {
    title: string;
    seeAllLabel: string;
    seeAllHref: string;
  };
};

export type CategoryTreatmentLink = {
  title: string;
  desc: string;
  href: string;
};

export type CategoryStat = {
  value: string;
  label: string;
  sub?: string;
};

export type TreatmentCategoryBottomCta = {
  title?: string;
  subtitle?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
  primaryPath?: string;
  secondaryPath?: string;
};

export type TreatmentCategoryData = {
  categoryId: string;
  slug?: string;
  title: string;
  description: string;
  heroImage?: string;
  categoryNumericId?: number;
  quickInfoItems?: string[];
  linkedServicesSectionTitle?: string;
  processSectionTitle?: string;
  faqSectionTitle?: string;
  bottomCta?: TreatmentCategoryBottomCta;
  treatments: CategoryTreatmentLink[];
  stats: CategoryStat[];
  landingPage: CategoryLandingPage | null;
  pageSections: ReturnType<typeof normalizePageSections>;
  seo?: Record<string, unknown>;
};

function mapLandingPage(raw: Record<string, unknown> | null | undefined): CategoryLandingPage | null {
  if (!raw) return null;

  const hero = (raw.hero as Record<string, unknown>) || {};
  const segmentsSection = (raw.segmentsSection as Record<string, unknown>) || {};
  const whySection = (raw.whySection as Record<string, unknown>) || {};
  const audiencesSection = (raw.audiencesSection as Record<string, unknown>) || {};
  const symptomsSection = (raw.symptomsSection as Record<string, unknown>) || {};
  const servicesSection = (raw.servicesSection as Record<string, unknown>) || {};
  const resultsSection = (raw.resultsSection as Record<string, unknown>) || {};
  const reviewsSection = (raw.reviewsSection as Record<string, unknown>) || {};
  const specialistsSection = (raw.specialistsSection as Record<string, unknown>) || {};

  const segments = ((segmentsSection.segments as unknown[]) || []).map((row, i) => {
    const s = row as Record<string, unknown>;
    return {
      id: asPlainString(s.id) || `segment-${i}`,
      title: asPlainString(s.title),
      desc: asPlainString(s.description),
      tags: asStringArray(s.tags),
      cta: asPlainString(s.ctaLabel),
      href: asPlainString(s.href),
    };
  });

  const steps = ((whySection.steps as unknown[]) || []).map((row) => {
    const s = row as Record<string, unknown>;
    return {
      n: asPlainString(s.number),
      title: asPlainString(s.title),
      desc: asPlainString(s.description),
    };
  });

  const audiences = ((audiencesSection.audiences as unknown[]) || []).map((row) => {
    const a = row as Record<string, unknown>;
    const icon = asPlainString(a.icon);
    return {
      title: asPlainString(a.title),
      desc: asPlainString(a.description),
      href: asPlainString(a.href),
      icon: (icon === "horizon" || icon === "arch" ? icon : "couple") as CategoryLandingAudience["icon"],
    };
  });

  const symptoms = ((symptomsSection.items as unknown[]) || []).map((row) => {
    const s = row as Record<string, unknown>;
    return {
      symptom: asPlainString(s.symptom),
      service: asPlainString(s.service),
      href: asPlainString(s.href),
    };
  });

  const reviews = ((reviewsSection.reviews as unknown[]) || []).map((row) => {
    const r = row as Record<string, unknown>;
    return {
      text: asPlainString(r.text),
      author: asPlainString(r.author),
      date: asPlainString(r.date),
    };
  });

  if (!asPlainString(hero.heading) && segments.length === 0) {
    return null;
  }

  return {
    documentTitle: asPlainString(raw.documentTitle) || undefined,
    srOnlyTitle: asPlainString(raw.srOnlyTitle) || undefined,
    hero: {
      eyebrow: asPlainString(hero.eyebrow),
      heading: asPlainString(hero.heading),
      headingEmphasis: asPlainString(hero.headingEmphasis),
      body: asPlainString(hero.body),
      bullets: asStringArray(hero.bullets),
      primaryCtaLabel: asPlainString(hero.primaryCtaLabel),
      secondaryCtaLabel: asPlainString(hero.secondaryCtaLabel),
      heroImageAlt: asPlainString(hero.heroImageAlt),
      secondaryImageAlt: asPlainString(hero.secondaryImageAlt),
    },
    segmentsSection: {
      eyebrow: asPlainString(segmentsSection.eyebrow),
      title: asPlainString(segmentsSection.title),
      titleLine2: asPlainString(segmentsSection.titleLine2),
      segments,
    },
    whySection: {
      eyebrow: asPlainString(whySection.eyebrow),
      title: asPlainString(whySection.title),
      description: asPlainString(whySection.description),
      steps,
    },
    audiencesSection: {
      eyebrow: asPlainString(audiencesSection.eyebrow),
      title: asPlainString(audiencesSection.title),
      titleAccent: asPlainString(audiencesSection.titleAccent),
      readMoreLabel: asPlainString(audiencesSection.readMoreLabel),
      audiences,
    },
    symptomsSection: {
      title: asPlainString(symptomsSection.title),
      description: asPlainString(symptomsSection.description),
      items: symptoms,
    },
    servicesSection: {
      eyebrow: asPlainString(servicesSection.eyebrow),
      title: asPlainString(servicesSection.title),
      description: asPlainString(servicesSection.description),
    },
    resultsSection: {
      eyebrow: asPlainString(resultsSection.eyebrow),
      title: asPlainString(resultsSection.title),
      description: asPlainString(resultsSection.description),
      categoryLabel: asPlainString(resultsSection.categoryLabel),
      footnote: asPlainString(resultsSection.footnote),
    },
    reviewsSection: {
      eyebrow: asPlainString(reviewsSection.eyebrow),
      title: asPlainString(reviewsSection.title),
      reviews,
    },
    specialistsSection: {
      title: asPlainString(specialistsSection.title),
      seeAllLabel: asPlainString(specialistsSection.seeAllLabel),
      seeAllHref: asPlainString(specialistsSection.seeAllHref) || "/spesialister?kategori=fertilitet",
    },
  };
}

export function mapTreatmentCategoryDocument(
  data: Record<string, unknown> | null | undefined,
  lang: "no" | "en",
): TreatmentCategoryData | null {
  if (!data) return null;

  const categoryId = asPlainString(data.categoryId) || asPlainString(data.slug) || "";
  const treatmentsRaw = (data.treatments as unknown[]) || [];

  const treatments = sortBySlug(
    treatmentsRaw.map((row) => {
      const t = row as Record<string, unknown>;
      const slug = asPlainString(t.slug);
      return {
        title: asPlainString(t.title),
        desc: asPlainString(t.description) || asPlainString(t.subtitle),
        slug,
        href: slug ? `/behandlinger/${categoryId}/${slug}` : "",
      };
    }),
    (t) => t.slug || t.title,
    lang,
  ).map(({ title, desc, href }) => ({ title, desc, href }));

  const stats = ((data.stats as unknown[]) || []).map((row) => {
    const s = row as Record<string, unknown>;
    const sub = asPlainString(s.sub);
    return {
      value: asPlainString(s.value),
      label: asPlainString(s.label),
      ...(sub ? { sub } : {}),
    };
  });

  const landingRaw = data.landingPage as Record<string, unknown> | undefined;
  const bottomCtaRaw = data.bottomCta as Record<string, unknown> | undefined;
  const quickInfoItems = asStringArray(data.quickInfoItems);

  return {
    categoryId,
    slug: asPlainString(data.slug) || undefined,
    title: asPlainString(data.title),
    description: asPlainString(data.description),
    heroImage: asPlainString(data.heroImage) || undefined,
    categoryNumericId:
      typeof data.categoryNumericId === "number" ? data.categoryNumericId : undefined,
    quickInfoItems: quickInfoItems.length ? quickInfoItems : undefined,
    linkedServicesSectionTitle:
      asPlainString(data.linkedServicesSectionTitle) || undefined,
    processSectionTitle: asPlainString(data.processSectionTitle) || undefined,
    faqSectionTitle: asPlainString(data.faqSectionTitle) || undefined,
    bottomCta: bottomCtaRaw
      ? {
          title: asPlainString(bottomCtaRaw.title) || undefined,
          subtitle: asPlainString(bottomCtaRaw.subtitle) || undefined,
          primaryLabel: asPlainString(bottomCtaRaw.primaryLabel) || undefined,
          secondaryLabel: asPlainString(bottomCtaRaw.secondaryLabel) || undefined,
          primaryPath: asPlainString(bottomCtaRaw.primaryPath) || undefined,
          secondaryPath: asPlainString(bottomCtaRaw.secondaryPath) || undefined,
        }
      : undefined,
    treatments,
    stats,
    landingPage: mapLandingPage(landingRaw),
    pageSections: normalizePageSections(data.pageSections),
    seo: data.seo as Record<string, unknown> | undefined,
  };
}

/** Server/client category payload — always hits Sanity directly. */
export async function fetchTreatmentCategoryData(
  categorySlug: string,
  lang: "no" | "en",
): Promise<TreatmentCategoryData | null> {
  const raw = await sanityClient.fetch<Record<string, unknown> | null>(
    TREATMENT_CATEGORY_BY_SLUG_QUERY,
    { slug: categorySlug, lang },
  );
  if (!raw) return null;
  const normalized = normalizeI18n(raw, lang) as Record<string, unknown>;
  return mapTreatmentCategoryDocument(normalized, lang);
}
