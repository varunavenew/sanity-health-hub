"use client";

import { useEffect, useMemo, useRef } from "react";
import { useParams, Link, useRouteSlug } from "@/lib/router";
import { ArrowLeft, Calendar, ChevronDown } from "lucide-react";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import type { MediaFocalPoint, SanityCrop, SanityHotspot } from "@/lib/media/focal-point";
import { PageLayout } from "@/components/layout/PageLayout";
import { useArticle, useArticles, useNewsPage } from "@/hooks/useSanity";
import { PageSEO } from "@/components/seo/PageSEO";
import { resolveSeoShareImageUrl } from "@/lib/seo/resolve-seo-share-image";
import { articleJsonLd, combineGeoJsonLd } from "@/lib/seo/geo-jsonld";
import { createArticlePortableTextComponents } from "@/components/news/article-portable-text";
import { ArticleRelatedSection } from "@/components/news/ArticleRelatedSection";
import { normalizeCategory, type Article } from "@/data/articles";
import {
  resolveArticleCategoryLabel,
  resolveNewsFilterOptions,
} from "@/lib/news/category-labels";
import { withLocalePath, type AppLocale } from "@/lib/i18n/routing";
import { useTranslation } from "react-i18next";

interface ArticlePageProps {
  isChatOpen: boolean;
}

