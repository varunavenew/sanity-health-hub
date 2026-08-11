"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { Link } from "@/lib/router";
import { ArrowRight, Calendar, FileText, Search, Loader2 } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { buildMedicalWebPageGeoJsonLd } from "@/lib/seo/geo-page";
import { normalizeCategory, type Article } from "@/data/articles";
import { useArticles, useNewsPage, useSiteSettings, type SanitySocialPost } from "@/hooks/useSanity";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { useParams } from "@/lib/router";
import { withLocalePath, type AppLocale } from "@/lib/i18n/routing";
import { getImageUrl } from "@/lib/sanity/image-url";
import { AssetImg } from "@/components/AssetImg";
import { NewsSocialPlatformSection } from "@/components/news/NewsSocialPlatformSection";
import { NewsInstagramSection } from "@/components/news/NewsInstagramSection";
import {
  resolveArticleCategoryLabel,
} from "@/lib/news/category-labels";

interface AktueltProps {
  isChatOpen: boolean;
}

type RawNewsFilter = {
  key?: unknown;
  label?: unknown;
  acceptedArticleCategories?: unknown;
};

type RawArticle = {
  slug?: string;
  title?: string;
  excerpt?: string;
  image?: string;
  date?: string;
  category?: string;
  externalUrl?: string;
};

const formatDate = (dateStr: string, locale: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
};

const ArticleCard = ({
  article,
  categoryLabel,
  newsPath,
  dateLocale,
}: {
  article: Article;
  categoryLabel: string;
  newsPath: string;
  dateLocale: string;
}) => {
  const linkTo = article.externalUrl || `${newsPath}/${article.slug}`;

  return (
    <Link to={linkTo} className="group">
      <div className="relative aspect-[16/10] rounded-sm overflow-hidden mb-3 bg-secondary">
        <AssetImg
          src={article.image}
          alt={article.title}
          preset="card"
          loading="lazy"
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-brand-dark/80 backdrop-blur-sm text-white text-xs px-2.5 py-0.5 rounded-full">
            {categoryLabel}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
        <Calendar className="w-3 h-3" />
        {formatDate(article.date, dateLocale)}
      </div>
      <h3 className="text-sm font-medium text-foreground group-hover:text-foreground/80 transition-colors mb-1 leading-snug line-clamp-2">
        {article.title}
      </h3>
      <p className="text-xs text-muted-foreground font-light line-clamp-2">
        {article.excerpt}
      </p>
    </Link>
  );
};

