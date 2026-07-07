/**
 * Rollback Treatment Migration Script
 *
 * Deletes all migrated treatment documents (and their drafts) from Sanity.
 *
 * Usage (Dry Run):
 *   cd test && npx cross-env DRY_RUN=1 tsx sanity/rollback-treatments.ts
 *
 * Usage (Execute Rollback):
 *   cd test && npx tsx sanity/rollback-treatments.ts
 */
import { sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN !== "0" && process.env.DRY_RUN !== undefined;

async function rollback() {
  console.log(`\n🏥 Rolling back treatment migration...`);
  console.log(`   Dry run: ${DRY_RUN ? "YES (no changes will be made)" : "NO (documents will be deleted!)"}\n`);

  // Fetch all treatment documents (including drafts)
  const docs = await sanityClient.fetch<Array<{ _id: string; title?: any }>>(
    `*[_type == "treatment"]{ _id, title }`
  );

  if (docs.length === 0) {
    console.log("ℹ No treatment documents found in the dataset.");
    return;
  }

  console.log(`🔍 Found ${docs.length} treatment documents to delete:`);
  docs.forEach((doc) => {
    // Extract title if it's an i18n array or simple string
    let titleStr = "";
    if (Array.isArray(doc.title)) {
      titleStr = doc.title.find((t: any) => t._key === "no")?.value || doc.title[0]?.value || "";
    } else if (typeof doc.title === "string") {
      titleStr = doc.title;
    }
    console.log(`  - [${doc._id}] ${titleStr || "(No title)"}`);
  });

  if (DRY_RUN) {
    console.log(`\n👉 Dry run complete. To actually delete these documents, run:`);
    console.log(`   npx cross-env DRY_RUN=0 tsx sanity/rollback-treatments.ts\n`);
  } else {
    console.log(`\n🗑 Deleting ${docs.length} documents...`);
    const transaction = sanityClient.transaction();
    docs.forEach((doc) => {
      transaction.delete(doc._id);
    });

    await transaction.commit();
    console.log(`\n✅ Rollback complete! Deleted ${docs.length} treatment documents.\n`);
  }
}

rollback().catch((err) => {
  console.error("❌ Rollback failed:", err);
  process.exit(1);
});
