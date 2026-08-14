#!/usr/bin/env npx tsx
/**
 * Developer-only: Graviditet category parity vs avenewdemo `/graviditet`.
 *
 * - Strip FAQ helper paragraph from faqSectionDescription
 * - Expert areas heading + Ultralyd card title
 * - Why step 03 → live reference copy
 * - Shared kvinnehelse insurance collection (same partners as Gynekologi reference)
 * - CTA band copy → “Bestill time hos spesialist”
 * - pageSections order: specialists → CTA → insurance
 *
 *   cd test && npx tsx sanity/patch-graviditet-parity-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const DOC_ID = "category-graviditet";
const DRAFT_ID = "drafts.category-graviditet";
const CTA_COLLECTION_ID = "migrated-cta-collection.3d18bc512a8b365f";
const SHARED_KVINNE_INSURANCE_ID = "insurance-collection.shared-kvinnehelse";

/** Live avenewdemo `/graviditet` + `/gynekologi` partner order. */
const KVINNE_INSURANCE_PARTNERS = [
  ["gjensidige", "Gjensidige"],
  ["if", "If"],
  ["fremtind", "Fremtind"],
  ["avanova", "Avanova"],
  ["tryg", "Tryg"],
  ["vertikal", "Vertikal"],
  ["falck", "Falck"],
  ["euro-accident", "Euro Accident"],
] as const;

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

async function ensureSharedKvinneInsurance() {
  const doc = {
    _id: SHARED_KVINNE_INSURANCE_ID,
    _type: "insuranceCollection",
    internalName: "Shared kvinnehelse insurance partners",
    description:
      "Shared partner pack for Graviditet / Gynekologi (Gjensidige → Euro Accident).",
    title: i18nString(
      "Vi har avtale med de største forsikringsselskapene i Norge.",
      "We have agreements with the largest insurance companies in Norway.",
    ),
    partners: KVINNE_INSURANCE_PARTNERS.map(([key, label]) => ({
      _key: key,
      key,
      label: i18nString(label, label),
    })),
    sortOrder: 10,
  };

  if (DRY_RUN) {
    console.log("[dry-run] Would upsert", SHARED_KVINNE_INSURANCE_ID);
    return;
  }

  await sanityClient.createOrReplace(doc as any);
  console.log("✓ Shared kvinnehelse insurance collection upserted");
}

async function patchCtaCollection() {
  if (DRY_RUN) {
    console.log("[dry-run] Would patch Graviditet CTA collection");
    return;
  }
  await sanityClient
    .patch(CTA_COLLECTION_ID)
    .set({
      title: i18nString(
        "Bestill time hos spesialist",
        "Book an appointment with a specialist",
      ),
      subtitle: i18nText(
        "Velg tjeneste, klinikk og behandler – alt i én enkel bestilling.",
        "Choose service, clinic and clinician – all in one simple booking.",
      ),
      primaryLabel: i18nString("Bestill time nå", "Book now"),
      primaryPath: "/booking?kategori=graviditet",
      secondaryLabel: i18nString("Ring oss", "Call us"),
      showSecondaryButton: true,
      quickInfoItems: [
        {
          _key: "clock",
          icon: "clock",
          text: i18nString(
            "Ledig time innen 1–3 dager",
            "Available appointments within 1–3 days",
          ),
        },
        {
          _key: "shield",
          icon: "shield",
          text: i18nString(
            "Ingen henvisning nødvendig",
            "No referral needed",
          ),
        },
      ],
    })
    .commit({ autoGenerateArrayKeys: true });
  console.log("✓ Graviditet CTA collection updated");
}

