/**
 * Migration: Convert specialist.clinics from string array → array of references
 * to clinicPage documents.
 *
 * Idempotent: skips specialists where the field is already references; warns
 * when a clinic name cannot be matched to a clinicPage doc.
 *
 * Match strategy (case-insensitive):
 *   1. clinicPage.title equals string
 *   2. clinicPage.slug.current equals slugified string
 *   3. clinicPage.title contains string (e.g. "Moelv" → "CMedical Moelv")
 *
 * Usage:
 *   SANITY_TOKEN=xxx npx tsx test/sanity/migrate-specialist-clinics.ts
 */
import { sanityClient } from "./config";

type StringOrRef = string | { _ref: string; _type: "reference"; _key?: string };

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

async function run() {
  console.log("🔍 Fetching specialists with clinics…");

  const specialists: { _id: string; name: string; clinics?: StringOrRef[] }[] =
    await sanityClient.fetch(
      `*[_type == "specialist" && defined(clinics) && count(clinics) > 0]{
        _id, name, clinics
      }`
    );
  console.log(`   Found ${specialists.length} specialist(s) with clinics.`);

  const clinicPages: { _id: string; title: string; slug: string }[] =
    await sanityClient.fetch(
      `*[_type == "clinicPage"]{ _id, title, "slug": slug.current }`
    );
  console.log(`   Loaded ${clinicPages.length} clinicPage doc(s).`);

  const findClinicId = (name: string): string | null => {
    const n = name.trim().toLowerCase();
    const slug = slugify(name);
    // exact title
    let hit = clinicPages.find((c) => c.title?.toLowerCase() === n);
    if (hit) return hit._id;
    // exact slug
    hit = clinicPages.find((c) => c.slug?.toLowerCase() === slug);
    if (hit) return hit._id;
    // contains
    hit = clinicPages.find((c) => c.title?.toLowerCase().includes(n));
    if (hit) return hit._id;
    return null;
  };

  let converted = 0;
  let skipped = 0;
  const unresolved: { specialist: string; clinic: string }[] = [];

  for (const s of specialists) {
    const list = s.clinics || [];
    const allRefs = list.every(
      (item) =>
        typeof item === "object" && item !== null && (item as any)._type === "reference"
    );
    if (allRefs) {
      skipped++;
      continue;
    }

    const refs = list
      .map((item, idx) => {
        if (typeof item === "string") {
          const id = findClinicId(item);
          if (!id) {
            unresolved.push({ specialist: s.name, clinic: item });
            return null;
          }
          return {
            _type: "reference" as const,
            _ref: id,
            _key: `clinic-${idx}-${id.slice(-6)}`,
          };
        }
        return item; // already a reference
      })
      .filter((x): x is { _type: "reference"; _ref: string; _key: string } => !!x);

    await sanityClient.patch(s._id).set({ clinics: refs }).commit();
    console.log(`   ✓ ${s.name} → ${refs.length} reference(s)`);
    converted++;
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`✅ Converted: ${converted}`);
  console.log(`⏭  Skipped (already references): ${skipped}`);
  if (unresolved.length) {
    console.log(`⚠  Unresolved clinic names (${unresolved.length}):`);
    unresolved.forEach((u) =>
      console.log(`     - "${u.clinic}" on specialist "${u.specialist}"`)
    );
    console.log(
      "   → Create matching clinicPage docs (or fix names) and re-run the script."
    );
  }
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
