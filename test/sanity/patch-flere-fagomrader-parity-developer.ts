#!/usr/bin/env npx tsx
/**
 * Developer-only: Flere fagområder (`/no/ovrige`) parity vs avenewdemo `/flere-fagomrader`.
 *
 * - Hero bullets (2), expert intro heading
 * - Populate whySection ("Nordens fremste spesialister…")
 * - Clear FAQ
 * - Manual specialists (19) incl. create Cennet + Mia
 * - Shared insurance + Flere CTA collections
 * - sectionOrder: expertAreas → results → reviews → why → specialists → journey
 *
 *   cd test && npx tsx sanity/patch-flere-fagomrader-parity-developer.ts
 */
import * as https from "https";
import { randomBytes } from "crypto";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const DOC_ID = "category-flere-fagomrader";
const DRAFT_ID = "drafts.category-flere-fagomrader";

const SHARED_INSURANCE_COLLECTION_ID =
  "migrated-insurance-collection.treatment.9eb09505654235fa";
const SHARED_CTA_COLLECTION_ID = "migrated-cta-collection.33ea61bd3190c308";

/** Exact reference order (19). */
const SPECIALIST_IDS = [
  "specialist-andreas-edenberg",
  "specialist-birgir-gudbrandsson",
  "specialist-cennet-akdeniz",
  "specialist-einar-andre-brevik",
  "specialist-erik-berg",
  "specialist-gunnar-dalen",
  "specialist-ingvild-skarpas-aannerud",
  "specialist-jan-roland-lambrecht",
  "specialist-jeanette-follestad",
  "specialist-kjersti-margrete-finsrud",
  "specialist-line-fusdahl-hulleberg",
  "specialist-linn-myrtveit-stensrud",
  "specialist-linnea-torsnes",
  "specialist-mari-borge-eskerud",
  "specialist-maria-thompson-clausen",
  "specialist-marian-bale",
  "specialist-marthe-hagen",
  "specialist-mia-kitter",
  "specialist-tonje-westlie",
] as const;

const SECTION_ORDER = [
  "segments",
  "audiences",
  "expertAreas",
  "symptoms",
  "services",
  "support",
  "results",
  "reviews",
  "why",
  "spotlight",
  "specialists",
  "journey",
] as const;

/** Card label overrides (role · subtitle) to match reference carousel. */
const CARD_LABELS: Record<string, { role: [string, string]; subtitle: [string, string] }> = {
  "specialist-ingvild-skarpas-aannerud": {
    role: ["Senior Osteopat", "Senior osteopath"],
    subtitle: ["Manuell behandling", "Manual therapy"],
  },
  "specialist-linnea-torsnes": {
    role: ["Hudhelse", "Skin health"],
    subtitle: ["Hudlege", "Dermatologist"],
  },
  "specialist-mari-borge-eskerud": {
    role: ["Ernæring", "Nutrition"],
    subtitle: ["Ernæringsfysiolog", "Clinical nutritionist"],
  },
  "specialist-maria-thompson-clausen": {
    role: ["Ernæring", "Nutrition"],
    subtitle: ["Ernæringsfysiolog", "Clinical nutritionist"],
  },
  "specialist-marian-bale": {
    role: ["Gastrokirurgi", "Gastrointestinal surgery"],
    subtitle: ["Gastrokirurg", "Gastrointestinal surgeon"],
  },
  "specialist-marthe-hagen": {
    role: ["Psykologi", "Psychology"],
    subtitle: ["Psykolog", "Psychologist"],
  },
  "specialist-tonje-westlie": {
    role: ["Fysioterapi", "Physiotherapy"],
    subtitle: ["Håndterapeut", "Hand therapist"],
  },
};

