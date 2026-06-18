import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
  params: Promise<{ locale: string; segments: string[] }>;
};

/** Keep in sync with `SANITY_DATA_REVALIDATE_SEC.singletonPage`. */
export const revalidate = 600;

/** Allow on-demand rendering for CMS slugs not yet in `generateStaticParams`. */
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const index = await fetchCmsRouteIndex();
    return staticParamsFromRouteIndex(index);
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, segments } = await params;
  const index = await fetchCmsRouteIndex();
  const route = resolveCmsRoute(segments, locale, index);
  if (!route) return {};
  return buildCmsRouteMetadata(route, locale);
}

export default async function CmsCatchAllPage({ params }: Props) {
  const { locale, segments } = await params;
  const index = await fetchCmsRouteIndex();
  const route = resolveCmsRoute(segments, locale, index);
  if (!route) notFound();
  return renderCmsRoute(route, locale);
}
