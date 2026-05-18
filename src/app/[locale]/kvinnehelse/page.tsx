import type { Metadata } from "next";
import KvinnehelsePage from "@/site-pages/themes/KvinnehelsePage";
import { buildThemePageMetadata } from "@/lib/seo/dynamic-route-metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildThemePageMetadata(locale, "kvinnehelse");
}

export default function Page() {
  return <KvinnehelsePage isChatOpen={false} />;
}
