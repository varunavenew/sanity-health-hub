import { useState, useMemo } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { priceCategories } from "@/data/priceList";
import { Search, Clock } from "lucide-react";

interface PageProps { isChatOpen: boolean }

const PRIORITIZED = ["gynekologi", "urologi", "fertilitet", "ortopedi"];

/**
 * Demo 3: Spotlight. To-kolonne med vertikal rail-navigasjon til venstre
 * og fokusert innhold til høyre. Inkluderer søk på tvers av alle priser.
 */
const PriserSpotlight = ({ isChatOpen }: PageProps) => {
  const ordered = useMemo(() => [
    ...priceCategories.filter(c => PRIORITIZED.includes(c.id))
      .sort((a, b) => PRIORITIZED.indexOf(a.id) - PRIORITIZED.indexOf(b.id)),
    ...priceCategories.filter(c => !PRIORITIZED.includes(c.id))
      .sort((a, b) => a.label.localeCompare(b.label, "nb")),
  ], []);

  const [active, setActive] = useState(ordered[0]?.id ?? "");
  const [query, setQuery] = useState("");

  const current = ordered.find(c => c.id === active) ?? ordered[0];

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const hits: { cat: string; sub: string; name: string; price: string }[] = [];
    for (const c of ordered) {
      for (const s of c.subcategories) {
        for (const it of s.items) {
          if (it.name.toLowerCase().includes(q)) {
            hits.push({ cat: c.label, sub: s.label, name: it.name, price: it.price });
          }
        }
      }
    }
    return hits.slice(0, 30);
  }, [query, ordered]);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <section className="bg-white min-h-screen">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl py-12">
          <div className="mb-8">
            <p className="text-xs text-muted-foreground font-light mb-2">Demo · Forslag 3</p>
            <h1 className="text-3xl md:text-4xl font-light text-brand-dark">Priser — spotlight</h1>
            <p className="text-sm text-muted-foreground font-light mt-2 max-w-xl">
              Vertikal navigasjon til venstre, fokusert prisliste til høyre. Søk på tvers av alle tjenester.
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-8 max-w-xl">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Søk i alle priser (f.eks. IVF, konisering, ultralyd)…"
              className="w-full pl-9 pr-4 py-2.5 text-sm font-light bg-brand-light/40 border border-brand-mid/20 rounded-md focus:outline-none focus:border-brand-dark"
            />
          </div>

          {searchResults ? (
            <div className="border border-brand-mid/20 rounded-lg">
              <div className="px-5 py-3 text-xs font-light text-muted-foreground border-b border-brand-mid/20">
                {searchResults.length} treff for «{query}»
              </div>
              <div className="divide-y divide-brand-mid/15">
                {searchResults.map((h, i) => (
                  <div key={i} className="flex items-baseline justify-between gap-4 px-5 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-brand-dark font-light">{h.name}</div>
                      <div className="text-xs text-muted-foreground font-light mt-0.5">{h.cat} · {h.sub}</div>
                    </div>
                    <div className="text-sm text-brand-dark font-light whitespace-nowrap">{h.price}</div>
                  </div>
                ))}
                {searchResults.length === 0 && (
                  <div className="px-5 py-8 text-sm text-muted-foreground font-light text-center">Ingen treff.</div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10">
              {/* Rail */}
              <nav className="md:border-r md:border-brand-mid/20 md:pr-4">
                <ul className="space-y-1">
                  {ordered.map(cat => {
                    const isActive = cat.id === current?.id;
                    return (
                      <li key={cat.id}>
                        <button
                          onClick={() => setActive(cat.id)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm font-light transition-colors ${
                            isActive
                              ? "bg-brand-dark text-brand-light"
                              : "text-brand-dark hover:bg-brand-light/50"
                          }`}
                        >
                          {cat.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Content */}
              {current && (
                <div>
                  <div className="mb-8">
                    <h2 className="text-2xl font-light text-brand-dark">{current.label}</h2>
                    <p className="text-xs text-muted-foreground font-light mt-1">
                      {current.subcategories.length} grupper. Alle priser er fra-priser.
                    </p>
                  </div>
                  <div className="space-y-8">
                    {current.subcategories.map(sub => (
                      <div key={sub.label}>
                        <h3 className="text-sm font-light text-brand-dark mb-3 pb-2 border-b border-brand-mid/20">{sub.label}</h3>
                        <div className="divide-y divide-brand-mid/15">
                          {sub.items.map((it, i) => (
                            <div key={i} className="flex items-baseline justify-between gap-4 py-2.5">
                              <div className="flex-1 min-w-0">
                                <div className="text-sm text-brand-dark font-light">{it.name}</div>
                                {it.duration && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-light mt-0.5">
                                    <Clock className="w-3 h-3" /> {it.duration}
                                  </div>
                                )}
                              </div>
                              <div className="text-sm text-brand-dark font-light whitespace-nowrap">{it.price}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  );
};

export default PriserSpotlight;
