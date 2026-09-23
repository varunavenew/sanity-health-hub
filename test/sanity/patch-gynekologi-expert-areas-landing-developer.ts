#!/usr/bin/env npx tsx
/**
 * (#296) Gynekologi landing expert areas —
 * replace Urogynekologi with Fremfall, add PMOS, PMS/PMDD, Blødningsforstyrrelser.
 *
 * Developer:
 *   cd test && npx tsx sanity/patch-gynekologi-expert-areas-landing-developer.ts
 *   cd test && DRY_RUN=1 npx tsx sanity/patch-gynekologi-expert-areas-landing-developer.ts
 *
 * Production (use FORCE so .env.local cannot win):
 *   cd test && SANITY_DATASET_FORCE=production ALLOW_PRODUCTION_MIGRATION=true DRY_RUN=1 \
 *     npx tsx sanity/patch-gynekologi-expert-areas-landing-developer.ts
 *   cd test && SANITY_DATASET_FORCE=production ALLOW_PRODUCTION_MIGRATION=true \
 *     npx tsx sanity/patch-gynekologi-expert-areas-landing-developer.ts
 *
 * Loads repo-root `.env.local` for SANITY_TOKEN only — never overrides CLI dataset env.
 */
import { config as loadEnv } from "dotenv";
import path from "path";

const rootEnv = loadEnv({
  path: path.join(process.cwd(), "..", ".env.local"),
  override: false,
});
// Prefer root token when test/.env.local has a stale/placeholder token
const rootToken = rootEnv.parsed?.SANITY_TOKEN?.trim();
if (rootToken && (!process.env.SANITY_TOKEN || process.env.SANITY_TOKEN.length < 40)) {
  process.env.SANITY_TOKEN = rootToken;
}

// require after env load (import would hoist before token fix)
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { DATASET, PROJECT_ID, sanityClient } = require("./config") as typeof import("./config");

const DRY_RUN = process.env.DRY_RUN === "1";
const DOC_ID = "category-gynekologi";

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

type AreaInput = {
  _key: string;
  titleNo: string;
  titleEn: string;
  descNo: string;
  descEn: string;
  href: string;
  /** Match existing card by NO title substring, or by href slug */
  match?: { titleIncludes?: string; hrefIncludes?: string };
};

