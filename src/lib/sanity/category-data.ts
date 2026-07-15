import { TREATMENT_CATEGORY_BY_SLUG_QUERY } from "@/lib/queries";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";
import { normalizePageSections } from "@/lib/sanity/page-sections";
import { sortBySortOrder } from "@/lib/sortAlphabetical";
import { sanityClient } from "@/lib/sanityClient";
import { behandlingerCategorySegment } from "@/lib/sanity/category-keys";

function asPlainString(value: unknown): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  // Handle plain {value: string} objects — returned by GROQ's i18nStringArrayLocale projection
  // e.g. bullets[]{value: coalesce(@[language == $lang][0].value, ...)}
  if (typeof value === "object" && !Array.isArray(value) && "value" in value) {
    const inner = (value as { value: unknown }).value;
    if (typeof inner === "string") return inner;
  }
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

export type CategoryLandingSegmentTagLink = {
  label: string;
  href: string;
};

export type CategoryLandingSegment = {
  id?: string;
  title: string;
  desc: string;
  tags: string[];
  tagLinks: CategoryLandingSegmentTagLink[];
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
  icon: "couple" | "horizon" | "arch" | "user" | "users" | "clock" | "";
  image?: string;
};

export type CategoryLandingExpertArea = {
  title: string;
  desc: string;
  href: string;
  image?: string;
  imageAlt: string;
};

export type CategoryLandingServiceItem = {
  title: string;
  desc: string;
  href: string;
};

export type CategoryLandingServiceGroup = {
  label: string;
  items: CategoryLandingServiceItem[];
};

export type CategoryLandingSpotlight = {
  title: string;
  titleEmphasis: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
  image?: string;
  imageAlt: string;
};

export type CategoryLandingSymptom = {
  symptom: string;
  service: string;
  href: string;
  image?: string;
  imageAlt: string;
};

export type CategoryLandingReview = {
  text: string;
  author: string;
  date: string;
};

