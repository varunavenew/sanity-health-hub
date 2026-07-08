#!/usr/bin/env npx tsx
/**
 * Migration: per-treatment benefits list (checkmark bullets under hero CTA).
 *
 * Populates the Sanity fields that render the benefits block on a treatment
 * page:
 *
 *   - `benefitsTitle` (internationalizedArrayString)  ← optional heading
 *   - `benefits`      (array of internationalizedArrayString)
 *
 * Sources (in priority order — first hit wins per treatment key):
 *   1. src/data/treatmentContent.ts    → `benefits` (string[]), `benefitsTitle`
 *   2. src/data/gynekologiSubPages.tsx → `heroPoints[].title` (category: gynekologi)
 *   3. src/data/fertilitetSubPages.tsx → `heroPoints[].title` (category: fertilitet)
 *
 * Only patches fields that are currently empty/missing on the Sanity doc, so
 * editor changes are never overwritten. Pass FORCE=1 to overwrite.
 *
 * Idempotent. Safe to re-run.
 *
 * Usage:
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-treatment-benefits.ts
 *   cd test && SANITY_TOKEN=<token> FORCE=1 npx tsx sanity/migrate-treatment-benefits.ts
 */
import * as fs from "fs";
import * as path from "path";
import { sanityClient } from "./config";

const TC_SOURCE = path.resolve(__dirname, "../../src/data/treatmentContent.ts");
const GYN_SOURCE = path.resolve(__dirname, "../../src/data/gynekologiSubPages.tsx");
const FER_SOURCE = path.resolve(__dirname, "../../src/data/fertilitetSubPages.tsx");
const FORCE = process.env.FORCE === "1";

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

interface Extracted { key: string; benefitsTitle?: string; benefits?: string[] }

