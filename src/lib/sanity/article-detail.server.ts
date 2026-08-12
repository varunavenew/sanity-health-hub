import "server-only";

import { ARTICLE_BY_SLUG_QUERY } from "@/lib/queries";
import { fetchSanityGroqServer } from "@/lib/sanity/fetch-groq-server";
import { normalizeI18n } from "@/lib/sanity/normalize-i18n";
import { normalizePageSections } from "@/lib/sanity/page-sections";

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
  const data = normalizeI18n(raw, lang) as Record<string, unknown>;
  const title = data.title;
  const excerpt = data.excerpt;
  return {
    ...data,
    title:
      typeof title === "string"
        ? title
        : ((title as { value?: string }[] | undefined)?.[0]?.value ?? ""),
    excerpt:
      typeof excerpt === "string"
        ? excerpt
        : ((excerpt as { value?: string }[] | undefined)?.[0]?.value ?? ""),
    geoSummary:
      typeof data.geoSummary === "string" ? data.geoSummary.trim() : "",
    image: data.image || "",
    date: data.date || "",
    category: data.category || "Nytt fra oss",
    pageSections: normalizePageSections(data.pageSections),
  };
}
