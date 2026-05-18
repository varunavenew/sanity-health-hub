import type { Metadata } from "next";
import TverrfagligePage from "@/site-pages/themes/TverrfagligePage";
import { buildThemePageMetadata } from "@/lib/seo/dynamic-route-metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildThemePageMetadata(locale, "tverrfaglige-team");
}

export default function Page() {
  return <TverrfagligePage isChatOpen={false} />;
}
