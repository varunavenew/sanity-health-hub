import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { useSmartSearch } from "@/hooks/useSmartSearch";

interface NotFoundProps {
  isChatOpen?: boolean;
}

/** Most sought-after destinations, shown as pills. */
const SUGGESTIONS = [
  { label: "Gynekologi", href: "/behandlinger/gynekologi", match: ["gynekologi", "kvinnehelse", "underliv"] },
  { label: "Fertilitet", href: "/fertilitet", match: ["fertilitet", "ivf", "inseminasjon", "egg"] },
  { label: "Urologi", href: "/behandlinger/urologi", match: ["urologi", "prostata", "urin"] },
  { label: "Priser", href: "/priser", match: ["pris", "priser", "kostnad", "betaling"] },
  { label: "Spesialister", href: "/spesialister", match: ["spesialist", "lege", "behandler", "team"] },
  { label: "Bestill time", href: "/booking", match: ["booking", "bestill", "time", "timebestilling"] },
];

const PHONE = "22 44 40 00";

const NotFound = ({ isChatOpen = false }: NotFoundProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { results } = useSmartSearch(query, 5);

  useEffect(() => {
    // Soft signal for analytics — not user-visible
    console.warn("[404] Ukjent sti:", location.pathname);
  }, [location.pathname]);

  // Reorder suggestions so a category detected in the broken URL comes first.
  const suggestions = useMemo(() => {
    const path = location.pathname.toLowerCase();
    const hit = SUGGESTIONS.find((s) => s.match.some((m) => path.includes(m)));
    if (!hit) return SUGGESTIONS;
    return [hit, ...SUGGESTIONS.filter((s) => s !== hit)];
  }, [location.pathname]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) navigate(results[0].path);
  };

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title="Denne siden har fått nytt hjem | CMedical"
        description="Vi har nylig lansert ny nettside, og noe innhold har flyttet på seg. Søk eller gå videre til gynekologi, fertilitet, urologi, priser, spesialister og booking."
        canonical="/404"
        noIndex
      />

      <section className="bg-brand-light min-h-[calc(100svh-var(--header-h,80px))] flex items-center">
        <div className="w-full px-6 md:px-16 lg:px-20 py-16 md:py-20">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-light leading-[1.08] text-foreground mb-4 md:mb-5">
              Denne siden har fått nytt hjem
            </h1>
            <p className="text-base font-light text-muted-foreground leading-relaxed max-w-lg">
              Vi har nylig lansert ny nettside, og noe innhold har flyttet på seg.
              La oss hjelpe deg videre.
            </p>

            {/* Søk */}
            <form onSubmit={handleSubmit} className="mt-8 md:mt-10 max-w-md" role="search">
              <label htmlFor="nf-search" className="sr-only">
                Hva leter du etter?
              </label>
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/60"
                  aria-hidden="true"
                />
                <input
                  id="nf-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Hva leter du etter?"
                  autoComplete="off"
                  className="w-full rounded-[10px] border border-brand-dark/25 bg-background pl-11 pr-4 py-3.5 text-base font-light text-foreground placeholder:text-foreground/60 outline-none focus:border-brand-dark/40 transition-colors"
                />
              </div>

              {query.trim().length > 1 && results.length > 0 && (
                <ul className="mt-2 rounded-[10px] border border-brand-dark/20 bg-background overflow-hidden">
                  {results.slice(0, 5).map((r) => (
                    <li key={r.path}>
                      <Link
                        to={r.path}
                        className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-brand-light transition-colors"
                      >
                        <span className="text-sm font-light text-foreground">{r.label}</span>
                        <ArrowRight className="w-4 h-4 text-foreground/55 flex-shrink-0" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </form>

            {/* Forslag */}
            <div className="mt-6 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <Link
                  key={s.href}
                  to={s.href}
                  className="rounded-[10px] border border-brand-dark/25 bg-background px-4 py-2 text-sm font-light text-foreground hover:border-brand-dark/60 transition-colors"
                >
                  {s.label}
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-3">
              <Button asChild variant="cta" size="lg" className="px-8">
                <Link to="/booking">Bestill time</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 border-brand-dark/40 text-foreground hover:bg-brand-dark/5"
              >
                <a href={`tel:+47${PHONE.replace(/\s/g, "")}`}>Ring oss {PHONE}</a>
              </Button>
            </div>

            {/* Stille fotnote */}
            <p className="mt-10 text-xs font-light text-muted-foreground">
              Kom du hit fra en lenke?{" "}
              <Link to="/kontakt" className="underline underline-offset-2 hover:text-foreground">
                Si gjerne ifra til oss
              </Link>
              , så fikser vi den.
            </p>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default NotFound;
