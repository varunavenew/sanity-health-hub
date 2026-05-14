import type { Metadata } from "next";
import { headers } from "next/headers";
import { siteUrl } from "@/lib/env";
import "./globals.css";

export const metadata: Metadata = {
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
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon:
      "https://storage.googleapis.com/gpt-engineer-file-uploads/qmg4FOZcsPVySaA19fmuxrFmWZJ3/uploads/1762763982098-cmedical.png",
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
