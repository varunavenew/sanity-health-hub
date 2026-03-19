import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Search, Loader2 } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { articles as staticArticles, filterCategories, type Article } from "@/data/articles";
import { useArticles } from "@/hooks/useSanity";

interface AktueltProps {
  isChatOpen: boolean;
}

const ARTICLES_PER_PAGE = 6;

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" });
};

const ArticleCard = ({ article }: { article: Article }) => {
  const linkTo = article.externalUrl || `/aktuelt/${article.slug}`;

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
            {article.category}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
        <Calendar className="w-3 h-3" />
        {formatDate(article.date)}
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

const FeaturedCard = ({ article }: { article: Article }) => {
  const linkTo = article.externalUrl || `/aktuelt/${article.slug}`;

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
          {article.category}
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
            {formatDate(article.date)}
          </span>
          <span className="inline-flex items-center gap-1 text-white/90 text-xs font-medium group-hover:gap-2 transition-all">
            Les mer <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
};

const Aktuelt = ({ isChatOpen }: AktueltProps) => {
  const { data: sanityArticles } = useArticles();
  const [activeFilter, setActiveFilter] = useState("Alle");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Use Sanity data if available, otherwise fall back to static
  const articles: Article[] = useMemo(() => {
    if (sanityArticles && sanityArticles.length > 0) {
      return sanityArticles.map((a) => ({
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        image: a.image,
        date: a.date,
        category: a.category,
        pinned: a.pinned,
        featured: a.featured,
      }));
    }
    return staticArticles;
  }, [sanityArticles]);

  useEffect(() => {
    document.title = "Aktuelt | CMedical";
  }, []);

  // Reset visible count when filter/search changes
  useEffect(() => {
    setVisibleCount(ARTICLES_PER_PAGE);
  }, [activeFilter, searchQuery]);

  const filteredArticles = articles.filter((a) => {
    const matchesFilter = activeFilter === "Alle" || a.category === activeFilter;
    const matchesSearch =
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pinned first, then by date
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const pinnedArticles = sortedArticles.filter((a) => a.pinned);
  const restArticles = sortedArticles.filter((a) => !a.pinned);
  const visibleRest = restArticles.slice(0, visibleCount);
  const hasMore = visibleCount < restArticles.length;

  // Infinite scroll via IntersectionObserver
  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    // Small delay for UX feel
    setTimeout(() => {
      setVisibleCount((prev) => prev + ARTICLES_PER_PAGE);
      setIsLoading(false);
    }, 400);
  }, [hasMore, isLoading]);

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

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title="Aktuelt – Nyheter og fagartikler"
        description="Hold deg oppdatert på det siste innen medisin, teknologi og nyheter fra CMedical. Fagartikler, nyheter og innsikt fra våre spesialister."
        canonical="/aktuelt"
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Aktuelt", path: "/aktuelt" },
        ]}
      />
      {/* Hero */}
      <section className="bg-brand-dark pt-24 pb-10 md:pt-28 md:pb-14">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-2xl">
            <p className="text-white/50 text-xs mb-2">Nyheter & Fagartikler</p>
            <h1 className="text-3xl md:text-4xl font-light text-white mb-3">Aktuelt</h1>
            <p className="text-white/60 font-light text-sm">
              Hold deg oppdatert på det siste innen medisin, teknologi og nyheter fra CMedical.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-background border-b border-border">
        <div className="container mx-auto px-6 md:px-16 py-6">
          <div className="relative max-w-md mb-5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Søk i artikler..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {filterCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
                  activeFilter === cat
                    ? "bg-brand-dark text-white"
                    : "bg-secondary/60 text-foreground/70 hover:bg-secondary hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="bg-background py-10 md:py-16">
        <div className="container mx-auto px-6 md:px-16">
          {/* Featured hero layout */}
          {pinnedArticles.length > 0 && (
            <div className="mb-16">
              <div className="grid md:grid-cols-2 gap-4">
                {pinnedArticles.slice(0, 4).map((article) => (
                  <FeaturedCard key={article.slug} article={article} />
                ))}
              </div>
            </div>
          )}

          {/* Rest of articles */}
          {visibleRest.length > 0 && (
            <>
              <h2 className="text-lg font-medium text-foreground mb-6">Flere artikler</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {visibleRest.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
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
              <p className="text-muted-foreground font-light">Ingen artikler funnet for dette filteret.</p>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default Aktuelt;
