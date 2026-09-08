#!/usr/bin/env npx tsx
/**
 * Remove CMS placeholder documents (new-treatment, new-category) from Sanity.
 *
 * From test/:
 *   npx tsx sanity/delete-test-content.ts
 *
 * Production (explicit):
 *   cross-env ALLOW_PRODUCTION_MIGRATION=true SANITY_DATASET=production SANITY_STUDIO_DATASET=production npx tsx sanity/delete-test-content.ts
 */
import { sanityClient, DATASET, PROJECT_ID } from "./config";

const TEST_SLUGS = ["new-treatment", "new-category"];

async function main() {
  console.log(`Deleting test content on ${PROJECT_ID}/${DATASET}…`);

  const docs = await sanityClient.fetch<
    Array<{ _id: string; _type: string; slugNo?: string; slugEn?: string }>
  >(
    `*[
      _type in ["treatment", "treatmentCategory"]
      && (
        slug[language == "no"][0].value.current in $slugs
        || slug[language == "en"][0].value.current in $slugs
        || slug.current in $slugs
      )
    ]{
      _id,
      _type,
      "slugNo": slug[language == "no"][0].value.current,
      "slugEn": slug[language == "en"][0].value.current
    }`,
    { slugs: TEST_SLUGS },
  );

  if (!docs.length) {
    console.log("No test content documents found.");
    return;
  }

  for (const doc of docs) {
    console.log(`  deleting ${doc._id} (${doc._type}, ${doc.slugNo}/${doc.slugEn})`);
    await sanityClient.delete(doc._id);
    if (!doc._id.startsWith("drafts.")) {
      const draftId = `drafts.${doc._id}`;
      try {
        await sanityClient.delete(draftId);
        console.log(`  deleted draft ${draftId}`);
      } catch {
        /* no draft */
      }
    }
  }

  console.log(`✅ Removed ${docs.length} test document(s).`);
}

main().catch((err) => {
  console.error("Delete failed:", err);
  process.exit(1);
});
