import Script from "next/script";
import type { GoogleAnalyticsSettingsResolved } from "@/lib/analytics/defaults";
import { resolveGoogleAnalyticsSettings } from "@/lib/analytics/defaults";

type Props = {
  settings?: GoogleAnalyticsSettingsResolved | null;
};

function resolved(settings?: GoogleAnalyticsSettingsResolved | null) {
  return settings ?? resolveGoogleAnalyticsSettings(null);
}

/** 1. Consent defaults — must load before GTM (Cookiebot updates these after user choice). */
export function GoogleConsentDefault({ settings }: Props) {
  const cfg = resolved(settings);
  if (!cfg.enabled) return null;

  return (
    <Script id="google-consent-default" strategy="beforeInteractive">
      {cfg.consentHeadScript}
    </Script>
  );
}

/** Optional Cookiebot — after consent defaults, before GTM. */
export function GoogleCookiebotHead({ settings }: Props) {
  const cfg = resolved(settings);
  if (!cfg.enabled || !cfg.cookiebotHeadScript) return null;

  return (
    <Script id="cookiebot-head" strategy="beforeInteractive">
      {cfg.cookiebotHeadScript}
    </Script>
  );
}

/** 2. Google Tag Manager — load as high in `<head>` as possible, after consent. */
export function GoogleTagManagerHead({ settings }: Props) {
  const cfg = resolved(settings);
  if (!cfg.enabled) return null;

  return (
    <>
      {/* Google Tag Manager */}
      <Script id="google-tag-manager" strategy="beforeInteractive">
        {cfg.gtmHeadScript}
      </Script>
      {/* End Google Tag Manager */}
    </>
  );
}

/** 3. GTM noscript fallback — place immediately after opening `<body>`. */
export function GoogleTagManagerNoscript({ settings }: Props) {
  const cfg = resolved(settings);
  if (!cfg.enabled) return null;

  const srcMatch = cfg.gtmBodyNoscriptHtml.match(/src="([^"]+)"/i);
  const iframeSrc =
    srcMatch?.[1] ??
    `https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(cfg.gtmContainerId)}`;

  return (
    <>
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src={iframeSrc}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="Google Tag Manager"
        />
      </noscript>
      {/* End Google Tag Manager (noscript) */}
    </>
  );
}

/** All head/body tracking snippets in load order. */
export function GoogleAnalyticsSnippets({
  settings,
}: {
  settings?: GoogleAnalyticsSettingsResolved | null;
}) {
  return (
    <>
      <GoogleConsentDefault settings={settings} />
      <GoogleCookiebotHead settings={settings} />
      <GoogleTagManagerHead settings={settings} />
      <GoogleTagManagerNoscript settings={settings} />
    </>
  );
}

/** @deprecated Use CMS settings. Kept for env override reference. */
export const GTM_CONTAINER_ID =
  process.env.NEXT_PUBLIC_GTM_ID?.trim() || "GTM-PNNR898W";
