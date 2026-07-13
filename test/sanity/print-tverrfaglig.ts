import { sanityClient } from "./config";

async function run() {
  const doc = await sanityClient.fetch(`*[_type == "treatment" && (slug.current == "tverrfaglig" || slug[language == "no"][0].value.current == "tverrfaglig")][0]`);
  if (!doc) {
    console.log("No document found.");
    return;
  }
  console.log(JSON.stringify(doc, null, 2));
}

run().catch(console.error);
