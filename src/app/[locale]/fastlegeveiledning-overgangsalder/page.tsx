import type { Metadata } from "next";
import FastlegeveiledningOvergangsalder from "@/site-pages/FastlegeveiledningOvergangsalder";
import { buildThemePageMetadata } from "@/lib/seo/dynamic-route-metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildThemePageMetadata(locale, "fastlegeveiledning-overgangsalder");
}

export default function Page() {
  return <FastlegeveiledningOvergangsalder isChatOpen={false} />;
}
