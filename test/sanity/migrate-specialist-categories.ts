/**
 * Migration: Fill specialist.categories in Sanity from static specialist data.
 *
 * Maps static category keys (src/data/specialists.ts) → Sanity treatmentCategory:
 *   gynekologi  → gynekologi   (#8)
 *   fertilitet  → fertilitet   (#1)
 *   urologi     → urologi      (#6)
 *   ortopedi    → ortopedi     (#17)
 *   annet       → flere-fagomrader (#23)
 *
 * Idempotent: skips specialists whose categories already match.
 * Set FORCE=1 to overwrite existing category references.
 * Set DRY_RUN=1 to preview without writing.
 *
 * Usage:
 *   cd test && SANITY_TOKEN=xxx npm run migrate:specialist-categories
 *   cd test && npm run migrate:specialist-categories:dry
 */
import {
  STATIC_CATEGORY_TO_SANITY,
  STATIC_SPECIALIST_CATEGORIES,
} from "./data/static-specialist-categories";
import { sanityClient } from "./config";
import { slugFromSpecialistDoc, SPECIALISTS_WITH_SLUG_QUERY } from "./lib/specialist-slug-groq";

type CategoryDoc = {
  _id: string;
  categoryId?: string;
  title?: string;
  categoryNumericId?: number;
};

type SpecialistDoc = {
  _id: string;
  name?: string;
  slug?: string;
  categories?: { _ref: string; _type?: string; _key?: string }[];
};

const DRY_RUN = process.env.DRY_RUN === "1";
const FORCE = process.env.FORCE === "1";

function categoryRefsForStaticCategory(
  staticCategory: string,
  categoryIdToDocId: Map<string, string>,
): { _type: "reference"; _ref: string; _key: string }[] | null {
  const sanityCategoryId = STATIC_CATEGORY_TO_SANITY[staticCategory];
  if (!sanityCategoryId) return null;

  const docId = categoryIdToDocId.get(sanityCategoryId);
  if (!docId) return null;

  return [
    {
      _type: "reference",
      _ref: docId,
      _key: `cat-${sanityCategoryId}`,
    },
  ];
}

function sameCategoryRefs(
  current: SpecialistDoc["categories"],
  target: { _ref: string }[],
): boolean {
  const currentIds = (current ?? []).map((c) => c._ref).sort();
  const targetIds = target.map((c) => c._ref).sort();
  if (currentIds.length !== targetIds.length) return false;
  return currentIds.every((id, i) => id === targetIds[i]);
}

async function run() {
  console.log("🔍 Loading treatmentCategory documents…");
  const categories = await sanityClient.fetch<CategoryDoc[]>(
    `*[_type == "treatmentCategory"]{ _id, categoryId, title, categoryNumericId }`,
  );

  const categoryIdToDocId = new Map<string, string>();
  for (const cat of categories) {
    const key = (cat.categoryId || "").trim();
    if (key) categoryIdToDocId.set(key, cat._id);
  }

  console.log(`   Found ${categories.length} treatmentCategory doc(s):`);
  for (const cat of categories) {
    const idPart = cat.categoryNumericId != null ? `#${cat.categoryNumericId}` : "";
    console.log(`   - ${cat.categoryId} ${idPart} → ${cat._id}`);
  }

  const missingSanityKeys = [...new Set(Object.values(STATIC_CATEGORY_TO_SANITY))].filter(
    (key) => !categoryIdToDocId.has(key),
  );
  if (missingSanityKeys.length) {
    console.error(`\n❌ Missing treatmentCategory docs for: ${missingSanityKeys.join(", ")}`);
    console.error("   Create these categories in Sanity first (see migrate-service-categories.ts).");
    process.exit(1);
  }

  console.log("\n🔍 Loading Sanity specialists…");
  const rawSpecialists = await sanityClient.fetch<SpecialistDoc[]>(SPECIALISTS_WITH_SLUG_QUERY);
  const sanitySpecialists = rawSpecialists
    .map((doc) => ({ ...doc, slug: slugFromSpecialistDoc(doc) }))
    .filter((doc): doc is SpecialistDoc & { slug: string } => Boolean(doc.slug));
  const slugToSanity = new Map(sanitySpecialists.map((s) => [s.slug, s]));

  console.log(`   Found ${sanitySpecialists.length} specialist doc(s) in Sanity.`);
  console.log(`   Static source: ${STATIC_SPECIALIST_CATEGORIES.length} specialist(s).\n`);

  let updated = 0;
  let unchanged = 0;
  const unresolved: { slug: string; reason: string }[] = [];

  for (const s of STATIC_SPECIALIST_CATEGORIES) {
    const sanityDoc = slugToSanity.get(s.slug);
    if (!sanityDoc) {
      unresolved.push({ slug: s.slug, reason: "not found in Sanity" });
      continue;
    }

    const targetRefs = categoryRefsForStaticCategory(s.category, categoryIdToDocId);
    if (!targetRefs) {
      unresolved.push({
        slug: s.slug,
        reason: `unknown static category "${s.category}"`,
      });
      continue;
    }

    const sanityCategoryId = STATIC_CATEGORY_TO_SANITY[s.category];
    if (!FORCE && sameCategoryRefs(sanityDoc.categories, targetRefs)) {
      unchanged++;
      console.log(`   ⏭  ${sanityDoc.name ?? s.slug} — already ${sanityCategoryId}`);
      continue;
    }

    if (DRY_RUN) {
      updated++;
      console.log(
        `   [dry-run] ${sanityDoc.name ?? s.slug} — ${s.category} → ${sanityCategoryId} (${targetRefs[0]._ref})`,
      );
      continue;
    }

    await sanityClient.patch(sanityDoc._id).set({ categories: targetRefs }).commit();
    updated++;
    console.log(
      `   ✓ ${sanityDoc.name ?? s.slug} — ${s.category} → ${sanityCategoryId} (${targetRefs[0]._ref})`,
    );
  }

  const staticSlugs = new Set(STATIC_SPECIALIST_CATEGORIES.map((s) => s.slug));
  const sanityOnly = sanitySpecialists.filter((s) => s.slug && !staticSlugs.has(s.slug));

  console.log("\n──────────────────────────────────────────");
  console.log(`✅ Updated: ${updated}${DRY_RUN ? " (dry-run)" : ""}`);
  console.log(`⏭  Unchanged (already correct): ${unchanged}`);

  if (unresolved.length) {
    console.log(`\n⚠  Unresolved (${unresolved.length}):`);
    unresolved.forEach((u) => console.log(`     - ${u.slug}: ${u.reason}`));
  }

  if (sanityOnly.length) {
    console.log(`\nℹ  Specialists in Sanity but not in static list (${sanityOnly.length}):`);
    sanityOnly.forEach((s) =>
      console.log(`     - ${s.name ?? s.slug} (${s.slug}) — not updated by this script`),
    );
  }

  console.log("\nStatic → Sanity category mapping:");
  Object.entries(STATIC_CATEGORY_TO_SANITY).forEach(([staticKey, sanityKey]) => {
    const docId = categoryIdToDocId.get(sanityKey);
    console.log(`   ${staticKey} → ${sanityKey}${docId ? ` (${docId})` : ""}`);
  });
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
