import { DEFAULT_CONSENT_HEAD_SCRIPT } from "@/lib/analytics/defaults";

/**
 * Consent Mode v2 must stay denied-by-default per SEO brief (GDPR / Norway).
 * Sanity may override consentHeadScript — reject unsafe CMS scripts that grant all storage by default.
 */
export function resolveConsentHeadScript(cmsScript?: string | null): string {
  const trimmed = cmsScript?.trim();
  if (!trimmed) return DEFAULT_CONSENT_HEAD_SCRIPT;
  if (!isSafeConsentHeadScript(trimmed)) return DEFAULT_CONSENT_HEAD_SCRIPT;
  return trimmed;
}

function isSafeConsentHeadScript(script: string): boolean {
  const normalized = script.replace(/\s+/g, " ").toLowerCase();

  if (!normalized.includes("gtag('consent', 'default'")) return false;

  // Reject scripts that grant marketing/analytics storage by default.
  if (/ad_storage['"]\s*:\s*['"]granted['"]/.test(normalized)) return false;
  if (/analytics_storage['"]\s*:\s*['"]granted['"]/.test(normalized)) return false;
  if (/ad_user_data['"]\s*:\s*['"]granted['"]/.test(normalized)) return false;
  if (/ad_personalization['"]\s*:\s*['"]granted['"]/.test(normalized)) return false;

  if (!/ad_storage['"]\s*:\s*['"]denied['"]/.test(normalized)) return false;
  if (!/analytics_storage['"]\s*:\s*['"]denied['"]/.test(normalized)) return false;

  return true;
}
