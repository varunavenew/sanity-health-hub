import { sanityClient } from "./config";

async function run() {
  const docs = await sanityClient.fetch(`*[_id in ["treatment-gynekologi-tverrfaglig", "drafts.treatment-gynekologi-tverrfaglig"]]{ _id, relatedSection }`);
  console.log(JSON.stringify(docs, null, 2));
}

run().catch(console.error);
