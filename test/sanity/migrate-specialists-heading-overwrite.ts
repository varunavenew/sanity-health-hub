#!/usr/bin/env npx tsx
/**
 * Migration: Overwrite specialists section headings on all treatments and category pages
 * to "Spesialister som utfører dette" (NO) and "Specialists who perform this" (EN).
 *
 * Usage:
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-specialists-heading-overwrite.ts
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-specialists-heading-overwrite.ts --dry-run
 */
import { sanityClient } from "./config";

const DRY_RUN = process.argv.includes("--dry-run");

const HEADING_NO = "Spesialister som utfører dette";
const HEADING_EN = "Specialists who perform this";

const i18nString = (no: string, en: string) => [
    { _key: "no", _type: "internationalizedArrayStringValue", language: "no", value: no },
    { _key: "en", _type: "internationalizedArrayStringValue", language: "en", value: en },
];

async function run() {
    console.log(`🔍 Fetching treatments and category landing pages...${DRY_RUN ? " (DRY RUN)" : ""}`);
    
    const documents: any[] = await sanityClient.fetch(
        `*[_type in ["treatment", "treatmentCategory"] && !(_id in path("drafts.**"))]{
            _id,
            _type,
            title,
            "slug": coalesce(slug[language == "no"][0].value.current, slug[_key == "no"][0].value.current, slug.current, slug[0].value.current),
            pageSections
        }`
    );

    console.log(`   Found ${documents.length} document(s).\n`);

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const doc of documents) {
        const sections = Array.isArray(doc.pageSections) ? [...doc.pageSections] : [];
        if (sections.length === 0) {
            skippedCount++;
            continue;
        }

        let updatedDoc = false;
        
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            if (section && section._type === "pageSectionSpecialists") {
                const targetTitle = i18nString(HEADING_NO, HEADING_EN);
                
                // Compare existing title to targetTitle to avoid redundant commits
                const isSame = JSON.stringify(section.title) === JSON.stringify(targetTitle);
                if (!isSame) {
                    sections[i] = {
                        ...section,
                        title: targetTitle
                    };
                    updatedDoc = true;
                }
            }
        }

        if (!updatedDoc) {
            skippedCount++;
            continue;
        }

        const docLabel = `${doc._type}/${doc.slug || doc._id}`;

        try {
            if (!DRY_RUN) {
                await sanityClient.patch(doc._id).set({ pageSections: sections }).commit();
            }
            console.log(`✓ Overwrote specialists heading for: ${docLabel}`);
            updatedCount++;
        } catch (err: any) {
            console.error(`✗ Failed to update ${docLabel}: ${err?.message || err}`);
            errorCount++;
        }
    }

    console.log("\n──────────────────────────────────────────");
    console.log(`Processed:      ${documents.length}`);
    console.log(`Updated:        ${updatedCount}`);
    console.log(`Skipped:        ${skippedCount}`);
    console.log(`Errors:         ${errorCount}`);
    if (DRY_RUN) console.log("\n(dry run — no changes committed)");
}

run().catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
});
