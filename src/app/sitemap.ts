import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";
import { locales } from "@/lib/i18n/routing";
import { fetchSitemapSlugs } from "@/lib/sanity/sitemap-data";

const MARKETING_SEGMENTS = [
  "",
  "about",
  "guide",
  "contact",
  "priser",
  "tjenester",
  "tjenester-og-priser",
  "forsikring",
  "om-oss",
  "kontakt",
  "gynecology",
  "gynekologi",
  "fertility",
  "fertilitet",
  "urology",
  "urologi",
  "ortopedi",
  "graviditet",
  "flere-fagomrader",
  "behandlinger/gynekologi",
  "behandlinger/fertilitet",
  "behandlinger/urologi",
  "behandlinger/ortopedi",
  "behandlinger/graviditet",
  "behandlinger/flere-fagomrader",
  "kvinnehelse",
  "tverrfaglige-team",
  "robotassistert-kirurgi",
  "fastlegeveiledning-overgangsalder",
  "personvern",
  "karriere",
  "aktuelt",
  "om-spesialister",
  "spesialister",
  "booking",
  "bestill-time",
  "klinikker",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const entries: MetadataRoute.Sitemap = [];

  const push = (
    path: string,
    opts?: { changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"; priority?: number },
  ) => {
    for (const loc of locales) {
      const urlPath = path === "" || path === "/" ? `/${loc}` : `/${loc}/${path.replace(/^\//, "")}`;
      entries.push({
        url: `${base}${urlPath}`,
        changeFrequency: opts?.changeFrequency ?? "weekly",
        priority: opts?.priority ?? (path === "" || path === "/" ? 1 : 0.7),
      });
    }
  };

  for (const seg of MARKETING_SEGMENTS) {
    push(seg === "" ? "" : seg, { priority: seg === "" ? 1 : 0.7 });
  }

  try {
    const { clinics, articles, jobs } = await fetchSitemapSlugs();
    for (const loc of locales) {
      for (const slug of clinics ?? []) {
        entries.push({
          url: `${base}/${loc}/klinikker/${slug}`,
          changeFrequency: "weekly",
          priority: 0.75,
        });
      }
      for (const slug of articles ?? []) {
        entries.push({
          url: `${base}/${loc}/aktuelt/${slug}`,
          changeFrequency: "monthly",
          priority: 0.55,
        });
      }
      for (const slug of jobs ?? []) {
        entries.push({
          url: `${base}/${loc}/karriere/${slug}`,
          changeFrequency: "weekly",
          priority: 0.5,
        });
      }
    }
  } catch {
    /* Sanity optional at build time */
  }

  return entries;
}
