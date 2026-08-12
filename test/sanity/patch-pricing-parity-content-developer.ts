#!/usr/bin/env npx tsx
/**
 * Developer-only: Pricing page CMS copy + FAQ collection parity vs reference.
 *
 * - Align intro / titles (NO + EN)
 * - Populate shared FAQ collection from existing pricing FAQ items (no duplicates)
 * - Ensure faqTitle + testimonialsTitle
 *
 *   cd test && npx tsx sanity/patch-pricing-parity-content-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const FAQ_COLLECTION_ID = "migrated-faq-collection.pricingPage.pricingPage";
const FAQ_IDS = [
  "faq-priser-henvisning",
  "faq-priser-betaling",
  "faq-priser-forsikring",
  "faq-priser-avbestilling",
] as const;

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
  console.log({ PROJECT_ID, DATASET });
  if (DATASET !== "developer") {
    throw new Error("Refusing to patch outside developer dataset.");
  }

  const page = await sanityClient.fetch<{ _id: string } | null>(
    `*[_type=="pricingPage" && !(_id in path("drafts.**"))][0]{_id}`,
  );
  if (!page?._id) throw new Error("pricingPage missing");

  // Ensure FAQ items exist
  const existing = await sanityClient.fetch<string[]>(
    `*[_type=="faq" && _id in $ids]._id`,
    { ids: [...FAQ_IDS] },
  );
  if (existing.length !== FAQ_IDS.length) {
    throw new Error(
      `Missing FAQ docs. Found ${existing.length}/${FAQ_IDS.length}: ${existing.join(", ")}`,
    );
  }

  await sanityClient
    .patch(FAQ_COLLECTION_ID)
    .set({
      title: "Prisliste FAQ",
      description: "Shared FAQ pack for the Pricing page (NO/EN on FAQ items).",
      questions: FAQ_IDS.map((id, i) => ({
        _type: "reference",
        _ref: id,
        _key: `faq${i}`,
      })),
    })
    .commit();

  await sanityClient
    .patch(page._id)
    .set({
      title: i18nStr("Prisliste", "Price list"),
      introText: i18nText(
        "Oversiktlige priser sortert etter tjeneste",
        "Clear prices organised by service",
      ),
      faqTitle: i18nStr(
        "Ofte stilte spørsmål om priser",
        "Frequently asked questions about pricing",
      ),
      testimonialsTitle: i18nStr("Hva pasientene sier", "What patients say"),
      faqCollection: {
        _type: "reference",
        _ref: FAQ_COLLECTION_ID,
      },
    })
    .commit();

  try {
    await sanityClient.delete(`drafts.${page._id}`);
  } catch {
    /* none */
  }
  try {
    await sanityClient.delete(`drafts.${FAQ_COLLECTION_ID}`);
  } catch {
    /* none */
  }

  console.log("Patched pricingPage + FAQ collection", {
    page: page._id,
    faqCollection: FAQ_COLLECTION_ID,
    questions: FAQ_IDS.length,
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
