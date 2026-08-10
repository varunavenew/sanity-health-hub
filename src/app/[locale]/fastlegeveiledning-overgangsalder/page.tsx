import type { Metadata } from "next";
import FastlegeveiledningOvergangsalder from "@/site-pages/FastlegeveiledningOvergangsalder";
import { buildClinicianGuidePageMetadata } from "@/lib/seo/dynamic-route-metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildClinicianGuidePageMetadata(locale, "fastlegeveiledning-overgangsalder");
}

export default function Page() {
  return <FastlegeveiledningOvergangsalder isChatOpen={false} />;
}
