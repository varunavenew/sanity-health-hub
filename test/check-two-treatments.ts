import { sanityClient } from './sanity/config';

async function run() {
    const raw = await sanityClient.fetch(
        `*[_id == "treatment-flere-fagomrader-overvektskirurgi"][0]`
    );
    console.log("FULL DOCUMENT:", JSON.stringify(raw, null, 2));
}

run().catch(console.error);
