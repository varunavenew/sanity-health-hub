/**
 * Verify Services page data path (server token + mapping).
 * Usage: npx tsx scripts/verify-services-page-fix.ts
 */
import { config as loadEnv } from "dotenv";
import path from "path";

loadEnv({ path: path.join(process.cwd(), ".env.local") });
loadEnv({ path: path.join(process.cwd(), "test/.env.local") });

const { fetchServicesPageData } = await import("../src/lib/sanity/services-page-data.ts");

const page = await fetchServicesPageData("no");
if (!page) {
  console.error("FAIL: fetchServicesPageData returned null");
  process.exit(1);
}
console.log("OK title:", page.title);
console.log("OK featured:", page.featuredCategories.length);
console.log("OK faqs:", page.faqs.length);
console.log("OK pageSections:", page.pageSections?.length ?? 0);
