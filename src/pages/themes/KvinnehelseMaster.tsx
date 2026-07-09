import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { EditableAutoScope } from "@/components/editable/EditableAutoScope";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/ui/video-player";
import { ServicesListSection } from "@/components/layout/ServicesListSection";
import { SplitHero } from "@/components/layout/SplitHero";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { RichContentSection, type RichBlock } from "@/components/themes/RichContentSection";
import { FaqSection } from "@/components/layout/FaqSection";
import { ExpertAreasSection, type ExpertArea } from "@/components/themes/ExpertAreasSection";
import { ProcessStepsSection } from "@/components/themes/ProcessStepsSection";
import kvinnehelseHero from "@/assets/hero/kvinnehelse-hero.jpg";
import heroClinicLounge from "@/assets/hero/hero-clinic-lounge.jpg";
import expertEndometriose from "@/assets/hero/gynecology-hero.jpg";
import expertBekkenbunn from "@/assets/hero/hero-pregnancy.jpg";
import expertOvergangsalder from "@/assets/hero/cmedical-hero-2.jpg";
import expertVulva from "@/assets/hero/kvinnehelse-hero.jpg";

const expertAreas: ExpertArea[] = [
  {
    title: "Endometriose",
    desc: "Vi er ledende i Nord-Europa på endometriosebehandling med robotassistert kirurgi — også de kompliserte tilfellene.",
    href: "/behandlinger/gynekologi/endometriose",
    image: expertEndometriose,
  },
  {
    title: "Fødselsskader og bekkenbunnshelse",
    desc: "Fra rifter til urinlekkasje — vi behandler både i samtale og kirurgisk når det trengs. Du fortjener å bli hørt.",
    href: "/behandlinger/gynekologi/urinlekkasje",
    image: expertBekkenbunn,
  },
  {
    title: "Overgangsalder",
    desc: "Trygg og oppdatert hormonbehandling — basert på din historie og dine ønsker. Vi tar oss tid til samtalen.",
    href: "/behandlinger/gynekologi/overgangsalder",
    image: expertOvergangsalder,
  },
  {
    title: "Vulvasmerter",
    desc: "Smerter og ubehag i vulva blir ofte oversett. Hos oss møter du spesialister som forstår — og finner svar.",
    href: "/behandlinger/gynekologi/vulvalidelser",
    image: expertVulva,
  },
];

/**
 * KvinnehelseMaster – Mastermal for temasider.
 *
 * Viser BEGGE hero-varianter (med og uten video) og inkluderer alle
 * seksjoner en temaside kan trenge: intro, livsfaser, tjenesteliste,
 * spesialister, og BookingCTA før footer. Bruk som utgangspunkt og fjern
 * det du ikke trenger.
 */

const lifePhases = [
 { title: "Ung kvinne", text: "Menstruasjonsutfordringer, prevensjon, PMOS, endometriose, smerter og hormonelle plager." },
 { title: "Fertil alder", text: "Prevensjonsveiledning, fertilitetsvurdering, graviditet, barseloppfølging og bekkenhelse." },
 { title: "Midtliv og overgangsalder", text: "Perimenopause og menopause, hormonbehandling, søvnproblemer, energitap, beinskjørhet og hjertehelse." },
 { title: "Senior kvinnehelse", text: "Forebygging, underlivsplager, inkontinens, seksualhelse og helhetlig oppfølging av kroniske tilstander." },
];

const introTexts = [
 "Kropp, hormoner, livssituasjon og helsebehov endrer seg gjennom livet. Likevel opplever mange at symptomer bagatelliseres, at helsetilbudet er fragmentert, eller at man selv må koordinere egen oppfølging.",
 "Hos CMedical møter vi kvinnehelse helhetlig. Med medisinsk kompetanse, tverrfaglig samarbeid og moderne diagnostikk tilbyr vi et sammenhengende helsetilbud – fra ungdomstid til seniortilværelse.",
];

