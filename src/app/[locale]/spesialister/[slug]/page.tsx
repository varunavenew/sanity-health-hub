import type { Metadata } from "next";
import SpecialistProfile from "@/site-pages/SpecialistProfile";
import { buildSpecialistMetadata } from "@/lib/seo/dynamic-route-metadata";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  return buildSpecialistMetadata(locale, slug);
}

export default function Page() {
  return <SpecialistProfile isChatOpen={false} />;
}
