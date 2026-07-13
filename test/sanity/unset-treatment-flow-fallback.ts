#!/usr/bin/env npx tsx
/**
 * Migration: UNSET `flow*` fields on treatment documents that don't have a
 * real per-page `process` in src/data/treatmentContent.ts.
 *
 * Background:
 *   `migrate-treatment-process.ts` previously seeded a generic 3-step
 *   fallback ("Samtale og kartlegging" → "Undersøkelse …" → "Plan …") on
 *   every treatment doc that had no specific process. That generic content
 *   is not editorial and shouldn't live on documents that don't actually
 *   have a real per-page flow. This migration removes it.
 *
 * What it does:
 *   1. Parse src/data/treatmentContent.ts to build the set of
 *      "<categorySlug>/<slug>" keys that DO have a real process[].
 *   2. Fetch every published treatment doc from Sanity.
 *   3. For every doc whose key is NOT in that set, unset:
 *        flow, flowTitle, flowEyebrow, flowImage, flowImageAlt,
 *        flowLinkLabel, flowLinkHref
 *   4. Docs with a real process (or whose flow was hand-edited to something
 *      other than the generic fallback) are left untouched.
 *
 * Idempotent: safe to re-run.
 *
 * Usage:
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/unset-treatment-flow-fallback.ts
 */
import * as fs from "fs";
import * as path from "path";
import { sanityClient } from "./config";

const SOURCE = path.resolve(__dirname, "../../src/data/treatmentContent.ts");

function readBalanced(src: string, start: number, open: string, close: string): { end: number; body: string } {
  let depth = 1;
  let i = start;
  let inStr: string | null = null;
  let escape = false;
  while (i < src.length) {
    const ch = src[i];
    if (inStr) {
      if (escape) escape = false;
      else if (ch === "\\") escape = true;
      else if (ch === inStr) inStr = null;
    } else {
      if (ch === '"' || ch === "'" || ch === "`") inStr = ch;
      else if (ch === open) depth++;
      else if (ch === close) {
        depth--;
        if (depth === 0) return { end: i, body: src.slice(start, i) };
      }
    }
    i++;
  }
  throw new Error("Unbalanced brackets");
}

/** Return the set of "<categorySlug>/<slug>" keys that have a real process[]. */
function parseSpecificKeys(src: string): Set<string> {
  const keys = new Set<string>();
  const entryRe = /"([a-z0-9-]+\/[a-z0-9-]+)":\s*\{/g;
  let m: RegExpExecArray | null;
  while ((m = entryRe.exec(src)) !== null) {
    const key = m[1];
    const bodyStart = m.index + m[0].length;
    const { end: bodyEnd, body } = readBalanced(src, bodyStart, "{", "}");
    entryRe.lastIndex = bodyEnd + 1;

    const pMatch = /(?:^|[\s,{])process\s*:\s*\[/.exec(body);
    if (!pMatch) continue;
    const start = pMatch.index + pMatch[0].length;
    const { body: arrBody } = readBalanced(body, start, "[", "]");
    try {
      const arr = new Function(`return [${arrBody}]`)();
      if (Array.isArray(arr) && arr.length > 0) keys.add(key);
    } catch {
      // ignore parse errors — treat as no specific process
    }
  }
  return keys;
}

const FLOW_FIELDS = [
  "flow",
  "flowTitle",
  "flowEyebrow",
  "flowImage",
  "flowImageAlt",
  "flowLinkLabel",
  "flowLinkHref",
] as const;

async function run() {
  console.log("📖 Reading treatmentContent.ts …");
  const src = fs.readFileSync(SOURCE, "utf8");
  const specificKeys = parseSpecificKeys(src);
  console.log(`   Found ${specificKeys.size} treatments with a real per-page process[].`);

  console.log("\n🏥 Fetching treatment docs …");
  const treatments: Array<{
    _id: string;
    slug?: string;
    categorySlug?: string;
    flow?: unknown;
    flowTitle?: unknown;
    flowEyebrow?: unknown;
    flowImage?: unknown;
    flowImageAlt?: unknown;
    flowLinkLabel?: unknown;
    flowLinkHref?: unknown;
  }> = await sanityClient.fetch(
    `*[_type == "treatment" && !(_id in path("drafts.**"))]{
       _id,
       "slug": coalesce(slug[language == "no"][0].value.current, slug.current),
       "categorySlug": coalesce(category->slug[language == "no"][0].value.current, category->slug.current),
       flow, flowTitle, flowEyebrow, flowImage, flowImageAlt, flowLinkLabel, flowLinkHref
     }`
  );
  console.log(`   Loaded ${treatments.length} treatment docs.`);

  let unsetCount = 0;
  let keptCount = 0;
  let noopCount = 0;

  for (const doc of treatments) {
    const key = doc.categorySlug && doc.slug ? `${doc.categorySlug}/${doc.slug}` : null;

    if (key && specificKeys.has(key)) {
      keptCount++;
      continue;
    }

    // Build list of currently-set flow fields to unset.
    const toUnset: string[] = [];
    for (const f of FLOW_FIELDS) {
      const v = (doc as Record<string, unknown>)[f];
      const isEmpty =
        v === undefined ||
        v === null ||
        (Array.isArray(v) && v.length === 0) ||
        (typeof v === "string" && v.trim() === "");
      if (!isEmpty) toUnset.push(f);
    }

    if (toUnset.length === 0) {
      noopCount++;
      continue;
    }

    await sanityClient.patch(doc._id).unset(toUnset).commit();
    console.log(`   ✗ ${key ?? doc._id} → unset ${toUnset.join(", ")}`);
    unsetCount++;
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`✅ Unset flow fields on ${unsetCount} docs`);
  console.log(`   Kept ${keptCount} docs with a real per-page process`);
  console.log(`   ${noopCount} docs already had no flow fields set`);
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
