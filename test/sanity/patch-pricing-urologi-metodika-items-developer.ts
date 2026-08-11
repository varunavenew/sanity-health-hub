#!/usr/bin/env npx tsx
/**
 * Developer-only: add Metodika-backed urologi pricing lines that exist in
 * booking but were missing from the reference scrape (e.g. cystoskopi).
 *
 *   cd test && npx tsx sanity/patch-pricing-urologi-metodika-items-developer.ts
 */
import { randomBytes } from "crypto";
import { DATASET, PROJECT_ID, sanityClient } from "./config";

function key() {
  return randomBytes(6).toString("hex");
}

function i18nStr(no: string, en: string) {
  return [
    {
      _type: "internationalizedArrayStringValue",
      _key: "no",
      language: "no",
      value: no,
    },
    {
      _type: "internationalizedArrayStringValue",
      _key: "en",
      language: "en",
      value: en,
    },
  ];
}

const EXTRA = [
  {
    nameNo: "Blod i urin, cystoskopi",
    nameEn: "Blood in urine, cystoscopy",
    priceLabel: "fra 2.650,-",
    price: 2650,
    note: "30 min",
    apiActivityId: 9,
  },
  {
    nameNo: "Prostataundersøkelse",
    nameEn: "Prostate examination",
    priceLabel: "fra 1.900,-",
    price: 1900,
    note: "30 min",
    apiActivityId: 11,
  },
  {
    nameNo: "Lavt testosteron",
    nameEn: "Low testosterone",
    priceLabel: "fra 1.900,-",
    price: 1900,
    note: "30 min",
    apiActivityId: 12,
  },
];

async function main() {
  console.log({ PROJECT_ID, DATASET });
  if (DATASET !== "developer") throw new Error("developer only");

  const page = await sanityClient.fetch<{
    _id: string;
    priceCategories: any[];
  } | null>(`*[_type=="pricingPage" && !(_id in path("drafts.**"))][0]{
    _id,
    priceCategories
  }`);
  if (!page) throw new Error("pricingPage missing");

  const cats = page.priceCategories ?? [];
  const urologiIdx = cats.findIndex((c) => c.bookingCategorySlug === "urologi");
  if (urologiIdx < 0) throw new Error("Urologi category missing");

  const cat = { ...cats[urologiIdx] };
  const subs = [...(cat.subcategories ?? [])];
  const konsIdx = subs.findIndex((s: any) => {
    const label =
      s.label?.find?.((x: any) => x.language === "no")?.value ??
      s.label?.[0]?.value ??
      "";
    return /konsultasjon/i.test(String(label));
  });
  if (konsIdx < 0) throw new Error("Urologi konsultasjoner subcategory missing");

  const sub = { ...subs[konsIdx] };
  const items = [...(sub.items ?? [])];
  const existingNames = new Set(
    items.map((i: any) =>
      String(
        i.name?.find?.((x: any) => x.language === "no")?.value ??
          i.name?.[0]?.value ??
          "",
      ).toLowerCase(),
    ),
  );

  let added = 0;
  for (const extra of EXTRA) {
    if (existingNames.has(extra.nameNo.toLowerCase())) continue;
    items.push({
      _key: key(),
      _type: "object",
      name: i18nStr(extra.nameNo, extra.nameEn),
      priceLabel: i18nStr(extra.priceLabel, extra.priceLabel),
      note: i18nStr(extra.note, extra.note),
      price: extra.price,
      apiActivityId: extra.apiActivityId,
    });
    added++;
  }

  sub.items = items;
  subs[konsIdx] = sub;
  cat.subcategories = subs;
  cats[urologiIdx] = cat;

  await sanityClient.patch(page._id).set({ priceCategories: cats }).commit();
  try {
    await sanityClient.delete(`drafts.${page._id}`);
  } catch {
    /* none */
  }

  console.log(`Added ${added} urologi Metodika lines to ${page._id}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
