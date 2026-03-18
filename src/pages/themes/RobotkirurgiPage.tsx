import { useEffect, useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import robotkirurgiHero from "@/assets/hero/robotkirurgi-hero.jpg";

interface PageProps {
  isChatOpen: boolean;
}

// Static fallback content
const staticContent = {
  title: "Robotassistert kirurgi",
  introTexts: [
    "Robotassistert kirurgi er en avansert, men skånsom form for behandling. Operasjonen gjennomføres som ved klassisk kikkhullskirurgi, gjennom små åpninger i huden. Ved robotkirurgi styrer kirurgen instrumentene elektronisk fra en konsoll ved siden av pasienten. Maskinholdte instrumenter gir svært presise bevegelser, og et høyoppløselig, stereoskopisk 3D-kamera gir kirurgen et usedvanlig godt bilde.",
    "Robotsystemet er et kraftig verktøy som gir kirurgen optimal oversikt og tilgang, slik at avanserte inngrep kan utføres med høy presisjon og minimal belastning.",
    "Robotassistert kirurgi har mange fordeler, og er ofte foretrukket ved kompliserte operasjoner, spesielt når man kan unngå åpen kirurgi (laparotomi). Det gir raskere rekonvalesens og lavere risiko for komplikasjoner, både under og etter operasjonen. De fleste pasientene kan reise hjem innen ett døgn etter behandlingen. Ved enkelte krefttilfeller, som kreft i livmor, kan robotkirurgi være et svært godt alternativ – nettopp fordi presisjon og skånsomhet er så viktig.",
  ],
  bulletPoints: [
    "Muskelknuter (fertilitetsbevarende kirurgi)",
    "Dyp endometriose",
    "Hysterektomi, også ved forstørret livmor",
    "Brokk",
    "Godartet forstørret prostata (RASP)",
    "Prostatakreft (RALP)",
  ],
  sections: [
    {
      heading: "Rask rehabilitering",
      paragraphs: [
        "Robotkirurgi er en moderne og skånsom operasjonsmetode hvor kirurgen opererer gjennom små snitt i stedet for et større operasjonssår. Dette gir mindre ubehag, redusert blødning, færre komplikasjoner og raskere tilheling, slik at du kommer deg trygt og godt gjennom hele operasjonsforløpet.",
        "En raskere vei til restitusjon: Mange pasienter kan reise hjem allerede dagen etter inngrepet. Allerede samme kveld er det mulig å spise, bevege seg og føle seg mer som seg selv igjen.",
        "Kortere sykemelding – raskere tilbake til hverdagen: Avhengig av hvilken type jobb og hvilket inngrep du har gjennomgått, kan du forvente en sykemeldingsperiode på 2–3 uker.",
      ],
    },
    {
      heading: "Presisjon som merkes",
      paragraphs: [
        "Med høyoppløselig 3D-kamera og avanserte instrumenter med stor presisjon har kirurgen svært god kontroll. Dette bidrar til skånsomhet og høy kvalitet i hvert inngrep.",
        "Ergonomi – også for kirurgen: Under robotkirurgi sitter kirurgen i en ergonomisk og komfortabel arbeidsstilling. Dette bidrar til økt konsentrasjon og mindre utmattelse.",
        "Erfarne spesialister – trygg behandling: Robotkirurgi hos oss utføres av spesialister innen urologi og gynekologi.",
      ],
    },
  ],
  testimonial: {
    text: "«Tilgjengelighet i en usikker periode har vært viktig. Dere svarer telefoner og mail raskt. Etter operasjonen ble jeg langt i fra glemt. Jeg kunne ta kontakt med dere langt utenfor det som var normal arbeidstid, og robotkirurgen sa jeg kunne ringe ham når som helst på døgnet. Jeg tror at min livssituasjon kanskje ikke ville vært så god som den er i dag dersom noen andre i Norge hadde utført inngrepet.»",
    author: "— Tom, 70 år",
  },
  faqs: [
    { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
    { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
    { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
    { question: "RASP", answer: "Robotassistert enkel prostatektomi (RASP) er et inngrep for godartet forstørret prostata. Operasjonen utføres robotassistert med høy presisjon." },
    { question: "Selskapet", answer: "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året." },
  ],
};

const RobotkirurgiPage = ({ isChatOpen }: PageProps) => {
  const navigate = useNavigate();
  const { data: sanityData } = useThemePage("robotkirurgi");

  // Use Sanity data with static fallback
  const title = sanityData?.title || staticContent.title;
  const heroImg = sanityData?.heroImage ? getImageUrl(sanityData.heroImage) : robotkirurgiHero;
  const introTexts = sanityData?.introTexts?.length ? sanityData.introTexts : staticContent.introTexts;
  const sections = sanityData?.sections?.length ? sanityData.sections : staticContent.sections;

  useEffect(() => {
    document.title = "Robotassistert kirurgi | CMedical";
  }, []);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Hero */}
      <section className="relative h-[30vh] min-h-[220px] overflow-hidden">
        <img src={heroImg} alt={title} className="w-full h-full object-cover" style={{ objectPosition: "center 40%" }} />
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
          
          {/* Intro */}
          {introTexts.map((text: string, i: number) => (
            <p key={i} className="text-base text-muted-foreground font-light leading-relaxed mb-6">
              {text}
            </p>
          ))}

          <p className="text-base text-foreground font-normal mb-4">Vi tilbyr robotassistert kirurgi innen blant annet:</p>
          <ul className="space-y-2 mb-6">
            {(sanityData?.sections?.[0]?.bulletPoints || staticContent.bulletPoints).map((item: string) => (
              <li key={item} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-dark mt-2 flex-shrink-0" />
                <span className="text-sm text-muted-foreground font-light">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-base text-muted-foreground font-light leading-relaxed mb-12">
            Hos oss i CMedical setter vi alltid pasienten i sentrum. Vårt mål er å tilby moderne, trygg og skreddersydd behandling – med minst mulig smerte, lav risiko og en rask vei tilbake til hverdagen.
          </p>

          {/* Rask rehabilitering */}
          {sections.map((section: any, sIdx: number) => (
            <div key={sIdx} className="mb-12">
              <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">{section.heading}</h2>
              {(section.paragraphs || []).map((p: string, pIdx: number) => (
                <p key={pIdx} className="text-base text-muted-foreground font-light leading-relaxed mb-6">
                  {p}
                </p>
              ))}
            </div>
          ))}

          {/* Testimonial */}
          <div className="bg-secondary/30 rounded-xl p-8 mb-12 border-l-4 border-foreground/20">
            <p className="text-foreground/70 font-light italic leading-relaxed mb-4">
              «Tilgjengelighet i en usikker periode har vært viktig. Dere svarer telefoner og mail raskt. Etter operasjonen ble jeg langt i fra glemt. Jeg kunne ta kontakt med dere langt utenfor det som var normal arbeidstid, og robotkirurgen sa jeg kunne ringe ham når som helst på døgnet. Jeg tror at min livssituasjon kanskje ikke ville vært så god som den er i dag dersom noen andre i Norge hadde utført inngrepet.»
            </p>
            <p className="text-sm text-muted-foreground">— Tom, 70 år</p>
          </div>

          {/* CTA */}
          <Button
            onClick={() => navigate("/booking")}
            className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-full font-light"
          >
            Bestill time
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>

          {/* FAQ */}
          <div className="mt-16">
            <h2 className="text-2xl font-normal text-foreground mb-8 text-center">
              Ofte stilte spørsmål
            </h2>
            <div className="border-t border-border rounded-lg bg-white overflow-hidden">
              {staticContent.faqs.map((faq, i) => (
                <FaqItem key={i} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 px-6 text-left hover:bg-secondary/30 transition-colors"
      >
        <span className="text-base font-normal text-foreground">{question}</span>
        {isOpen ? (
          <Minus className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        ) : (
          <Plus className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        )}
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-out ${isOpen ? "max-h-60 pb-5 px-6" : "max-h-0"}`}>
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed font-light pr-8">{answer}</p>
      </div>
    </div>
  );
};

export default RobotkirurgiPage;