const relatedServices = [
 { title: "Gynekologi", desc: "Konsultasjon, undersøkelse og behandling hos erfarne gynekologer.", href: "/behandlinger/gynekologi" },
 { title: "Fertilitet", desc: "Utredning og behandling for par og enslige som ønsker barn.", href: "/behandlinger/fertilitet" },
 { title: "Overgangsalder", desc: "Helhetlig oppfølging av hormonelle endringer og plager.", href: "/behandlinger/gynekologi/overgangsalder" },
 { title: "Fertilitetssjekk", desc: "Få oversikt over egen fruktbarhet før du planlegger barn.", href: "/behandlinger/fertilitet/fertilitetssjekk" },
 { title: "Gynekologisk undersøkelse", desc: "Trygg, grundig og diskré undersøkelse.", href: "/behandlinger/gynekologi/gynekologisk-undersokelse" },
 { title: "Tverrfaglige tilbud", desc: "Samarbeid mellom spesialister for sammensatte behov.", href: "/tverrfaglige-tilbud" },
];

const MasterLabel = ({ children }: { children: React.ReactNode }) => (
 <div className="bg-brand-light border-y border-brand-dark/10">
 <div className="container mx-auto px-6 md:px-16 py-3 flex items-center gap-3">
 <span className="text-xs text-foreground/70 font-light">{children}</span>
 </div>
 </div>
);

const HeroWithVideo = ({ title, ctaLink, ctaText, navigate }: any) => (
  <header className="bg-brand-warm pt-16 md:pt-20 pb-10 md:pb-14">
    <div className="container mx-auto px-6 md:px-16">
      <div className="max-w-5xl mx-auto mb-10 md:mb-14">
        <VideoPlayer
          thumbnailUrl="/videos/kvinnehelse-konsept-poster.jpg"
          videoUrl="/videos/kvinnehelse-konsept.mp4"
          title="Kvinnehelse gjennom hele livet"
          className="w-full aspect-video"
        />
      </div>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-[1.1] mb-6">
          {title}
        </h1>
        <p className="text-base text-foreground/70 font-light leading-relaxed max-w-xl mb-8">
          En kort film om hvordan vi følger kvinner gjennom alle livets faser – med faglig trygghet og personlig omsorg.
        </p>
        <Button variant="cta" size="lg" onClick={() => navigate(ctaLink)}>
          {ctaText}
          <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </div>
  </header>
);

