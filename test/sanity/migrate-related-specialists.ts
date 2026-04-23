/**
 * Migration: Convert treatment.relatedSpecialists from string slugs → true references.
 *
 * Idempotent: safe to re-run. Skips treatments where the field is already
 * an array of references, and warns when a slug cannot be matched.
 *
 * Usage:
 *   SANITY_TOKEN=xxx npx tsx test/sanity/migrate-related-specialists.ts
 */
import { sanityClient } from "./config";

type SlugOrRef = string | { _ref: string; _type: "reference"; _key?: string };

async function run() {
  console.log("🔍 Fetching treatments with relatedSpecialists…");

  const treatments: { _id: string; title: string; relatedSpecialists?: SlugOrRef[] }[] =
    await sanityClient.fetch(
      `*[_type == "treatment" && defined(relatedSpecialists) && count(relatedSpecialists) > 0]{
        _id, title, relatedSpecialists
      }`
    );

  console.log(`   Found ${treatments.length} treatment document(s).`);

  // Build a slug → _id map for all specialists
  const specialists: { _id: string; slug: string }[] = await sanityClient.fetch(
    `*[_type == "specialist" && defined(slug.current)]{ _id, "slug": slug.current }`
  );
  const slugToId = new Map(specialists.map((s) => [s.slug, s._id]));
  console.log(`   Mapped ${slugToId.size} specialist slugs.`);

  let converted = 0;
  let skipped = 0;
  let unresolved: { treatment: string; slug: string }[] = [];

  for (const t of treatments) {
    const list = t.relatedSpecialists || [];
    const allRefs = list.every(
      (item) => typeof item === "object" && item !== null && (item as any)._type === "reference"
    );
    if (allRefs) {
      skipped++;
      continue;
    }

    const refs = list
      .map((item, idx) => {
        if (typeof item === "string") {
          const id = slugToId.get(item);
          if (!id) {
            unresolved.push({ treatment: t.title, slug: item });
            return null;
          }
          return { _type: "reference" as const, _ref: id, _key: `spec-${idx}-${id.slice(-6)}` };
        }
        return item; // already a ref
      })
      .filter((x): x is { _type: "reference"; _ref: string; _key: string } => !!x);

    await sanityClient.patch(t._id).set({ relatedSpecialists: refs }).commit();
    console.log(`   ✓ ${t.title} → ${refs.length} reference(s)`);
    converted++;
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`✅ Converted: ${converted}`);
  console.log(`⏭  Skipped (already references): ${skipped}`);
  if (unresolved.length) {
    console.log(`⚠  Unresolved slugs (${unresolved.length}):`);
    unresolved.forEach((u) => console.log(`     - "${u.slug}" in "${u.treatment}"`));
  }
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
