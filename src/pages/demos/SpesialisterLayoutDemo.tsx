import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import { useEffect } from "react";

/**
 * Demo page that previews the SpecialistsScroller section with 1, 2, 3 and 4+
 * specialists so we can compare the editorial layouts side by side.
 */
const SpesialisterLayoutDemo = () => {
  const { sorted } = useSpecialistsData();

  useEffect(() => {
    document.title = "Demo: Spesialist-layouts · CMedical";
  }, []);

  const one = sorted.slice(0, 1);
  const two = sorted.slice(0, 2);
  const three = sorted.slice(0, 3);
  const four = sorted.slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-brand-dark/10 bg-secondary/40">
        <div className="container mx-auto px-6 md:px-16 py-6 flex items-center justify-between">
          <div>
            <div className="text-xs font-light text-muted-foreground mb-1">
              Demo · Seksjon
            </div>
            <h1 className="text-2xl md:text-3xl font-light text-foreground">
              Spesialist-seksjon — 1 / 2 / 3 / 4+
            </h1>
          </div>
          <Button variant="cta-outline" asChild>
            <Link to="/godkjenning">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Tilbake til godkjenning
            </Link>
          </Button>
        </div>
      </div>

      {/* 1 specialist — editorial split (existing) */}
      <DemoLabel n={1} note="Editorial split — portrett + intro + CTA" />
      <SpecialistsScroller
        filter={(s: any) => s.slug === one[0]?.slug}
        title="Møt spesialisten"
        description="Når en tjeneste kun har én spesialist viser vi et fullt editorial-oppslag."
        seeAllHref="/spesialister"
      />

      {/* 2 specialists — horizontal editorial pair */}
      <DemoLabel n={2} note="Horisontalt par — bilde til venstre, info til høyre" />
      <section className="py-14 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-6 md:px-16">
          <SectionHeader
            title="Møt våre spesialister"
            description="To spesialister presenteres side om side med bilde til venstre og kort presentasjon til høyre."
          />
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-12">
            <DuoCard sp={two[0]} />
            <DuoCard sp={two[1]} />
          </div>
        </div>
      </section>

      {/* 3 specialists — staggered zig-zag */}
      <DemoLabel n={3} note="Zig-zag — midten løftet, en stille rytme" />
      <section className="py-14 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-6 md:px-16">
          <SectionHeader
            title="Møt våre spesialister"
            description="Tre spesialister får en zig-zag-rytme. Det skaper bevegelse uten å fragmentere komposisjonen."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-start">
            <div className="md:pt-16">
              <TrioCard sp={three[0]} />
            </div>
            <div>
              <TrioCard sp={three[1]} />
            </div>
            <div className="md:pt-16">
              <TrioCard sp={three[2]} />
            </div>
          </div>
        </div>
      </section>

      {/* 4+ specialists — edge to edge */}
      <DemoLabel n={4} note="Kant-til-kant — full bredde, like kort i rekke" />
      <section className="py-14 md:py-20 bg-secondary/30">
        <div className="px-0">
          <div className="px-6 md:px-16 mb-12">
            <SectionHeader
              title="Møt våre spesialister"
              description="Fra fire spesialister og oppover går vi kant-til-kant. Korta puster mot ytterkantene av skjermen i stedet for å samle seg i en boks."
              compact
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-brand-dark/10">
            {four.map((sp) => (
              <EdgeCard key={sp.slug} sp={sp} />
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-16 py-16">
        <Link
          to="/godkjenning"
          className="inline-flex items-center text-sm font-light text-foreground hover:underline"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Tilbake til godkjenning
        </Link>
      </div>
    </div>
  );
};

const DemoLabel = ({ n, note }: { n: number; note: string }) => (
  <div className="container mx-auto px-6 md:px-16 pt-16 md:pt-24 pb-2">
    <div className="flex items-baseline gap-4 border-b border-brand-dark/15 pb-3">
      <span className="text-xs font-light text-muted-foreground">
        Variant {n}
      </span>
      <span className="text-sm font-light text-foreground">
        {n === 4 ? "4+ spesialister" : `${n} spesialist${n > 1 ? "er" : ""}`}
      </span>
      <span className="text-xs font-light text-muted-foreground ml-auto">
        {note}
      </span>
    </div>
  </div>
);

const SectionHeader = ({
  title,
  description,
  compact,
}: {
  title: string;
  description?: string;
  compact?: boolean;
}) => (
  <div className={`max-w-xl ${compact ? "mb-0" : "mb-12"}`}>
    <h2 className="text-2xl md:text-3xl font-light text-foreground mb-4">
      {title}
    </h2>
    {description && (
      <p className="text-muted-foreground font-light">{description}</p>
    )}
  </div>
);

const DuoCard = ({ sp, tall }: { sp: any; tall?: boolean }) => {
  if (!sp) return null;
  return (
    <Link
      to={`/spesialister/${sp.slug}`}
      className="group block"
      aria-label={`Les mer om ${sp.name}`}
    >
      <div
        className={`relative overflow-hidden bg-secondary mb-4 ${
          tall ? "aspect-[4/5]" : "aspect-[3/4]"
        }`}
      >
        <img
          src={sp.image}
          alt={sp.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {sp.clinics?.length > 0 && (
          <div className="absolute top-3 left-3 flex items-center gap-1 text-white/90 text-xs font-light drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            <MapPin className="w-2.5 h-2.5" />
            {sp.clinics.join(" · ")}
          </div>
        )}
      </div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-light text-foreground mb-1">
            {sp.name}
          </h3>
          <p className="text-sm text-muted-foreground font-light">
            {sp.title}
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-foreground/60 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};

const TrioCard = ({ sp }: { sp: any }) => {
  if (!sp) return null;
  return (
    <Link
      to={`/spesialister/${sp.slug}`}
      className="group block"
      aria-label={`Les mer om ${sp.name}`}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-3">
        <img
          src={sp.image}
          alt={sp.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {sp.clinics?.length > 0 && (
          <div className="absolute top-3 left-3 flex items-center gap-1 text-white/90 text-xs font-light drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            <MapPin className="w-2.5 h-2.5" />
            {sp.clinics.join(" · ")}
          </div>
        )}
      </div>
      <h3 className="font-normal text-foreground mb-0.5">{sp.name}</h3>
      <p className="text-sm text-muted-foreground font-light">{sp.title}</p>
    </Link>
  );
};

const EdgeCard = ({ sp }: { sp: any }) => (
  <Link
    to={`/spesialister/${sp.slug}`}
    className="group block bg-background"
    aria-label={`Les mer om ${sp.name}`}
  >
    <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
      <img
        src={sp.image}
        alt={sp.name}
        loading="lazy"
        className="w-full h-full object-cover saturate-[0.7] brightness-[0.95] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent" />
      {sp.clinics?.length > 0 && (
        <div className="absolute top-3 left-3 flex items-center gap-1 text-white/80 text-xs font-light drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
          <MapPin className="w-2.5 h-2.5" />
          {sp.clinics.join(" · ")}
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-normal text-white mb-0.5">{sp.name}</h3>
        <p className="text-xs text-white/75 font-light">{sp.title}</p>
      </div>
    </div>
  </Link>
);

export default SpesialisterLayoutDemo;