function ArticleMobileHero({
  image,
  imageAlt,
  imageHotspot,
  imageCrop,
  title,
  newsPath,
  backLabel,
  categoryLabel,
  date,
  dateLocale,
  swipeDownLabel,
}: {
  image?: string;
  imageAlt: string;
  imageHotspot?: SanityHotspot | MediaFocalPoint | null;
  imageCrop?: SanityCrop | null;
  title: string;
  newsPath: string;
  backLabel: string;
  categoryLabel: string;
  date?: string;
  dateLocale: string;
  swipeDownLabel: string;
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const imageEl = imageRef.current;
    const overlay = overlayRef.current;
    if (!hero || !overlay) return;

    let frame = 0;
    const update = () => {
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(
        1,
        Math.max(0, -rect.top / Math.max(rect.height, 1)),
      );
      overlay.style.transform = `translate3d(0px, ${progress * 56}px, 0px)`;
      if (imageEl) {
        imageEl.style.transform = `translate3d(0px, ${progress * 36}px, 0px) scale(${1 + progress * 0.06})`;
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={heroRef} className="relative min-h-[100svh] overflow-hidden lg:hidden">
      {image ? (
        <div
          ref={imageRef}
          className="absolute inset-0 z-0 will-change-transform"
          style={{ transform: "translate3d(0px, 0px, 0px)", transformOrigin: "center center" }}
        >
          <ResponsiveImage
            src={image}
            alt={imageAlt}
            variant="hero"
            hotspot={imageHotspot}
            crop={imageCrop}
            imageWidth={1200}
            loading="eager"
            width={1200}
            height={1800}
            className="h-[115%] w-full"
          />
        </div>
      ) : null}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to top, rgba(24, 4, 4, 0.94) 0%, rgba(40, 22, 16, 0.82) 22%, rgba(50, 32, 24, 0.58) 48%, rgba(50, 32, 24, 0.32) 72%, rgba(20, 10, 8, 0.16) 100%)",
        }}
        aria-hidden="true"
      />
      <div
        ref={overlayRef}
        className="absolute inset-x-0 bottom-0 z-10 px-6 pb-16 will-change-transform"
        style={{ transform: "translate3d(0px, 0px, 0px)" }}
      >
        <Link
          to={newsPath}
          className="mb-5 inline-flex items-center gap-2 text-sm font-light text-brand-warm/80 transition-colors hover:text-brand-warm"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
          {backLabel}
        </Link>
        <div className="mb-3 flex items-center gap-3">
          {categoryLabel ? (
            <span className="text-xs text-brand-warm">{categoryLabel}</span>
          ) : null}
          {date ? (
            <span className="flex items-center gap-1.5 text-xs text-brand-warm/90">
              <Calendar className="h-3 w-3" aria-hidden="true" />
              <time dateTime={date}>
                {new Date(date).toLocaleDateString(dateLocale, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </span>
          ) : null}
        </div>
        <p aria-hidden="true" className="text-2xl font-light leading-tight text-brand-warm">
          {title}
        </p>
      </div>
      <p className="absolute inset-x-0 bottom-5 z-10 flex flex-col items-center gap-1 text-center text-xs font-light text-brand-warm/80">
        <span>{swipeDownLabel}</span>
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </p>
    </div>
  );
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
    () => resolveNewsFilterOptions(newsPage?.filters, routeLocale),
    [newsPage?.filters, routeLocale],
  );

  const newsPath = newsPage?.slug
    ? withLocalePath(routeLocale, `/${newsPage.slug}`)
    : withLocalePath(routeLocale, "/aktuelt");

  const getCategoryLabel = (category: string) =>
    resolveArticleCategoryLabel(category, filterOptions, routeLocale);

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
        imageHotspot: a.imageHotspot,
        imageCrop: a.imageCrop,
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
  const swipeDownLabel = t("news.swipeDownToRead", {
    defaultValue: routeLocale === "en" ? "Swipe down to read" : "Sveip ned for å lese",
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

  const categoryLabel = getCategoryLabel(article.category);
  const articlePath = `${newsPath}/${article.slug}`;
  const shareImageUrl = resolveSeoShareImageUrl({
    seo: sanityArticle?.seo,
    heroImageUrl: article.image || undefined,
  });
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
        ogImage={shareImageUrl}
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
        <h1 className="sr-only">{article.title}</h1>
        <ArticleMobileHero
          image={article.image}
          imageHotspot={article.imageHotspot}
          imageCrop={article.imageCrop}
          imageAlt={sanityArticle?.imageAlt || article.title}
          title={article.title}
          newsPath={newsPath}
          backLabel={backLabel}
          categoryLabel={categoryLabel}
          date={article.date}
          dateLocale={dateLocale}
          swipeDownLabel={swipeDownLabel}
        />

        <div className="hidden lg:grid lg:grid-cols-2 split-hero">
          <div className="flex items-center px-16 lg:px-20 pt-32 pb-20">
            <div className="w-full max-w-xl">
              <Link
                to={newsPath}
                className="mb-8 inline-flex items-center gap-2 text-sm font-light text-white/70 transition-colors hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
                {backLabel}
              </Link>
              <div className="mb-4 flex items-center gap-3">
                {categoryLabel ? (
                  <span className="text-xs text-white/80">{categoryLabel}</span>
                ) : null}
                {article.date ? (
                  <span className="flex items-center gap-1.5 text-xs text-white/80">
                    <Calendar className="h-3 w-3" aria-hidden="true" />
                    <time dateTime={article.date}>
                      {new Date(article.date).toLocaleDateString(dateLocale, {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                  </span>
                ) : null}
              </div>
              <p className="mb-6 text-4xl font-light leading-tight text-white lg:text-5xl">
                {article.title}
              </p>
              {article.excerpt ? (
                <p className="text-base font-light leading-relaxed text-white/75 lg:text-lg">
                  {article.excerpt}
                </p>
              ) : null}
            </div>
          </div>
          {article.image ? (
            <div className="split-media bg-secondary/40">
              <ResponsiveImage
                src={article.image}
                alt={sanityArticle?.imageAlt || article.title}
                variant="hero"
                hotspot={article.imageHotspot}
                crop={article.imageCrop}
                imageWidth={1600}
                loading="eager"
                width={1600}
                height={1800}
                className="h-full w-full"
              />
            </div>
          ) : (
            <div className="split-media bg-brand-dark" />
          )}
        </div>
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
