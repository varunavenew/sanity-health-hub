/**
 * SAFE production migration: copy required Pricing fields from developer → production.
 *
 * Does NOT:
 * - replace the dataset
 * - delete unrelated documents
 * - overwrite faqCollection / faqs / testimonials / specialistsSection / seo / heroImage
 *
 * Does:
 * - backup production pricingPage JSON
 * - create Pricing CTA collection if missing (same ID as developer)
 * - patch pricingPage with priceCategories + pricingCta + page-owned titles/intro/faqTitle/testimonialsTitle
 * - remove shared pageSectionBookingCta from Pricing pageSections (page-owned pricingCta replaces it)
 *
 * Usage (from test/):
 *   # dry run
 *   cross-env DRY_RUN=1 ALLOW_PRODUCTION_MIGRATION=true SANITY_DATASET_FORCE=production SANITY_STUDIO_FORCE_DATASET=production npx tsx sanity/migrate-pricing-to-production.ts
 *
 *   # apply
 *   cross-env ALLOW_PRODUCTION_MIGRATION=true SANITY_DATASET_FORCE=production SANITY_STUDIO_FORCE_DATASET=production npx tsx sanity/migrate-pricing-to-production.ts
 */
import fs from "fs";
import path from "path";
import {createClient} from "@sanity/client";
import {config as loadEnv} from "dotenv";
import {requireSanityProjectId} from "./dataset-env";

loadEnv({path: path.join(process.cwd(), ".env.local")});
loadEnv({path: path.join(process.cwd(), "..", ".env.local")});

const PROJECT_ID = requireSanityProjectId();
const TOKEN = process.env.SANITY_TOKEN?.trim();
const DRY_RUN =
  process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";
const ALLOW =
  process.env.ALLOW_PRODUCTION_MIGRATION === "true" ||
  process.env.ALLOW_PRODUCTION_MIGRATION === "1";

const CTA_ID = "cta-collection-pricing-page";
const PAGE_ID = "pricingPage";

if (!TOKEN) {
  console.error("Missing SANITY_TOKEN");
  process.exit(1);
}
if (PROJECT_ID !== "9jhqpk3a") {
  throw new Error(`Unexpected project id: ${PROJECT_ID}`);
}
if (!ALLOW) {
  throw new Error(
    "Refusing production write. Set ALLOW_PRODUCTION_MIGRATION=true",
  );
}

function clientFor(dataset: "developer" | "production") {
  return createClient({
    projectId: PROJECT_ID,
    dataset,
    apiVersion: "2024-01-01",
    token: TOKEN,
    useCdn: false,
  });
}

