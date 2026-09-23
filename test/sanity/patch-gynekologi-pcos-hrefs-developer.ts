#!/usr/bin/env npx tsx
/**
 * Ticket #416 — fix leftover Gynekologi landing hrefs that still point at
 * `/gynekologi/pcos` (canonical NO slug is `/gynekologi/pmos`).
 *
 *   cd test && DRY_RUN=1 npx tsx sanity/patch-gynekologi-pcos-hrefs-developer.ts
 *   cd test && npx tsx sanity/patch-gynekologi-pcos-hrefs-developer.ts
 *
 * Production:
 *   cd test && SANITY_DATASET_FORCE=production ALLOW_PRODUCTION_MIGRATION=true DRY_RUN=1 \
 *     npx tsx sanity/patch-gynekologi-pcos-hrefs-developer.ts
 *   cd test && SANITY_DATASET_FORCE=production ALLOW_PRODUCTION_MIGRATION=true \
 *     npx tsx sanity/patch-gynekologi-pcos-hrefs-developer.ts
 */
import { config as loadEnv } from "dotenv";
import path from "path";

const rootEnv = loadEnv({
  path: path.join(process.cwd(), "..", ".env.local"),
  override: false,
});
const rootToken = rootEnv.parsed?.SANITY_TOKEN?.trim();
if (rootToken && (!process.env.SANITY_TOKEN || process.env.SANITY_TOKEN.length < 40)) {
  process.env.SANITY_TOKEN = rootToken;
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { DATASET, PROJECT_ID, sanityClient } = require("./config") as typeof import("./config");

const DRY_RUN = process.env.DRY_RUN === "1";
const DOC_ID = "category-gynekologi";
const OLD = "/gynekologi/pcos";
const NEXT = "/gynekologi/pmos";

function rewriteHref(href: unknown): string | null {
  if (typeof href !== "string") return null;
  if (href === OLD || href.endsWith("/gynekologi/pcos")) return NEXT;
  return null;
}

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }
  if (DATASET !== "developer" && DATASET !== "production") {
    throw new Error(`Refusing to run on dataset "${DATASET}".`);
  }
  if (DATASET === "production" && process.env.ALLOW_PRODUCTION_MIGRATION !== "true") {
    throw new Error(
      'Refusing production without ALLOW_PRODUCTION_MIGRATION=true. Use SANITY_DATASET_FORCE=production.',
    );
  }

  console.log(`▶ Gynekologi PCOS→PMOS href patch (#416)`);
  console.log(`  project=${PROJECT_ID} dataset=${DATASET} dryRun=${DRY_RUN}`);

  const doc = await sanityClient.fetch<{
    landingPage?: {
      expertAreasSection?: { areas?: { _key?: string; href?: string }[] };
      symptomsSection?: { items?: { _key?: string; href?: string }[] };
      segments?: { _key?: string; tagLinks?: { _key?: string; href?: string }[] }[];
    };
  } | null>(`*[_id == $id][0]{ landingPage }`, { id: DOC_ID });

  if (!doc?.landingPage) {
    throw new Error(`ABORT: ${DOC_ID}.landingPage missing`);
  }

  const patches: Record<string, string> = {};

  for (const area of doc.landingPage.expertAreasSection?.areas || []) {
    const next = rewriteHref(area.href);
    if (next && area._key) {
      patches[`landingPage.expertAreasSection.areas[_key=="${area._key}"].href`] = next;
    }
  }

  for (const item of doc.landingPage.symptomsSection?.items || []) {
    const next = rewriteHref(item.href);
    if (next && item._key) {
      patches[`landingPage.symptomsSection.items[_key=="${item._key}"].href`] = next;
    }
  }

  for (const segment of doc.landingPage.segments || []) {
    for (const link of segment.tagLinks || []) {
      const next = rewriteHref(link.href);
      if (next && segment._key && link._key) {
        patches[
          `landingPage.segments[_key=="${segment._key}"].tagLinks[_key=="${link._key}"].href`
        ] = next;
      }
    }
  }

  const keys = Object.keys(patches);
  console.log(`  changes: ${keys.length}`);
  for (const key of keys) {
    console.log(`    ${key} → ${patches[key]}`);
  }

  if (keys.length === 0) {
    console.log("✓ Nothing to patch");
    return;
  }

  if (DRY_RUN) {
    console.log("DRY_RUN — no write");
    return;
  }

  await sanityClient.patch(DOC_ID).set(patches).commit();

  const draftId = `drafts.${DOC_ID}`;
  const draftExists = await sanityClient.fetch<string | null>(`*[_id==$id][0]._id`, {
    id: draftId,
  });
  if (draftExists) {
    await sanityClient.patch(draftId).set(patches).commit();
    console.log(`  also patched ${draftId}`);
  }

  console.log("✓ Patched PCOS hrefs → PMOS");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
