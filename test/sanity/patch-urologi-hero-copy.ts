#!/usr/bin/env npx tsx
/**
 * Restore urologi category hero copy to avenewdemo.
 * Writes production (Vercel) and developer.
 *
 *   cd test && npx tsx sanity/patch-urologi-hero-copy.ts
 */
import { createClient } from "@sanity/client";
import { config as loadEnv } from "dotenv";
import path from "path";

loadEnv({ path: path.join(process.cwd(), ".env.local") });
loadEnv({ path: path.join(process.cwd(), "..", ".env.local") });

const projectId =
  process.env.SANITY_PROJECT_ID?.trim() ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const token = process.env.SANITY_TOKEN?.trim();
if (!projectId || !token) throw new Error("Missing SANITY_PROJECT_ID / SANITY_TOKEN");

function client(dataset: "developer" | "production") {
  return createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    useCdn: false,
    token,
  });
}

function i18nString(no: string, en: string) {
  return [
    { _type: "internationalizedArrayStringValue", _key: "no", language: "no", value: no },
    { _type: "internationalizedArrayStringValue", _key: "en", language: "en", value: en },
  ];
}

function i18nText(no: string, en: string) {
  return [
    { _type: "internationalizedArrayTextValue", _key: "no", language: "no", value: no },
    { _type: "internationalizedArrayTextValue", _key: "en", language: "en", value: en },
  ];
}

const DOC_ID = "category-urologi";
const DRAFT_ID = `drafts.${DOC_ID}`;

const HERO = {
  heading: i18nString("Spesialister", "Specialists"),
  headingEmphasis: i18nString("du kan stole på", "you can trust"),
  body: i18nText(
    "Plager i underlivet er vanligere enn du tror — og enklere å hjelpe enn du kanskje frykter. CMedical er eneste private aktør i Norge som tilbyr robotassisterte operasjoner.",
    "Pelvic and genital symptoms are more common than you think — and easier to help with than you might fear. CMedical is the only private provider in Norway offering robot-assisted surgery.",
  ),
  primaryCtaLabel: i18nString("Bestill urologtime", "Book urology appointment"),
  secondaryCtaLabel: i18nString("Ring oss", "Call us"),
  bullets: [
    {
      _key: "bullet-0",
      _type: "heroBulletItem",
      title: i18nString("Ingen henvisning", "No referral needed"),
    },
    {
      _key: "bullet-1",
      _type: "heroBulletItem",
      title: i18nString("Kort ventetid", "Short waiting time"),
    },
  ],
};

const UNSET = [
  "landingPage.hero.helpText",
  "landingPage.hero.entryPriceLabel",
  "landingPage.hero.entryPriceValue",
];

async function patchDataset(dataset: "developer" | "production") {
  const sanity = client(dataset);
  const published = await sanity.getDocument(DOC_ID);
  if (!published) throw new Error(`Missing ${DOC_ID} on ${dataset}`);

  const beforeDoc = await sanity.fetch(
    `*[_id==$id][0]{
      "heading": landingPage.hero.heading[language=="no"][0].value,
      "emphasis": landingPage.hero.headingEmphasis[language=="no"][0].value,
      "body": landingPage.hero.body[language=="no"][0].value
    }`,
    { id: DOC_ID },
  );
  console.log(`\n=== ${dataset} before ===`);
  console.log(JSON.stringify(beforeDoc, null, 2));

  const setPayload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(HERO)) {
    setPayload[`landingPage.hero.${key}`] = value;
  }

  const ids = [DOC_ID];
  if (await sanity.getDocument(DRAFT_ID)) ids.push(DRAFT_ID);

  for (const id of ids) {
    await sanity.patch(id).set(setPayload).unset(UNSET).commit({ autoGenerateArrayKeys: true });
  }

  const after = await sanity.fetch(
    `*[_id==$id][0]{
      "heading": landingPage.hero.heading[language=="no"][0].value,
      "emphasis": landingPage.hero.headingEmphasis[language=="no"][0].value,
      "body": landingPage.hero.body[language=="no"][0].value,
      "cta": landingPage.hero.primaryCtaLabel[language=="no"][0].value
    }`,
    { id: DOC_ID },
  );
  console.log(`=== ${dataset} after ===`);
  console.log(JSON.stringify(after, null, 2));
}

async function main() {
  await patchDataset("developer");
  await patchDataset("production");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
