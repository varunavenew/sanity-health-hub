#!/usr/bin/env npx tsx
/**
 * Developer-only: align /ovrige/hemorroider hero + Om-section with avenewdemo.
 *
 *   cd test && npx tsx sanity/patch-hemorroider-hero-developer.ts
 */
import { FLERE_PAGE_CONTENT } from "./data/flere-fagomrader-page-content";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const ID = "treatment-flere-fagomrader-gastrokirurgi-hemorroider-og-endetarmsplager";
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

  const content = FLERE_PAGE_CONTENT.hemorroider;
  const existing = await sanityClient.fetch<{
    _id: string;
    heroNo: string | null;
    omTitle: string | null;
    omLead: string | null;
    layout: string | null;
    reasonTitles: string[];
  } | null>(
    `*[_id==$id][0]{
      _id,
      "heroNo": coalesce(heroDescription[_key=="no"][0].value, description[_key=="no"][0].value),
      "omTitle": reasonsTitle[_key=="no"][0].value,
      "omLead": reasonsLead[_key=="no"][0].value,
      "layout": reasonsLayout,
      "reasonTitles": reasons[]{ "t": title[_key=="no"][0].value }.t
    }`,
    { id: ID },
  );

  if (!existing) throw new Error(`Missing ${ID}`);
  console.log("before", existing);

  const reasons = content.reasons.map((r, index) => {
    const n = String(index + 1).padStart(2, "0");
    return {
      _key: `reason-${n}`,
      n: i18nString(n, n),
      title: i18nString(r.titleNo, r.titleEn),
      desc: i18nText(r.descNo, r.descEn),
    };
  });

  const patch = {
    description: i18nText(content.heroLeadNo, content.heroLeadEn),
    heroDescription: i18nText(content.heroLeadNo, content.heroLeadEn),
    reasonsTitle: i18nString(content.reasonsTitleNo, content.reasonsTitleEn),
    reasonsLead: i18nText(content.reasonsLeadNo!, content.reasonsLeadEn!),
    reasonsLayout: content.reasonsLayout || "prose",
    reasons,
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
    hero: content.heroLeadNo.slice(0, 90) + "…",
    omTitle: content.reasonsTitleNo,
    layout: patch.reasonsLayout,
    reasons: content.reasons.map((r) => r.titleNo),
  });

  if (!DRY_RUN) {
    await sanityClient
      .patch(ID)
      .set(patch)
      .unset(["reasonsLead2", "flow", "flowTitle", "flowImage", "flowEyebrow", "flowLinkLabel", "flowLinkHref"])
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
