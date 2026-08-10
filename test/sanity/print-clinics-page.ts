import { sanityClient } from "./config";

async function run() {
    const doc = await sanityClient.fetch(`*[_type == "clinicsPage"][0]`);
    console.log("ClinicsPage doc:", JSON.stringify(doc, null, 2));
}
run().catch(console.error);
