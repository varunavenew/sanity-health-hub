import { headers } from "next/headers";
import { siteUrl } from "@/lib/env";
import {
  getHostFromHeaderBag,
  shouldBlockSearchEngineIndexingForHost,
} from "@/lib/seo/staging-crawl-block";

/** Server components / route handlers — uses the incoming request host at runtime. */
export async function shouldBlockSearchEngineIndexing(): Promise<boolean> {
  const h = await headers();
  return shouldBlockSearchEngineIndexingForHost(getHostFromHeaderBag(h));
}

/**
 * Canonical/alternate URLs must never use a staging host — always point at the
 * public production domain when building metadata on preview/staging.
 */
export async function canonicalSiteOrigin(): Promise<string> {
  if (await shouldBlockSearchEngineIndexing()) {
    return "https://cmedical.no";
  }
  return siteUrl();
}
