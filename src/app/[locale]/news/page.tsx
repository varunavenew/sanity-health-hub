import type { Metadata } from "next";
import Aktuelt from "@/site-pages/Aktuelt";
import { buildNewsMetadata } from "@/lib/seo/route-metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildNewsMetadata(locale);
}

export default function Page() {
  return <Aktuelt isChatOpen={false} />;
}
