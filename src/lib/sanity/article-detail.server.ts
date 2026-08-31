import "server-only";

import { ARTICLE_BY_SLUG_QUERY } from "@/lib/queries";
import { fetchSanityGroqServer } from "@/lib/sanity/fetch-groq-server";
import { normalizeI18nStrict } from "@/lib/sanity/normalize-i18n";
import { normalizePageSections } from "@/lib/sanity/page-sections";
import { normalizeArticleCategory } from "@/lib/news/article-categories";

/** Server-side article payload for RSC + hydration (mirrors `useArticle`). */
export async function fetchArticleDetailData(
  slug: string,
  lang: "no" | "en",
): Promise<Record<string, unknown> | null> {
  const raw = await fetchSanityGroqServer<Record<string, unknown> | null>(
    ARTICLE_BY_SLUG_QUERY,
    { slug, lang },
  );
  if (!raw) return null;
  const data = normalizeI18nStrict(raw, lang) as Record<string, unknown>;
  const title = data.title;
  const excerpt = data.excerpt;
  return {
    ...data,
    title: typeof title === "string" ? title : "",
    excerpt: typeof excerpt === "string" ? excerpt : "",
    geoSummary:
      typeof data.geoSummary === "string" ? data.geoSummary.trim() : "",
    image: data.image || "",
    imageAlt: typeof data.imageAlt === "string" ? data.imageAlt : "",
    date: data.date || "",
    category: normalizeArticleCategory(
      typeof data.category === "string" ? data.category : "Nytt fra oss",
    ),
    body: Array.isArray(data.body) ? data.body : [],
    pageSections: normalizePageSections(data.pageSections),
  };
}
