#!/usr/bin/env npx tsx
/**
 * Seed missing servicesPage fields (NO + EN) — eyebrow, badges, search, etc.
 * Skips fields that already have i18n content unless FORCE=1.
 *
 * From test/:
 *   npm run migrate:services-page-content:dry
 *   npm run migrate:services-page-content
 */
import { sanityClient } from "./config";
import { DEFAULT_PAGE_BOOKING_CTA } from "./data/page-booking-cta-copy";
import { i18nString, i18nText } from "./lib/category-landing-i18n";
import {
  buildBookingCtaSectionFromCopy,
  buildServicesPageSpecialistsSection,
  hasSectionType,
} from "./lib/page-sections-migrate";
import { patchSingletonFields } from "./lib/patch-singleton";
import { servicesPageFaqs } from "./data/services-page-faqs";

const DRY_RUN = process.env.DRY_RUN === "1";
const FORCE = process.env.FORCE === "1";

type I18nEntry = { language?: string; _key?: string; value?: string };

function pickNo(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (!Array.isArray(value)) return "";
  const no = value.find(
    (e) => (e as I18nEntry).language === "no" || (e as I18nEntry)._key === "no",
  ) as I18nEntry | undefined;
  if (no?.value) return String(no.value).trim();
  const first = value[0] as I18nEntry | undefined;
  return first?.value ? String(first.value).trim() : "";
}

function hasI18nValue(value: unknown): boolean {
  return Boolean(pickNo(value));
}

function hasBadges(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0;
}

function hasFeatured(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0;
}

function buildServicesPageSections(existing: unknown[] | undefined): unknown[] {
  const sections = Array.isArray(existing) ? [...existing] : [];

  if (FORCE || !hasSectionType(sections, "pageSectionSpecialists")) {
    sections.unshift(buildServicesPageSpecialistsSection());
  }

  if (FORCE || !hasSectionType(sections, "pageSectionBookingCta")) {
    sections.push(
      buildBookingCtaSectionFromCopy("services-booking-cta", DEFAULT_PAGE_BOOKING_CTA),
    );
  }

  return sections;
}

const DEFAULTS: Record<string, unknown> = {
  breadcrumbHome: i18nString("Hjem", "Home"),
  title: i18nString("Våre tjenester", "Our services"),
  eyebrow: i18nString("Tjenester", "Services"),
  introText: i18nText(
    "Finn behandlingen som passer for deg",
    "Find the right treatment for you",
  ),
  badges: [
    { _key: "b1", label: i18nString("Ingen henvisning", "No referral needed") },
    { _key: "b2", label: i18nString("Ingen ventetid", "No waiting time") },
  ],
  searchPlaceholder: i18nString(
    "Søk etter behandling eller fagområde...",
    "Search for treatment or specialty...",
  ),
  featuredSectionTitle: i18nString("Utvalgte tjenester", "Featured services"),
  featuredCategories: [
    { _type: "reference", _ref: "category-gynekologi", _key: "fc1" },
    { _type: "reference", _ref: "category-urologi", _key: "fc2" },
    { _type: "reference", _ref: "category-fertilitet", _key: "fc3" },
    { _type: "reference", _ref: "category-ortopedi", _key: "fc4" },
  ],
  moreServicesSection: {
    eyebrow: i18nString("Flere tjenester", "More services"),
    title: i18nString("Vet du allerede hva du trenger?", "Already know what you need?"),
    description: i18nText(
      "Klikk og book direkte, eller les mer om den enkelte tjenesten.",
      "Click to book directly, or read more about each service.",
    ),
  },
  moreServicesCategories: [
    {
      _key: "msc1",
      displayMode: "categoryLink",
      category: { _type: "reference", _ref: "category-graviditet" },
    },
    {
      _key: "msc2",
      displayMode: "categoryLink",
      category: { _type: "reference", _ref: "category-ortopedi" },
    },
    {
      _key: "msc3",
      displayMode: "treatmentsList",
      category: { _type: "reference", _ref: "category-flere-fagomrader" },
    },
  ],
  faqSectionTitle: i18nString("Ofte stilte spørsmål", "Frequently asked questions"),
  faqs: servicesPageFaqs,
  loadingLabel: i18nString("Laster tjenester…", "Loading services…"),
  pageErrorMessage: i18nText(
    "Tjenestesiden kunne ikke lastes.",
    "The services page could not be loaded.",
  ),
  emptyCategoriesMessage: i18nText(
    "Ingen tjenestekategorier er konfigurert ennå.",
    "No service categories have been configured yet.",
  ),
  seo: {
    _type: "seo",
    metaTitle: i18nString(
      "Tjenester – Finn behandlingen som passer for deg",
      "Services – Find the right treatment for you",
    ),
    metaDescription: i18nText(
      "Se alle tjenester hos CMedical: gynekologi, fertilitet, urologi, ortopedi og flere fagområder. Ingen henvisning, kort ventetid.",
      "View all services at CMedical: gynecology, fertility, urology, orthopedics and more. No referral needed, short waiting times.",
    ),
  },
};

