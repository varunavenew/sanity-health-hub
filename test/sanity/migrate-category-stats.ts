/**
 * Migration: Populate `stats` on all treatmentCategory documents.
 *
 * Each stats item is an object:
 *   { value: string, label: i18nString, sub: i18nString }
 *
 * Values are numeric/plain and stay the same across languages.
 * Labels + subheadings are localized (no + en).
 *
 * Run with:
 *   cd test
 *   SANITY_TOKEN=<token> npx tsx sanity/migrate-category-stats.ts --dry-run
 *   SANITY_TOKEN=<token> npx tsx sanity/migrate-category-stats.ts
 *   SANITY_TOKEN=<token> FORCE=1 npx tsx sanity/migrate-category-stats.ts  # overwrite existing
 */

import { sanityClient as client } from "./config";

const DRY_RUN = process.argv.includes("--dry-run");
const FORCE = process.env.FORCE === "1";

type I18nEntry = { _key: string; _type: "internationalizedArrayStringValue"; value: string };

const i18n = (no: string, en: string): I18nEntry[] => [
  { _key: "no", _type: "internationalizedArrayStringValue", value: no },
  { _key: "en", _type: "internationalizedArrayStringValue", value: en },
];

type StatSeed = { value: string; label: [string, string]; sub: [string, string] };

// Shared clinic-wide stats (used as default when a category has no specific set)
const DEFAULT_STATS: StatSeed[] = [
  {
    value: "60 000",
    label: ["Årlige pasientbesøk", "Annual patient visits"],
    sub: ["På tvers av klinikkene", "Across our clinics"],
  },
  {
    value: "3 500",
    label: ["Operasjoner", "Surgeries"],
    sub: ["Per år", "Per year"],
  },
  {
    value: "4,8/5",
    label: ["Snittvurdering", "Average rating"],
    sub: ["Fra pasienter på Google", "From patients on Google"],
  },
  {
    value: "50+",
    label: ["Spesialister", "Specialists"],
    sub: ["På tvers av fagfelt", "Across specialties"],
  },
];

// Category-specific overrides (keyed by categoryId — supports both NO and EN keys)
const STATS_BY_CATEGORY: Record<string, StatSeed[]> = {
  // Norwegian keys
  gynekologi: DEFAULT_STATS,
  fertilitet: DEFAULT_STATS,
  urologi: DEFAULT_STATS,
  ortopedi: DEFAULT_STATS,
  graviditet: DEFAULT_STATS,
  "flere-fagomrader": DEFAULT_STATS,
  // English keys (in case docs use routing keys from schema description)
  gynecology: DEFAULT_STATS,
  fertility: DEFAULT_STATS,
  urology: DEFAULT_STATS,
  orthopedics: DEFAULT_STATS,
  pregnancy: DEFAULT_STATS,
  "other-specialties": DEFAULT_STATS,
};

function buildStats(seeds: StatSeed[]) {
  return seeds.map((s, idx) => ({
    _key: `stat-${idx}`,
    _type: "object",
    value: s.value,
    label: i18n(s.label[0], s.label[1]),
    sub: i18n(s.sub[0], s.sub[1]),
  }));
}

async function main() {
  console.log(`🚀 Migrating category stats${DRY_RUN ? " (DRY RUN)" : ""}${FORCE ? " [FORCE]" : ""}\n`);

  const categories: Array<{ _id: string; categoryId?: string; title?: unknown; stats?: unknown[] }> =
    await client.fetch(
      `*[_type == "treatmentCategory"]{ _id, categoryId, title, stats }`
    );

  console.log(`Found ${categories.length} category document(s).\n`);

  const tx = client.transaction();
  let updated = 0;
  let skipped = 0;

  for (const cat of categories) {
    const key = cat.categoryId || "";
    const seeds = STATS_BY_CATEGORY[key] || DEFAULT_STATS;

    const hasExisting = Array.isArray(cat.stats) && cat.stats.length > 0;
    if (hasExisting && !FORCE) {
      console.log(`  ⏭  ${key || cat._id} — already has ${cat.stats!.length} stats (use FORCE=1 to overwrite)`);
      skipped++;
      continue;
    }

    const stats = buildStats(seeds);
    console.log(`  ✅ ${key || cat._id} — setting ${stats.length} stats`);
    tx.patch(cat._id, { set: { stats } });
    updated++;
  }

  console.log(`\nSummary: ${updated} to update, ${skipped} skipped.`);

  if (DRY_RUN) {
    console.log("Dry run — no changes committed.");
    return;
  }
  if (updated === 0) {
    console.log("Nothing to do.");
    return;
  }

  console.log("⏳ Committing...");
  const result = await tx.commit();
  console.log(`✅ Done. ${result.results.length} mutation(s) applied.`);
}

main().catch((err) => {
  console.error("❌ Migration failed:", err.message);
  process.exit(1);
});
