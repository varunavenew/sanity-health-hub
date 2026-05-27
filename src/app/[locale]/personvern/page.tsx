import type { Metadata } from "next";
import Personvern from "@/site-pages/Personvern";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbListJsonLd } from "@/lib/seo/jsonld-builders";
import { buildPrivacyMetadata } from "@/lib/seo/route-metadata";

type Props = { params: Promise<{ locale: string }> };

/** Keep in sync with `SANITY_DATA_REVALIDATE_SEC.singletonPage` (Next requires a literal). */
export const revalidate = 600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPrivacyMetadata(locale);
}

export default async function PersonvernPage({ params }: Props) {
  const { locale } = await params;
  const isEn = locale === "en";
  const ld = breadcrumbListJsonLd([
    { name: isEn ? "Home" : "Hjem", path: isEn ? "/en" : "/nb" },
    { name: isEn ? "Privacy" : "Personvern", path: isEn ? "/en/personvern" : "/nb/personvern" },
  ]);
  return (
    <>
      <JsonLd data={ld} />
      <Personvern isChatOpen={false} />
    </>
  );
}
