import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "9jhqpk3a";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

const slugProjection = `{
  "no": slug[language == "no"][0].value.current,
  "en": slug[language == "en"][0].value.current,
  "legacy": slug.current
}`;

const SITEMAP_QUERY = `{
  "clinics": *[_type == "clinicPage"]${slugProjection},
  "articles": *[_type == "article"]${slugProjection},
  "jobs": *[_type == "jobListing" && active == true]${slugProjection}
}`;

type SlugRow = { no?: string; en?: string; legacy?: string };

export type SitemapSlugs = {
  clinics: string[];
  articles: string[];
  jobs: string[];
};

function collectSlugs(rows: SlugRow[]): string[] {
  const set = new Set<string>();
  for (const row of rows) {
    for (const s of [row.no, row.en, row.legacy]) {
      if (s?.trim()) set.add(s.trim());
    }
  }
  return [...set];
}

export async function fetchSitemapSlugs(): Promise<SitemapSlugs> {
  const client = createClient({
    projectId: projectId || "9jhqpk3a",
    dataset,
    apiVersion: "2024-01-01",
    useCdn: true,
  });
  const raw = await client.fetch<{
    clinics: SlugRow[];
    articles: SlugRow[];
    jobs: SlugRow[];
  }>(SITEMAP_QUERY);

  return {
    clinics: collectSlugs(raw.clinics || []),
    articles: collectSlugs(raw.articles || []),
    jobs: collectSlugs(raw.jobs || []),
  };
}
