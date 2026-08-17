#!/usr/bin/env npx tsx
/**
 * Migration: sync clinic `services[]` (Service IDs) from static canonical data → Sanity.
 *
 * Source: src/data/clinicServices.ts
 * Target: clinicPage.services (Advanced → Service IDs)
 *
 * Usage:
 *   cd test && npx tsx sanity/migrate-clinic-services.ts --dry-run
 *   cd test && npx tsx sanity/migrate-clinic-services.ts
 *   cd test && FORCE=1 npx tsx sanity/migrate-clinic-services.ts
 *
 * Flags / env:
 *   --dry-run   print changes, write nothing
 *   FORCE=1     overwrite even when services already match
 */
import { sanityClient } from "./config";
import { clinics as staticClinics } from "../../src/data/clinicServices";

const DRY = process.argv.includes("--dry-run");
const FORCE = process.env.FORCE === "1";

function isI18nSlugArray(val: unknown): boolean {
  return (
    Array.isArray(val) &&
    val.length > 0 &&
    typeof val[0] === "object" &&
    val[0] !== null &&
    String((val[0] as { _type?: string })._type).startsWith("internationalizedArraySlug")
  );
}

function slugFromDoc(doc: { slug?: unknown; _id?: string }): string | undefined {
  const slug = doc.slug;
  if (slug && typeof slug === "object" && !Array.isArray(slug)) {
    const current = (slug as { current?: string }).current;
    if (typeof current === "string" && current.trim()) return current.trim();
  }
  if (isI18nSlugArray(slug)) {
    const items = slug as { language?: string; value?: { current?: string } }[];
    const no = items.find((item) => item.language === "no");
    if (no?.value?.current?.trim()) return no.value.current.trim();
    return items[0]?.value?.current?.trim();
  }
  const id = doc._id?.replace(/^drafts\./, "") || "";
  if (id.startsWith("clinicPage-")) return id.slice("clinicPage-".length);
  return undefined;
}

function servicesEqual(a: string[] | undefined, b: string[]): boolean {
  if (!Array.isArray(a) || a.length !== b.length) return false;
  return a.every((id, i) => id === b[i]);
}

async function migrate() {
  const source = staticClinics.map((c) => ({ slug: c.slug, label: c.label, services: c.services }));
  console.log(`🏥 Syncing services for ${source.length} clinics${DRY ? " [dry-run]" : ""}\n`);

  const slugs = source.map((c) => c.slug);
  const existing: Array<{ _id: string; slug?: unknown; services?: string[] }> =
    await sanityClient.fetch(
      `*[_type == "clinicPage" && !(_id in path("drafts.**")) && (
        _id in $ids || slug.current in $slugs || count(slug[value.current in $slugs]) > 0
      )]{ _id, slug, services }`,
      { ids: slugs.map((s) => `clinicPage-${s}`), slugs },
    );

  let updated = 0;
  let skipped = 0;
  let missing = 0;

  for (const clinic of source) {
    const doc =
      existing.find((d) => slugFromDoc(d) === clinic.slug) ||
      existing.find((d) => d._id.replace(/^drafts\./, "") === `clinicPage-${clinic.slug}`);
    const id = doc?._id || `clinicPage-${clinic.slug}`;

    if (!doc && !DRY) {
      missing++;
      console.log(`  ⚠  ${clinic.label} — document missing, creating shell ${id}`);
      await sanityClient.createIfNotExists({ _id: id, _type: "clinicPage" } as any);
    }

    const current = doc?.services;
    if (!FORCE && servicesEqual(current, clinic.services)) {
      skipped++;
      console.log(`  ⏭  ${clinic.label} — ${clinic.services.length} services already match`);
      continue;
    }

    console.log(
      `  ✏️  ${clinic.label} (${id}) → ${clinic.services.length} services: ${clinic.services.join(", ")}`,
    );
    if (current?.length && !servicesEqual(current, clinic.services)) {
      console.log(`       was: ${current.join(", ")}`);
    }

    if (DRY) {
      updated++;
      continue;
    }

    await sanityClient.patch(id).set({ services: clinic.services }).commit();
    updated++;
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`Updated:  ${updated}`);
  console.log(`Skipped:  ${skipped}`);
  if (missing) console.log(`Created:  ${missing} missing document shell(s)`);
  if (DRY) console.log("\n(dry-run — no changes committed)");
  else console.log("\n✅ Done.");
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err?.message || err);
  process.exit(1);
});
