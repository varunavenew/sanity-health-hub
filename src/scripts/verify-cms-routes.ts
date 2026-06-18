/**
 * Verify CMS route index resolves all Sanity slugs to routable paths.
 * Usage: npx tsx src/scripts/verify-cms-routes.ts
 */
import { CMS_ROUTE_INDEX_QUERY, NAV_PATHS_FOR_ROUTE_INDEX_QUERY } from "@/lib/queries";
import type { CmsRouteIndex } from "@/lib/routing/cms-route-types";
import { enrichRouteIndexWithNavPaths } from "@/lib/routing/enrich-route-index";
import { resolveCmsRoute, staticParamsFromRouteIndex } from "@/lib/routing/resolve-route";
import { sanityClient } from "@/lib/sanityClient";

async function main() {
  const [index, navItems] = await Promise.all([
    sanityClient.fetch<CmsRouteIndex>(CMS_ROUTE_INDEX_QUERY),
    sanityClient.fetch<import("@/lib/routing/enrich-route-index").NavPathSource[]>(
      NAV_PATHS_FOR_ROUTE_INDEX_QUERY,
    ),
  ]);

  const enriched = enrichRouteIndexWithNavPaths(index, navItems ?? []);
  const params = staticParamsFromRouteIndex(enriched);

  let resolved = 0;
  const failures: string[] = [];

  for (const { locale, segments } of params) {
    const route = resolveCmsRoute(segments, locale, enriched);
    if (route) resolved += 1;
    else failures.push(`/${locale}/${segments.join("/")}`);
  }

  console.log(`CMS routes: ${params.length} paths, ${resolved} resolved, ${failures.length} failed`);
  if (failures.length) {
    console.log("\nUnresolved paths:");
    for (const path of failures.slice(0, 20)) console.log(`  ${path}`);
    if (failures.length > 20) console.log(`  …and ${failures.length - 20} more`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