const KvinnehelseMaster = ({ isChatOpen }: { isChatOpen: boolean }) => {
 const navigate = useNavigate();
 const title = "Kvinnehelse for livet";
 const ctaText = "Bestill time";
 const ctaLink = "/booking";

 useEffect(() => {
 document.title = `Mastermal: Temaside | CMedical`;
 }, []);

 return (
 <PageLayout isChatOpen={isChatOpen}><EditableAutoScope>
 {/* ───────────── Hero – Variant A: med video ───────────── */}
 <MasterLabel>Hero – Variant A: med video (samme mønster som /om-oss)</MasterLabel>
 <HeroWithVideo title={title} ctaLink={ctaLink} ctaText={ctaText} navigate={navigate} />

 {/* ───────────── Hero – Variant B: uten video (split-screen) ───────────── */}
 <MasterLabel>Hero – Variant B: uten video (split-screen, samme som behandlingssider)</MasterLabel>
 <SplitHero
 title={title}
 description="Helhetlig oppfølging fra ungdomstid til seniortilværelse – med erfarne spesialister og kort ventetid."
 image={kvinnehelseHero}
 imageAlt="Kvinnehelse hos CMedical"
 primaryCta={{ label: ctaText, to: ctaLink }}
 />

 {/* ───────────── Innholds-seksjon: intro + livsfaser ───────────── */}
 <MasterLabel>Innhold – intro, tekstblokker og livsfaser</MasterLabel>
 <section className="pt-10 md:pt-14 pb-16 md:pb-24 bg-background">
 <div className="container mx-auto px-4 md:px-8 max-w-3xl">
 {introTexts.map((text, i) => (
 <p key={i} className="text-base text-muted-foreground font-light leading-relaxed mb-6">
 {text}
 </p>
 ))}

 <div className="mb-12" />

 <h2 className="text-2xl md:text-3xl font-light text-foreground mb-6">En helhetlig tilnærming</h2>
 <p className="text-base text-muted-foreground font-light leading-relaxed mb-6">
 Vi vet at helseutfordringer ofte henger sammen. Hormonelle endringer kan påvirke psykisk helse.
 Svangerskap kan gi senvirkninger. Overgangsalder kan påvirke både hjertehelse, søvn og livskvalitet.
 </p>
 <ul className="space-y-2 mb-12">
 {[
 "Gynekologisk oppfølging",
 "Fertilitetsutredning og -behandling",
 "Hormonvurdering og behandling",
 "Forebyggende helsekontroller",
 "Tverrfaglig støtte innen ernæring, psykisk helse og livsstil",
 ].map((item) => (
 <li key={item} className="flex items-start gap-3">
 <div className="w-1.5 h-1.5 rounded-2xl md:rounded-full bg-brand-dark mt-2 flex-shrink-0" />
 <span className="text-sm text-muted-foreground font-light">{item}</span>
 </li>
 ))}
 </ul>

 <h2 className="text-2xl md:text-3xl font-light text-foreground mb-8">Livsfaser vi følger</h2>
 <div className="space-y-8 mb-12">
 {lifePhases.map((phase) => (
 <div key={phase.title}>
 <h3 className="text-lg font-normal text-foreground mb-2">{phase.title}</h3>
 <p className="text-sm text-muted-foreground font-light leading-relaxed">{phase.text}</p>
 </div>
 ))}
 </div>
 </div>
 </section>

  {/* ───────────── Tjeneste-teaser – samme mønster som "Tjenesten i denne saken" ───────────── */}
  <MasterLabel>Tjeneste-teaser – kort med bilde, tekst og lenke (samme mønster som "Tjenesten i denne saken")</MasterLabel>
  <section className="bg-brand-light py-16 md:py-24 border-t border-foreground/10">
    <div className="container mx-auto px-6 md:px-16">
      <div className="grid lg:grid-cols-2 gap-14 lg:gap-24 items-center max-w-6xl mx-auto">
        <div>
          <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] mb-5">
            Gynekologisk utredning
          </h2>
          <p className="text-base font-light text-foreground/80 leading-relaxed max-w-md mb-7">
            Grundig samtale og undersøkelse hos erfaren gynekolog. Ingen henvisning nødvendig — du får ofte time innen få dager.
          </p>
          <ul className="space-y-2 mb-8">
            {[
              "Pris fra 2 500 kr",
              "Dekkes av de fleste helseforsikringer",
              "Konsultasjon innen 1–3 dager",
            ].map((b) => (
              <li key={b} className="text-sm font-light text-foreground/75">· {b}</li>
            ))}
          </ul>
          <a
            href="/behandlinger/gynekologi"
            className="inline-flex items-center gap-2 text-sm font-normal text-foreground border-b border-foreground pb-1 hover:gap-3 transition-all"
          >
            Se hele tjenesten
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </a>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
          <img
            src={heroClinicLounge}
            alt="Gynekologisk utredning hos CMedical"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </section>

  {/* ───────────── Spesialistområder – kortgrid med bilde + tittel + tekst ───────────── */}
  <MasterLabel>Spesialistområder – kortgrid (samme som "Eksperter som jobber..." på gynekologisiden)</MasterLabel>
  <ExpertAreasSection
    title="Eksperter som jobber med det de kan aller best."
    description="Hos oss møter du gynekologer som har spesialisert seg dypt innenfor sitt fagfelt. Det betyr at du får riktig kompetanse fra første konsultasjon — uten omveier."
    items={expertAreas}
  />

  {/* ───────────── Prosess – nummererte trinn (samme mønster som /forsikring) ───────────── */}
  <MasterLabel>Prosess – nummererte trinn (samme som "Slik bruker du forsikringen")</MasterLabel>
  <ProcessStepsSection
    title="Slik kommer du i gang"
    steps={[
      { num: "1", title: "Bestill time", desc: "Velg tjeneste og spesialist online" },
      { num: "2", title: "Forberedelse", desc: "Du får informasjon før timen" },
      { num: "3", title: "Konsultasjon", desc: "Trygg samtale med spesialist" },
      { num: "4", title: "Oppfølging", desc: "Plan og videre behandling" },
    ]}
  />

  {/* ───────────── Tjenester (liste) ───────────── */}
 <MasterLabel>Tjenester – liste med relaterte behandlinger</MasterLabel>
 <ServicesListSection
 title="Relaterte tjenester innen kvinnehelse"
 description="Et utvalg behandlinger og utredninger som hører inn under dette temaet."
 items={relatedServices}
 />

 {/* ───────────── Tekst-seksjon (valgfri) – split tekst + bilde ───────────── */}
 <MasterLabel>Tekstseksjon – split tekst + bilde (samme som "Det beste fra to klinikker")</MasterLabel>
 <section className="bg-background">
 <div className="grid lg:grid-cols-12">
 <div className="lg:col-span-7 px-6 md:px-16 lg:px-20 py-20 lg:py-28">
 <div className="max-w-xl">
 <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-[1.1] text-foreground mb-6">
 Et helhetlig tilbud — samlet på ett sted.
 </h2>
 <p className="text-base font-light text-muted-foreground leading-relaxed mb-12">
 Bruk denne seksjonen til å fortelle historien bak temaet — bakgrunn, filosofi eller hva som gjør tilbudet vårt unikt. Tekst kan kombineres med en nummerert liste eller stå alene.
 </p>
 <div className="divide-y divide-border/60 border-t border-border/60">
 {[
 { n: "01", title: "Et trygt sted å starte", desc: "Klinikk og kompetanse under samme tak — ingen lange transporter, ingen mellommenn." },
 { n: "02", title: "Ledende kompetanse", desc: "Spesialister med erfaring fra Rikshospitalet og internasjonale sentre." },
 { n: "03", title: "Tett oppfølging", desc: "Vi følger deg før, under og etter — også gjennom de vanskelige beskjedene." },
 ].map((step) => (
 <div key={step.n} className="grid grid-cols-12 gap-4 py-6">
 <div className="col-span-2 md:col-span-1 text-xs font-light text-foreground/60 pt-1">{step.n}</div>
 <div className="col-span-10 md:col-span-11">
 <h3 className="text-base font-normal text-foreground mb-1.5">{step.title}</h3>
 <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-md">{step.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 <div className="lg:col-span-5 relative bg-secondary/40 min-h-[420px] lg:min-h-full overflow-hidden">
 <img src={heroClinicLounge} alt="CMedical klinikk" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
 </div>
 </div>
 </section>

 {/* ───────────── Spesialister – samme presentasjon som fertilitetssiden ───────────── */}
 <MasterLabel>Spesialister – samme karusell som på fertilitetssiden</MasterLabel>
 <SpecialistsScroller
 title="Spesialistene som følger deg."
 seeAllHref="/spesialister"
 />

  {/* ───────────── FAQ – ofte stilte spørsmål ───────────── */}
  <MasterLabel>FAQ – ofte stilte spørsmål (samme komponent som på behandlingssider)</MasterLabel>
  <FaqSection
    title="Ofte stilte spørsmål"
    faqs={[
      { id: "1", question: "Trenger jeg henvisning fra fastlege?", answer: "Nei, du kan bestille time direkte hos oss uten henvisning. Du betaler selv, eller via forsikring." },
      { id: "2", question: "Hvor lang er ventetiden?", answer: "Som regel får du time innen 1–3 dager. Du ser tilgjengelige tider direkte i bookingen." },
      { id: "3", question: "Dekker forsikringen min konsultasjon hos dere?", answer: "Vi har avtale med de fleste store helseforsikringsselskapene i Norge. Sjekk med ditt selskap, eller kontakt oss så hjelper vi deg." },
      { id: "4", question: "Hva koster en konsultasjon?", answer: "Prisene varierer etter tjeneste og spesialist. Du finner oppdaterte priser på prissiden vår." },
    ]}
  />

 {/* ───────────── BookingCTA før footer ───────────── */}
 <MasterLabel>BookingCTA – står alltid like over footer</MasterLabel>
 <BookingCTA />
 </EditableAutoScope></PageLayout>
 );
};

export default KvinnehelseMaster;
