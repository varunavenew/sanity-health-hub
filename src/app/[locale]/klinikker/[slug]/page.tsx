import type { Metadata } from "next";
import ClinicDetailPage from "@/site-pages/ClinicDetailPage";
import { buildClinicMetadata } from "@/lib/seo/dynamic-route-metadata";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  return buildClinicMetadata(locale, slug);
}

export default function Page() {
  return <ClinicDetailPage isChatOpen={false} />;
}
