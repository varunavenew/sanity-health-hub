import { Link } from "react-router-dom";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { useDemoSpecialist } from "./_useDemoSpecialist";

interface Props { isChatOpen?: boolean }

const EditorialVariant = ({ isChatOpen = false }: Props) => {
  const { specialist, related } = useDemoSpecialist();
  if (!specialist) return null;

  const firstName = specialist.name.split(" ")[0];
  const bioText = typeof specialist.bio === "string" ? specialist.bio : "";
  const paragraphs = bioText.split("\n\n").filter(Boolean);
  const pullQuote = paragraphs[0]?.split(". ").slice(0, 2).join(". ");

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Editorial hero — full bleed split with magazine typography */}
      <header className="bg-brand-light pt-24">
        <div className="grid lg:grid-cols-12 gap-0">
          <div className="lg:col-span-7 page-edge-text-left py-14 lg:py-24 flex flex-col justify-end">
            <p className="text-xs text-brand-dark/60 font-light mb-6">
              Portrett · {specialist.category}
            </p>
            <h1 className="font-light text-brand-dark leading-[0.95] mb-8 text-[clamp(3rem,8vw,7rem)]">
              {specialist.name.split(" ").map((part, i) => (
                <span key={i} className="block">{part}</span>
              ))}
            </h1>
            <p className="text-base md:text-lg text-brand-dark/70 font-light max-w-xl leading-relaxed">
              {specialist.title}
              {specialist.subtitle && specialist.subtitle !== specialist.title ? ` · ${specialist.subtitle}` : ""}
            </p>
          </div>
          <div className="lg:col-span-5 relative min-h-[420px] lg:min-h-[640px]">
            <img
              src={specialist.image}
              alt={specialist.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* Pull quote */}
      {pullQuote && (
        <section className="bg-brand-light">
          <div className="container mx-auto px-6 md:px-16 py-16 md:py-24 max-w-4xl">
            <p className="text-2xl md:text-4xl font-light text-brand-dark leading-snug">
              «{pullQuote}.»
            </p>
          </div>
        </section>
      )}

      {/* Editorial body — two columns */}
      <section className="bg-background border-t border-brand-dark/10">
        <div className="container mx-auto px-6 md:px-16 py-16 md:py-24 max-w-5xl">
          <div className="grid lg:grid-cols-12 gap-12">
            <aside className="lg:col-span-4 space-y-8 text-sm text-brand-dark/70 font-light">
              {specialist.expertise?.length ? (
                <div>
                  <p className="text-xs text-brand-dark/50 mb-3">Ekspertise</p>
                  <ul className="space-y-2">
                    {specialist.expertise.map((e) => (
                      <li key={e}>{e}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {specialist.education ? (
                <div>
                  <p className="text-xs text-brand-dark/50 mb-3">Utdanning</p>
                  <p>{specialist.education}</p>
                </div>
              ) : null}
              {specialist.languages?.length ? (
                <div>
                  <p className="text-xs text-brand-dark/50 mb-3">Språk</p>
                  <p>{specialist.languages.join(", ")}</p>
                </div>
              ) : null}
              {specialist.clinics?.length ? (
                <div>
                  <p className="text-xs text-brand-dark/50 mb-3">Klinikker</p>
                  <ul className="space-y-2">
                    {specialist.clinics.map((c) => (
                      <li key={c} className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </aside>
            <div className="lg:col-span-8 space-y-6 text-base text-brand-dark/85 font-light leading-[1.8]">
              {paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? "text-lg" : ""}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-dark py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-16 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-light text-brand-light mb-4">
            Bestill time hos {firstName}
          </h2>
          <p className="text-brand-light/70 font-light mb-8 max-w-lg mx-auto">
            Velg tjeneste og finn en tid som passer. Ingen henvisning nødvendig.
          </p>
          <Button asChild className="rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90">
            <Link to={`/spesialister/${specialist.slug}`}>
              <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
              Bestill time
            </Link>
          </Button>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-background py-16 md:py-24">
          <div className="container mx-auto px-6 md:px-16 max-w-5xl">
            <h2 className="text-xs text-brand-dark/50 font-light mb-6">Andre i samme fagområde</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((r) => (
                <Link key={r.slug} to={`/spesialister/${r.slug}`} className="group">
                  <div className="aspect-[4/5] overflow-hidden mb-3 bg-brand-warm">
                    <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  </div>
                  <p className="text-sm font-light text-brand-dark">{r.name}</p>
                  <p className="text-xs text-brand-dark/60 font-light">{r.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
};

export default EditorialVariant;
