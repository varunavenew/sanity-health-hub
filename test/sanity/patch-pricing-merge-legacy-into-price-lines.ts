#!/usr/bin/env npx tsx
/**
 * Move hidden legacy flat price lines (category.items) into the first
 * subcategory's editable "Price lines" list, then clear legacy.
 *
 * Studio only shows subcategories[].items — legacy rows still affected the
 * site until merged here. After this patch, everything is editable under
 * Price categories → Subcategories → Price lines.
 *
 * Usage (from test/):
 *   DRY_RUN=1 npx tsx sanity/patch-pricing-merge-legacy-into-price-lines.ts
 *   npx tsx sanity/patch-pricing-merge-legacy-into-price-lines.ts
 *
 * Production:
 *   ALLOW_PRODUCTION_MIGRATION=true SANITY_DATASET_FORCE=production npx tsx sanity/patch-pricing-merge-legacy-into-price-lines.ts
 */
import { randomBytes } from "crypto";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN =
  process.env.DRY_RUN === "1" || process.argv.includes("--dry-run");

type I18nVal = {
  _key?: string;
  _type?: string;
  language?: string;
  value?: string;
};

function pick(arr: I18nVal[] | undefined, lang: "no" | "en"): string {
  if (!Array.isArray(arr)) return "";
  return (
    arr.find((x) => x.language === lang || x._key === lang)?.value?.trim() ||
    arr[0]?.value?.trim() ||
    ""
  );
}

function normalizeName(name: string): string {
  return name.replace(/\s+/g, " ").trim().toLowerCase();
}

function key(): string {
  return randomBytes(4).toString("hex");
}

function lineNameNo(item: { name?: I18nVal[] }): string {
  return pick(item.name, "no") || pick(item.name, "en");
}

async function main() {
  console.log(
    `\n[patch-pricing-merge-legacy] project=${PROJECT_ID} dataset=${DATASET} dry=${DRY_RUN}\n`,
  );

  const page = await sanityClient.fetch<{
    _id: string;
    priceCategories?: any[];
  }>(
    `*[_type=="pricingPage" && !(_id in path("drafts.**"))][0]{_id, priceCategories}`,
  );
  if (!page?._id) throw new Error("pricingPage missing");

  let mergedCount = 0;
  const log: string[] = [];

  const priceCategories = (page.priceCategories || []).map((cat: any) => {
    const legacy: any[] = Array.isArray(cat.items) ? cat.items : [];
    if (!legacy.length) return cat;

    const subs: any[] = Array.isArray(cat.subcategories)
      ? cat.subcategories.map((s: any) => ({
          ...s,
          items: [...(s.items || [])],
        }))
      : [];

    if (!subs.length) {
      console.warn(
        `  skip ${pick(cat.categoryName, "no")}: legacy items but no subcategories`,
      );
      return cat;
    }

    const target = subs[0];
    const seen = new Set(
      (target.items || [])
        .map((item: any) => normalizeName(lineNameNo(item)))
        .filter(Boolean),
    );

    for (const legacyItem of legacy) {
      const label = lineNameNo(legacyItem);
      if (!label) continue;
      const norm = normalizeName(label);
      if (seen.has(norm)) continue;
      seen.add(norm);
      const row = {
        ...legacyItem,
        _key: legacyItem._key || key(),
        _type: "object",
        source:
          legacyItem.source === "metodika"
            ? "metodika"
            : legacyItem.source === "sanity"
              ? "cmedical"
              : legacyItem.source || "cmedical",
      };
      target.items = [...(target.items || []), row];
      mergedCount += 1;
      log.push(`${pick(cat.categoryName, "no")} ← ${label}`);
    }

    return { ...cat, subcategories: subs, items: [] };
  });

  console.log(`Merged ${mergedCount} legacy line(s):`);
  for (const line of log) console.log(`  + ${line}`);

  if (mergedCount === 0) {
    console.log("\nNothing to merge (legacy arrays already empty).\n");
    return;
  }

  if (DRY_RUN) {
    console.log("\n(dry run — no writes). Re-run without DRY_RUN to apply.\n");
    return;
  }

  await sanityClient
    .patch(page._id)
    .set({ priceCategories })
    .commit({ autoGenerateArrayKeys: false });

  console.log(`\nUpdated ${page._id}. Publish Pricing in Studio if a draft exists.\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
