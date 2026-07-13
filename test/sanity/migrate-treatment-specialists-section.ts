/**
 * Migration: Ensure every treatment has a `sectionSpecialists` block in `pageSections`,
 * populated with the SAME specialists the live treatment page renders.
 *
 * Source of truth (in priority order):
 *   1. `src/data/treatmentContent.ts` → per-treatment `relatedSpecialists: string[]`
 *      (list of specialist SLUGS). This is what SubTreatmentLayout whitelists on.
 *      → We map those slugs to Sanity specialist doc _ids and set manualRefs.
 *      → Example: "fertilitet/donorbehandling" → ["kristian-ophaug"] → 1 manual ref.
 *   2. If the treatment has no entry in treatmentContent, we fall back to the doc's
 *      existing `relatedSpecialists` refs in Sanity.
 *   3. If neither is available, we fall back to `filterCategory` = category slug.
 *
 * Behavior per treatment doc:
 *   - If `pageSections` already contains a `sectionSpecialists` entry → UPDATE it in
 *     place (no duplicates), overwriting `manualRefs` / `filterCategory` to match
 *     the source of truth.
 *   - Otherwise → APPEND a new `sectionSpecialists` block.
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
type SectionSpecialists = {
  _type: "sectionSpecialists";
  _key: string;
  enabled?: boolean;
  heading?: { _key: string; _type: "internationalizedArrayStringValue"; language: string; value: string }[];
  intro?: { _key: string; _type: "internationalizedArrayTextValue"; language: string; value: string }[];
  filterCategory?: string;
  maxCount?: number;
  layout?: "carousel" | "grid";
  manualRefs?: Ref[];
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
 *
 * We can't `import` the module here because it pulls image assets that don't
 * resolve outside Vite. A regex scan is deterministic and matches how the file
 * is authored today: each entry looks like
 *     "fertilitet/donorbehandling": {
 *        ...
 *        relatedSpecialists: ["kristian-ophaug"],
 *        ...
 *     },
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
    `*[_type == "specialist" && !(_id in path("drafts.**"))]{ _id, "slug": slug.current }`
  );
  const slugToId: Record<string, string> = {};
  for (const s of specialists) if (s.slug) slugToId[s.slug] = s._id;
  console.log(`   Found ${specialists.length} specialist(s).`);

  console.log(`🔍 Fetching treatments…${DRY_RUN ? " (DRY RUN)" : ""}`);
  const treatments: Treatment[] = await sanityClient.fetch(
    `*[_type == "treatment" && !(_id in path("drafts.**"))]{
      _id,
      title,
      "slug": slug.current,
      "categorySlug": category->slug.current,
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
      const filterCategory = !hasManual && t.categorySlug ? t.categorySlug : undefined;
      if (!hasManual && filterCategory) source = "filter";

      if (missingSlugs.length > 0) {
        console.warn(`   ⚠ ${label}: slugs not found in Sanity → ${missingSlugs.join(", ")}`);
      }

      const sections = Array.isArray(t.pageSections) ? [...t.pageSections] : [];
      const existingIdx = sections.findIndex((s) => s && s._type === "sectionSpecialists");

      const desiredManualIds = manualRefs.map((r) => r._ref).sort();

      if (existingIdx >= 0) {
        const existing = sections[existingIdx] as SectionSpecialists;
        const next: SectionSpecialists = {
          ...existing,
          _type: "sectionSpecialists",
          _key: existing._key || randomUUID(),
          enabled: existing.enabled !== false,
          heading: existing.heading?.length ? existing.heading : i18nString(HEADING_NO, HEADING_EN),
          intro: existing.intro?.length ? existing.intro : i18nText(INTRO_NO, INTRO_EN),
          maxCount: existing.maxCount ?? 8,
          layout: existing.layout ?? "carousel",
          // Overwrite manualRefs / filterCategory to match the source of truth.
          manualRefs: hasManual ? manualRefs : [],
          filterCategory: hasManual ? undefined : filterCategory,
        };

        const existingIds = (existing.manualRefs || []).map((r) => r._ref).sort();
        const sameManual = JSON.stringify(existingIds) === JSON.stringify(desiredManualIds);
        const sameFilter = (existing.filterCategory || undefined) === next.filterCategory;

        if (sameManual && sameFilter && existing.heading?.length && existing.intro?.length) {
          console.log(`⏭  Skipped (already correct): ${label}`);
          skipped++;
          continue;
        }

        sections[existingIdx] = next;
        if (!DRY_RUN) {
          await sanityClient.patch(t._id).set({ pageSections: sections }).commit();
        }
        console.log(
          `✓ Updated: ${label}  [${source}] (${hasManual ? `${manualRefs.length} manual` : `filter=${filterCategory ?? "—"}`})`
        );
        updated++;
      } else {
        const block: SectionSpecialists = {
          _type: "sectionSpecialists",
          _key: randomUUID(),
          enabled: true,
          heading: i18nString(HEADING_NO, HEADING_EN),
          intro: i18nText(INTRO_NO, INTRO_EN),
          maxCount: 8,
          layout: "carousel",
          ...(hasManual ? { manualRefs } : { filterCategory }),
        };
        sections.push(block);
        if (!DRY_RUN) {
          await sanityClient.patch(t._id).set({ pageSections: sections }).commit();
        }
        console.log(
          `+ Appended: ${label}  [${source}] (${hasManual ? `${manualRefs.length} manual` : `filter=${filterCategory ?? "—"}`})`
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
