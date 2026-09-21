import type { Metadata } from "next";
import { headers } from "next/headers";
import { siteUrl } from "@/lib/env";
import {
  PRODUCTION_ROBOTS_METADATA,
  STAGING_ROBOTS_METADATA,
} from "@/lib/seo/staging-crawl-block";
import { shouldBlockSearchEngineIndexing } from "@/lib/seo/staging-crawl-block.server";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT } from "@/lib/seo/defaults";
import {
  GoogleConsentDefault,
  GoogleCookiebotHead,
  GoogleTagManagerHead,
  GoogleTagManagerNoscript,
} from "@/components/analytics/GoogleTagManager";
import { fetchGoogleAnalyticsSettings } from "@/lib/sanity/google-analytics.server";
import "./globals.css";

const rootLayoutMetadataBase: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "CMedical - Skandinavias ledende helhetskonsept",
    template: "%s | CMedical",
  },
  description:
    "Nordens mest komplette private tilbud innen gynekologi, fertilitet og urologi. Ledende spesialister, kort ventetid, ingen henvisning nødvendig.",
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

/** Host-aware robots default — preview/staging hosts must never leak index,follow. */
export async function generateMetadata(): Promise<Metadata> {
  const block = await shouldBlockSearchEngineIndexing();
  return {
    ...rootLayoutMetadataBase,
    robots: block ? STAGING_ROBOTS_METADATA : PRODUCTION_ROBOTS_METADATA,
  };
}

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
