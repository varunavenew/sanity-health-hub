#!/usr/bin/env npx tsx
/**
 * Remove legacy inline Guide CTA fields now that Booking CTA is shared only.
 *
 * Dataset: developer by default. Production is blocked by migration guard.
 *
 * Run:
 *   cd test && npm run migrate:guide-remove-legacy-cta:dry
 *   cd test && npm run migrate:guide-remove-legacy-cta
 */
import { sanityClient } from "./config";
import { singletonDocumentIds } from "./lib/patch-singleton";

const DRY_RUN = process.env.DRY_RUN === "1";
const GUIDE_ID = "guidePage";
const LEGACY_FIELDS = ["ctaTitle", "ctaSubtitle", "ctaButtonLabel", "ctaButtonPath"];

async function run() {
  console.log("▶ Remove Guide legacy CTA fields");
  console.log(`  Dry run: ${DRY_RUN ? "yes" : "no"}`);
  console.log(
    `  Dataset: ${
      (sanityClient as { config?: () => { dataset?: string } }).config?.()?.dataset || "unknown"
    }\n`,
  );

  const existingIds: string[] = [];
  for (const id of singletonDocumentIds(GUIDE_ID)) {
    const exists = await sanityClient.fetch<boolean>(`defined(*[_id == $id][0]._id)`, { id });
    if (exists) existingIds.push(id);
  }

  if (!existingIds.length) {
    console.log("No guidePage singleton docs found. Nothing to migrate.");
    return;
  }

  if (DRY_RUN) {
    console.log(`  DRY RUN — would unset ${LEGACY_FIELDS.join(", ")} on: ${existingIds.join(", ")}`);
    return;
  }

  for (const id of existingIds) {
    await sanityClient.patch(id).unset(LEGACY_FIELDS).commit();
    console.log(`  Unset legacy CTA fields on ${id}`);
  }

  const verify = await sanityClient.fetch(
    `*[_type == "guidePage" && !(_id in path("drafts.**"))][0]{
      "hasCtaTitle": defined(ctaTitle),
      "hasCtaSubtitle": defined(ctaSubtitle),
      "hasCtaButtonLabel": defined(ctaButtonLabel),
      "hasCtaButtonPath": defined(ctaButtonPath)
    }`,
  );
  console.log("\nVerify:", JSON.stringify(verify, null, 2));
  console.log("\n✓ Done");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
