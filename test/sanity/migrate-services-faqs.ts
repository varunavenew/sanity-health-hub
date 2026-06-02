#!/usr/bin/env npx tsx
/**
 * Seeds inline FAQs on servicesPage (visible in Studio under FAQ tab).
 * Patches both published and draft documents. Also creates standalone faq docs.
 *
 * From test/:
 *   npm run migrate:services-faqs
 */
import { sanityClient } from "./config";
import { i18nString } from "./lib/category-landing-i18n";
import { patchSingletonFields } from "./lib/patch-singleton";
import { servicesPageFaqs } from "./data/services-page-faqs";

const faqFields = {
  faqSectionTitle: i18nString(
    "Ofte stilte spørsmål",
    "Frequently asked questions",
  ),
  faqs: servicesPageFaqs,
  faqCategory: "tjenester",
};

const standaloneFaqs = servicesPageFaqs.map((row, i) => ({
  _id: `faq-tjenester-${row._key}`,
  _type: "faq" as const,
  question: row.question,
  answer: row.answer,
  category: "tjenester",
  sortOrder: i + 1,
}));

async function main() {
  console.log("▶ Patching servicesPage (published + draft)…");
  const patched = await patchSingletonFields("servicesPage", faqFields);
  console.log(`✓ Patched: ${patched.join(", ") || "(none)"}`);

  const check = await sanityClient.fetch<
    { _id: string; faqCount: number }[]
  >(
    `*[_id in ["servicesPage", "drafts.servicesPage"]]{
      _id,
      "faqCount": count(faqs)
    }`,
  );
  for (const row of check) {
    console.log(`  · ${row._id}: ${row.faqCount} FAQ rows`);
  }

  console.log("▶ Creating standalone FAQ documents (tjenester)…");
  const tx = sanityClient.transaction();
  for (const faq of standaloneFaqs) {
    tx.createOrReplace(faq);
  }
  const result = await tx.commit();
  console.log(`✓ ${result.results.length} faq documents`);
}

main().catch((e) => {
  console.error("✗ Migration failed:", e);
  process.exit(1);
});
