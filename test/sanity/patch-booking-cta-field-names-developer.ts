#!/usr/bin/env npx tsx
/**
 * Developer-only: fix pageSectionBookingCta unknown Studio fields.
 *
 * Legacy patch scripts wrote `description` + `primaryCtaLabel`, but the schema
 * expects `subtitle` + `primaryLabel`. That causes “Unknown fields found” in Studio
 * and the website never reads the legacy names.
 *
 *   cd test && npx tsx sanity/patch-booking-cta-field-names-developer.ts
 *   DRY_RUN=1 npx tsx sanity/patch-booking-cta-field-names-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";

/** Fields that exist in documents but not in pageSectionBookingCta schema. */
const LEGACY_UNSET = [
  "description",
  "primaryCtaLabel",
  "seeAllLabel",
  "ctaLabel",
  "buttonLabel",
] as const;

type BookingBand = Record<string, unknown> & {
  _type?: string;
  _key?: string;
  description?: unknown;
  subtitle?: unknown;
  primaryCtaLabel?: unknown;
  primaryLabel?: unknown;
  seeAllLabel?: unknown;
};

function normalizeBand(band: BookingBand): { next: BookingBand; changed: boolean } {
  let changed = false;
  const next: BookingBand = { ...band };

  if (next.description != null) {
    if (next.subtitle == null) {
      next.subtitle = next.description;
      changed = true;
    }
    delete next.description;
    changed = true;
  }

  if (next.primaryCtaLabel != null) {
    if (next.primaryLabel == null) {
      next.primaryLabel = next.primaryCtaLabel;
      changed = true;
    }
    delete next.primaryCtaLabel;
    changed = true;
  }

  for (const key of LEGACY_UNSET) {
    if (key === "description" || key === "primaryCtaLabel") continue;
    if (key in next) {
      delete next[key];
      changed = true;
    }
  }

  return { next, changed };
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing: dataset "${DATASET}" (developer only)`);
  }

  const docs = await sanityClient.fetch<
    Array<{
      _id: string;
      _type: string;
      pageSections?: BookingBand[];
    }>
  >(
    `*[
      defined(pageSections) &&
      count(pageSections[_type=="pageSectionBookingCta"]) > 0 &&
      !(_id in path("drafts.**"))
    ]{ _id, _type, pageSections }`,
  );

  let updated = 0;
  let skipped = 0;

  for (const doc of docs) {
    const sections = doc.pageSections || [];
    let changed = false;
    const nextSections = sections.map((section) => {
      if (section._type !== "pageSectionBookingCta") return section;
      const { next, changed: bandChanged } = normalizeBand(section);
      if (bandChanged) changed = true;
      return next;
    });

    if (!changed) {
      skipped++;
      continue;
    }

    console.log(
      DRY_RUN ? "DRY" : "PATCH",
      doc._type,
      doc._id,
      "→ rename description/primaryCtaLabel → subtitle/primaryLabel",
    );

    if (!DRY_RUN) {
      await sanityClient
        .patch(doc._id)
        .set({ pageSections: nextSections })
        .commit({ autoGenerateArrayKeys: false });
      try {
        await sanityClient.delete(`drafts.${doc._id}`);
      } catch {
        /* no draft */
      }
    }
    updated++;
  }

  const verify = await sanityClient.fetch(
    `*[_id=="treatment-gynekologi-pmos"][0]{
      "booking": pageSections[_type=="pageSectionBookingCta"][0]{
        title,
        subtitle,
        primaryLabel,
        description,
        primaryCtaLabel,
        seeAllLabel
      }
    }`,
  );

  console.log(`\nDone. ${DRY_RUN ? "Would update" : "Updated"} ${updated}, skipped ${skipped}.`);
  console.log("Verify PMOS booking keys:", Object.keys(verify?.booking || {}));
  console.log(JSON.stringify(verify?.booking, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
