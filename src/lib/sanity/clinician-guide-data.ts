export type ClinicianGuideBlock = {
  _key: string;
  _type: "guideSubheading" | "guideParagraph" | "guideList" | "guideQuote";
  level?: "h3" | "h4";
  style?: string;
  text?: string;
  source?: string;
  items?: string[];
};

export type ClinicianGuideSection = {
  _key: string;
  heading: string;
  blocks: ClinicianGuideBlock[];
};

export type ClinicianGuidePageData = {
  title: string;
  slug: string;
  subtitle?: string;
  backLinkLabel?: string;
  backLinkUrl?: string;
  introTexts: string[];
  disclaimer?: string;
  sections: ClinicianGuideSection[];
  sources: string[];
  closingNote?: string;
  ctaText?: string;
  ctaLink?: string;
  seo?: { metaTitle?: string; metaDescription?: string; ogImage?: unknown; noIndex?: boolean };
};

export type ClinicianGuideRaw = {
  title?: string;
  slug?: string;
  subtitle?: string;
  backLinkLabel?: string;
  backLinkUrl?: string;
  introTexts?: { text?: string }[];
  disclaimer?: string;
  sections?: {
    _key: string;
    heading?: string;
    blocks?: {
      _key: string;
      _type: ClinicianGuideBlock["_type"];
      level?: "h3" | "h4";
      style?: string;
      text?: string;
      source?: string;
      items?: { text?: string }[];
    }[];
  }[];
  sources?: { text?: string }[];
  closingNote?: string;
  ctaText?: string;
  ctaLink?: string;
  seo?: ClinicianGuidePageData["seo"];
};

function textList(arr?: { text?: string }[]): string[] {
  return (arr || [])
    .map((item) => (typeof item.text === "string" ? item.text.trim() : ""))
    .filter(Boolean);
}

/** Maps a GROQ clinicianGuidePage row to the shape the page component renders. */
export function mapClinicianGuidePage(
  data: ClinicianGuideRaw | null | undefined,
  fallbackSlug: string,
): ClinicianGuidePageData | null {
  if (!data) return null;

  const sections: ClinicianGuideSection[] = (data.sections || []).map((section) => ({
    _key: section._key,
    heading: typeof section.heading === "string" ? section.heading.trim() : "",
    blocks: (section.blocks || []).map((block) => ({
      _key: block._key,
      _type: block._type,
      level: block.level,
      style: block.style,
      text: typeof block.text === "string" ? block.text : undefined,
      source: typeof block.source === "string" ? block.source : undefined,
      items: block._type === "guideList" ? textList(block.items) : undefined,
    })),
  }));

  return {
    title: typeof data.title === "string" ? data.title.trim() : "",
    slug: typeof data.slug === "string" ? data.slug : fallbackSlug,
    subtitle: typeof data.subtitle === "string" ? data.subtitle.trim() : "",
    backLinkLabel: typeof data.backLinkLabel === "string" ? data.backLinkLabel.trim() : "",
    backLinkUrl: typeof data.backLinkUrl === "string" ? data.backLinkUrl.trim() : "",
    introTexts: textList(data.introTexts),
    disclaimer: typeof data.disclaimer === "string" ? data.disclaimer.trim() : "",
    sections,
    sources: textList(data.sources),
    closingNote: typeof data.closingNote === "string" ? data.closingNote.trim() : "",
    ctaText: typeof data.ctaText === "string" ? data.ctaText.trim() : "",
    ctaLink: typeof data.ctaLink === "string" ? data.ctaLink.trim() : "",
    seo: data.seo,
  };
}

export function clinicianGuideHasBody(
  data: ClinicianGuidePageData | null | undefined,
): boolean {
  if (!data) return false;
  return (data.introTexts?.length ?? 0) > 0 || (data.sections?.length ?? 0) > 0;
}
