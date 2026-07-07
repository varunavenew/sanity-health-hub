#!/usr/bin/env npx tsx
/**
 * Migration: per-treatment `process` (Behandlingsprosess) steps.
 *
 * Reads src/data/treatmentContent.ts as source-of-truth and PATCHES each
 * matching Sanity `treatment` document. Only the `process` field is touched.
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
  const treatments: Array<{ _id: string; slug?: any; categorySlug?: any }> = await sanityClient.fetch(
    `*[_type == "treatment" && !(_id in path("drafts.**"))]{
       _id,
       "slug": coalesce(slug[language == "no"][0].value.current, slug.current),
       "categorySlug": coalesce(category->slug[language == "no"][0].value.current, category->slug.current)
     }`
  );
  const treatmentIdByKey = new Map<string, string>();
  for (const t of treatments as any[]) {
    if (t.categorySlug && t.slug) treatmentIdByKey.set(`${t.categorySlug}/${t.slug}`, t._id);
  }
  console.log(`   Loaded ${treatmentIdByKey.size} treatments.`);

  let patched = 0;
  const missing: string[] = [];

  for (const e of entries) {
    let treatmentId = treatmentIdByKey.get(e.key);
    if (!treatmentId) {
      const fallback = `treatment-${slugifyKey(e.key)}`;
      const exists = treatments.find((t) => t._id === fallback);
      if (exists) treatmentId = fallback;
    }
    if (!treatmentId) {
      missing.push(e.key);
      continue;
    }

    const process = e.process.map((step, idx) => ({
      _key: `step-${idx}-${slugifyKey(step.title).slice(0, 12)}`,
      _type: "object",
      title: i18nString(step.title),
      description: i18nText(step.description),
    }));

    await sanityClient.patch(treatmentId).set({ process }).commit();
    console.log(`   ✓ ${e.key} → ${process.length} steps`);
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
