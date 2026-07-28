/**
 * Shared Sanity configuration for migration scripts.
 *
 * Required environment variables:
 *   SANITY_TOKEN     – API token with write access (from sanity.io/manage)
 *   SANITY_DATASET   – "developer" (local) or "production" (explicit only)
 *   SANITY_PROJECT_ID
 *
 * Loads `test/.env.local` automatically when present.
 * Refuses production unless ALLOW_PRODUCTION_MIGRATION=true.
 */
import { config as loadEnv } from "dotenv";
import path from "path";
import { createClient } from "@sanity/client";
import {
  assertMigrationDatasetAllowed,
  requireSanityProjectId,
} from "./dataset-env";

// When run via `npm run …` in test/, cwd is test/
loadEnv({ path: path.join(process.cwd(), ".env.local") });
loadEnv({ path: path.join(process.cwd(), "..", ".env.local") });
loadEnv({ path: path.join(process.cwd(), "..", ".env") });

export const PROJECT_ID = requireSanityProjectId();
export const DATASET = assertMigrationDatasetAllowed();
export const API_VERSION = "2024-01-01";

const TOKEN = process.env.SANITY_TOKEN?.trim();

if (!TOKEN) {
  console.error(
    "Missing SANITY_TOKEN. Copy test/.env.local.example to test/.env.local and set your token.",
  );
  process.exit(1);
}

export const sanityClient = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  useCdn: false,
  token: TOKEN,
});

export const API_URL = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`;
export const SANITY_TOKEN = TOKEN;
