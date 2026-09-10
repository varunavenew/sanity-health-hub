import type { Metadata } from "next";
import Guide from "@/site-pages/Guide";
import { renderHydratedSingleton } from "@/lib/routing/hydrate-cms-page";
import { buildGuideMetadata } from "@/lib/seo/route-metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildGuideMetadata(locale);
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return renderHydratedSingleton("guidePage", locale, <Guide isChatOpen={false} />);
}
