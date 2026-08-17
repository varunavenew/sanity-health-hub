#!/usr/bin/env npx tsx
/**
 * Developer-only: align /ovrige/hemorroider insurance band with avenewdemo.
 *
 * Demo partners (4-col grid):
 *   Gjensidige, If, Fremtind, Storebrand
 *   Tryg, Vertikal, Codan, Eika
 *   Vialia
 *
 * Unlinks the shared treatment collection so this page can keep its own list.
 *
 *   cd test && npx tsx sanity/patch-hemorroider-insurance-developer.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const ID =
  "treatment-flere-fagomrader-gastrokirurgi-hemorroider-og-endetarmsplager";

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

const PARTNERS = [
  partner("gjensidige", "Gjensidige"),
  partner("if", "If"),
  partner("fremtind", "Fremtind"),
  partner("storebrand", "Storebrand"),
  partner("tryg", "Tryg"),
  partner("vertikal", "Vertikal"),
  partner("codan", "Codan"),
  partner("eika", "Eika"),
  partner("vialia", "Vialia"),
];

async function discardDraft(id: string) {
  const draft = `drafts.${id}`;
  const exists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
    id: draft,
  });
  if (exists && !DRY_RUN) await sanityClient.delete(draft);
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a" || DATASET !== "developer") {
    throw new Error(`Refuse: ${PROJECT_ID}/${DATASET}`);
  }

  const doc = await sanityClient.fetch<{
    pageSections?: Array<Record<string, unknown> & {
      _key?: string;
      _type?: string;
      insuranceCollection?: { _ref?: string };
    }>;
    insurancePartnerLabels?: string[];
  } | null>(
    `*[_id==$id][0]{
      pageSections,
      "insurancePartnerLabels": insurancePartners[].label[_key=="no"][0].value
    }`,
    { id: ID },
  );
  if (!doc) throw new Error(`Missing ${ID}`);

  const band = (doc.pageSections || []).find(
    (s) => s._type === "pageSectionInsurance",
  );
  const bandLabels = Array.isArray(band?.partners)
    ? (band.partners as Array<{ label?: Array<{ _key?: string; value?: string }> }>).map(
        (p) => p.label?.find((l) => l._key === "no")?.value,
      )
    : [];
  console.log("before band", {
    key: band?._key,
    collection: band?.insuranceCollection?._ref,
    partners: bandLabels,
  });
  console.log("before legacy", doc.insurancePartnerLabels);

  if (!band?._key) {
    throw new Error("No pageSectionInsurance band on hemorroider");
  }

  const nextSections = (doc.pageSections || []).map((section) => {
    if (section._type !== "pageSectionInsurance") return section;
    const { insuranceCollection: _drop, ...rest } = section;
    return {
      ...rest,
      _type: "pageSectionInsurance",
      _key: section._key,
      title: i18n(
        "Vi har avtale med de største forsikringsselskapene i Norge.",
        "We have agreements with the largest insurance companies in Norway.",
      ),
      partners: PARTNERS,
    };
  });

  if (!DRY_RUN) {
    await sanityClient
      .patch(ID)
      .set({
        pageSections: nextSections,
        insurancePartners: PARTNERS,
        insuranceTitle: i18n(
          "Vi har avtale med de største forsikringsselskapene i Norge.",
          "We have agreements with the largest insurance companies in Norway.",
        ),
      })
      .unset([`pageSections[_key=="${band._key}"].insuranceCollection`])
      .commit({ autoGenerateArrayKeys: true });
    await discardDraft(ID);
  }

  const after = await sanityClient.fetch(
    `*[_id==$id][0]{
      "bandPartners": pageSections[_type=="pageSectionInsurance"][0].partners[].label[_key=="no"][0].value,
      "coll": pageSections[_type=="pageSectionInsurance"][0].insuranceCollection._ref
    }`,
    { id: ID },
  );
  console.log(DRY_RUN ? "dry-run" : "after", after);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
