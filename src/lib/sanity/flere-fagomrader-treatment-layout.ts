import {
  treatmentContent,
  type LinkedService,
  type TreatmentData as StaticTreatmentData,
} from "@/data/treatmentContent";
import {
  FLERE_EXPERT_SEE_ALL,
  resolveFlereLinkedServiceImage,
  resolveFlereLinkedServicePath,
} from "@/lib/sanity/flere-linked-service-media";

type ReasonItem = { n: string; title: string; desc: string };

type ExpertAreaItem = {
  title: string;
  desc: string;
  href: string;
  image?: string;
  imageAlt?: string;
};

type ExpertAreasBand = {
  title: string;
  description?: string;
  items: ExpertAreaItem[];
};

export type FlereLayoutInput = {
  treatmentSlug: string;
  canonicalSlug?: string;
  lang: "no" | "en";
  reasons: ReasonItem[];
  reasonsTitle: string;
  reasonsLead?: string;
  heroThemes?: string[];
  expertAreas?: ExpertAreasBand;
  relatedSeeAll?: { href: string; label: string };
};

export type FlereLayoutOutput = {
  reasons: ReasonItem[];
  reasonsTitle: string;
  reasonsLead?: string;
  expertAreas?: ExpertAreasBand;
  relatedSeeAll?: { href: string; label: string };
};

const EXPERT_AREAS_TITLE: Record<string, { no: string; en: string }> = {
  hudhelse: {
    no: "Dette hjelper vi deg med innen hudhelse",
    en: "How we help you with skin health",
  },
  hudbehandlinger: {
    no: "Dette hjelper vi deg med innen hudbehandlinger",
    en: "How we help you within skin treatments",
  },
  robotkirurgi: {
    no: "Vi behandler blant annet:",
    en: "We treat, among others:",
  },
};

function normalizeTitle(value: string): string {
  return value.trim().toLowerCase();
}

function resolveStaticKey(
  treatmentSlug: string,
  canonicalSlug?: string,
): string | null {
  const candidates = new Set<string>();
  if (canonicalSlug?.includes("/")) {
    candidates.add(`flere-fagomrader/${canonicalSlug}`);
  }
  candidates.add(`flere-fagomrader/${treatmentSlug}`);
  if (canonicalSlug && canonicalSlug !== treatmentSlug) {
    candidates.add(`flere-fagomrader/${canonicalSlug}`);
  }

  for (const key of candidates) {
    if (key in treatmentContent) return key;
  }
  return null;
}

function staticDataForSlug(
  treatmentSlug: string,
  canonicalSlug?: string,
): StaticTreatmentData | null {
  const key = resolveStaticKey(treatmentSlug, canonicalSlug);
  return key ? treatmentContent[key] : null;
}

function cardTitleSet(
  staticData: StaticTreatmentData | null,
  heroThemes?: string[],
): Set<string> {
  const titles = new Set<string>();
  for (const service of staticData?.linkedServices ?? []) {
    if (service.label.trim()) titles.add(normalizeTitle(service.label));
  }
  for (const theme of heroThemes ?? []) {
    if (theme.trim()) titles.add(normalizeTitle(theme));
  }
  return titles;
}

function isCardReason(title: string, cardTitles: Set<string>): boolean {
  const normalized = normalizeTitle(title);
  if (cardTitles.has(normalized)) return true;
  // Robotkirurgi: CMS may use shortened titles that still match hero theme chips.
  if (normalized.includes("robotkirurgi") && cardTitles.size > 0) {
    for (const cardTitle of cardTitles) {
      if (cardTitle.includes("robotkirurgi") && normalized.includes("robotkirurgi")) {
        return true;
      }
    }
  }
  return false;
}

function reasonByTitle(
  reasons: ReasonItem[],
  label: string,
): ReasonItem | undefined {
  const target = normalizeTitle(label);
  return reasons.find((item) => normalizeTitle(item.title) === target);
}

function sectionsToReasons(
  sections: StaticTreatmentData["sections"],
): ReasonItem[] {
  return (sections ?? [])
    .map((section, index) => ({
      n: String(index + 1).padStart(2, "0"),
      title: section.heading.trim(),
      desc: section.content.trim(),
    }))
    .filter((item) => item.title || item.desc);
}

function buildCardItems(
  linkedServices: LinkedService[],
  reasons: ReasonItem[],
  lang: "no" | "en",
): ExpertAreaItem[] {
  const items: ExpertAreaItem[] = [];
  for (const service of linkedServices) {
    const matched = reasonByTitle(reasons, service.label);
    const desc = matched?.desc?.trim() || service.description.trim();
    if (!service.label.trim() || !desc) continue;
    items.push({
      title: service.label.trim(),
      desc,
      href: resolveFlereLinkedServicePath(service.path, lang),
      image: resolveFlereLinkedServiceImage(service.path, service.image),
      imageAlt: service.label.trim(),
    });
  }
  return items;
}

