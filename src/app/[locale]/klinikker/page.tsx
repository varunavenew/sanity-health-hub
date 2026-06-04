import type { Metadata } from "next";
import Clinics from "@/site-pages/Clinics";
import { buildClinicsListingMetadata } from "@/lib/seo/route-metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildClinicsListingMetadata(locale);
}

export default function Page() {
  return <Clinics isChatOpen={false} />;
}
