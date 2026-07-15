#!/usr/bin/env npx tsx
/**
 * Migration: populate `heroPrice` (internationalizedArrayString, NO+EN)
 * on every treatment document, using src/data/priceList.ts as the source.
 *
 * Strategy:
 *   1. Read src/data/priceList.ts and build a map:
 *         "/behandlinger/{category}/{slug}"  →  lowest numeric "fra"-price
 *      (Any PriceItem whose `path` matches the treatment page URL is a
 *       candidate. The lowest numeric value wins so we get "starting from".)
 *   2. Fetch all treatment docs from Sanity with their categorySlug + slug.
 *   3. For each doc, build "/behandlinger/{categorySlug}/{slug}" and look
 *      up the price. Write it as:
 *         NO: "Fra kr 2 100,-"
 *         EN: "From NOK 2,100"
 *      If no numeric match is found, fall back to the category minimum
 *      (lowest price across the whole category).
 *
 * Idempotent — skips docs that already have `heroPrice` unless FORCE=1.
 * Supports --dry-run.
 *
 * Usage:
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-treatment-hero-price.ts
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-treatment-hero-price.ts --dry-run
 *   cd test && SANITY_TOKEN=<token> FORCE=1 npx tsx sanity/migrate-treatment-hero-price.ts
 */
import * as fs from "fs";
import * as path from "path";
import { sanityClient } from "./config";

const SOURCE = path.resolve(__dirname, "../../src/data/priceList.ts");
const FORCE = process.env.FORCE === "1";
const DRY = process.argv.includes("--dry-run");

const LANGS = ["no", "en"] as const;

const i18nString = (no: string, en: string) =>
  LANGS.map((lang) => ({
    _key: lang,
    _type: "internationalizedArrayStringValue",
    language: lang,
    value: lang === "no" ? no : en,
  }));

const isEmpty = (v: any) => v === undefined || v === null || (Array.isArray(v) && v.length === 0);

// ─── Parse priceList.ts ───────────────────────────────────────────────────
// Extract numeric NOK value from strings like "fra 2.100,-", "1.950,-",
// "fra kr 46 000", "Gratis", "97.000,-". Returns null if no number.
function parsePrice(price: string): number | null {
  if (!price) return null;
  const cleaned = price.replace(/\s/g, "").replace(/kr/gi, "");
  const m = cleaned.match(/(\d[\d.]*)/);
  if (!m) return null;
  const n = parseInt(m[1].replace(/\./g, ""), 10);
  return Number.isFinite(n) ? n : null;
}

interface PathPrice {
  category: string; // e.g. "gynekologi"
  urlPath: string; // e.g. "/behandlinger/gynekologi/urinlekkasje"
  amount: number;
}

