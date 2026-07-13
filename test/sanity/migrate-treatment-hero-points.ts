#!/usr/bin/env npx tsx
/**
 * Migration: populate `heroPoints` on every treatment document.
 *
 * The live treatment pages render three check-marked trust chips under the
 * hero (e.g. "Ingen ventetid ✓ Ingen henvisning ✓ Erfarne spesialister").
 * They are produced by `treatmentToSubLayout.tsx`:
 *
 *   const heroPoints =
 *     benefitItems.length >= 2
 *       ? benefitItems                                   // derived from data.benefits
 *       : [
 *           { title: "Ingen ventetid",       desc: "Du finner time hos oss innen få dager." },
 *           { title: "Ingen henvisning",     desc: "Du kan bestille direkte uten henvisning fra fastlege." },
 *           { title: "Erfarne spesialister", desc: "Du møter leger som jobber med dette til daglig." },
 *         ];
 *
 * This script reproduces that logic exactly by reading
 * `src/data/treatmentContent.ts` and writing the resolved `heroPoints`
 * into the matching Sanity `treatment` doc using the internationalized
 * array v5 format (each value has `_key` + `language`).
 *
 * Idempotent — only patches when the field is empty. Pass FORCE=1 to
 * overwrite. Supports --dry-run to preview without writing.
 *
 * Usage:
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-treatment-hero-points.ts
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-treatment-hero-points.ts --dry-run
 *   cd test && SANITY_TOKEN=<token> FORCE=1 npx tsx sanity/migrate-treatment-hero-points.ts
 */
import * as fs from "fs";
import * as path from "path";
import { sanityClient } from "./config";

const SOURCE = path.resolve(__dirname, "../../src/data/treatmentContent.ts");
const FORCE = process.env.FORCE === "1";
const DRY = process.argv.includes("--dry-run");

const LANGS = ["no", "en"] as const;
type Lang = (typeof LANGS)[number];

// ─── Fallback trio (mirrors treatmentToSubLayout.tsx lines 192-194) ──────
const FALLBACK_HERO_POINTS: Array<{ title: string; desc: string; titleEn: string; descEn: string }> = [
    {
        title: "Ingen ventetid",
        desc: "Du finner time hos oss innen få dager.",
        titleEn: "No waiting time",
        descEn: "You'll find an appointment with us within a few days.",
    },
    {
        title: "Ingen henvisning",
        desc: "Du kan bestille direkte uten henvisning fra fastlege.",
        titleEn: "No referral",
        descEn: "You can book directly without a referral from your GP.",
    },
    {
        title: "Erfarne spesialister",
        desc: "Du møter leger som jobber med dette til daglig.",
        titleEn: "Experienced specialists",
        descEn: "You'll meet doctors who work with this every day.",
    },
];

// ─── Helpers copied verbatim from treatmentToSubLayout.tsx ───────────────
const splitTitleDesc = (s: string): { title: string; desc: string } => {
    const m = s.match(/^(.{3,60}?)\s[—–:-]\s(.+)$/);
    if (m) return { title: m[1].trim(), desc: m[2].trim() };
    return { title: s.trim(), desc: "" };
};

