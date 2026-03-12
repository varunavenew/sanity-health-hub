import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar, Search } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import heroFamily from "@/assets/hero/hero-family.jpg";
import pdf1Treatment1 from "@/assets/hero/pdf1-treatment1.jpg";
import clinicImage from "@/assets/hero/cmedical-clinic.jpg";
import fertilityHero from "@/assets/hero/fertility-hero.jpg";
import gynecologyHero from "@/assets/hero/gynecology-hero.jpg";

interface AktueltProps {
  isChatOpen: boolean;
}

interface Article {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category: string;
  featured?: boolean;
  pinned?: boolean;
  link?: string;
}

const filterCategories = ["Alla", "Pasienthistorier", "Oss i media", "Fagartiklar", "Nyheter", "Teknologi"];

const articles: Article[] = [
  {
    slug: "robotassistert-overvektskirurgi",
    title: "Robotassistert overvektskirurgi – presisjon, trygghet og varige resultater",
    excerpt: "CMedical tilbyr nå robotassistert overvektskirurgi med da Vinci-teknologi. Denne avanserte metoden gir høyere presisjon, mindre arr og raskere rekonvalesens.",
    image: pdf1Treatment1,
    date: "2026-02-15",
    category: "Teknologi",
    featured: true,
    pinned: true,
    link: "/robotassistert-kirurgi",
  },
  {
    slug: "livio-oslo-del-av-cmedical",
    title: "Livio Oslo blir en del av CMedical – et styrket tilbud til pasientene",
    excerpt: "Med sammenslåingen av Livio Oslo og CMedical styrkes det tverrfaglige tilbudet innen fertilitet og kvinnehelse betraktelig.",
    image: heroFamily,
    date: "2026-02-01",
    category: "Nyheter",
    featured: true,
    pinned: true,
    link: "/tverrfaglige-team",
  },
  {
    slug: "ny-klinikk-utvidelse",
    title: "CMedical utvider – ny klinikk åpner i Bergen",
    excerpt: "For å imøtekomme økende etterspørsel åpner CMedical en ny klinikk i Bergen sentrum med fokus på gynekologi og fertilitet.",
    image: clinicImage,
    date: "2026-01-20",
    category: "Nyheter",
  },
  {
    slug: "ivf-behandling-nye-metoder",
    title: "Nye metoder innen IVF-behandling gir bedre resultater",
    excerpt: "Vårt fertilitetsteam har implementert nye embryoseleksjonsmetoder som viser lovende resultater for par som ønsker å bli gravide.",
    image: fertilityHero,
    date: "2026-01-10",
    category: "Fagartiklar",
  },
  {
    slug: "kvinnehelse-helhetlig-tilnaerming",
    title: "Kvinnehelse krever en helhetlig tilnærming",
    excerpt: "Gynekolog, psykolog og ernæringsfysiolog samarbeider tett for å gi kvinner den beste omsorgen gjennom alle livsfaser.",
    image: gynecologyHero,
    date: "2025-12-15",
    category: "Fagartiklar",
    link: "/kvinnehelse",
  },
];

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" });
};

const Aktuelt = ({ isChatOpen }: AktueltProps) => {
  const [activeFilter, setActiveFilter] = useState("Alla");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.title = "Aktuelt | CMedical";
  }, []);

  const filteredArticles = articles.filter((a) => {
    const matchesFilter = activeFilter === "Alla" || a.category === activeFilter;
    const matchesSearch = !searchQuery || 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pinned articles always come first
  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const pinnedArticles = sortedArticles.filter((a) => a.pinned);
  const restArticles = sortedArticles.filter((a) => !a.pinned);

  return (
    <PageLayout isChatOpen={isChatOpen}>
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
          {/* Search */}
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

          {/* Filter tabs */}
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
          {/* Pinned / Featured */}
          {pinnedArticles.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {pinnedArticles.map((article) => (
                <Link
                  key={article.slug}
                  to={article.link || `/aktuelt/${article.slug}`}
                  className="group"
                >
                  <div className="relative aspect-[16/10] rounded-sm overflow-hidden mb-4 bg-secondary">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-brand-dark/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                      {article.pinned && (
                        <span className="bg-accent/90 backdrop-blur-sm text-accent-foreground text-xs px-3 py-1 rounded-full">
                          Fremhevet
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Calendar className="w-3 h-3" />
                    {formatDate(article.date)}
                  </div>
                  <h2 className="text-lg md:text-xl font-medium text-foreground group-hover:text-foreground/80 transition-colors mb-2 leading-snug">
                    {article.title}
                  </h2>
                  <p className="text-sm text-muted-foreground font-light line-clamp-2">
                    {article.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm text-brand-dark font-medium mt-3 group-hover:gap-2 transition-all">
                    Les mer <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          )}

          {/* Rest of articles */}
          {restArticles.length > 0 && (
            <>
              <h2 className="text-lg font-medium text-foreground mb-6">Flere artikler</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {restArticles.map((article) => (
                  <Link
                    key={article.slug}
                    to={article.link || `/aktuelt/${article.slug}`}
                    className="group"
                  >
                    <div className="relative aspect-[16/10] rounded-sm overflow-hidden mb-3 bg-secondary">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-brand-dark/80 backdrop-blur-sm text-white text-[10px] px-2.5 py-0.5 rounded-full">
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
                ))}
              </div>
            </>
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
