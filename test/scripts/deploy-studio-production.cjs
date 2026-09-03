/**
 * Deploy hosted Studio (cmedical-v2) against the production dataset.
 *
 * Root cause of "Studio edits don't show on live":
 * `sanity deploy` loads `.env.local` with override:true, so a local
 * SANITY_STUDIO_DATASET=developer was baked into the hosted Studio bundle.
 * Editors wrote to developer while Vercel production reads `production`.
 *
 * Vite only inlines SANITY_STUDIO_* into the browser bundle. The Studio build
 * subprocess does not reliably re-inject root `.env.local`, so this script
 * copies project id + production dataset onto SANITY_STUDIO_* before deploy.
 *
 * Usage:
 *   cd test && npm run deploy:production
 */
const { spawnSync } = require("child_process");
const path = require("path");
const { config: loadEnv } = require("dotenv");

const testDir = path.resolve(__dirname, "..");
const rootDir = path.resolve(testDir, "..");

loadEnv({ path: path.join(testDir, ".env.local") });
loadEnv({ path: path.join(rootDir, ".env.local") });

const projectId = (
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.SANITY_STUDIO_API_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  ""
).trim();

if (!projectId) {
  console.error(
    "Missing SANITY_STUDIO_PROJECT_ID / SANITY_PROJECT_ID. Set it in .env.local before deploying.",
  );
  process.exit(1);
}

const env = {
  ...process.env,
  SANITY_STUDIO_PROJECT_ID: projectId,
  SANITY_STUDIO_API_PROJECT_ID: projectId,
  SANITY_PROJECT_ID: projectId,
  NEXT_PUBLIC_SANITY_PROJECT_ID: projectId,
  SANITY_STUDIO_FORCE_DATASET: "production",
  SANITY_DATASET_FORCE: "production",
  SANITY_DATASET: "production",
  SANITY_STUDIO_DATASET: "production",
  NEXT_PUBLIC_SANITY_DATASET: "production",
  ALLOW_PRODUCTION_MIGRATION: "true",
};

console.log("");
console.log("Deploying Sanity Studio → production dataset");
console.log(`  SANITY_STUDIO_PROJECT_ID=${projectId}`);
console.log("  SANITY_STUDIO_FORCE_DATASET=production");
console.log("  studioHost=cmedical-v2");
console.log("");

const result = spawnSync("npx", ["sanity", "deploy", "-y", "--schema-required"], {
  cwd: testDir,
  env,
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 1);
