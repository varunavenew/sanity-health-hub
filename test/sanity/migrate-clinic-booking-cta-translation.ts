#!/usr/bin/env npx tsx
/**
 * Migration: Add English translations for Booking CTA blocks in Sanity clinic documents.
 *
 * Usage:
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-clinic-booking-cta-translation.ts
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-clinic-booking-cta-translation.ts --dry-run
 */
import { sanityClient } from "./config";

const DRY_RUN = process.argv.includes("--dry-run");

const i18nString = (no: string, en: string) => [
    { _key: "no", _type: "internationalizedArrayStringValue", language: "no", value: no },
    { _key: "en", _type: "internationalizedArrayStringValue", language: "en", value: en },
];

const i18nText = (no: string, en: string) => [
    { _key: "no", _type: "internationalizedArrayTextValue", language: "no", value: no },
    { _key: "en", _type: "internationalizedArrayTextValue", language: "en", value: en },
];

async function run() {
    console.log(`🔍 Fetching clinic documents...${DRY_RUN ? " (DRY RUN)" : ""}`);
    
    const clinics: any[] = await sanityClient.fetch(
        `*[_type == "clinicPage" && !(_id in path("drafts.**"))]{
            _id,
            label,
            slug,
            pageSections
        }`
    );

    console.log(`   Found ${clinics.length} clinic document(s).\n`);

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const doc of clinics) {
        const sections = Array.isArray(doc.pageSections) ? [...doc.pageSections] : [];
        if (sections.length === 0) {
            skippedCount++;
            continue;
        }

        let updatedDoc = false;
        
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            if (section && section._type === "pageSectionBookingCta") {
                const clinicName = doc.label || "";
                const titleNo = `Bestill time ved CMedical ${clinicName}`;
                const titleEn = `Book an appointment at CMedical ${clinicName}`;
                const subNo = "Velg tjeneste, klinikk og behandler – alt i én enkel booking.";
                const subEn = "Choose service, clinic and practitioner – all in one simple booking.";

                const targetTitle = i18nString(titleNo, titleEn);
                const targetSubtitle = i18nText(subNo, subEn);

                const isSame = 
                    JSON.stringify(section.title) === JSON.stringify(targetTitle) &&
                    JSON.stringify(section.subtitle) === JSON.stringify(targetSubtitle);

                if (!isSame) {
                    sections[i] = {
                        ...section,
                        title: targetTitle,
                        subtitle: targetSubtitle
                    };
                    updatedDoc = true;
                }
            }
        }

        if (!updatedDoc) {
            skippedCount++;
            continue;
        }

        const docLabel = `clinic/${doc.slug || doc._id}`;

        try {
            if (!DRY_RUN) {
                await sanityClient.patch(doc._id).set({ pageSections: sections }).commit();
            }
            console.log(`✓ Added English translation to Booking CTA for: ${docLabel}`);
            updatedCount++;
        } catch (err: any) {
            console.error(`✗ Failed to update ${docLabel}: ${err?.message || err}`);
            errorCount++;
        }
    }

    console.log("\n──────────────────────────────────────────");
    console.log(`Processed:      ${clinics.length}`);
    console.log(`Updated:        ${updatedCount}`);
    console.log(`Skipped:        ${skippedCount}`);
    console.log(`Errors:         ${errorCount}`);
    if (DRY_RUN) console.log("\n(dry run — no changes committed)");
}

run().catch((err) => {
    console.error("❌ Migration failed:", err);
    process.exit(1);
});
