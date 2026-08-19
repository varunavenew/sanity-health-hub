#!/usr/bin/env npx tsx
/**
 * Seed googleAnalyticsSettings singleton (GTM + consent defaults).
 *
 *   cd test && npx tsx sanity/migrate-google-analytics-settings.ts
 *   cd test && DRY_RUN=1 npx tsx sanity/migrate-google-analytics-settings.ts
 */
import { DATASET, PROJECT_ID, sanityClient } from "./config";
import {
  DEFAULT_CONSENT_HEAD_SCRIPT,
  DEFAULT_GTM_CONTAINER_ID,
  buildGtmBodyNoscriptHtml,
  buildGtmHeadScript,
} from "../../src/lib/analytics/defaults";

const DOC_ID = "googleAnalyticsSettings";
const DRY_RUN = process.argv.includes("--dry-run") || process.env.DRY_RUN === "1";

/** Seed the same NO + EN value; editors can diverge them later in Studio. */
const i18n = (value: string) => [
  { _key: "no", language: "no", value },
  { _key: "en", language: "en", value },
];

async function main() {
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Refusing to run: unexpected projectId ${PROJECT_ID}`);
  }

  console.log(`project=${PROJECT_ID} dataset=${DATASET} dryRun=${DRY_RUN}`);

  const existing = await sanityClient.fetch<{ _id?: string } | null>(
    `*[_id == $id][0]{ _id }`,
    { id: DOC_ID },
  );

  const doc = {
    _id: DOC_ID,
    _type: "googleAnalyticsSettings",
    enabled: true,
    gtmContainerId: i18n(DEFAULT_GTM_CONTAINER_ID),
    consentHeadScript: i18n(DEFAULT_CONSENT_HEAD_SCRIPT),
    gtmHeadScript: i18n(buildGtmHeadScript(DEFAULT_GTM_CONTAINER_ID)),
    gtmBodyNoscript: i18n(buildGtmBodyNoscriptHtml(DEFAULT_GTM_CONTAINER_ID)),
  };

  if (existing?._id) {
    console.log(`→ Updating ${DOC_ID}`);
    if (DRY_RUN) {
      console.log(JSON.stringify(doc, null, 2));
      return;
    }
    await sanityClient.createOrReplace(doc);
  } else {
    console.log(`→ Creating ${DOC_ID}`);
    if (DRY_RUN) {
      console.log(JSON.stringify(doc, null, 2));
      return;
    }
    await sanityClient.createOrReplace(doc);
  }

  console.log("✓ googleAnalyticsSettings ready");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
