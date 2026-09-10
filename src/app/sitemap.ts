import fs from "node:fs";
import path from "node:path";
import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";
import { locales } from "@/lib/i18n/routing";
import { fetchCmsRouteIndex } from "@/lib/routing/fetch-route-index";
import { sitemapPathsFromRouteIndex } from "@/lib/routing/resolve-route";
import { NOINDEX_SEGMENTS } from "@/lib/seo/robots-paths";
import { isRetiredIvfSlug } from "@/lib/sanity/ivf-canonical";
import { isSitemapExcludedPath } from "@/lib/seo/sitemap-excluded-slugs";
import { hasTestContentSegment } from "@/lib/seo/test-content-slugs";

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
  "fertilitet-design",
  "gynekologi-design",
].filter((seg) => !(NOINDEX_SEGMENTS as readonly string[]).includes(seg));

/** Local page files for sitemap lastmod when the route has no Sanity document. */
const STATIC_PAGE_FILES: Record<string, string> = {
  guide: "src/app/[locale]/guide/page.tsx",
  booking: "src/app/[locale]/booking/page.tsx",
  "bestill-time": "src/app/[locale]/bestill-time/page.tsx",
  "book-appointment": "src/app/[locale]/book-appointment/page.tsx",
};

function parseUpdatedAt(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = value.trim() && /^\d+$/.test(value.trim())
    ? new Date(Number(value.trim()) * (value.trim().length <= 10 ? 1000 : 1))
    : new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/** Captured when this module loads (build / deploy / serverless cold start). */
const BUILD_LASTMOD: Date =
  parseUpdatedAt(process.env.VERCEL_GIT_COMMIT_TIMESTAMP) ??
  parseUpdatedAt(process.env.SOURCE_DATE_EPOCH) ??
  new Date();

function lastModifiedFromPageFile(relativePath: string): Date | undefined {
  try {
    return fs.statSync(path.join(process.cwd(), relativePath)).mtime;
  } catch {
    return undefined;
  }
}

function staticRouteLastModified(segment: string): Date {
  const pageFile = STATIC_PAGE_FILES[segment];
  return (pageFile && lastModifiedFromPageFile(pageFile)) || BUILD_LASTMOD;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const entries: MetadataRoute.Sitemap = [];
  const seen = new Set<string>();

  let homepageLastModified: Date | undefined;
  let cmsPaths: ReturnType<typeof sitemapPathsFromRouteIndex> = [];

  try {
    const index = await fetchCmsRouteIndex();
    homepageLastModified = parseUpdatedAt(index.homepageUpdatedAt);
    cmsPaths = sitemapPathsFromRouteIndex(index);
  } catch {
    /* Sanity optional at build time */
  }

  const push = (
    path: string,
    opts?: {
      changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
      priority?: number;
      lastModified?: Date;
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
        lastModified: opts?.lastModified,
        changeFrequency: opts?.changeFrequency ?? "weekly",
        priority: opts?.priority ?? (normalized ? 0.7 : 1),
      });
    }
  };

  push("", { priority: 1, lastModified: homepageLastModified });

  for (const seg of STATIC_APP_SEGMENTS) {
    push(seg, { lastModified: staticRouteLastModified(seg) });
  }

  for (const { locale, segments, lastModified } of cmsPaths) {
    if (
      segments.some((seg) => isRetiredIvfSlug(seg)) ||
      hasTestContentSegment(segments) ||
      isSitemapExcludedPath(locale, segments)
    ) {
      continue;
    }
    const url = `${base}/${locale}/${segments.join("/")}`;
    if (seen.has(url)) continue;
    seen.add(url);
    entries.push({
      url,
      lastModified,
      changeFrequency: "weekly",
      priority: segments.length > 1 ? 0.65 : 0.8,
    });
  }

  return entries;
}
