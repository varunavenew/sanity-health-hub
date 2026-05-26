import { Link } from "react-router-dom";
import { MapPin, Calendar, Languages, GraduationCap, Stethoscope } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { useDemoSpecialist } from "./_useDemoSpecialist";

interface Props { isChatOpen?: boolean }

const KliniskVariant = ({ isChatOpen = false }: Props) => {
  const { specialist, related } = useDemoSpecialist();
  if (!specialist) return null;

  const firstName = specialist.name.split(" ")[0];
  const bioText = typeof specialist.bio === "string" ? specialist.bio : "";
  const paragraphs = bioText.split("\n\n").filter(Boolean);

  const Fact = ({ icon: Icon, label, value }: { icon: any; label: string; value: React.ReactNode }) => (
    <div className="border-t border-brand-dark/10 py-4 grid grid-cols-3 gap-4 items-baseline">
      <div className="flex items-center gap-2 text-xs text-brand-dark/60 font-light">
        <Icon className="w-3.5 h-3.5" aria-hidden="true" />
        {label}
      </div>
      <div className="col-span-2 text-sm text-brand-dark font-light">{value}</div>
    </div>
  );

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Compact data-first hero */}
      <header className="bg-brand-warm pt-24 pb-12 md:pb-16">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-4">
              <div className="aspect-[4/5] overflow-hidden bg-brand-light">
                <img src={specialist.image} alt={specialist.name} className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="md:col-span-8">
              <p className="text-xs text-brand-dark/60 font-light mb-3">
                Spesialistprofil · {specialist.category}
              </p>
              <h1 className="text-4xl md:text-5xl font-light text-brand-dark leading-[1.05] mb-3">
                {specialist.name}
              </h1>
              <p className="text-base text-brand-dark/70 font-light mb-6">
                {specialist.title}
                {specialist.subtitle && specialist.subtitle !== specialist.title ? ` · ${specialist.subtitle}` : ""}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {specialist.expertise?.slice(0, 6).map((e) => (
                  <span key={e} className="inline-flex items-center px-3 py-1 text-xs font-light text-brand-dark border border-brand-dark/20 rounded-full">
                    {e}
                  </span>
                ))}
              </div>
              <Button asChild className="rounded-2xl bg-brand-dark text-brand-light hover:bg-brand-dark/90">
                <Link to={`/spesialister/${specialist.slug}`}>
                  <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
                  Bestill time hos {firstName}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Two-column: bio + structured facts */}
      <section className="bg-background py-14 md:py-20">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-5 text-base text-brand-dark/85 font-light leading-[1.8]">
              <h2 className="text-xs text-brand-dark/50 font-light mb-2">Om {firstName}</h2>
              {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <aside className="lg:col-span-5">
              <div className="bg-brand-warm/40 p-6 md:p-8 rounded-md">
                <h2 className="text-xs text-brand-dark/50 font-light mb-4">Fakta</h2>
                {specialist.expertise?.length ? (
                  <Fact icon={Stethoscope} label="Ekspertise" value={specialist.expertise.join(", ")} />
                ) : null}
                {specialist.education?.length ? (
                  <Fact icon={GraduationCap} label="Utdanning" value={
                    <ul className="space-y-1">{specialist.education.map((e) => <li key={e}>{e}</li>)}</ul>
                  } />
                ) : null}
                {specialist.languages?.length ? (
                  <Fact icon={Languages} label="Språk" value={specialist.languages.join(", ")} />
                ) : null}
                {specialist.clinics?.length ? (
                  <Fact icon={MapPin} label="Klinikker" value={
                    <ul className="space-y-1">{specialist.clinics.map((c) => <li key={c}>{c}</li>)}</ul>
                  } />
                ) : null}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-brand-warm/30 py-14 md:py-20 border-t border-brand-dark/10">
          <div className="container mx-auto px-6 md:px-16 max-w-6xl">
            <h2 className="text-sm text-brand-dark/60 font-light mb-6">Andre i samme fagområde</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((r) => (
                <Link key={r.slug} to={`/spesialister/${r.slug}`} className="group">
                  <div className="aspect-[4/5] overflow-hidden mb-3 bg-brand-light">
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

export default KliniskVariant;
