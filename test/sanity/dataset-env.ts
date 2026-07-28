/**
 * Fail-fast Sanity dataset resolution for Studio, CLI, and migration scripts.
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
  "Set SANITY_STUDIO_DATASET and SANITY_DATASET in test/.env.local (local Studio / migrations)",
  "or in Vercel Environment Variables (production).",
].join("\n");

export function requireSanityDataset(): SanityDatasetName {
  // SANITY_STUDIO_* is required for the Studio browser bundle (Vite only exposes that prefix).
  const dataset =
    process.env.SANITY_STUDIO_DATASET?.trim() ||
    process.env.SANITY_STUDIO_API_DATASET?.trim() ||
    process.env.SANITY_DATASET?.trim() ||
    process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();
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
    process.env.NODE_ENV !== "production" && !process.env.VERCEL;

  if (
    isLocalDev &&
    dataset === "production" &&
    process.env.ALLOW_PRODUCTION_MIGRATION !== "true"
  ) {
    throw new Error(
      [
        "Refusing to use the production dataset during local development.",
        "",
        "Set in test/.env.local (and root .env.local):",
        "  SANITY_DATASET=developer",
        "  SANITY_STUDIO_DATASET=developer",
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
        `Currently configured: "${dataset}"`,
      ].join("\n"),
    );
  }

  return dataset;
}

export function requireSanityProjectId(): string {
  // SANITY_STUDIO_* is required for the Studio browser bundle (Vite only exposes that prefix).
  const projectId =
    process.env.SANITY_STUDIO_PROJECT_ID?.trim() ||
    process.env.SANITY_STUDIO_API_PROJECT_ID?.trim() ||
    process.env.SANITY_PROJECT_ID?.trim() ||
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
  if (!projectId) {
    throw new Error(
      [
        "SANITY_PROJECT_ID is not configured.",
        "",
        "Set SANITY_STUDIO_PROJECT_ID (Studio) and SANITY_PROJECT_ID",
        "in test/.env.local or environment.",
      ].join("\n"),
    );
  }
  return projectId;
}

export function assertMigrationDatasetAllowed(): SanityDatasetName {
  const dataset = requireSanityDataset();
  console.log(
    [
      "",
      "Sanity Migration Guard",
      `Project ID: ${requireSanityProjectId()}`,
      `Dataset: ${dataset}`,
      "",
    ].join("\n"),
  );

  if (dataset === "production") {
    if (process.env.ALLOW_PRODUCTION_MIGRATION === "true") {
      console.warn(
        "ALLOW_PRODUCTION_MIGRATION=true — proceeding against production.",
      );
      return dataset;
    }
    throw new Error(
      [
        "Refusing to run migration against production.",
        "",
        "Use:",
        "  ALLOW_PRODUCTION_MIGRATION=true",
        "if this is intentional.",
        "",
        "For local work, set SANITY_DATASET=developer in test/.env.local.",
      ].join("\n"),
    );
  }

  return dataset;
}

export function datasetBadgeLabel(dataset: SanityDatasetName): string {
  return dataset === "developer"
    ? "🟢 Developer Dataset"
    : "🔴 Production Dataset";
}
