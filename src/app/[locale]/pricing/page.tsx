import type { Metadata } from "next";
import Priser from "@/site-pages/Priser";
import { buildPricingMetadata } from "@/lib/seo/route-metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPricingMetadata(locale);
}

export default function Page() {
  return <Priser isChatOpen={false} />;
}
