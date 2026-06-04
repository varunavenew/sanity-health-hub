import type { Metadata } from "next";
import KarriereDetail from "@/site-pages/KarriereDetail";
import { buildJobListingMetadata } from "@/lib/seo/dynamic-route-metadata";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  return buildJobListingMetadata(locale, slug);
}

export default function Page() {
  return <KarriereDetail isChatOpen={false} />;
}