type I18nItem = {
  _type: string;
  _key: string;
  language: string;
  value: string | { _type: "slug"; current: string };
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

function i18nSlug(slug: string): I18nItem[] {
  return [
    {
      _type: "internationalizedArraySlugValue",
      _key: "no",
      language: "no",
      value: { _type: "slug", current: slug },
    },
    {
      _type: "internationalizedArraySlugValue",
      _key: "en",
      language: "en",
      value: { _type: "slug", current: slug },
    },
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

function download(url: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          download(res.headers.location).then(resolve, reject);
          return;
        }
        const chunks: Buffer[] = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

async function uploadFromUrl(url: string, filename: string) {
  const buffer = await download(url);
  const asset = await sanityClient.assets.upload("image", buffer, {
    filename,
    contentType: "image/png",
  });
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: asset._id },
  };
}

function specialty(no: string, en: string) {
  return {
    _type: "specialtyItem" as const,
    _key: `spec-${no.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}`,
    label: i18nString(no, en),
  };
}

async function ensureSpecialist(doc: Record<string, unknown>) {
  const id = doc._id as string;
  if (DRY_RUN) {
    console.log(`[dry-run] Would create/replace ${id}`);
    return;
  }
  await sanityClient.createOrReplace(doc as any);
  console.log(`✓ Specialist ${id}`);
}

async function ensureMissingSpecialists() {
  const cennetPhoto = DRY_RUN
    ? null
    : await uploadFromUrl(
        "https://avenewdemo.online/assets/cennet-akdeniz-DbWuwV1k.png",
        "cennet-akdeniz.png",
      );
  const miaPhoto = DRY_RUN
    ? null
    : await uploadFromUrl(
        "https://avenewdemo.online/assets/mia-kitter-KseS4Ami.png",
        "mia-kitter.png",
      );

  await ensureSpecialist({
    _id: "specialist-cennet-akdeniz",
    _type: "specialist",
    name: "Cennet Akdeniz",
    slug: i18nSlug("cennet-akdeniz"),
    role: i18nString("Endokrinolog", "Endocrinologist"),
    subtitle: i18nString("Indremedisin", "Internal medicine"),
    specialties: [
      specialty("Endokrinologi", "Endocrinology"),
      specialty("Indremedisin", "Internal medicine"),
    ],
    shortBio: i18nText(
      "Cennet Akdeniz er spesialist i endokrinologi og indremedisin.",
      "Cennet Akdeniz is a specialist in endocrinology and internal medicine.",
    ),
    languages: ["Norsk", "Engelsk"],
    bookingEnabled: true,
    bookingCategoryIds: [23],
    categories: [
      { _type: "reference", _ref: "category-flere-fagomrader", _key: "cat-flere" },
    ],
    clinics: [
      { _type: "reference", _ref: "clinicPage-majorstuen", _key: "clinic-majorstuen" },
    ],
    photo: cennetPhoto,
    seo: {
      _type: "seo",
      metaTitle: i18nString("Cennet Akdeniz | CMedical", "Cennet Akdeniz | CMedical"),
      metaDescription: i18nText(
        "Cennet Akdeniz er spesialist i endokrinologi og indremedisin ved CMedical.",
        "Cennet Akdeniz is a specialist in endocrinology and internal medicine at CMedical.",
      ),
    },
  });

  await ensureSpecialist({
    _id: "specialist-mia-kitter",
    _type: "specialist",
    name: "Mia Kitter",
    slug: i18nSlug("mia-kitter"),
    role: i18nString("Osteopati", "Osteopathy"),
    subtitle: i18nString("Osteopat", "Osteopath"),
    specialties: [specialty("Osteopati", "Osteopathy")],
    shortBio: i18nText(
      "Mia Kitter er osteopat ved CMedical.",
      "Mia Kitter is an osteopath at CMedical.",
    ),
    languages: ["Norsk", "Engelsk"],
    bookingEnabled: true,
    bookingCategoryIds: [23],
    categories: [
      { _type: "reference", _ref: "category-flere-fagomrader", _key: "cat-flere" },
    ],
    clinics: [
      { _type: "reference", _ref: "clinicPage-majorstuen", _key: "clinic-majorstuen" },
    ],
    photo: miaPhoto,
    seo: {
      _type: "seo",
      metaTitle: i18nString("Mia Kitter | CMedical", "Mia Kitter | CMedical"),
      metaDescription: i18nText(
        "Mia Kitter er osteopat ved CMedical.",
        "Mia Kitter is an osteopath at CMedical.",
      ),
    },
  });
}

async function patchCardLabels() {
  for (const [id, labels] of Object.entries(CARD_LABELS)) {
    if (DRY_RUN) {
      console.log(`[dry-run] card labels ${id}`);
      continue;
    }
    await sanityClient
      .patch(id)
      .set({
        role: i18nString(labels.role[0], labels.role[1]),
        subtitle: i18nString(labels.subtitle[0], labels.subtitle[1]),
      })
      .commit();
    console.log(`✓ Card labels ${id}`);
  }
}

async function ensureSharedCollections() {
  if (DRY_RUN) return;
  await sanityClient
    .patch(SHARED_CTA_COLLECTION_ID)
    .set({
      subtitle: i18nText(
        "Velg tjeneste, klinikk og behandler – alt i én enkel bestilling.",
        "Choose service, clinic and clinician – all in one simple booking.",
      ),
      primaryPath: "/booking?kategori=flere-fagomrader",
    })
    .commit();
  console.log("✓ Shared Flere CTA collection updated");
}

async function patchDoc(docId: string) {
  const current = await sanityClient.fetch<{
    landingPage?: Record<string, any>;
    pageSections?: Array<Record<string, any>>;
    heroImage?: unknown;
    heroMedia?: { image?: unknown };
  } | null>(`*[_id == $id][0]{ landingPage, pageSections, heroImage, heroMedia }`, {
    id: docId,
  });

  if (!current?.landingPage) {
    throw new Error(`ABORT: ${docId}.landingPage missing`);
  }

  const lp = current.landingPage;
  const hero = lp.hero || {};
  const heroImageRef =
    (current.heroMedia as any)?.image || current.heroImage || null;

  const nextHero = {
    ...hero,
    heading: i18nString("Spesialister", "Specialists"),
    headingEmphasis: i18nString("i team", "in teams"),
    body: i18nText(
      "Vi har samlet noen av Nordens fremste spesialister innen hud, psykologi, sexologi, ernæring og kirurgi. Spesialistene jobber i tverrfaglige team — og utelukkende med det de kan aller best.",
      "We have brought together some of the Nordic region's leading specialists in dermatology, psychology, sexology, nutrition and surgery. They work in cross-disciplinary teams — and focus exclusively on what they do best.",
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
    primaryCtaLabel: i18nString("Bestill time", "Book appointment"),
    secondaryCtaLabel: i18nString("Ring oss", "Call us"),
  };

  const expertAreasSection = {
    ...lp.expertAreasSection,
    title: i18nString(
      "Spesialister på tvers av fagfelt — samlet på ett sted.",
      "Specialists across disciplines — gathered in one place.",
    ),
    description: i18nText(
      "Hos oss møter du spesialister som har spesialisert seg dypt innenfor sitt fagfelt — og som samarbeider på tvers når det trengs.",
      "With us you meet specialists who have specialised deeply in their field — and collaborate across disciplines when needed.",
    ),
  };

  const whySection = {
    ...lp.whySection,
    title: i18nString(
      "Nordens fremste spesialister — samlet på ett sted.",
      "The Nordics' leading specialists — gathered in one place.",
    ),
    description: i18nText(
      "Vi har samlet noen av Nordens fremste spesialister innen blant annet gastrokirurgi, revmatologi, hudhelse, ernæringsfysiologi, osteopati, psykologi og sexologi.",
      "We have gathered some of the Nordic region's leading specialists in areas including gastrointestinal surgery, rheumatology, skin health, clinical nutrition, osteopathy, psychology and sexology.",
    ),
    steps: [
      {
        _key: "w1",
        _type: "categoryLandingStep",
        number: "01",
        title: i18nString("Alt under samme tak", "Everything under one roof"),
        description: i18nText(
          "Utredning, behandling og oppfølging på tvers av fagområder — du slipper å bli sendt videre.",
          "Assessment, treatment and follow-up across specialties — you do not get sent elsewhere.",
        ),
      },
      {
        _key: "w2",
        _type: "categoryLandingStep",
        number: "02",
        title: i18nString("Tverrfaglige team", "Cross-disciplinary teams"),
        description: i18nText(
          "Spesialistene samarbeider på tvers av fagfelt for å gi deg helhetlig og persontilpasset behandling.",
          "Specialists collaborate across fields to give you holistic, personalised care.",
        ),
      },
      {
        _key: "w3",
        _type: "categoryLandingStep",
        number: "03",
        title: i18nString("Rask hjelp", "Fast help"),
        description: i18nText(
          "Ingen henvisning og kort ventetid — de fleste får time innen en uke.",
          "No referral and short waiting times — most people get an appointment within a week.",
        ),
      },
    ],
    image: heroImageRef,
    imageAlt: i18nString(
      "Spesialister hos CMedical",
      "Specialists at CMedical",
    ),
    footerLinkLabel: i18nString("Les mer om klinikken", "Read more about the clinic"),
    footerLinkHref: "/klinikker",
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
      categorySlug: "flere-fagomrader",
      variant: specialistsBase.variant || "carousel",
      limit: 19,
      specialists: refs(SPECIALIST_IDS),
      title: i18nString(
        "Spesialistene som følger deg.",
        "The specialists who support you.",
      ),
      description: i18nText(
        "Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.",
        "Experience, specialist expertise and modern technology in one place.",
      ),
      seeAllLabel: i18nString("Se alle spesialister", "See all specialists"),
      seeAllHref: "/spesialister?kategori=flere-fagomrader",
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
      title: i18nString(
        "Bestill time hos spesialist",
        "Book an appointment with a specialist",
      ),
      subtitle: i18nString(
        "Velg tjeneste, klinikk og behandler – alt i én enkel bestilling.",
        "Choose service, clinic and clinician – all in one simple booking.",
      ),
      primaryLabel: i18nString("Bestill time nå", "Book now"),
      primaryPath: "/booking?kategori=flere-fagomrader",
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
    whySection,
    sectionOrder: [...SECTION_ORDER],
  };

  if (DRY_RUN) {
    console.log(`[dry-run] Would patch ${docId}`);
    console.log("  specialists:", SPECIALIST_IDS.length, "manual");
    console.log("  sectionOrder:", SECTION_ORDER.join(" → "));
    return;
  }

  await sanityClient
    .patch(docId)
    .set({
      landingPage,
      pageSections,
      faqs: [],
    })
    .unset(["faqCollection", "faqSectionTitle", "faqSectionDescription"])
    .commit({ autoGenerateArrayKeys: true });

  console.log(`✓ Patched ${docId}`);
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  console.log("▶ Flere fagområder parity patch");
  console.log(`  project=${PROJECT_ID} dataset=${DATASET} dryRun=${DRY_RUN}`);

  await ensureMissingSpecialists();
  await patchCardLabels();
  await ensureSharedCollections();
  await patchDoc(DOC_ID);

  const draftExists = await sanityClient.fetch<string | null>(
    `*[_id == $id][0]._id`,
    { id: DRAFT_ID },
  );
  if (draftExists) await patchDoc(DRAFT_ID);

  if (DRY_RUN) return;

  const verify = await sanityClient.fetch(
    `*[_id == $id][0]{
      "heading": landingPage.hero.heading[language=="no"][0].value,
      "emphasis": landingPage.hero.headingEmphasis[language=="no"][0].value,
      "bullets": landingPage.hero.bullets[]{ "t": title[language=="no"][0].value },
      "expertTitle": landingPage.expertAreasSection.title[language=="no"][0].value,
      "whyTitle": landingPage.whySection.title[language=="no"][0].value,
      "whySteps": count(landingPage.whySection.steps),
      "sectionOrder": landingPage.sectionOrder,
      "faqCollection": faqCollection,
      "faqs": count(faqs),
      "pageSections": pageSections[]{
        _type, displayMode, limit,
        "titleNo": title[language=="no"][0].value,
        "specCount": count(specialists),
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
