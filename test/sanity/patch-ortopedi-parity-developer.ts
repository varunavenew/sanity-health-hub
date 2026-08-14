#!/usr/bin/env npx tsx
/**
 * Developer-only: Ortopedi category parity vs avenewdemo `/ortopedi`.
 *
 * - Correct hero image (ortopedi-real.jpg — person with blanket)
 * - Hero copy / 2 bullets / italic emphasis line breaks
 * - Expert intro heading parity
 * - Manual specialists (15 ordered; excludes test "rahul kumar")
 * - Clear FAQ
 * - Shared Insurance Collection (treatment.9eb095… — 8 partners)
 * - Shared Ortopedi CTA Collection
 *
 *   cd test && npx tsx sanity/patch-ortopedi-parity-developer.ts
 */
import * as fs from "fs";
import * as path from "path";
import { randomBytes } from "crypto";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const DOC_ID = "category-ortopedi";
const DRAFT_ID = "drafts.category-ortopedi";

/** Exact reference specialist set / order (15). */
const SPECIALIST_IDS = [
  "specialist-are-haukaen-stodle",
  "specialist-audun-hoegh-tangerud",
  "specialist-bjorn-robstad",
  "specialist-endre-soreide",
  "specialist-gilbert-moatshe",
  "specialist-istvan-zoltan-rigo",
  "specialist-jan-ragnar-haugstvedt",
  "specialist-jonas-rydinge",
  "specialist-kristian-marstrand-warholm",
  "specialist-lars-eldar-myrseth",
  "specialist-marc-jacob-strauss",
  "specialist-sondre-hassellund",
  "specialist-stig-hegna",
  "specialist-tea-berge",
  "specialist-tom-henry-sundoen",
] as const;

/** Shared pack already used by many treatment docs — correct 8 partners. */
const SHARED_INSURANCE_COLLECTION_ID =
  "migrated-insurance-collection.treatment.9eb09505654235fa";

/** Shared Ortopedi Booking CTA pack. */
const SHARED_CTA_COLLECTION_ID = "migrated-cta-collection.da5deb1ad7a338f5";

const HERO_ASSET_RELATIVE = "categories/ortopedi-real.jpg";
const ASSETS_DIR = path.resolve(__dirname, "../../src/assets");

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

function refKey(): string {
  return randomBytes(6).toString("hex");
}

function refs(ids: readonly string[]) {
  return ids.map((id) => ({
    _type: "reference" as const,
    _ref: id,
    _key: refKey(),
  }));
}

