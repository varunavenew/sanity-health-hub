#!/usr/bin/env npx tsx
/**
 * Developer-only: Save ortopedi treatment page content (all 5 pages).
 *
 * Source: avenewdemo extract + user HTML dump.
 * - Both NO and EN language fields populated (Norwegian text in both — editable in Studio)
 * - Paths never use /behandlinger — use /ortopedi/...
 * - Keeps insurance pageSection
 * - Promise images reused from fertility canonical assets
 *
 *   cd test && npx tsx sanity/patch-ortopedi-all-5-content-developer.ts
 *   DRY_RUN=1 npx tsx sanity/patch-ortopedi-all-5-content-developer.ts
 */
import { randomBytes } from "crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";

const CATEGORY_ID = "category-ortopedi";
const SEE_ALL_HREF = "/ortopedi";
const SEE_ALL_LABEL = "Se alle ortopedi-tjenester";

const IDS = {
  skulder: "treatment-ortopedi-skulder",
  kne: "treatment-ortopedi-kne",
  hofte: "treatment-ortopedi-hofte",
  "hand-albue": "treatment-ortopedi-hand-albue",
  "fot-ankel": "treatment-ortopedi-fot-ankel",
} as const;

const SPEC = {
  tom: "specialist-tom-henry-sundoen",
  marc: "specialist-marc-jacob-strauss",
  kristian: "specialist-kristian-marstrand-warholm",
  are: "specialist-are-haukaen-stodle",
  audun: "specialist-audun-hoegh-tangerud",
  bjorn: "specialist-bjorn-robstad",
  endre: "specialist-endre-soreide",
  gilbert: "specialist-gilbert-moatshe",
  istvan: "specialist-istvan-zoltan-rigo",
  jan: "specialist-jan-ragnar-haugstvedt",
  jonas: "specialist-jonas-rydinge",
  lars: "specialist-lars-eldar-myrseth",
  sondre: "specialist-sondre-hassellund",
  stig: "specialist-stig-hegna",
  tea: "specialist-tea-berge",
} as const;

/** Demo HTML order for hand-albue / fot-ankel (bundle had empty relatedSpecialists). */
const ORTOPEDI_TEAM = [
  SPEC.are,
  SPEC.audun,
  SPEC.bjorn,
  SPEC.endre,
  SPEC.gilbert,
  SPEC.istvan,
  SPEC.jan,
  SPEC.jonas,
  SPEC.kristian,
  SPEC.lars,
  SPEC.marc,
  SPEC.sondre,
  SPEC.stig,
  SPEC.tea,
  SPEC.tom,
] as const;

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
  heroPriceLabel?: string;
  reasonsLayout?: "prose" | "accordion" | "auto";
  reasons?: Reason[];
  midCtaTitle?: string;
};

type PageCfg = {
  id: string;
  slug: string;
  title: string;
  specialistIds: readonly string[];
  /** Order matches avenewdemo / user reference dump */
  relatedIds: string[];
};

const PAGES: PageCfg[] = [
  {
    id: IDS.skulder,
    slug: "skulder",
    title: "Skulder",
    specialistIds: [SPEC.tom],
    relatedIds: [IDS["fot-ankel"], IDS.hofte, IDS["hand-albue"], IDS.kne],
  },
  {
    id: IDS.kne,
    slug: "kne",
    title: "Kne",
    specialistIds: [SPEC.marc],
    relatedIds: [IDS["fot-ankel"], IDS.hofte, IDS["hand-albue"], IDS.skulder],
  },
  {
    id: IDS.hofte,
    slug: "hofte",
    title: "Hofte",
    specialistIds: [SPEC.kristian],
    relatedIds: [IDS["fot-ankel"], IDS["hand-albue"], IDS.kne, IDS.skulder],
  },
  {
    id: IDS["hand-albue"],
    slug: "hand-albue",
    title: "Hånd og albue",
    specialistIds: ORTOPEDI_TEAM,
    relatedIds: [IDS["fot-ankel"], IDS.hofte, IDS.kne, IDS.skulder],
  },
  {
    id: IDS["fot-ankel"],
    slug: "fot-ankel",
    title: "Fot og ankel",
    specialistIds: ORTOPEDI_TEAM,
    relatedIds: [IDS.hofte, IDS["hand-albue"], IDS.kne, IDS.skulder],
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
    seeAllHref: "/spesialister?kategori=ortopedi",
    seeAllLabel: i18nString("Se alle ortopeder"),
  };
}

function bookingSection() {
  return {
    _type: "pageSectionBookingCta",
    _key: "booking-cta-section",
    ctaCollection: {
      _type: "reference" as const,
      _ref: "migrated-cta-collection.da5deb1ad7a338f5",
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
    "_tmp-demo-ortopedi-content.json",
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
  const priceLabel =
    demo.heroPriceLabel ||
    ({
      skulder: "Konsultasjon ortoped skulder",
      kne: "Konsultasjon ortoped kne",
      hofte: "Konsultasjon ortoped hofte",
      "hand-albue": "Konsultasjon ortoped hånd",
      "fot-ankel": "Konsultasjon ortoped fot/ankel",
    } as Record<string, string>)[page.slug] ||
    "Konsultasjon ortoped";

  const patch: Record<string, unknown> = {
    title: i18nString(page.title),
    description: i18nText(heroLead),
    // FE prefers heroDescription over description — must be patient-facing hero lead
    heroDescription: i18nText(heroLead),
    heroTitle: i18nString(demo.heroTitle || page.title),
    heroPrice: i18nString(demo.heroPrice || "fra 1 800 kr"),
    heroPriceLabel: i18nString(priceLabel),
    heroPoints: heroPointChips(),
    primaryCtaLabel: i18nString("Se ledige tider og book"),
    callCtaLabel: i18nString("Ring oss"),
    hideSeePriser: true,
    reasonsTitle: i18nString(demo.reasonsTitle || `Om ${page.title.toLowerCase()}`),
    reasonsLead: reasonsLead ? i18nText(reasonsLead) : undefined,
    reasonsLayout: demo.reasonsLayout || "accordion",
    reasons,
    promises: promiseRows(),
    conversationCtaTitle: i18nString(
      demo.midCtaTitle || "Snakk med en av våre ortopeder",
    ),
    relatedSpecialists: refs(page.specialistIds),
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

  const unset = ["faqs", "faqCollection", "faqSectionTitle"];

  console.log(
    `  reasons=${reasons.length} related=${page.relatedIds.length} specialists=${page.specialistIds.length} priceLabel="${priceLabel}" hero="${heroLead.slice(0, 48)}…"`,
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

  const allSpecIds = [...new Set(PAGES.flatMap((p) => [...p.specialistIds]))];
  for (const id of allSpecIds) {
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

  console.log("\n✓ Ortopedi 5-page content patched on developer");
  console.log(
    JSON.stringify(
      {
        dataset: DATASET,
        dryRun: DRY_RUN,
        pages: PAGES.map((p) => p.slug),
        note: "NO+EN = Norwegian; paths use /ortopedi (no /behandlinger); insurance kept",
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
