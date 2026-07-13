/**
 * Migration: Ensure every treatment has a `pageSectionSpecialists` block in `pageSections`,
 * populated with the SAME specialists the live treatment page renders.
 *
 * Source of truth (in priority order):
 *   1. `src/data/treatmentContent.ts` → per-treatment `relatedSpecialists: string[]`
 *      (list of specialist SLUGS). This is what SubTreatmentLayout whitelists on.
 *      → We map those slugs to Sanity specialist doc _ids and set manualRefs.
 *      → Example: "fertilitet/donorbehandling" → ["kristian-ophaug"] → 1 manual ref.
 *   2. If the treatment has no entry in treatmentContent, we fall back to the doc's
 *      existing `relatedSpecialists` refs in Sanity.
 *   3. If neither is available, we fall back to `categorySlug` = category slug.
 *
 * Behavior per treatment doc:
 *   - First, filters out/deletes any legacy `sectionSpecialists` blocks.
 *   - If `pageSections` already contains a `pageSectionSpecialists` block → UPDATE it in
 *     place, mapping correct fields and overwriting `specialists` / `categorySlug` to match
 *     the source of truth.
 *   - Otherwise → APPEND a new `pageSectionSpecialists` block.
 *
 * Idempotent. Supports `--dry-run`.
 *
 * Usage:
 *   cd test
 *   SANITY_TOKEN=xxx npx tsx sanity/migrate-treatment-specialists-section.ts --dry-run
 *   SANITY_TOKEN=xxx npx tsx sanity/migrate-treatment-specialists-section.ts
 */
import { sanityClient } from "./config";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const DRY_RUN = process.argv.includes("--dry-run");

type Ref = { _type: "reference"; _ref: string; _key?: string };
type PageSectionSpecialists = {
    _type: "pageSectionSpecialists";
    _key: string;
    title?: { _key: string; _type: "internationalizedArrayStringValue"; language: string; value: string }[];
    description?: { _key: string; _type: "internationalizedArrayTextValue"; language: string; value: string }[];
    displayMode?: "all" | "manual" | "category";
    specialists?: Ref[];
    categorySlug?: string;
    limit?: number;
    variant?: "carousel" | "gridDark" | "gridLight";
};

type Treatment = {
    _id: string;
    title: any;
    slug?: string;
    categorySlug?: string;
    relatedSpecialists?: Ref[];
    pageSections?: any[];
};

// Exact strings used by the live treatment page (SubTreatmentLayout.tsx).
const HEADING_NO = "Spesialister som utfører dette";
const HEADING_EN = "Specialists who perform this";
const INTRO_NO = "Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.";
const INTRO_EN = "Experience, specialist expertise and modern technology gathered in one place.";

const i18nString = (no: string, en: string) => [
    { _key: "no", _type: "internationalizedArrayStringValue", language: "no", value: no },
    { _key: "en", _type: "internationalizedArrayStringValue", language: "en", value: en },
];
const i18nText = (no: string, en: string) => [
    { _key: "no", _type: "internationalizedArrayTextValue", language: "no", value: no },
    { _key: "en", _type: "internationalizedArrayTextValue", language: "en", value: en },
];

const pickNo = (v: any): string =>
    Array.isArray(v) ? (v.find((x: any) => x.language === "no")?.value || v[0]?.value || "") : (v || "");

/**
 * Parse src/data/treatmentContent.ts as text and build a map of
 *   "category/slug" -> array of specialist slugs (relatedSpecialists).
 */
