import { normalizePageSections } from "@/lib/sanity/page-sections";

export type ThemePageSection = {
  heading: string;
  paragraphs: string[];
  bulletPoints: string[];
};

export type ThemePageData = {
  title: string;
  geoSummary?: string;
  heroImage?: string;
  heroMedia?: unknown;
  introTexts: string[];
  sections: ThemePageSection[];
  lifePhases: { title: string; text: string }[];
  supportSpecialtiesSection?: {
    title: string;
    intro: string;
    items: Array<{ title: string; description: string }>;
  };
  specialtyAreasSection?: {
    title: string;
    cards: Array<{ title: string; href: string; image: string; imageAlt: string }>;
  };
  ctaText: string;
  ctaLink: string;
  pageSections: ReturnType<typeof normalizePageSections>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: unknown;
    noIndex?: boolean;
  };
};

type ThemePageRaw = {
  title?: string;
  geoSummary?: string;
  heroImage?: string;
  heroMedia?: unknown;
  introTexts?: string[];
  sections?: { heading?: string; paragraphs?: string[]; bulletPoints?: string[] }[];
  lifePhases?: { title?: string; text?: string }[];
  supportSpecialtiesSection?: {
    title?: string;
    intro?: string;
    items?: Array<{ title?: string; description?: string }>;
  };
  specialtyAreasSection?: {
    title?: string;
    cards?: Array<{
      title?: string;
      href?: string;
      image?: string;
      imageAlt?: string;
    }>;
  };
  ctaText?: string;
  ctaLink?: string;
  pageSections?: unknown;
  seo?: ThemePageData["seo"];
};

/** Maps a normalized themePage document to the shape `useThemePage` returns. */
export function mapThemePageData(data: ThemePageRaw | null | undefined): ThemePageData | null {
  if (!data) return null;

  const introTexts = Array.isArray(data.introTexts)
    ? data.introTexts
        .map((text) => (typeof text === "string" ? text.trim() : ""))
        .filter(Boolean)
    : [];

  const sections = Array.isArray(data.sections)
    ? data.sections
        .map((section) => ({
          heading: typeof section.heading === "string" ? section.heading.trim() : "",
          paragraphs: Array.isArray(section.paragraphs)
            ? section.paragraphs
                .map((p) => (typeof p === "string" ? p.trim() : ""))
                .filter(Boolean)
            : [],
          bulletPoints: Array.isArray(section.bulletPoints)
            ? section.bulletPoints
                .map((p) => (typeof p === "string" ? p.trim() : ""))
                .filter(Boolean)
            : [],
        }))
        .filter(
          (section) =>
            section.heading || section.paragraphs.length > 0 || section.bulletPoints.length > 0,
        )
    : [];

  const lifePhases = Array.isArray(data.lifePhases)
    ? data.lifePhases
        .map((phase) => ({
          title: typeof phase.title === "string" ? phase.title.trim() : "",
          text: typeof phase.text === "string" ? phase.text.trim() : "",
        }))
        .filter((phase) => phase.title && phase.text)
    : [];

  const supportSpecialtiesSection = data.supportSpecialtiesSection
    ? {
        title:
          typeof data.supportSpecialtiesSection.title === "string"
            ? data.supportSpecialtiesSection.title.trim()
            : "",
        intro:
          typeof data.supportSpecialtiesSection.intro === "string"
            ? data.supportSpecialtiesSection.intro.trim()
            : "",
        items: Array.isArray(data.supportSpecialtiesSection.items)
          ? data.supportSpecialtiesSection.items
              .map((item) => ({
                title: typeof item.title === "string" ? item.title.trim() : "",
                description:
                  typeof item.description === "string" ? item.description.trim() : "",
              }))
              .filter((item) => item.title && item.description)
          : [],
      }
    : undefined;

  const specialtyAreasSection = data.specialtyAreasSection
    ? {
        title:
          typeof data.specialtyAreasSection.title === "string"
            ? data.specialtyAreasSection.title.trim()
            : "",
        cards: Array.isArray(data.specialtyAreasSection.cards)
          ? data.specialtyAreasSection.cards
              .map((card) => ({
                title: typeof card.title === "string" ? card.title.trim() : "",
                href: typeof card.href === "string" ? card.href.trim() : "",
                image: typeof card.image === "string" ? card.image.trim() : "",
                imageAlt:
                  typeof card.imageAlt === "string" ? card.imageAlt.trim() : "",
              }))
              .filter((card) => card.title && card.href && card.image)
          : [],
      }
    : undefined;

  return {
    ...data,
    title: typeof data.title === "string" ? data.title.trim() : "",
    geoSummary: typeof data.geoSummary === "string" ? data.geoSummary.trim() : "",
    introTexts,
    sections,
    lifePhases,
    supportSpecialtiesSection,
    specialtyAreasSection,
    ctaText: typeof data.ctaText === "string" ? data.ctaText.trim() : "",
    ctaLink: typeof data.ctaLink === "string" ? data.ctaLink.trim() : "",
    pageSections: normalizePageSections(data.pageSections),
  };
}
