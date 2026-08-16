#!/usr/bin/env npx tsx
/**
 * Developer-only: Save urologi treatment page content (all 9 pages).
 *
 * Source: avenewdemo extract + user HTML dump.
 * - Both NO and EN language fields populated (Norwegian text in both — editable in Studio)
 * - Paths never use /behandlinger — use /urologi/...
 * - Keeps insurance pageSection (reference shows insurance on urologi treatments)
 * - Promise images reused from fertility canonical assets
 *
 *   cd test && npx tsx sanity/patch-urologi-all-9-content-developer.ts
 *   DRY_RUN=1 npx tsx sanity/patch-urologi-all-9-content-developer.ts
 */
import { randomBytes } from "crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";

const CATEGORY_ID = "category-urologi";
const SEE_ALL_HREF = "/urologi";
const SEE_ALL_LABEL = "Se alle urologi-tjenester";

const IDS = {
  blaere: "treatment-urologi-blaere",
  forhud: "treatment-urologi-forhud",
  infertilitet: "treatment-urologi-infertilitet",
  nyrer: "treatment-urologi-nyrer",
  prostata: "treatment-urologi-prostata",
  refertilisering: "treatment-urologi-refertilisering",
  robotkirurgi: "treatment-urologi-robotkirurgi",
  sterilisering: "treatment-urologi-sterilisering",
  testikler: "treatment-urologi-testikler",
} as const;

const SPEC = {
  trond: "specialist-trond-jorgensen",
  nabeel: "specialist-nabeel-yousaf-khan",
  bjorn: "specialist-bjorn-brennhovd",
  nicolai: "specialist-nicolai-wessel",
  thomas: "specialist-thomas-fredrik-thaulow",
} as const;

const PROMISE_IMAGES = {
  comfort: "image-dc7e9dd5ae34732d52edfae6e810af2ff0794983-1284x1920-webp",
  specialists: "image-79d70f57e26a3a54f724284879b6a83cb0fb22f7-1334x2000-jpg",
  sameRoof: "image-daf99994e94904484bd1e5200164387944b250ed-1420x1080-jpg",
} as const;

type Reason = { title: string; desc: string };
type DemoPage = {
  slug: string;
  heroTitle?: string;
  heroLead?: string;
  reasonsTitle?: string;
  reasonsLead?: string;
  aboutLead?: string;
  heroPrice?: string;
  reasons?: Reason[];
  midCtaTitle?: string;
};

type PageCfg = {
  id: string;
  slug: string;
  title: string;
  specialistIds: readonly string[];
  relatedIds: string[];
};

const ALL_IDS = Object.values(IDS);

const PAGES: PageCfg[] = [
  {
    id: IDS.blaere,
    slug: "blaere",
    title: "Blære og urinveier",
    specialistIds: [SPEC.trond],
    relatedIds: ALL_IDS.filter((id) => id !== IDS.blaere),
  },
  {
    id: IDS.forhud,
    slug: "forhud",
    title: "Forhud",
    specialistIds: [SPEC.trond],
    relatedIds: ALL_IDS.filter((id) => id !== IDS.forhud),
  },
  {
    id: IDS.infertilitet,
    slug: "infertilitet",
    title: "Mannlig infertilitet",
    specialistIds: [SPEC.trond],
    relatedIds: ALL_IDS.filter((id) => id !== IDS.infertilitet),
  },
  {
    id: IDS.nyrer,
    slug: "nyrer",
    title: "Nyrer",
    specialistIds: [SPEC.nabeel],
    relatedIds: ALL_IDS.filter((id) => id !== IDS.nyrer),
  },
  {
    id: IDS.prostata,
    slug: "prostata",
    title: "Prostata",
    specialistIds: [SPEC.trond],
    relatedIds: ALL_IDS.filter((id) => id !== IDS.prostata),
  },
  {
    id: IDS.refertilisering,
    slug: "refertilisering",
    title: "Refertilisering",
    specialistIds: [SPEC.nabeel],
    relatedIds: ALL_IDS.filter((id) => id !== IDS.refertilisering),
  },
  {
    id: IDS.robotkirurgi,
    slug: "robotkirurgi",
    title: "Robotassistert kirurgi",
    specialistIds: [SPEC.bjorn, SPEC.nicolai, SPEC.thomas],
    relatedIds: ALL_IDS.filter((id) => id !== IDS.robotkirurgi),
  },
  {
    id: IDS.sterilisering,
    slug: "sterilisering",
    title: "Sterilisering",
    specialistIds: [SPEC.nabeel, SPEC.trond],
    relatedIds: ALL_IDS.filter((id) => id !== IDS.sterilisering),
  },
  {
    id: IDS.testikler,
    slug: "testikler",
    title: "Testikler og pung",
    specialistIds: [SPEC.nabeel],
    relatedIds: ALL_IDS.filter((id) => id !== IDS.testikler),
  },
];

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

