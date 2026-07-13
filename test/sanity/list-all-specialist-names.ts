import { sanityClient } from "./config";

async function run() {
  const specialists = await sanityClient.fetch(
    `*[_type == "specialist"]{ _id, name, "slug": slug.current }`
  );
  console.log("All specialists:", JSON.stringify(specialists, null, 2));
}

run().catch(console.error);
