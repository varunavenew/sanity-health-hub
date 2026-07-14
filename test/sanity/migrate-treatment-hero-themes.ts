/**
 * Migration: Populate `heroThemes` and `description` on every treatment doc
 * from `src/data/treatmentContent.ts`.
 *
 * Fields written:
 *   - heroThemes  ← themes: string[]       (array of internationalizedArrayString)
 *   - description ← description: string    (internationalizedArrayText)
 *
 * Slug mapping:
 *   Sanity category slug `ovrige` maps to legacy live-data key `flere-fagomrader`.
 *
 * Behaviour:
 *   - Skips a field if the doc already has a non-empty value (unless FORCE=1).
 *   - v5 flat i18n format is used for both fields.
 *
 * Idempotent. Supports `--dry-run` and `FORCE=1`.
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
type I18nTextValue = {
    _key: string;
    _type: "internationalizedArrayTextValue";
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
    description?: any[];
};

const pickNo = (v: any): string =>
    Array.isArray(v) ? (v.find((x: any) => x.language === "no")?.value || v[0]?.value || "") : (v || "");

const hasI18nContent = (v: any): boolean =>
    Array.isArray(v) && v.some((x: any) => typeof x?.value === "string" && x.value.trim() !== "");

const i18nStringVals = (no: string, en?: string): I18nStringValue[] => [
    { _key: "no", _type: "internationalizedArrayStringValue", language: "no", value: no },
    { _key: "en", _type: "internationalizedArrayStringValue", language: "en", value: en ?? no },
];
const i18nTextVals = (no: string, en?: string): I18nTextValue[] => [
    { _key: "no", _type: "internationalizedArrayTextValue", language: "no", value: no },
    { _key: "en", _type: "internationalizedArrayTextValue", language: "en", value: en ?? no },
];

/**
 * Parse src/data/treatmentContent.ts and return
 *   "category/slug" -> { themes?: string[]; description?: string }.
 *
 * Uses JSON.parse to safely unescape captured string literals.
 */
function loadContentMap(): Record<string, { themes?: string[]; description?: string }> {
    const path = resolve(__dirname, "../../src/data/treatmentContent.ts");
    const src = readFileSync(path, "utf8");
    const keyRe = /"([a-z0-9-]+)\/([a-z0-9-]+)"\s*:\s*\{/g;
    const keys: { key: string; index: number }[] = [];
    let m: RegExpExecArray | null;
    while ((m = keyRe.exec(src)) !== null) {
        keys.push({ key: `${m[1]}/${m[2]}`, index: m.index });
    }

    const map: Record<string, { themes?: string[]; description?: string }> = {};
    for (let i = 0; i < keys.length; i++) {
        const start = keys[i].index;
        const end = keys[i + 1]?.index ?? src.length;
        const chunk = src.slice(start, end);
        const entry: { themes?: string[]; description?: string } = {};

        const themesMatch = chunk.match(/themes\s*:\s*\[([^\]]*)\]/);
        if (themesMatch) {
            const values = Array.from(themesMatch[1].matchAll(/["']([^"']+)["']/g)).map((mm) => mm[1]);
            if (values.length > 0) entry.themes = values;
        }

        // Match description: "..." with escape handling. TS source uses double quotes.
        const descMatch = chunk.match(/description\s*:\s*"((?:[^"\\]|\\.)*)"/);
        if (descMatch) {
            try {
                const unescaped = JSON.parse('"' + descMatch[1] + '"') as string;
                if (unescaped.trim()) entry.description = unescaped;
            } catch {
                /* ignore parse issues */
            }
        }

        if (entry.themes || entry.description) map[keys[i].key] = entry;
    }
    return map;
}

async function run() {
    console.log(`🔍 Loading content from src/data/treatmentContent.ts…`);
    const liveMap = loadContentMap();
    const withThemes = Object.values(liveMap).filter((e) => e.themes?.length).length;
    const withDesc = Object.values(liveMap).filter((e) => e.description).length;
    console.log(`   Parsed ${Object.keys(liveMap).length} entries (themes: ${withThemes}, description: ${withDesc}).`);

    console.log(`🔍 Fetching treatments…${DRY_RUN ? " (DRY RUN)" : ""}${FORCE ? " (FORCE)" : ""}`);
    const treatments: Treatment[] = await sanityClient.fetch(
        `*[_type == "treatment"]{
      _id,
      title,
      "slug": coalesce(slug[language == "no"][0].value.current, slug[_key == "no"][0].value.current, slug[0].value.current),
      "categorySlug": coalesce(category->slug[language == "no"][0].value.current, category->slug[_key == "no"][0].value.current, category->slug[0].value.current),
      heroThemes,
      description
    }`
    );
    console.log(`   Found ${treatments.length} treatment(s).\n`);

    let touched = 0;
    let themesSet = 0;
    let descSet = 0;
    let skipped = 0;
    let missing = 0;
    let errors = 0;

    for (const t of treatments) {
        const label = pickNo(t.title) || t._id;
        try {
            let liveKey = "";
            if (t.categorySlug && t.slug) {
                const catKey = t.categorySlug === "ovrige" ? "flere-fagomrader" : t.categorySlug;
                liveKey = `${catKey}/${t.slug}`;
            }
            const entry = liveKey ? liveMap[liveKey] : undefined;

            if (!entry) {
                console.log(`·  No source data for: ${label}  [${liveKey || "no-key"}]`);
                missing++;
                continue;
            }

            const patch: Record<string, unknown> = {};

            // heroThemes
            if (entry.themes && entry.themes.length > 0) {
                const alreadyHas = Array.isArray(t.heroThemes) && t.heroThemes.length > 0;
                if (!alreadyHas || FORCE) {
                    patch.heroThemes = entry.themes.map((val) => i18nStringVals(val));
                }
            }

            // description
            if (entry.description) {
                if (!hasI18nContent(t.description) || FORCE) {
                    patch.description = i18nTextVals(entry.description);
                }
            }

            if (Object.keys(patch).length === 0) {
                console.log(`⏭  Skipped (already populated): ${label}`);
                skipped++;
                continue;
            }

            if (!DRY_RUN) {
                await sanityClient.patch(t._id).set(patch).commit();
            }
            const parts: string[] = [];
            if ("heroThemes" in patch) {
                parts.push(`heroThemes×${entry.themes!.length}`);
                themesSet++;
            }
            if ("description" in patch) {
                parts.push(`description`);
                descSet++;
            }
            console.log(`✓ Updated: ${label}  (${parts.join(", ")})`);
            touched++;
        } catch (err: any) {
            console.error(`✗ Failed: ${label} — ${err?.message || err}`);
            errors++;
        }
    }

    console.log("\n──────────────────────────────────────────");
    console.log(`Processed:       ${treatments.length}`);
    console.log(`Docs updated:    ${touched}`);
    console.log(`  heroThemes:    ${themesSet}`);
    console.log(`  description:   ${descSet}`);
    console.log(`Skipped:         ${skipped}`);
    console.log(`No source data:  ${missing}`);
    console.log(`Errors:          ${errors}`);
    if (DRY_RUN) console.log("\n(dry run — no changes committed)");
}

run().catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
});
