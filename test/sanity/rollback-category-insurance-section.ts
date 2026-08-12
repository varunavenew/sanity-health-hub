#!/usr/bin/env npx tsx
/**
 * Rollback: remove `pageSectionInsurance` blocks from every
 * `treatmentCategory` document's `pageSections` array.
 *
 * Flags:
 *   --dry-run  Print what would change without writing to Sanity.
 *
 * Usage:
 *   cd test
 *   SANITY_TOKEN=<token> npx tsx sanity/rollback-category-insurance-section.ts
 *   SANITY_TOKEN=<token> npx tsx sanity/rollback-category-insurance-section.ts --dry-run
 */

import { sanityClient } from "./config";

const DRY_RUN = process.argv.includes("--dry-run");

async function rollback() {
  console.log("──────────────────────────────────────────────────────");
  console.log("↩️   Rollback: remove pageSectionInsurance from treatmentCategory");
  console.log(`   Dry run: ${DRY_RUN ? "YES (no writes)" : "NO"}`);
  console.log("──────────────────────────────────────────────────────\n");

  const categories: Array<{
    _id: string;
    categoryId?: string;
    pageSections?: any[];
  }> = await sanityClient.fetch(
    `*[_type == "treatmentCategory" && !(_id in path("drafts.**"))]{
      _id,
      categoryId,
      pageSections
    }`,
  );

  console.log(`Found ${categories.length} treatmentCategory documents.\n`);

  let removed = 0;
  let skipped = 0;

  for (const cat of categories) {
    const label = cat.categoryId || cat._id;
    const existing = cat.pageSections ?? [];
    const hasInsurance = existing.some((s) => s._type === "pageSectionInsurance");

    if (!hasInsurance) {
      console.log(`⏭  [${label}] no pageSectionInsurance found — skipped`);
      skipped++;
      continue;
    }

    const filtered = existing.filter((s) => s._type !== "pageSectionInsurance");
    console.log(
      `✎  [${label}] removing pageSectionInsurance (${existing.length - filtered.length} block(s))${
        DRY_RUN ? " (dry run)" : ""
      }`,
    );

    if (!DRY_RUN) {
      await sanityClient.patch(cat._id).set({ pageSections: filtered }).commit();
      console.log(`   ✓ Committed.`);
    }

    removed++;
  }

  console.log("\n──────────────────────────────────────────────────────");
  console.log(`✅  Done!`);
  console.log(`   Removed : ${removed} categories`);
  console.log(`   Skipped : ${skipped} categories`);
  if (DRY_RUN) console.log(`\n👉  Dry run — no changes were written to Sanity.`);
  console.log("──────────────────────────────────────────────────────");
}

rollback().catch((err) => {
  console.error("❌ Rollback failed:", err);
  process.exit(1);
});
