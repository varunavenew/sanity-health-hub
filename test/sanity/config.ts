/**
 * Shared Sanity configuration for migration scripts.
 *
 * Required environment variables:
 *   SANITY_TOKEN  – API token with write access (from sanity.io/manage)
 *
 * Optional overrides:
 *   SANITY_PROJECT_ID  – defaults to "sh2sj585"
 *   SANITY_DATASET     – defaults to "development"
 */
import { createClient } from "@sanity/client";

if (!process.env.SANITY_TOKEN) {
  console.error("❌ Missing environment variable: SANITY_TOKEN");
  console.error("   Set it in your deployment environment or .env file.");
  process.exit(1);
}

export const PROJECT_ID = process.env.SANITY_PROJECT_ID || "8auguusb";
export const DATASET = process.env.SANITY_DATASET || "production";
export const API_VERSION = "2024-01-01";
const TOKEN = process.env.SANITY_TOKEN!;

export const sanityClient = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  useCdn: false,
  token: TOKEN,
});

export const API_URL = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`;
export const SANITY_TOKEN = TOKEN;
