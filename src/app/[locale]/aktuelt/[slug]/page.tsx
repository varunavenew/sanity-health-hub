import type { Metadata } from "next";
import ArticlePage from "@/site-pages/ArticlePage";
import { buildArticleMetadata } from "@/lib/seo/dynamic-route-metadata";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  return buildArticleMetadata(locale, slug);
}

export default function Page() {
  return <ArticlePage isChatOpen={false} />;
}
