/**
 * Developer-only: seed Mid-page CTA button fields on treatments that already
 * have a mid-page heading (conversationCtaTitle).
 *
 *   cd test && npx tsx sanity/patch-mid-cta-buttons-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

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

const DEFAULT_PRIMARY = i18nString(
  "Se ledige tider og book",
  "See available times and book",
);
const DEFAULT_CALL = i18nString("Ring oss", "Call us");

function hasI18nValue(value: unknown): boolean {
  if (!Array.isArray(value)) return false;
  return value.some(
    (row) =>
      row &&
      typeof row === "object" &&
      typeof (row as { value?: unknown }).value === "string" &&
      String((row as { value: string }).value).trim().length > 0,
  );
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
      conversationCtaTitle?: unknown;
      primaryCtaLabel?: unknown;
      callCtaLabel?: unknown;
      midCtaPrimaryLabel?: unknown;
      midCtaCallLabel?: unknown;
      midCtaShowCallButton?: boolean;
    }>
  >(
    `*[
      _type == "treatment" &&
      !(_id in path("drafts.**")) &&
      defined(conversationCtaTitle) &&
      count(conversationCtaTitle[defined(value) && value != ""]) > 0
    ]{
      _id,
      conversationCtaTitle,
      primaryCtaLabel,
      callCtaLabel,
      midCtaPrimaryLabel,
      midCtaCallLabel,
      midCtaShowCallButton
    }`,
  );

  let updated = 0;
  for (const doc of docs) {
    const patch: Record<string, unknown> = {};
    if (!hasI18nValue(doc.midCtaPrimaryLabel)) {
      patch.midCtaPrimaryLabel = hasI18nValue(doc.primaryCtaLabel)
        ? doc.primaryCtaLabel
        : DEFAULT_PRIMARY;
    }
    if (!hasI18nValue(doc.midCtaCallLabel)) {
      patch.midCtaCallLabel = hasI18nValue(doc.callCtaLabel)
        ? doc.callCtaLabel
        : DEFAULT_CALL;
    }
    if (doc.midCtaShowCallButton == null) {
      patch.midCtaShowCallButton = true;
    }

    if (Object.keys(patch).length === 0) {
      console.log("SKIP", doc._id);
      continue;
    }

    console.log(DRY_RUN ? "DRY" : "PATCH", doc._id, Object.keys(patch).join(","));
    if (!DRY_RUN) {
      await sanityClient.patch(doc._id).set(patch).commit();
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
      "heading": conversationCtaTitle[_key=="no"][0].value,
      "primary": midCtaPrimaryLabel[_key=="no"][0].value,
      "call": midCtaCallLabel[_key=="no"][0].value,
      midCtaShowCallButton
    }`,
  );

  console.log(`\nDone. ${DRY_RUN ? "Would update" : "Updated"} ${updated}/${docs.length}.`);
  console.log("PMOS mid CTA:", JSON.stringify(verify, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
