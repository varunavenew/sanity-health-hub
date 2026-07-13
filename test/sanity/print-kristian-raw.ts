import { sanityClient } from "./config";

async function run() {
  const kristian = await sanityClient.fetch(
    `*[_id == "specialist-kristian-ophaug"][0]`
  );
  console.log("Kristian raw document:", JSON.stringify(kristian, null, 2));
}

run().catch(console.error);
