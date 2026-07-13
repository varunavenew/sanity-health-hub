import { sanityClient } from "./config";

async function run() {
  const doc = await sanityClient.fetch(`*[_id == "drafts.treatment-gynekologi-tverrfaglig"][0]{ _id, linkedServices }`);
  console.log(JSON.stringify(doc, null, 2));
}

run().catch(console.error);
