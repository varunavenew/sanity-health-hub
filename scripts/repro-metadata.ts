import { config as loadEnv } from "dotenv";
import path from "path";

loadEnv({ path: path.join(process.cwd(), ".env.local") });

const { buildHomeMetadata } = await import("../src/lib/seo/route-metadata.ts");
const { fetchCmsRouteIndex } = await import("../src/lib/routing/fetch-route-index.ts");
const { resolveCmsRoute } = await import("../src/lib/routing/resolve-route.ts");
const { buildCmsRouteMetadata } = await import("../src/lib/routing/render-cms-route.tsx");

console.log("buildHomeMetadata...");
const meta = await buildHomeMetadata("en");
console.log("meta ok", meta.title);

console.log("services route metadata...");
const index = await fetchCmsRouteIndex();
const route = resolveCmsRoute(["services"], "en", index);
console.log("route", route);
if (route) {
  const m2 = await buildCmsRouteMetadata(route, "en");
  console.log("services meta ok", m2.title);
}
