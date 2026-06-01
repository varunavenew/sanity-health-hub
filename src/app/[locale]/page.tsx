import type { Metadata } from "next";
import Index from "@/site-pages/Index";
import { JsonLd } from "@/components/seo/JsonLd";
import { homeBreadcrumbJsonLd, medicalClinicJsonLd } from "@/lib/seo/home-jsonld";
import { buildHomeMetadata } from "@/lib/seo/route-metadata";
import { fetchHomepageData } from "@/lib/sanity/homepage-data";

type Props = { params: Promise<{ locale: string }> };

/** Keep in sync with `SANITY_DATA_REVALIDATE_SEC.homepage` (Next requires a literal). */
export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildHomeMetadata(locale);
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const lang = locale === "en" ? "en" : "nb";
  return (
    <>
      <JsonLd data={[medicalClinicJsonLd(lang), homeBreadcrumbJsonLd(lang)]} />
      <Index isChatOpen={false} />
    </>
  );
}