function resolveSeeAll(
  treatmentSlug: string,
  lang: "no" | "en",
  fallback?: { href: string; label: string },
): { href: string; label: string } | undefined {
  const override = FLERE_EXPERT_SEE_ALL[treatmentSlug];
  if (override) {
    return lang === "en" ? override.en : override.no;
  }
  return fallback;
}

function renumberReasons(items: ReasonItem[]): ReasonItem[] {
  return items.map((item, index) => ({
    ...item,
    n: String(index + 1).padStart(2, "0"),
  }));
}

function mergeAccordionReasons(
  cmsReasons: ReasonItem[],
  staticSections: StaticTreatmentData["sections"],
  cardTitles: Set<string>,
): ReasonItem[] {
  const accordionFromCms = cmsReasons.filter(
    (item) => item.title && !isCardReason(item.title, cardTitles),
  );
  if (accordionFromCms.length > 0) {
    return renumberReasons(accordionFromCms);
  }

  const fromStatic = sectionsToReasons(staticSections).filter(
    (item) => item.title && !isCardReason(item.title, cardTitles),
  );
  return renumberReasons(fromStatic);
}

function resolveExpertAreasTitle(
  treatmentSlug: string,
  lang: "no" | "en",
  staticData: StaticTreatmentData | null,
  fallbackTitle: string,
): string {
  const override = EXPERT_AREAS_TITLE[treatmentSlug];
  if (override) return lang === "en" ? override.en : override.no;
  if (staticData?.relatedTitleOverride?.trim()) {
    return staticData.relatedTitleOverride.trim();
  }
  return fallbackTitle.trim();
}

function cmsExpertAreasHasItems(expertAreas?: ExpertAreasBand): boolean {
  return Boolean(expertAreas?.items?.some((item) => item.title?.trim()));
}

/**
 * Demo parity for Flere tjenester: linked-service cards belong in Expert areas,
 * not in the Symptoms accordion. CMS often stores both in `reasons[]`.
 */
export function normalizeFlereFagomraderTreatmentLayout(
  input: FlereLayoutInput,
): FlereLayoutOutput {
  const staticData = staticDataForSlug(input.treatmentSlug, input.canonicalSlug);
  const linkedServices = staticData?.linkedServices ?? [];
  const cardTitles = cardTitleSet(staticData, input.heroThemes);
  const hasCardLayout = linkedServices.length > 0 || cardTitles.size > 0;

  const seeAll = resolveSeeAll(
    input.treatmentSlug,
    input.lang,
    input.relatedSeeAll,
  );

  if (!hasCardLayout) {
    return {
      reasons: input.reasons,
      reasonsTitle: input.reasonsTitle,
      reasonsLead: input.reasonsLead,
      expertAreas: input.expertAreas,
      relatedSeeAll: seeAll,
    };
  }

  if (cmsExpertAreasHasItems(input.expertAreas)) {
    const accordionReasons = mergeAccordionReasons(
      input.reasons,
      staticData?.sections,
      cardTitles,
    );
    const hasAccordion = accordionReasons.length > 0;
    return {
      reasons: accordionReasons,
      reasonsTitle: hasAccordion ? input.reasonsTitle : "",
      reasonsLead: hasAccordion ? input.reasonsLead : undefined,
      expertAreas: {
        ...input.expertAreas!,
        items: input.expertAreas!.items.map((item) => ({
          ...item,
          href: item.href
            ? resolveFlereLinkedServicePath(item.href, input.lang)
            : item.href,
          image: resolveFlereLinkedServiceImage(item.href, item.image),
        })),
      },
      relatedSeeAll: seeAll,
    };
  }

  const cardItems =
    linkedServices.length > 0
      ? buildCardItems(linkedServices, input.reasons, input.lang)
      : input.reasons
          .filter((item) => item.title && isCardReason(item.title, cardTitles))
          .map((item) => ({
            title: item.title,
            desc: item.desc,
            href: "",
            imageAlt: item.title,
          }))
          .filter((item) => item.desc.trim());

  const staticSections = staticData?.sections ?? [];
  const cardsOnly =
    linkedServices.length > 0 &&
    staticSections.length === 0 &&
    !input.reasons.some(
      (item) => item.title && !isCardReason(item.title, cardTitles),
    );

  const accordionReasons = cardsOnly
    ? []
    : mergeAccordionReasons(input.reasons, staticSections, cardTitles);

  const expertAreas: ExpertAreasBand | undefined =
    cardItems.length > 0
      ? {
          title: resolveExpertAreasTitle(
            input.treatmentSlug,
            input.lang,
            staticData,
            input.reasonsTitle,
          ),
          description: input.expertAreas?.description,
          items: cardItems,
        }
      : undefined;

  return {
    reasons: accordionReasons,
    reasonsTitle: cardsOnly ? "" : input.reasonsTitle,
    reasonsLead: cardsOnly ? undefined : input.reasonsLead,
    expertAreas,
    relatedSeeAll: seeAll,
  };
}
