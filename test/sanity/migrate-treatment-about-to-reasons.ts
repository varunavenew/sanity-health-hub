#!/usr/bin/env npx tsx
/**
 * Migration: old "Om [behandling]" accordion → new `reasons` (Symptoms) field
 * rendered as accordion.
 *
 * The old schema had a dedicated `sections` array ({ id, heading, content })
 * that rendered as the "Everything you need to know — step by step" accordion.
 * The new `treatment` schema removed that field; the equivalent block is now
 * `reasons` with `reasonsLayout = 'accordion'` (items: { n, title, desc }).
 *
 * This script:
 *   1. Parses `src/data/treatmentContent.ts` for each treatment's `sections`
 *      (and `description` intro).
 *   2. Patches the matching Sanity `treatment` document:
 *        - `description`      ← intro paragraph (if empty)
 *        - `reasons`          ← mapped from sections (heading→title, content→desc)
 *        - `reasonsLayout`    ← 'accordion'
 *   3. Uses internationalized-array v5 format (each value carries both `_key`
 *      and `language: 'no'`) so it works with the migrated docs.
 *   4. Only patches when the target field is empty. Pass FORCE=1 to overwrite.
 *
 * Idempotent. Safe to re-run.
 *
 * Usage:
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-treatment-about-to-reasons.ts
 *   cd test && SANITY_TOKEN=<token> FORCE=1 npx tsx sanity/migrate-treatment-about-to-reasons.ts
 */
import * as fs from "fs";
import * as path from "path";
import { sanityClient } from "./config";

const SOURCE = path.resolve(__dirname, "../../src/data/treatmentContent.ts");
const GYN_SOURCE = path.resolve(__dirname, "../../src/data/gynekologiSubPages.tsx");
const FER_SOURCE = path.resolve(__dirname, "../../src/data/fertilitetSubPages.tsx");
const FORCE = process.env.FORCE === "1";

// Supported languages. Norwegian is the source of truth; English falls back
// to Norwegian on the frontend when missing, but we write both keys so the
// v5 language-field format is populated for editors to translate.
const LANGS = ["no", "en"] as const;
type Lang = (typeof LANGS)[number];

// Per-page layout mapping — mirrors FORM_B_ACCORDION in
// src/lib/treatmentToSubLayout.tsx. Pages listed here render the reasons
// block as an accordion ("Trekkspill"); everything else stays "prose"
// ("Prosa (standard)"), matching what users see today.
const FORM_B_ACCORDION: ReadonlySet<string> = new Set([
  "urologi/blaere",
  "urologi/nyrer",
  "urologi/prostata",
  "gynekologi/overgangsalder",
  "gynekologi/celleforandringer",
  "gynekologi/cyster",
  "gynekologi/vulvalidelser",
  "gynekologi/graviditet",
  "fertilitet/infertilitet",
  "fertilitet/assistert-befruktning",
  "fertilitet/donorbehandling",
  "fertilitet/eggfrys",
  "fertilitet/saedanalyse",
  "ortopedi/fot-ankel",
  "ortopedi/hand-albue",
  "ortopedi/skulder",
  "flere-fagomrader/sexologi",
]);
const layoutFor = (key: string): "accordion" | "prose" =>
  FORM_B_ACCORDION.has(key) ? "accordion" : "prose";


function slugifyKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/æ/g, "ae").replace(/ø/g, "o").replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function shortHash(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = ((h << 5) - h + text.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36).slice(0, 6);
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

interface Section { id?: string; heading: string; content: string }
interface Extracted { key: string; description?: string; sections?: Section[] }

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

    const descRe = /(?:^|[\s,{])description\s*:\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/;
    const dMatch = descRe.exec(body);
    if (dMatch) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        const value = new Function(`return ${dMatch[1]}`)() as string;
        if (typeof value === "string" && value.trim()) entry.description = value;
      } catch { /* ignore */ }
    }

    const sMatch = /(?:^|[\s,{])sections\s*:\s*\[/.exec(body);
    if (sMatch) {
      const start = sMatch.index + sMatch[0].length;
      const { body: arrBody } = readBalanced(body, start, "[", "]");
      try {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        const arr = new Function(`return [${arrBody}]`)() as Section[];
        if (Array.isArray(arr) && arr.length) entry.sections = arr;
      } catch (e) {
        console.warn(`   ⚠ ${key}: failed to parse sections`, (e as Error).message);
      }
    }

    if (entry.description || entry.sections) out.push(entry);
  }
  return out;
}

function parseSubPagesDescriptions(src: string, category: string, recordName: string): Extracted[] {
  const out: Extracted[] = [];
  const recRe = new RegExp(`export\\s+const\\s+${recordName}\\s*:[^=]*=\\s*\\{`);
  const rm = recRe.exec(src);
  if (!rm) return out;
  const recordBodyStart = rm.index + rm[0].length;
  const { body: recordBody } = readBalanced(src, recordBodyStart, "{", "}");

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

    const descRe = /(?:^|[\s,{])heroDescription\s*:\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/;
    const dm = descRe.exec(body);
    if (!dm) continue;
    try {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      const v = new Function(`return ${dm[1]}`)() as string;
      if (typeof v === "string" && v.trim()) {
        out.push({ key: `${category}/${subKey}`, description: v });
      }
    } catch { /* ignore */ }
  }
  return out;
}