export type CategoryLandingPage = {
  srOnlyTitle?: string;
  breadcrumbHomeLabel: string;
  hero: {
    layout?: string;
    eyebrow: string;
    heading: string;
    headingEmphasis: string;
    body: string;
    bullets: string[];
    primaryCtaLabel: string;
    secondaryCtaLabel: string;
    heroImageAlt: string;
    primaryBookingService?: string;
    entryPriceLabel?: string;
    entryPriceValue?: string;
  };
  segmentsSection: {
    eyebrow: string;
    title: string;
    titleLine2: string;
    layout: "accordion" | "grid";
    segments: CategoryLandingSegment[];
  };
  whySection: {
    eyebrow: string;
    title: string;
    description: string;
    image?: string;
    imageAlt?: string;
    footerLinkLabel?: string;
    footerLinkHref?: string;
    steps: CategoryLandingStep[];
  };
  expertAreasSection: {
    eyebrow: string;
    title: string;
    description: string;
    layout: "grid" | "carousel";
    readMoreLabel: string;
    areas: CategoryLandingExpertArea[];
  };
  supportSection: {
    title: string;
    description: string;
    readMoreLabel: string;
    areas: CategoryLandingExpertArea[];
  };
  spotlightSection: CategoryLandingSpotlight | null;
  journeySection: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
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
    eyebrow: string;
    title: string;
    description: string;
    items: CategoryLandingSymptom[];
  };
  servicesSection: {
    eyebrow: string;
    title: string;
    description: string;
    groups: CategoryLandingServiceGroup[];
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
  /** Ordered list of section keys from Sanity. Empty = use default order. */
  sectionOrder: string[];
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

export type TreatmentCategoryData = {
  categoryId: string;
  slug?: string;
  title: string;
  geoSummary?: string;
  missingLandingMessage: string;
  heroImage?: string;
  heroVideo?: string;
  categoryNumericId?: number;
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
  const expertAreasSection = (raw.expertAreasSection as Record<string, unknown>) || {};
  const supportSection = (raw.supportSection as Record<string, unknown>) || {};
  const spotlightSection = (raw.spotlightSection as Record<string, unknown>) || {};
  const journeySection = (raw.journeySection as Record<string, unknown>) || {};
  const audiencesSection = (raw.audiencesSection as Record<string, unknown>) || {};
  const symptomsSection = (raw.symptomsSection as Record<string, unknown>) || {};
  const servicesSection = (raw.servicesSection as Record<string, unknown>) || {};
  const resultsSection = (raw.resultsSection as Record<string, unknown>) || {};
  const reviewsSection = (raw.reviewsSection as Record<string, unknown>) || {};

  const segments = ((segmentsSection.segments as unknown[]) || []).map((row, i) => {
    const s = row as Record<string, unknown>;
    const tagLinksRaw = (s.tagLinks as unknown[]) || [];
    const tagLinks = tagLinksRaw
      .map((row) => {
        const t = row as Record<string, unknown>;
        const label = asPlainString(t.label);
        const href = asPlainString(t.href);
        if (!label || !href) return null;
        return { label, href };
      })
      .filter((t): t is CategoryLandingSegmentTagLink => t !== null);

    return {
      id: asPlainString(s.id) || `segment-${i}`,
      title: asPlainString(s.title),
      desc: asPlainString(s.description),
      tags: asStringArray(s.tags),
      tagLinks,
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
    const validIcons = ["couple", "horizon", "arch", "user", "users", "clock"] as const;
    return {
      title: asPlainString(a.title),
      desc: asPlainString(a.description),
      href: asPlainString(a.href),
      icon: (validIcons.includes(icon as (typeof validIcons)[number])
        ? icon
        : "") as CategoryLandingAudience["icon"],
      image: asPlainString(a.image) || undefined,
    };
  });

  const mapExpertAreas = (areasRaw: unknown) =>
    ((areasRaw as unknown[]) || []).map((row) => {
      const a = row as Record<string, unknown>;
      return {
        title: asPlainString(a.title),
        desc: asPlainString(a.description),
        href: asPlainString(a.href),
        image: asPlainString(a.image) || undefined,
        imageAlt: asPlainString(a.imageAlt),
      };
    });

  const expertAreas = mapExpertAreas(expertAreasSection.areas);
  const supportAreas = mapExpertAreas(supportSection.areas);
  const expertAreasLayout = asPlainString(expertAreasSection.layout);

  const serviceGroups = ((servicesSection.groups as unknown[]) || []).map((row) => {
    const g = row as Record<string, unknown>;
    const items = ((g.items as unknown[]) || []).map((itemRow) => {
      const item = itemRow as Record<string, unknown>;
      return {
        title: asPlainString(item.title),
        desc: asPlainString(item.description),
        href: asPlainString(item.href),
      };
    });
    return {
      label: asPlainString(g.label),
      items,
    };
  });

  const segmentsLayout = asPlainString(segmentsSection.layout);
  const journeySteps = ((journeySection.steps as unknown[]) || []).map((row) => {
    const s = row as Record<string, unknown>;
    return {
      n: asPlainString(s.number),
      title: asPlainString(s.title),
      desc: asPlainString(s.description),
    };
  });
  const spotlightTitle = asPlainString(spotlightSection.title);
  const spotlight =
    spotlightTitle || asPlainString(spotlightSection.text)
      ? {
          title: spotlightTitle,
          titleEmphasis: asPlainString(spotlightSection.titleEmphasis),
          text: asPlainString(spotlightSection.text),
          ctaLabel: asPlainString(spotlightSection.ctaLabel),
          ctaHref: asPlainString(spotlightSection.ctaHref),
          image: asPlainString(spotlightSection.image) || undefined,
          imageAlt: asPlainString(spotlightSection.imageAlt),
        }
      : null;

  const symptoms = ((symptomsSection.items as unknown[]) || []).map((row) => {
    const s = row as Record<string, unknown>;
    return {
      symptom: asPlainString(s.symptom),
      service: asPlainString(s.service),
      href: asPlainString(s.href),
      image: asPlainString(s.image) || undefined,
      imageAlt: asPlainString(s.imageAlt),
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
    srOnlyTitle: asPlainString(raw.srOnlyTitle) || undefined,
    breadcrumbHomeLabel: asPlainString(raw.breadcrumbHomeLabel),
    hero: {
      layout: asPlainString(hero.layout) || undefined,
      eyebrow: asPlainString(hero.eyebrow),
      heading: asPlainString(hero.heading),
      headingEmphasis: asPlainString(hero.headingEmphasis),
      body: asPlainString(hero.body),
      bullets: asStringArray(hero.bullets),
      primaryCtaLabel: asPlainString(hero.primaryCtaLabel),
      secondaryCtaLabel: asPlainString(hero.secondaryCtaLabel),
      heroImageAlt: asPlainString(hero.heroImageAlt),
      primaryBookingService: asPlainString(hero.primaryBookingService) || undefined,
      entryPriceLabel: asPlainString(hero.entryPriceLabel) || undefined,
      entryPriceValue: asPlainString(hero.entryPriceValue) || undefined,
    },
    segmentsSection: {
      eyebrow: asPlainString(segmentsSection.eyebrow),
      title: asPlainString(segmentsSection.title),
      titleLine2: asPlainString(segmentsSection.titleLine2),
      layout: segmentsLayout === "accordion" ? "accordion" : "grid",
      segments,
    },
    whySection: {
      eyebrow: asPlainString(whySection.eyebrow),
      title: asPlainString(whySection.title),
      description: asPlainString(whySection.description),
      image: asPlainString(whySection.image) || undefined,
      imageAlt: asPlainString(whySection.imageAlt) || undefined,
      footerLinkLabel: asPlainString(whySection.footerLinkLabel) || undefined,
      footerLinkHref: asPlainString(whySection.footerLinkHref) || undefined,
      steps,
    },
    expertAreasSection: {
      eyebrow: asPlainString(expertAreasSection.eyebrow),
      title: asPlainString(expertAreasSection.title),
      description: asPlainString(expertAreasSection.description),
      layout: expertAreasLayout === "grid" ? "grid" : "carousel",
      readMoreLabel: asPlainString(expertAreasSection.readMoreLabel),
      areas: expertAreas,
    },
    supportSection: {
      title: asPlainString(supportSection.title),
      description: asPlainString(supportSection.description),
      readMoreLabel: asPlainString(supportSection.readMoreLabel),
      areas: supportAreas,
    },
    spotlightSection: spotlight,
    journeySection: {
      title: asPlainString(journeySection.title),
      description: asPlainString(journeySection.description),
      ctaLabel: asPlainString(journeySection.ctaLabel),
      ctaHref: asPlainString(journeySection.ctaHref),
      steps: journeySteps,
    },
    audiencesSection: {
      eyebrow: asPlainString(audiencesSection.eyebrow),
      title: asPlainString(audiencesSection.title),
      titleAccent: asPlainString(audiencesSection.titleAccent),
      readMoreLabel: asPlainString(audiencesSection.readMoreLabel),
      audiences,
    },
    symptomsSection: {
      eyebrow: asPlainString(symptomsSection.eyebrow),
      title: asPlainString(symptomsSection.title),
      description: asPlainString(symptomsSection.description),
      items: symptoms,
    },
    servicesSection: {
      eyebrow: asPlainString(servicesSection.eyebrow),
      title: asPlainString(servicesSection.title),
      description: asPlainString(servicesSection.description),
      groups: serviceGroups,
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
    sectionOrder: Array.isArray(raw.sectionOrder)
      ? (raw.sectionOrder as unknown[]).map(asPlainString).filter(Boolean)
      : [],
  };
}

export function mapTreatmentCategoryDocument(
  data: Record<string, unknown> | null | undefined,
  lang: "no" | "en",
): TreatmentCategoryData | null {
  if (!data) return null;

  const categoryId = asPlainString(data.categoryId) || asPlainString(data.slug) || "";
  const treatmentsRaw = sortBySortOrder(
    (data.treatments as unknown[]) || [],
    (row) => (row as Record<string, unknown>).sortOrder,
    (row) => (row as Record<string, unknown>).title,
    lang,
  );

  const treatments = treatmentsRaw
    .map((row) => {
      const t = row as Record<string, unknown>;
      const slug = asPlainString(t.slug);
      return {
        title: asPlainString(t.title),
        desc: asPlainString(t.description) || asPlainString(t.subtitle),
        slug,
        href: slug
          ? `/behandlinger/${behandlingerCategorySegment(categoryId, lang)}/${slug}`
          : "",
      };
    })
    .map(({ title, desc, href }) => ({ title, desc, href }));

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

  return {
    categoryId,
    slug: asPlainString(data.slug) || undefined,
    title: asPlainString(data.title),
    geoSummary: asPlainString(data.geoSummary) || undefined,
    missingLandingMessage: asPlainString(data.missingLandingMessage) || "",
    heroImage: asPlainString(data.heroImage) || undefined,
    heroVideo: asPlainString(data.heroVideo) || undefined,
    categoryNumericId:
      typeof data.categoryNumericId === "number" ? data.categoryNumericId : undefined,
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
