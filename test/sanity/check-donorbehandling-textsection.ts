import { sanityClient } from "./config";

async function run() {
  const docs = await sanityClient.fetch(
    `*[_type == "treatment" && slug[language == "no"][0].value.current == "donorbehandling"]{ _id, title, textSection }`
  );
  console.log("Donorbehandling docs in Sanity (textSection):", JSON.stringify(docs, null, 2));
}

run().catch(console.error);