function loadLiveRelatedMap(): Record<string, string[]> {
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
        const relMatch = chunk.match(/relatedSpecialists\s*:\s*\[([^\]]*)\]/);
        if (!relMatch) continue;
        const slugs = Array.from(relMatch[1].matchAll(/["']([a-z0-9-]+)["']/g)).map((mm) => mm[1]);
        if (slugs.length > 0) map[keys[i].key] = slugs;
    }
    return map;
}

function buildManualRefsFromRefs(refs: Ref[] | undefined): Ref[] {
    if (!Array.isArray(refs)) return [];
    return refs
        .filter((r) => r && r._ref)
        .map((r) => ({ _type: "reference", _ref: r._ref, _key: r._key || `spec-${r._ref.slice(-8)}` }));
}

function buildManualRefsFromSlugs(slugs: string[], slugToId: Record<string, string>): { refs: Ref[]; missing: string[] } {
    const refs: Ref[] = [];
    const missing: string[] = [];
    for (const s of slugs) {
        const id = slugToId[s];
        if (id) refs.push({ _type: "reference", _ref: id, _key: `spec-${id.slice(-8)}` });
        else missing.push(s);
    }
    return { refs, missing };
}

async function run() {
    console.log(`🔍 Loading live source of truth from src/data/treatmentContent.ts…`);
    const liveMap = loadLiveRelatedMap();
    console.log(`   Parsed ${Object.keys(liveMap).length} treatment entries with relatedSpecialists.`);

    console.log(`🔍 Fetching Sanity specialists…`);
    const specialists: { _id: string; slug: string }[] = await sanityClient.fetch(
        `*[_type == "specialist" && !(_id in path("drafts.**"))]{
      _id,
      "slug": coalesce(slug[language == "no"][0].value.current, slug[_key == "no"][0].value.current, slug[0].value.current)
    }`
    );
    const slugToId: Record<string, string> = {};
    for (const s of specialists) if (s.slug) slugToId[s.slug] = s._id;
    console.log(`   Found ${specialists.length} specialist(s).`);

    console.log(`🔍 Fetching treatments…${DRY_RUN ? " (DRY RUN)" : ""}`);
    const treatments: Treatment[] = await sanityClient.fetch(
        `*[_type == "treatment"]{
      _id,
      title,
      "slug": coalesce(slug[language == "no"][0].value.current, slug[_key == "no"][0].value.current, slug[0].value.current),
      "categorySlug": coalesce(category->slug[language == "no"][0].value.current, category->slug[_key == "no"][0].value.current, category->slug[0].value.current),
      relatedSpecialists,
      pageSections
    }`
    );
    console.log(`   Found ${treatments.length} treatment(s).\n`);

    let updated = 0;
    let appended = 0;
    let skipped = 0;
    let errors = 0;

    for (const t of treatments) {
        const label = pickNo(t.title) || t._id;
        try {
            // 1. Prefer the live source of truth (treatmentContent.ts).
            const liveKey = t.categorySlug && t.slug ? `${t.categorySlug}/${t.slug}` : "";
            const liveSlugs = liveKey ? liveMap[liveKey] : undefined;

            let manualRefs: Ref[] = [];
            let source: "live" | "sanity-refs" | "filter" | "none" = "none";
            let missingSlugs: string[] = [];

            if (liveSlugs && liveSlugs.length > 0) {
                const built = buildManualRefsFromSlugs(liveSlugs, slugToId);
                manualRefs = built.refs;
                missingSlugs = built.missing;
                source = "live";
            } else {
                const fromSanity = buildManualRefsFromRefs(t.relatedSpecialists);
                if (fromSanity.length > 0) {
                    manualRefs = fromSanity;
                    source = "sanity-refs";
                }
            }

            const hasManual = manualRefs.length > 0;
            const categorySlug = !hasManual && t.categorySlug ? t.categorySlug : undefined;
            if (!hasManual && categorySlug) source = "filter";

            if (missingSlugs.length > 0) {
                console.warn(`   ⚠ ${label}: slugs not found in Sanity → ${missingSlugs.join(", ")}`);
            }

            let sections = Array.isArray(t.pageSections) ? [...t.pageSections] : [];
            const originalLength = sections.length;

            // Clean up legacy sectionSpecialists blocks
            sections = sections.filter((s) => s && s._type !== "sectionSpecialists");
            const removedLegacy = originalLength - sections.length;

            const existingIdx = sections.findIndex((s) => s && s._type === "pageSectionSpecialists");

            const newBlock: PageSectionSpecialists = {
                _type: "pageSectionSpecialists",
                _key: (existingIdx >= 0 ? sections[existingIdx]._key : null) || randomUUID(),
                title: i18nString(HEADING_NO, HEADING_EN),
                description: i18nText(INTRO_NO, INTRO_EN),
                displayMode: hasManual ? "manual" : "category",
                limit: 8,
                variant: "carousel",
                ...(hasManual ? { specialists: manualRefs } : { categorySlug }),
            };

            if (existingIdx >= 0) {
                const existing = sections[existingIdx];
                const existingTitle = existing.title?.length ? existing.title : (existing.heading?.length ? existing.heading : null);
                const existingDesc = existing.description?.length ? existing.description : (existing.intro?.length ? existing.intro : null);
                const existingVariant = existing.variant || (existing.layout === "grid" ? "gridLight" : (existing.layout || "carousel"));

                newBlock.title = existingTitle || i18nString(HEADING_NO, HEADING_EN);
                newBlock.description = existingDesc || i18nText(INTRO_NO, INTRO_EN);
                newBlock.variant = existingVariant;
                newBlock.limit = existing.limit ?? (existing.maxCount ?? 8);
            }

            const existing = existingIdx >= 0 ? sections[existingIdx] : null;
            const isSame = !removedLegacy && existing &&
                existing._type === "pageSectionSpecialists" &&
                JSON.stringify(existing.title) === JSON.stringify(newBlock.title) &&
                JSON.stringify(existing.description) === JSON.stringify(newBlock.description) &&
                existing.displayMode === newBlock.displayMode &&
                existing.limit === newBlock.limit &&
                existing.variant === newBlock.variant &&
                (newBlock.displayMode === "manual"
                    ? JSON.stringify((existing.specialists || []).map((r: any) => r._ref).sort()) === JSON.stringify((newBlock.specialists || []).map((r: any) => r._ref).sort())
                    : existing.categorySlug === newBlock.categorySlug
                );

            if (isSame) {
                console.log(`⏭  Skipped (already correct): ${label}`);
                skipped++;
                continue;
            }

            if (existingIdx >= 0) {
                sections[existingIdx] = newBlock;
                if (!DRY_RUN) {
                    await sanityClient.patch(t._id).set({ pageSections: sections }).commit();
                }
                console.log(
                    `✓ Updated: ${label}  [${source}] (${hasManual ? `${manualRefs.length} manual` : `filter=${categorySlug ?? "—"}`})`
                );
                updated++;
            } else {
                sections.push(newBlock);
                if (!DRY_RUN) {
                    await sanityClient.patch(t._id).set({ pageSections: sections }).commit();
                }
                console.log(
                    `+ Appended: ${label}  [${source}] (${hasManual ? `${manualRefs.length} manual` : `filter=${categorySlug ?? "—"}`})`
                );
                appended++;
            }
        } catch (err: any) {
            console.error(`✗ Failed: ${label} — ${err?.message || err}`);
            errors++;
        }
    }

    console.log("\n──────────────────────────────────────────");
    console.log(`Processed:      ${treatments.length}`);
    console.log(`Appended new:   ${appended}`);
    console.log(`Updated:        ${updated}`);
    console.log(`Skipped:        ${skipped}`);
    console.log(`Errors:         ${errors}`);
    if (DRY_RUN) console.log("\n(dry run — no changes committed)");
}

run().catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
});
