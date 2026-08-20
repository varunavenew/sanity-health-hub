"use client";

import { useEffect, useMemo } from "react";
import { useParams, Link, useRouteSlug } from "@/lib/router";
import { ArrowLeft } from "lucide-react";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { AssetImg } from "@/components/AssetImg";
import { PageLayout } from "@/components/layout/PageLayout";
import { useArticle, useArticles, useNewsPage } from "@/hooks/useSanity";
import { PageSEO } from "@/components/seo/PageSEO";
import { articleJsonLd, combineGeoJsonLd } from "@/lib/seo/geo-jsonld";
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

  const listingTitle =
    newsPage?.title?.trim() ||
    t("news.title", {
      defaultValue: routeLocale === "en" ? "Current Affairs" : "Aktuelt",
    });
  const backLabel =
    routeLocale === "en" ? `Back to ${listingTitle}` : `Tilbake til ${listingTitle}`;
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

      <header className="bg-brand-dark">
        <div className="px-6 pb-12 pt-28 md:px-16 md:pb-16 md:pt-32 lg:px-20">
          <div className="mx-auto max-w-3xl">
            <Link
              to={newsPath}
              className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white/80"
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Link>
            <h1 className="mb-6 text-3xl font-light leading-[1.15] text-white md:text-4xl lg:text-5xl">
              {article.title}
            </h1>
            {article.excerpt ? (
              <p className="max-w-2xl text-base font-light leading-relaxed text-white/75 md:text-lg">
                {article.excerpt}
              </p>
            ) : null}
          </div>
        </div>

        {article.image ? (
          <div className="w-full">
            <AssetImg
              src={article.image}
              alt={sanityArticle?.imageAlt || article.title}
              preset="hero"
              imageWidth={1920}
              loading="eager"
              width={1920}
              height={1080}
              className="aspect-[16/10] w-full object-cover md:aspect-[21/9]"
            />
          </div>
        ) : null}
      </header>

      <article className="bg-background">
        <div className="container mx-auto px-6 md:px-16">
          <div className="mx-auto max-w-3xl py-10 md:py-16">
            {bodyBlocks.length > 0 ? (
              <PortableText value={bodyBlocks} components={portableTextComponents} />
            ) : article.excerpt ? (
              <p className="mb-5 font-light leading-relaxed text-foreground/80">
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
