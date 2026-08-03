/**
 * Fail-fast Sanity dataset / project resolution for the Next.js app.
 * Never silently defaults to a dataset — env must be explicit.
 */

export type SanityDatasetName = "developer" | "production";

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

function readRawDataset(): string | undefined {
  const fromPublic = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();
  const fromPrivate = process.env.SANITY_DATASET?.trim();
  return fromPublic || fromPrivate || undefined;
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

  if (onVercelProduction && dataset !== "production") {
    throw new Error(
      [
        "Vercel production must use the production dataset.",
        "",
        `Currently configured: "${dataset}"`,
        "Set SANITY_DATASET=production and NEXT_PUBLIC_SANITY_DATASET=production in Vercel.",
      ].join("\n"),
    );
  }

  return dataset;
}

export function requireSanityProjectId(): string {
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ||
    process.env.SANITY_PROJECT_ID?.trim();
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
