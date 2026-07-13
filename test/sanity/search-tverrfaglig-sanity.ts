import { sanityClient } from "./config";

async function run() {
  const query = `*[_type == "treatment" && (
    title[].value match "*tverrfaglig*" || 
    description[].value match "*tverrfaglig*" ||
    reasons[].desc[].value match "*tverrfaglig*" ||
    relatedSection.title[].value match "*tverrfaglig*"
  )]`;
  const docs = await sanityClient.fetch(query);
  console.log(`Found ${docs.length} treatments match tverrfaglig:`);
  for (const doc of docs) {
    console.log(`- ${doc._id} (${(doc.title as any[] || []).find(t => t.language === "no")?.value})`);
  }
}

run().catch(console.error);
