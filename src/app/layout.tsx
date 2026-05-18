import type { Metadata } from "next";
import { headers } from "next/headers";
import { siteUrl } from "@/lib/env";
import { DEFAULT_OG_IMAGE } from "@/lib/seo/defaults";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "CMedical - Skandinavias ledende helhetskonsept",
    template: "%s | CMedical",
  },
  description:
    "Nordens mest komplette private tilbud innen gynekologi, fertilitet og urologi. Ledende spesialister, kort ventetid, ingen henvisning nødvendig.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    siteName: "CMedical",
    type: "website",
    locale: "nb_NO",
    alternateLocale: ["en_US"],
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: "CMedical" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [DEFAULT_OG_IMAGE],
  },
  icons: {
    icon: DEFAULT_OG_IMAGE,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const htmlLang = h.get("x-cmedical-html-lang") ?? "nb-NO";

  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">{children}</body>
    </html>
  );
}
