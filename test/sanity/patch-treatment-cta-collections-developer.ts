/**
 * Developer-only: attach a CTA Collection to every treatment Booking CTA band.
 *
 * Studio shows “Legacy band” when the band exists without `ctaCollection`.
 * This links the category (or default) Content Library collection so editors
 * see a selected collection.
 *
 *   cd test && npx tsx sanity/patch-treatment-cta-collections-developer.ts
 *   DRY_RUN=1 npx tsx sanity/patch-treatment-cta-collections-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";

/** Category → existing CTA Collection document id on developer. */
const CTA_BY_CATEGORY: Record<string, string> = {
  gynekologi: "migrated-cta-collection.a03ee8e4994a4abb",
  fertilitet: "migrated-cta-collection.8a9fe69d5dc78649",
  urologi: "migrated-cta-collection.ec36560bac1e9191",
  ortopedi: "migrated-cta-collection.da5deb1ad7a338f5",
  graviditet: "migrated-cta-collection.760b317b8be4e216",
  "flere-fagomrader": "migrated-cta-collection.33ea61bd3190c308",
};

const DEFAULT_CTA = "migrated-cta-collection.1e99f3f466ec7f9d";

type BookingBand = Record<string, unknown> & {
  _type?: string;
  _key?: string;
  ctaCollection?: { _ref?: string } | null;
};

function collectionRef(id: string) {
  return { _type: "reference" as const, _ref: id };
}

function emptyBookingBand(collectionId: string): BookingBand {
  return {
    _type: "pageSectionBookingCta",
    _key: "booking-cta-section",
    ctaCollection: collectionRef(collectionId),
  };
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing: dataset "${DATASET}" (developer only)`);
  }

  // Verify collections exist
  const needed = [...new Set([...Object.values(CTA_BY_CATEGORY), DEFAULT_CTA])];
  const existing = await sanityClient.fetch<string[]>(
    `*[_type=="ctaCollection" && _id in $ids]._id`,
    { ids: needed },
  );
  const missing = needed.filter((id) => !existing.includes(id));
  if (missing.length) {
    throw new Error(`Missing CTA collections: ${missing.join(", ")}`);
  }

  const docs = await sanityClient.fetch<
    Array<{
      _id: string;
      categoryId?: string;
      pageSections?: BookingBand[];
    }>
  >(
    `*[
      _type == "treatment" &&
      !(_id in path("drafts.**"))
    ]{
      _id,
      "categoryId": coalesce(categories[0]->categoryId, category->categoryId),
      pageSections
    }`,
  );

  let updated = 0;
  let skipped = 0;
  let createdBand = 0;

  for (const doc of docs) {
    const collectionId =
      (doc.categoryId && CTA_BY_CATEGORY[doc.categoryId]) || DEFAULT_CTA;
    const sections = Array.isArray(doc.pageSections) ? [...doc.pageSections] : [];
    let changed = false;
    let sawBooking = false;

    const nextSections = sections.map((section) => {
      if (section._type !== "pageSectionBookingCta") return section;
      sawBooking = true;
      const currentRef = section.ctaCollection?._ref;
      if (currentRef) return section;
      changed = true;
      return {
        ...section,
        ctaCollection: collectionRef(collectionId),
      };
    });

    if (!sawBooking) {
      nextSections.push(emptyBookingBand(collectionId));
      changed = true;
      createdBand++;
    }

    if (!changed) {
      skipped++;
      continue;
    }

    console.log(
      DRY_RUN ? "DRY" : "PATCH",
      doc._id,
      doc.categoryId || "(no-cat)",
      "→",
      collectionId,
      sawBooking ? "" : "(created band)",
    );

    if (!DRY_RUN) {
      await sanityClient
        .patch(doc._id)
        .set({ pageSections: nextSections })
        .commit({ autoGenerateArrayKeys: false });
      try {
        await sanityClient.delete(`drafts.${doc._id}`);
      } catch {
        /* none */
      }
    }
    updated++;
  }

  const verify = await sanityClient.fetch(
    `*[_id=="treatment-gynekologi-pmos"][0]{
      "booking": pageSections[_type=="pageSectionBookingCta"][0]{
        "collectionId": ctaCollection._ref,
        "collectionName": ctaCollection->internalName
      }
    }`,
  );

  const stats = await sanityClient.fetch(`{
    "withCollection": count(*[_type=="treatment" && count(pageSections[_type=="pageSectionBookingCta" && defined(ctaCollection._ref)]) > 0]),
    "withoutCollection": count(*[_type=="treatment" && count(pageSections[_type=="pageSectionBookingCta" && !defined(ctaCollection._ref)]) > 0]),
    "noBookingBand": count(*[_type=="treatment" && count(pageSections[_type=="pageSectionBookingCta"]) == 0])
  }`);

  console.log(
    `\nDone. ${DRY_RUN ? "Would update" : "Updated"} ${updated}, skipped ${skipped}, created bands ${createdBand}.`,
  );
  console.log("PMOS:", JSON.stringify(verify, null, 2));
  console.log("Stats:", JSON.stringify(stats, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
