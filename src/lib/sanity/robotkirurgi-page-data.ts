import { resolveFaqsFromCollection, type ResolvedFaqItem } from "@/lib/sanity/faq-dual-read";

export type RobotkirurgiPageSection = {
  heading: string;
  paragraphs: string[];
  bulletPoints: string[];
};

export type RobotkirurgiPageData = {
  title: string;
  subtitle: string;
  heroMedia?: unknown;
  heroImageAlt: string;
  primaryCtaLabel: string;
  primaryCtaPath: string;
  introTexts: string[];
  sections: RobotkirurgiPageSection[];
  quoteText: string;
  quoteAttribution: string;
  secondaryCtaLabel: string;
  secondaryCtaPath: string;
  faqSectionTitle: string;
  faqs: ResolvedFaqItem[];
  geoSummary?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: unknown;
    noIndex?: boolean;
  };
};

type RobotkirurgiPageRaw = {
  title?: string;
  subtitle?: string;
  heroMedia?: unknown;
  heroImageAlt?: string;
  primaryCtaLabel?: string;
  primaryCtaPath?: string;
  introTexts?: string[];
  sections?: { heading?: string; paragraphs?: string[]; bulletPoints?: string[] }[];
  quoteText?: string;
  quoteAttribution?: string;
  secondaryCtaLabel?: string;
  secondaryCtaPath?: string;
  faqSectionTitle?: string;
  faqCollection?: unknown;
  geoSummary?: string;
  seo?: RobotkirurgiPageData["seo"];
};

function trimStrings(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return values
    .map((value) => (typeof value === "string" ? value.trim() : ""))
    .filter(Boolean);
}

export function mapRobotkirurgiPageData(
  data: RobotkirurgiPageRaw | null | undefined,
): RobotkirurgiPageData | null {
  if (!data) return null;

  const sections = Array.isArray(data.sections)
    ? data.sections
        .map((section) => ({
          heading: typeof section.heading === "string" ? section.heading.trim() : "",
          paragraphs: trimStrings(section.paragraphs),
          bulletPoints: trimStrings(section.bulletPoints),
        }))
        .filter(
          (section) =>
            section.heading || section.paragraphs.length > 0 || section.bulletPoints.length > 0,
        )
    : [];

  return {
    title: typeof data.title === "string" ? data.title.trim() : "",
    subtitle: typeof data.subtitle === "string" ? data.subtitle.trim() : "",
    heroMedia: data.heroMedia,
    heroImageAlt: typeof data.heroImageAlt === "string" ? data.heroImageAlt.trim() : "",
    primaryCtaLabel:
      typeof data.primaryCtaLabel === "string" ? data.primaryCtaLabel.trim() : "",
    primaryCtaPath:
      typeof data.primaryCtaPath === "string" ? data.primaryCtaPath.trim() : "",
    introTexts: trimStrings(data.introTexts),
    sections,
    quoteText: typeof data.quoteText === "string" ? data.quoteText.trim() : "",
    quoteAttribution:
      typeof data.quoteAttribution === "string" ? data.quoteAttribution.trim() : "",
    secondaryCtaLabel:
      typeof data.secondaryCtaLabel === "string" ? data.secondaryCtaLabel.trim() : "",
    secondaryCtaPath:
      typeof data.secondaryCtaPath === "string" ? data.secondaryCtaPath.trim() : "",
    faqSectionTitle:
      typeof data.faqSectionTitle === "string" ? data.faqSectionTitle.trim() : "",
    faqs: resolveFaqsFromCollection(data.faqCollection, null),
    geoSummary: typeof data.geoSummary === "string" ? data.geoSummary.trim() : "",
    seo: data.seo,
  };
}