function buildPatch(existing: Record<string, unknown> | null): Record<string, unknown> {
  if (FORCE || !existing) {
    return {
      ...DEFAULTS,
      pageSections: buildServicesPageSections(undefined),
    };
  }

  const patch: Record<string, unknown> = {};

  const i18nFields = [
    "breadcrumbHome",
    "title",
    "eyebrow",
    "introText",
    "searchPlaceholder",
    "featuredSectionTitle",
    "faqSectionTitle",
    "loadingLabel",
    "pageErrorMessage",
    "emptyCategoriesMessage",
  ] as const;

  for (const key of i18nFields) {
    if (!hasI18nValue(existing[key])) {
      patch[key] = DEFAULTS[key];
    }
  }

  if (!hasBadges(existing.badges)) patch.badges = DEFAULTS.badges;
  if (!hasFeatured(existing.featuredCategories)) {
    patch.featuredCategories = DEFAULTS.featuredCategories;
  }

  const more = (existing.moreServicesSection as Record<string, unknown>) || {};
  if (
    !hasI18nValue(more.eyebrow) ||
    !hasI18nValue(more.title) ||
    !hasI18nValue(more.description)
  ) {
    patch.moreServicesSection = DEFAULTS.moreServicesSection;
  }

  if (!hasFeatured(existing.moreServicesCategories)) {
    patch.moreServicesCategories = DEFAULTS.moreServicesCategories;
  }

  if (!Array.isArray(existing.faqs) || (existing.faqs as unknown[]).length === 0) {
    patch.faqs = DEFAULTS.faqs;
  }

  if (!existing.seo) patch.seo = DEFAULTS.seo;

  const existingSections = Array.isArray(existing.pageSections)
    ? (existing.pageSections as unknown[])
    : undefined;
  const nextSections = buildServicesPageSections(existingSections);
  const sectionsChanged =
    FORCE ||
    !existingSections?.length ||
    nextSections.length !== existingSections.length ||
    !hasSectionType(existingSections, "pageSectionSpecialists");

  if (sectionsChanged) {
    patch.pageSections = nextSections;
  }

  return patch;
}

async function main() {
  const existing = await sanityClient.fetch<Record<string, unknown> | null>(
    `*[_id == "servicesPage"][0]`,
  );

  const patch = buildPatch(existing);

  if (Object.keys(patch).length === 0) {
    console.log("servicesPage already has content — nothing to patch (use FORCE=1 to overwrite).");
    return;
  }

  console.log("Fields to set:", Object.keys(patch).join(", "));

  if (DRY_RUN) {
    console.log("\nDry run — no changes written.");
    return;
  }

  console.log("▶ Patching servicesPage (published + draft)…");
  const patched = await patchSingletonFields("servicesPage", patch);
  console.log(`✓ servicesPage updated — patched: ${patched.join(", ")}`);
  console.log("Publish in Studio if you were editing the draft.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