/** Both languages — Norwegian text (Studio-editable EN later). */
function i18nString(no: string) {
  return [
    {
      _key: "no",
      _type: "internationalizedArrayStringValue",
      language: "no",
      value: no,
    },
    {
      _key: "en",
      _type: "internationalizedArrayStringValue",
      language: "en",
      value: no,
    },
  ];
}

function i18nText(no: string) {
  return [
    {
      _key: "no",
      _type: "internationalizedArrayTextValue",
      language: "no",
      value: no,
    },
    {
      _key: "en",
      _type: "internationalizedArrayTextValue",
      language: "en",
      value: no,
    },
  ];
}

function promiseImage(assetId: string) {
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: assetId },
  };
}

function reasonRow(index: number, r: Reason) {
  const n = String(index + 1).padStart(2, "0");
  return {
    _key: refKey(),
    n: i18nString(n),
    title: i18nString(r.title),
    desc: i18nText(r.desc),
  };
}

function promiseRows() {
  return [
    {
      _key: refKey(),
      title: i18nString("Tilpasset dine behov"),
      desc: i18nText(
        "Alle undersøkelser og inngrep tilpasses dine behov og ønsker. Du kan stoppe når som helst, stille spørsmål underveis, og ta med noen om du ønsker det.",
      ),
      image: promiseImage(PROMISE_IMAGES.comfort),
    },
    {
      _key: refKey(),
      title: i18nString("Erfarne spesialister"),
      desc: i18nText(
        "Hos oss møter du leger som har spesialisert seg innenfor sitt fagfelt — ikke en generalist på utplassering. Du får riktig kompetanse fra første konsultasjon.",
      ),
      image: promiseImage(PROMISE_IMAGES.specialists),
    },
    {
      _key: refKey(),
      title: i18nString("Alt under samme tak"),
      desc: i18nText(
        "Trenger du videre utredning, behandling eller oppfølging — vi koordinerer hele forløpet for deg.",
      ),
      image: promiseImage(PROMISE_IMAGES.sameRoof),
    },
  ];
}

function heroPointChips() {
  return [
    { _key: refKey(), title: i18nString("Kort ventetid") },
    { _key: refKey(), title: i18nString("Ingen henvisning") },
  ];
}

function specialistsSection(specialistIds: readonly string[]) {
  return {
    _type: "pageSectionSpecialists",
    _key: "specialists-section",
    displayMode: "manual",
    variant: "carousel",
    title: i18nString("Spesialister som utfører dette"),
    specialists: refs(specialistIds),
    seeAllHref: "/spesialister?kategori=urologi",
    seeAllLabel: i18nString("Se alle urologer"),
  };
}

function bookingSection() {
  return {
    _type: "pageSectionBookingCta",
    _key: "booking-cta-section",
    ctaCollection: {
      _type: "reference" as const,
      _ref: "migrated-cta-collection.ec36560bac1e9191",
    },
    title: i18nString("Bestill time hos spesialist"),
    subtitle: i18nText(
      "Velg tjeneste, klinikk og behandler – alt i én enkel bestilling.",
    ),
    primaryLabel: i18nString("Bestill time nå"),
  };
}

function loadDemoPages(): Map<string, DemoPage> {
  const file = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "_tmp-demo-urologi-content.json",
  );
  if (!fs.existsSync(file)) return new Map();
  const raw = JSON.parse(fs.readFileSync(file, "utf8")) as {
    pages: DemoPage[];
  };
  const map = new Map<string, DemoPage>();
  for (const p of raw.pages || []) {
    if (p.slug) map.set(p.slug, p);
  }
  return map;
}

async function discardDraft(id: string) {
  const draftId = `drafts.${id}`;
  const exists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
    id: draftId,
  });
  if (exists) {
    if (!DRY_RUN) await sanityClient.delete(draftId);
    console.log(`  deleted ${draftId}`);
  }
}

