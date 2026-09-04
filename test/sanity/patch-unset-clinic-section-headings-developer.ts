#!/usr/bin/env npx tsx
/**
 * Remove legacy `sectionHeadings` from clinicPage documents (not in schema).
 * Copies `faqHeading` → `faqSectionTitle` when the latter is empty.
 *
 *   cd test && npx tsx sanity/patch-unset-clinic-section-headings-developer.ts
 *   DRY_RUN=1 npx tsx sanity/patch-unset-clinic-section-headings-developer.ts
 */
import { DATASET, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";

type ClinicRow = {
  _id: string;
  title?: unknown;
  faqSectionTitle?: unknown;
  sectionHeadings?: {
    faqHeading?: unknown;
    servicesHeading?: unknown;
  } | null;
};

function hasFaqSectionTitle(value: unknown): boolean {
  if (!Array.isArray(value) || value.length === 0) return false;
  return value.some(
    (row) =>
      typeof row === "object" &&
      row != null &&
      typeof (row as { value?: unknown }).value === "string" &&
      (row as { value: string }).value.trim().length > 0,
  );
}

async function run() {
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}" — developer only.`);
  }

  const clinics = await sanityClient.fetch<ClinicRow[]>(
    `*[_type == "clinicPage" && defined(sectionHeadings)]{
      _id,
      title,
      faqSectionTitle,
      sectionHeadings
    }`,
  );

  console.log(
    `Found ${clinics.length} clinic(s) with legacy sectionHeadings${DRY_RUN ? " (DRY RUN)" : ""}.\n`,
  );

  let patched = 0;
  for (const doc of clinics) {
    const patch = sanityClient.patch(doc._id).unset(["sectionHeadings"]);

    if (!hasFaqSectionTitle(doc.faqSectionTitle) && doc.sectionHeadings?.faqHeading) {
      patch.set({ faqSectionTitle: doc.sectionHeadings.faqHeading });
    }

    if (!DRY_RUN) {
      await patch.commit();
    }

    console.log(`✓ ${doc._id}`);
    patched++;
  }

  console.log(`\nDone. Patched: ${patched}${DRY_RUN ? " (dry run)" : ""}.`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