function extractPathPrices(src: string): { byPath: Map<string, number>; byCategory: Map<string, number> } {
  const byPath = new Map<string, number>();
  const byCategory = new Map<string, number>();

  // Track current category id via `id: 'xxx'` lines that precede subcategories.
  const catIdRe = /id:\s*['"]([a-z0-9-]+)['"]/g;
  const catRanges: Array<{ id: string; start: number; end: number }> = [];
  let m: RegExpExecArray | null;
  while ((m = catIdRe.exec(src)) !== null) {
    catRanges.push({ id: m[1], start: m.index, end: src.length });
  }
  for (let i = 0; i < catRanges.length - 1; i++) catRanges[i].end = catRanges[i + 1].start;

  const itemRe = /\{\s*name:\s*["'][^"']*["'],\s*price:\s*["']([^"']*)["'][^}]*?path:\s*["']([^"']+)["']/g;
  while ((m = itemRe.exec(src)) !== null) {
    const priceStr = m[1];
    const urlPath = m[2];
    const amount = parsePrice(priceStr);
    if (amount === null) continue;

    const range = catRanges.find((r) => m!.index >= r.start && m!.index < r.end);
    const catId = range?.id ?? "";

    // Lowest price per path wins.
    const prev = byPath.get(urlPath);
    if (prev === undefined || amount < prev) byPath.set(urlPath, amount);

    if (catId) {
      const prevCat = byCategory.get(catId);
      if (prevCat === undefined || amount < prevCat) byCategory.set(catId, amount);
    }
  }

  // Also scan all items (not just those with a path) for category minima.
  const anyItemRe = /price:\s*["']([^"']*)["']/g;
  while ((m = anyItemRe.exec(src)) !== null) {
    const amount = parsePrice(m[1]);
    if (amount === null) continue;
    const range = catRanges.find((r) => m!.index >= r.start && m!.index < r.end);
    if (!range) continue;
    const prev = byCategory.get(range.id);
    if (prev === undefined || amount < prev) byCategory.set(range.id, amount);
  }

  return { byPath, byCategory };
}

// ─── Formatters ───────────────────────────────────────────────────────────
const formatNoAmount = (n: number) => n.toLocaleString("nb-NO").replace(/\u00A0/g, " ");
const formatEnAmount = (n: number) => n.toLocaleString("en-US");

const formatNo = (n: number) => `Fra kr ${formatNoAmount(n)},-`;
const formatEn = (n: number) => `From NOK ${formatEnAmount(n)}`;

// ─── Run ──────────────────────────────────────────────────────────────────
async function run() {
  console.log("📖 Reading src/data/priceList.ts …");
  const { byPath, byCategory } = extractPathPrices(fs.readFileSync(SOURCE, "utf8"));
  console.log(`   Parsed ${byPath.size} priced paths across ${byCategory.size} categories.`);
  if (DRY) console.log("   🔍 DRY RUN — no writes will be made.");
  if (FORCE) console.log("   ⚠ FORCE=1 — existing heroPrice WILL be overwritten.");

  console.log("\n🏥 Fetching treatment docs …");
  const treatments: Array<{ _id: string; slug?: string; categorySlug?: string; heroPrice?: any }> =
    await sanityClient.fetch(
      `*[_type == "treatment" && !(_id in path("drafts.**"))]{
         _id,
         heroPrice,
         "slug": coalesce(slug[language == "no"][0].value.current, slug[_key == "no"][0].value.current, slug.current),
         "categorySlug": coalesce(category->slug[language == "no"][0].value.current, category->slug[_key == "no"][0].value.current, category->slug.current)
       }`
    );
  console.log(`   Loaded ${treatments.length} treatments.`);

  let patched = 0, fromPath = 0, fromCategory = 0, skipped = 0, missing = 0, errors = 0;
  const missingKeys: string[] = [];

  for (const doc of treatments) {
    if (!doc.categorySlug || !doc.slug) { missing++; missingKeys.push(doc._id); continue; }
    if (!FORCE && !isEmpty(doc.heroPrice)) { skipped++; continue; }

    const urlPath = `/behandlinger/${doc.categorySlug}/${doc.slug}`;
    let amount = byPath.get(urlPath);
    let source: "path" | "category" = "path";
    if (amount === undefined) {
      amount = byCategory.get(doc.categorySlug);
      source = "category";
    }

    if (amount === undefined) {
      missing++;
      missingKeys.push(`${doc.categorySlug}/${doc.slug}`);
      continue;
    }

    const value = [
      ...i18nString(formatNo(amount), formatEn(amount)),
    ];

    try {
      if (!DRY) await sanityClient.patch(doc._id).set({ heroPrice: value }).commit();
      console.log(
        `   ${DRY ? "[dry]" : "✓"} ${doc.categorySlug}/${doc.slug} → ${formatNo(amount)} / ${formatEn(amount)} (${source})`
      );
      patched++;
      if (source === "path") fromPath++; else fromCategory++;
    } catch (err) {
      errors++;
      console.error(`   ✗ ${doc._id} — ${(err as Error).message}`);
    }
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`✅ Patched: ${patched}  (from path: ${fromPath}, from category min: ${fromCategory})`);
  if (skipped) console.log(`↷  Skipped (already populated, use FORCE=1 to overwrite): ${skipped}`);
  if (missing) {
    console.log(`⚠  No price match (${missing}):`);
    missingKeys.slice(0, 30).forEach((k) => console.log(`     - ${k}`));
  }
  if (errors) console.log(`✗  Errors: ${errors}`);
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
