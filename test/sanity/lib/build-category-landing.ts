import type { CategoryLandingSeed } from "../data/category-landing-types";
import {
  categoryLandingEn,
  categorySegmentsNo,
  translateServiceName,
  type CategoryEnCopy,
} from "../data/category-landing-en";
import { i18nString, i18nText, tags } from "./category-landing-i18n";

function firstServicePath(
  content: CategoryLandingSeed,
  group: { serviceNames: string[] },
): string {
  const name = group.serviceNames[0];
  return content.serviceLinks[name] || content.bookingPath;
}

export function buildLandingFromCategoryContent(
  no: CategoryLandingSeed,
  en: CategoryEnCopy,
): Record<string, unknown> {
  const categoryId = no.id;
  const bookingKategori = categoryId;
  const segmentsNo = categorySegmentsNo[categoryId];

  const segments = no.groups.map((group, i) => {
    const enGroup = en.groups[i];
    const tagPairs = group.serviceNames.map((name, j) => {
      const enName = enGroup?.serviceNames[j] ?? translateServiceName(name);
      return [name, enName] as [string, string];
    });
    return {
      _key: `seg-${i}`,
      id: `segment-${i}`,
      title: i18nString(group.label, enGroup?.label ?? group.label),
      description: i18nText(
        `Utredning og behandling innen ${group.label.toLowerCase()}.`,
        `Assessment and treatment within ${(enGroup?.label ?? group.label).toLowerCase()}.`,
      ),
      tags: tags(tagPairs),
      ctaLabel: i18nString("Les mer", "Read more"),
      href: firstServicePath(no, group),
    };
  });

  const steps = no.journey.map((step, i) => {
    const enStep = en.journey[i];
    const num = step.label.replace(/\D/g, "") || String(i + 1).padStart(2, "0");
    return {
      _key: `step-${i}`,
      number: num.padStart(2, "0"),
      title: i18nString(step.title, enStep?.title ?? step.title),
      description: i18nText(step.body, enStep?.body ?? step.body),
    };
  });

  const heroBody = [no.description, no.longDescription].filter(Boolean).join("\n\n");
  const heroBodyEn = [en.description, en.longDescription].filter(Boolean).join("\n\n");

  return {
    srOnlyTitle: i18nString(
      `${no.title} hos CMedical`,
      `${en.title} at CMedical`,
    ),
    hero: {
      eyebrow: i18nString(`${no.title} — CMedical`, `${en.title} — CMedical`),
      heading: i18nString(no.title, en.title),
      headingEmphasis: i18nString("", ""),
      body: i18nText(heroBody, heroBodyEn),
      bullets: tags([
        ["Ingen henvisning", "No referral needed"],
        ["Korte ventetider", "Short waiting times"],
        ["Erfarne spesialister", "Experienced specialists"],
      ]),
      primaryCtaLabel: i18nString("Bestill konsultasjon", "Book consultation"),
      secondaryCtaLabel: i18nString("Ring oss", "Call us"),
      heroImageAlt: i18nString(
        `${no.title} hos CMedical`,
        `${en.title} at CMedical`,
      ),
    },
    segmentsSection: {
      eyebrow: i18nString(
        segmentsNo?.eyebrow ?? "Behandlingsområder",
        en.segmentsEyebrow,
      ),
      title: i18nString(segmentsNo?.title ?? no.title, en.segmentsTitle),
      titleLine2: i18nString(segmentsNo?.titleLine2 ?? "", en.segmentsTitleLine2),
      segments,
    },
    whySection: {
      eyebrow: i18nString("Hvorfor CMedical", "Why CMedical"),
      title: i18nString(`Hvorfor CMedical for ${no.title.toLowerCase()}`, en.whyTitle),
      description: i18nText(
        `Ledende spesialister innen ${no.title.toLowerCase()} og korte ventetider.`,
        en.whyDescription,
      ),
      imageAlt: i18nString("CMedical klinikk", "CMedical clinic"),
      steps,
    },
    audiencesSection: {
      eyebrow: i18nString("", ""),
      title: i18nString("", ""),
      titleAccent: i18nString("", ""),
      readMoreLabel: i18nString("Les mer", "Read more"),
      audiences: [],
    },
    symptomsSection: {
      title: i18nString("", ""),
      description: i18nText("", ""),
      items: [],
    },
    servicesSection: {
      eyebrow: i18nString("Tjenester", "Services"),
      title: i18nString(no.servicesHeading, en.servicesHeading),
      description: i18nText(no.servicesIntro, en.servicesIntro),
    },
    resultsSection: {
      eyebrow: i18nString("", ""),
      title: i18nString("", ""),
      description: i18nText("", ""),
      categoryLabel: i18nString(no.title, en.title),
      footnote: i18nString("", ""),
    },
    reviewsSection: {
      eyebrow: i18nString("", ""),
      title: i18nString("", ""),
      reviews: [],
    },
  };
}

export function buildCategoryTitleI18n(no: CategoryLandingSeed, en: CategoryEnCopy) {
  return i18nString(no.title, en.title);
}
