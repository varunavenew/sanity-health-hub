#!/usr/bin/env npx tsx
/**
 * Configure multi-service booking for Fertilitetsutredning.
 *
 * Sets bookingServiceOptions on treatment-fertilitet-fertilitetsutredning so
 * the CTA opens a choice between three Metodika activities (no auto-preselect).
 *
 * Usage (from test/):
 *   npx tsx sanity/patch-fertilitetsutredning-booking-options-developer.ts
 *
 * Production (explicit only):
 *   $env:ALLOW_PRODUCTION_MIGRATION="true"
 *   $env:SANITY_DATASET_FORCE="production"
 *   npx tsx sanity/patch-fertilitetsutredning-booking-options-developer.ts
 */
import { createClient } from "@sanity/client";
import { requireSanityProjectId } from "./dataset-env";
import { config as loadEnv } from "dotenv";
import path from "path";

loadEnv({ path: path.join(process.cwd(), ".env.local") });
loadEnv({ path: path.join(process.cwd(), "..", ".env.local") });

const PROJECT_ID = requireSanityProjectId();
const TOKEN = process.env.SANITY_TOKEN?.trim() || "";
const DRY_RUN = process.env.DRY_RUN === "1";

const forceProduction =
  process.env.SANITY_DATASET_FORCE === "production" ||
  process.env.SANITY_STUDIO_FORCE_DATASET === "production";

const DATASET: "developer" | "production" =
  forceProduction && process.env.ALLOW_PRODUCTION_MIGRATION === "true"
    ? "production"
    : "developer";

const TREATMENT_ID = "treatment-fertilitet-fertilitetsutredning";

/** Slug fragments matching Metodika activity names (see resolve-booking-service.ts). */
const BOOKING_SERVICE_OPTIONS = [
  "fertilitetsutredning-for-eggfrys",
  "fertilitetsutredning-par",
  "fertilitetsutredning-singel-kvinne",
];

async function main() {
  if (!TOKEN) throw new Error("Missing SANITY_TOKEN");
  if (PROJECT_ID !== "9jhqpk3a") {
    throw new Error(`Unexpected project id: ${PROJECT_ID}`);
  }
  if (forceProduction && process.env.ALLOW_PRODUCTION_MIGRATION !== "true") {
    throw new Error(
      "Refusing production write. Set ALLOW_PRODUCTION_MIGRATION=true and SANITY_DATASET_FORCE=production",
    );
  }

  const client = createClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: "2024-01-01",
    token: TOKEN,
    useCdn: false,
  });

  const existing = await client.fetch<{ _id: string } | null>(
    `*[_id == $id][0]{ _id }`,
    { id: TREATMENT_ID },
  );
  if (!existing) {
    throw new Error(`Missing treatment: ${TREATMENT_ID} on ${DATASET}`);
  }

  console.log(`Dataset: ${DATASET}`);
  console.log(`Dry run: ${DRY_RUN ? "yes" : "no"}`);
  console.log(`Options: ${BOOKING_SERVICE_OPTIONS.join(", ")}`);

  if (!DRY_RUN) {
    await client
      .patch(TREATMENT_ID)
      .set({ bookingServiceOptions: BOOKING_SERVICE_OPTIONS })
      .unset(["bookingService"])
      .commit();
    console.log("✓ Updated bookingServiceOptions on fertilitetsutredning");
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
