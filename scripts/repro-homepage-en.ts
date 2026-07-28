import { config as loadEnv } from "dotenv";
import path from "path";

loadEnv({ path: path.join(process.cwd(), ".env.local") });
process.env.NODE_ENV = "development";

async function main() {
  const { fetchHomepageData } = await import("../src/lib/sanity/homepage-data.ts");
  const { buildHomeMetadata } = await import("../src/lib/seo/route-metadata.ts");
  const { fetchCmsRouteIndex } = await import("../src/lib/routing/fetch-route-index.ts");

  console.log("1. layout: fetchCmsRouteIndex...");
  const index = await fetchCmsRouteIndex();
  console.log("   ok", Object.keys(index).length, "keys");

  console.log("2. metadata: buildHomeMetadata('en')...");
  const meta = await buildHomeMetadata("en");
  console.log("   ok", meta.title ?? "(no title)");

  for (const lang of ["no", "en"] as const) {
    console.log(`3. fetchHomepageData('${lang}')...`);
    try {
      const raw = await import("../src/lib/sanity/homepage-data.ts");
      const client = await import("../src/lib/sanityClient.ts");
      const { HOMEPAGE_QUERY } = await import("../src/lib/queries.ts");
      const direct = await client.sanityClient.fetch(HOMEPAGE_QUERY, { lang });
      console.log(`   direct fetch:`, direct ? `_id=${(direct as { _id?: string })._id}` : "NULL");

      const home = await fetchHomepageData(lang);
      console.log(`   mapped:`, home ? `title=${home.title}` : "NULL");
    } catch (e) {
      console.error(`   EXCEPTION for ${lang}:`, e);
      throw e;
    }
  }
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
