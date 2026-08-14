#!/usr/bin/env npx tsx
/**
 * Developer-only: Urologi category parity vs avenewdemo `/urologi`.
 *
 * - symptomsSection.background → secondary (darker warm beige)
 * - expertAreas heading parity
 * - clear FAQ
 * - restore shared Booking CTA band copy
 * - page-owned insurance partners (reference order; no shared collection override)
 *
 *   cd test && npx tsx sanity/patch-urologi-parity-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const DOC_ID = "category-urologi";

type I18nItem = {
  _type: string;
  _key: string;
  language: string;
  value: string;
};

function i18nString(no: string, en: string): I18nItem[] {
  return [
    { _type: "internationalizedArrayStringValue", _key: "no", language: "no", value: no },
    { _type: "internationalizedArrayStringValue", _key: "en", language: "en", value: en },
  ];
}

function i18nText(no: string, en: string): I18nItem[] {
  return [
    { _type: "internationalizedArrayTextValue", _key: "no", language: "no", value: no },
    { _type: "internationalizedArrayTextValue", _key: "en", language: "en", value: en },
  ];
}

/** Live avenewdemo `/urologi` partner order (source of truth). */
const INSURANCE_PARTNERS = [
  ["gjensidige", "Gjensidige"],
  ["if", "If"],
  ["fremtind", "Fremtind"],
  ["storebrand", "Storebrand"],
  ["tryg", "Tryg"],
  ["vertikal", "Vertikal"],
  ["codan", "Codan"],
  ["eika", "Eika"],
] as const;

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  console.log("▶ Urologi parity patch");
  console.log(`  project=${PROJECT_ID} dataset=${DATASET} dryRun=${DRY_RUN}`);

  const current = await sanityClient.fetch<{
    landingPage?: Record<string, any>;
    pageSections?: Array<Record<string, any>>;
  } | null>(`*[_id == $id][0]{ landingPage, pageSections }`, { id: DOC_ID });

  if (!current?.landingPage) {
    throw new Error(`ABORT: ${DOC_ID}.landingPage missing`);
  }

  const lp = current.landingPage;

  const landingPage = {
    ...lp,
    expertAreasSection: {
      ...lp.expertAreasSection,
      title: i18nString(
        "Utredning og behandling — tilpasset dine plager.",
        "Assessment and treatment — tailored to your symptoms.",
      ),
      description: i18nText(
        "Hos oss møter du urologer som har spesialisert seg dypt innenfor sitt fagfelt. Det betyr at du får riktig kompetanse fra første konsultasjon — uten omveier.",
        "You meet urologists who have specialised deeply in their field. That means the right expertise from the first consultation — without detours.",
      ),
    },
    symptomsSection: {
      ...lp.symptomsSection,
      background: "secondary",
      title: i18nString("Hva kjenner du på?", "What are you experiencing?"),
      description: i18nText(
        "Velg det som ligner mest på din situasjon — så foreslår vi en god start.",
        "Choose what best matches your situation — and we will suggest a good place to start.",
      ),
    },
  };

  // Reference bottom bands: specialists → journey → insurance → CTA
  const byType = (type: string) =>
    (current.pageSections || []).find((s) => s._type === type);

  const specialists =
    byType("pageSectionSpecialists") ||
    ({
      _key: "ps-spec",
      _type: "pageSectionSpecialists",
      displayMode: "category",
      categorySlug: "urologi",
      limit: 8,
      variant: "carousel",
    } as Record<string, unknown>);

  const insuranceBase = byType("pageSectionInsurance") || {
    _key: "ps-insurance",
    _type: "pageSectionInsurance",
  };
  const { insuranceCollection: _dropIns, ...insuranceRest } = insuranceBase as Record<
    string,
    unknown
  > & { insuranceCollection?: unknown };

  const ctaBase = byType("pageSectionBookingCta") || {
    _key: "ps-cta",
    _type: "pageSectionBookingCta",
  };
  const { ctaCollection: _dropCta, ...ctaRest } = ctaBase as Record<string, unknown> & {
    ctaCollection?: unknown;
  };

  const pageSections = [
    {
      ...specialists,
      displayMode: specialists.displayMode || "category",
      categorySlug: specialists.categorySlug || "urologi",
      title:
        specialists.title ||
        i18nString("Urologene som følger deg.", "The urologists who support you."),
      limit: typeof specialists.limit === "number" ? specialists.limit : 8,
      variant: specialists.variant || "carousel",
    },
    {
      ...insuranceRest,
      _type: "pageSectionInsurance",
      eyebrow: i18nString("Forsikringspartnere", "Insurance partners"),
      title: i18nString(
        "Vi har avtale med de største forsikringsselskapene i Norge.",
        "We have agreements with the largest insurance companies in Norway.",
      ),
      partners: INSURANCE_PARTNERS.map(([key, label]) => ({
        _key: key,
        key,
        label: i18nString(label, label),
      })),
    },
    {
      ...ctaRest,
      _type: "pageSectionBookingCta",
      title: i18nString(
        "Bestill time hos spesialist",
        "Book an appointment with a specialist",
      ),
      subtitle: i18nString(
        "Velg tjeneste, klinikk og behandler – alt i én enkel bestilling.",
        "Choose service, clinic and clinician – all in one simple booking.",
      ),
      primaryLabel: i18nString("Bestill time nå", "Book now"),
      primaryPath: "/booking?kategori=urologi",
      showSecondaryButton: true,
      secondaryLabel: i18nString("Ring oss", "Call us"),
      bookingCategory: {
        _type: "reference",
        _ref: DOC_ID,
      },
    },
  ];

  // Keep any other section types (articles, etc.) after the three core bands.
  const coreTypes = new Set([
    "pageSectionSpecialists",
    "pageSectionInsurance",
    "pageSectionBookingCta",
  ]);
  for (const section of current.pageSections || []) {
    if (!coreTypes.has(section._type)) pageSections.push(section);
  }

  if (DRY_RUN) {
    console.log("[dry-run] symptoms.background → secondary");
    console.log("[dry-run] clear FAQ");
    console.log(
      "[dry-run] insurance:",
      INSURANCE_PARTNERS.map(([, l]) => l).join(", "),
    );
    console.log("[dry-run] CTA title restored");
    return;
  }

  await sanityClient
    .patch(DOC_ID)
    .set({ landingPage, pageSections, faqs: [] })
    .unset(["faqCollection", "faqSectionTitle", "faqSectionDescription"])
    .commit({ autoGenerateArrayKeys: true });

  const draft = await sanityClient.fetch<string | null>(
    `*[_id == $id][0]._id`,
    { id: `drafts.${DOC_ID}` },
  );
  if (draft) {
    await sanityClient
      .patch(draft)
      .set({ landingPage, pageSections, faqs: [] })
      .unset(["faqCollection", "faqSectionTitle", "faqSectionDescription"])
      .commit({ autoGenerateArrayKeys: true });
    console.log(`✓ Also patched ${draft}`);
  }

  const verify = await sanityClient.fetch(
    `*[_id == $id][0]{
      "expertTitle": landingPage.expertAreasSection.title[language=="no"][0].value,
      "symptomsBg": landingPage.symptomsSection.background,
      "faqCollection": faqCollection,
      "faqs": count(faqs),
      "pageSections": pageSections[]{
        _type,
        "titleNo": title[language=="no"][0].value,
        "partners": partners[].label[language=="no"][0].value,
        "insColl": insuranceCollection._ref
      }
    }`,
    { id: DOC_ID },
  );
  console.log("✓ Patched", DOC_ID);
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
