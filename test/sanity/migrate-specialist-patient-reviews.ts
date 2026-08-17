/**
 * Migration: "Hva pasientene sier" / "What patients say" on specialist profiles.
 *
 * Schema targets:
 *   - googleReview              (author, rating, text i18n, date, source)
 *   - specialist.patientReviews → array of references to googleReview (max 6)
 *
 * What it does:
 *   1. Reuses existing `review-<id>` googleReview docs from the homepage seed
 *      when present. Creates any missing ones from src/data/googleReviews.ts
 *      with internationalized text + required `source`.
 *   2. For every specialist, picks up to 6 reviews with the same matcher the
 *      live site uses (src/lib/sanity/specialist-review-match.ts):
 *        a) text mentions the specialist's first or last name
 *        b) otherwise category-keyword matches (from categories[0].categoryId)
 *        c) padded with general reviews so every profile has ≥ 3
 *      and writes them to `patientReviews`.
 *
 * Existing `patientReviews` are preserved unless FORCE=1.
 *
 * Usage:
 *   cd test
 *   npm run migrate:specialist-patient-reviews:dry
 *   npm run migrate:specialist-patient-reviews
 *   FORCE=1 npm run migrate:specialist-patient-reviews
 */
import { googleReviews } from "../../src/data/googleReviews";
import { resolveSpecialistPrimaryCategory } from "../../src/lib/sanity/category-keys";
import { getAutoMatchedReviews } from "../../src/lib/sanity/specialist-review-match";
import { sanityClient } from "./config";
import { i18nText } from "./lib/category-landing-i18n";

const DRY_RUN = process.env.DRY_RUN === "1" || process.argv.includes("--dry-run");
const FORCE = process.env.FORCE === "1";
const MAX_REVIEWS = 6;

/** English bodies keyed by static googleReviews.ts id (same as migrate-google-reviews-en). */
const REVIEW_EN: Record<number, string> = {
  1: "Fantastic experience – friendly and highly skilled doctor. She made me feel very safe and gave me useful information. The doctor is Siri Kløkstad.",
  2: "I had a very pleasant and positive experience with egg freezing at CMedical. My doctor Jackson was highly skilled and reassuring.",
  3: "Good service and follow-through. Fantastic staff, beautiful facilities and good food.",
  4: "From start to finish after the operation, everything has run smoothly. Very satisfied.",
  5: "After robot-assisted surgery for prostate cancer with surgeon Nicolai Wessel, I am extremely satisfied.",
  6: "Top marks on every point from reception through to aftercare. The responsible physician was Trond Jørgensen.",
  7: "Exceptionally skilled hand surgeon Jan Ragnar Haugstvedt! The whole experience was fantastic.",
  8: "A very positive experience at CMedical. Gynaecologist Ida was thorough and made me feel safe.",
  9: "A particularly good experience with shoulder surgery performed by senior consultant Kristian Marstrand Warholm.",
  10: "A pleasant and positive experience. I felt well looked after :)",
  11: "A lovely place with wonderful people. A great experience with egg freezing.",
  12: "I had IVF here in 2023 and ended up with a beautiful boy after three attempts.",
  13: "Very professional treatment, friendly and conscientious staff.",
  14: "Ingvild Aanerud is a skilled osteopath with extensive knowledge of women's health.",
};

type ExistingReview = {
  _id: string;
  author?: string;
  text?: unknown;
  source?: string;
};

function reviewDocId(id: number) {
  return `review-${id}`;
}

function relativeNoToIso(input: string): string | undefined {
  if (!input) return undefined;
  const s = input.toLowerCase().trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  const m = s.match(/(\d+)?\s*(dag|uke|måned|maned|år|ar)/);
  if (!m) return undefined;
  const n = Number(m[1] || 1);
  const unit = m[2];
  const d = new Date();
  if (unit.startsWith("dag")) d.setDate(d.getDate() - n);
  else if (unit.startsWith("uke")) d.setDate(d.getDate() - n * 7);
  else if (unit.startsWith("m")) d.setMonth(d.getMonth() - n);
  else d.setFullYear(d.getFullYear() - n);
  return d.toISOString().slice(0, 10);
}

function isI18nText(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.some(
      (row) =>
        row &&
        typeof row === "object" &&
        typeof (row as { value?: unknown }).value === "string",
    )
  );
}

function pickReviewText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (!Array.isArray(value)) return "";
  const no = value.find(
    (row) =>
      (row as { language?: string; _key?: string }).language === "no" ||
      (row as { _key?: string })._key === "no",
  ) as { value?: unknown } | undefined;
  const first = (no ?? value[0]) as { value?: unknown } | undefined;
  return typeof first?.value === "string" ? first.value.trim() : "";
}

