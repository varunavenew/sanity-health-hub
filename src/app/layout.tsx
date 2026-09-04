import type { Metadata } from "next";
import { headers } from "next/headers";
import { isProductionDeploy, siteUrl } from "@/lib/env";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT } from "@/lib/seo/defaults";
import {
  GoogleConsentDefault,
  GoogleCookiebotHead,
  GoogleTagManagerHead,
  GoogleTagManagerNoscript,
} from "@/components/analytics/GoogleTagManager";
import { fetchGoogleAnalyticsSettings } from "@/lib/sanity/google-analytics.server";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "CMedical - Skandinavias ledende helhetskonsept",
    template: "%s | CMedical",
  },
  description:
    "Nordens mest komplette private tilbud innen gynekologi, fertilitet og urologi. Ledende spesialister, kort ventetid, ingen henvisning nødvendig.",
  // Default for any route without its own `generateMetadata` — must not
  // leak `index, follow` on staging/preview deploys just because a page
  // doesn't set an explicit robots directive.
  robots: isProductionDeploy()
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    siteName: "CMedical",
    type: "website",
    locale: "nb_NO",
    alternateLocale: ["en_US"],
    images: [{ url: DEFAULT_OG_IMAGE, alt: DEFAULT_OG_IMAGE_ALT }],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_OG_IMAGE],
  },
  // Favicons: square CM mark assets in /public (not the landscape OG image).
  // SVG first for crisp HiDPI tabs; PNG/ICO fallbacks for older browsers.
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const htmlLang = h.get("x-cmedical-html-lang") ?? "nb-NO";
  const analyticsLang = htmlLang.toLowerCase().startsWith("en") ? "en" : "no";
  const analyticsSettings = await fetchGoogleAnalyticsSettings(analyticsLang);

  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <head>
        <GoogleConsentDefault settings={analyticsSettings} />
        <GoogleCookiebotHead settings={analyticsSettings} />
        <GoogleTagManagerHead settings={analyticsSettings} />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <GoogleTagManagerNoscript settings={analyticsSettings} />
        {children}
      </body>
    </html>
  );
}
