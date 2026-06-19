import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { priceCategories } from "@/data/priceList";

interface PageProps { isChatOpen: boolean }

const PRIORITIZED = ["gynekologi", "urologi", "fertilitet", "ortopedi"];

const PriserKategorikort = ({ isChatOpen }: PageProps) => {
  const [active, setActive] = useState<string>("gynekologi");

  const ordered = [
    ...priceCategories.filter(c => PRIORITIZED.includes(c.id))
      .sort((a, b) => PRIORITIZED.indexOf(a.id) - PRIORITIZED.indexOf(b.id)),
    ...priceCategories.filter(c => !PRIORITIZED.includes(c.id))
      .sort((a, b) => a.label.localeCompare(b.label, "nb")),
  ];

  const current = ordered.find(c => c.id === active) ?? ordered[0];

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <section className="bg-brand-light/40 min-h-screen">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl py-16">
          <div className="mb-10">
            <p className="text-xs text-muted-foreground font-light mb-2">Demo · Forslag 1</p>
            <h1 className="text-3xl md:text-4xl font-light text-brand-dark">Priser — kategorikort</h1>
            <p className="text-sm text-muted-foreground font-light mt-2 max-w-xl">
              Hver tjenestekategori vises som et eget kort. Velg kort for å se prisene i en ren liste under.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-12">
            {ordered.map(cat => {
              const total = cat.subcategories.reduce((n, s) => n + s.items.length, 0);
              const isActive = cat.id === current.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActive(cat.id)}
                  className={`text-left rounded-lg border p-5 transition-all ${
                    isActive
                      ? "bg-brand-dark text-brand-light border-brand-dark"
                      : "bg-white border-brand-mid/30 hover:border-brand-dark"
                  }`}
                >
                  <div className="text-base font-light mb-2">{cat.label}</div>
                  <div className={`text-xs font-light ${isActive ? "text-brand-light/70" : "text-muted-foreground"}`}>
                    {cat.subcategories.length} grupper · {total} tjenester
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active category content */}
          <div className="bg-white rounded-lg border border-brand-mid/20 p-6 md:p-10">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-mid/20">
              <div>
                <h2 className="text-2xl font-light text-brand-dark">{current.label}</h2>
                <p className="text-xs text-muted-foreground font-light mt-1">Alle priser er fra-priser.</p>
              </div>
              <Link
                to={current.path}
                className="hidden md:inline-flex items-center gap-1 text-sm font-light text-brand-dark hover:underline"
              >
                Les mer om {current.label.toLowerCase()} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-10">
              {current.subcategories.map(sub => (
                <div key={sub.label}>
                  <h3 className="text-sm font-light text-brand-dark mb-4 uppercase">{sub.label}</h3>
                  <div className="divide-y divide-brand-mid/15">
                    {sub.items.map((it, i) => (
                      <div key={i} className="flex items-baseline justify-between gap-4 py-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-brand-dark font-light">{it.name}</div>
                          {it.duration && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground font-light mt-0.5">
                              <Clock className="w-3 h-3" /> {it.duration}
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-brand-dark font-light whitespace-nowrap">
                          {it.price}
                          {it.priceNote && <span className="text-xs text-muted-foreground ml-1">({it.priceNote})</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default PriserKategorikort;
