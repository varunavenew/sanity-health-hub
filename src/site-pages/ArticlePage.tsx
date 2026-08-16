"use client";

import { useEffect, useMemo } from "react";
import { useParams, Link, useRouteSlug } from "@/lib/router";
import { ArrowLeft, Calendar } from "lucide-react";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { PageLayout } from "@/components/layout/PageLayout";
import { useArticle, useArticles, useNewsPage } from "@/hooks/useSanity";
import { PageSEO } from "@/components/seo/PageSEO";
import { articleJsonLd, combineGeoJsonLd } from "@/lib/seo/geo-jsonld";
import { AssetImg } from "@/components/AssetImg";
import { MediaChip } from "@/components/ui/MediaChip";
import { createArticlePortableTextComponents } from "@/components/news/article-portable-text";
import { ArticleRelatedSection } from "@/components/news/ArticleRelatedSection";
import { normalizeCategory, type Article } from "@/data/articles";
import {
  parseNewsFilters,
  resolveArticleCategoryLabel,
} from "@/lib/news/category-labels";
import { withLocalePath, type AppLocale } from "@/lib/i18n/routing";
import { useTranslation } from "react-i18next";

interface ArticlePageProps {
  isChatOpen: boolean;
}

const formatDate = (dateStr: string, locale: string) => {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const ArticlePage = ({ isChatOpen }: ArticlePageProps) => {
  const { slug: paramSlug, locale: paramLocale } = useParams<{
    slug: string;
    locale?: string;
  }>();
  const slug = useRouteSlug() || paramSlug || "";
  const routeLocale: AppLocale = paramLocale === "en" ? "en" : "no";
  const contentLang = routeLocale === "en" ? "en" : "nb";
  const dateLocale = routeLocale === "en" ? "en-GB" : "nb-NO";
  const { t } = useTranslation();
  const { data: sanityArticle, isLoading } = useArticle(slug || "");
  const { data: sanityArticles } = useArticles();
  const { data: newsPage } = useNewsPage();

  const filterOptions = useMemo(
    () => parseNewsFilters(newsPage?.filters),
    [newsPage?.filters],
  );

  const newsPath = newsPage?.slug
    ? withLocalePath(routeLocale, `/${newsPage.slug}`)
    : withLocalePath(routeLocale, "/aktuelt");

  const getCategoryLabel = (category: string) =>
    resolveArticleCategoryLabel(category, filterOptions);

  const article = sanityArticle
    ? { ...sanityArticle, image: sanityArticle.image || "" }
    : undefined;

  const bodyBlocks = (sanityArticle?.body || []) as PortableTextBlock[];
  const portableTextComponents = useMemo(
    () => createArticlePortableTextComponents(bodyBlocks),
    [sanityArticle?._id, sanityArticle?.body],
  );

  const related = useMemo(() => {
    if (!article) return [];

    const normalizedCategory = normalizeCategory(article.category);
    const allArticles: Article[] = (sanityArticles || [])
      .map((a) => ({
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        image: a.image,
        date: a.date,
        category: normalizeCategory(a.category),
        externalUrl: a.externalUrl,
      }))
      .filter((a) => a.slug && a.slug !== article.slug);

    return allArticles
      .filter(
        (a) =>
          a.category === normalizedCategory ||
          getCategoryLabel(a.category) === getCategoryLabel(article.category),
      )
      .slice(0, 3);
  }, [article, sanityArticles, filterOptions]);

  useEffect(() => {
    if (article) {
      document.title = `${article.title} | CMedical`;
    }
  }, [article]);

  const backLabel = t("news.backToAktuelt", {
    defaultValue: routeLocale === "en" ? "Back to News" : "Tilbake til Aktuelt",
  });
  const relatedTitle = t("news.relatedArticles", {
    defaultValue:
      routeLocale === "en" ? "Related articles" : "Relaterte artikler",
  });
  const notFoundTitle = t("news.articleNotFound", {
    defaultValue: routeLocale === "en" ? "Article not found" : "Artikkelen ble ikke funnet",
  });

  if (isLoading) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-screen flex items-center justify-center text-muted-foreground font-light">
          {t("common.loading", { defaultValue: "Laster…" })}
        </div>
      </PageLayout>
    );
  }

  if (!article) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-foreground mb-2">{notFoundTitle}</h1>
            <Link to={newsPath} className="text-brand-dark underline">
              {backLabel}
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  const articlePath = `${newsPath}/${article.slug}`;
  const summaryText = article.geoSummary?.trim() || article.excerpt || "";
  const categoryLabel = getCategoryLabel(article.category);
  const geoJsonLd = combineGeoJsonLd(
    articleJsonLd({
      headline: article.title,
      description: summaryText.slice(0, 320),
      url: articlePath,
      datePublished: article.date,
      image: article.image || undefined,
      inLanguage: contentLang === "en" ? "en" : "nb-NO",
    }),
  );

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={article.title}
        description={
          article.excerpt ||
          (routeLocale === "en"
            ? `Read about ${article.title} at CMedical.`
            : `Les om ${article.title} hos CMedical.`)
        }
        canonical={articlePath}
        type="article"
        publishedAt={article.date}
        breadcrumbs={[
          {
            name: newsPage?.breadcrumbHomeLabel || t("nav.home", { defaultValue: "Hjem" }),
            path: withLocalePath(routeLocale, "/"),
          },
          { name: newsPage?.title || t("news.title", { defaultValue: "Aktuelt" }), path: newsPath },
          { name: article.title, path: articlePath },
        ]}
        jsonLd={geoJsonLd.length === 1 ? geoJsonLd[0] : geoJsonLd}
      />

      <div className="bg-brand-dark pt-24 pb-10 md:pt-28 md:pb-14">
        <div className="container mx-auto px-6 md:px-16">
          <Link
            to={newsPath}
            className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <MediaChip tone="light" className="rounded-2xl md:rounded-full px-3 py-1">
              {categoryLabel}
            </MediaChip>
            <span className="text-white/70 text-xs flex items-center gap-1.5">
              <Calendar className="w-3 h-3" aria-hidden="true" />
              {formatDate(article.date, dateLocale)}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-light text-white leading-tight max-w-3xl">
            {article.title}
          </h1>
        </div>
      </div>

      <article className="bg-background">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl mx-auto py-10 md:py-16">
            {article.image ? (
              <div className="rounded-sm overflow-hidden mb-10">
                <AssetImg
                  src={article.image}
                  alt={sanityArticle?.imageAlt || article.title}
                  preset="gallery"
                  className="w-full rounded-sm"
                />
              </div>
            ) : null}

            {bodyBlocks.length > 0 ? (
              <PortableText value={bodyBlocks} components={portableTextComponents} />
            ) : article.excerpt ? (
              <p className="text-foreground/80 font-light leading-relaxed mb-5">
                {article.excerpt}
              </p>
            ) : null}
          </div>
        </div>
      </article>

      <ArticleRelatedSection
        title={relatedTitle}
        articles={related}
        newsPath={newsPath}
        dateLocale={dateLocale}
        getCategoryLabel={getCategoryLabel}
      />
    </PageLayout>
  );
};

export default ArticlePage;
