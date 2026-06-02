#!/usr/bin/env npx tsx
/**
 * Seeds full servicesPage content (NO + EN).
 *
 * From test/:
 *   SANITY_TOKEN=… npx tsx sanity/migrate-services-page-content.ts
 *
 * Deploy schema first: npx sanity schema deploy
 */
import { sanityClient } from "./config";
import { i18nString, i18nText } from "./lib/category-landing-i18n";
import { patchSingletonFields } from "./lib/patch-singleton";
import { servicesPageFaqs } from "./data/services-page-faqs";

const doc = {
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
  faqCategory: "tjenester",
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

async function main() {
  console.log("▶ Patching servicesPage (published + draft)…");
  const patched = await patchSingletonFields("servicesPage", doc);
  console.log(`✓ servicesPage updated — patched: ${patched.join(", ")}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
