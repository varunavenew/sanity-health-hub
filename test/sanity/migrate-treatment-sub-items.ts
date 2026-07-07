#!/usr/bin/env npx tsx
/**
 * Migration: per-treatment `subItems` (3rd-column dropdown entries).
 *
 * Reads src/data/serviceCategories.ts as source-of-truth and patches each
 * matching Sanity `treatment` document with its `subItems` array. Only
 * treatments that have an `items: [...]` block in the static data are
 * touched. Other fields are left untouched.
 *
 * Idempotent: safe to re-run. Skips docs that already have a non-empty
 * `subItems` (won't overwrite editor edits) — pass FORCE=1 to override.
 *
 * Usage:
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-treatment-sub-items.ts
 *   FORCE=1 npx tsx sanity/migrate-treatment-sub-items.ts
 */
import { sanityClient } from "./config";
import { serviceCategories } from "../../src/data/serviceCategories";

const FORCE = process.env.FORCE === "1";

function slugifyKey(text: string): string {
  return text
    .toLowerCase()
    .replace(/æ/g, "ae").replace(/ø/g, "o").replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function i18nString(value: string) {
  return [{ _key: "no", _type: "internationalizedArrayStringValue", value }];
}

interface Entry {
  key: string; // "<category>/<sub>"
  parentPath: string;
  items: Array<{ label: string; path?: string; anchor?: string }>;
}

// Walk static serviceCategories and pick sub-entries that have `items`
function collectEntries(): Entry[] {
  const out: Entry[] = [];
  for (const cat of serviceCategories) {
    for (const sub of cat.subcategories) {
      if (!sub.items || sub.items.length === 0) continue;
      // Path shape: /behandlinger/<catId>/<subSlug>
      const m = sub.path.match(/^\/behandlinger\/([^/]+)\/([^/?#]+)/);
      if (!m) {
        console.warn(`   ⚠ skip "${sub.label}": path "${sub.path}" is not a treatment path`);
        continue;
      }
      const [, catId, subSlug] = m;
      out.push({
        key: `${catId}/${subSlug}`,
        parentPath: sub.path,
        items: sub.items,
      });
    }
  }
  return out;
}

async function run() {
  const entries = collectEntries();
  console.log(`📖 Collected ${entries.length} parent treatments with subItems:`);
  entries.forEach((e) => console.log(`   • ${e.key} (${e.items.length} items)`));

  console.log("\n🏥 Fetching treatment slug → _id …");
  const treatments: Array<{ _id: string; slug?: any; categorySlug?: any; subItems?: any[] }> =
    await sanityClient.fetch(
      `*[_type == "treatment" && !(_id in path("drafts.**"))]{
         _id,
         "slug": coalesce(slug[language == "no"][0].value.current, slug.current),
         "categorySlug": coalesce(category->slug[language == "no"][0].value.current, category->slug.current),
         subItems
       }`
    );
  const byKey = new Map<string, { _id: string; subItems?: any[] }>();
  for (const t of treatments) {
    if (t.categorySlug && t.slug) byKey.set(`${t.categorySlug}/${t.slug}`, { _id: t._id, subItems: t.subItems });
  }
  console.log(`   Loaded ${byKey.size} treatments.`);

  let patched = 0;
  let skipped = 0;
  const missing: string[] = [];

  for (const e of entries) {
    let doc = byKey.get(e.key);
    if (!doc) {
      const fallback = `treatment-${slugifyKey(e.key)}`;
      const exists = treatments.find((t) => t._id === fallback);
      if (exists) doc = { _id: fallback, subItems: exists.subItems };
    }
    if (!doc) {
      missing.push(e.key);
      continue;
    }

    if (!FORCE && doc.subItems && doc.subItems.length > 0) {
      console.log(`   ↷ ${e.key} — already has ${doc.subItems.length} subItems (skip; FORCE=1 to overwrite)`);
      skipped++;
      continue;
    }

    const subItems = e.items.map((item, idx) => ({
      _key: `sub-${idx}-${slugifyKey(item.label).slice(0, 12)}`,
      _type: "object",
      label: i18nString(item.label),
      ...(item.path ? { path: item.path } : {}),
      ...(item.anchor ? { anchor: item.anchor } : {}),
    }));

    await sanityClient.patch(doc._id).set({ subItems }).commit();
    console.log(`   ✓ ${e.key} → ${subItems.length} subItems`);
    patched++;
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`✅ Patched: ${patched}    ↷ Skipped: ${skipped}`);
  if (missing.length) {
    console.log(`⚠  Treatment doc not found in Sanity (${missing.length}):`);
    missing.forEach((k) => console.log(`     - ${k}`));
  }
}

run().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
