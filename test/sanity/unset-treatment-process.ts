#!/usr/bin/env npx tsx
/**
 * Migration: unset `process` on treatment documents when the migration
 * source (src/data/treatmentContent.ts) has no `process[]` for that
 * treatment.
 *
 * Logic per treatment doc (matched by `<categorySlug>/<slug>`):
 *   - Source has process[]  → leave as-is (skip). A separate script
 *     (`migrate-treatment-process.ts`) owns writing/updating those.
 *   - Source has NO process → `.unset(["process"])` so the field is
 *     completely removed (not left as [] or {}).
 *
 * Idempotent. Safe to re-run.
 *
 * Flags:
 *   --dry-run   Log actions, don't commit.
 *   --force     Reserved. Currently a no-op (behavior is always safe).
 *
 * Usage:
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/unset-treatment-process.ts
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/unset-treatment-process.ts --dry-run
 */
import * as fs from "fs";
import * as path from "path";
import { sanityClient } from "./config";

const SOURCE = path.resolve(__dirname, "../../src/data/treatmentContent.ts");
const DRY_RUN = process.argv.includes("--dry-run");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FORCE = process.argv.includes("--force");

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

/** Keys ("<categorySlug>/<slug>") that have a real process[] in the source. */
function parseSpecificKeys(src: string): Set<string> {
  const keys = new Set<string>();
  const entryRe = /"([a-z0-9-]+\/[a-z0-9-]+)":\s*\{/g;
  let m: RegExpExecArray | null;
  while ((m = entryRe.exec(src)) !== null) {
    const key = m[1];
    const bodyStart = m.index + m[0].length;
    const { end: bodyEnd, body } = readBalanced(src, bodyStart, "{", "}");
    entryRe.lastIndex = bodyEnd + 1;

    const pMatch = /(?:^|[\s,{])process\s*:\s*\[/.exec(body);
    if (!pMatch) continue;
    const start = pMatch.index + pMatch[0].length;
    const { body: arrBody } = readBalanced(body, start, "[", "]");
    try {
      const arr = new Function(`return [${arrBody}]`)();
      if (Array.isArray(arr) && arr.length > 0) keys.add(key);
    } catch {
      // ignore parse errors — treat as no specific process
    }
  }
  return keys;
}

interface TreatmentDoc {
  _id: string;
  title?: string;
  slug?: string;
  categorySlug?: string;
  process?: unknown;
}

async function run() {
  console.log(`🚀 Unset-process migration${DRY_RUN ? " (DRY RUN)" : ""}\n`);

  console.log("📖 Reading treatmentContent.ts …");
  const src = fs.readFileSync(SOURCE, "utf8");
  const specificKeys = parseSpecificKeys(src);
  console.log(`   Source has process[] for ${specificKeys.size} treatments.\n`);

  console.log("🏥 Fetching treatment docs from Sanity …");
  const treatments: TreatmentDoc[] = await sanityClient.fetch(
    `*[_type == "treatment" && !(_id in path("drafts.**"))]{
       _id,
       "title": coalesce(title[language == "no"][0].value, title[0].value, "(untitled)"),
       "slug": coalesce(slug[language == "no"][0].value.current, slug.current),
       "categorySlug": coalesce(category->slug[language == "no"][0].value.current, category->slug.current),
       process
     }`
  );
  console.log(`   Loaded ${treatments.length} treatments.\n`);

  let processed = 0;
  let updated = 0;
  let unset = 0;
  let skipped = 0;
  let errors = 0;

  for (const doc of treatments) {
    processed++;
    const label = doc.title || doc._id;
    const key = doc.categorySlug && doc.slug ? `${doc.categorySlug}/${doc.slug}` : null;

    try {
      const sourceHasProcess = key ? specificKeys.has(key) : false;

      if (sourceHasProcess) {
        // Source owns this — separate migration handles write. Skip here.
        console.log(`✓ Skipped: ${label} (source has process — handled elsewhere)`);
        skipped++;
        updated++; // counted as "correct as-is"
        continue;
      }

      // No source process → the field should not exist on the doc.
      const hasField =
        doc.process !== undefined &&
        doc.process !== null &&
        !(Array.isArray(doc.process) && doc.process.length === 0);

      if (!hasField) {
        console.log(`✓ Skipped: ${label} (already correct)`);
        skipped++;
        continue;
      }

      if (DRY_RUN) {
        console.log(`✓ Would unset process: ${label}`);
      } else {
        await sanityClient.patch(doc._id).unset(["process"]).commit();
        console.log(`✓ Unset process field: ${label}`);
      }
      unset++;
    } catch (err) {
      errors++;
      console.log(`✗ Failed: ${label} — ${(err as Error).message}`);
    }
  }

  console.log("\n──────────────────────────────────────────");
  console.log("Summary:");
  console.log(`Processed:     ${processed}`);
  console.log(`Updated:       ${updated}`);
  console.log(`Process Unset: ${unset}${DRY_RUN ? " (dry run — not committed)" : ""}`);
  console.log(`Skipped:       ${skipped}`);
  console.log(`Errors:        ${errors}`);
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