const DESIRED: AreaInput[] = [
  {
    _key: "e1",
    titleNo: "Endometriose og adenomyose",
    titleEn: "Endometriosis and adenomyosis",
    descNo:
      "Vi er ledende i Nord-Europa på endometriosebehandling med robotassistert kirurgi — også de kompliserte tilfellene.",
    descEn:
      "We are leaders in Northern Europe in endometriosis treatment with robot-assisted surgery — including complex cases.",
    href: "/gynekologi/endometriose",
    match: { titleIncludes: "Endometriose", hrefIncludes: "endometriose" },
  },
  {
    _key: "e2",
    titleNo: "Urinlekkasje",
    titleEn: "Urinary leakage",
    descNo:
      "Fra rifter til urinlekkasje — vi behandler både i samtale og kirurgisk når det trengs. Du fortjener å bli hørt.",
    descEn:
      "From tears to urinary leakage — we treat through conversation and surgery when needed. You deserve to be heard.",
    href: "/gynekologi/urinlekkasje",
    match: { titleIncludes: "Urinlekkasje", hrefIncludes: "urinlekkasje" },
  },
  {
    _key: "e3",
    titleNo: "Overgangsalder",
    titleEn: "Menopause",
    descNo:
      "Trygg og oppdatert hormonbehandling — basert på din historie og dine ønsker. Vi tar oss tid til samtalen.",
    descEn:
      "Safe, up-to-date hormone therapy — based on your history and wishes. We take time for the conversation.",
    href: "/gynekologi/overgangsalder",
    match: { titleIncludes: "Overgangsalder", hrefIncludes: "overgangsalder" },
  },
  {
    _key: "e4",
    titleNo: "Vulvalidelser og vulvodyni",
    titleEn: "Vulvar disorders and vulvodynia",
    descNo:
      "Smerter og ubehag i vulva blir ofte oversett. Hos oss møter du spesialister som forstår — og finner svar.",
    descEn:
      "Vulvar pain and discomfort is often overlooked. Here you meet specialists who understand — and find answers.",
    href: "/gynekologi/vulvalidelser",
    match: { titleIncludes: "Vulva", hrefIncludes: "vulva" },
  },
  {
    _key: "e5",
    titleNo: "Fremfall",
    titleEn: "Prolapse",
    descNo:
      "Vaginalt fremfall (prolaps) er når skjedeveggen, livmoren eller livmorhalsen synker ned i eller ut av skjeden.",
    descEn:
      "Pelvic organ prolapse is when the vaginal wall, uterus or cervix descends into or out of the vagina.",
    href: "/gynekologi/vaginale-fremfall",
    match: { titleIncludes: "fremfall", hrefIncludes: "fremfall" },
  },
  {
    _key: "e6",
    titleNo: "PMOS",
    titleEn: "PMOS",
    descNo:
      "Hormonell ubalanse som påvirker syklus, hud, vekt og fertilitet — vi utreder og følger deg over tid.",
    descEn:
      "Hormonal imbalance that affects cycle, skin, weight and fertility — we assess and follow you over time.",
    href: "/gynekologi/pmos",
    match: { titleIncludes: "PMOS", hrefIncludes: "pcos" },
  },
  {
    _key: "e7",
    titleNo: "PMS / PMDD",
    titleEn: "PMS / PMDD",
    descNo:
      "Når premenstruelle plager tar over hverdagen — vi tar det på alvor og tilbyr moderne behandling.",
    descEn:
      "When premenstrual symptoms take over everyday life — we take it seriously and offer modern treatment.",
    href: "/gynekologi/pms-pmdd",
    match: { titleIncludes: "PMS", hrefIncludes: "pms-pmdd" },
  },
  {
    _key: "e8",
    titleNo: "Blødningsforstyrrelser",
    titleEn: "Bleeding disorders",
    descNo:
      "Kraftige, uregelmessige eller mellomblødninger utredes for å finne årsaken — ofte finnes det enkel behandling.",
    descEn:
      "Heavy, irregular or intermenstrual bleeding is investigated to find the cause — often with straightforward treatment.",
    href: "/gynekologi/blodningsforstyrrelser",
    match: { titleIncludes: "Blødning", hrefIncludes: "blodnings" },
  },
];

function titleNoOf(area: any): string {
  const arr = area?.title;
  if (!Array.isArray(arr)) return "";
  return (
    arr.find((t: any) => t.language === "no" || t._key === "no")?.value ||
    arr[0]?.value ||
    ""
  );
}

function findExisting(areas: any[], desired: AreaInput): any | undefined {
  const byTitle = areas.find((a) => {
    const t = titleNoOf(a).toLowerCase();
    const needle = desired.match?.titleIncludes?.toLowerCase();
    if (!needle) return false;
    if (t.includes(needle)) return true;
    // e2 may still be titled "Fødselsskader…" while linking to urinlekkasje
    if (desired._key === "e2" && (t.includes("fødselsskader") || t.includes("bekkenbunn"))) {
      return true;
    }
    // Ticket #416 — live card may still be titled PCOS while canonical NO slug is pmos.
    if (desired._key === "e6" && (t.includes("pmos") || t.includes("pcos"))) {
      return true;
    }
    return false;
  });
  if (byTitle) return byTitle;
  const byHref = areas.find((a) => {
    const href = String(a?.href || "").toLowerCase();
    const needle = desired.match?.hrefIncludes?.toLowerCase();
    if (!needle) return false;
    if (href.includes(needle)) return true;
    if (desired._key === "e6" && (href.includes("pmos") || href.includes("pcos"))) {
      return true;
    }
    return false;
  });
  return byHref;
}

