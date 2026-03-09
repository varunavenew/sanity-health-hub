import { useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import kvinnehelseHero from "@/assets/hero/kvinnehelse-hero.jpg";

interface PageProps {
  isChatOpen: boolean;
}

const lifePhaseSections = [
  {
    title: "Ung kvinne",
    text: "Menstruasjonsutfordringer, prevensjon, PCOS, endometriose, smerter og hormonelle plager.",
  },
  {
    title: "Fertil alder",
    text: "Prevensjonsveiledning, fertilitetsvurdering, graviditet, barseloppfølging og bekkenhelse.",
  },
  {
    title: "Midtliv og overgangsalder",
    text: "Perimenopause og menopause, hormonbehandling, søvnproblemer, energitap, beinskjørhet og hjertehelse.",
  },
  {
    title: "Senior kvinnehelse",
    text: "Forebygging, underlivsplager, inkontinens, seksualhelse og helhetlig oppfølging av kroniske tilstander.",
  },
];

const KvinnehelsePage = ({ isChatOpen }: PageProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Kvinnehelse for livet | CMedical";
  }, []);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Hero */}
      <section className="relative h-[30vh] min-h-[220px] overflow-hidden">
        <img src={kvinnehelseHero} alt="Kvinnehelse for livet" className="w-full h-full object-cover" style={{ objectPosition: "center 30%" }} />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
          <div className="container mx-auto">
            <h1 className="text-3xl md:text-5xl font-light text-white">Kvinnehelse for livet</h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-6">
            Kropp, hormoner, livssituasjon og helsebehov endrer seg gjennom livet. Likevel opplever mange kvinner at symptomer bagatelliseres, at helsetilbudet er fragmentert, eller at de selv må koordinere egen oppfølging.
          </p>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-12">
            Hos CMedical møter vi kvinnehelse helhetlig. Med medisinsk kompetanse, tverrfaglig samarbeid og moderne diagnostikk tilbyr vi et sammenhengende helsetilbud – fra ungdomstid til seniortilværelse.
          </p>

          <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">En helhetlig tilnærming</h2>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-6">
            Vi vet at helseutfordringer ofte henger sammen. Hormonelle endringer kan påvirke psykisk helse. Svangerskap kan gi senvirkninger. Overgangsalder kan påvirke både hjertehelse, søvn og livskvalitet.
          </p>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-4">Derfor tilbyr vi:</p>
          <ul className="space-y-2 mb-8">
            {[
              "Gynekologisk oppfølging",
              "Fertilitetsutredning og -behandling",
              "Svangerskapsoppfølging",
              "Hormonvurdering og behandling",
              "Forebyggende helsekontroller",
              "Tverrfaglig støtte innen ernæring, psykisk helse og livsstil",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-dark mt-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground font-light">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-12">
            Målet er at hver kvinne skal oppleve kontinuitet, trygghet og medisinsk kvalitet – uansett livsfase.
          </p>

          <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">Kunnskapsbasert og individuelt tilpasset</h2>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-6">
            Kvinnehelse har historisk vært underprioritert i forskning og praksis. Det fører til forsinket diagnostikk og unødvendig belastning. Vi arbeider kunnskapsbasert og legger vekt på å lytte til pasientens erfaringer.
          </p>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-12">
            Hos oss blir symptomer tatt på alvor. Vi kombinerer klinisk erfaring med moderne teknologi og individuelt tilpassede behandlingsplaner.
          </p>

          <h2 className="text-2xl md:text-3xl font-light text-foreground mb-8">Livsfaser vi følger</h2>
          <div className="space-y-8 mb-12">
            {lifePhaseSections.map((phase) => (
              <div key={phase.title}>
                <h3 className="text-lg font-normal text-foreground mb-2">{phase.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{phase.text}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">Trygghet, tilgjengelighet og kvalitet</h2>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-10">
            Kvinnehelse krever kontinuitet, koordinering og spesialisert kompetanse. CMedical tilbyr korte ventetider, erfarne spesialister og en strukturert oppfølging som gir oversikt og forutsigbarhet.
          </p>

          <Button
            onClick={() => navigate("/booking")}
            className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-full font-light"
          >
            Bestill time
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default KvinnehelsePage;
