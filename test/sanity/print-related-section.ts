import { sanityClient } from "./config";

async function run() {
  const doc = await sanityClient.fetch(`*[_type == "treatment" && (slug.current == "tverrfaglig" || slug[language == "no"][0].value.current == "tverrfaglig")][0]`);
  if (!doc) {
    console.log("No tverrfaglig document found in Sanity.");
    return;
  }
  console.log(`Document ID: ${doc._id}`);
  console.log(`relatedSection:`, JSON.stringify(doc.relatedSection, null, 2));
}

run().catch(console.error);
