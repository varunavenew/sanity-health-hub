"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { SoMeFeed } from "@/components/homepage/SoMeFeed";
import { Link } from "@/lib/router";
import { ArrowRight, Calendar, Search, Loader2 } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { buildMedicalWebPageGeoJsonLd } from "@/lib/seo/geo-page";
import { normalizeCategory, type Article } from "@/data/articles";
import { useArticles, useNewsPage, useSpecialists } from "@/hooks/useSanity";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { useParams } from "@/lib/router";
import { assetSrc } from "@/lib/media";
import { withLocalePath, type AppLocale } from "@/lib/i18n/routing";
import { useNavCmsPath } from "@/hooks/useNavCmsPath";
import { getImageUrl } from "@/lib/sanity/image-url";

interface AktueltProps {
  isChatOpen: boolean;
}

type RawNewsFilter = {
  key?: unknown;
  label?: unknown;
  acceptedArticleCategories?: unknown;
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
        <img
          src={article.image}
          alt={article.title}
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
      <h3 className="text-sm font-medium text-foreground group-hover:text-foreground/80 transition-colors mb-1 leading-snug">
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
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
        <span className="inline-block bg-white/15 backdrop-blur-md text-white text-xs px-2.5 py-0.5 rounded-full mb-2">
          {categoryLabel}
        </span>
        <h3 className="text-base md:text-lg font-medium text-white leading-snug mb-2 line-clamp-2">
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

const Aktuelt = ({ isChatOpen }: AktueltProps) => {
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "en" ? "en" : "nb";
  const routeLocale: AppLocale = params?.locale === "en" ? "en" : "no";
  const dateLocale = routeLocale === "en" ? "en-GB" : "nb-NO";
  const { data: sanityArticles } = useArticles();
  const { data: newsPage } = useNewsPage();
  const { data: specialists } = useSpecialists();
  const specialistsPath = useNavCmsPath("specialists");
  const [activeFilter, setActiveFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const articles: Article[] = useMemo(() => {
    const source = (sanityArticles || []).map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      image: a.image,
      date: a.date,
      category: a.category,
    }));
    return source.map((a) => ({ ...a, category: normalizeCategory(a.category) }));
  }, [sanityArticles]);

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
  const pageSize =
    typeof newsPage?.listSize === "number" && newsPage.listSize > 0
      ? newsPage.listSize
      : 0;
  const allFilterKey = filterOptions[0]?.key || "";
  const newsPath = newsPage?.slug
    ? withLocalePath(routeLocale, `/${newsPage.slug}`)
    : "";

  // Reset visible count when filter/search changes
  useEffect(() => {
    if (
      allFilterKey &&
      !filterOptions.some((filter) => filter.key === activeFilter)
    ) {
      setActiveFilter(allFilterKey);
    }
    setVisibleCount(pageSize);
  }, [activeFilter, allFilterKey, filterOptions, searchQuery, pageSize]);

  const filteredArticles = articles.filter((a) => {
    const matchesFilter =
      (filterOptions.find((filter) => filter.key === activeFilter)
        ?.acceptedArticleCategories.length ?? 0) === 0 ||
      filterOptions
        .find((filter) => filter.key === activeFilter)
        ?.acceptedArticleCategories.includes(a.category);
    const matchesSearch =
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sortedArticles = [...filteredArticles].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // Top grid: editor picks on newsPage, otherwise latest four articles.
  const manualFeatured = ((newsPage?.featuredArticles || []) as Article[])
    .map((a) => ({ ...a, category: normalizeCategory(a.category || "") }))
    .filter((a) => a?.slug);
  const featuredTop =
    activeFilter === allFilterKey && manualFeatured.length > 0
      ? manualFeatured.slice(0, 4)
      : sortedArticles.slice(0, 4);
  const featuredSlugs = new Set(featuredTop.map((a) => a.slug));
  const restArticles = sortedArticles.filter((a) => !featuredSlugs.has(a.slug));
  const visibleRest = restArticles.slice(0, visibleCount);
  const hasMore = visibleCount < restArticles.length;

  // Featured specialists per active category — surface relevant experts
  // when user filters by a specific topic (e.g. fertility article filter shows
  // fertility specialists). Falls back to top 4 across all when on "Alle".
  const featuredSpecialists = useMemo(() => {
    if (!specialists?.length) return [];
    if (activeFilter === allFilterKey) {
      return specialists.slice(0, 4);
    }
    // Heuristic mapping: try to match active filter against specialist
    // category/expertise. Article categories are editorial, specialist
    // categories are clinical — we surface anyone whose expertise text
    // overlaps with the filter label.
    const filterCategories =
      filterOptions.find((filter) => filter.key === activeFilter)
        ?.acceptedArticleCategories || [];
    const needle = (filterCategories[0] || "").toLowerCase();
    const matches = specialists.filter((s) => {
      const hay = [
        s.category,
        s.title,
        ...(s.expertise || []),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
    return (matches.length ? matches : specialists).slice(0, 4);
  }, [specialists, activeFilter, allFilterKey, filterOptions]);

  const newsUi = {
    label: newsPage?.label || "",
    title: newsPage?.title || "",
    subtitle: newsPage?.subtitle || "",
    searchPlaceholder: newsPage?.searchPlaceholder || "",
    moreArticlesTitle: newsPage?.moreArticlesTitle || "",
    noArticlesText: newsPage?.noArticlesText || "",
    readMoreLabel: newsPage?.readMoreLabel || "",
    specialistsEyebrowAll: newsPage?.specialistsEyebrowAll || "",
    specialistsEyebrowWithin: newsPage?.specialistsEyebrowWithin || "",
    specialistsTitle: newsPage?.specialistsTitle || "",
    specialistsSeeAllLabel: newsPage?.specialistsSeeAllLabel || "",
    socialSectionTitle: newsPage?.socialSectionTitle || "",
  };

  const socialPostLimit = newsPage?.socialPostLimit ?? 0;
  const socialMode = newsPage?.socialMode as "cms" | "api" | "hidden" | undefined;
  const showSocialSection = Boolean(socialMode && socialMode !== "hidden");
  const socialSectionPosts = useMemo(() => {
    if (!showSocialSection || !Array.isArray(newsPage?.socialPosts)) return [];

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
        image: post.imageUrl || post.image || "",
        caption: post.caption,
        postUrl: post.postUrl,
        alt: post.alt,
      }))
      .filter((post) => Boolean(post.image));
  }, [newsPage?.socialPosts, socialPostLimit, showSocialSection]);
  const getCategoryLabel = (category: string) =>
    filterOptions.find((filter) =>
      filter.acceptedArticleCategories.includes(normalizeCategory(category)),
    )?.label || category;

  // Infinite scroll via IntersectionObserver
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
      { rootMargin: "200px" }
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
      {/* Hero */}
      <section className="bg-brand-dark pt-24 pb-10 md:pt-28 md:pb-14">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-2xl">
            <p className="text-white/50 text-xs mb-2">{newsUi.label}</p>
            <h1 className="text-3xl md:text-4xl font-light text-white mb-3">{newsUi.title}</h1>
            <p className="text-white/60 font-light text-sm">
              {newsUi.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters (no SoMe — that lives further down the page) */}
      <section className="bg-background border-b border-border">
        <div className="container mx-auto px-6 md:px-16 py-6">
          <div className="relative max-w-md mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={newsUi.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2.5">
            {filterOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setActiveFilter(opt.key)}
                className={`px-5 py-2 rounded-full text-xs md:text-sm font-light border transition-all ${
                  activeFilter === opt.key
                    ? "bg-brand-dark text-white border-brand-dark"
                    : "bg-white text-foreground/80 border-foreground/15 hover:border-foreground/30 hover:text-foreground"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="bg-background py-10 md:py-16">
        <div className="container mx-auto px-6 md:px-16">
          {/* Top 4 featured */}
          {featuredTop.length > 0 && (
            <div className="mb-16">
              <div className="grid md:grid-cols-2 gap-4">
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

          {/* Rest of articles, sorted by date */}
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
                    newsPath={newsPath}
                    dateLocale={dateLocale}
                  />
                ))}
              </div>
            </>
          )}

          {/* Infinite scroll trigger */}
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

      {/* Featured specialists per category */}
      {featuredSpecialists.length > 0 && (
        <section className="bg-secondary/40 border-t border-border">
          <div className="container mx-auto px-6 md:px-16 py-12 md:py-16">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  {activeFilter === allFilterKey
                    ? newsUi.specialistsEyebrowAll
                    : newsUi.specialistsEyebrowWithin.replace(
                        "{{category}}",
                        (
                          filterOptions.find((f) => f.key === activeFilter)?.label ||
                          ""
                        ).toLowerCase(),
                      )}
                </p>
                <h2 className="text-lg md:text-xl font-medium text-foreground">
                  {newsUi.specialistsTitle}
                </h2>
              </div>
              <Link
                to={specialistsPath}
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                {newsUi.specialistsSeeAllLabel} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredSpecialists.map((s) => (
                <Link
                  key={s.slug || s.name}
                  to={`${specialistsPath}/${s.slug}`}
                  className="group block"
                >
                  <div className="aspect-[3/4] bg-secondary rounded-sm overflow-hidden mb-3">
                    {s.image ? (
                      <img
                        src={assetSrc(s.image)}
                        alt={s.name}
                        loading="lazy"
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : null}
                  </div>
                  <p className="text-sm font-medium text-foreground leading-snug">{s.name}</p>
                  {s.title && (
                    <p className="text-xs text-muted-foreground font-light mt-0.5 line-clamp-1">
                      {s.title}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {showSocialSection ? (
        <section className="bg-background border-t border-border">
          <div className="container mx-auto px-6 md:px-16 py-10 md:py-14">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-foreground">
                {newsUi.socialSectionTitle}
              </h2>
            </div>
            <SoMeFeed
              maxPosts={socialPostLimit}
              compact
              posts={socialSectionPosts}
              sourceMode={socialMode === "hidden" ? undefined : socialMode}
            />
          </div>
        </section>
      ) : null}
      <PageSectionsRenderer sections={newsPage?.pageSections} />
    </PageLayout>
  );
};

export default Aktuelt;
