import type { Metadata } from "next";
import Insurance from "@/site-pages/Insurance";
import { buildInsuranceMetadata } from "@/lib/seo/route-metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildInsuranceMetadata(locale);
}

export default function Page() {
  return <Insurance isChatOpen={false} />;
}
