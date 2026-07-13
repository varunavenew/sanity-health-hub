import { sanityClient } from "./config";

async function run() {
  const categories = await sanityClient.fetch(
    `*[_type == "treatmentCategory"]{ _id, title, slug }`
  );
  console.log("Categories:", JSON.stringify(categories, null, 2));
}

run().catch(console.error);
