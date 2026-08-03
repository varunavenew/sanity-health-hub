/**
 * Deploy hosted Studio (cmedical-v2) against the production dataset.
 *
 * Root cause of "Studio edits don't show on live":
 * `sanity deploy` loads `.env.local` with override:true, so a local
 * SANITY_STUDIO_DATASET=developer was baked into the hosted Studio bundle.
 * Editors wrote to developer while Vercel production reads `production`.
 *
 * This script sets SANITY_STUDIO_FORCE_DATASET=production (checked first in
 * dataset-env) so the deploy always targets production regardless of .env.local.
 *
 * Usage:
 *   cd test && npm run deploy:production
 */
const { spawnSync } = require("child_process");
const path = require("path");

const testDir = path.resolve(__dirname, "..");

const env = {
  ...process.env,
  SANITY_STUDIO_FORCE_DATASET: "production",
  SANITY_DATASET_FORCE: "production",
  SANITY_DATASET: "production",
  SANITY_STUDIO_DATASET: "production",
  NEXT_PUBLIC_SANITY_DATASET: "production",
  ALLOW_PRODUCTION_MIGRATION: "true",
};

console.log("");
console.log("Deploying Sanity Studio → production dataset");
console.log("  SANITY_STUDIO_FORCE_DATASET=production");
console.log("  studioHost=cmedical-v2");
console.log("");

const result = spawnSync("npx", ["sanity", "deploy"], {
  cwd: testDir,
  env,
  stdio: "inherit",
  shell: true,
});

process.exit(result.status ?? 1);
