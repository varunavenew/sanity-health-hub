#!/usr/bin/env npx tsx
/**
 * Migration: seed a `pageSectionInsurance` modular block into every
 * `treatmentCategory` document's `pageSections` array.
 *
 * Partners are sourced from `lib/insurance-page-defaults.ts` (the same 7
 * canonical partners used on the Insurance page):
 *   EuroAccident, Falck, Fremtind, Gjensidige, If, Storebrand, Tryg
 *
 * Placement: inserted immediately after the first `pageSectionSpecialists`
 * block, or prepended if no specialists block exists.
 *
 * Flags:
 *   --force    Replace any existing `pageSectionInsurance` block with the
 *              canonical partner list (default: skip categories that already
 *              have one).
 *   --dry-run  Print what would change without writing to Sanity.
 *
 * Usage:
 *   cd test
 *   SANITY_TOKEN=<token> npx tsx sanity/migrate-category-insurance-section.ts
 *   SANITY_TOKEN=<token> npx tsx sanity/migrate-category-insurance-section.ts --force
 *   SANITY_TOKEN=<token> npx tsx sanity/migrate-category-insurance-section.ts --dry-run
 *
 * Idempotent: safe to re-run (skips categories already seeded unless --force).
 */

import { randomUUID } from "crypto";
import { sanityClient } from "./config";
import { INSURANCE_PARTNERS } from "./lib/insurance-page-defaults";

// ── CLI flags ─────────────────────────────────────────────────────────────────
const FORCE = process.argv.includes("--force");
const DRY_RUN = process.argv.includes("--dry-run");

// ── i18n helpers ─────────────────────────────────────────────────────────────
function i18nString(no: string, en: string) {
  return [
    { _key: "no", _type: "internationalizedArrayStringValue", language: "no", value: no },
    { _key: "en", _type: "internationalizedArrayStringValue", language: "en", value: en },
  ];
}

// ── English display names (kept local; same as insurance-page-defaults) ───────
const EN_PARTNER: Record<string, string> = {
  EuroAccident: "EuroAccident",
  Falck: "Falck",
  Fremtind: "Fremtind Insurance",
  Gjensidige: "Gjensidige Insurance",
  If: "If Insurance",
  Storebrand: "Storebrand Insurance",
  Tryg: "Tryg Insurance",
};

// ── Build the canonical pageSectionInsurance block ───────────────────────────
function buildInsuranceSection() {
  return {
    _type: "pageSectionInsurance",
    _key: randomUUID(),
    eyebrow: i18nString("Forsikringspartnere", "Insurance partners"),
    title: i18nString(
      "Vi har avtale med de største forsikringsselskapene i Norge.",
      "We have agreements with the largest insurance companies in Norway.",
    ),
    partners: [...INSURANCE_PARTNERS].map((name) => ({
      _type: "object",
      _key: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      key: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      label: i18nString(name, EN_PARTNER[name] ?? name),
    })),
  };
}

// ── Insert / replace helpers ──────────────────────────────────────────────────
function insertInsuranceSection(
  existing: any[],
  insuranceSection: ReturnType<typeof buildInsuranceSection>,
  force: boolean,
): { sections: any[]; action: "added" | "replaced" | "skipped" } {
  const insuranceIdx = existing.findIndex((s) => s._type === "pageSectionInsurance");

  if (insuranceIdx >= 0) {
    if (!force) return { sections: existing, action: "skipped" };
    // Replace in-place (keep position, update key so Sanity accepts the patch)
    const replaced = [...existing];
    replaced[insuranceIdx] = { ...insuranceSection, _key: existing[insuranceIdx]._key };
    return { sections: replaced, action: "replaced" };
  }

  // Insert after pageSectionSpecialists, or prepend if none found
  const specialistsIdx = existing.findIndex((s) => s._type === "pageSectionSpecialists");
  const insertAt = specialistsIdx >= 0 ? specialistsIdx + 1 : 0;
  const sections = [
    ...existing.slice(0, insertAt),
    insuranceSection,
    ...existing.slice(insertAt),
  ];
  return { sections, action: "added" };
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function run() {
  console.log("──────────────────────────────────────────────────────");
  console.log("🏥  Migrate: pageSectionInsurance → treatmentCategory");
  console.log(`   Partners : ${[...INSURANCE_PARTNERS].join(", ")}`);
  console.log(`   Force    : ${FORCE ? "YES (overwrite existing blocks)" : "NO (skip if already present)"}`);
  console.log(`   Dry run  : ${DRY_RUN ? "YES (no writes)" : "NO"}`);
  console.log("──────────────────────────────────────────────────────\n");

  const categories: Array<{ _id: string; categoryId?: string; pageSections?: any[] }> =
    await sanityClient.fetch(
      `*[_type == "treatmentCategory" && !(_id in path("drafts.**"))]{
        _id,
        categoryId,
        pageSections
      }`,
    );

  console.log(`Found ${categories.length} treatmentCategory documents.\n`);

  let added = 0;
  let replaced = 0;
  let skipped = 0;

  for (const cat of categories) {
    const label = cat.categoryId || cat._id;
    const existing = cat.pageSections ?? [];
    const insuranceSection = buildInsuranceSection();

    const { sections, action } = insertInsuranceSection(existing, insuranceSection, FORCE);

    if (action === "skipped") {
      console.log(`⏭  [${label}] already has pageSectionInsurance — skipped (use --force to overwrite)`);
      skipped++;
      continue;
    }

    const verb = action === "replaced" ? "Replacing" : "Adding";
    console.log(`✎  [${label}] ${verb} pageSectionInsurance${DRY_RUN ? " (dry run)" : ""}`);

    if (!DRY_RUN) {
      await sanityClient.patch(cat._id).set({ pageSections: sections }).commit();
      console.log(`   ✓ Committed.`);
    }

    if (action === "added") added++;
    else replaced++;
  }

  console.log("\n──────────────────────────────────────────────────────");
  console.log(`✅  Done!`);
  console.log(`   Added   : ${added}`);
  console.log(`   Replaced: ${replaced}`);
  console.log(`   Skipped : ${skipped}`);
  if (DRY_RUN) console.log(`\n👉  Dry run — no changes were written to Sanity.`);
  console.log("──────────────────────────────────────────────────────");
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
