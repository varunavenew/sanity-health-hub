#!/usr/bin/env npx tsx
/**
 * Developer-only: Fix gynekologi hero price label + "Pris fra" format.
 *
 * Root cause: many treatments had heroPrice but no heroPriceLabel, so the
 * frontend fell back to "Generell undersøkelse" for every gyn page.
 *
 *   cd test && npx tsx sanity/patch-gynekologi-hero-price-developer.ts
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

function normalizeNoPrice(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  let s = raw.trim();
  // "Fra kr 2 100,-" / "fra 3 200 kr" / "Pris fra 3.200 kr"
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

function normalizeEnPrice(raw: string | null | undefined, noNormalized: string | null): string | null {
  if (raw?.trim()) {
    const t = raw.trim();
    if (/^from\b/i.test(t) || /^price from\b/i.test(t)) return t;
  }
  if (!noNormalized) return raw?.trim() || null;
  const digits = noNormalized.replace(/[^0-9]/g, "");
  if (!digits) return raw?.trim() || null;
  const n = Number(digits);
  return `from NOK ${n.toLocaleString("en-US")}`;
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer") {
    throw new Error(`Refusing: dataset "${DATASET}" (developer only)`);
  }

  const rows = await sanityClient.fetch<
    Array<{
      _id: string;
      slug: string | null;
      titleNo: string | null;
      titleEn: string | null;
      priceNo: string | null;
      priceEn: string | null;
      labelNo: string | null;
      labelEn: string | null;
    }>
  >(
    `*[_type=="treatment" && !(_id in path("drafts.**")) && (
      category._ref == "category-gynekologi" ||
      references("category-gynekologi")
    )]{
      _id,
      "slug": slug[_key=="no"].value.current,
      "titleNo": title[_key=="no"][0].value,
      "titleEn": title[_key=="en"][0].value,
      "priceNo": heroPrice[_key=="no"][0].value,
      "priceEn": heroPrice[_key=="en"][0].value,
      "labelNo": heroPriceLabel[_key=="no"][0].value,
      "labelEn": heroPriceLabel[_key=="en"][0].value
    }`,
  );

  let patched = 0;
  for (const row of rows) {
    if (!row.titleNo || !row.priceNo) continue;

    const priceNo = normalizeNoPrice(row.priceNo);
    const priceEn = normalizeEnPrice(row.priceEn, priceNo);
    const labelNo = row.labelNo?.trim() || row.titleNo;
    const labelEn = row.labelEn?.trim() || row.titleEn || row.titleNo;

    const needsLabel = !row.labelNo?.trim() || !row.labelEn?.trim();
    const needsPrice =
      priceNo !== row.priceNo || (priceEn && priceEn !== row.priceEn);

    if (!needsLabel && !needsPrice) {
      console.log(`skip ${row.slug}`);
      continue;
    }

    console.log(
      `→ ${row.slug}: label "${row.labelNo || "(null)"}"→"${labelNo}" | price "${row.priceNo}"→"${priceNo}"`,
    );

    if (!DRY_RUN) {
      await sanityClient
        .patch(row._id)
        .set({
          heroPriceLabel: i18nString(labelNo, labelEn),
          heroPrice: i18nString(priceNo || row.priceNo, priceEn || row.priceEn || priceNo || row.priceNo),
        })
        .commit({ autoGenerateArrayKeys: true });

      const draftId = `drafts.${row._id}`;
      const draft = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
        id: draftId,
      });
      if (draft) await sanityClient.delete(draftId);
    }
    patched += 1;
  }

  // Align PMOS hero copy closer to demo (keep PCOS as the old name).
  const pmosLeadNo =
    "Polyendokrint Metabolsk Ovarialsyndrom (PMOS) kjennetegnes ved at kjønnshormonene er i ubalanse. (Tidligere ble dette omtalt som Polycystisk ovariesyndrom (PCOS), men endret diagnosenavn 12. mai 2026.)";
  const pmosLeadEn =
    "Polyendocrine Metabolic Ovarian Syndrome (PMOS) is characterised by an imbalance in sex hormones. (It was previously known as Polycystic Ovary Syndrome (PCOS); the diagnostic name changed on 12 May 2026.)";

  console.log(`\n→ pmos heroDescription update`);
  if (!DRY_RUN) {
    await sanityClient
      .patch("treatment-gynekologi-pmos")
      .set({
        heroDescription: [
          {
            _key: "no",
            _type: "internationalizedArrayTextValue",
            language: "no",
            value: pmosLeadNo,
          },
          {
            _key: "en",
            _type: "internationalizedArrayTextValue",
            language: "en",
            value: pmosLeadEn,
          },
        ],
        description: [
          {
            _key: "no",
            _type: "internationalizedArrayTextValue",
            language: "no",
            value: pmosLeadNo,
          },
          {
            _key: "en",
            _type: "internationalizedArrayTextValue",
            language: "en",
            value: pmosLeadEn,
          },
        ],
      })
      .commit({ autoGenerateArrayKeys: true });
  }

  console.log(`\nDone. Patched ${patched} treatments. DRY_RUN=${DRY_RUN}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
