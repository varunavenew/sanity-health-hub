/**
 * Migrate the specialist FAQ section (Shared Sections → FAQ).
 *
 * Writes, per specialist document:
 *   faqSectionTitle  internationalizedArrayString (NO + EN)
 *   faqCollection    reference → faqCollection-spesialist-generell
 *   unsets legacy faqs[] so homepage/services FAQs cannot leak onto profiles
 *
 * Also upserts the specialist-only FAQ items and collection from
 * test/sanity/data/specialist-faqs.ts (Reference, Waiting time, Sick leave,
 * Investigation, The company, Insurance).
 *
 * Specialists that already point at a different collection (homepage/services
 * pack: Reference, Waiting time, …) are retargeted. FORCE=1 also rewrites
 * FAQ item copy.
 *
 * Usage:
 *   cd test
 *   npm run migrate:specialist-faqs:dry
 *   npm run migrate:specialist-faqs
 *   FORCE=1 npm run migrate:specialist-faqs
 */
import {
  SPECIALIST_FAQ_COLLECTION_ID,
  SPECIALIST_FAQ_COLLECTION_TITLE,
  SPECIALIST_FAQ_SECTION_TITLE,
  specialistFaqDocId,
  specialistFaqs,
} from "./data/specialist-faqs";
import { sanityClient } from "./config";
import { i18nString, i18nText } from "./lib/category-landing-i18n";

const DRY_RUN = process.env.DRY_RUN === "1" || process.argv.includes("--dry-run");
const FORCE = process.env.FORCE === "1";

async function run() {
  console.log(
    `🔍 ${specialistFaqs.length} specialist FAQ(s) from sanity/data/specialist-faqs.ts${DRY_RUN ? " (DRY RUN)" : ""}`,
  );

  let upsertedFaqs = 0;
  for (const faq of specialistFaqs) {
    const _id = specialistFaqDocId(faq.key);
    const doc = {
      _id,
      _type: "faq",
      category: faq.category,
      sortOrder: faq.sortOrder,
      question: i18nString(faq.question.no, faq.question.en),
      answer: i18nText(faq.answer.no, faq.answer.en),
    };

    if (!DRY_RUN) {
      await sanityClient.createOrReplace(doc);
    }
    upsertedFaqs++;
    console.log(`   ✓ faq ${_id}`);
  }

  const collection = {
    _id: SPECIALIST_FAQ_COLLECTION_ID,
    _type: "faqCollection",
    title: SPECIALIST_FAQ_COLLECTION_TITLE.no,
    questions: specialistFaqs.map((faq) => ({
      _key: faq.key,
      _type: "reference" as const,
      _ref: specialistFaqDocId(faq.key),
    })),
  };

  if (!DRY_RUN) {
    await sanityClient.createOrReplace(collection);
  }
  console.log(`   ✓ faqCollection ${SPECIALIST_FAQ_COLLECTION_ID} (${collection.questions.length} questions)`);

  const specialists = await sanityClient.fetch<
    {
      _id: string;
      name: string;
      faqCollection?: { _ref?: string };
    }[]
  >(`*[_type == "specialist"]{_id, name, faqCollection}`);
  console.log(`🔍 Found ${specialists.length} specialist(s).\n`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const specialist of specialists) {
    try {
      const alreadyLinked =
        specialist.faqCollection?._ref === SPECIALIST_FAQ_COLLECTION_ID && !FORCE;
      if (alreadyLinked) {
        skipped++;
        continue;
      }

      if (!DRY_RUN) {
        await sanityClient
          .patch(specialist._id)
          .set({
            faqCollection: {
              _type: "reference",
              _ref: SPECIALIST_FAQ_COLLECTION_ID,
            },
            faqSectionTitle: i18nString(
              SPECIALIST_FAQ_SECTION_TITLE.no,
              SPECIALIST_FAQ_SECTION_TITLE.en,
            ),
          })
          .unset(["faqs"])
          .commit({ autoGenerateArrayKeys: true });
      }

      console.log(
        `✓ ${specialist.name} (${specialist._id}) ← ${SPECIALIST_FAQ_COLLECTION_ID}`,
      );
      updated++;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`✗ Failed: ${specialist.name} — ${message}`);
      errors++;
    }
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`FAQ documents:     ${upsertedFaqs}`);
  console.log(`Specialists set:   ${updated}`);
  console.log(`Skipped:           ${skipped}`);
  console.log(`Errors:            ${errors}`);
  if (DRY_RUN) console.log("\n(dry run — no changes committed)");
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
