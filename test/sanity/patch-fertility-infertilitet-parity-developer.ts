#!/usr/bin/env npx tsx
/**
 * Developer-only: Infertilitet treatment parity vs avenewdemo reference.
 *
 * - Remove FAQ + insurance for this treatment only
 * - Set 3 specialists (Birgitte, Jackson, Kjersti)
 * - Align related services order (no IVF; include assistert-par-og-single)
 * - Align hero CTA / mid-CTA / promise titles
 * - Clinic chip source: clinicPage-majorstuen title → "Majorstuen"
 *
 *   cd test && npx tsx sanity/patch-fertility-infertilitet-parity-developer.ts
 */
import { randomBytes } from "crypto";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const TREATMENT_ID = "treatment-fertilitet-infertilitet";
const CLINIC_ID = "clinicPage-majorstuen";

const SPECIALIST_IDS = [
  "specialist-birgitte-mitlid-mork",
  "specialist-jackson-tok",
  "specialist-kjersti-brenden",
] as const;

const RELATED_IDS = [
  "treatment-fertilitet-assistert-befruktning",
  "treatment-fertilitet-eggfrys",
  "treatment-fertilitet-donorbehandling",
  "treatment-fertilitet-hysteroskopi",
  "treatment-fertilitet-saedanalyse",
  "treatment-fertilitet-assistert-befruktning-for-par-og-single",
] as const;

function refKey(): string {
  return randomBytes(6).toString("hex");
}

function refs(ids: readonly string[]) {
  return ids.map((id) => ({
    _type: "reference" as const,
    _ref: id,
    _key: refKey(),
  }));
}

async function ensureI18nString(
  docId: string,
  field: string,
  language: "no" | "en",
  value: string,
) {
  const current = await sanityClient.fetch<
    Array<{ _key?: string; language?: string; value?: string }> | null
  >(`*[_id == $id][0].${field}`, { id: docId });

  if (!Array.isArray(current) || current.length === 0) {
    await sanityClient
      .patch(docId)
      .set({
        [field]: [
          {
            _key: language,
            _type: "internationalizedArrayStringValue",
            language,
            value,
          },
        ],
      })
      .commit({ autoGenerateArrayKeys: true });
    return;
  }

  const byLang = current.find((row) => row.language === language || row._key === language);
  if (byLang?._key) {
    await sanityClient
      .patch(docId)
      .set({ [`${field}[_key=="${byLang._key}"].value`]: value })
      .commit();
    return;
  }

  await sanityClient
    .patch(docId)
    .insert("after", `${field}[-1]`, [
      {
        _key: language,
        _type: "internationalizedArrayStringValue",
        language,
        value,
      },
    ])
    .commit({ autoGenerateArrayKeys: true });
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing to run on dataset "${DATASET}". Developer only.`);
  }

  for (const id of SPECIALIST_IDS) {
    const exists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, { id });
    if (!exists) throw new Error(`Missing specialist: ${id}`);
  }
  for (const id of RELATED_IDS) {
    const exists = await sanityClient.fetch<string | null>(
      `*[_id==$id && !(_id in path("drafts.**"))][0]._id`,
      { id },
    );
    if (!exists) throw new Error(`Missing published related treatment: ${id}`);
  }

  const pageSections = await sanityClient.fetch<
    Array<Record<string, unknown> & { _type?: string; _key?: string }>
  >(`*[_id==$id][0].pageSections[]`, { id: TREATMENT_ID });

  if (!Array.isArray(pageSections)) {
    throw new Error("pageSections missing on treatment");
  }

  const nextSections = pageSections
    .filter((section) => section._type !== "pageSectionInsurance")
    .map((section) => {
      if (section._type !== "pageSectionSpecialists") return section;
      return {
        ...section,
        displayMode: "manual",
        variant: section.variant || "carousel",
        specialists: refs(SPECIALIST_IDS),
        seeAllHref: "/spesialister?kategori=fertilitet",
        seeAllLabel: [
          {
            _key: "no",
            _type: "internationalizedArrayStringValue",
            language: "no",
            value: "Se alle fertilitetsspesialister",
          },
          {
            _key: "en",
            _type: "internationalizedArrayStringValue",
            language: "en",
            value: "See all fertility specialists",
          },
        ],
      };
    });

  // FAQ + insurance partners empty → sections omitted by visibility gates.
  await sanityClient
    .patch(TREATMENT_ID)
    .unset(["faqs", "faqCollection", "faqSectionTitle", "insurancePartners"])
    .set({
      pageSections: nextSections,
      hideSeePriser: true,
      "relatedSection.items": refs(RELATED_IDS),
    })
    .commit({ autoGenerateArrayKeys: true });

  await ensureI18nString(
    TREATMENT_ID,
    "primaryCtaLabel",
    "no",
    "Se ledige tider og book",
  );
  await ensureI18nString(
    TREATMENT_ID,
    "primaryCtaLabel",
    "en",
    "See available times and book",
  );
  await ensureI18nString(
    TREATMENT_ID,
    "conversationCtaTitle",
    "no",
    "Snakk med en av våre fertilitetsspesialister",
  );
  await ensureI18nString(
    TREATMENT_ID,
    "conversationCtaTitle",
    "en",
    "Talk to one of our fertility specialists",
  );

  // Promise card 2 title parity (reference: Erfarne spesialister).
  const promises = await sanityClient.fetch<
    Array<{
      _key?: string;
      title?: Array<{ _key?: string; language?: string; value?: string }>;
    }>
  >(`*[_id==$id][0].promises[]{_key, title}`, { id: TREATMENT_ID });

  const second = promises?.[1];
  if (second?._key) {
    const title = Array.isArray(second.title) ? [...second.title] : [];
    const upsert = (language: "no" | "en", value: string) => {
      const idx = title.findIndex((row) => row.language === language || row._key === language);
      const row = {
        _key: language,
        _type: "internationalizedArrayStringValue",
        language,
        value,
      };
      if (idx >= 0) title[idx] = { ...title[idx], ...row, value };
      else title.push(row);
    };
    upsert("no", "Erfarne spesialister");
    upsert("en", "Experienced specialists");
    await sanityClient
      .patch(TREATMENT_ID)
      .set({ [`promises[_key=="${second._key}"].title`]: title })
      .commit();
  } else {
    console.warn("Could not locate promises[1] for title patch");
  }

  // Clinic label source used by specialist cards.
  await ensureI18nString(CLINIC_ID, "title", "no", "Majorstuen");
  await ensureI18nString(CLINIC_ID, "title", "en", "Majorstuen");

  const verify = await sanityClient.fetch(`*[_id==$id][0]{
    "faqCount": count(faqs),
    "faqCollection": faqCollection._ref,
    "insurancePartners": count(insurancePartners),
    "hasInsuranceSection": count(pageSections[_type=="pageSectionInsurance"]),
    "specialists": pageSections[_type=="pageSectionSpecialists"][0].specialists[]._ref,
    "related": relatedSection.items[]._ref,
    "hideSeePriser": hideSeePriser,
    "primaryCta": primaryCtaLabel[language=="no"][0].value,
    "conversation": conversationCtaTitle[language=="no"][0].value,
    "promise2": promises[1].title[language=="no"][0].value
  }`, { id: TREATMENT_ID });

  const clinicTitle = await sanityClient.fetch(
    `*[_id==$id][0]{ "no": title[language=="no"][0].value, "en": title[language=="en"][0].value }`,
    { id: CLINIC_ID },
  );

  console.log("✓ Patched Infertilitet parity on developer");
  console.log(JSON.stringify({ verify, clinicTitle, dataset: DATASET }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
