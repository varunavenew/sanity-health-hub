import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { VideoPlayer } from "@/components/ui/video-player";
import { ServicesListSection } from "@/components/layout/ServicesListSection";
import { SplitHero } from "@/components/layout/SplitHero";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import kvinnehelseHero from "@/assets/hero/kvinnehelse-hero.jpg";
import heroClinicLounge from "@/assets/hero/hero-clinic-lounge.jpg";

/**
 * KvinnehelseMaster – Mastermal for temasider.
 *
 * Viser BEGGE hero-varianter (med og uten video) og inkluderer alle
 * seksjoner en temaside kan trenge: intro, livsfaser, tjenesteliste,
 * spesialister, og BookingCTA før footer. Bruk som utgangspunkt og fjern
 * det du ikke trenger.
 */

const lifePhases = [
 { title: "Ung kvinne", text: "Menstruasjonsutfordringer, prevensjon, PCOS, endometriose, smerter og hormonelle plager." },
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
 <span className="inline-flex items-center px-2 py-0.5 rounded bg-brand-dark text-brand-light text-[10px] uppercase">
 Seksjon
 </span>
 <span className="text-xs text-foreground/70 font-light">{children}</span>
 </div>
 </div>
);

const HeroWithVideo = ({ title, ctaLink, ctaText, navigate }: any) => (
 <header className="bg-brand-warm pt-16 md:pt-20 pb-10 md:pb-14">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-3xl mx-auto">
 <p className="text-xs text-foreground/60 font-light mb-4">Konseptfilm</p>
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
 <div className="container mx-auto px-6 md:px-16 mt-10 md:mt-14">
 <div className="max-w-5xl mx-auto">
 <VideoPlayer
 thumbnailUrl="/videos/kvinnehelse-konsept-poster.jpg"
 videoUrl="/videos/kvinnehelse-konsept.mp4"
 title="Kvinnehelse gjennom hele livet"
 className="w-full aspect-video"
 />
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
 <PageLayout isChatOpen={isChatOpen}>
 {/* ───────────── Hero – Variant A: med video ───────────── */}
 <MasterLabel>Hero – Variant A: med video (samme mønster som /om-oss)</MasterLabel>
 <HeroWithVideo title={title} ctaLink={ctaLink} ctaText={ctaText} navigate={navigate} />

 {/* ───────────── Hero – Variant B: uten video (split-screen) ───────────── */}
 <MasterLabel>Hero – Variant B: uten video (split-screen, samme som behandlingssider)</MasterLabel>
 <SplitHero
 eyebrow="Tema"
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
 <div className="w-1.5 h-1.5 rounded-full bg-brand-dark mt-2 flex-shrink-0" />
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

 {/* ───────────── Tjenester (liste) ───────────── */}
 <MasterLabel>Tjenester – liste med relaterte behandlinger</MasterLabel>
 <ServicesListSection
 eyebrow="Tjenester"
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
 <p className="text-xs text-foreground/60 mb-5">Hvorfor CMedical</p>
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

 {/* ───────────── BookingCTA før footer ───────────── */}
 <MasterLabel>BookingCTA – står alltid like over footer</MasterLabel>
 <BookingCTA />
 </PageLayout>
 );
};

export default KvinnehelseMaster;
