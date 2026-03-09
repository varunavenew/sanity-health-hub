import { useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import tverrfagligTeam from "@/assets/hero/tverrfaglig-team.jpg";

interface PageProps { isChatOpen: boolean; }

const TverrfagligePage = ({ isChatOpen }: PageProps) => {
  const navigate = useNavigate();
  useEffect(() => { document.title = "Tverrfaglige team | CMedical"; }, []);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <section className="relative h-[30vh] min-h-[220px] overflow-hidden">
        <img src={tverrfagligTeam} alt="Tverrfaglige team" className="w-full h-full object-cover" style={{ objectPosition: "center 40%" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="container mx-auto"><h1 className="text-3xl md:text-5xl font-light text-white">Tverrfaglige team</h1></div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">Tverrfaglige team – helhetlig behandling som standard</h2>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-6">Hos CMedical er tverrfaglighet en etablert arbeidsform på tvers av fagområder og pasientgrupper. Vi vet at mange helseutfordringer sjelden er isolerte. Fysiske symptomer kan henge sammen med psykiske belastninger, hormonelle forhold, livsstil eller funksjonelle plager. Derfor samarbeider våre spesialister tett – fra første vurdering til oppfølging.</p>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-6">Våre leger arbeider innenfor sine definerte spesialfelt, og ved behov settes det sammen dedikerte ekspertteam rundt pasienten. Teamene kan bestå av osteopat, psykolog, sexolog, ernæringsfysiolog, fysioterapeut og uroterapeut – avhengig av medisinsk problemstilling og individuelle behov.</p>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-12">Denne strukturerte samhandlingen gir mer presise vurderinger, bedre behandlingsforløp og større forutsigbarhet.</p>

          <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">Samlet kompetanse – under samme tak</h2>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-6">Vi tilbyr avansert kirurgi, inkludert robotassistert kirurgi, og var den første private aktøren i Norden som samlet IVF-behandling og gynekologisk kirurgi ved én og samme klinikk. Det betyr at utredning, eventuell kirurgi og videre behandling kan gjennomføres uten brudd i forløpet.</p>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-12">Den samme modellen gjelder også innen behandling av mannlige helseutfordringer, blant annet innen fertilitet, hormonforstyrrelser og seksuell helse. Når medisinske, funksjonelle og psykososiale faktorer vurderes samlet, styrkes kvaliteten på behandlingen.</p>

          <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">Behandling gjennom livets faser</h2>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-12">Vi følger pasienter gjennom ulike livsfaser – fra fertilitetsutredning og svangerskap til hormonelle endringer, bekkenhelse, prostataplager, seksualhelse og forebyggende helsekontroller. Dersom plager oppstår senere i livet, tilbyr vi utredning, behandling og strukturert oppfølging med tilgang til relevant fagkompetanse.</p>

          <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">En modell som gir trygghet</h2>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-10">Tverrfaglighet hos CMedical er ikke et tilleggstilbud. Det er en integrert del av hvordan vi organiserer arbeidet. Når kompetansen er samlet fysisk og organisatorisk, reduseres ventetid, informasjonsbrudd og unødig belastning for pasienten.</p>

          <Button onClick={() => navigate("/booking")} className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-full font-light">
            Bestill time <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default TverrfagligePage;