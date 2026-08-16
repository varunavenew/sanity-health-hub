import Script from "next/script";

/** GTM container — override via NEXT_PUBLIC_GTM_ID if needed. */
export const GTM_CONTAINER_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim() || "GTM-PNNR898W";

/** 1. Consent defaults — must load before GTM (Cookiebot updates these after user choice). */
export function GoogleConsentDefault() {
  return (
    <Script id="google-consent-default" strategy="beforeInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
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
        gtag('set', 'url_passthrough', true);
      `}
    </Script>
  );
}

/** 2. Google Tag Manager — load as high in `<head>` as possible, after consent. */
export function GoogleTagManagerHead() {
  return (
    <>
      {/* Google Tag Manager */}
      <Script id="google-tag-manager" strategy="beforeInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');`}
      </Script>
      {/* End Google Tag Manager */}
    </>
  );
}

/** 3. GTM noscript fallback — place immediately after opening `<body>`. */
export function GoogleTagManagerNoscript() {
  return (
    <>
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
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
