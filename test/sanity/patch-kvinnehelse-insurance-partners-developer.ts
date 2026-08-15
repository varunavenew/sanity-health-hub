/**
 * Developer-only: align shared kvinnehelse insurance partners with avenewdemo reference.
 */
import { sanityClient } from "./config";

const COLLECTION_ID = "insurance-collection.shared-kvinnehelse";

function i18n(no: string, en: string) {
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

function partner(key: string, label: string) {
  return {
    _key: key,
    _type: "object",
    key,
    label: i18n(label, label),
  };
}

/** Reference order from avenewdemo gynekologi insurance band. */
const PARTNERS = [
  partner("gjensidige", "Gjensidige"),
  partner("if", "If"),
  partner("fremtind", "Fremtind"),
  partner("avanova", "Avanova"),
  partner("tryg", "Tryg"),
  partner("vertikal", "Vertikal"),
  partner("falck", "Falck"),
  partner("euroaccident", "Euro Accident"),
  partner("vialia", "Vialia"),
];

async function main() {
  const exists = await sanityClient.fetch(`count(*[_id == $id])`, {
    id: COLLECTION_ID,
  });
  if (!exists) {
    throw new Error(`Missing ${COLLECTION_ID}`);
  }

  await sanityClient
    .patch(COLLECTION_ID)
    .set({ partners: PARTNERS })
    .commit({ visibility: "sync" });

  // Keep draft in sync if present
  const draftId = `drafts.${COLLECTION_ID}`;
  const hasDraft = await sanityClient.fetch(`count(*[_id == $id])`, {
    id: draftId,
  });
  if (hasDraft) {
    await sanityClient
      .patch(draftId)
      .set({ partners: PARTNERS })
      .commit({ visibility: "sync" });
  }

  const verify = await sanityClient.fetch(
    `*[_id == $id][0]{ "labels": partners[].label[language=="no"][0].value }`,
    { id: COLLECTION_ID },
  );
  console.log(JSON.stringify(verify, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
