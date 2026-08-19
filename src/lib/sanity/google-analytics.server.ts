import "server-only";

import {
  resolveGoogleAnalyticsSettings,
  type AnalyticsLang,
  type GoogleAnalyticsSettingsResolved,
} from "@/lib/analytics/defaults";
import { fetchSanityGroqServer } from "@/lib/sanity/fetch-groq-server";

const publishedOnly = `!(_id in path("drafts.**"))`;

export const GOOGLE_ANALYTICS_SETTINGS_QUERY = `*[_type == "googleAnalyticsSettings" && ${publishedOnly}][0]{
  enabled,
  gtmContainerId,
  consentHeadScript,
  gtmHeadScript,
  gtmBodyNoscript,
  cookiebotHeadScript
}`;

export async function fetchGoogleAnalyticsSettings(
  lang: AnalyticsLang = "no",
): Promise<GoogleAnalyticsSettingsResolved> {
  const raw = await fetchSanityGroqServer<Record<string, unknown> | null>(
    GOOGLE_ANALYTICS_SETTINGS_QUERY,
  );
  return resolveGoogleAnalyticsSettings(raw, lang);
}
