import type { Metadata } from "next";
import About from "@/site-pages/About";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListJsonLd } from "@/lib/seo/jsonld-builders";
import { buildAboutMetadata } from "@/lib/seo/route-metadata";

type Props = { params: Promise<{ locale: string }> };

/** Keep in sync with `SANITY_DATA_REVALIDATE_SEC.singletonPage` (Next requires a literal). */
export const revalidate = 600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildAboutMetadata(locale);
}

export default async function OmOssPage({ params }: Props) {
  const { locale } = await params;
  const isEn = locale === "en";
  const ld = breadcrumbListJsonLd([
    { name: isEn ? "Home" : "Hjem", path: isEn ? "/en" : "/nb" },
    { name: isEn ? "About us" : "Om oss", path: isEn ? "/en/about" : "/nb/om-oss" },
  ]);
  return (
    <>
      <JsonLd data={ld} />
      <About isChatOpen={false} />
    </>
  );
}
