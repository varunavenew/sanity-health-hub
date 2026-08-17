#!/usr/bin/env npx tsx
/**
 * Developer-only: align /gynekologi/vulvalidelser hero with avenewdemo.
 *
 *   cd test && npx tsx sanity/patch-vulvalidelser-hero-developer.ts
 */
import { GYN_PAGE_CONTENT } from "./data/gynekologi-page-content";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const ID = "treatment-gynekologi-vulvalidelser";
const DRY_RUN = process.env.DRY_RUN === "1";

function i18nString(no: string, en: string) {
  return [
    {
      _key: "no",
      _type: "internationalizedArrayStringValue",
      language: "no",
      value: no,
    },
    {
      _key: "en",
      _type: "internationalizedArrayStringValue",
      language: "en",
      value: en,
    },
  ];
}

function i18nText(no: string, en: string) {
  return [
    {
      _key: "no",
      _type: "internationalizedArrayTextValue",
      language: "no",
      value: no,
    },
    {
      _key: "en",
      _type: "internationalizedArrayTextValue",
      language: "en",
      value: en,
    },
  ];
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing: dataset "${DATASET}" (developer only)`);
  }

  const content = GYN_PAGE_CONTENT.vulvalidelser;
  const existing = await sanityClient.fetch<{
    _id: string;
    titleNo: string | null;
    heroNo: string | null;
    priceNo: string | null;
  } | null>(
    `*[_id==$id][0]{
      _id,
      "titleNo": title[_key=="no"][0].value,
      "heroNo": coalesce(heroDescription[_key=="no"][0].value, description[_key=="no"][0].value),
      "priceNo": heroPrice[_key=="no"][0].value
    }`,
    { id: ID },
  );

  if (!existing) {
    throw new Error(`Missing ${ID}`);
  }

  console.log("before", {
    title: existing.titleNo,
    price: existing.priceNo,
    hero: existing.heroNo?.slice(0, 80),
  });

  const patch = {
    title: i18nString(content.titleNo, content.titleEn),
    heroTitle: i18nString(content.heroTitleNo, content.heroTitleEn),
    description: i18nText(content.heroLeadNo, content.heroLeadEn),
    heroDescription: i18nText(content.heroLeadNo, content.heroLeadEn),
    hideSeePriser: true,
    srOnlyTitle: i18nString(
      `${content.titleNo} hos CMedical`,
      `${content.titleEn} at CMedical`,
    ),
    seo: {
      _type: "seo",
      metaTitle: i18nString(
        `${content.titleNo} | CMedical`,
        `${content.titleEn} | CMedical`,
      ),
      metaDescription: i18nText(content.heroLeadNo, content.heroLeadEn),
      noIndex: false,
    },
  };

  console.log(DRY_RUN ? "DRY" : "PATCH", ID, "→", content.heroTitleNo);

  if (!DRY_RUN) {
    await sanityClient
      .patch(ID)
      .set(patch)
      .unset(["heroPrice", "heroPriceLabel"])
      .commit({ autoGenerateArrayKeys: false });
    try {
      await sanityClient.delete(`drafts.${ID}`);
    } catch {
      /* no draft */
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
