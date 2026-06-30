import type { Metadata } from "next";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import Index from "@/site-pages/Index";
import { JsonLd } from "@/components/seo/JsonLd";
import { HomepageHydration } from "@/components/providers/HomepageHydration";
import { homeBreadcrumbJsonLd, medicalClinicJsonLd } from "@/lib/seo/home-jsonld";
import { medicalOrganizationJsonLd } from "@/lib/seo/geo-jsonld";
import { buildMedicalWebPageGeoJsonLd } from "@/lib/seo/geo-page";
import { buildHomeMetadata } from "@/lib/seo/route-metadata";
import { fetchHomepageData } from "@/lib/sanity/homepage-data";

type Props = { params: Promise<{ locale: string }> };

/** Always resolve homepage from Sanity at request time (uses env on Vercel). */
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildHomeMetadata(locale);
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const lang = locale === "en" ? "en" : "nb";
  const sanityLang = locale === "en" ? "en" : "no";
  const initialHomepage = await fetchHomepageData(sanityLang);
  const homePath = locale === "en" ? "/en" : "/nb";
  const medicalWebPageJsonLd = buildMedicalWebPageGeoJsonLd({
    name: "CMedical",
    geoSummary: initialHomepage?.geoSummary,
    fallbackDescription:
      initialHomepage?.tagline?.trim() || initialHomepage?.seo?.metaDescription,
    url: homePath,
    locale: lang,
  });
  const medicalWebPageBlocks = Array.isArray(medicalWebPageJsonLd)
    ? medicalWebPageJsonLd
    : [medicalWebPageJsonLd];

  const queryClient = new QueryClient();
  queryClient.setQueryData(["sanity", "homepage", sanityLang], initialHomepage);

  return (
    <>
      <JsonLd
        data={[
          medicalClinicJsonLd(lang),
          medicalOrganizationJsonLd(lang),
          homeBreadcrumbJsonLd(lang),
          ...medicalWebPageBlocks,
        ]}
      />
      <HomepageHydration state={dehydrate(queryClient)}>
        <Index
          key={sanityLang}
          isChatOpen={false}
          initialHomepage={initialHomepage}
          sanityLang={sanityLang}
        />
      </HomepageHydration>
    </>
  );
}
