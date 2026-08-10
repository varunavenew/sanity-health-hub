import { sanityClient } from "./config";

async function run() {
    const clinics: any[] = await sanityClient.fetch(
        `*[_type == "clinicPage" && !(_id in path("drafts.**"))]{
            _id,
            label,
            slug,
            sectionHeadings
        }`
    );
    for (const doc of clinics) {
        console.log(`Clinic: ${doc.label || doc._id} (${doc.slug?.current || doc.slug})`);
        console.log(JSON.stringify(doc.sectionHeadings, null, 2));
        console.log("\n──────────────────────────────────────────\n");
    }
}

run().catch(console.error);
