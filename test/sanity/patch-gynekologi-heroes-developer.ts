#!/usr/bin/env npx tsx
/**
 * Developer-only: Sync gynekologi (+ graviditet) treatment hero copy to demo.
 *
 * Writes heroDescription + description (+ heroTitle / price fields) from
 * data/gynekologi-page-content.ts — exact Norwegian dump wording.
 *
 *   cd test && npx tsx sanity/patch-gynekologi-heroes-developer.ts
 *   DRY_RUN=1 npx tsx sanity/patch-gynekologi-heroes-developer.ts
 *   ONLY_GROUP=gynekologi npx tsx sanity/patch-gynekologi-heroes-developer.ts
 */
import { GYN_PAGE_CONTENT } from "./data/gynekologi-page-content";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

const DRY_RUN = process.env.DRY_RUN === "1";
const ONLY_GROUP = process.env.ONLY_GROUP as
  | "graviditet"
  | "gynekologi"
  | undefined;

type PageCfg = {
  id: string;
  slug: string;
  group: "gynekologi" | "graviditet";
};

const PAGES: PageCfg[] = [
  { id: "treatment-gynekologi-undersokelse", slug: "undersokelse", group: "gynekologi" },
  { id: "treatment-gynekologi-hysteroskopi", slug: "hysteroskopi", group: "gynekologi" },
  { id: "treatment-gynekologi-endometriose", slug: "endometriose", group: "gynekologi" },
  { id: "treatment-gynekologi-adenomyose", slug: "adenomyose", group: "gynekologi" },
  { id: "treatment-gynekologi-pmos", slug: "pmos", group: "gynekologi" },
  { id: "treatment-gynekologi-poi", slug: "poi", group: "gynekologi" },
  { id: "treatment-gynekologi-pms-og-pmdd", slug: "pms-pmdd", group: "gynekologi" },
  { id: "treatment-gynekologi-blodningsforstyrrelser", slug: "blodningsforstyrrelser", group: "gynekologi" },
  { id: "treatment-gynekologi-cyster", slug: "cyster", group: "gynekologi" },
  { id: "treatment-gynekologi-celleforandringer", slug: "celleforandringer", group: "gynekologi" },
  { id: "treatment-gynekologi-vulvalidelser", slug: "vulvalidelser", group: "gynekologi" },
  { id: "treatment-gynekologi-vaginisme", slug: "vaginisme", group: "gynekologi" },
  { id: "treatment-gynekologi-urinlekkasje", slug: "urinlekkasje", group: "gynekologi" },
  { id: "treatment-gynekologi-urogynekologi", slug: "urogynekologi", group: "gynekologi" },
  { id: "treatment-gynekologi-vaginale-fremfall", slug: "vaginale-fremfall", group: "gynekologi" },
  { id: "treatment-gynekologi-overgangsalder", slug: "overgangsalder", group: "gynekologi" },
  { id: "treatment-gynekologi-kirurgi", slug: "kirurgi", group: "gynekologi" },
  { id: "treatment-gynekologi-robotkirurgi", slug: "robotkirurgi", group: "gynekologi" },
  { id: "treatment-gynekologi-fjerne-livmor", slug: "fjerne-livmor", group: "gynekologi" },
  { id: "treatment-gynekologi-labiaplastikk", slug: "labiaplastikk", group: "gynekologi" },
  { id: "treatment-gynekologi-tverrfaglig", slug: "tverrfaglig", group: "gynekologi" },
  { id: "treatment-graviditet-ultralyd", slug: "ultralyd", group: "graviditet" },
  { id: "treatment-graviditet-6-ukerskontroll", slug: "6-ukerskontroll", group: "graviditet" },
  { id: "treatment-gynekologi-fodselsskader", slug: "fodselsskader", group: "graviditet" },
  { id: "treatment-graviditet-nipt", slug: "nipt", group: "graviditet" },
  { id: "treatment-graviditet-fosterdiagnostikk", slug: "fosterdiagnostikk", group: "graviditet" },
  { id: "treatment-gynekologi-fostermedisin", slug: "fostermedisin", group: "graviditet" },
  { id: "treatment-gynekologi-graviditet", slug: "graviditet", group: "graviditet" },
  { id: "treatment-gynekologi-spontanabort", slug: "spontanabort", group: "graviditet" },
  { id: "treatment-graviditet-svangerskapsteam", slug: "svangerskapsteam", group: "graviditet" },
];

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

/** Match demo hero price format: "Pris fra 3.200 kr" */
function normalizeNoPrice(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  let s = raw.trim();
  s = s.replace(/^pris\s+/i, "");
  s = s.replace(/^fra\s+/i, "");
  s = s.replace(/^kr\s*/i, "");
  s = s.replace(/,-$/, "");
  s = s.replace(/\s*kr\.?$/i, "");
  s = s.replace(/\s+/g, "").replace(/\./g, "");
  const digits = s.replace(/[^0-9]/g, "");
  if (!digits) return raw.trim().startsWith("Pris") ? raw.trim() : `Pris fra ${raw.trim()}`;
  const n = Number(digits);
  if (!Number.isFinite(n)) return `Pris fra ${raw.trim()}`;
  const formatted = n.toLocaleString("nb-NO").replace(/\u00A0/g, ".").replace(/\s/g, ".");
  return `Pris fra ${formatted} kr`;
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing: dataset "${DATASET}" (developer only)`);
  }

  const pages = ONLY_GROUP
    ? PAGES.filter((p) => p.group === ONLY_GROUP)
    : PAGES.filter((p) => p.group === "gynekologi");

  let updated = 0;
  let skipped = 0;

  for (const page of pages) {
    const content = GYN_PAGE_CONTENT[page.slug];
    if (!content) {
      console.warn("skip (no content):", page.slug);
      skipped++;
      continue;
    }

    const existing = await sanityClient.fetch<{ _id: string } | null>(
      `*[_id == $id][0]{ _id }`,
      { id: page.id },
    );
    if (!existing) {
      console.warn("skip (missing doc):", page.id);
      skipped++;
      continue;
    }

    const priceNo = normalizeNoPrice(content.heroPriceNo);
    const priceEn = content.heroPriceEn?.trim() || null;
    const labelNo =
      content.heroPriceLabelNo?.trim() ||
      (priceNo ? content.heroTitleNo : null);
    const labelEn =
      content.heroPriceLabelEn?.trim() ||
      (priceEn ? content.heroTitleEn : null);

    const patch: Record<string, unknown> = {
      heroTitle: i18nString(content.heroTitleNo, content.heroTitleEn),
      description: i18nText(content.heroLeadNo, content.heroLeadEn),
      heroDescription: i18nText(content.heroLeadNo, content.heroLeadEn),
    };

    if (priceNo && priceEn) {
      patch.heroPrice = i18nString(priceNo, priceEn);
      if (labelNo && labelEn) {
        patch.heroPriceLabel = i18nString(labelNo, labelEn);
      }
    }

    console.log(
      DRY_RUN ? "DRY" : "PATCH",
      page.slug,
      "→",
      JSON.stringify(content.heroLeadNo).slice(0, 100) + "…",
    );

    if (!DRY_RUN) {
      await sanityClient.patch(page.id).set(patch).commit({ autoGenerateArrayKeys: false });
      // Drop draft so published wins
      try {
        await sanityClient.delete(`drafts.${page.id}`);
      } catch {
        /* no draft */
      }
    }
    updated++;
  }

  console.log(`\nDone. ${DRY_RUN ? "Would update" : "Updated"} ${updated}, skipped ${skipped}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
