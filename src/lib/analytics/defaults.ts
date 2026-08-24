import {
  DEFAULT_CONSENT_HEAD_SCRIPT,
  resolveConsentHeadScript,
  stripDuplicateConsentFromGtmScript,
} from "@/lib/analytics/consent-script";

export { DEFAULT_CONSENT_HEAD_SCRIPT } from "@/lib/analytics/consent-script";

export const DEFAULT_GTM_CONTAINER_ID = "GTM-PNNR898W";
export function buildGtmHeadScript(containerId: string): string {
  const id = containerId.trim() || DEFAULT_GTM_CONTAINER_ID;
  return `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${id}');`;
}

export function buildGtmBodyNoscriptHtml(containerId: string): string {
  const id = containerId.trim() || DEFAULT_GTM_CONTAINER_ID;
  return `<iframe src="https://www.googletagmanager.com/ns.html?id=${id}"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
}

export type GoogleAnalyticsSettingsResolved = {
  enabled: boolean;
  gtmContainerId: string;
  consentHeadScript: string;
  gtmHeadScript: string;
  gtmBodyNoscriptHtml: string;
  cookiebotHeadScript?: string;
};

/** `internationalizedArrayString` / `internationalizedArrayText` field shape. */
export type LocalizedI18nValue = {
  _key?: string;
  language?: string;
  value?: string | null;
};

export type GoogleAnalyticsSettingsRaw = {
  enabled?: boolean | null;
  gtmContainerId?: LocalizedI18nValue[] | null;
  consentHeadScript?: LocalizedI18nValue[] | null;
  gtmHeadScript?: LocalizedI18nValue[] | null;
  gtmBodyNoscript?: LocalizedI18nValue[] | null;
  cookiebotHeadScript?: LocalizedI18nValue[] | null;
};

export type AnalyticsLang = "no" | "en";

/** Pick the value for `lang` out of an internationalized-array field, falling back to any other language present. */
function pickLang(entries: LocalizedI18nValue[] | null | undefined, lang: AnalyticsLang): string {
  if (!Array.isArray(entries)) return "";
  const exact = entries.find((entry) => (entry?.language || entry?._key) === lang)?.value;
  if (exact?.trim()) return exact.trim();
  const fallback = entries.find((entry) => entry?.value?.trim())?.value;
  return fallback?.trim() ?? "";
}

/** Merge CMS values with code defaults (empty CMS fields fall back to generated snippets). */
export function resolveGoogleAnalyticsSettings(
  raw?: GoogleAnalyticsSettingsRaw | null,
  lang: AnalyticsLang = "no",
): GoogleAnalyticsSettingsResolved {
  const gtmContainerId = pickLang(raw?.gtmContainerId, lang) || DEFAULT_GTM_CONTAINER_ID;
  const consentHeadScript = resolveConsentHeadScript(pickLang(raw?.consentHeadScript, lang));
  const rawGtmHead = pickLang(raw?.gtmHeadScript, lang);
  const gtmHeadScript = rawGtmHead
    ? stripDuplicateConsentFromGtmScript(rawGtmHead) || buildGtmHeadScript(gtmContainerId)
    : buildGtmHeadScript(gtmContainerId);
  const gtmBodyNoscriptHtml =
    pickLang(raw?.gtmBodyNoscript, lang) || buildGtmBodyNoscriptHtml(gtmContainerId);
  const cookiebotHeadScript = pickLang(raw?.cookiebotHeadScript, lang) || undefined;

  return {
    enabled: raw?.enabled !== false,
    gtmContainerId,
    consentHeadScript,
    gtmHeadScript,
    gtmBodyNoscriptHtml,
    cookiebotHeadScript,
  };
}
