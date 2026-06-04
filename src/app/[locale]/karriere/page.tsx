import type { Metadata } from "next";
import Karriere from "@/site-pages/Karriere";
import { buildKarriereListingMetadata } from "@/lib/seo/route-metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildKarriereListingMetadata(locale);
}

export default function Page() {
  return <Karriere isChatOpen={false} />;
}
