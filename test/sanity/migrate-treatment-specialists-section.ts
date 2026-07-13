/**
 * Migration: Ensure every treatment has a `sectionSpecialists` block in `pageSections`,
 * populated from the treatment's own `relatedSpecialists` refs (falling back to the
 * treatment's category slug via `filterCategory`).
 *
 * Behavior per treatment doc:
 *  - If `pageSections` already contains a `sectionSpecialists` entry → UPDATE its
 *    `manualRefs` / `filterCategory` / defaults in place (no duplicates).
 *  - Otherwise → APPEND a new `sectionSpecialists` block to `pageSections`.
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
  categorySlug?: string;
  relatedSpecialists?: Ref[];
  pageSections?: any[];
};

const HEADING_NO = "Møt våre spesialister";
const HEADING_EN = "Meet our specialists";
const INTRO_NO = "Erfarne spesialister som utfører denne behandlingen.";
const INTRO_EN = "Experienced specialists who perform this treatment.";

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

function buildManualRefs(refs: Ref[] | undefined): Ref[] {
  if (!Array.isArray(refs)) return [];
  return refs
    .filter((r) => r && r._ref)
    .map((r) => ({ _type: "reference", _ref: r._ref, _key: r._key || `spec-${r._ref.slice(-8)}` }));
}

async function run() {
  console.log(`🔍 Fetching treatments…${DRY_RUN ? " (DRY RUN)" : ""}`);

  const treatments: Treatment[] = await sanityClient.fetch(
    `*[_type == "treatment" && !(_id in path("drafts.**"))]{
      _id,
      title,
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
      const manualRefs = buildManualRefs(t.relatedSpecialists);
      const hasManual = manualRefs.length > 0;
      const filterCategory = !hasManual && t.categorySlug ? t.categorySlug : undefined;

      const sections = Array.isArray(t.pageSections) ? [...t.pageSections] : [];
      const existingIdx = sections.findIndex((s) => s && s._type === "sectionSpecialists");

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
          manualRefs: hasManual ? manualRefs : (existing.manualRefs || []),
          filterCategory: hasManual ? undefined : (existing.filterCategory || filterCategory),
        };

        const sameManual =
          JSON.stringify((existing.manualRefs || []).map((r) => r._ref).sort()) ===
          JSON.stringify(next.manualRefs?.map((r) => r._ref).sort());
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
          `✓ Updated: ${label}  (${hasManual ? `${manualRefs.length} manual` : `filter=${filterCategory ?? "—"}`})`
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
          `+ Appended: ${label}  (${hasManual ? `${manualRefs.length} manual` : `filter=${filterCategory ?? "—"}`})`
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
