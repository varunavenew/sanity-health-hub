#!/usr/bin/env npx tsx
/**
 * Developer-only: Align Trond + Nabeel specialty lists with avenewdemo treatment pages.
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";

function i18nLabel(no: string, en?: string) {
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
      value: en || no,
    },
  ];
}

function specialty(key: string, no: string, en?: string) {
  return {
    _key: `spec-${key}`,
    _type: "specialtyItem",
    label: i18nLabel(no, en),
  };
}

const UPDATES: Array<{ id: string; specialties: ReturnType<typeof specialty>[] }> = [
  {
    id: "specialist-trond-jorgensen",
    specialties: [
      specialty("urologi", "Urologi", "Urology"),
      specialty("prostatakreft", "Prostatakreft", "Prostate cancer"),
      specialty("sterilisering", "Sterilisering", "Sterilization"),
      specialty("fimoseoperasjoner", "Fimoseoperasjoner", "Phimosis surgery"),
      specialty("urologisk-kirurgi", "Urologisk kirurgi", "Urological surgery"),
    ],
  },
  {
    id: "specialist-nabeel-yousaf-khan",
    specialties: [
      specialty("urologi", "Urologi", "Urology"),
      specialty("prostata", "Prostata", "Prostate"),
      specialty("sterilisering", "Sterilisering", "Sterilization"),
      specialty("forhudsoperasjoner", "Forhudsoperasjoner", "Foreskin surgery"),
      specialty("pungkirurgi", "Pungkirurgi", "Scrotal surgery"),
    ],
  },
];

async function main() {
  if (PROJECT_ID !== "9jhqpk3a" || DATASET !== "developer") {
    throw new Error(`Refuse: ${PROJECT_ID}/${DATASET}`);
  }

  for (const row of UPDATES) {
    await sanityClient
      .patch(row.id)
      .set({ specialties: row.specialties })
      .commit({ autoGenerateArrayKeys: true });
    const draft = `drafts.${row.id}`;
    const exists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
      id: draft,
    });
    if (exists) await sanityClient.delete(draft);
    console.log("✓", row.id, "specialties=", row.specialties.length);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
