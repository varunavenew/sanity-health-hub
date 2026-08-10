import { sanityClient } from "./config";

async function run() {
  const categories = await sanityClient.fetch(`*[_type == "treatmentCategory" && !(_id in path("drafts.**"))]{
    _id,
    categoryId,
    "sections": pageSections[]._type
  }`);
  console.log("Categories and their page sections:", JSON.stringify(categories, null, 2));
}

run().catch(console.error);
