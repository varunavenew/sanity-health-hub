import type { Metadata } from "next";
import AboutSpecialists from "@/site-pages/AboutSpecialists";
import { buildSpecialistsAboutMetadata } from "@/lib/seo/route-metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildSpecialistsAboutMetadata(locale);
}

export default function Page() {
  return <AboutSpecialists isChatOpen={false} />;
}
