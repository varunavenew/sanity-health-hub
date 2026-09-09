import "server-only";

import { ARTICLES_QUERY } from "@/lib/queries";
import { fetchSanityGroqServer } from "@/lib/sanity/fetch-groq-server";
import { pickImageFocal } from "@/lib/sanity/media-dual-read";
import { normalizeI18nStrict } from "@/lib/sanity/normalize-i18n";
import { normalizeArticleCategory } from "@/lib/news/article-categories";

export type ListingArticleRow = {
  _id?: string;
  slug?: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  externalUrl?: string;
  mediaType?: string;
};

/** Server-side articles list for RSC hydration (mirrors `useArticles`). */
export async function fetchArticlesListData(
  lang: "no" | "en",
): Promise<ListingArticleRow[]> {
  const raw = await fetchSanityGroqServer<Record<string, unknown>[] | null>(
    ARTICLES_QUERY,
    { lang },
  );
  const rows = Array.isArray(raw) ? raw : [];
  return rows.map((row) => {
    const a = normalizeI18nStrict(row, lang) as Record<string, unknown>;
    return {
      ...a,
      title: typeof a.title === "string" ? a.title : "",
      excerpt: typeof a.excerpt === "string" ? a.excerpt : "",
      image: typeof a.image === "string" ? a.image : "",
      ...pickImageFocal(a),
      date: typeof a.date === "string" ? a.date : "",
      category: normalizeArticleCategory(
        typeof a.category === "string" ? a.category : "Nytt fra oss",
      ),
    } as ListingArticleRow;
  });
}
