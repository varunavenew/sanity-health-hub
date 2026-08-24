/** Fallback when Sanity consentHeadScript is empty or invalid — denied-by-default per SEO brief. */
export const DEFAULT_CONSENT_HEAD_SCRIPT = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'analytics_storage': 'denied',
  'functionality_storage': 'denied',
  'personalization_storage': 'denied',
  'security_storage': 'granted',
  'wait_for_update': 500
});
gtag('set', 'ads_data_redaction', true);
gtag('set', 'url_passthrough', true);`;

/**
 * Consent Mode defaults are owned by Sanity (`googleAnalyticsSettings.consentHeadScript`).
 * The SEO team controls granted/denied defaults and Cookiebot update flow without deploys.
 * Code defaults apply only when the CMS field is empty or structurally invalid.
 */

/** Use CMS consent script when present; fall back to denied-by-default only if missing/invalid. */
export function resolveConsentHeadScript(cmsScript?: string | null): string {
  const trimmed = cmsScript?.trim();
  if (!trimmed) return DEFAULT_CONSENT_HEAD_SCRIPT;
  if (!looksLikeConsentHeadScript(trimmed)) return DEFAULT_CONSENT_HEAD_SCRIPT;
  return trimmed;
}

/** CMS script must initialize dataLayer and set Consent Mode defaults (granted or denied). */
export function looksLikeConsentHeadScript(script: string): boolean {
  const normalized = script.replace(/\s+/g, " ").toLowerCase();
  if (!normalized.includes("datalayer")) return false;
  return (
    normalized.includes("gtag('consent', 'default'") ||
    normalized.includes('gtag("consent", "default"') ||
    normalized.includes("gtag( 'consent', 'default'")
  );
}

/**
 * GTM bootstrap must not duplicate consent defaults — those belong in consentHeadScript only.
 * Strips embedded consent blocks if editors pasted a full GTM+consent bundle into gtmHeadScript.
 */
export function stripDuplicateConsentFromGtmScript(gtmScript: string): string {
  let result = gtmScript.trim();
  if (!result) return result;

  result = removeGtagConsentDefaultBlocks(result);
  result = removeStandaloneDataLayerInit(result);
  result = removeStandaloneGtagHelper(result);
  result = removeGtagSetCalls(result, "ads_data_redaction");
  result = removeGtagSetCalls(result, "url_passthrough");

  return result.replace(/\n{3,}/g, "\n\n").trim();
}

function removeGtagConsentDefaultBlocks(script: string): string {
  const marker = /gtag\s*\(\s*['"]consent['"]\s*,\s*['"]default['"]\s*,/gi;
  let result = script;
  let match: RegExpExecArray | null;

  while ((match = marker.exec(result)) !== null) {
    const start = match.index;
    const afterMarker = match.index + match[0].length;
    const end = findCallEnd(result, afterMarker);
    if (end == null) break;
    result = result.slice(0, start) + result.slice(end);
    marker.lastIndex = 0;
  }

  return result;
}

/** Find closing `);` for gtag(..., { ... }); starting after the opening `{` of the config object. */
function findCallEnd(script: string, searchFrom: number): number | null {
  let i = searchFrom;
  while (i < script.length && script[i] !== "{") i++;
  if (i >= script.length) return null;

  let depth = 0;
  for (; i < script.length; i++) {
    const ch = script[i];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        i++;
        while (i < script.length && /\s/.test(script[i])) i++;
        if (script[i] === ")") i++;
        while (i < script.length && /[\s;]/.test(script[i])) i++;
        return i;
      }
    }
  }
  return null;
}

function removeStandaloneDataLayerInit(script: string): string {
  return script
    .replace(/window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\s*\]\s*;?\s*/gi, "")
    .trim();
}

function removeStandaloneGtagHelper(script: string): string {
  return script
    .replace(
      /function\s+gtag\s*\(\s*\)\s*\{\s*dataLayer\.push\s*\(\s*arguments\s*\)\s*;\s*\}\s*;?\s*/gi,
      "",
    )
    .trim();
}

function removeGtagSetCalls(script: string, key: string): string {
  const pattern = new RegExp(
    `gtag\\s*\\(\\s*['"]set['"]\\s*,\\s*['"]${key}['"][\\s\\S]*?\\)\\s*;?`,
    "gi",
  );
  return script.replace(pattern, "").trim();
}
