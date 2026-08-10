#!/usr/bin/env npx tsx
/**
 * Migration: Populate section headings and labels for all CMedical clinics.
 *
 * Usage:
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-clinic-headings.ts
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-clinic-headings.ts --dry-run
 */
import { sanityClient } from "./config";

const DRY_RUN = process.argv.includes("--dry-run");

const i18nString = (no: string, en: string) => [
    { _key: "no", _type: "internationalizedArrayStringValue", language: "no", value: no },
    { _key: "en", _type: "internationalizedArrayStringValue", language: "en", value: en },
];

const DEFAULT_HEADINGS = {
    servicesHeading: i18nString("Tjenester ved denne klinikken", "Services at this clinic"),
    practicalInfoHeading: i18nString("Praktisk informasjon", "Practical information"),
    practicalInfoAddress: i18nString("Adresse", "Address"),
    practicalInfoPhone: i18nString("Telefon", "Phone"),
    practicalInfoEmail: i18nString("E-post", "Email"),
    practicalInfoHours: i18nString("Åpningstider", "Opening hours"),
    practicalInfoTransport: i18nString("Kollektivtransport", "Public transport"),
    practicalInfoParking: i18nString("Parkering", "Parking"),
    practicalInfoAccessibility: i18nString("Tilgjengelighet", "Accessibility"),
    galleryHeading: i18nString("Fra klinikken", "From the clinic"),
    mapHeading: i18nString("Finn oss", "Find us"),
    faqHeading: i18nString("Ofte stilte spørsmål", "Frequently asked questions"),
};

async function run() {
    console.log(`🔍 Fetching clinic documents...${DRY_RUN ? " (DRY RUN)" : ""}`);
    
    const clinics: any[] = await sanityClient.fetch(
        `*[_type == "clinicPage" && !(_id in path("drafts.**"))]{
            _id,
            label,
            slug,
            sectionHeadings
        }`
    );

    console.log(`   Found ${clinics.length} clinic document(s).\n`);

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const doc of clinics) {
        const existingHeadings = doc.sectionHeadings || {};
        const targetHeadings = {
            ...DEFAULT_HEADINGS,
            ...existingHeadings,
            galleryHeading: existingHeadings.galleryHeading || DEFAULT_HEADINGS.galleryHeading,
            mapHeading: existingHeadings.mapHeading || DEFAULT_HEADINGS.mapHeading,
            faqHeading: existingHeadings.faqHeading || DEFAULT_HEADINGS.faqHeading,
        };

        const isSame = JSON.stringify(existingHeadings) === JSON.stringify(targetHeadings);
        
        if (isSame) {
            skippedCount++;
            continue;
        }

        const docLabel = `clinic/${doc.slug || doc._id}`;

        try {
            if (!DRY_RUN) {
                await sanityClient.patch(doc._id).set({ sectionHeadings: targetHeadings }).commit();
            }
            console.log(`✓ Populated section headings and labels for: ${docLabel}`);
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
