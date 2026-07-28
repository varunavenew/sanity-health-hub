import { config as loadEnv } from "dotenv";
import path from "path";

loadEnv({ path: path.join(process.cwd(), ".env.local") });

async function main() {
  const { fetchHomepageData } = await import("../src/lib/sanity/homepage-data.ts");
  const { HOMEPAGE_QUERY } = await import("../src/lib/queries.ts");
  const { sanityClient } = await import("../src/lib/sanityClient.ts");

  console.log("homepage query...");
  try {
    const raw = await sanityClient.fetch(HOMEPAGE_QUERY, { lang: "no" });
    console.log("raw ok", raw ? "yes" : "null");
  } catch (e) {
    console.error("HOMEPAGE_QUERY FAILED:", e);
    process.exit(1);
  }

  const mapped = await fetchHomepageData("no");
  console.log("mapped ok", mapped?.title);
}

main().catch((e) => {
  console.error("EXCEPTION:", e);
  process.exit(1);
});
