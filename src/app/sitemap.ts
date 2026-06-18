import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";
import { locales } from "@/lib/i18n/routing";
import { fetchCmsRouteIndex } from "@/lib/routing/fetch-route-index";
import { staticParamsFromRouteIndex } from "@/lib/routing/resolve-route";

/** Non-CMS App Router pages (booking, demos, etc.) — not driven by Sanity slugs. */
const STATIC_APP_SEGMENTS = [
  "guide",
  "booking",
  "bestill-time",
  "book-appointment",
  "godkjenning",
  "icon-preview",
  "demoer",
  "design-demoer",
  "fastlegeveiledning-overgangsalder",
  "fertilitet-design",
  "gynekologi-design",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const entries: MetadataRoute.Sitemap = [];
  const seen = new Set<string>();

  const push = (
    path: string,
    opts?: {
      changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
      priority?: number;
    },
  ) => {
    const normalized = path === "" || path === "/" ? "" : path.replace(/^\//, "");
    for (const loc of locales) {
      const urlPath = normalized ? `/${loc}/${normalized}` : `/${loc}`;
      const url = `${base}${urlPath}`;
      if (seen.has(url)) continue;
      seen.add(url);
      entries.push({
        url,
        changeFrequency: opts?.changeFrequency ?? "weekly",
        priority: opts?.priority ?? (normalized ? 0.7 : 1),
      });
    }
  };

  push("", { priority: 1 });

  for (const seg of STATIC_APP_SEGMENTS) {
    push(seg);
  }

  try {
    const index = await fetchCmsRouteIndex();
    const params = staticParamsFromRouteIndex(index);
    for (const { locale, segments } of params) {
      const url = `${base}/${locale}/${segments.join("/")}`;
      if (seen.has(url)) continue;
      seen.add(url);
      entries.push({
        url,
        changeFrequency: "weekly",
        priority: segments.length > 1 ? 0.65 : 0.8,
      });
    }
  } catch {
    /* Sanity optional at build time */
  }

  return entries;
}
