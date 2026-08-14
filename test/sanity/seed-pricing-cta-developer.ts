#!/usr/bin/env npx tsx
/**
 * Developer-only: create Pricing-page-owned CTA collection and attach it to
 * pricingPage.pricingCta. Removes shared pageSectionBookingCta from Pricing
 * pageSections without modifying other pages' CTA collections.
 *
 *   cd test && npx tsx sanity/seed-pricing-cta-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const COLLECTION_ID = "cta-collection-pricing-page";

function i18nStr(no: string, en: string) {
  return [
    {
      _type: "internationalizedArrayStringValue",
      _key: "no",
      language: "no",
      value: no,
    },
    {
      _type: "internationalizedArrayStringValue",
      _key: "en",
      language: "en",
      value: en,
    },
  ];
}

function i18nText(no: string, en: string) {
  return [
    {
      _type: "internationalizedArrayTextValue",
      _key: "no",
      language: "no",
      value: no,
    },
    {
      _type: "internationalizedArrayTextValue",
      _key: "en",
      language: "en",
      value: en,
    },
  ];
}

async function main() {
  console.log("\nSeed Pricing CTA");
  console.log("Project ID:", PROJECT_ID);
  console.log("Dataset:", DATASET);

  if (PROJECT_ID !== "9jhqpk3a" || DATASET !== "developer") {
    throw new Error("Refusing to seed Pricing CTA outside 9jhqpk3a/developer.");
  }

  const collection = {
    _id: COLLECTION_ID,
    _type: "ctaCollection",
    internalName: "Pricing page CTA",
    description:
      "Page-owned Pricing CTA (NO/EN). Used only by pricingPage.pricingCta — not shared Website bands.",
    sortOrder: 10,
    title: i18nStr(
      "Ta vare på livet og underlivet",
      "Take care of your life and intimate health",
    ),
    subtitle: i18nText(
      "Bli tatt på alvor – med faglig trygghet, respekt og helhetlig oppfølging",
      "Be taken seriously – with clinical expertise, respect and comprehensive follow-up",
    ),
    primaryLabel: i18nStr("Bestill time", "Book appointment"),
    primaryPath: "/booking",
    showSecondaryButton: true,
    secondaryLabel: i18nStr("Kontakt oss", "Contact us"),
    secondaryPath: "/kontakt",
    quickInfoItems: [],
  };

  await sanityClient.createOrReplace(collection);

  const page = await sanityClient.fetch<{
    _id: string;
    pageSections?: Array<{ _key?: string; _type?: string }>;
  } | null>(`*[_type=="pricingPage" && !(_id in path("drafts.**"))][0]{
    _id,
    pageSections[]{ _key, _type }
  }`);

  if (!page?._id) throw new Error("pricingPage not found");

  const remainingSections = (page.pageSections || []).filter(
    (row) => row._type !== "pageSectionBookingCta",
  );

  await sanityClient
    .patch(page._id)
    .set({
      pricingCta: {
        _type: "pageSectionBookingCta",
        _key: "pricingPage-pricing-cta",
        ctaCollection: {
          _type: "reference",
          _ref: COLLECTION_ID,
        },
        // Explicit empty quick info — Pricing reference has no trust chips.
        quickInfoItems: [],
        showSecondaryButton: true,
      },
      pageSections: remainingSections,
    })
    .commit();

  // Verify shared collection left untouched
  const sharedDefault = await sanityClient.fetch(
    `*[_id=="migrated-cta-collection.1e99f3f466ec7f9d"][0]{_id, internalName, "titleNo": title[language=="no"][0].value}`,
  );
  const oldPricingMigrated = await sanityClient.fetch(
    `*[_id=="migrated-cta-collection.c574549d8db53c4b"][0]{_id, internalName}`,
  );

  console.log(
    JSON.stringify(
      {
        collectionId: COLLECTION_ID,
        pricingPageId: page._id,
        removedSharedBands: (page.pageSections || []).length - remainingSections.length,
        remainingPageSections: remainingSections.map((s) => s._type),
        sharedDefaultUntouched: sharedDefault,
        oldMigratedPricingCollectionUntouched: oldPricingMigrated,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
