"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { ListPageHero } from "@/components/layout/ListPageHero";
import { PageSEO } from "@/components/seo/PageSEO";
import { buildMedicalWebPageGeoJsonLd } from "@/lib/seo/geo-page";
import { normalizeCategory, type Article } from "@/data/articles";
import { useArticles, useNewsPage, useSiteSettings, type SanitySocialPost } from "@/hooks/useSanity";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { useParams } from "@/lib/router";
import { withLocalePath, type AppLocale } from "@/lib/i18n/routing";
import { getImageUrl } from "@/lib/sanity/image-url";
import { NewsSocialPlatformSection } from "@/components/news/NewsSocialPlatformSection";
import { NewsInstagramSection } from "@/components/news/NewsInstagramSection";
import { resolveArticleCategoryLabel, resolveNewsFilterOptions } from "@/lib/news/category-labels";
import {
  ArticleCard,
  FeaturedCard,
  type ListingArticle,
} from "@/components/news/ArticleListingCards";

interface AktueltProps {
  isChatOpen: boolean;
}

type RawArticle = {
  slug?: string;
  title?: string;
  excerpt?: string;
  image?: string;
  imageHotspot?: ListingArticle["imageHotspot"];
  imageCrop?: ListingArticle["imageCrop"];
  date?: string;
  category?: string;
  externalUrl?: string;
  mediaType?: ListingArticle["mediaType"];
};

const mapRawArticle = (a: RawArticle): ListingArticle | null => {
  if (!a?.slug) return null;
  return {
    slug: a.slug,
    title: a.title || "",
    excerpt: a.excerpt || "",
    image: a.image || "",
    imageHotspot: a.imageHotspot,
    imageCrop: a.imageCrop,
    date: a.date || "",
    category: normalizeCategory(a.category || ""),
    externalUrl: a.externalUrl,
    mediaType: a.mediaType,
  };
};

