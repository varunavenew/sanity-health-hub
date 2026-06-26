/**
 * Seed localized URL slugs on singleton page documents.
 *
 * Run:
 *   cd test && npx tsx sanity/migrate-singleton-slugs.ts
 *
 * ENV:
 *   DRY_RUN=1 — preview only
 */
import { randomBytes } from "crypto";
import { patchSingletonFields } from "./lib/patch-singleton";

const DRY_RUN = process.env.DRY_RUN === "1";

type SlugPair = { no: string; en: string };

const SINGLETON_SLUGS: Record<string, SlugPair> = {
  aboutPage: { no: "om-oss", en: "about" },
  contactPage: { no: "kontakt", en: "contact" },
  newsPage: { no: "aktuelt", en: "news" },
  pricingPage: { no: "priser", en: "pricing" },
  insurancePage: { no: "forsikring", en: "insurance" },
  servicesPage: { no: "tjenester", en: "services" },
  specialistsPage: { no: "om-spesialister", en: "about-specialists" },
  specialistsListingPage: { no: "spesialister", en: "specialists" },
  clinicsPage: { no: "klinikker", en: "clinics" },
  privacyPolicyPage: { no: "personvern", en: "personvern" },
  careersPage: { no: "karriere", en: "careers" },
  guidePage: { no: "guide", en: "guide" },
};

const THEME_SLUGS: Record<string, SlugPair> = {
  kvinnehelse: { no: "kvinnehelse", en: "kvinnehelse" },
  robotkirurgi: { no: "robotassistert-kirurgi", en: "robot-assisted-surgery" },
  "tverrfaglige-team": { no: "tverrfaglige-team", en: "tverrfaglige-team" },
};

function randomKey(): string {
  return randomBytes(8).toString("hex");
}

function buildSlugField(pair: SlugPair) {
  return [
    {
      _key: randomKey(),
      _type: "internationalizedArraySlugValue",
      language: "no",
      value: { _type: "slug", current: pair.no },
    },
    {
      _key: randomKey(),
      _type: "internationalizedArraySlugValue",
      language: "en",
      value: { _type: "slug", current: pair.en },
    },
  ];
}

async function run() {
  console.log("▶ Seed singleton page slugs");
  console.log(`  Dry run: ${DRY_RUN ? "yes" : "no"}\n`);

  for (const [documentId, pair] of Object.entries(SINGLETON_SLUGS)) {
    const slug = buildSlugField(pair);
    console.log(`  ${documentId}: /${pair.no} · /${pair.en}`);
    if (!DRY_RUN) {
      await patchSingletonFields(documentId, { slug }, documentId);
    }
  }

  for (const [querySlug, pair] of Object.entries(THEME_SLUGS)) {
    console.log(`  themePage (${querySlug}): /${pair.no} · /${pair.en}`);
    if (DRY_RUN) continue;

    const { sanityClient } = await import("./config");
    const doc = await sanityClient.fetch<{ _id: string } | null>(
      `*[_type == "themePage" && (
        slug[language == "no"][0].value.current == $slug ||
        slug[_key == "no"][0].value.current == $slug ||
        slug[0].value.current == $slug ||
        slug.current == $slug
      )][0]{ _id }`,
      { slug: querySlug },
    );
    if (!doc?._id) {
      console.warn(`    ⚠ No themePage found for query slug "${querySlug}" — skipped`);
      continue;
    }
    const baseId = doc._id.replace(/^drafts\./, "");
    await patchSingletonFields(baseId, { slug: buildSlugField(pair) }, "themePage");
  }

  console.log("\n✓ Done");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
