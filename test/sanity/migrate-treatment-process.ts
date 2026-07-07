#!/usr/bin/env npx tsx
/**
 * Migration: per-treatment `flow` (Forløp / Behandlingsprosess) steps.
 *
 * Reads src/data/treatmentContent.ts as source-of-truth and PATCHES the
 * `flow` array field on each matching Sanity `treatment` document.
 *
 * The treatment schema uses:
 *   flow: [{ n, title, desc }]
 * where each field is an internationalized array (no + en fallback).
 *
 * We also populate flowTitle / flowEyebrow if missing (optional, defaults).
 *
 * Idempotent: safe to re-run.
 *
 * Usage:
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-treatment-process.ts
 */
import * as fs from "fs";
import * as path from "path";
import { sanityClient } from "./config";

const SOURCE = path.resolve(__dirname, "../../src/data/treatmentContent.ts");

function slugifyKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/æ/g, "ae").replace(/ø/g, "o").replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

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

interface Extracted {
  key: string;
  process: Array<{ title: string; description: string }>;
}

function parseTreatmentContent(src: string): Extracted[] {
  const out: Extracted[] = [];
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
      const arr = new Function(`return [${arrBody}]`)() as Extracted["process"];
      if (Array.isArray(arr) && arr.length) out.push({ key, process: arr });
    } catch (e) {
      console.warn(`   ⚠ ${key}: failed to parse process`, (e as Error).message);
    }
  }
  return out;
}

function i18nString(value: string) {
  return [{ _key: "no", _type: "internationalizedArrayStringValue", value }];
}
function i18nText(value: string) {
  return [{ _key: "no", _type: "internationalizedArrayTextValue", value }];
}

async function run() {
  console.log("📖 Reading treatmentContent.ts …");
  const src = fs.readFileSync(SOURCE, "utf8");
  const entries = parseTreatmentContent(src);
  console.log(`   Parsed ${entries.length} entries with process steps.`);

  console.log("\n🏥 Fetching treatment slug → _id …");
  const treatments: Array<{ _id: string; slug?: any; categorySlug?: any; flow?: any }> = await sanityClient.fetch(
    `*[_type == "treatment" && !(_id in path("drafts.**"))]{
       _id,
       "slug": coalesce(slug[language == "no"][0].value.current, slug.current),
       "categorySlug": coalesce(category->slug[language == "no"][0].value.current, category->slug.current),
       flow,
       flowTitle
     }`
  );
  const treatmentByKey = new Map<string, typeof treatments[number]>();
  for (const t of treatments as any[]) {
    if (t.categorySlug && t.slug) treatmentByKey.set(`${t.categorySlug}/${t.slug}`, t);
  }
  console.log(`   Loaded ${treatmentByKey.size} treatments.`);

  let patched = 0;
  const missing: string[] = [];

  for (const e of entries) {
    let doc = treatmentByKey.get(e.key);
    if (!doc) {
      const fallbackId = `treatment-${slugifyKey(e.key)}`;
      doc = treatments.find((t) => t._id === fallbackId);
    }
    if (!doc) {
      missing.push(e.key);
      continue;
    }

    const flow = e.process.map((step, idx) => ({
      _key: `flow-${idx}-${slugifyKey(step.title).slice(0, 12)}`,
      _type: "object",
      n: i18nString(String(idx + 1).padStart(2, "0")),
      title: i18nString(step.title),
      desc: i18nText(step.description),
    }));

    const patch: Record<string, unknown> = { flow };
    // Only set flowTitle if not present, so we don't overwrite editor input
    if (!doc.flowTitle || (Array.isArray(doc.flowTitle) && doc.flowTitle.length === 0)) {
      patch.flowTitle = i18nString("Slik foregår det");
    }

    await sanityClient.patch(doc._id).set(patch).commit();
    console.log(`   ✓ ${e.key} → ${flow.length} steg`);
    patched++;
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`✅ Patched: ${patched} treatments`);
  if (missing.length) {
    console.log(`⚠  Treatment doc not found in Sanity (${missing.length}):`);
    missing.forEach((k) => console.log(`     - ${k}`));
  }
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
