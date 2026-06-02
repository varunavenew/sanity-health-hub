#!/usr/bin/env npx tsx
/**
 * Seeds `landingPage` (NO + EN) and i18n `title` on treatment categories.
 * Skips fertilitet landing body — run migrate-fertility-landing.ts for rich fertility content.
 *
 * From test/:
 *   SANITY_TOKEN=… npx tsx sanity/migrate-all-category-landings.ts
 */
import { categoryLandingNo } from "./data/category-landing-no";
import { categoryLandingEn } from "./data/category-landing-en";
import {
  buildCategoryTitleI18n,
  buildLandingFromCategoryContent,
} from "./lib/build-category-landing";
import { i18nString } from "./lib/category-landing-i18n";
import { sanityClient } from "./config";

const LANDING_CATEGORY_IDS = [
  "gynekologi",
  "urologi",
  "ortopedi",
  "graviditet",
  "flere-fagomrader",
] as const;

async function main() {
  for (const id of LANDING_CATEGORY_IDS) {
    const no = categoryLandingNo[id];
    const en = categoryLandingEn[id];
    if (!no || !en) {
      console.warn(`⚠ Missing content for ${id}, skipping`);
      continue;
    }

    const docId = `category-${id}`;
    console.log(`▶ Patching ${docId} (title + landingPage)…`);
    await sanityClient
      .patch(docId)
      .set({
        title: buildCategoryTitleI18n(no, en),
        landingPage: buildLandingFromCategoryContent(no, en),
      })
      .commit();
    console.log(`✓ ${docId}`);
  }

  const fertilitet = categoryLandingNo.fertilitet;
  if (fertilitet) {
    console.log("▶ Patching category-fertilitet title (Fertility / Fertilitet)…");
    await sanityClient
      .patch("category-fertilitet")
      .set({ title: i18nString("Fertilitet", "Fertility") })
      .commit();
    console.log("✓ category-fertilitet title");
    console.log(
      "ℹ Fertilitet landingPage: run npx tsx sanity/migrate-fertility-landing.ts for full content.",
    );
  }

  console.log("\nDone.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
