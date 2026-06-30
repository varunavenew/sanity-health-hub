#!/usr/bin/env npx tsx
/**
 * Upload and set heroImage on insurancePage (published + draft).
 * Skips if heroImage already exists unless FORCE=1.
 *
 * From test/:
 *   npm run migrate:insurance-page-hero:dry
 *   npm run migrate:insurance-page-hero
 */
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { sanityClient } from "./config";
import { patchSingletonFields } from "./lib/patch-singleton";

const DRY_RUN = process.env.DRY_RUN === "1";
const FORCE = process.env.FORCE === "1";
const HERO_FILE = "insurance-hero.jpg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const heroPath = path.resolve(__dirname, "../../src/assets/hero", HERO_FILE);

async function uploadHeroImage() {
  if (!fs.existsSync(heroPath)) {
    throw new Error(`Hero image not found: ${heroPath}`);
  }
  const imageBuffer = fs.readFileSync(heroPath);
  const asset = await sanityClient.assets.upload("image", imageBuffer, {
    filename: HERO_FILE,
    contentType: "image/jpeg",
  });
  return {
    _type: "image" as const,
    asset: { _type: "reference" as const, _ref: asset._id },
  };
}

async function run() {
  const published = await sanityClient.fetch<{ heroImage?: unknown } | null>(
    `*[_id == "insurancePage"][0]{ heroImage }`,
  );

  if (!FORCE && published?.heroImage) {
    console.log("insurancePage already has heroImage — use FORCE=1 to replace.");
    return;
  }

  if (DRY_RUN) {
    console.log(`DRY — would upload ${HERO_FILE} and patch insurancePage.heroImage`);
    return;
  }

  console.log(`Uploading ${HERO_FILE}…`);
  const heroImage = await uploadHeroImage();
  const patched = await patchSingletonFields("insurancePage", { heroImage }, "insurancePage");
  console.log(`✓ insurancePage heroImage — ${patched.join(", ")}`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
