import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "9jhqpk3a";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

const SITEMAP_QUERY = `{
  "clinics": *[_type == "clinicPage" && defined(slug.current)].slug.current,
  "articles": *[_type == "article" && defined(slug.current)].slug.current,
  "jobs": *[_type == "jobListing" && active == true && defined(slug.current)].slug.current
}`;

export type SitemapSlugs = {
  clinics: string[];
  articles: string[];
  jobs: string[];
};

export async function fetchSitemapSlugs(): Promise<SitemapSlugs> {
  const client = createClient({
    projectId: projectId || "9jhqpk3a",
    dataset,
    apiVersion: "2024-01-01",
    useCdn: true,
  });
  return client.fetch<SitemapSlugs>(SITEMAP_QUERY);
}
