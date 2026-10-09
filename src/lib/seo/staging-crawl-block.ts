import type { Metadata } from "next";

// Noindex / crawl blocking is for staging and preview only — production deploys are unchanged.
/** Only these hosts serve indexable production HTML and robots.txt. */
export const PRODUCTION_SITE_HOSTS = new Set(["cmedical.no", "www.cmedical.no"]);

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

export const PRODUCTION_ROBOTS_METADATA: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export function normalizeRequestHost(raw: string | null | undefined): string | null {
  if (!raw?.trim()) return null;
  const host = raw.split(",")[0]?.trim().toLowerCase().replace(/:\d+$/, "");
  return host || null;
}

/** Read the public hostname from request or RSC headers (Vercel: prefer x-forwarded-host). */
export function getHostFromHeaderBag(headerBag: Headers): string | null {
  return normalizeRequestHost(
    headerBag.get("x-forwarded-host") ?? headerBag.get("host"),
  );
}

export function isProductionSiteHost(host: string | null | undefined): boolean {
  const normalized =
    typeof host === "string" ? normalizeRequestHost(host) : host;
  if (!normalized) return false;
  return PRODUCTION_SITE_HOSTS.has(normalized);
}

/** True on *.vercel.app, localhost, staging aliases, and any non-cmedical.no host. */
export function shouldBlockSearchEngineIndexingForHost(
  host: string | null | undefined,
): boolean {
  return !isProductionSiteHost(host);
}

/** Client-side mirror of host gating (PageSEO / useClientDocumentHead). */
export function shouldBlockSearchEngineIndexingOnClient(): boolean {
  if (typeof window === "undefined") return false;
  return shouldBlockSearchEngineIndexingForHost(window.location.hostname);
}

/** Apply staging-only HTTP header. No-op on production host. */
export function applyStagingCrawlBlockHeaders(
  headerBag: Headers,
  host: string | null | undefined,
): void {
  if (!shouldBlockSearchEngineIndexingForHost(host)) return;
  headerBag.set("X-Robots-Tag", STAGING_X_ROBOTS_TAG);
}
