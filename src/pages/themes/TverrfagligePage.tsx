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

const splitSection = {
  heading: "Alt på ett sted – gjennom alle livets faser",
  paragraphs: [
    "Våre gynekologer jobber kun med den kvinnesykdommen de kan aller best, og ved behov jobber vi i unike ekspert team med psykolog, sexolog, ernæringsfysiolog, fysioterapeut, osteopat og uroterapeut. Denne tverrfagligheten er helt unik!",
    "Vi tilbyr alt innen gynekologisk kirurgi, og vi er den første private aktøren som tilbyr robotkirurgi. Vår klinikk er den første private klinikken i Norden med IVF-behandling og kirurgi samlet under samme tak. Dette gir deg som gjennomgår fertilitetsbehandling en ro og trygghet om at vi kan løse de fleste utfordringer på et sted, her hos oss. Vi har et svangerskapsteam som følger deg trygt igjennom graviditeten helt til fødsel, og våre eksperter på barsel står klare til å veilede deg videre på «6 ukers kontrollen». Dersom du skulle oppleve plager senere i livet er vi her for å hjelpe deg. Vi har kompetanse på alle gynekologiske tilstander – fra utredning, behandling og oppfølging i etterkant.",
  ],
};

const andreTing = [
  {
    title: "Slik foregår det",
    desc: "Du booker time selv – uten henvisning. Spesialisten gjør en grundig vurdering, og ved behov kobles flere fagpersoner inn i et felles forløp.",
  },
  {
    title: "Du bestemmer hva du er komfortabel med",
    desc: "Du er i førersetet. Vi forklarer alternativene, og du velger tempo, omfang og hvilke fagpersoner du ønsker å møte.",
  },
  {
    title: "Trygge og diskré rammer",
    desc: "Privatliv, diskresjon og respekt står sentralt – fra venterom til konsultasjon og oppfølging.",
  },
  {
    title: "Koordinert oppfølging",
    desc: "Vi tar ansvar for samhandlingen mellom spesialistene, slik at du slipper å fortelle historien din på nytt for hver fagperson.",
  },
  {
    title: "Kort ventetid",
    desc: "Du kommer raskt til – ofte innen en uke. Ingen henvisning nødvendig.",
  },
  {
    title: "Forsikring og refusjon",
    desc: "Vi samarbeider med de største helseforsikringsselskapene og hjelper deg med det praktiske rundt dekning.",
  },
];

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
      <PageSEO
        title={page?.seo?.metaTitle || "Tverrfaglige team – Helhetlig behandling som standard"}
        description={page?.seo?.metaDescription || "Hos CMedical samarbeider spesialister på tvers av fagfelt for helhetlig behandling. Gynekologer, urologer, psykologer, ernæringsfysiologer og osteopater under samme tak."}
        canonical="/tverrfaglige-team"
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Tverrfaglige team", path: "/tverrfaglige-team" },
        ]}
      />
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
