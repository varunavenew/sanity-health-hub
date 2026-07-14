import { sanityClient } from "./config";

async function run() {
  const specialists = await sanityClient.fetch(
    `*[_type == "specialist" && (slug.current == "kristian-ophaug" || slug.current match "kristian")]`
  );
  console.log("Kristian Ophaug specialist doc:", JSON.stringify(specialists, null, 2));
}

run().catch(console.error);
