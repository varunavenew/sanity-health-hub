import { config as loadEnv } from "dotenv";
import path from "path";

loadEnv({ path: path.join(process.cwd(), ".env.local") });

async function main() {
  const { fetchCmsRouteIndex } = await import("../src/lib/routing/fetch-route-index.ts");
  const { fetchHomepageData } = await import("../src/lib/sanity/homepage-data.ts");
  const { resolveCmsRoute } = await import("../src/lib/routing/resolve-route.ts");
  const { renderCmsRoute } = await import("../src/lib/routing/render-cms-route.tsx");

  console.log("fetch index...");
  const index = await fetchCmsRouteIndex();
  console.log("index ok");

  console.log("fetch homepage...");
  const home = await fetchHomepageData("no");
  console.log("home ok", home ? "yes" : "null");

  console.log("resolve /en route empty...");
  const route = resolveCmsRoute([], "en", index);
  console.log("route", route?.kind);

  console.log("render homepage...");
  try {
    const el = await renderCmsRoute(
      { kind: "singleton", documentType: "homepage", locale: "en" } as any,
      "en",
      false,
    );
    console.log("render ok", Boolean(el));
  } catch (e) {
    console.error("RENDER FAILED:", e);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("EXCEPTION:", e);
  process.exit(1);
});
