/**
 * Shared Sanity configuration for migration scripts.
 *
 * Required environment variables:
 *   SANITY_TOKEN  – API token with write access (from sanity.io/manage)
 *
 * Optional overrides:
 *   SANITY_PROJECT_ID  – defaults to "9jhqpk3a"
 *   SANITY_DATASET     – defaults to "production"
 *
 * Loads `test/.env.local` automatically when present.
 */
import { config as loadEnv } from "dotenv";
import path from "path";
import { createClient } from "@sanity/client";

// When run via `npm run …` in test/, cwd is test/
loadEnv({ path: path.join(process.cwd(), ".env.local") });

export const PROJECT_ID = process.env.SANITY_PROJECT_ID || "9jhqpk3a";
export const DATASET = process.env.SANITY_DATASET || "production";
export const API_VERSION = "2024-01-01";
const TOKEN = "REMOVED_SANITY_TOKEN";

export const sanityClient = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  useCdn: false,
  token: TOKEN,
});

export const API_URL = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`;
export const SANITY_TOKEN = TOKEN;