async function patchPage(page: PageCfg, demo: DemoPage) {
  console.log(`\n→ ${page.slug}`);

  const exists = await sanityClient.fetch<string | null>(
    `*[_id==$id && !(_id in path("drafts.**"))][0]._id`,
    { id: page.id },
  );
  if (!exists) throw new Error(`Missing published treatment: ${page.id}`);

  const pageSections = await sanityClient.fetch<
    Array<Record<string, unknown> & { _type?: string; _key?: string }>
  >(`*[_id==$id][0].pageSections[]`, { id: page.id });

  if (!Array.isArray(pageSections)) {
    throw new Error(`pageSections missing on ${page.id}`);
  }

  // Keep insurance; refresh specialists + booking.
  const insurance = pageSections.find((s) => s._type === "pageSectionInsurance");
  const nextSections = [
    specialistsSection(page.specialistIds),
    ...(insurance ? [insurance] : []),
    bookingSection(),
  ];

  const reasons = (demo.reasons || []).map((r, i) => reasonRow(i, r));
  const reasonsLead = demo.reasonsLead || demo.aboutLead || "";

  const heroLead = demo.heroLead || "";

  const patch: Record<string, unknown> = {
    title: i18nString(page.title),
    description: i18nText(heroLead),
    // FE prefers heroDescription over description — must be patient-facing hero lead
    heroDescription: i18nText(heroLead),
    heroTitle: i18nString(demo.heroTitle || page.title),
    heroPrice: i18nString(demo.heroPrice || "fra 1 900 kr"),
    heroPriceLabel: i18nString(
      (demo as { heroPriceLabel?: string }).heroPriceLabel || "Konsultasjon urolog",
    ),
    heroPoints: heroPointChips(),
    primaryCtaLabel: i18nString("Se ledige tider og book"),
    callCtaLabel: i18nString("Ring oss"),
    hideSeePriser: true,
    reasonsTitle: i18nString(demo.reasonsTitle || `Om ${page.title.toLowerCase()}`),
    reasonsLead: reasonsLead ? i18nText(reasonsLead) : undefined,
    reasonsLayout: "accordion",
    reasons,
    promises: promiseRows(),
    conversationCtaTitle: i18nString(
      demo.midCtaTitle || "Snakk med en av våre urologer",
    ),
    relatedSection: {
      _type: "object",
      title: i18nString("Relaterte tjenester"),
      seeAllHref: SEE_ALL_HREF,
      seeAllLabel: i18nString(SEE_ALL_LABEL),
      asIntro: false,
      asServices: true,
      items: refs(page.relatedIds),
    },
    pageSections: nextSections,
    srOnlyTitle: i18nString(`${page.title} hos CMedical`),
    bookingService: page.slug,
  };

  // Clear FAQ only (keep insurance)
  const unset = ["faqs", "faqCollection", "faqSectionTitle"];

  console.log(
    `  reasons=${reasons.length} related=${page.relatedIds.length} specialists=${page.specialistIds.length} price="${demo.heroPrice || ""}" hero="${heroLead.slice(0, 48)}…"`,
  );

  if (!DRY_RUN) {
    let builder = sanityClient.patch(page.id).unset(unset).set(patch);
    if (!reasonsLead) {
      builder = builder.unset(["reasonsLead"]);
    }
    await builder.commit({ autoGenerateArrayKeys: true });
  }

  await discardDraft(page.id);
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  const demoMap = loadDemoPages();
  console.log(`Loaded ${demoMap.size} demo pages. DRY_RUN=${DRY_RUN}`);

  for (const id of Object.values(SPEC)) {
    const ok = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
      id,
    });
    if (!ok) throw new Error(`Missing specialist: ${id}`);
  }

  for (const page of PAGES) {
    const demo = demoMap.get(page.slug);
    if (!demo) throw new Error(`No demo content for ${page.slug}`);
    await patchPage(page, demo);
  }

  // Fix leftover /behandlinger see-all on urologi treatments
  const withBadSeeAll = await sanityClient.fetch<Array<{ _id: string }>>(
    `*[_type=="treatment" && references($cat) && relatedSection.seeAllHref match "/behandlinger*"]{_id}`,
    { cat: CATEGORY_ID },
  );
  for (const row of withBadSeeAll || []) {
    console.log(`\n→ fix seeAllHref on ${row._id}`);
    if (!DRY_RUN) {
      await sanityClient
        .patch(row._id)
        .set({ "relatedSection.seeAllHref": SEE_ALL_HREF })
        .commit();
      await discardDraft(row._id);
    }
  }

  console.log("\n✓ Urologi 9-page content patched on developer");
  console.log(
    JSON.stringify(
      {
        dataset: DATASET,
        dryRun: DRY_RUN,
        pages: PAGES.map((p) => p.slug),
        note: "NO+EN = Norwegian; paths use /urologi (no /behandlinger); insurance kept",
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
