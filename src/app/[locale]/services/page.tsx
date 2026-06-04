import type { Metadata } from "next";
import Services from "@/site-pages/Services";
import { buildServicesMetadata } from "@/lib/seo/route-metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildServicesMetadata(locale);
}

export default function Page() {
  return <Services isChatOpen={false} />;
}
