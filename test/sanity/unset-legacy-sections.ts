#!/usr/bin/env npx tsx
/**
 * One-time: delete leftover `sections` data after `sections[].content` was
 * removed from the Studio schema. Hidden in Studio ≠ deleted from the dataset.
 *
 * Only documents whose `sections` items still have a `content` field are
 * patched (legacy treatment accordion). themePage / clinicianGuidePage sections
 * (no `content` key) are left alone.
 *
 * Usage:
 *   cd test && npx tsx sanity/unset-legacy-sections.ts --dry-run
 *   cd test && npx tsx sanity/unset-legacy-sections.ts
 */
import { sanityClient } from "./config";

const DRY_RUN = process.argv.includes("--dry-run");

const LEGACY_SECTIONS_QUERY = `*[
  defined(sections) &&
  count(sections[defined(content)]) > 0 &&
  !(_id in path("drafts.**"))
]{ _id, _type }`;

async function countLegacy(): Promise<number> {
  const ids: string[] = await sanityClient.fetch(
    `*[
      defined(sections) &&
      count(sections[defined(content)]) > 0 &&
      !(_id in path("drafts.**"))
    ]._id`,
  );
  return ids.length;
}

async function run() {
  const before = await sanityClient.fetch<Array<{ _id: string; _type: string }>>(
    LEGACY_SECTIONS_QUERY,
  );
  console.log(`Legacy sections[].content documents: ${before.length}`);
  const byType = new Map<string, number>();
  for (const doc of before) {
    byType.set(doc._type, (byType.get(doc._type) || 0) + 1);
  }
  for (const [type, count] of [...byType.entries()].sort()) {
    console.log(`  ${type}: ${count}`);
  }

  if (DRY_RUN) {
    console.log("\nDRY RUN — no patches applied.");
    return;
  }

  for (const doc of before) {
    await sanityClient.patch(doc._id).unset(["sections"]).commit();
    console.log(`unset sections: ${doc._type} ${doc._id}`);
  }

  const after = await countLegacy();
  console.log(`\nBefore: ${before.length}`);
  console.log(`After:  ${after}`);
  if (after !== 0) {
    console.error("Expected 0 documents with leftover sections[].content");
    process.exit(1);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
