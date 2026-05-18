import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_SANITY_DATASET: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
});

export type PublicEnv = z.infer<typeof envSchema>;

export function getPublicEnv(): PublicEnv {
  return envSchema.parse({
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
}

export function siteUrl(): string {
  const v = process.env.NEXT_PUBLIC_SITE_URL;
  if (v) return v.replace(/\/$/, "");
  return "https://cmedical.no";
}

/** True when deployed to the public production site (not preview/staging). */
export function isProductionDeploy(): boolean {
  if (process.env.VERCEL_ENV === "production") return true;
  const url = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return url === "https://cmedical.no";
}

/**
 * Password gate for demos. Off by default on production; set
 * `NEXT_PUBLIC_ENABLE_ACCESS_GATE=true` to enable on staging.
 */
export function isAccessGateEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_ENABLE_ACCESS_GATE === "true") return true;
  if (process.env.NEXT_PUBLIC_ENABLE_ACCESS_GATE === "false") return false;
  return !isProductionDeploy();
}

