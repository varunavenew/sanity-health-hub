import { useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import robotkirurgiHero from "@/assets/hero/robotkirurgi-hero.jpg";

interface PageProps { isChatOpen: boolean; }

const RobotkirurgiPage = ({ isChatOpen }: PageProps) => {
  const navigate = useNavigate();
  useEffect(() => { document.title = "Robotassistert kirurgi | CMedical"; }, []);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <section className="relative h-[30vh] min-h-[220px] overflow-hidden">
        <img src={robotkirurgiHero} alt="Robotassistert kirurgi" className="w-full h-full object-cover" style={{ objectPosition: "center 40%" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="container mx-auto"><h1 className="text-3xl md:text-5xl font-light text-white">Robotassistert kirurgi</h1></div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">Presisjon, kontroll og raskere restitusjon</h2>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-6">Hos CMedical tilbyr vi robotassistert kirurgi som en integrert del av vårt kirurgiske behandlingstilbud. Metoden kombinerer avansert teknologi med høy kirurgisk kompetanse, og gjør det mulig å gjennomføre komplekse inngrep med stor presisjon og minimal belastning for pasienten.</p>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-6">Robotkirurgi utføres som kikkhullskirurgi, gjennom små snitt i huden. Forskjellen er at kirurgen styrer instrumentene elektronisk fra en konsoll ved siden av operasjonsbordet. Instrumentene holdes av robotarmer som gjengir kirurgens bevegelser med svært høy nøyaktighet. Et høyoppløselig, stereoskopisk 3D-kamera gir forstørret og detaljert oversikt over operasjonsfeltet.</p>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-12">Dette gir optimal kontroll – særlig ved inngrep i områder med tett og sårbar anatomi.</p>

          <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">Skånsom behandling ved avanserte inngrep</h2>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-4">Robotassistert kirurgi er ofte foretrukket ved kompliserte operasjoner hvor man ønsker å unngå åpen kirurgi (laparotomi). Metoden gir:</p>
          <ul className="space-y-2 mb-6">
            {["Mindre operasjonssår", "Redusert blødning", "Lavere risiko for komplikasjoner", "Mindre postoperativ smerte", "Raskere mobilisering"].map((item) => (
              <li key={item} className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-dark mt-2 flex-shrink-0" /><span className="text-sm text-muted-foreground font-light">{item}</span></li>
            ))}
          </ul>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-12">De fleste pasienter kan reise hjem innen ett døgn etter inngrepet. Mange kan spise og være oppe samme kveld. Avhengig av type operasjon og arbeidssituasjon er sykemeldingsperioden ofte rundt 2–3 uker, betydelig kortere enn ved tradisjonell åpen kirurgi.</p>

          <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">Presisjon der det betyr mest</h2>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-6">I bekkenet finnes nerver og strukturer som er avgjørende for funksjoner som blærekontroll og seksualfunksjon, både hos kvinner og menn. Ved tilstander som dyp endometriose eller prostatakreft er det særlig viktig med nøyaktig disseksjon for å redusere risiko for nerveskader.</p>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-12">Robotkirurgi gir kirurgen bedre bevegelighet og kontroll enn tradisjonell laparoskopi, og er et effektivt verktøy ved nervesparende kirurgi.</p>

          <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">Vi tilbyr robotassistert kirurgi innen blant annet</h2>
          <ul className="space-y-2 mb-12">
            {["Overvektskirurgi (bariatrisk kirurgi)", "Muskelknuter (fertilitetsbevarende kirurgi)", "Dyp endometriose", "Hysterektomi, også ved forstørret livmor", "Brokk", "Godartet forstørret prostata (RASP)", "Prostatakreft (RALP)"].map((item) => (
              <li key={item} className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-brand-dark mt-2 flex-shrink-0" /><span className="text-sm text-muted-foreground font-light">{item}</span></li>
            ))}
          </ul>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-12">Ved enkelte krefttilfeller, som livmorkreft og prostatakreft, kan robotkirurgi være et særlig godt alternativ nettopp på grunn av presisjon og skånsomhet.</p>

          <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">Teknologi og erfaring i samspill</h2>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-6">Robotsystemet er et avansert verktøy – men det er kirurgens erfaring som er avgjørende. Inngrepene utføres av spesialister innen urologi og gynekologi med solid kompetanse på både tradisjonell og robotassistert kirurgi.</p>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-12">Kirurgen arbeider fra en ergonomisk tilpasset konsoll, noe som gir stabilitet, konsentrasjon og presisjon gjennom hele operasjonen.</p>

          <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">En tryggere vei tilbake til hverdagen</h2>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-10">Målet med robotassistert kirurgi er ikke bare å gjennomføre selve inngrepet med høy kvalitet, men å sikre en trygg og forutsigbar opplevelse før, under og etter operasjonen. Moderne teknologi, strukturert oppfølging og erfarne spesialister gir kortere rekonvalesens og raskere vei tilbake til hverdagen – med minst mulig belastning underveis.</p>

          <Button onClick={() => navigate("/booking")} className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-full font-light">
            Bestill time <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default RobotkirurgiPage;