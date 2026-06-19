import { PageLayout } from "@/components/layout/PageLayout";
import { priceCategories } from "@/data/priceList";
import { Clock } from "lucide-react";

interface PageProps { isChatOpen: boolean }

const PRIORITIZED = ["gynekologi", "urologi", "fertilitet", "ortopedi"];

/**
 * Demo 2: Magasin-stil. Alle priser i én lang, redaksjonell flyt med
 * tydelig hierarki: kategori → undergruppe → tjenester. Ingen accordions.
 */
const PriserMagasin = ({ isChatOpen }: PageProps) => {
  const ordered = [
    ...priceCategories.filter(c => PRIORITIZED.includes(c.id))
      .sort((a, b) => PRIORITIZED.indexOf(a.id) - PRIORITIZED.indexOf(b.id)),
    ...priceCategories.filter(c => !PRIORITIZED.includes(c.id))
      .sort((a, b) => a.label.localeCompare(b.label, "nb")),
  ];

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <section className="bg-white min-h-screen">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl py-16">
          <div className="mb-12">
            <p className="text-xs text-muted-foreground font-light mb-2">Demo · Forslag 2</p>
            <h1 className="text-3xl md:text-5xl font-light text-brand-dark">Priser — magasin</h1>
            <p className="text-sm text-muted-foreground font-light mt-3 max-w-2xl">
              Alt på én side. Tydelig hierarki, ingen klikk for å komme til innholdet.
              Egnet for besøkende som vil scanne raskt eller skrive ut.
            </p>
          </div>

          {/* Quick anchor nav */}
          <nav className="flex flex-wrap gap-2 mb-14 pb-6 border-b border-brand-mid/20">
            {ordered.map(cat => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="text-xs font-light text-brand-dark px-3 py-1.5 rounded-full border border-brand-mid/30 hover:bg-brand-light/50"
              >
                {cat.label}
              </a>
            ))}
          </nav>

          <div className="space-y-20">
            {ordered.map(cat => (
              <section key={cat.id} id={cat.id} className="scroll-mt-24">
                <div className="mb-8 pb-3 border-b border-brand-dark/20">
                  <div className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase mb-2">Kategori</div>
                  <h2 className="text-2xl md:text-3xl font-light text-brand-dark">{cat.label}</h2>
                </div>

                <div className="space-y-10">
                  {cat.subcategories.map(sub => (
                    <div key={sub.label} className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
                      <div>
                        <h3 className="text-sm font-light text-brand-dark md:sticky md:top-24">{sub.label}</h3>
                      </div>
                      <div className="divide-y divide-brand-mid/15">
                        {sub.items.map((it, i) => (
                          <div key={i} className="flex items-baseline justify-between gap-6 py-3">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-brand-dark font-light">{it.name}</div>
                              {(it.duration || it.info) && (
                                <div className="text-xs text-muted-foreground font-light mt-1 flex items-center gap-2">
                                  {it.duration && <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" />{it.duration}</span>}
                                  {it.requiresConsultation && <span>· Krever konsultasjon</span>}
                                </div>
                              )}
                            </div>
                            <div className="text-sm text-brand-dark font-light whitespace-nowrap">
                              {it.price}
                              {it.priceNote && <div className="text-[10px] text-muted-foreground text-right">{it.priceNote}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <p className="text-xs text-muted-foreground font-light mt-20 pt-6 border-t border-brand-mid/20">
            Alle priser er veiledende fra-priser. Endelig pris avtales etter konsultasjon.
          </p>
        </div>
      </section>
    </PageLayout>
  );
};

export default PriserMagasin;