/** Prefer urogynekologi card as the Fremfall replacement when both exist. */
function findFremfallSource(areas: any[]): any | undefined {
  const uro = areas.find((a) => {
    const t = titleNoOf(a).toLowerCase();
    const href = String(a?.href || "").toLowerCase();
    return t.includes("urogyn") || href.includes("urogynekologi");
  });
  if (uro) return uro;
  return findExisting(areas, DESIRED[4]);
}

async function heroImageBySlug(slug: string): Promise<any | null> {
  const image = await sanityClient.fetch(
    `*[_type=="treatment" && (
      slug.current == $slug ||
      slug[language=="no"][0].current == $slug ||
      _id == $id ||
      _id == $draftId
    )][0]{
      "image": coalesce(
        heroImage,
        layoutFlere.hero.image,
        pageContent.heroImage
      )
    }.image`,
    {
      slug,
      id: `treatment-gynekologi-${slug}`,
      draftId: `drafts.treatment-gynekologi-${slug}`,
    },
  );
  return image?.asset?._ref ? image : null;
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer" && DATASET !== "production") {
    throw new Error(`Refusing to run on dataset "${DATASET}".`);
  }
  if (DATASET === "production" && process.env.ALLOW_PRODUCTION_MIGRATION !== "true") {
    throw new Error(
      'Refusing production without ALLOW_PRODUCTION_MIGRATION=true. Use SANITY_DATASET_FORCE=production.',
    );
  }

  console.log("▶ Gynekologi expert areas landing patch (#296)");
  console.log(`  project=${PROJECT_ID} dataset=${DATASET} dryRun=${DRY_RUN}`);

  const current = await sanityClient.fetch<{
    landingPage?: { expertAreasSection?: { areas?: any[] } };
  } | null>(`*[_id == $id][0]{ landingPage }`, { id: DOC_ID });

  if (!current?.landingPage) {
    throw new Error(`ABORT: ${DOC_ID}.landingPage missing`);
  }

  const existingAreas = current.landingPage.expertAreasSection?.areas || [];
  console.log(
    `  existing: ${existingAreas.map((a) => titleNoOf(a) || a.href).join(" | ") || "(none)"}`,
  );

  const slugByKey: Record<string, string> = {
    e5: "vaginale-fremfall",
    e6: "pmos",
    e7: "pms-og-pmdd",
    e8: "blodningsforstyrrelser",
  };

  const built = [];
  for (const desired of DESIRED) {
    const source =
      desired._key === "e5"
        ? findFremfallSource(existingAreas)
        : findExisting(existingAreas, desired);

    let image = source?.image;
    if (!image && slugByKey[desired._key]) {
      image = await heroImageBySlug(slugByKey[desired._key]);
    }

    built.push({
      _key: source?._key || desired._key,
      _type: source?._type || "categoryLandingExpertArea",
      title: i18nString(desired.titleNo, desired.titleEn),
      description: i18nText(desired.descNo, desired.descEn),
      href: desired.href,
      ...(image ? { image, imageAlt: i18nString(desired.titleNo, desired.titleEn) } : {}),
    });
  }

  console.log(`  next: ${built.map((a) => a.title[0].value).join(" | ")}`);

  if (DRY_RUN) {
    console.log("DRY_RUN — no write");
    return;
  }

  await sanityClient
    .patch(DOC_ID)
    .set({ "landingPage.expertAreasSection.areas": built })
    .commit({ autoGenerateArrayKeys: false });

  // Keep draft in sync when present
  const draftId = `drafts.${DOC_ID}`;
  const draftExists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
    id: draftId,
  });
  if (draftExists) {
    await sanityClient
      .patch(draftId)
      .set({ "landingPage.expertAreasSection.areas": built })
      .commit({ autoGenerateArrayKeys: false });
    console.log(`  also patched ${draftId}`);
  }

  const verify = await sanityClient.fetch(
    `*[_id==$id][0]{
      "areas": landingPage.expertAreasSection.areas[]{
        "titleNo": title[language=="no"][0].value,
        href,
        "hasImage": defined(image.asset)
      }
    }`,
    { id: DOC_ID },
  );

  console.log("✓ Patched gynekologi expert areas on developer");
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
