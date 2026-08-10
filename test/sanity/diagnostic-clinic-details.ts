import { sanityClient } from "./config";

async function run() {
    const clinics: any[] = await sanityClient.fetch(
        `*[_type == "clinicPage" && !(_id in path("drafts.**"))]{
            _id,
            title,
            slug,
            phone,
            address,
            hours
        }`
    );
    for (const doc of clinics) {
        console.log(`Clinic: ${JSON.stringify(doc.title)}`);
        console.log(`Slug: ${JSON.stringify(doc.slug)}`);
        console.log(`Phone: ${doc.phone}`);
        console.log(`Address: ${doc.address}`);
        console.log(`Hours: ${JSON.stringify(doc.hours)}`);
        console.log("\n──────────────────────────────────────────\n");
    }
}

run().catch(console.error);
