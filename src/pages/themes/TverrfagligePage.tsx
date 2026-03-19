import { useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import tverrfagligTeam from "@/assets/hero/tverrfaglig-team.jpg";
import { useThemePage } from "@/hooks/useSanity";
import { PageSEO } from "@/components/seo/PageSEO";

interface PageProps {
  isChatOpen: boolean;
}

const staticSections = [
  {
    heading: "Tverrfaglige team – helhetlig behandling som standard",
    paragraphs: [
      "Hos CMedical er tverrfaglighet en etablert arbeidsform på tvers av fagområder og pasientgrupper. Vi vet at mange helseutfordringer sjelden er isolerte. Fysiske symptomer kan henge sammen med psykiske belastninger, hormonelle forhold, livsstil eller funksjonelle plager. Derfor samarbeider våre spesialister tett – fra første vurdering til oppfølging.",
      "Våre leger arbeider innenfor sine definerte spesialfelt, og ved behov settes det sammen dedikerte ekspertteam rundt pasienten. Teamene kan bestå av osteopat, psykolog, sexolog, ernæringsfysiolog, fysioterapeut og uroterapeut – avhengig av medisinsk problemstilling og individuelle behov.",
      "Denne strukturerte samhandlingen gir mer presise vurderinger, bedre behandlingsforløp og større forutsigbarhet.",
    ],
  },
  {
    heading: "Samlet kompetanse – under samme tak",
    paragraphs: [
      "Vi tilbyr avansert kirurgi, inkludert robotassistert kirurgi, og var den første private aktøren i Norden som samlet IVF-behandling og gynekologisk kirurgi ved én og samme klinikk. Det betyr at utredning, eventuell kirurgi og videre behandling kan gjennomføres uten brudd i forløpet.",
      "Den samme modellen gjelder også innen behandling av mannlige helseutfordringer, blant annet innen fertilitet, hormonforstyrrelser og seksuell helse. Når medisinske, funksjonelle og psykososiale faktorer vurderes samlet, styrkes kvaliteten på behandlingen.",
    ],
  },
  {
    heading: "Behandling gjennom livets faser",
    paragraphs: [
      "Vi følger pasienter gjennom ulike livsfaser – fra fertilitetsutredning og svangerskap til hormonelle endringer, bekkenhelse, prostataplager, seksualhelse og forebyggende helsekontroller. Dersom plager oppstår senere i livet, tilbyr vi utredning, behandling og strukturert oppfølging med tilgang til relevant fagkompetanse.",
    ],
  },
  {
    heading: "En modell som gir trygghet",
    paragraphs: [
      "Tverrfaglighet hos CMedical er ikke et tilleggstilbud. Det er en integrert del av hvordan vi organiserer arbeidet. Når kompetansen er samlet fysisk og organisatorisk, reduseres ventetid, informasjonsbrudd og unødig belastning for pasienten.",
    ],
  },
];

const TverrfagligePage = ({ isChatOpen }: PageProps) => {
  const navigate = useNavigate();
  const { data: page } = useThemePage("tverrfaglige-team");

  const title = page?.title || "Tverrfaglige team";
  const heroImage = page?.heroImage || tverrfagligTeam;
  const sections = page?.sections?.length ? page.sections : staticSections;
  const ctaText = page?.ctaText || "Bestill time";
  const ctaLink = page?.ctaLink || "/booking";

  useEffect(() => {
    document.title = `${title} | CMedical`;
  }, [title]);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Hero */}
      <section className="relative h-[30vh] min-h-[220px] overflow-hidden">
        <img src={heroImage} alt={title} className="w-full h-full object-cover" style={{ objectPosition: "center 40%" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-5xl font-light text-white">{title}</h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="mb-12">
              <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">{section.heading}</h2>
              {section.paragraphs?.map((p, pIdx) => (
                <p key={pIdx} className="text-base text-muted-foreground font-light leading-relaxed mb-6">
                  {p}
                </p>
              ))}
            </div>
          ))}

          <Button
            onClick={() => navigate(ctaLink)}
            className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-full font-light"
          >
            {ctaText}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default TverrfagligePage;
