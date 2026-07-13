/**
 * Migration: Populate `heroThemes` on every treatment doc from
 * `src/data/treatmentContent.ts` → per-treatment `themes: string[]`
 * (the non-clickable chips shown as "Vi behandler blant annet: …").
 *
 * Source of truth:
 *   src/data/treatmentContent.ts
 *   Key format: "categorySlug/subSlug", e.g. "flere-fagomrader/endokrinologi".
 *
 * Slug mapping:
 *   - Sanity category slug `ovrige` maps to legacy live-data key `flere-fagomrader`.
 *
 * Field written:
 *   heroThemes — array of `internationalizedArrayString` (v5 i18n).
 *   Each entry has NO value = original chip text, EN value = same text (fallback;
 *   editors can translate afterwards in Sanity Studio).
 *
 * Idempotent. Supports `--dry-run` and `FORCE=1` to overwrite non-empty values.
 *
 * Usage:
 *   cd test
 *   SANITY_TOKEN=xxx npx tsx sanity/migrate-treatment-hero-themes.ts --dry-run
 *   SANITY_TOKEN=xxx npx tsx sanity/migrate-treatment-hero-themes.ts
 *   FORCE=1 SANITY_TOKEN=xxx npx tsx sanity/migrate-treatment-hero-themes.ts
 */
import { sanityClient } from "./config";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const DRY_RUN = process.argv.includes("--dry-run");
const FORCE = process.env.FORCE === "1";

type I18nStringValue = {
  _key: string;
  _type: "internationalizedArrayStringValue";
  language: string;
  value: string;
};
type I18nString = { _key: string; _type: "internationalizedArrayString"; value: I18nStringValue[] };

type Treatment = {
  _id: string;
  title: any;
  slug?: string;
  categorySlug?: string;
  heroThemes?: any[];
};

const pickNo = (v: any): string =>
  Array.isArray(v) ? (v.find((x: any) => x.language === "no")?.value || v[0]?.value || "") : (v || "");

const i18nString = (no: string, en?: string): I18nStringValue[] => [
  { _key: "no", _type: "internationalizedArrayStringValue", language: "no", value: no },
  { _key: "en", _type: "internationalizedArrayStringValue", language: "en", value: en ?? no },
];

/**
 * Parse src/data/treatmentContent.ts and return a map of
 *   "category/slug" -> string[] (themes).
 */
function loadThemesMap(): Record<string, string[]> {
  const path = resolve(__dirname, "../../src/data/treatmentContent.ts");
  const src = readFileSync(path, "utf8");
  const keyRe = /"([a-z0-9-]+)\/([a-z0-9-]+)"\s*:\s*\{/g;
  const keys: { key: string; index: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = keyRe.exec(src)) !== null) {
    keys.push({ key: `${m[1]}/${m[2]}`, index: m.index });
  }

  const map: Record<string, string[]> = {};
  for (let i = 0; i < keys.length; i++) {
    const start = keys[i].index;
    const end = keys[i + 1]?.index ?? src.length;
    const chunk = src.slice(start, end);
    const themesMatch = chunk.match(/themes\s*:\s*\[([^\]]*)\]/);
    if (!themesMatch) continue;
    const values = Array.from(themesMatch[1].matchAll(/["']([^"']+)["']/g)).map((mm) => mm[1]);
    if (values.length > 0) map[keys[i].key] = values;
  }
  return map;
}

async function run() {
  console.log(`🔍 Loading themes from src/data/treatmentContent.ts…`);
  const liveMap = loadThemesMap();
  console.log(`   Parsed ${Object.keys(liveMap).length} treatment entries with themes.`);

  console.log(`🔍 Fetching treatments…${DRY_RUN ? " (DRY RUN)" : ""}${FORCE ? " (FORCE)" : ""}`);
  const treatments: Treatment[] = await sanityClient.fetch(
    `*[_type == "treatment"]{
      _id,
      title,
      "slug": coalesce(slug[language == "no"][0].value.current, slug[_key == "no"][0].value.current, slug[0].value.current),
      "categorySlug": coalesce(category->slug[language == "no"][0].value.current, category->slug[_key == "no"][0].value.current, category->slug[0].value.current),
      heroThemes
    }`
  );
  console.log(`   Found ${treatments.length} treatment(s).\n`);

  let updated = 0;
  let skipped = 0;
  let missing = 0;
  let errors = 0;

  for (const t of treatments) {
    const label = pickNo(t.title) || t._id;
    try {
      // Slug mapping: Sanity category `ovrige` → legacy live key `flere-fagomrader`.
      let liveKey = "";
      if (t.categorySlug && t.slug) {
        const catKey = t.categorySlug === "ovrige" ? "flere-fagomrader" : t.categorySlug;
        liveKey = `${catKey}/${t.slug}`;
      }
      const themes = liveKey ? liveMap[liveKey] : undefined;

      if (!themes || themes.length === 0) {
        console.log(`·  No themes for: ${label}  [${liveKey || "no-key"}]`);
        missing++;
        continue;
      }

      const existing = Array.isArray(t.heroThemes) ? t.heroThemes : [];
      if (existing.length > 0 && !FORCE) {
        console.log(`⏭  Skipped (already has ${existing.length}): ${label}`);
        skipped++;
        continue;
      }

      const heroThemes: I18nString[] = themes.map((val) => ({
        _key: randomUUID(),
        _type: "internationalizedArrayString",
        value: i18nString(val),
      }));

      if (!DRY_RUN) {
        await sanityClient.patch(t._id).set({ heroThemes }).commit();
      }
      console.log(`✓ Updated: ${label}  (${themes.length} chip${themes.length === 1 ? "" : "s"})`);
      updated++;
    } catch (err: any) {
      console.error(`✗ Failed: ${label} — ${err?.message || err}`);
      errors++;
    }
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`Processed:      ${treatments.length}`);
  console.log(`Updated:        ${updated}`);
  console.log(`Skipped:        ${skipped}`);
  console.log(`No source data: ${missing}`);
  console.log(`Errors:         ${errors}`);
  if (DRY_RUN) console.log("\n(dry run — no changes committed)");
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
