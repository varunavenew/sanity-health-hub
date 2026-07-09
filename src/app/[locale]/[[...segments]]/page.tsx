import type { Metadata } from "next";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { notFound } from "next/navigation";
import Index from "@/site-pages/Index";
import { JsonLd } from "@/components/seo/JsonLd";
import { HomepageHydration } from "@/components/providers/HomepageHydration";
import { homeBreadcrumbJsonLd, medicalClinicJsonLd } from "@/lib/seo/home-jsonld";
import { medicalOrganizationJsonLd } from "@/lib/seo/geo-jsonld";
import { buildMedicalWebPageGeoJsonLd } from "@/lib/seo/geo-page";
import { buildHomeMetadata } from "@/lib/seo/route-metadata";
import { fetchHomepageData } from "@/lib/sanity/homepage-data";
import { fetchCmsRouteIndex } from "@/lib/routing/fetch-route-index";
import {
  resolveCmsRoute,
  staticParamsFromRouteIndex,
} from "@/lib/routing/resolve-route";
import {
  buildCmsRouteMetadata,
  renderCmsRoute,
} from "@/lib/routing/render-cms-route";

type Props = {
  params: Promise<{ locale: string; segments?: string[] }>;
};

/** Keep CMS routes in sync with `SANITY_DATA_REVALIDATE_SEC.singletonPage`. */
export const revalidate = 600;

/** Allow on-demand rendering for CMS slugs not yet in `generateStaticParams`. */
export const dynamicParams = true;

export async function generateStaticParams() {
  const homeParams = ["no", "en"].map((locale) => ({ locale, segments: [] }));

  try {
    const index = await fetchCmsRouteIndex();
    return [...homeParams, ...staticParamsFromRouteIndex(index)];
  } catch {
    return homeParams;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, segments = [] } = await params;
  if (segments.length === 0) return buildHomeMetadata(locale);

  const index = await fetchCmsRouteIndex();
  const route = resolveCmsRoute(segments, locale, index);
  if (!route) return {};
  return buildCmsRouteMetadata(route, locale);
}

async function renderHomepage(locale: string) {
  const lang = locale === "en" ? "en" : "nb";
  const sanityLang = locale === "en" ? "en" : "no";
  const initialHomepage = await fetchHomepageData(sanityLang);
  const homePath = `/${locale === "en" ? "en" : "no"}`;
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

export default async function CmsOptionalCatchAllPage({ params }: Props) {
  const { locale, segments = [] } = await params;
  if (segments.length === 0) return renderHomepage(locale);

  const index = await fetchCmsRouteIndex();
  const route = resolveCmsRoute(segments, locale, index);
  if (!route) notFound();
  return renderCmsRoute(route, locale);
}
