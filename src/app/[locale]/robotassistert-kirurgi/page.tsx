import type { Metadata } from "next";
import RobotkirurgiPage from "@/site-pages/themes/RobotkirurgiPage";
import { buildThemePageMetadata } from "@/lib/seo/dynamic-route-metadata";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildThemePageMetadata(locale, "robotkirurgi");
}

export default function Page() {
  return <RobotkirurgiPage isChatOpen={false} />;
}
