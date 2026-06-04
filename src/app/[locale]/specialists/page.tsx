import type { Metadata } from "next";
import Specialists from "@/site-pages/Specialists";
import { buildSpecialistsListingMetadata } from "@/lib/seo/route-metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildSpecialistsListingMetadata(locale);
}

export default function Page() {
  return <Specialists isChatOpen={false} />;
}