const Aktuelt = ({ isChatOpen }: AktueltProps) => {
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "en" ? "en" : "nb";
  const routeLocale: AppLocale = params?.locale === "en" ? "en" : "no";
  const dateLocale = routeLocale === "en" ? "en-GB" : "nb-NO";
  const { data: sanityArticles } = useArticles();
  const { data: newsPage } = useNewsPage();
  const { data: siteSettings } = useSiteSettings();
  const [activeFilter, setActiveFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const filterOptions = useMemo<Array<{
    key: string;
    label: string;
    acceptedArticleCategories: string[];
  }>>(
    () => resolveNewsFilterOptions(newsPage?.filters, routeLocale),
    [newsPage?.filters, routeLocale],
  );

  const listableCategories = useMemo(() => {
    const set = new Set<string>();
    for (const filter of filterOptions) {
      for (const category of filter.acceptedArticleCategories) {
        set.add(category);
        set.add(normalizeCategory(category));
      }
    }
    return set;
  }, [filterOptions]);

  const isListableArticle = useCallback(
    (category: string) => {
      const normalized = normalizeCategory(category);
      return (
        listableCategories.has(category) ||
        listableCategories.has(normalized)
      );
    },
    [listableCategories],
  );

  const articles: ListingArticle[] = useMemo(() => {
    const seen = new Set<string>();
    return (sanityArticles || [])
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
        mediaType: (a as { mediaType?: ListingArticle["mediaType"] }).mediaType,
      }))
      .filter((a) => {
        if (!a.slug || seen.has(a.slug)) return false;
        seen.add(a.slug);
        return true;
      });
  }, [sanityArticles]);

  const listingFromCms = useMemo(() => {
    if (!Array.isArray(newsPage?.listingArticles)) return null;
    const mapped = (newsPage.listingArticles as RawArticle[])
      .map(mapRawArticle)
      .filter((a): a is ListingArticle => Boolean(a));
    return mapped.length ? mapped : null;
  }, [newsPage?.listingArticles]);

  const articlePool = useMemo(() => {
    if (listingFromCms?.length) return listingFromCms;
    return articles.filter((a) => isListableArticle(a.category));
  }, [articles, isListableArticle, listingFromCms]);

  const pageSize =
    typeof newsPage?.listSize === "number" && newsPage.listSize > 0
      ? newsPage.listSize
      : 6;
  const allFilterKey = filterOptions[0]?.key || "";
  const newsPath = newsPage?.slug
    ? withLocalePath(routeLocale, `/${newsPage.slug}`)
    : "";

  useEffect(() => {
    if (
      allFilterKey &&
      !filterOptions.some((filter) => filter.key === activeFilter)
    ) {
      setActiveFilter(allFilterKey);
    }
    setVisibleCount(pageSize);
  }, [activeFilter, allFilterKey, filterOptions, pageSize]);

  const filteredArticles = useMemo(() => {
    const pool = activeFilter === allFilterKey ? articlePool : articles;
    return pool.filter((a) => {
      return (
        activeFilter === allFilterKey ||
        (filterOptions.find((filter) => filter.key === activeFilter)
          ?.acceptedArticleCategories.length ?? 0) === 0 ||
        filterOptions
          .find((filter) => filter.key === activeFilter)
          ?.acceptedArticleCategories.includes(a.category) ||
        filterOptions
          .find((filter) => filter.key === activeFilter)
          ?.acceptedArticleCategories.includes(normalizeCategory(a.category))
      );
    });
  }, [
    activeFilter,
    allFilterKey,
    articlePool,
    articles,
    filterOptions,
  ]);

  const sortedArticles = useMemo(() => {
    if (activeFilter === allFilterKey && listingFromCms?.length) {
      const slugs = new Set(filteredArticles.map((a) => a.slug));
      return listingFromCms.filter((a) => slugs.has(a.slug));
    }
    return [...filteredArticles].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [activeFilter, allFilterKey, filteredArticles, listingFromCms]);

  const manualFeatured = ((newsPage?.featuredArticles || []) as RawArticle[])
    .map(mapRawArticle)
    .filter((a): a is ListingArticle => Boolean(a));
  const featuredTop =
    activeFilter === allFilterKey && manualFeatured.length > 0
      ? manualFeatured.slice(0, 4)
      : sortedArticles.slice(0, 4);
  const featuredSlugs = new Set(featuredTop.map((a) => a.slug));
  const restArticles = sortedArticles.filter((a) => !featuredSlugs.has(a.slug));
  const visibleRest = restArticles.slice(0, visibleCount);
  const hasMore = visibleCount < restArticles.length;

  const newsUi = {
    label: newsPage?.label || "",
    title: newsPage?.title || "",
    subtitle: newsPage?.subtitle || "",
    moreArticlesTitle: newsPage?.moreArticlesTitle || "",
    noArticlesText: newsPage?.noArticlesText || "",
    readMoreLabel: newsPage?.readMoreLabel || "",
    loadMoreLabel:
      routeLocale === "en" ? "Show more articles" : "Vis flere artikler",
    socialSectionTitle: newsPage?.socialSectionTitle || "",
    instagramSectionTitle: newsPage?.instagramSectionTitle || "",
  };

  const socialPlatformCards = useMemo(
    () =>
      Array.isArray(newsPage?.socialPlatformCards)
        ? newsPage.socialPlatformCards.filter(
            (card: { url?: string; title?: string }) => card?.url && card?.title,
          )
        : [],
    [newsPage?.socialPlatformCards],
  );

  const socialPostLimit = newsPage?.socialPostLimit ?? 4;
  const socialMode = newsPage?.socialMode as "cms" | "api" | "hidden" | undefined;
  const showInstagramPosts = Boolean(socialMode && socialMode !== "hidden");
  const instagramSectionPosts = useMemo((): SanitySocialPost[] => {
    if (!showInstagramPosts || !Array.isArray(newsPage?.socialPosts)) return [];

    return newsPage.socialPosts
      .slice(0, socialPostLimit)
      .map((post: {
        _key?: string;
        platform?: string;
        caption?: string;
        postUrl?: string;
        alt?: string;
        image?: string;
        imageUrl?: string;
      }) => ({
        _id: post._key || post.caption || "social",
        platform: (post.platform || "instagram") as "instagram",
        image: (typeof post.image === "string" && post.image) || post.imageUrl || "",
        caption: post.caption,
        postUrl: post.postUrl,
        alt: post.alt,
      }))
      .filter((post) => post.image.startsWith("http"));
  }, [newsPage?.socialPosts, showInstagramPosts, socialPostLimit]);

  const getCategoryLabel = (category: string) =>
    resolveArticleCategoryLabel(category, filterOptions, routeLocale);

  const articleLink = (article: Article) =>
    article.externalUrl || `${newsPath}/${article.slug}`;

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + pageSize);
      setIsLoading(false);
    }, 400);
  }, [hasMore, isLoading, pageSize]);

  useEffect(() => {
    const el = loaderRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  const seoTitle = newsPage?.seo?.metaTitle || "";
  const seoDescription = newsPage?.seo?.metaDescription || "";
  const ogImage = newsPage?.seo?.ogImage
    ? getImageUrl(newsPage.seo.ogImage)
    : undefined;

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={seoTitle}
        description={seoDescription}
        canonical={newsPath}
        noIndex={!!newsPage?.seo?.noIndex}
        ogImage={ogImage || undefined}
        breadcrumbs={[
          { name: newsPage?.breadcrumbHomeLabel || "", path: withLocalePath(routeLocale, "/") },
          { name: newsUi.title, path: newsPath },
        ]}
        jsonLd={buildMedicalWebPageGeoJsonLd({
          name: newsUi.title,
          geoSummary: newsPage?.geoSummary,
          fallbackDescription: newsUi.subtitle || seoDescription,
          url: newsPath,
          locale,
        })}
      />

      <ListPageHero
        title={newsUi.title}
        description={newsUi.subtitle}
      />

      <section className="bg-background pt-3 pb-6 md:pb-10">
        <div className="container mx-auto px-6 md:px-16">
          <div className="mb-4 flex flex-wrap gap-2 md:mb-3 md:justify-end">
              {filterOptions.map((opt) => {
                const isActive = activeFilter === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setActiveFilter(opt.key)}
                    className="chip-filter chip-filter-light"
                    data-active={isActive ? "true" : undefined}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {opt.label}
                  </button>
                );
              })}
          </div>

          {featuredTop.length > 0 && (
            <div className="mb-16">
              <div className="grid md:grid-cols-2 gap-4">
                {featuredTop.map((article) => (
                  <FeaturedCard
                    key={article.slug}
                    article={article}
                    readMoreLabel={newsUi.readMoreLabel}
                    categoryLabel={getCategoryLabel(article.category)}
                    linkTo={articleLink(article)}
                    dateLocale={dateLocale}
                  />
                ))}
              </div>
            </div>
          )}

          {visibleRest.length > 0 && (
            <>
              <h2 className="text-lg font-medium text-foreground mb-6">
                {newsUi.moreArticlesTitle}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {visibleRest.map((article) => (
                  <ArticleCard
                    key={article.slug}
                    article={article}
                    categoryLabel={getCategoryLabel(article.category)}
                    linkTo={articleLink(article)}
                    dateLocale={dateLocale}
                  />
                ))}
              </div>
            </>
          )}

          {hasMore && (
            <div ref={loaderRef} className="flex justify-center py-10">
              {isLoading ? (
                <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
              ) : (
                <button
                  type="button"
                  onClick={loadMore}
                  className="rounded-[var(--radius)] border border-border px-6 py-3 text-sm font-light text-foreground transition-colors hover:bg-muted"
                >
                  {newsUi.loadMoreLabel}
                </button>
              )}
            </div>
          )}

          {filteredArticles.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground font-light">{newsUi.noArticlesText}</p>
            </div>
          )}
        </div>
      </section>

      {socialPlatformCards.length > 0 ? (
        <NewsSocialPlatformSection
          title={newsUi.socialSectionTitle}
          cards={socialPlatformCards}
        >
          {showInstagramPosts ? (
            <NewsInstagramSection
              title={newsUi.instagramSectionTitle}
              profile={newsPage?.instagramProfile}
              posts={instagramSectionPosts}
              postLimit={socialPostLimit}
              socialUrls={siteSettings?.socialMedia}
              locale={routeLocale}
              nested
            />
          ) : null}
        </NewsSocialPlatformSection>
      ) : showInstagramPosts ? (
        <NewsInstagramSection
          title={newsUi.instagramSectionTitle}
          profile={newsPage?.instagramProfile}
          posts={instagramSectionPosts}
          postLimit={socialPostLimit}
          socialUrls={siteSettings?.socialMedia}
          locale={routeLocale}
        />
      ) : null}

      <PageSectionsRenderer sections={newsPage?.pageSections} />
    </PageLayout>
  );
};

export default Aktuelt;