async function main() {
  const developer = clientFor("developer");
  const production = clientFor("production");

  console.log("\n=== migrate-pricing-to-production ===");
  console.log("projectId:", PROJECT_ID);
  console.log("source: developer");
  console.log("target: production");
  console.log("dryRun:", DRY_RUN);

  const [devPage, prodPage, devCta] = await Promise.all([
    developer.fetch<any>(`*[_id==$id][0]`, {id: PAGE_ID}),
    production.fetch<any>(`*[_id==$id][0]`, {id: PAGE_ID}),
    developer.fetch<any>(`*[_id==$id][0]`, {id: CTA_ID}),
  ]);

  if (!devPage?._id) throw new Error("developer pricingPage missing");
  if (!prodPage?._id) throw new Error("production pricingPage missing");
  if (!devCta?._id) throw new Error("developer Pricing CTA collection missing");

  const cats = Array.isArray(devPage.priceCategories)
    ? devPage.priceCategories
    : [];
  if (cats.length === 0) throw new Error("developer priceCategories empty");

  // Count lines / sources
  let lines = 0;
  let metodika = 0;
  let sanityOnly = 0;
  for (const cat of cats) {
    for (const sub of cat.subcategories || []) {
      for (const item of sub.items || []) {
        lines++;
        if (item.source === "metodika") metodika++;
        else sanityOnly++;
      }
    }
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.resolve(process.cwd(), "..", "tmp", "production-backups");
  fs.mkdirSync(backupDir, {recursive: true});
  const backupPath = path.join(
    backupDir,
    `pricingPage-production-backup-${stamp}.json`,
  );
  fs.writeFileSync(
    backupPath,
    JSON.stringify(
      {
        backedUpAt: new Date().toISOString(),
        projectId: PROJECT_ID,
        dataset: "production",
        pricingPage: prodPage,
        existingPricingCtaCollection: await production.fetch(`*[_id==$id][0]`, {
          id: CTA_ID,
        }),
      },
      null,
      2,
    ),
  );
  console.log("Backup written:", backupPath);

  // Strip Sanity system fields from CTA for createOrReplace
  const {
    _createdAt: _c1,
    _updatedAt: _u1,
    _rev: _r1,
    ...ctaBody
  } = devCta;

  const patchFields: Record<string, unknown> = {
    priceCategories: cats,
    pricingCta: devPage.pricingCta,
    // Page-owned CTA replaces shared band; keep other shared sections if any
    pageSections: Array.isArray(prodPage.pageSections)
      ? prodPage.pageSections.filter(
          (row: any) => row?._type !== "pageSectionBookingCta",
        )
      : [],
    title: devPage.title,
    introText: devPage.introText,
    faqTitle: devPage.faqTitle,
    testimonialsTitle: devPage.testimonialsTitle,
  };

  if (!patchFields.pricingCta) {
    throw new Error("developer pricingCta missing — aborting");
  }

  console.log("\nPlan:");
  console.log("- createOrReplace", CTA_ID);
  console.log("- patch", PAGE_ID, "fields:", Object.keys(patchFields).join(", "));
  console.log("- categories:", cats.length);
  console.log("- lines:", lines, "(metodika:", metodika, ", sanity:", sanityOnly + ")");
  console.log(
    "- remove shared pageSectionBookingCta from production pageSections if present",
  );
  console.log(
    "- preserved: faqCollection, faqs, testimonials, specialistsSection, seo, heroImage, slug",
  );

  if (DRY_RUN) {
    console.log("\nDRY_RUN=1 — no production mutations performed.");
    return;
  }

  await production.createOrReplace({
    ...ctaBody,
    _id: CTA_ID,
    _type: "ctaCollection",
  });
  console.log("✓ Upserted", CTA_ID);

  await production.patch(PAGE_ID).set(patchFields).commit({autoGenerateArrayKeys: false});
  console.log("✓ Patched", PAGE_ID);

  // Post-write verification
  const verify = await production.fetch<any>(`*[_id==$id][0]{
    _id,
    "titleNo": title[language=="no"][0].value,
    "titleEn": title[language=="en"][0].value,
    "catCount": count(priceCategories),
    "pricingCtaRef": pricingCta.ctaCollection._ref,
    "pageSectionTypes": pageSections[]._type,
    "faqCollectionId": faqCollection._ref,
    "testimonialsCount": count(testimonials),
    "hasSpecialists": defined(specialistsSection),
    "hasSeo": defined(seo),
    "hasHero": defined(heroImage.asset)
  }`, {id: PAGE_ID});

  const ctaVerify = await production.fetch(
    `*[_id==$id][0]{
      _id,
      "titleNo": title[language=="no"][0].value,
      "titleEn": title[language=="en"][0].value,
      "primaryNo": primaryLabel[language=="no"][0].value,
      "secondaryNo": secondaryLabel[language=="no"][0].value
    }`,
    {id: CTA_ID},
  );

  console.log("\nVerification:");
  console.log(JSON.stringify({page: verify, cta: ctaVerify}, null, 2));

  if (verify?.pricingCtaRef !== CTA_ID) {
    throw new Error("pricingCta ref mismatch after write");
  }
  if (verify?.catCount !== cats.length) {
    throw new Error(
      `category count mismatch: expected ${cats.length}, got ${verify?.catCount}`,
    );
  }
  if ((verify?.pageSectionTypes || []).includes("pageSectionBookingCta")) {
    throw new Error("shared pageSectionBookingCta still present on Pricing");
  }

  console.log("\n✓ Production Pricing migration complete");
  console.log("Revert: restore from", backupPath);
}

main().catch((err) => {
  console.error(err?.message || err);
  process.exit(1);
});
