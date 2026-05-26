import { Link } from "react-router-dom";
import { Calendar, ArrowUpRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { useDemoSpecialist } from "./_useDemoSpecialist";

interface Props { isChatOpen?: boolean }

const AtelierVariant = ({ isChatOpen = false }: Props) => {
  const { specialist, related } = useDemoSpecialist();
  if (!specialist) return null;

  const firstName = specialist.name.split(" ")[0];
  const bioText = typeof specialist.bio === "string" ? specialist.bio : "";
  const paragraphs = bioText.split("\n\n").filter(Boolean);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Asymmetric whitespace hero */}
      <header className="bg-brand-light pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid md:grid-cols-12 gap-12 md:gap-16 items-start">
            <div className="md:col-span-7 md:col-start-1">
              <p className="text-xs text-brand-dark/50 font-light mb-12">
                {String(1).padStart(2, "0")} · Spesialist
              </p>
              <h1 className="text-5xl md:text-7xl font-light text-brand-dark leading-[1.0] mb-10">
                {specialist.name}
              </h1>
              <p className="text-base md:text-lg text-brand-dark/70 font-light max-w-md leading-relaxed">
                {specialist.title}
                {specialist.subtitle && specialist.subtitle !== specialist.title ? `. ${specialist.subtitle}` : "."}
              </p>
            </div>
            <div className="md:col-span-4 md:col-start-9">
              <div className="aspect-[3/4] overflow-hidden">
                <img src={specialist.image} alt={specialist.name} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Bio — narrow centered column */}
      <section className="bg-brand-light pb-24 md:pb-32">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          <div className="space-y-6 text-base md:text-lg text-brand-dark/85 font-light leading-[1.85]">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </div>
      </section>

      {/* Inline data — sparse rows */}
      <section className="bg-brand-light border-t border-brand-dark/10">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl py-16">
          {[
            { label: "Ekspertise", value: specialist.expertise?.join(", ") },
            { label: "Utdanning", value: specialist.education },
            { label: "Språk", value: specialist.languages?.join(", ") },
            { label: "Klinikker", value: specialist.clinics?.join(", ") },
          ].filter((r) => r.value).map((r) => (
            <div key={r.label} className="grid grid-cols-4 gap-6 py-5 border-b border-brand-dark/10">
              <p className="col-span-1 text-xs text-brand-dark/50 font-light">{r.label}</p>
              <p className="col-span-3 text-sm text-brand-dark font-light">{r.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Inline CTA */}
      <section className="bg-brand-light py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          <p className="text-xs text-brand-dark/50 font-light mb-6">Ta kontakt</p>
          <h2 className="text-3xl md:text-5xl font-light text-brand-dark leading-[1.1] mb-8">
            Bestill en tid hos {firstName}.
          </h2>
          <Button asChild variant="ghost" className="rounded-none border-b border-brand-dark hover:bg-transparent text-brand-dark px-0 h-auto pb-1">
            <Link to={`/spesialister/${specialist.slug}`} className="inline-flex items-center gap-2 text-sm font-light">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              Gå til booking
              <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-brand-warm/30 py-16 md:py-24 border-t border-brand-dark/10">
          <div className="container mx-auto px-6 md:px-16 max-w-5xl">
            <p className="text-xs text-brand-dark/50 font-light mb-8">Beslektede spesialister</p>
            <ul className="divide-y divide-brand-dark/10">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link to={`/spesialister/${r.slug}`} className="group flex items-center justify-between py-5">
                    <div>
                      <p className="text-base font-light text-brand-dark">{r.name}</p>
                      <p className="text-xs text-brand-dark/60 font-light">{r.title}</p>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-brand-dark/40 group-hover:text-brand-dark group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" strokeWidth={1.5} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </PageLayout>
  );
};

export default AtelierVariant;