function resolveExistingId(
  staticId: number,
  author: string,
  existing: ExistingReview[],
): string | undefined {
  const preferred = reviewDocId(staticId);
  if (existing.some((doc) => doc._id === preferred || doc._id === `drafts.${preferred}`)) {
    return preferred;
  }
  const legacy = `googleReview.static-${staticId}`;
  if (existing.some((doc) => doc._id === legacy || doc._id === `drafts.${legacy}`)) {
    return legacy;
  }
  const authorKey = author.trim().toLowerCase();
  const byAuthor = existing.find(
    (doc) => (doc.author || "").trim().toLowerCase() === authorKey,
  );
  return byAuthor?._id.replace(/^drafts\./, "");
}

async function run() {
  console.log(
    `🔍 ${googleReviews.length} seed review(s) from src/data/googleReviews.ts${DRY_RUN ? " (DRY RUN)" : ""}`,
  );

  const existing = await sanityClient.fetch<ExistingReview[]>(
    `*[_type == "googleReview" && !(_id in path("drafts.**"))]{_id, author, text, source}`,
  );

  let createdReviews = 0;
  let patchedReviews = 0;
  const idByStaticId = new Map<number, string>();

  for (const review of googleReviews) {
    const existingId = resolveExistingId(review.id, review.name, existing);
    const docId = existingId || reviewDocId(review.id);
    idByStaticId.set(review.id, docId);

    const en = REVIEW_EN[review.id] || review.text;
    const doc = {
      _id: docId,
      _type: "googleReview",
      author: review.name,
      rating: review.rating,
      text: i18nText(review.text, en),
      source: review.source === "legelisten" ? "legelisten" : "google",
      ...(relativeNoToIso(review.date) ? { date: relativeNoToIso(review.date) } : {}),
    };

    const current = existing.find(
      (row) => row._id === docId || row._id === `drafts.${docId}`,
    );
    const needsWrite =
      !current ||
      FORCE ||
      !isI18nText(current.text) ||
      !current.source ||
      !pickReviewText(current.text);

    if (!needsWrite) continue;

    if (!DRY_RUN) {
      if (current) {
        await sanityClient
          .patch(docId)
          .set({
            author: doc.author,
            rating: doc.rating,
            text: doc.text,
            source: doc.source,
            ...(doc.date ? { date: doc.date } : {}),
          })
          .commit({ autoGenerateArrayKeys: true });
        patchedReviews++;
      } else {
        await sanityClient.createIfNotExists(doc);
        createdReviews++;
      }
    } else if (current) {
      patchedReviews++;
    } else {
      createdReviews++;
    }
  }
  console.log(
    `   ✓ googleReview docs — create ${createdReviews}, patch ${patchedReviews}`,
  );

  const specialists: {
    _id: string;
    name: string;
    categories?: Array<{ categoryId?: string; slug?: string }>;
    patientReviews?: { _ref: string }[];
  }[] = await sanityClient.fetch(
    `*[_type == "specialist" && !(_id in path("drafts.**"))]{
      _id,
      name,
      "categories": categories[]->{ categoryId, "slug": slug[language == "no"][0].value.current },
      patientReviews
    }`,
  );
  console.log(`🔍 Found ${specialists.length} specialist(s).\n`);

  const matchItems = googleReviews.map((review) => ({
    id: String(review.id),
    text: review.text,
  }));

  let updated = 0;
  let skipped = 0;
  let errors = 0;

  for (const specialist of specialists) {
    try {
      const existingRefs = Array.isArray(specialist.patientReviews)
        ? specialist.patientReviews
        : [];
      if (existingRefs.length > 0 && !FORCE) {
        console.log(
          `⏭  Skipped (already has ${existingRefs.length} review(s)): ${specialist.name}`,
        );
        skipped++;
        continue;
      }

      const category = resolveSpecialistPrimaryCategory(specialist.categories);
      const picked = getAutoMatchedReviews(
        specialist.name || "",
        category,
        matchItems,
      ).slice(0, MAX_REVIEWS);

      if (picked.length === 0) {
        console.log(`⏭  Skipped (no matches): ${specialist.name}`);
        skipped++;
        continue;
      }

      const refs = picked.map((item) => {
        const staticId = Number(item.id);
        const ref = idByStaticId.get(staticId) || reviewDocId(staticId);
        return {
          _type: "reference" as const,
          _ref: ref,
          _key: `rev-${staticId}`,
        };
      });

      if (!DRY_RUN) {
        await sanityClient.patch(specialist._id).set({ patientReviews: refs }).commit();
      }
      console.log(
        `✓ ${specialist.name} → ${refs.length} review(s) [${category || "general"}]`,
      );
      updated++;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`✗ Failed: ${specialist.name} — ${message}`);
      errors++;
    }
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`Review documents:  create ${createdReviews}, patch ${patchedReviews}`);
  console.log(`Specialists set:   ${updated}`);
  console.log(`Skipped:           ${skipped}`);
  console.log(`Errors:            ${errors}`);
  if (DRY_RUN) console.log("\n(dry run — no changes committed)");
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
