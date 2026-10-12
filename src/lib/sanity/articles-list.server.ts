import "server-only";

import { ARTICLES_QUERY } from "@/lib/queries";
import { fetchSanityGroqServer } from "@/lib/sanity/fetch-groq-server";
import { pickImageFocal } from "@/lib/sanity/media-dual-read";
import { cmsImageSrc } from "@/lib/sanity/image-url";
import { normalizeI18nStrict } from "@/lib/sanity/normalize-i18n";
import { normalizeArticleCategory } from "@/lib/news/article-categories";
import {
  resolveArticleContentFormat,
  type ArticleContentFormat,
} from "@/lib/news/content-format";

export type ListingArticleRow = {
  _id?: string;
  slug?: string;
  title: string;
  excerpt: string;
  image: string;
  imageHotspot?: import("@/lib/media/focal-point").SanityHotspot | import("@/lib/media/focal-point").MediaFocalPoint | null;
  imageCrop?: import("@/lib/media/focal-point").SanityCrop | null;
  date: string;
  category: string;
  externalUrl?: string;
  contentFormat?: ArticleContentFormat;
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
      image: cmsImageSrc(a.image, a.imageAssetRef),
      ...pickImageFocal(a),
      date: typeof a.date === "string" ? a.date : "",
      category: normalizeArticleCategory(
        typeof a.category === "string" ? a.category : "Nytt fra oss",
      ),
      contentFormat: resolveArticleContentFormat(a.contentFormat),
    } as ListingArticleRow;
  });
}
