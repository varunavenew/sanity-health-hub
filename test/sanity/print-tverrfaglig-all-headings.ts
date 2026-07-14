import { sanityClient } from "./config";

async function run() {
  const doc = await sanityClient.fetch(`*[_id == "drafts.treatment-gynekologi-tverrfaglig"][0]`);
  if (!doc) {
    console.log("No document found.");
    return;
  }
  
  // Find any fields containing "team" or "tverrfaglig" in their values
  for (const [key, value] of Object.entries(doc)) {
    const str = JSON.stringify(value);
    if (str.toLowerCase().includes("team") || str.toLowerCase().includes("tverrfaglig")) {
      console.log(`Field: ${key}`);
      console.log(`Value:`, JSON.stringify(value, null, 2));
      console.log("-----------------------------------------");
    }
  }
}

run().catch(console.error);
