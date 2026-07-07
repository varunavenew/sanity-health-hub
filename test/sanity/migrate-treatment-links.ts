#!/usr/bin/env npx tsx
/**
 * Migration: per-treatment `linkedServices` and `relatedSpecialists`.
 *
 * Reads test/sanity/migrate-treatments.ts as source-of-truth and PATCHES each
 * matching Sanity `treatment` document. Only `linkedServices` and
 * `relatedSpecialists` are touched — no other fields are overwritten.
 *
 * Idempotent: safe to re-run.
 *
 * Usage:
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-treatment-links.ts
 */
import * as fs from "fs";
import * as path from "path";
import { sanityClient } from "./config";

const SOURCE = path.resolve(__dirname, "migrate-treatments.ts");

// ── slug helper (matches migrate-treatments.ts) ──────────────
function slugifyKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/æ/g, "ae").replace(/ø/g, "o").replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── bracket-balanced extractor ───────────────────────────────
// Given source text and the index just AFTER an opening `[`, returns the
// substring up to (but not including) the matching `]`, respecting strings
// and nested brackets.
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

// ── parse migrate-treatments.ts ──────────────────────────────
interface Extracted {
  key: string;
  linkedServices?: Array<{ label: string; description: string; path: string }>;
  relatedSpecialists?: string[];
}

function parseTreatmentContent(src: string): Extracted[] {
  const out: Extracted[] = [];
  const entryRe = /key:\s*["']([a-z0-9-]+\/[a-z0-9-]+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = entryRe.exec(src)) !== null) {
    const key = m[1];
    const bodyStart = src.lastIndexOf("{", m.index) + 1;
    const { body } = readBalanced(src, bodyStart, "{", "}");

    const entry: Extracted = { key };

    // linkedServices: [ ... ]
    const lsMatch = /linkedServices\s*:\s*\[/.exec(body);
    if (lsMatch) {
      const start = lsMatch.index + lsMatch[0].length;
      const { body: arrBody } = readBalanced(body, start, "[", "]");
      try {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        const arr = new Function(`return [${arrBody}]`)() as Extracted["linkedServices"];
        if (Array.isArray(arr) && arr.length) entry.linkedServices = arr;
      } catch (e) {
        console.warn(`   ⚠ ${key}: failed to parse linkedServices`, (e as Error).message);
      }
    }

    // relatedSpecialists: [ ... ]
    const rsMatch = /relatedSpecialists\s*:\s*\[/.exec(body);
    if (rsMatch) {
      const start = rsMatch.index + rsMatch[0].length;
      const { body: arrBody } = readBalanced(body, start, "[", "]");
      try {
        const arr = new Function(`return [${arrBody}]`)() as string[];
        if (Array.isArray(arr) && arr.length) entry.relatedSpecialists = arr;
      } catch (e) {
        console.warn(`   ⚠ ${key}: failed to parse relatedSpecialists`, (e as Error).message);
      }
    }

    if (entry.linkedServices || entry.relatedSpecialists) out.push(entry);
  }
  return out;
}

// ── shape converters (Sanity i18n arrays) ────────────────────
function i18nString(value: string) {
  return [{ _key: "no", _type: "internationalizedArrayStringValue", value }];
}
function i18nText(value: string) {
  return [{ _key: "no", _type: "internationalizedArrayTextValue", value }];
}

// ── main ─────────────────────────────────────────────────────
async function run() {
  console.log("📖 Reading migrate-treatments.ts …");
  const src = fs.readFileSync(SOURCE, "utf8");
  const entries = parseTreatmentContent(src);
  console.log(`   Parsed ${entries.length} entries with links.`);

  console.log("\n👥 Fetching specialist slug → _id …");
  const specialists: Array<{ _id: string; slug?: any }> = await sanityClient.fetch(
    `*[_type == "specialist" && !(_id in path("drafts.**"))]{
       _id,
       "slug": coalesce(slug[language == "no"][0].value.current, slug.current, slug)
     }`
  );
  const specialistIdBySlug = new Map<string, string>();
  for (const s of specialists) {
    const slug = typeof s.slug === "string" ? s.slug : s.slug?.current;
    if (slug) specialistIdBySlug.set(slug, s._id);
  }
  console.log(`   Loaded ${specialistIdBySlug.size} specialists.`);

  console.log("\n🏥 Fetching treatment slug → _id …");
  const treatments: Array<{ _id: string; slug?: any; category?: any }> = await sanityClient.fetch(
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
  const missingTreatments: string[] = [];
  const missingSpecialists: Array<{ treatment: string; slug: string }> = [];

  for (const e of entries) {
    // Resolve treatment _id — try direct match by category/slug first,
    // fall back to the deterministic `treatment-<slug(key)>` id.
    let treatmentId = treatmentIdByKey.get(e.key);
    if (!treatmentId) {
      const fallback = `treatment-${slugifyKey(e.key)}`;
      const exists = treatments.find((t) => t._id === fallback);
      if (exists) treatmentId = fallback;
    }
    if (!treatmentId) {
      missingTreatments.push(e.key);
      continue;
    }

    const patch: Record<string, any> = {};

    if (e.linkedServices?.length) {
      patch.linkedServices = e.linkedServices.map((ls, idx) => ({
        _key: `ls-${idx}-${slugifyKey(ls.path).slice(-8)}`,
        _type: "object",
        label: i18nString(ls.label),
        description: i18nText(ls.description),
        path: ls.path,
      }));
    }

    if (e.relatedSpecialists?.length) {
      const refs = e.relatedSpecialists
        .map((slug, idx) => {
          const id = specialistIdBySlug.get(slug);
          if (!id) {
            missingSpecialists.push({ treatment: e.key, slug });
            return null;
          }
          return { _type: "reference" as const, _ref: id, _key: `spec-${idx}-${id.slice(-6)}` };
        })
        .filter((x): x is { _type: "reference"; _ref: string; _key: string } => !!x);
      if (refs.length) patch.relatedSpecialists = refs;
    }

    if (Object.keys(patch).length === 0) continue;

    await sanityClient.patch(treatmentId).set(patch).commit();
    const parts = [
      patch.linkedServices ? `${patch.linkedServices.length} links` : null,
      patch.relatedSpecialists ? `${patch.relatedSpecialists.length} specialists` : null,
    ].filter(Boolean).join(" + ");
    console.log(`   ✓ ${e.key} → ${parts}`);
    patched++;
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`✅ Patched: ${patched} treatments`);
  if (missingTreatments.length) {
    console.log(`⚠  Treatment doc not found in Sanity (${missingTreatments.length}):`);
    missingTreatments.forEach((k) => console.log(`     - ${k}`));
  }
  if (missingSpecialists.length) {
    console.log(`⚠  Specialist slug unresolved (${missingSpecialists.length}):`);
    missingSpecialists.forEach((u) => console.log(`     - "${u.slug}" in "${u.treatment}"`));
  }
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