async function uploadHeroImage(): Promise<{
  _type: "image";
  asset: { _type: "reference"; _ref: string };
} | null> {
  const fullPath = path.join(ASSETS_DIR, HERO_ASSET_RELATIVE);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Hero asset missing: ${fullPath}`);
  }
  const buffer = fs.readFileSync(fullPath);
  console.log(`  📸 Uploading ${HERO_ASSET_RELATIVE}…`);
  const asset = await sanityClient.assets.upload("image", buffer, {
    filename: "ortopedi-hero-real.jpg",
    contentType: "image/jpeg",
  });
  return {
    _type: "image",
    asset: { _type: "reference", _ref: asset._id },
  };
}

async function ensureSharedCollections() {
  // Ensure shared insurance pack has a proper heading + editor label.
  await sanityClient
    .patch(SHARED_INSURANCE_COLLECTION_ID)
    .set({
      internalName: "Standard category insurance partners",
      title: i18nString(
        "Vi har avtale med de største forsikringsselskapene i Norge.",
        "We have agreements with the largest insurance companies in Norway.",
      ),
      description:
        "Shared partner pack for Ortopedi / Urologi / matching treatment pages (Gjensidige → Eika).",
    })
    .commit();

  // Align Ortopedi CTA subtitle with live reference wording ("bestilling").
  await sanityClient
    .patch(SHARED_CTA_COLLECTION_ID)
    .set({
      subtitle: i18nText(
        "Velg tjeneste, klinikk og behandler – alt i én enkel bestilling.",
        "Choose service, clinic and clinician – all in one simple booking.",
      ),
      primaryPath: "/booking?kategori=ortopedi",
    })
    .commit();

  console.log("✓ Shared insurance + Ortopedi CTA collections updated");
}

async function patchDoc(
  docId: string,
  heroImage: {
    _type: "image";
    asset: { _type: "reference"; _ref: string };
  },
) {
  const current = await sanityClient.fetch<{
    landingPage?: Record<string, any>;
    pageSections?: Array<Record<string, any>>;
  } | null>(`*[_id == $id][0]{ landingPage, pageSections }`, { id: docId });

  if (!current?.landingPage) {
    throw new Error(`ABORT: ${docId}.landingPage missing`);
  }

  const lp = current.landingPage;
  const hero = lp.hero || {};

  const nextHero = {
    ...hero,
    heading: i18nString("Det gjør vondt.", "It hurts."),
    headingEmphasis: i18nString(
      "La oss finne\nut hvorfor.",
      "Let's find out\nwhy.",
    ),
    body: i18nText(
      "Våre ortopeder er eksperter på skader og sykdommer i muskler, bein, ledd og sener. Noen av landets fremste kirurger jobber hos oss — også med second opinion.",
      "Our orthopaedic specialists are experts in injuries and conditions affecting muscles, bones, joints and tendons. Some of the country's leading surgeons work with us — including for second opinions.",
    ),
    bullets: [
      {
        _key: "b1",
        _type: "heroBulletItem",
        title: i18nString("Ingen henvisning", "No referral needed"),
      },
      {
        _key: "b2",
        _type: "heroBulletItem",
        title: i18nString("Korte ventetider", "Short waiting times"),
      },
    ],
    primaryCtaLabel: i18nString("Bestill ortopedtime", "Book orthopaedic appointment"),
    secondaryCtaLabel: i18nString("Ring oss", "Call us"),
    heroImageAlt: i18nString("Ortopedi hos CMedical", "Orthopaedics at CMedical"),
  };

  const expertAreasSection = {
    ...lp.expertAreasSection,
    title: i18nString(
      "Utredning og behandling — fra vondt til full funksjon.",
      "Assessment and treatment — from pain to full function.",
    ),
    description: i18nText(
      "Hos oss møter du ortopeder som har spesialisert seg dypt innenfor sitt fagfelt — fra skulder og kne til hånd og fot.",
      "With us you meet orthopaedic specialists who have specialised deeply in their field — from shoulder and knee to hand and foot.",
    ),
  };

  const byType = (type: string) =>
    (current.pageSections || []).find((s) => s._type === type);

  const specialistsBase = byType("pageSectionSpecialists") || {
    _key: "ps-spec",
    _type: "pageSectionSpecialists",
  };

  const insuranceBase = byType("pageSectionInsurance") || {
    _key: "ps-insurance",
    _type: "pageSectionInsurance",
  };
  const { partners: _dropPartners, ...insuranceRest } = insuranceBase as Record<
    string,
    unknown
  > & { partners?: unknown };

  const ctaBase = byType("pageSectionBookingCta") || {
    _key: "ps-cta",
    _type: "pageSectionBookingCta",
  };

  const pageSections = [
    {
      ...specialistsBase,
      _type: "pageSectionSpecialists",
      displayMode: "manual",
      categorySlug: "ortopedi",
      variant: specialistsBase.variant || "carousel",
      limit: 15,
      specialists: refs(SPECIALIST_IDS),
      title: i18nString(
        "Ortopedene som følger deg.",
        "The orthopaedic specialists who support you.",
      ),
      description: i18nText(
        "Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.",
        "Experience, specialist expertise and modern technology in one place.",
      ),
      seeAllLabel: i18nString("Se alle ortopeder", "See all orthopaedic specialists"),
      seeAllHref: "/spesialister?kategori=ortopedi",
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
        _ref: SHARED_INSURANCE_COLLECTION_ID,
      },
    },
    {
      ...ctaBase,
      _type: "pageSectionBookingCta",
      ctaCollection: {
        _type: "reference",
        _ref: SHARED_CTA_COLLECTION_ID,
      },
      // Keep lightweight inline fallbacks if collection is unavailable.
      title: i18nString(
        "Bestill time hos spesialist",
        "Book an appointment with a specialist",
      ),
      subtitle: i18nString(
        "Velg tjeneste, klinikk og behandler – alt i én enkel bestilling.",
        "Choose service, clinic and clinician – all in one simple booking.",
      ),
      primaryLabel: i18nString("Bestill time nå", "Book now"),
      primaryPath: "/booking?kategori=ortopedi",
      showSecondaryButton: true,
      secondaryLabel: i18nString("Ring oss", "Call us"),
      bookingCategory: {
        _type: "reference",
        _ref: DOC_ID,
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

  const landingPage = {
    ...lp,
    hero: nextHero,
    expertAreasSection,
  };

  const heroMedia = {
    _type: "media",
    mediaType: "image",
    image: heroImage,
  };

  if (DRY_RUN) {
    console.log(`[dry-run] Would patch ${docId}`);
    console.log("  hero:", HERO_ASSET_RELATIVE);
    console.log("  specialists:", SPECIALIST_IDS.length, "manual");
    console.log("  insurance →", SHARED_INSURANCE_COLLECTION_ID);
    console.log("  cta →", SHARED_CTA_COLLECTION_ID);
    return;
  }

  await sanityClient
    .patch(docId)
    .set({
      landingPage,
      pageSections,
      faqs: [],
      heroImage,
      heroMedia,
      heroMediaType: "image",
    })
    .unset(["faqCollection", "faqSectionTitle", "faqSectionDescription"])
    .commit({ autoGenerateArrayKeys: true });

  console.log(`✓ Patched ${docId}`);
}

/** Point Urologi at the same shared insurance pack (partners already match). */
async function wireUrologiSharedInsurance() {
  const uroId = "category-urologi";
  const current = await sanityClient.fetch<{
    pageSections?: Array<Record<string, any>>;
  } | null>(`*[_id == $id][0]{ pageSections }`, { id: uroId });

  if (!current?.pageSections) {
    console.warn("⚠ category-urologi missing pageSections — skip shared insurance wire");
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
        _ref: SHARED_INSURANCE_COLLECTION_ID,
      },
    };
  });

  if (DRY_RUN) {
    console.log("[dry-run] Would wire Urologi → shared insurance collection");
    return;
  }

  await sanityClient.patch(uroId).set({ pageSections }).commit();
  const draft = await sanityClient.fetch<string | null>(`*[_id == $id][0]._id`, {
    id: `drafts.${uroId}`,
  });
  if (draft) {
    await sanityClient.patch(draft).set({ pageSections }).commit();
  }
  console.log("✓ Wired category-urologi → shared insurance collection");
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  console.log("▶ Ortopedi parity patch");
  console.log(`  project=${PROJECT_ID} dataset=${DATASET} dryRun=${DRY_RUN}`);

  if (DRY_RUN) {
    await patchDoc(DOC_ID, {
      _type: "image",
      asset: { _type: "reference", _ref: "image-dry-run" },
    });
    await wireUrologiSharedInsurance();
    return;
  }

  const heroImage = await uploadHeroImage();
  if (!heroImage) throw new Error("Hero upload failed");

  await ensureSharedCollections();
  await patchDoc(DOC_ID, heroImage);

  const draftExists = await sanityClient.fetch<string | null>(
    `*[_id == $id][0]._id`,
    { id: DRAFT_ID },
  );
  if (draftExists) {
    await patchDoc(DRAFT_ID, heroImage);
  }

  await wireUrologiSharedInsurance();

  const verify = await sanityClient.fetch(
    `*[_id == $id][0]{
      "heroOrig": coalesce(heroMedia.image.asset->originalFilename, heroImage.asset->originalFilename),
      "heroUrl": coalesce(heroMedia.image.asset->url, heroImage.asset->url),
      "heading": landingPage.hero.heading[language=="no"][0].value,
      "emphasis": landingPage.hero.headingEmphasis[language=="no"][0].value,
      "bullets": landingPage.hero.bullets[]{ "t": title[language=="no"][0].value },
      "cta": landingPage.hero.primaryCtaLabel[language=="no"][0].value,
      "expertTitle": landingPage.expertAreasSection.title[language=="no"][0].value,
      "faqCollection": faqCollection,
      "faqs": count(faqs),
      "pageSections": pageSections[]{
        _type,
        displayMode,
        limit,
        "titleNo": title[language=="no"][0].value,
        "specCount": count(specialists),
        "insColl": insuranceCollection._ref,
        "ctaColl": ctaCollection._ref,
        "partners": partners[].label[language=="no"][0].value
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
