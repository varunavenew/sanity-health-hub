import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { SoMeFeed } from "@/components/homepage/SoMeFeed";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Calendar, Search, Loader2 } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import {
  articles as staticArticles,
  filterCategories,
  normalizeCategory,
  type Article,
} from "@/data/articles";
import { useArticles, useSpecialists } from "@/hooks/useSanity";

interface AktueltProps {
  isChatOpen: boolean;
}

const ARTICLES_PER_PAGE = 9;

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" });
};

const readingTime = (text: string) => {
  const words = (text || "").split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 180) + 2);
};

// Editorial lead — full-bleed split with oversized typography
const LeadArticle = ({ article, eager = false }: { article: Article; eager?: boolean }) => {
  const linkTo = article.externalUrl || `/aktuelt/${article.slug}`;
  return (
    <Link to={linkTo} className="group block">
      <div className="grid md:grid-cols-12 gap-6 md:gap-10 items-stretch">
        <div className="md:col-span-7 relative overflow-hidden rounded-sm bg-secondary">
          <div className="aspect-[16/11] md:aspect-[5/4]">
            <img
              src={article.image}
              alt={article.title}
              loading={eager ? "eager" : "lazy"}
              className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-[1200ms] ease-out"
            />
          </div>
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="bg-background/90 backdrop-blur text-foreground text-xs px-2.5 py-1 rounded-full">
              {article.category}
            </span>
            <span className="bg-brand-dark text-white text-xs px-2.5 py-1 rounded-full">
              Utvalgt
            </span>
          </div>
        </div>
        <div className="md:col-span-5 flex flex-col justify-center">
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
            <span className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{formatDate(article.date)}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
            <span>{readingTime(article.excerpt)} min lesing</span>
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-light text-foreground leading-[1.1] tracking-tight mb-5 group-hover:text-foreground/80 transition-colors">
            {article.title}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed mb-6 line-clamp-4">
            {article.excerpt}
          </p>
          <span className="inline-flex items-center gap-2 text-sm text-foreground font-medium group-hover:gap-3 transition-all">
            Les artikkelen <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
};

// Bento card — three sizes (large, wide, standard) for editorial rhythm
const BentoCard = ({
  article,
  size = "standard",
}: {
  article: Article;
  size?: "large" | "wide" | "standard" | "tall" | "text";
}) => {
  const linkTo = article.externalUrl || `/aktuelt/${article.slug}`;
  const sizeClasses: Record<string, string> = {
    large: "md:col-span-6 md:row-span-2",
    wide: "md:col-span-4",
    tall: "md:col-span-3 md:row-span-2",
    standard: "md:col-span-3",
    text: "md:col-span-3 bg-brand-light",
  };
  const aspect: Record<string, string> = {
    large: "aspect-[4/5]",
    wide: "aspect-[16/10]",
    tall: "aspect-[3/5]",
    standard: "aspect-[4/3]",
    text: "aspect-[4/3]",
  };

  if (size === "text") {
    return (
      <Link
        to={linkTo}
        className={`group block ${sizeClasses[size]} rounded-sm bg-brand-light p-6 flex flex-col justify-between hover:bg-brand-mid/30 transition-colors`}
      >
        <div>
          <span className="text-xs text-foreground/60">{article.category}</span>
          <h3 className="text-lg md:text-xl font-light text-foreground leading-snug mt-3 group-hover:text-foreground/80 transition-colors">
            {article.title}
          </h3>
        </div>
        <div className="flex items-center justify-between mt-6">
          <span className="text-xs text-foreground/60">{formatDate(article.date)}</span>
          <ArrowUpRight className="w-4 h-4 text-foreground/70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </Link>
    );
  }

  return (
    <Link to={linkTo} className={`group block ${sizeClasses[size]}`}>
      <div className={`relative overflow-hidden rounded-sm bg-secondary ${aspect[size]}`}>
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-700 ease-out"
        />
        {/* Hover-reveal overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
        <div className="absolute top-3 left-3">
          <span className="bg-background/85 backdrop-blur text-foreground text-[11px] px-2 py-0.5 rounded-full">
            {article.category}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
          <p className="text-[11px] text-white/70 mb-1.5">{formatDate(article.date)}</p>
          <h3
            className={`text-white font-light leading-snug ${
              size === "large" ? "text-xl md:text-2xl" : "text-sm md:text-base"
            }`}
          >
            {article.title}
          </h3>
          <p className="text-white/70 text-xs font-light line-clamp-2 mt-2 max-h-0 opacity-0 group-hover:max-h-24 group-hover:opacity-100 transition-all duration-500 overflow-hidden">
            {article.excerpt}
          </p>
        </div>
      </div>
    </Link>
  );
};

// Compact row item for the "Flere artikler" list
const ArticleRow = ({ article }: { article: Article }) => {
  const linkTo = article.externalUrl || `/aktuelt/${article.slug}`;
  return (
    <Link to={linkTo} className="group grid grid-cols-[120px_1fr] md:grid-cols-[180px_1fr] gap-4 md:gap-6 py-5 border-b border-border last:border-b-0">
      <div className="aspect-[4/3] overflow-hidden rounded-sm bg-secondary">
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-1.5">
          <span>{article.category}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
          <span>{formatDate(article.date)}</span>
        </div>
        <h3 className="text-sm md:text-base font-medium text-foreground leading-snug group-hover:text-foreground/70 transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-xs text-muted-foreground font-light line-clamp-2 mt-1.5 hidden md:block">
          {article.excerpt}
        </p>
      </div>
    </Link>
  );
};

const Aktuelt = ({ isChatOpen }: AktueltProps) => {
  const { data: sanityArticles } = useArticles();
  const { data: specialists } = useSpecialists();
  const [activeFilter, setActiveFilter] = useState("Alle");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const articles: Article[] = useMemo(() => {
    const source = sanityArticles && sanityArticles.length > 0
      ? sanityArticles.map((a) => ({
          slug: a.slug,
          title: a.title,
          excerpt: a.excerpt,
          image: a.image,
          date: a.date,
          category: a.category,
          pinned: a.pinned,
          featured: a.featured,
        }))
      : staticArticles;
    return source.map((a) => ({ ...a, category: normalizeCategory(a.category) }));
  }, [sanityArticles]);

  useEffect(() => {
    document.title = "Aktuelt | CMedical";
  }, []);

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

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const explicitlyFeatured = sortedArticles.filter((a) => a.featured);
  const featuredPool = explicitlyFeatured.length > 0 ? explicitlyFeatured : sortedArticles;
  const lead = featuredPool[0];
  const bentoArticles = featuredPool.slice(1, 7); // up to 6 in bento
  const usedSlugs = new Set([lead?.slug, ...bentoArticles.map((a) => a.slug)].filter(Boolean));
  const restArticles = sortedArticles.filter((a) => !usedSlugs.has(a.slug));
  const visibleRest = restArticles.slice(0, visibleCount);
  const hasMore = visibleCount < restArticles.length;

  // Category counts for sidebar
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = { Alle: articles.length };
    articles.forEach((a) => {
      map[a.category] = (map[a.category] || 0) + 1;
    });
    return map;
  }, [articles]);

  // Bento layout pattern — varied tile sizes for editorial rhythm
  const bentoSizes: Array<"large" | "wide" | "tall" | "standard" | "text"> = [
    "large",
    "wide",
    "standard",
    "standard",
    "wide",
    "standard",
  ];

  const featuredSpecialists = useMemo(() => {
    if (!specialists?.length) return [];
    if (activeFilter === "Alle") return specialists.slice(0, 4);
    const needle = activeFilter.toLowerCase();
    const matches = specialists.filter((s) => {
      const hay = [s.category, s.title, ...(s.expertise || [])].join(" ").toLowerCase();
      return hay.includes(needle);
    });
    return (matches.length ? matches : specialists).slice(0, 4);
  }, [specialists, activeFilter]);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
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
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  // Latest 3 articles for the "Siste nytt" sidebar widget
  const latestThree = useMemo(
    () =>
      [...articles]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 3),
    [articles]
  );

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title="Aktuelt – Nyheter og fagartikler"
        description="Hold deg oppdatert på det siste innen medisin og nyheter fra CMedical. Fagartikler, nyheter og innsikt fra våre spesialister."
        canonical="/aktuelt"
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Aktuelt", path: "/aktuelt" },
        ]}
      />

      {/* Editorial masthead */}
      <section className="bg-background pt-24 pb-8 md:pt-28 md:pb-10 border-b border-border">
        <div className="container mx-auto px-6 md:px-16">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="text-xs text-muted-foreground tracking-wide mb-2">
                Magasinet · Utgave {new Date().getFullYear()}
              </p>
              <h1 className="text-4xl md:text-6xl font-light text-foreground tracking-tight">
                Aktuelt
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-light mt-3 max-w-xl">
                Pasienthistorier, fagartikler og nyheter fra spesialistene som former norsk kvinne- og familiehelse.
              </p>
            </div>
            <div className="text-xs text-muted-foreground hidden md:block">
              <span className="block">{articles.length} artikler</span>
              <span className="block mt-0.5">Oppdatert {formatDate(new Date().toISOString())}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Lead story */}
      {lead && (
        <section className="bg-background py-10 md:py-16">
          <div className="container mx-auto px-6 md:px-16">
            <LeadArticle article={lead} eager />
          </div>
        </section>
      )}

      {/* Bento grid of featured */}
      {bentoArticles.length > 0 && (
        <section className="bg-brand-light/40 py-12 md:py-16">
          <div className="container mx-auto px-6 md:px-16">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Redaksjonens utvalg</p>
                <h2 className="text-xl md:text-2xl font-light text-foreground">Det vi leser nå</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 md:auto-rows-[180px] gap-3 md:gap-4">
              {bentoArticles.map((a, i) => (
                <BentoCard key={a.slug} article={a} size={bentoSizes[i] || "standard"} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Archive: sticky sidebar filter + article rows */}
      <section className="bg-background py-12 md:py-20">
        <div className="container mx-auto px-6 md:px-16">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            {/* Sticky sidebar */}
            <aside className="md:col-span-3">
              <div className="md:sticky md:top-28 space-y-8">
                {/* Search */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Søk</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Søk artikler..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-transparent border-b border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                    />
                  </div>
                </div>

                {/* Categories as editorial list */}
                <div>
                  <p className="text-xs text-muted-foreground mb-3">Kategorier</p>
                  <ul className="space-y-1">
                    {filterCategories.map((cat) => {
                      const isActive = activeFilter === cat;
                      const count = categoryCounts[cat] || 0;
                      return (
                        <li key={cat}>
                          <button
                            onClick={() => setActiveFilter(cat)}
                            className={`w-full flex items-baseline justify-between gap-3 py-1.5 text-left text-sm transition-colors ${
                              isActive
                                ? "text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span
                                className={`inline-block w-1.5 h-1.5 rounded-full transition-colors ${
                                  isActive ? "bg-foreground" : "bg-transparent"
                                }`}
                              />
                              {cat}
                            </span>
                            <span className="text-[11px] tabular-nums opacity-60">
                              {count}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Latest widget */}
                <div className="hidden md:block">
                  <p className="text-xs text-muted-foreground mb-3">Siste nytt</p>
                  <ul className="space-y-3">
                    {latestThree.map((a) => (
                      <li key={a.slug}>
                        <Link
                          to={a.externalUrl || `/aktuelt/${a.slug}`}
                          className="group block"
                        >
                          <p className="text-xs text-muted-foreground mb-0.5">
                            {formatDate(a.date)}
                          </p>
                          <p className="text-sm text-foreground font-light leading-snug group-hover:text-foreground/70 transition-colors line-clamp-2">
                            {a.title}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            {/* Main: article rows */}
            <div className="md:col-span-9">
              <div className="flex items-baseline justify-between mb-4 pb-4 border-b border-border">
                <h2 className="text-lg md:text-xl font-light text-foreground">
                  {activeFilter === "Alle" ? "Arkiv" : activeFilter}
                </h2>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {filteredArticles.length} {filteredArticles.length === 1 ? "artikkel" : "artikler"}
                </span>
              </div>

              {visibleRest.length > 0 ? (
                <div>
                  {visibleRest.map((article) => (
                    <ArticleRow key={article.slug} article={article} />
                  ))}
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-muted-foreground font-light">
                    Ingen artikler funnet for dette filteret.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground font-light py-8">
                  Alle utvalgte artikler vises over.
                </p>
              )}

              {hasMore && (
                <div ref={loaderRef} className="flex justify-center py-10">
                  {isLoading && (
                    <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured specialists per category */}
      {featuredSpecialists.length > 0 && (
        <section className="bg-brand-light/40 border-t border-border">
          <div className="container mx-auto px-6 md:px-16 py-12 md:py-16">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  {activeFilter === "Alle" ? "Møt teamet" : `Innen ${activeFilter.toLowerCase()}`}
                </p>
                <h2 className="text-lg md:text-xl font-light text-foreground">
                  Spesialister du kan bestille time hos
                </h2>
              </div>
              <Link
                to="/spesialister"
                className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
              >
                Se alle <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {featuredSpecialists.map((s) => (
                <Link
                  key={s.slug || s.name}
                  to={`/spesialister/${s.slug}`}
                  className="group block"
                >
                  <div className="aspect-[3/4] bg-secondary rounded-sm overflow-hidden mb-3">
                    {s.image ? (
                      <img
                        src={s.image}
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

      {/* SoMe preview */}
      <section className="bg-background border-t border-border">
        <div className="container mx-auto px-6 md:px-16 py-10 md:py-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-light text-foreground">Følg oss på sosiale medier</h2>
          </div>
          <SoMeFeed maxPosts={4} compact />
        </div>
      </section>
    </PageLayout>
  );
};

export default Aktuelt;
