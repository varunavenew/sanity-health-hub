import type { Metadata } from "next";
import { isProductionDeploy, siteUrl } from "@/lib/env";

// Noindex / crawl blocking is for staging and preview only — production deploys are unchanged.

/**
 * Staging / preview / non-production deploys must never be indexed.
 * Production (VERCEL_ENV=production + cmedical.no) is the only indexable surface.
 *
 * Do NOT enable these rules on production — they are gated by `isProductionDeploy()`.
 */
export const STAGING_X_ROBOTS_TAG = "noindex, nofollow, noarchive";

/** Next.js Metadata `robots` → `<meta name="robots" content="noindex, nofollow, noarchive">` */
export const STAGING_ROBOTS_METADATA: Metadata["robots"] = {
  index: false,
  follow: false,
  noarchive: true,
  googleBot: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

export function shouldBlockSearchEngineIndexing(): boolean {
  return !isProductionDeploy();
}

/** Apply staging-only HTTP header (HTML, PDFs, XML, plain text). No-op on production. */
export function applyStagingCrawlBlockHeaders(
  headers: Headers,
): void {
  if (!shouldBlockSearchEngineIndexing()) return;
  headers.set("X-Robots-Tag", STAGING_X_ROBOTS_TAG);
}

/**
 * Canonical/alternate URLs must never use a staging host — always point at the
 * public production domain when building metadata on preview/staging.
 */
export function canonicalSiteOrigin(): string {
  if (isProductionDeploy()) return siteUrl();
  return "https://cmedical.no";
}