const FeaturedCard = ({
  article,
  readMoreLabel,
  categoryLabel,
  newsPath,
  dateLocale,
}: {
  article: Article;
  readMoreLabel: string;
  categoryLabel: string;
  newsPath: string;
  dateLocale: string;
}) => {
  const linkTo = article.externalUrl || `${newsPath}/${article.slug}`;

  return (
    <Link to={linkTo} className="group relative block rounded-sm overflow-hidden">
      <div className="aspect-[16/10] overflow-hidden">
        <AssetImg
          src={article.image}
          alt={article.title}
          preset="gallery"
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/35 backdrop-blur-sm flex items-center justify-center">
        <FileText className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
        <span className="inline-block bg-white/15 backdrop-blur-md text-white text-xs px-2.5 py-0.5 rounded-full mb-2">
          {categoryLabel}
        </span>
        <h3 className="text-base md:text-xl font-medium text-white leading-snug mb-2 line-clamp-3">
          {article.title}
        </h3>
        <p className="text-white/60 text-xs font-light line-clamp-2 mb-2 hidden md:block">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-4">
          <span className="text-white/50 text-xs flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {formatDate(article.date, dateLocale)}
          </span>
          <span className="inline-flex items-center gap-1 text-white/90 text-xs font-medium group-hover:gap-2 transition-all">
            {readMoreLabel} <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};

const mapRawArticle = (a: RawArticle): Article | null => {
  if (!a?.slug) return null;
  return {
    slug: a.slug,
    title: a.title || "",
    excerpt: a.excerpt || "",
    image: a.image || "",
    date: a.date || "",
    category: normalizeCategory(a.category || ""),
    externalUrl: a.externalUrl,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const filterOptions = useMemo<Array<{
    key: string;
    label: string;
    acceptedArticleCategories: string[];
  }>>(
    () =>
      Array.isArray(newsPage?.filters)
        ? (newsPage.filters as RawNewsFilter[])
            .filter(
              (filter) =>
                typeof filter?.key === "string" &&
                typeof filter?.label === "string",
            )
            .map((filter) => ({
              key: filter.key as string,
              label: filter.label as string,
              acceptedArticleCategories: Array.isArray(filter.acceptedArticleCategories)
                ? filter.acceptedArticleCategories.filter(
                    (category): category is string => typeof category === "string",
                  )
                : [],
            }))
        : [],
    [newsPage?.filters],
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

  const articles: Article[] = useMemo(() => {
    const seen = new Set<string>();
    return (sanityArticles || [])
      .map((a) => ({
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        image: a.image,
        date: a.date,
        category: normalizeCategory(a.category),
        externalUrl: a.externalUrl,
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
      .filter((a): a is Article => Boolean(a));
    return mapped.length ? mapped : null;
  }, [newsPage?.listingArticles]);

  const articlePool = useMemo(() => {
    if (listingFromCms?.length) return listingFromCms;
    return articles.filter((a) => isListableArticle(a.category));
  }, [articles, isListableArticle, listingFromCms]);

  const pageSize =
    typeof newsPage?.listSize === "number" && newsPage.listSize > 0
      ? newsPage.listSize
      : 9;
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
  }, [activeFilter, allFilterKey, filterOptions, searchQuery, pageSize]);

  const filteredArticles = useMemo(() => {
    const pool = activeFilter === allFilterKey ? articlePool : articles;
    return pool.filter((a) => {
      const matchesFilter =
        activeFilter === allFilterKey ||
        (filterOptions.find((filter) => filter.key === activeFilter)
          ?.acceptedArticleCategories.length ?? 0) === 0 ||
        filterOptions
          .find((filter) => filter.key === activeFilter)
          ?.acceptedArticleCategories.includes(a.category) ||
        filterOptions
          .find((filter) => filter.key === activeFilter)
          ?.acceptedArticleCategories.includes(normalizeCategory(a.category));
      const matchesSearch =
        !searchQuery ||
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [
    activeFilter,
    allFilterKey,
    articlePool,
    articles,
    filterOptions,
    searchQuery,
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
    .filter((a): a is Article => Boolean(a));
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
    searchPlaceholder: newsPage?.searchPlaceholder || "",
    moreArticlesTitle: newsPage?.moreArticlesTitle || "",
    noArticlesText: newsPage?.noArticlesText || "",
    readMoreLabel: newsPage?.readMoreLabel || "",
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
    resolveArticleCategoryLabel(category, filterOptions);

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

      <section className="bg-brand-dark pt-24 pb-10 md:pt-28 md:pb-14">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-2xl">
            <p className="text-white/50 text-xs mb-2">{newsUi.label}</p>
            <h1 className="text-3xl md:text-4xl font-light text-white mb-3">{newsUi.title}</h1>
            <p className="text-white/60 font-light text-sm">{newsUi.subtitle}</p>
          </div>
        </div>
      </section>

      <section className="bg-background border-b border-border">
        <div className="container mx-auto px-6 md:px-16 py-6">
          <div className="relative max-w-md mb-5">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={newsUi.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[42px] pl-10 pr-4 py-2.5 bg-[rgba(204,186,173,0.5)] border border-transparent rounded-[10px] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2.5">
            {filterOptions.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setActiveFilter(opt.key)}
                className={`px-5 min-h-12 md:min-h-0 py-3 md:py-2 rounded-full text-xs font-light border transition-all ${
                  activeFilter === opt.key
                    ? "bg-brand-dark text-[#f1ebe4] border-brand-dark"
                    : "bg-white text-brand-dark border-brand-dark/20 hover:border-brand-dark/35"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-10 md:py-16">
        <div className="container mx-auto px-6 md:px-16">
          {featuredTop.length > 0 && (
            <div className="mb-12 md:mb-16">
              <div className="grid md:grid-cols-2 gap-4 md:gap-5">
                {featuredTop.map((article) => (
                  <FeaturedCard
                    key={article.slug}
                    article={article}
                    readMoreLabel={newsUi.readMoreLabel}
                    categoryLabel={getCategoryLabel(article.category)}
                    newsPath={newsPath}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-x-8 md:gap-y-10">
                {visibleRest.map((article) => (
                  <ArticleCard
                    key={article.slug}
                    article={article}
                    categoryLabel={getCategoryLabel(article.category)}
                    newsPath={newsPath}
                    dateLocale={dateLocale}
                  />
                ))}
              </div>
            </>
          )}

          {hasMore && (
            <div ref={loaderRef} className="flex justify-center py-10">
              {isLoading && (
                <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
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
