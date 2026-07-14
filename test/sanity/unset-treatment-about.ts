#!/usr/bin/env npx tsx
/**
 * Migration: unset the "Om [behandling]" section fields on treatments that
 * don't define them in the live project data.
 *
 * Fields controlled by this migration:
 *   - `description` (internationalizedArrayText)  ← left column intro paragraph
 *   - `sections`    (array of { id, heading, content })  ← accordion blocks
 *
 * Source of truth: src/data/treatmentContent.ts.
 *   - If a treatment key has NO `description` in the source → unset `description` on the Sanity doc.
 *   - If a treatment key has NO `sections` in the source    → unset `sections` on the Sanity doc.
 *   - Treatments that aren't in the source at all → BOTH fields are unset.
 *
 * Slug mapping:
 *   Sanity category slug `ovrige` corresponds to live-data key `flere-fagomrader`.
 *
 * Supports v5 internationalized arrays. Idempotent.
 *
 * Usage:
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/unset-treatment-about.ts --dry-run
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/unset-treatment-about.ts
 */
import * as fs from "fs";
import * as path from "path";
import { sanityClient } from "./config";

const SOURCE = path.resolve(__dirname, "../../src/data/treatmentContent.ts");
const DRY_RUN = process.argv.includes("--dry-run");

// Sanity category slug → live-data category key
const CATEGORY_SLUG_MAP: Record<string, string> = {
  ovrige: "flere-fagomrader",
};

function readBalanced(src: string, start: number, open: string, close: string): { end: number; body: string } {
  let depth = 1, i = start;
  let inStr: string | null = null, escape = false;
  while (i < src.length) {
    const ch = src[i];
    if (inStr) {
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === inStr) inStr = null;
    } else {
      if (ch === '"' || ch === "'" || ch === "`") inStr = ch;
      else if (ch === open) depth++;
      else if (ch === close) { depth--; if (depth === 0) return { end: i, body: src.slice(start, i) }; }
    }
    i++;
  }
  throw new Error("Unbalanced brackets");
}

/** Parse treatmentContent.ts → { key → { hasDescription, hasSections } }. */
function parseSource(src: string): Map<string, { hasDescription: boolean; hasSections: boolean }> {
  const out = new Map<string, { hasDescription: boolean; hasSections: boolean }>();
  const entryRe = /"([a-z0-9-]+\/[a-z0-9-]+)":\s*\{/g;
  let m: RegExpExecArray | null;
  while ((m = entryRe.exec(src)) !== null) {
    const key = m[1];
    const bodyStart = m.index + m[0].length;
    const { end: bodyEnd, body } = readBalanced(src, bodyStart, "{", "}");
    entryRe.lastIndex = bodyEnd + 1;

    const hasDescription = /(?:^|[\s,{])description\s*:\s*["'`]/.test(body);
    const hasSections = /(?:^|[\s,{])sections\s*:\s*\[/.test(body);
    out.set(key, { hasDescription, hasSections });
  }
  return out;
}

function isEmpty(v: any): boolean {
  if (v === undefined || v === null) return true;
  if (Array.isArray(v)) {
    if (v.length === 0) return true;
    // v5 i18n arrays: empty when every entry lacks a non-empty value
    return v.every((x: any) => {
      if (!x) return true;
      if (typeof x?.value === "string") return !x.value.trim();
      if (Array.isArray(x?.value)) return x.value.every((y: any) => !y?.value);
      return false;
    });
  }
  return false;
}

async function run() {
  console.log(`📖 Reading ${path.relative(process.cwd(), SOURCE)} …`);
  const source = parseSource(fs.readFileSync(SOURCE, "utf8"));
  const keysWithDescription = new Set<string>();
  const keysWithSections = new Set<string>();
  for (const [k, v] of source) {
    if (v.hasDescription) keysWithDescription.add(k);
    if (v.hasSections) keysWithSections.add(k);
  }
  console.log(`   Source keys:  ${source.size}`);
  console.log(`   With description: ${keysWithDescription.size}`);
  console.log(`   With sections:    ${keysWithSections.size}`);

  console.log("\n🏥 Fetching treatment docs from Sanity …");
  const treatments: Array<{
    _id: string;
    slug?: string;
    categorySlug?: string;
    description?: any;
    sections?: any;
  }> = await sanityClient.fetch(
    `*[_type == "treatment" && !(_id in path("drafts.**"))]{
       _id,
       description,
       sections,
       "slug": coalesce(slug[language == "no"][0].value.current, slug.current),
       "categorySlug": coalesce(category->slug[language == "no"][0].value.current, category->slug.current)
     }`
  );
  console.log(`   Loaded ${treatments.length} treatments.`);
  if (DRY_RUN) console.log("   🚧 DRY RUN — no changes will be committed.\n");

  let unsetDesc = 0, unsetSec = 0, unchanged = 0, missingKey = 0;
  const unsetDescList: string[] = [];
  const unsetSecList: string[] = [];

  for (const t of treatments) {
    if (!t.categorySlug || !t.slug) { missingKey++; continue; }
    const cat = CATEGORY_SLUG_MAP[t.categorySlug] ?? t.categorySlug;
    const key = `${cat}/${t.slug}`;
    const entry = source.get(key);

    const shouldUnsetDescription = !entry?.hasDescription && !isEmpty(t.description);
    const shouldUnsetSections = !entry?.hasSections && !isEmpty(t.sections);

    if (!shouldUnsetDescription && !shouldUnsetSections) { unchanged++; continue; }

    const unset: string[] = [];
    if (shouldUnsetDescription) { unset.push("description"); unsetDescList.push(key); unsetDesc++; }
    if (shouldUnsetSections)    { unset.push("sections");    unsetSecList.push(key);  unsetSec++; }

    console.log(`   ${DRY_RUN ? "•" : "✓"} ${key.padEnd(50)} unset: ${unset.join(", ")}`);
    if (!DRY_RUN) {
      await sanityClient.patch(t._id).unset(unset).commit({ autoGenerateArrayKeys: false });
    }
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`✅ description unset: ${unsetDesc}`);
  console.log(`✅ sections    unset: ${unsetSec}`);
  console.log(`↷  unchanged:        ${unchanged}`);
  if (missingKey) console.log(`⚠  skipped (no slug/category): ${missingKey}`);
  if (DRY_RUN) console.log("\n(dry run — no changes committed)");
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
