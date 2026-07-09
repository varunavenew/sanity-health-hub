import { useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { EditableAutoScope } from "@/components/editable/EditableAutoScope";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import kvinnehelseHero from "@/assets/hero/kvinnehelse-hero.jpg";
import { useThemePage } from "@/hooks/useSanity";
import { PageSEO } from "@/components/seo/PageSEO";
import { VideoPlayer } from "@/components/ui/video-player";

interface PageProps {
 isChatOpen: boolean;
}

const staticLifePhases = [
 {
 title: "Ung kvinne",
 text: "Menstruasjonsutfordringer, prevensjon, PMOS, endometriose, smerter og hormonelle plager.",
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
 <PageLayout isChatOpen={isChatOpen}><EditableAutoScope>
 <PageSEO
 title={page?.seo?.metaTitle || "Kvinnehelse for livet – Helhetlig kvinnehelse gjennom alle livsfaser"}
 description={page?.seo?.metaDescription || "CMedical tilbyr helhetlig kvinnehelse fra pubertet til senior. Gynekologi, fertilitet, hormonbehandling og tverrfaglig oppfølging – av ledende spesialister."}
 canonical="/kvinnehelse"
 breadcrumbs={[
 { name: "Hjem", path: "/" },
 { name: "Kvinnehelse", path: "/kvinnehelse" },
 ]}
 />
 {/* Hero — title on top, video full-width below (samme mønster som /om-oss) */}
 <header className="bg-brand-warm pt-24 md:pt-28 pb-10 md:pb-14">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-3xl mx-auto">
 <p className="text-xs text-foreground/60 font-light mb-4">
 Konseptfilm
 </p>
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

 {/* Video under header */}
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


 {/* Content */}
 <section className="pt-6 md:pt-8 pb-16 md:pb-24 bg-background">
  <div className="container mx-auto px-6 md:px-16">
  <div className="max-w-3xl mx-auto">
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
 <div className="w-1.5 h-1.5 rounded-2xl md:rounded-full bg-brand-dark mt-2 flex-shrink-0" />
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
 className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-2xl md:rounded-full font-light"
 >
 {ctaText}
 <ArrowRight className="ml-2 w-4 h-4" />
 </Button>
  </div>
  </div>
  </section>
 </EditableAutoScope></PageLayout>
 );
};

export default KvinnehelsePage;
