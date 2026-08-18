#!/usr/bin/env npx tsx
/**
 * Set English nav titles for Tjenester treatments that still use Norwegian
 * (or ALL-CAPS) EN titles. Does not change Norwegian fields or slugs.
 *
 *   cd test && npx tsx sanity/patch-tjenester-en-nav-titles.ts
 *   cd test && ALLOW_PRODUCTION_MIGRATION=true npx tsx sanity/patch-tjenester-en-nav-titles.ts
 */
import { createClient } from "@sanity/client";
import { config as loadEnv } from "dotenv";
import path from "path";

loadEnv({ path: path.join(process.cwd(), ".env.local") });
loadEnv({ path: path.join(process.cwd(), "..", ".env.local") });

const DRY_RUN = process.env.DRY_RUN === "1";
const projectId =
  process.env.SANITY_PROJECT_ID?.trim() ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const token = process.env.SANITY_TOKEN?.trim();
if (!projectId || !token) throw new Error("Missing SANITY_PROJECT_ID / SANITY_TOKEN");

function client(dataset: "developer" | "production") {
  return createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    useCdn: false,
    token,
  });
}

type I18nRow = { _key?: string; _type?: string; language?: string; value?: unknown };

function setEnTitle(rows: I18nRow[] | null | undefined, en: string): I18nRow[] {
  const current = Array.isArray(rows) ? [...rows] : [];
  const noRow = current.find((r) => r.language === "no" || r._key === "no");
  const noVal =
    typeof noRow?.value === "string"
      ? noRow.value
      : typeof current[0]?.value === "string"
        ? current[0].value
        : "";
  return [
    {
      _key: "no",
      _type: noRow?._type || "internationalizedArrayStringValue",
      language: "no",
      value: noVal,
    },
    {
      _key: "en",
      _type: "internationalizedArrayStringValue",
      language: "en",
      value: en,
    },
  ];
}

/** slugNo → English nav/page title */
const TITLE_BY_SLUG: Record<string, string> = {
  infertilitet: "Infertility",
  "assistert-befruktning": "Assisted reproduction",
  fertilitetsutredning: "Fertility assessment",
  eggfrys: "Egg freezing",
  donorbehandling: "Donor treatment",
  "assistert-befruktning-for-par-og-single":
    "Assisted reproduction for couples and singles",
  hysteroskopi: "Hysteroscopy",
  saedanalyse: "Semen analysis",
  pmos: "PCOS",
};

const UROLOGI_INFERTILITY_EN = "Male infertility";
const FLERE_CATEGORY_EN = "More services";

async function patchDataset(dataset: "developer" | "production") {
  const sanity = client(dataset);
  const treatments = await sanity.fetch<
    Array<{ _id: string; title?: I18nRow[]; categoryId?: string; slugNo?: string }>
  >(
    `*[_type=="treatment" && !(_id in path("drafts.**"))]{
      _id,
      title,
      "categoryId": coalesce(category->categoryId, categories[0]->categoryId),
      "slugNo": coalesce(slug[language=="no"][0].value.current, slug[_key=="no"][0].value.current, slug.current)
    }`,
  );

  let patched = 0;
  for (const doc of treatments) {
    const slugNo = doc.slugNo || "";
    let nextEn =
      doc.categoryId === "urologi" && slugNo === "infertilitet"
        ? UROLOGI_INFERTILITY_EN
        : TITLE_BY_SLUG[slugNo];
    if (!nextEn) continue;
    if (doc.categoryId === "gynekologi" && slugNo === "hysteroskopi") {
      nextEn = "Hysteroscopy";
    }
    const currentEn =
      doc.title?.find((r) => r.language === "en" || r._key === "en")?.value;
    if (currentEn === nextEn) continue;
    if (!DRY_RUN) {
      await sanity.patch(doc._id).set({ title: setEnTitle(doc.title, nextEn) }).commit();
      const draftId = `drafts.${doc._id}`;
      const draft = await sanity.getDocument(draftId);
      if (draft) {
        await sanity
          .patch(draftId)
          .set({ title: setEnTitle((draft as { title?: I18nRow[] }).title, nextEn) })
          .commit();
      }
    }
    patched += 1;
    console.log(`  ${dataset} ${slugNo}: ${String(currentEn)} → ${nextEn}`);
  }

  const categories = await sanity.fetch<
    Array<{ _id: string; categoryId?: string; title?: I18nRow[] }>
  >(
    `*[_type=="treatmentCategory" && categoryId in ["flere-fagomrader","annet"] && !(_id in path("drafts.**"))]{
      _id, categoryId, title
    }`,
  );
  for (const cat of categories) {
    const currentEn =
      cat.title?.find((r) => r.language === "en" || r._key === "en")?.value;
    if (currentEn === FLERE_CATEGORY_EN) continue;
    if (!DRY_RUN) {
      await sanity.patch(cat._id).set({ title: setEnTitle(cat.title, FLERE_CATEGORY_EN) }).commit();
    }
    patched += 1;
    console.log(`  ${dataset} category ${cat.categoryId}: ${String(currentEn)} → ${FLERE_CATEGORY_EN}`);
  }

  console.log(`✓ ${dataset}: ${patched} title(s)${DRY_RUN ? " (dry run)" : ""}`);
}

async function main() {
  await patchDataset("developer");
  if (process.env.ALLOW_PRODUCTION_MIGRATION === "true") {
    await patchDataset("production");
  } else {
    console.log("Skipping production (set ALLOW_PRODUCTION_MIGRATION=true)");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
