/**
 * Fail-fast Sanity dataset / project resolution for the Next.js app.
 * Local development requires explicit env. On Vercel, missing values fall
 * back to this workspace's public project id and the production dataset so
 * `next.config` can load when dashboard env vars were never added.
 */

export type SanityDatasetName = "developer" | "production";

/** Public Sanity project id for this CMedical workspace (not a secret). */
export const CMEDICAL_SANITY_PROJECT_ID = "9jhqpk3a";

const MISSING_DATASET_ERROR = [
  "SANITY_DATASET is not configured.",
  "",
  "Expected:",
  "  developer (local)",
  "  production (Vercel)",
  "",
  "Set SANITY_DATASET and NEXT_PUBLIC_SANITY_DATASET in .env.local (local)",
  "or in Vercel Environment Variables (production).",
].join("\n");

function onVercel(): boolean {
  return Boolean(process.env.VERCEL);
}

function readRawDataset(): string | undefined {
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() ||
    process.env.SANITY_DATASET?.trim() ||
    process.env.SANITY_STUDIO_DATASET?.trim() ||
    process.env.SANITY_STUDIO_API_DATASET?.trim();
  if (dataset) return dataset;
  // Vercel production/preview must hit the live CMS when dashboard env is unset.
  if (onVercel()) return "production";
  return undefined;
}

/** Staging Vercel deploys may intentionally use the developer Sanity dataset. */
function allowDeveloperDatasetOnVercelProduction(): boolean {
  if (process.env.SANITY_ALLOW_DEVELOPER_ON_VERCEL?.trim() === "true") {
    return true;
  }
  const branch = process.env.VERCEL_GIT_COMMIT_REF?.trim().toLowerCase();
  return branch === "staging";
}

function readRawProjectId(): string | undefined {
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ||
    process.env.SANITY_PROJECT_ID?.trim() ||
    process.env.SANITY_STUDIO_PROJECT_ID?.trim() ||
    process.env.SANITY_STUDIO_API_PROJECT_ID?.trim();
  if (projectId) return projectId;
  if (onVercel()) return CMEDICAL_SANITY_PROJECT_ID;
  return undefined;
}

export function requireSanityDataset(): SanityDatasetName {
  const dataset = readRawDataset();
  if (!dataset) {
    throw new Error(MISSING_DATASET_ERROR);
  }
  if (dataset !== "developer" && dataset !== "production") {
    throw new Error(
      `Invalid SANITY_DATASET "${dataset}". Expected "developer" or "production".`,
    );
  }

  const onVercelProduction = process.env.VERCEL_ENV === "production";
  const isLocalDev =
    process.env.NODE_ENV === "development" && !process.env.VERCEL;

  if (
    isLocalDev &&
    dataset === "production" &&
    process.env.ALLOW_PRODUCTION_MIGRATION !== "true"
  ) {
    throw new Error(
      [
        "Refusing to use the production dataset during local development.",
        "",
        "Set in .env.local:",
        "  SANITY_DATASET=developer",
        "  NEXT_PUBLIC_SANITY_DATASET=developer",
        "",
        "For intentional production migrations only:",
        "  ALLOW_PRODUCTION_MIGRATION=true",
      ].join("\n"),
    );
  }

  if (
    onVercelProduction &&
    dataset !== "production" &&
    !allowDeveloperDatasetOnVercelProduction()
  ) {
    throw new Error(
      [
        "Vercel production must use the production dataset.",
        "",
        `Currently configured: "${dataset}"`,
        "Set SANITY_DATASET=production and NEXT_PUBLIC_SANITY_DATASET=production in Vercel.",
        "",
        "For a staging site on the developer dataset:",
        "  deploy the staging branch, or set SANITY_ALLOW_DEVELOPER_ON_VERCEL=true.",
      ].join("\n"),
    );
  }

  return dataset;
}

export function requireSanityProjectId(): string {
  const projectId = readRawProjectId();
  if (!projectId) {
    throw new Error(
      [
        "SANITY_PROJECT_ID is not configured.",
        "",
        "Set SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local or Vercel.",
      ].join("\n"),
    );
  }
  return projectId;
}

export function getSanityEnvironmentLabel(): "Development" | "Production" | "Preview" {
  if (process.env.VERCEL_ENV === "production") return "Production";
  if (process.env.VERCEL_ENV === "preview") return "Preview";
  if (process.env.NODE_ENV === "production") return "Production";
  return "Development";
}

export function logSanityConfiguration(source = "Next.js"): void {
  // Avoid noisy bootstrap logs in production runtimes; keep for local/preview.
  if (process.env.NODE_ENV === "production" && process.env.VERCEL_ENV === "production") {
    return;
  }
  const projectId = requireSanityProjectId();
  const dataset = requireSanityDataset();
  const environment = getSanityEnvironmentLabel();
  console.log(
    [
      "",
      "Sanity Configuration",
      `Source: ${source}`,
      `Project ID: ${projectId}`,
      `Dataset: ${dataset}`,
      `Environment: ${environment}`,
      "",
    ].join("\n"),
  );
}
