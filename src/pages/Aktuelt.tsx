import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
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
  link?: string;
}

const articles: Article[] = [
  {
    slug: "robotassistert-overvektskirurgi",
    title: "Robotassistert overvektskirurgi – presisjon, trygghet og varige resultater",
    excerpt: "CMedical tilbyr nå robotassistert overvektskirurgi med da Vinci-teknologi. Denne avanserte metoden gir høyere presisjon, mindre arr og raskere rekonvalesens.",
    image: pdf1Treatment1,
    date: "2026-02-15",
    category: "Teknologi",
    featured: true,
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
    category: "Fagartikkel",
  },
  {
    slug: "kvinnehelse-helhetlig-tilnaerming",
    title: "Kvinnehelse krever en helhetlig tilnærming",
    excerpt: "Gynekolog, psykolog og ernæringsfysiolog samarbeider tett for å gi kvinner den beste omsorgen gjennom alle livsfaser.",
    image: gynecologyHero,
    date: "2025-12-15",
    category: "Fagartikkel",
    link: "/kvinnehelse",
  },
];

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" });
};

const Aktuelt = ({ isChatOpen }: AktueltProps) => {
  useEffect(() => {
    document.title = "Aktuelt | CMedical";
  }, []);

  const featured = articles.filter((a) => a.featured);
  const rest = articles.filter((a) => !a.featured);

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

      {/* Featured articles */}
      <section className="bg-background py-10 md:py-16">
        <div className="container mx-auto px-6 md:px-16">
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {featured.map((article) => (
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
                  <div className="absolute top-4 left-4">
                    <span className="bg-brand-dark/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                      {article.category}
                    </span>
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

          {/* Rest of articles */}
          <h2 className="text-lg font-medium text-foreground mb-6">Flere artikler</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {rest.map((article) => (
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
        </div>
      </section>
    </PageLayout>
  );
};

export default Aktuelt;