async function patchDoc(docId: string) {
  const current = await sanityClient.fetch<{
    landingPage?: Record<string, any>;
    pageSections?: Array<Record<string, any>>;
    faqSectionDescription?: unknown;
  } | null>(
    `*[_id == $id][0]{ landingPage, pageSections, faqSectionDescription }`,
    { id: docId },
  );

  if (!current?.landingPage) {
    throw new Error(`ABORT: ${docId}.landingPage missing`);
  }

  const lp = current.landingPage;
  const areas = Array.isArray(lp.expertAreasSection?.areas)
    ? lp.expertAreasSection.areas.map((area: any) => {
        const titleNo = Array.isArray(area.title)
          ? area.title.find((t: any) => t.language === "no")?.value
          : "";
        if (
          titleNo === "Tidlig ultralyd" ||
          area._key === "e1" ||
          (typeof area.href === "string" && area.href.includes("/ultralyd"))
        ) {
          return {
            ...area,
            title: i18nString("Ultralyd i svangerskapet", "Pregnancy ultrasound"),
          };
        }
        return area;
      })
    : lp.expertAreasSection?.areas;

  const whySteps = Array.isArray(lp.whySection?.steps)
    ? lp.whySection.steps.map((step: any) => {
        if (step.number === "03" || step._key === "w3") {
          return {
            ...step,
            number: "03",
            title: i18nString("Også der det er vanskelig", "Also when it is difficult"),
            description: i18nText(
              "Du skal kjenne deg trygg, sett og fulgt opp — fra det første hjerteslaget. Behovene kan være mange — som endringer i parforholdet, psykiske utfordringer eller fysiske plager — våre spesialister er her for deg.",
              "You should feel safe, seen and supported — from the first heartbeat. Needs can be many — such as changes in the relationship, mental challenges or physical complaints — our specialists are here for you.",
            ),
          };
        }
        return step;
      })
    : lp.whySection?.steps;

  const landingPage = {
    ...lp,
    expertAreasSection: {
      ...lp.expertAreasSection,
      title: i18nString(
        "Oppfølging gjennom hele svangerskapet — tilpasset din situasjon.",
        "Care throughout pregnancy — tailored to your situation.",
      ),
      description: i18nText(
        "Hos oss møter du jordmødre, gynekologer og fostermedisinere som har spesialisert seg dypt innenfor svangerskap og fødsel — uten omveier.",
        "With us you meet midwives, gynecologists and fetal medicine specialists who have specialised deeply in pregnancy and birth — without detours.",
      ),
      areas,
    },
    whySection: {
      ...lp.whySection,
      title: i18nString(
        "Trygghet hele veien — fra første kontroll til etter fødsel.",
        "Safety all the way — from the first check-up to after birth.",
      ),
      description: i18nText(
        "Hos CMedical får du et team som følger deg gjennom hele svangerskapet, ikke en ny behandler hver gang.",
        "At CMedical you get a team that follows you throughout pregnancy, not a new clinician every time.",
      ),
      steps: whySteps,
    },
    // Keep pregnancy FAQ early; specialists stay in pageSections (after journey via renderer).
    sectionOrder: lp.sectionOrder?.length
      ? lp.sectionOrder
      : ["segments", "faq", "why", "expertAreas", "services", "results", "reviews", "spotlight", "journey"],
  };

  const byType = (type: string) =>
    (current.pageSections || []).find((s) => s._type === type);

  const specialists =
    byType("pageSectionSpecialists") ||
    ({
      _key: "specialists-graviditet",
      _type: "pageSectionSpecialists",
      displayMode: "category",
      categorySlug: "gynekologi",
      limit: 24,
      variant: "carousel",
    } as Record<string, unknown>);

  const insuranceBase = byType("pageSectionInsurance") || {
    _key: "ps-insurance",
    _type: "pageSectionInsurance",
  };
  const { partners: _dropPartners, ...insuranceRest } = insuranceBase as Record<
    string,
    unknown
  > & { partners?: unknown };

  const ctaBase = byType("pageSectionBookingCta") || {
    _key: "booking-cta-graviditet",
    _type: "pageSectionBookingCta",
  };

  // Reference bottom bands: specialists → journey (renderer) → CTA → insurance
  const pageSections = [
    {
      ...specialists,
      _type: "pageSectionSpecialists",
      displayMode: specialists.displayMode || "category",
      categorySlug: specialists.categorySlug || "gynekologi",
      limit: typeof specialists.limit === "number" ? specialists.limit : 24,
      variant: specialists.variant || "carousel",
      title:
        specialists.title ||
        i18nString(
          "Jordmødre og spesialistene som følger deg.",
          "The midwives and specialists who support you.",
        ),
      description:
        specialists.description ||
        i18nText(
          "Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.",
          "Experience, specialist expertise and modern technology in one place.",
        ),
    },
    {
      ...ctaBase,
      _type: "pageSectionBookingCta",
      ctaCollection: {
        _type: "reference",
        _ref: CTA_COLLECTION_ID,
      },
      title: i18nString(
        "Bestill time hos spesialist",
        "Book an appointment with a specialist",
      ),
      subtitle: i18nString(
        "Velg tjeneste, klinikk og behandler – alt i én enkel bestilling.",
        "Choose service, clinic and clinician – all in one simple booking.",
      ),
      primaryLabel: i18nString("Bestill time nå", "Book now"),
      primaryPath: "/booking?kategori=graviditet",
      showSecondaryButton: true,
      secondaryLabel: i18nString("Ring oss", "Call us"),
      bookingCategory: {
        _type: "reference",
        _ref: DOC_ID,
      },
    },
    {
      ...insuranceRest,
      _type: "pageSectionInsurance",
      eyebrow: i18nString("Forsikringspartnere", "Insurance partners"),
      title: i18nString(
        "Vi har avtale med de største forsikringsselskapene i Norge.",
        "We have agreements with the largest insurance companies in Norway.",
      ),
      insuranceCollection: {
        _type: "reference",
        _ref: SHARED_KVINNE_INSURANCE_ID,
      },
    },
  ];

  const coreTypes = new Set([
    "pageSectionSpecialists",
    "pageSectionInsurance",
    "pageSectionBookingCta",
  ]);
  for (const section of current.pageSections || []) {
    if (!coreTypes.has(section._type)) pageSections.push(section);
  }

  const faqSectionDescription = i18nText(
    "Mange spørsmål dukker opp i et svangerskap. Her har vi samlet de vanligste — så du raskt finner svaret som er relevant for akkurat deg.",
    "Many questions arise during pregnancy. Here we have gathered the most common ones — so you quickly find the answer that is relevant for you.",
  );

  if (DRY_RUN) {
    console.log(`[dry-run] Would patch ${docId}`);
    console.log("  FAQ description cleaned");
    console.log("  expert title + Ultralyd card");
    console.log("  why 03 → reference copy");
    console.log("  insurance →", SHARED_KVINNE_INSURANCE_ID);
    console.log("  CTA → Bestill time hos spesialist");
    return;
  }

  await sanityClient
    .patch(docId)
    .set({
      landingPage,
      pageSections,
      faqSectionDescription,
      faqSectionTitle: i18nString(
        "Det du lurer på — fordelt så det er enkelt å finne.",
        "What you are wondering — organised so it is easy to find.",
      ),
      faqOpenFirst: true,
    })
    .commit({ autoGenerateArrayKeys: true });

  console.log(`✓ Patched ${docId}`);
}

