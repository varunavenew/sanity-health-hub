#!/usr/bin/env npx tsx
/**
 * Backfill English i18n fields for the 15 pending treatments migrated from
 * treatmentContent.ts (NO-only content from migrate-selected-missing-treatments).
 *
 * Uses the same translation pipeline as backfill-english-i18n.ts (cache + free MT).
 * Strings already in `.translation-cache.json` are applied without API calls.
 *
 * Usage:
 *   cd test
 *   npm run migrate:pending-treatments-en:dry
 *   npm run migrate:pending-treatments-en
 *
 * Optional:
 *   OFFLINE_ONLY=1  — only apply cached translations (no network)
 *   FORCE=1         — overwrite existing EN values
 *   OPENAI_API_KEY  — use OpenAI instead of free Lingva/MyMemory
 */
const TARGET_KEYS = [
  "gynekologi/fodselsskader",
  "gynekologi/fostermedisin",
  "gynekologi/pmos",
  "fertilitet/assistert-befruktning-for-par-og-single",
  "flere-fagomrader/hudbehandlinger",
  "flere-fagomrader/hudbehandlinger/pigmentforandringer-og-solskader",
  "flere-fagomrader/hudbehandlinger/rodhet-og-synlige-blodkar",
  "flere-fagomrader/hudbehandlinger/forbedring-av-hudstruktur",
  "flere-fagomrader/hudbehandlinger/kosmetisk-dermatologi",
  "flere-fagomrader/hudbehandlinger/elastisitet-og-volum",
  "flere-fagomrader/hudbehandlinger/foflekksjekk",
  "flere-fagomrader/behandlingsutstyr",
  "flere-fagomrader/hudpleieprodukter",
  "flere-fagomrader/gastrokirurgi/brokkoperasjon",
  "flere-fagomrader/gastrokirurgi/hemorroider-og-endetarmsplager",
];

function treatmentDocId(categoryId: string, subPath: string): string {
  return `treatment-${categoryId}-${subPath.replace(/\//g, "-")}`;
}

function targetDocIds(): string[] {
  return TARGET_KEYS.map((key) => {
    const slash = key.indexOf("/");
    return treatmentDocId(key.slice(0, slash), key.slice(slash + 1));
  });
}

async function main() {
  process.env._PENDING_EN_CHILD = "1";
  process.env.ONLY = "treatment";
  process.env.DOC_IDS = targetDocIds().join(",");

  console.log(
    `[migrate-pending-treatments-en] Backfilling EN for ${TARGET_KEYS.length} treatments\n`,
  );

  const { runBackfillEnglish } = await import("./backfill-english-i18n");
  await runBackfillEnglish();
}

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
