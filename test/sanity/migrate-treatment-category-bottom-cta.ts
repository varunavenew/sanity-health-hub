/**
 * Migrate FAQ heading + bottom CTA copy to treatmentCategory documents (NO + EN).
 *
 * Usage:
 *   DRY_RUN=1 tsx sanity/migrate-treatment-category-bottom-cta.ts
 *   tsx sanity/migrate-treatment-category-bottom-cta.ts
 */
import { sanityClient as client } from "./config";
import {
  treatmentCategoryBottomCtaByKey,
  defaultPageUi,
} from "./data/treatment-category-bottom-cta";

const DRY_RUN = process.env.DRY_RUN === "1";

function i18nString(no: string, en: string) {
  return [
    { _key: "no", _type: "internationalizedArrayStringValue", language: "no", value: no },
    { _key: "en", _type: "internationalizedArrayStringValue", language: "en", value: en },
  ];
}

function i18nText(no: string, en: string) {
  return [
    { _key: "no", _type: "internationalizedArrayTextValue", language: "no", value: no },
    { _key: "en", _type: "internationalizedArrayTextValue", language: "en", value: en },
  ];
}

async function migrate() {
  console.log(`🚀 Migrating treatment category bottom CTA${DRY_RUN ? " (dry run)" : ""}…\n`);

  const categories = await client.fetch<
    { _id: string; categoryId: string; title?: unknown }[]
  >(`*[_type == "treatmentCategory"]{ _id, categoryId, title }`);

  let updated = 0;
  for (const cat of categories) {
    const copy = treatmentCategoryBottomCtaByKey[cat.categoryId];
    if (!copy) {
      console.warn(`   ⚠ No CTA copy for categoryId="${cat.categoryId}" (${cat._id})`);
      continue;
    }

    const quickInfo = copy.quickInfoItems ?? defaultPageUi.quickInfoItems;
    const linkedTitle = copy.linkedServicesSectionTitle ?? defaultPageUi.linkedServicesSectionTitle;
    const processTitle = copy.processSectionTitle ?? defaultPageUi.processSectionTitle;

    const patch = {
      quickInfoItems: quickInfo.map((item) => i18nString(item.no, item.en)),
      linkedServicesSectionTitle: i18nString(linkedTitle.no, linkedTitle.en),
      processSectionTitle: i18nString(processTitle.no, processTitle.en),
      faqSectionTitle: i18nString(copy.faqSectionTitle.no, copy.faqSectionTitle.en),
      bottomCta: {
        title: i18nString(copy.bottomCta.title.no, copy.bottomCta.title.en),
        subtitle: i18nText(copy.bottomCta.subtitle.no, copy.bottomCta.subtitle.en),
        primaryLabel: i18nString(copy.bottomCta.primaryLabel.no, copy.bottomCta.primaryLabel.en),
        secondaryLabel: i18nString(copy.bottomCta.secondaryLabel.no, copy.bottomCta.secondaryLabel.en),
        primaryPath: copy.bottomCta.primaryPath ?? "",
        secondaryPath: copy.bottomCta.secondaryPath ?? "/kontakt",
      },
    };

    console.log(`   • ${cat.categoryId} → ${cat._id}`);
    if (!DRY_RUN) {
      await client.patch(cat._id).set(patch).commit();
    }
    updated++;
  }

  console.log(`\n✅ ${DRY_RUN ? "Would update" : "Updated"} ${updated} treatment category document(s).`);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
