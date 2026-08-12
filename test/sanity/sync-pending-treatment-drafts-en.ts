#!/usr/bin/env npx tsx
/**
 * Sync English i18n from published treatment docs to open Studio drafts.
 *
 * Sanity Studio edits drafts (`drafts.{id}`). The EN backfill writes to published
 * documents only, so stale drafts can show missing EN tabs (e.g. PMOS hero fields).
 *
 * Usage:
 *   cd test
 *   DRY_RUN=1 npx tsx sanity/sync-pending-treatment-drafts-en.ts
 *   npx tsx sanity/sync-pending-treatment-drafts-en.ts
 */
import { sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";

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

type I18nItem = { language?: string; _key?: string; value?: unknown; _type?: string };

function getLang(item: I18nItem): string | undefined {
  return item.language || item._key;
}

function hasEnValue(arr: unknown): boolean {
  if (!Array.isArray(arr)) return false;
  const en = arr.find((x) => getLang(x as I18nItem) === "en") as I18nItem | undefined;
  if (!en?.value) return false;
  if (typeof en.value === "string") return en.value.trim().length > 0;
  if (Array.isArray(en.value)) return en.value.length > 0;
  return true;
}

/** Copy i18n arrays from published when draft is missing EN entries. */
function i18nPatchesFromPublished(
  published: Record<string, unknown>,
  draft: Record<string, unknown>,
): Record<string, unknown> {
  const patches: Record<string, unknown> = {};

  for (const key of Object.keys(published)) {
    if (key.startsWith("_")) continue;
    const pubVal = published[key];
    const draftVal = draft[key];

    if (!Array.isArray(pubVal) || pubVal.length === 0) continue;
    const isI18n =
      typeof pubVal[0] === "object" &&
      pubVal[0] !== null &&
      String((pubVal[0] as I18nItem)._type || "").startsWith("internationalizedArray");
    if (!isI18n) continue;

    if (!hasEnValue(draftVal) && hasEnValue(pubVal)) {
      patches[key] = pubVal;
    }
  }

  return patches;
}

async function run() {
  console.log(
    `\n[sync-pending-treatment-drafts-en] mode=${DRY_RUN ? "DRY_RUN" : "WRITE"}\n`,
  );

  let synced = 0;
  let skipped = 0;

  for (const id of targetDocIds()) {
    const published = await sanityClient.fetch<Record<string, unknown> | null>(
      `*[_id == $id][0]`,
      { id },
    );
    const draft = await sanityClient.fetch<Record<string, unknown> | null>(
      `*[_id == $id][0]`,
      { id: `drafts.${id}` },
    );

    if (!published) {
      console.log(`  ✗ ${id}: no published document`);
      continue;
    }
    if (!draft) {
      skipped++;
      continue;
    }

    const patches = i18nPatchesFromPublished(published, draft);
    if (Object.keys(patches).length === 0) {
      console.log(`  · ${id}: draft already has EN`);
      skipped++;
      continue;
    }

    console.log(`  ↻ ${id}: sync ${Object.keys(patches).length} field(s) → draft`);
    if (!DRY_RUN) {
      await sanityClient
        .patch(`drafts.${id}`)
        .set(patches)
        .commit({ autoGenerateArrayKeys: true });
    }
    synced++;
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`Drafts synced:  ${synced}`);
  console.log(`Skipped:        ${skipped}`);
  if (DRY_RUN) console.log("\n(dry run — no changes committed)");
}

run().catch((err) => {
  console.error("❌ Sync failed:", err);
  process.exit(1);
});