/** Point Gynekologi at the same shared kvinnehelse insurance pack. */
async function wireGynekologiSharedInsurance() {
  const gynId = "category-gynekologi";
  const current = await sanityClient.fetch<{
    pageSections?: Array<Record<string, any>>;
  } | null>(`*[_id == $id][0]{ pageSections }`, { id: gynId });

  if (!current?.pageSections) {
    console.warn("⚠ category-gynekologi missing pageSections — skip");
    return;
  }

  const pageSections = current.pageSections.map((section) => {
    if (section._type !== "pageSectionInsurance") return section;
    const { partners: _drop, ...rest } = section as Record<string, unknown> & {
      partners?: unknown;
    };
    return {
      ...rest,
      _type: "pageSectionInsurance",
      title:
        rest.title ||
        i18nString(
          "Vi har avtale med de største forsikringsselskapene i Norge.",
          "We have agreements with the largest insurance companies in Norway.",
        ),
      insuranceCollection: {
        _type: "reference",
        _ref: SHARED_KVINNE_INSURANCE_ID,
      },
    };
  });

  if (DRY_RUN) {
    console.log("[dry-run] Would wire Gynekologi → shared kvinnehelse insurance");
    return;
  }

  await sanityClient.patch(gynId).set({ pageSections }).commit();
  const draft = await sanityClient.fetch<string | null>(`*[_id == $id][0]._id`, {
    id: `drafts.${gynId}`,
  });
  if (draft) await sanityClient.patch(draft).set({ pageSections }).commit();
  console.log("✓ Wired category-gynekologi → shared kvinnehelse insurance");
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  console.log("▶ Graviditet parity patch");
  console.log(`  project=${PROJECT_ID} dataset=${DATASET} dryRun=${DRY_RUN}`);

  await ensureSharedKvinneInsurance();
  await patchCtaCollection();
  await patchDoc(DOC_ID);

  const draftExists = await sanityClient.fetch<string | null>(
    `*[_id == $id][0]._id`,
    { id: DRAFT_ID },
  );
  if (draftExists) await patchDoc(DRAFT_ID);

  await wireGynekologiSharedInsurance();

  if (DRY_RUN) return;

  const verify = await sanityClient.fetch(
    `*[_id == $id][0]{
      "expertTitle": landingPage.expertAreasSection.title[language=="no"][0].value,
      "experts": landingPage.expertAreasSection.areas[]{ "t": title[language=="no"][0].value },
      "why03": landingPage.whySection.steps[number=="03"][0].description[language=="no"][0].value,
      "faqDesc": faqSectionDescription[language=="no"][0].value,
      faqOpenFirst,
      "pageSections": pageSections[]{
        _type,
        "titleNo": title[language=="no"][0].value,
        "insColl": insuranceCollection._ref,
        "ctaColl": ctaCollection._ref
      }
    }`,
    { id: DOC_ID },
  );
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