/** Parse treatmentContent.ts — keys look like `"category/sub": { ... }`. */
function parseTreatmentContent(src: string): Extracted[] {
  const out: Extracted[] = [];
  const entryRe = /"([a-z0-9-]+\/[a-z0-9-]+)":\s*\{/g;
  let m: RegExpExecArray | null;
  while ((m = entryRe.exec(src)) !== null) {
    const key = m[1];
    const bodyStart = m.index + m[0].length;
    const { end: bodyEnd, body } = readBalanced(src, bodyStart, "{", "}");
    entryRe.lastIndex = bodyEnd + 1;

    const entry: Extracted = { key };

    const btRe = /(?:^|[\s,{])benefitsTitle\s*:\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/;
    const bt = btRe.exec(body);
    if (bt) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        const v = new Function(`return ${bt[1]}`)() as string;
        if (typeof v === "string" && v.trim()) entry.benefitsTitle = v;
      } catch { /* ignore */ }
    }

    const bMatch = /(?:^|[\s,{])benefits\s*:\s*\[/.exec(body);
    if (bMatch) {
      const start = bMatch.index + bMatch[0].length;
      const { body: arrBody } = readBalanced(body, start, "[", "]");
      try {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        const arr = new Function(`return [${arrBody}]`)() as string[];
        if (Array.isArray(arr) && arr.length && arr.every((x) => typeof x === "string")) {
          entry.benefits = arr.filter((x) => x.trim());
        }
      } catch (e) {
        console.warn(`   ⚠ ${key}: failed to parse benefits`, (e as Error).message);
      }
    }

    if (entry.benefitsTitle || entry.benefits) out.push(entry);
  }
  return out;
}

/**
 * Parse a *SubPages.tsx file. Top-level entries in the exported record look
 * like `undersokelse: { ... }` or `"assistert-befruktning": { ... }`. From
 * each entry we extract `heroPoints[].title` — those become the benefit
 * bullets for treatment key `${category}/${subKey}`.
 */
function parseSubPages(src: string, category: string, recordName: string): Extracted[] {
  const out: Extracted[] = [];
  // Find the exported record and grab its body — indentation-agnostic.
  const recRe = new RegExp(`export\\s+const\\s+${recordName}\\s*:[^=]*=\\s*\\{`);
  const rm = recRe.exec(src);
  if (!rm) {
    console.warn(`   ⚠ ${recordName}: export not found`);
    return out;
  }
  const recordBodyStart = rm.index + rm[0].length;
  const { body: recordBody } = readBalanced(src, recordBodyStart, "{", "}");

  // Entries at depth 1 within the record. Match `key:` or `"key":` at any indent.
  const entryRe = /(?:^|\n)\s*(?:"([a-z0-9-]+)"|([a-zA-Z_][a-zA-Z0-9_-]*))\s*:\s*\{/g;
  let m: RegExpExecArray | null;
  while ((m = entryRe.exec(recordBody)) !== null) {
    const subKey = m[1] ?? m[2];
    if (!subKey) continue;
    const bodyStart = m.index + m[0].length;
    let bodyEnd: number, body: string;
    try {
      ({ end: bodyEnd, body } = readBalanced(recordBody, bodyStart, "{", "}"));
    } catch { continue; }
    entryRe.lastIndex = bodyEnd + 1;

    const hp = /(?:^|[\s,{])heroPoints\s*:\s*\[/.exec(body);
    if (!hp) continue;
    const arrStart = hp.index + hp[0].length;
    let arrBody: string;
    try {
      ({ body: arrBody } = readBalanced(body, arrStart, "[", "]"));
    } catch { continue; }

    const titles: string[] = [];
    const titleRe = /\btitle\s*:\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g;
    let tm: RegExpExecArray | null;
    while ((tm = titleRe.exec(arrBody)) !== null) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        const v = new Function(`return ${tm[1]}`)() as string;
        if (typeof v === "string" && v.trim()) titles.push(v.trim());
      } catch { /* ignore */ }
    }
    if (titles.length) out.push({ key: `${category}/${subKey}`, benefits: titles });
  }
  return out;
}

const i18nString = (value: string) =>
  [{ _key: "no", _type: "internationalizedArrayStringValue", value }];

const isEmpty = (v: any) =>
  v === undefined || v === null ||
  (Array.isArray(v) && (v.length === 0 || v.every((x: any) => !x?.value && !(Array.isArray(x) && x.some((y: any) => y?.value)))));

async function run() {
  console.log("📖 Reading source files …");
  const tcEntries = parseTreatmentContent(fs.readFileSync(TC_SOURCE, "utf8"));
  const gynEntries = parseSubPages(fs.readFileSync(GYN_SOURCE, "utf8"), "gynekologi", "gynekologiSubPages");
  const ferEntries = parseSubPages(fs.readFileSync(FER_SOURCE, "utf8"), "fertilitet", "fertilitetSubPages");
  console.log(`   treatmentContent.ts:    ${tcEntries.length} entries with benefits/title`);
  console.log(`   gynekologiSubPages:     ${gynEntries.length} entries with heroPoints`);
  console.log(`   fertilitetSubPages:     ${ferEntries.length} entries with heroPoints`);

  // Merge: treatmentContent.ts wins per key. Sub-page files fill the gaps.
  const merged = new Map<string, Extracted>();
  for (const e of [...gynEntries, ...ferEntries, ...tcEntries]) merged.set(e.key, e);
  const entries = [...merged.values()];
  console.log(`   → ${entries.length} unique treatment keys to migrate.`);
  if (FORCE) console.log("   ⚠ FORCE=1 — existing values WILL be overwritten.");

  console.log("\n🏥 Fetching treatment docs …");
  const treatments: Array<{ _id: string; slug?: string; categorySlug?: string; benefits?: any; benefitsTitle?: any }> =
    await sanityClient.fetch(
      `*[_type == "treatment" && !(_id in path("drafts.**"))]{
         _id,
         benefits,
         benefitsTitle,
         "slug": coalesce(slug[language == "no"][0].value.current, slug.current),
         "categorySlug": coalesce(category->slug[language == "no"][0].value.current, category->slug.current)
       }`
    );
  const byKey = new Map<string, typeof treatments[number]>();
  for (const t of treatments) {
    if (t.categorySlug && t.slug) byKey.set(`${t.categorySlug}/${t.slug}`, t);
  }
  console.log(`   Loaded ${byKey.size} treatments.`);

  let patched = 0;
  let titleCount = 0;
  let benefitsCount = 0;
  const skipped: string[] = [];
  const missing: string[] = [];

  for (const e of entries) {
    let doc = byKey.get(e.key);
    if (!doc) {
      const fallbackId = `treatment-${slugifyKey(e.key)}`;
      doc = treatments.find((t) => t._id === fallbackId);
    }
    if (!doc) { missing.push(e.key); continue; }

    const patch: Record<string, unknown> = {};

    if (e.benefitsTitle && (FORCE || isEmpty(doc.benefitsTitle))) {
      patch.benefitsTitle = i18nString(e.benefitsTitle);
    }

    if (e.benefits?.length && (FORCE || isEmpty(doc.benefits))) {
      patch.benefits = e.benefits.map((text, idx) => ({
        _key: `benefit-${idx}`,
        _type: "internationalizedArrayString",
        value: i18nString(text),
      }));
    }

    if (Object.keys(patch).length === 0) { skipped.push(e.key); continue; }

    await sanityClient.patch(doc._id).set(patch).commit();
    const parts: string[] = [];
    if (patch.benefitsTitle) { parts.push("benefitsTitle"); titleCount++; }
    if (patch.benefits) { parts.push(`benefits(${(patch.benefits as any[]).length})`); benefitsCount++; }
    console.log(`   ✓ ${e.key} → ${parts.join(" + ")}`);
    patched++;
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`✅ Patched: ${patched} treatments  (benefitsTitle: ${titleCount}, benefits: ${benefitsCount})`);
  if (skipped.length) console.log(`↷  Skipped (already populated, use FORCE=1 to overwrite): ${skipped.length}`);
  if (missing.length) {
    console.log(`⚠  Treatment doc not found in Sanity (${missing.length}):`);
    missing.forEach((k) => console.log(`     - ${k}`));
  }
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
