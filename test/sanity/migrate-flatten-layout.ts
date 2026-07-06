/**
 * migrate-flatten-layout.ts
 *
 * Promotes all fields from `layout.X` to root level `X` for every treatment document.
 * Run ONCE after deploying the flattened treatment schema.
 *
 * Usage (from the test/ directory):
 *   npx tsx sanity/migrate-flatten-layout.ts
 */

import { sanityClient } from "./config";

/** All keys stored inside the layout block that should be promoted to root. */
const LAYOUT_KEYS = [
  "homeBreadcrumbLabel", "srOnlyTitle", "themesAriaLabel",
  "seePricesLabel", "seePricesHref", "callCtaLabel",
  "expertReadMoreLabel", "scrollLeftLabel", "scrollRightLabel",
  "insuranceEyebrow", "insuranceTitle", "insurancePartners",
  "eyebrow", "heroTitle", "heroDescription",
  "heroPoints", "heroThemes", "heroAvailability", "heroPrice",
  "hideSeePriser", "heroImageAlt", "heroVideo",
  "rating", "primaryCtaLabel", "bookingService",
  "flowEyebrow", "flowTitle", "flowImage", "flowImageAlt",
  "flowLinkLabel", "flowLinkHref", "flow",
  "reasonsEyebrow", "reasonsTitle", "reasonsLead", "reasonsLead2",
  "reasonsLayout", "reasons", "promises",
  "expertAreas", "textSection",
  "relatedEyebrow", "relatedTitle", "relatedLead",
  "relatedAsIntro", "relatedAsServices",
  "relatedSeeAllHref", "relatedSeeAllLabel",
  "ctaTitle", "ctaDescription", "conversationCtaTitle",
  "specialistTitle", "specialistDescription",
  "specialistCtaLabel", "specialistCtaHref",
] as const;

async function main() {
  console.log("Fetching all treatment documents...");
  const treatments = await sanityClient.fetch<{ _id: string; layout?: Record<string, unknown> }[]>(
    `*[_type == "treatment"]{ _id, layout }`,
  );

  console.log(`Found ${treatments.length} treatment documents.`);

  let migrated = 0;
  let skipped = 0;

  for (const doc of treatments) {
    if (!doc.layout || Object.keys(doc.layout).length === 0) {
      console.log(`  SKIP ${doc._id} — no layout block`);
      skipped++;
      continue;
    }

    const layout = doc.layout as Record<string, unknown>;

    // Build patch: set root-level fields from layout.*
    const patch: Record<string, unknown> = {};
    for (const key of LAYOUT_KEYS) {
      if (key in layout && layout[key] !== undefined) {
        patch[key] = layout[key];
      }
    }

    // Also copy heroImage (stored as an asset reference object, not a URL string)
    if (layout.heroImage) {
      patch.heroImage = layout.heroImage;
    }

    if (Object.keys(patch).length === 0) {
      console.log(`  SKIP ${doc._id} — layout block had no recognised fields`);
      skipped++;
      continue;
    }

    try {
      await sanityClient
        .patch(doc._id)
        .set(patch)
        .unset(["layout"])
        .commit({ autoGenerateArrayKeys: true });

      console.log(`  OK   ${doc._id} — moved ${Object.keys(patch).length} fields to root`);
      migrated++;
    } catch (err) {
      console.error(`  ERR  ${doc._id} —`, err);
    }
  }

  console.log(`\nDone! Migrated: ${migrated}, Skipped: ${skipped}`);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
