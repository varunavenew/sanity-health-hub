import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";

interface Props { isChatOpen?: boolean }

const variants = [
  {
    to: "/spesialist-design/editorial",
    name: "Forslag 1",
    description: "Portrettmonolitt: stort fullhøyt portrett med navnet stablet over sokkelen, sidekolonne med info og hengende margmetadata langs brødteksten.",
  },
  {
    to: "/spesialist-design/klinisk",
    name: "Forslag 2",
    description: "Varm hero med portrett og rolige chips, bento-grid med strukturert fakta, lang brødtekst med marginalia og fokusert mørk CTA.",
  },
  {
    to: "/spesialist-design/atelier",
    name: "Forslag 3",
    description: "Vertikal scroll-rytme med smal kolonne, dramatisk typografi, portrettet som fullbredt band og sparsom metadata.",
  },
];

const SpecialistDesignHub = ({ isChatOpen = false }: Props) => {
  useEffect(() => {
    document.title = "Designforslag · Spesialistprofil · CMedical";
  }, []);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <section className="bg-brand-warm pt-32 md:pt-40 pb-16 md:pb-20">
        <div className="container mx-auto px-6 md:px-16 max-w-5xl">
          <p className="text-xs text-muted-foreground font-light mb-6">
            Designforslag · Spesialistprofil
          </p>
          <h1 className="text-4xl md:text-6xl font-light text-foreground leading-[1.05] mb-6">
            Tre retninger for spesialistprofilen
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed max-w-2xl">
            Samme innhold som dagens profilside, presentert i tre ulike designretninger.
            Bruker en faktisk spesialist fra databasen så du ser hvordan det føles med ekte innhold.
          </p>
        </div>
      </section>

      <section className="bg-background pb-24 md:pb-32">
        <div className="container mx-auto px-6 md:px-16 max-w-5xl">
          <ul className="divide-y divide-border/60">
            {variants.map((v) => (
              <li key={v.to}>
                <Link
                  to={v.to}
                  className="group grid md:grid-cols-12 gap-6 items-baseline py-8 hover:px-2 transition-all duration-300"
                >
                  <div className="md:col-span-4">
                    <h2 className="text-2xl md:text-3xl font-light text-foreground">{v.name}</h2>
                  </div>
                  <p className="md:col-span-7 text-base font-light text-muted-foreground leading-relaxed">
                    {v.description}
                  </p>
                  <ArrowUpRight
                    className="md:col-span-1 w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all justify-self-end"
                    strokeWidth={1.5}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </PageLayout>
  );
};

export default SpecialistDesignHub;
