import { config as loadEnv } from "dotenv";
import path from "path";

loadEnv({ path: path.join(process.cwd(), ".env.local") });

async function main() {
  const { fetchCmsRouteIndex } = await import("../src/lib/routing/fetch-route-index.ts");
  const { fetchHomepageData } = await import("../src/lib/sanity/homepage-data.ts");
  const { fetchServicesPageData } = await import("../src/lib/sanity/services-page-data.ts");

  console.log("1. route index...");
  const index = await fetchCmsRouteIndex();
  console.log("   ok", Object.keys(index).length, "keys");

  console.log("2. homepage...");
  const home = await fetchHomepageData("no");
  console.log("   ok", home?.title ?? "null");

  console.log("3. services...");
  const services = await fetchServicesPageData("no");
  console.log("   ok", services?.title ?? "null");
}

main().catch((e) => {
  console.error("EXCEPTION:", e);
  process.exit(1);
});
