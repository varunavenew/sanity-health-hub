import type { Metadata } from "next";
import Guide from "@/site-pages/Guide";
import { buildGuideMetadata } from "@/lib/seo/route-metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildGuideMetadata(locale);
}

export default function Page() {
  return <Guide isChatOpen={false} />;
}
