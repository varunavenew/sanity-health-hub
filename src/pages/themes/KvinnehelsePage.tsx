import { useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import kvinnehelseHero from "@/assets/hero/kvinnehelse-hero.jpg";
import { useThemePage } from "@/hooks/useSanity";
import { PageSEO } from "@/components/seo/PageSEO";

interface PageProps {
  isChatOpen: boolean;
}

const staticLifePhases = [
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

const staticSections = [
  {
    heading: "En helhetlig tilnærming",
    paragraphs: [
      "Vi vet at helseutfordringer ofte henger sammen. Hormonelle endringer kan påvirke psykisk helse. Svangerskap kan gi senvirkninger. Overgangsalder kan påvirke både hjertehelse, søvn og livskvalitet.",
      "Derfor tilbyr vi:",
    ],
    bulletPoints: [
      "Gynekologisk oppfølging",
      "Fertilitetsutredning og -behandling",
      "Svangerskapsoppfølging",
      "Hormonvurdering og behandling",
      "Forebyggende helsekontroller",
      "Tverrfaglig støtte innen ernæring, psykisk helse og livsstil",
    ],
  },
  {
    heading: "Kunnskapsbasert og individuelt tilpasset",
    paragraphs: [
      "Kvinnehelse har historisk vært underprioritert i forskning og praksis. Det fører til forsinket diagnostikk og unødvendig belastning. Vi arbeider kunnskapsbasert og legger vekt på å lytte til pasientens erfaringer.",
      "Hos oss blir symptomer tatt på alvor. Vi kombinerer klinisk erfaring med moderne teknologi og individuelt tilpassede behandlingsplaner.",
    ],
  },
  {
    heading: "Trygghet, tilgjengelighet og kvalitet",
    paragraphs: [
      "Kvinnehelse krever kontinuitet, koordinering og spesialisert kompetanse. CMedical tilbyr korte ventetider, erfarne spesialister og en strukturert oppfølging som gir oversikt og forutsigbarhet.",
    ],
  },
];

const staticIntroTexts = [
  "Kropp, hormoner, livssituasjon og helsebehov endrer seg gjennom livet. Likevel opplever mange kvinner at symptomer bagatelliseres, at helsetilbudet er fragmentert, eller at de selv må koordinere egen oppfølging.",
  "Hos CMedical møter vi kvinnehelse helhetlig. Med medisinsk kompetanse, tverrfaglig samarbeid og moderne diagnostikk tilbyr vi et sammenhengende helsetilbud – fra ungdomstid til seniortilværelse.",
];

const KvinnehelsePage = ({ isChatOpen }: PageProps) => {
  const navigate = useNavigate();
  const { data: page } = useThemePage("kvinnehelse");

  const title = page?.title || "Kvinnehelse for livet";
  const heroImage = page?.heroImage || kvinnehelseHero;
  const introTexts = page?.introTexts?.length ? page.introTexts : staticIntroTexts;
  const sections = page?.sections?.length ? page.sections : staticSections;
  const lifePhases = page?.lifePhases?.length ? page.lifePhases : staticLifePhases;
  const ctaText = page?.ctaText || "Bestill time";
  const ctaLink = page?.ctaLink || "/booking";

  useEffect(() => {
    document.title = `${title} | CMedical`;
  }, [title]);

  // Find the life phases heading section (if exists) and the closing section
  const lifePhasesHeading = "Livsfaser vi følger";

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={page?.seo?.metaTitle || "Kvinnehelse for livet – Helhetlig kvinnehelse gjennom alle livsfaser"}
        description={page?.seo?.metaDescription || "CMedical tilbyr helhetlig kvinnehelse fra pubertet til senior. Gynekologi, fertilitet, hormonbehandling og tverrfaglig oppfølging – av ledende spesialister."}
        canonical="/kvinnehelse"
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Kvinnehelse", path: "/kvinnehelse" },
        ]}
      />
      {/* Hero */}
      <section className="relative h-[30vh] min-h-[220px] overflow-hidden">
        <img src={heroImage} alt={title} className="w-full h-full object-cover" style={{ objectPosition: "center 30%" }} />
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
          {/* Intro texts */}
          {introTexts.map((text, i) => (
            <p key={i} className="text-base text-muted-foreground font-light leading-relaxed mb-6">
              {text}
            </p>
          ))}
          <div className="mb-12" />

          {/* Content sections */}
          {sections.map((section, sIdx) => (
            <div key={sIdx} className="mb-12">
              <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">{section.heading}</h2>
              {section.paragraphs?.map((p, pIdx) => (
                <p key={pIdx} className="text-base text-muted-foreground font-light leading-relaxed mb-6">
                  {p}
                </p>
              ))}
              {section.bulletPoints && section.bulletPoints.length > 0 && (
                <ul className="space-y-2 mb-8">
                  {section.bulletPoints.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-dark mt-2 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground font-light">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {sIdx === 0 && (
                <p className="text-base text-muted-foreground font-light leading-relaxed">
                  Målet er at hver kvinne skal oppleve kontinuitet, trygghet og medisinsk kvalitet – uansett livsfase.
                </p>
              )}
            </div>
          ))}

          {/* Life Phases */}
          <h2 className="text-2xl md:text-3xl font-light text-foreground mb-8">{lifePhasesHeading}</h2>
          <div className="space-y-8 mb-12">
            {lifePhases.map((phase) => (
              <div key={phase.title}>
                <h3 className="text-lg font-normal text-foreground mb-2">{phase.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{phase.text}</p>
              </div>
            ))}
          </div>

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

export default KvinnehelsePage;
