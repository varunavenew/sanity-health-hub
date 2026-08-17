#!/usr/bin/env npx tsx
/**
 * Developer-only: align /ovrige/areknuter with avenewdemo.
 * Short hero, Sklerosering chips, price, and no Om-section.
 *
 *   cd test && npx tsx sanity/patch-areknuter-hero-developer.ts
 */
import { FLERE_PAGE_CONTENT } from "./data/flere-fagomrader-page-content";
import { THEMES_ARIA, THEMES_BY_SLUG } from "./data/flere-fagomrader-dump-parity";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const ID = "treatment-flere-fagomrader-areknuter";
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

  const content = FLERE_PAGE_CONTENT.areknuter;
  const themes = THEMES_BY_SLUG.areknuter;
  const existing = await sanityClient.fetch<{
    _id: string;
    heroNo: string | null;
    priceNo: string | null;
    labelNo: string | null;
    themes: unknown;
    reasonsCount: number;
  } | null>(
    `*[_id==$id][0]{
      _id,
      "heroNo": coalesce(heroDescription[_key=="no"][0].value, description[_key=="no"][0].value),
      "priceNo": heroPrice[_key=="no"][0].value,
      "labelNo": heroPriceLabel[_key=="no"][0].value,
      "themes": heroThemes[][_key=="no"].value,
      "reasonsCount": count(reasons)
    }`,
    { id: ID },
  );

  if (!existing) throw new Error(`Missing ${ID}`);

  console.log("before", existing);

  const patch = {
    description: i18nText(content.heroLeadNo, content.heroLeadEn),
    heroDescription: i18nText(content.heroLeadNo, content.heroLeadEn),
    heroPrice: i18nString(content.heroPriceNo!, content.heroPriceEn!),
    heroPriceLabel: i18nString(content.heroPriceLabelNo!, content.heroPriceLabelEn!),
    hideSeePriser: true,
    themesAriaLabel: i18nString(THEMES_ARIA.no, THEMES_ARIA.en),
    heroThemes: themes.map((t) => i18nString(t.no, t.en)),
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

  console.log(DRY_RUN ? "DRY" : "PATCH", ID, {
    hero: content.heroLeadNo,
    themes: themes.map((t) => t.no),
    price: content.heroPriceNo,
    unsetReasons: true,
  });

  if (!DRY_RUN) {
    await sanityClient
      .patch(ID)
      .set(patch)
      .unset(["reasons", "reasonsTitle", "reasonsLead", "reasonsLead2", "reasonsLayout"])
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