// ─── i18n value builders (internationalized-array v5) ─────────────────────
// v5 introduces a `language` field on each value in addition to `_key`.
// Norwegian is populated; English is left empty for editors to translate,
// but the row is created so the language field appears in Studio.
const i18nString = (noValue: string, enValue = "") =>
  LANGS.map((lang) => ({
    _key: lang,
    _type: "internationalizedArrayStringValue",
    language: lang,
    value: lang === "no" ? noValue : enValue,
  }));

const i18nText = (noValue: string, enValue = "") =>
  LANGS.map((lang) => ({
    _key: lang,
    _type: "internationalizedArrayTextValue",
    language: lang,
    value: lang === "no" ? noValue : enValue,
  }));

const isEmpty = (v: any) =>
  v === undefined || v === null ||
  (Array.isArray(v) && (v.length === 0 || v.every((x: any) => !x?.value)));

async function run() {
  console.log("📖 Reading source files …");
  const tcEntries = parseTreatmentContent(fs.readFileSync(SOURCE, "utf8"));
  const gynEntries = parseSubPagesDescriptions(fs.readFileSync(GYN_SOURCE, "utf8"), "gynekologi", "gynekologiSubPages");
  const ferEntries = parseSubPagesDescriptions(fs.readFileSync(FER_SOURCE, "utf8"), "fertilitet", "fertilitetSubPages");
  console.log(`   treatmentContent.ts:    ${tcEntries.length} entries`);
  console.log(`   gynekologiSubPages:     ${gynEntries.length} heroDescriptions`);
  console.log(`   fertilitetSubPages:     ${ferEntries.length} heroDescriptions`);

  const merged = new Map<string, Extracted>();
  for (const e of [...gynEntries, ...ferEntries]) merged.set(e.key, e);
  for (const e of tcEntries) {
    const existing = merged.get(e.key);
    merged.set(e.key, {
      key: e.key,
      description: e.description ?? existing?.description,
      sections: e.sections ?? existing?.sections,
    });
  }
  const entries = [...merged.values()];
  console.log(`   → ${entries.length} unique treatment keys to migrate.`);
  if (FORCE) console.log("   ⚠ FORCE=1 — existing values WILL be overwritten.");

  console.log("\n🏥 Fetching treatment docs …");
  const treatments: Array<{
    _id: string;
    slug?: string;
    categorySlug?: string;
    description?: any;
    reasons?: any;
    reasonsLayout?: string;
  }> = await sanityClient.fetch(
    `*[_type == "treatment" && !(_id in path("drafts.**"))]{
       _id,
       description,
       reasons,
       reasonsLayout,
       "slug": coalesce(slug[language == "no"][0].value.current, slug[_key == "no"][0].value.current, slug.current),
       "categorySlug": coalesce(category->slug[language == "no"][0].value.current, category->slug[_key == "no"][0].value.current, category->slug.current)
     }`
  );
  const byKey = new Map<string, typeof treatments[number]>();
  for (const t of treatments) {
    if (t.categorySlug && t.slug) byKey.set(`${t.categorySlug}/${t.slug}`, t);
  }
  console.log(`   Loaded ${byKey.size} treatments.`);

  let patched = 0;
  let descCount = 0;
  let reasonsCount = 0;
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

    if (e.description && (FORCE || isEmpty(doc.description))) {
      patch.description = i18nText(e.description);
    }

    if (e.sections?.length && (FORCE || isEmpty(doc.reasons))) {
      patch.reasons = e.sections.map((s, idx) => {
        const anchor = s.id || slugifyKey(s.heading).slice(0, 40) || `section-${idx}`;
        const key = `about-${idx}-${shortHash(anchor + s.heading)}`;
        return {
          _key: key,
          _type: "object",
          // `reasons` items have {n, title, desc}. We leave `n` empty
          // (accordion layout doesn't render numbers) and map heading→title,
          // content→desc.
          title: i18nString(s.heading),
          desc: i18nText(s.content || ""),
        };
      });
      // Force accordion layout so the section renders like the old "Om …" block.
      patch.reasonsLayout = "accordion";
    }

    if (Object.keys(patch).length === 0) { skipped.push(e.key); continue; }

    await sanityClient.patch(doc._id).set(patch).commit();
    const parts: string[] = [];
    if (patch.description) { parts.push("description"); descCount++; }
    if (patch.reasons) { parts.push(`reasons(${(patch.reasons as any[]).length}, accordion)`); reasonsCount++; }
    console.log(`   ✓ ${e.key} → ${parts.join(" + ")}`);
    patched++;
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`✅ Patched: ${patched} treatments  (description: ${descCount}, reasons: ${reasonsCount})`);
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