// ─── Parse src/data/treatmentContent.ts ──────────────────────────────────
function readBalanced(src: string, start: number, open: string, close: string): { end: number; body: string } {
    let depth = 1, i = start, inStr: string | null = null, escape = false;
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

interface Extracted { key: string; benefits?: string[] }

function parseTreatmentContent(src: string): Extracted[] {
    const out: Extracted[] = [];
    const entryRe = /"([a-z0-9-]+\/[a-z0-9-]+)":\s*\{/g;
    let m: RegExpExecArray | null;
    while ((m = entryRe.exec(src)) !== null) {
        const key = m[1];
        const bodyStart = m.index + m[0].length;
        const { end: bodyEnd, body } = readBalanced(src, bodyStart, "{", "}");
        entryRe.lastIndex = bodyEnd + 1;

        const bMatch = /(?:^|[\s,{])benefits\s*:\s*\[/.exec(body);
        if (!bMatch) { out.push({ key }); continue; }
        const start = bMatch.index + bMatch[0].length;
        const { body: arrBody } = readBalanced(body, start, "[", "]");
        try {
            // eslint-disable-next-line @typescript-eslint/no-implied-eval
            const arr = new Function(`return [${arrBody}]`)() as string[];
            out.push({ key, benefits: Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : undefined });
        } catch {
            out.push({ key });
        }
    }
    return out;
}

// ─── i18n value builders (v5) ─────────────────────────────────────────────
const i18nString = (no: string, en = "") =>
    LANGS.map((lang) => ({
        _key: lang,
        _type: "internationalizedArrayStringValue",
        language: lang,
        value: lang === "no" ? no : en,
    }));

const i18nText = (no: string, en = "") =>
    LANGS.map((lang) => ({
        _key: lang,
        _type: "internationalizedArrayTextValue",
        language: lang,
        value: lang === "no" ? no : en,
    }));

const isEmpty = (v: any) => v === undefined || v === null || (Array.isArray(v) && v.length === 0);

function shortHash(text: string): string {
    let h = 0;
    for (let i = 0; i < text.length; i++) h = ((h << 5) - h + text.charCodeAt(i)) | 0;
    return Math.abs(h).toString(36).slice(0, 6);
}

// ─── Build heroPoints (mirrors treatmentToSubLayout.tsx lines 184-195) ──
function buildHeroPoints(benefits: string[] | undefined) {
    const benefitItems = (benefits ?? []).slice(0, 4).map((b) => {
        const { title, desc } = splitTitleDesc(b);
        return { title, desc: desc || "" };
    });

    if (benefitItems.length >= 2) {
        return benefitItems.map((item, i) => ({
            _key: `hp-${i}-${shortHash(item.title)}`,
            _type: "object",
            title: i18nString(item.title),
            desc: i18nText(item.desc),
        }));
    }

    // Fallback trio — same three chips shown in the current live design.
    return FALLBACK_HERO_POINTS.map((item, i) => ({
        _key: `hp-fallback-${i}`,
        _type: "object",
        title: i18nString(item.title, item.titleEn),
        desc: i18nText(item.desc, item.descEn),
    }));
}

async function run() {
    console.log("📖 Reading src/data/treatmentContent.ts …");
    const entries = parseTreatmentContent(fs.readFileSync(SOURCE, "utf8"));
    console.log(`   Parsed ${entries.length} treatment keys.`);
    if (DRY) console.log("   🔍 DRY RUN — no writes will be made.");
    if (FORCE) console.log("   ⚠ FORCE=1 — existing heroPoints WILL be overwritten.");

    console.log("\n🏥 Fetching treatment docs …");
    const treatments: Array<{ _id: string; slug?: string; categorySlug?: string; heroPoints?: any }> =
        await sanityClient.fetch(
            `*[_type == "treatment"]{
         _id,
         heroPoints,
         "slug": coalesce(slug[language == "no"][0].value.current, slug[_key == "no"][0].value.current, slug.current),
         "categorySlug": coalesce(category->slug[language == "no"][0].value.current, category->slug[_key == "no"][0].value.current, category->slug.current)
       }`
        );

    const byKey = new Map<string, typeof treatments[number]>();
    for (const t of treatments) if (t.categorySlug && t.slug) byKey.set(`${t.categorySlug}/${t.slug}`, t);
    console.log(`   Loaded ${byKey.size} treatments.`);

    let patched = 0, fromBenefits = 0, fromFallback = 0, skipped = 0, errors = 0;
    const missing: string[] = [];

    // Include every treatment doc, even if it isn't in treatmentContent.ts —
    // those get the fallback trio too so the badges appear on every page.
    const allKeys = new Set<string>([...entries.map((e) => e.key), ...byKey.keys()]);

    for (const key of allKeys) {
        const doc = byKey.get(key);
        if (!doc) { missing.push(key); continue; }

        if (!FORCE && !isEmpty(doc.heroPoints)) { skipped++; continue; }

        const src = entries.find((e) => e.key === key);
        const points = buildHeroPoints(src?.benefits);
        const usedFallback = !(src?.benefits && src.benefits.length >= 2);
        if (usedFallback) fromFallback++; else fromBenefits++;

        try {
            if (!DRY) await sanityClient.patch(doc._id).set({ heroPoints: points }).commit();
            console.log(
                `   ${DRY ? "[dry]" : "✓"} ${key} → ${points.length} points (${usedFallback ? "fallback" : "from benefits"})`
            );
            patched++;
        } catch (err) {
            errors++;
            console.error(`   ✗ ${key} — ${(err as Error).message}`);
        }
    }

    console.log("\n──────────────────────────────────────────");
    console.log(`✅ Patched: ${patched}  (from benefits: ${fromBenefits}, fallback: ${fromFallback})`);
    if (skipped) console.log(`↷  Skipped (already populated, use FORCE=1 to overwrite): ${skipped}`);
    if (errors) console.log(`✗  Errors: ${errors}`);
    if (missing.length) {
        console.log(`⚠  In treatmentContent.ts but no Sanity doc (${missing.length}):`);
        missing.slice(0, 20).forEach((k) => console.log(`     - ${k}`));
    }
}

run().catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
});
