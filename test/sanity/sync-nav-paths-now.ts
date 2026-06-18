/**
 * One-time sync: copy all CMS page slugs into Site Settings nav paths.
 * Usage: cd test && npx tsx sanity/sync-nav-paths-now.ts
 */
import { sanityClient } from "./config";
import {
  PAGE_TYPE_TO_NAV_ID,
  syncSiteSettingsNavPaths,
} from "./lib/nav-path-sync";

async function main() {
  const pageTypes = Object.keys(PAGE_TYPE_TO_NAV_ID);
  let updated = 0;

  for (const pageType of pageTypes) {
    const doc = await sanityClient.fetch<Record<string, unknown> | null>(
      `*[_type == $pageType && !(_id in path("drafts.**"))][0]`,
      { pageType },
    );
    if (!doc) {
      console.log(`  skip ${pageType} — no published document`);
      continue;
    }

    const result = await syncSiteSettingsNavPaths(sanityClient, doc);
    if (result.updated) {
      updated += 1;
      console.log(
        `  ✓ ${pageType} → navId "${result.navId}" → ${result.path?.[0].value} / ${result.path?.[1].value}`,
      );
    } else {
      console.log(`  — ${pageType} — already in sync`);
    }
  }

  console.log(`\nDone. ${updated} nav section(s) updated.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
