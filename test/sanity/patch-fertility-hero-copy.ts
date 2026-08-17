#!/usr/bin/env npx tsx
/**
 * Restore fertility category hero body to avenewdemo copy.
 * Writes production (Vercel) and developer so both match.
 *
 *   cd test && ALLOW_PRODUCTION_MIGRATION=true npx tsx sanity/patch-fertility-hero-copy.ts
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

const DOC_ID = "category-fertilitet";
const DRAFT_ID = `drafts.${DOC_ID}`;

const HERO = {
  heading: i18nString("Noen ganger trenger kroppen", "Sometimes the body needs"),
  headingEmphasis: i18nString("litt hjelp på veien", "a little help along the way"),
  body: i18nText(
    "Å ville bli foreldre er noe av det sterkeste man kan kjenne på. For mange går det av seg selv. For andre tar det litt lenger tid — og noen trenger hjelp. Det er mer vanlig enn du tror, og det finnes svar. Du er ikke aleine.",
    "Wanting to become a parent is one of the strongest feelings there is. For many it happens naturally. For others it takes longer — and some need help. It is more common than you think, and there are answers. You are not alone.",
  ),
};

async function patchDataset(dataset: "developer" | "production") {
  const sanity = client(dataset);
  const published = await sanity.getDocument(DOC_ID);
  if (!published) throw new Error(`Missing ${DOC_ID} on ${dataset}`);

  const setPayload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(HERO)) {
    setPayload[`landingPage.hero.${key}`] = value;
  }

  await sanity.patch(DOC_ID).set(setPayload).commit();
  const draft = await sanity.getDocument(DRAFT_ID);
  if (draft) {
    await sanity.patch(DRAFT_ID).set(setPayload).commit();
  }

  const bodyNo = await sanity.fetch(
    `*[_id==$id][0].landingPage.hero.body[language=="no"][0].value`,
    { id: DOC_ID },
  );
  console.log(`✓ ${dataset}: ${String(bodyNo).slice(0, 60)}…`);
}

async function main() {
  await patchDataset("developer");
  await patchDataset("production");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
