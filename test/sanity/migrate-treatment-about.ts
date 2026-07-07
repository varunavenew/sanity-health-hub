#!/usr/bin/env npx tsx
/**
 * Migration: per-treatment "Om [behandling]" section content.
 *
 * Populates the two Sanity fields that render the "Om …" block on a treatment
 * page (intro paragraph + accordion sub-sections like "Formålet",
 * "Spesialisering", etc.):
 *
 *   - `description` (internationalizedArrayText)  ← left column intro copy
 *   - `sections`    (array of { id, heading, content })  ← right column blocks
 *
 * Source of truth: src/data/treatmentContent.ts (fields `description` and
 * `sections`). Only patches fields that are currently empty/missing on the
 * Sanity doc, so editor changes are never overwritten. Pass FORCE=1 to
 * overwrite existing values.
 *
 * Idempotent. Safe to re-run.
 *
 * NOTE: "Spesialister som utfører dette" (relatedSpecialists) is handled by
 * `sanity/migrate-related-specialists.ts` — no changes needed here.
 *
 * Usage:
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-treatment-about.ts
 *   cd test && SANITY_TOKEN=<token> FORCE=1 npx tsx sanity/migrate-treatment-about.ts
 */
import * as fs from "fs";
import * as path from "path";
import { sanityClient } from "./config";

const SOURCE = path.resolve(__dirname, "../../src/data/treatmentContent.ts");
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

        // description: string literal (may span multiple lines with \n escapes)
        const descRe = /(?:^|[\s,{])description\s*:\s*("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/;
        const dMatch = descRe.exec(body);
        if (dMatch) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-implied-eval
                const value = new Function(`return ${dMatch[1]}`)() as string;
                if (typeof value === "string" && value.trim()) entry.description = value;
            } catch { /* ignore */ }
        }

        // sections: array literal
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

// i18n helpers (Norwegian-only; frontend falls back to no when en missing)
const i18nString = (value: string) =>
    [{ _key: "no", _type: "internationalizedArrayStringValue", value }];
const i18nText = (value: string) =>
    [{ _key: "no", _type: "internationalizedArrayTextValue", value }];

const isEmpty = (v: any) =>
    v === undefined || v === null ||
    (Array.isArray(v) && (v.length === 0 || v.every((x: any) => !x?.value)));

async function run() {
    console.log("📖 Reading treatmentContent.ts …");
    const src = fs.readFileSync(SOURCE, "utf8");
    const entries = parseTreatmentContent(src);
    console.log(`   Parsed ${entries.length} entries (description and/or sections).`);
    if (FORCE) console.log("   ⚠ FORCE=1 — existing values WILL be overwritten.");

    console.log("\n🏥 Fetching treatment docs …");
    const treatments: Array<{ _id: string; slug?: string; categorySlug?: string; description?: any; sections?: any }> =
        await sanityClient.fetch(
            `*[_type == "treatment" && !(_id in path("drafts.**"))]{
         _id,
         description,
         sections,
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
    let descCount = 0;
    let secCount = 0;
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

        if (e.sections?.length && (FORCE || isEmpty(doc.sections))) {
            patch.sections = e.sections.map((s, idx) => {
                const anchor = s.id || slugifyKey(s.heading).slice(0, 40) || `section-${idx}`;
                const obj: Record<string, unknown> = {
                    _key: `sec-${idx}-${anchor.slice(0, 10)}`,
                    _type: "object",
                    id: anchor,
                    heading: i18nString(s.heading),
                };
                if (s.content) obj.content = i18nText(s.content);
                return obj;
            });
        }

        if (Object.keys(patch).length === 0) { skipped.push(e.key); continue; }

        await sanityClient.patch(doc._id).set(patch).commit();
        const parts: string[] = [];
        if (patch.description) { parts.push("description"); descCount++; }
        if (patch.sections) { parts.push(`sections(${(patch.sections as any[]).length})`); secCount++; }
        console.log(`   ✓ ${e.key} → ${parts.join(" + ")}`);
        patched++;
    }

    console.log("\n──────────────────────────────────────────");
    console.log(`✅ Patched: ${patched} treatments  (description: ${descCount}, sections: ${secCount})`);
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
