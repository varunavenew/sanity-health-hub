#!/usr/bin/env npx tsx
/**
 * Developer-only: restore overgangsalder Om + Symptomer to match demo.
 *
 *   cd test && npx tsx sanity/patch-overgangsalder-reasons-developer.ts
 */
import { GYN_PAGE_CONTENT, type PageContent } from "./data/gynekologi-page-content";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DOC_ID = "treatment-gynekologi-overgangsalder";

function i18nString(no: string, en: string) {
  return [
    { _type: "internationalizedArrayStringValue", _key: "no", language: "no", value: no },
    { _type: "internationalizedArrayStringValue", _key: "en", language: "en", value: en },
  ];
}

function i18nText(no: string, en: string) {
  return [
    { _type: "internationalizedArrayTextValue", _key: "no", language: "no", value: no },
    { _type: "internationalizedArrayTextValue", _key: "en", language: "en", value: en },
  ];
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  const content = GYN_PAGE_CONTENT.overgangsalder as PageContent | undefined;
  if (!content?.reasonsLeadNo || !content.reasons?.length) {
    throw new Error("Missing overgangsalder content in gynekologi-page-content.ts");
  }

  const reasons = content.reasons.map((r, i) => ({
    _key: `reason-${i}`,
    _type: "object",
    title: i18nString(r.titleNo, r.titleEn),
    desc: i18nText(r.descNo, r.descEn),
  }));

  await sanityClient
    .patch(DOC_ID)
    .unset(["reasonsLead2", "textSection"])
    .set({
      reasonsTitle: i18nString(content.reasonsTitleNo, content.reasonsTitleEn),
      reasonsLead: i18nText(content.reasonsLeadNo, content.reasonsLeadEn!),
      reasonsLayout: content.reasonsLayout || "accordion",
      reasons,
      description: i18nText(content.heroLeadNo, content.heroLeadEn),
      heroDescription: i18nText(content.heroLeadNo, content.heroLeadEn),
    })
    .commit({ autoGenerateArrayKeys: true });

  const verify = await sanityClient.fetch(
    `*[_id==$id][0]{
      "title": reasonsTitle[language=="no"][0].value,
      "lead": reasonsLead[language=="no"][0].value,
      reasonsLayout,
      "reasons": reasons[]{
        "title": title[language=="no"][0].value,
        "descStart": title[language=="no"][0].value,
        "hasBullets": desc[language=="no"][0].value match "- *"
      }
    }`,
    { id: DOC_ID },
  );

  // Fetch desc starts properly
  const verify2 = await sanityClient.fetch(
    `*[_id==$id][0]{
      "title": reasonsTitle[language=="no"][0].value,
      "leadStart": reasonsLead[language=="no"][0].value[0...80],
      reasonsLayout,
      "items": reasons[]{
        "title": title[language=="no"][0].value,
        "descStart": desc[language=="no"][0].value[0...60]
      }
    }`,
    { id: DOC_ID },
  );

  console.log(JSON.stringify({ dataset: DATASET, id: DOC_ID, verify: verify2 }, null, 2));
  void verify;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
