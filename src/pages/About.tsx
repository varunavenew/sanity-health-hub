import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { CTASection } from "@/components/layout/CTASection";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroFamily from "@/assets/hero/hero-family.jpg";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { SpecialistsSection } from "@/components/homepage/SpecialistsSection";
import { ClinicGrid } from "@/components/ClinicGrid";
import { useAboutPage } from "@/hooks/useSanity";
import { getImageUrl } from "@/lib/sanityClient";
import { PageSEO } from "@/components/seo/PageSEO";

interface AboutProps {
  isChatOpen: boolean;
}

// Static fallback content
const staticContent = {
  title: "Ledende ekspertise. Personlig omsorg.",
  introParagraphs: [],
  bodyParagraphs: [
    { heading: "Historien bak CMedical" },
    { text: "CMedical ble til ut av personlige erfaringer – og en grunnleggende tro på at pasienter fortjener bedre." },
    { text: "Da seriegründer Gard Lauvsnes fikk prostatakreft som 50-åring, opplevde han selv hvor mangelfull oppfølgingen rundt behandlingen kunne være. Han var overbevist om at menn fortjente noe annet – og noe mer. Sammen med dedikerte urologer etablerte han Coloesseum Mann, forløperen til CMedical, og ble først i Norge med å tilby robotassistert prostatektomi ved prostatakreft. Kort tid etter sluttet et engasjert lag av ortopeder seg til reisen, med samme ambisjon: å tilby spisset kompetanse der pasienten trenger det mest." },
    { text: "Parallelt bar gynekolog Madeleine Engen på en visjon om å bygge det kvinnehelsetilbudet hun selv hadde manglet som ung. Etter ni år med feilbehandlinger og utallige gynekologbesøk møtte hun endelig riktig kompetanse og ble helt frisk. Den erfaringen ble drivkraften. Sammen med Gard bygget hun Nordens første helhetlige kvinnehelsetilbud: tverrfaglige ekspertteam innen endometriose og adenomyose, fødselsskader, overgangsalder, vulvalidelser, infertilitet, samt oppfølging i svangerskap og barseltid. Et sted for kvinner gjennom hele livsløpet – fra pubertet og graviditetsønske til tiden under og etter menopause. Slik kvinnehelse burde være." },
    { heading: "Fordi god helse ikke bør vente" },
    { text: "Mange opplever i dag et helsevesen preget av lange ventetider, fragmenterte pasientforløp og manglende kontinuitet. Vår rolle er å skape et reelt alternativ – der høyspesialisert og tverrfaglig kompetanse kombineres med tilgjengelighet og ekte omsorg. Pasienten skal oppleve trygghet i hvert møte, forutsigbarhet i hvert steg og kvalitet i alle ledd." },
    { heading: "Håndplukket kompetanse – med hjertet på rett sted" },
    { text: "Hos CMedical er hver eneste medarbeider håndplukket, og alle deler et felles kjennetegn: et ekte og dypt engasjement for helse. Vi stiller like høye krav til faglig presisjon som til omtanke, respekt og evnen til å lytte. For oss er kompetanse og omsorg likestilte verdier – det ene gir ingen mening uten det andre. Det er denne kombinasjonen som gjør at pasienten kommer direkte til riktig ekspertise, uten forsinkelser, og blir møtt som et helt menneske." },
    { heading: "Kvinnehelse for livet" },
    { text: "Kvinners helse har i for stor grad vært underprioritert – i folkeopplysning, medisinsk tilbud og forskning. Derfor er kvinnehelse et strategisk satsningsområde hos CMedical. Vi tilbyr et helhetlig og subspesialisert tilbud som følger kvinnen gjennom hele livsløpet: ekspertteam innen endometriose, infertilitet, vulvalidelser, fødselsskader og menopause sikrer direkte tilgang til riktig kompetanse. Ambisjonen er tydelig: Kvinnehelse for livet." },
    { heading: "Et helhetlig syn på helse" },
    { text: "Vi tilbyr spesialiserte tjenester innen gynekologi, fertilitet, ortopedi og urologi – fra konsultasjon og utredning til kirurgisk behandling. I tillegg er osteopati, psykologi, sexologi og ernæring integrert i tilbudet, slik at vi ser sammenhengene mellom kropp, sinn og livsstil og kan tilpasse behandlingen til hele mennesket." },
    { text: "Der teknologi gir dokumenterte fordeler, tar vi den i bruk. Som landets eneste private klinikk med robotassistert kirurgi kombinerer vi innovasjon med erfaring for mer presise og skånsomme inngrep – med raskere rehabilitering som resultat." },
    { heading: "Rom for ro og verdighet" },
    { text: "Klinikkene våre er utformet for å skape trygghet og verdighet, med varme og diskre omgivelser og medarbeidere som har tid til å se og lytte. Vi jobber også strategisk for å gjøre spesialisert helsehjelp tilgjengelig for flere – gjennom effektive pasientforløp og konkurransedyktige priser, uten å gå på kompromiss med kvalitet." },
    { heading: "Vår ambisjon" },
    { text: "CMedical skal sette en ny standard for privat spesialisthelsetjeneste i Norge – og etter hvert internasjonalt. Med moderne teknologi, korte beslutningslinjer, solid kompetanse og varme omgivelser skaper vi et helsetilbud der faglig trygghet og personlig omsorg alltid går hånd i hånd – i alle livets faser.", bold: true },
  ],
};

const About = ({ isChatOpen }: AboutProps) => {
  const navigate = useNavigate();
  const { specialists } = useSpecialistsData();
  const { data: sanityData } = useAboutPage();

  // Use Sanity data if available, otherwise static fallback
  const title = sanityData?.title || staticContent.title;
  const heroImage = sanityData?.heroImage ? getImageUrl(sanityData.heroImage) : heroFamily;
  
  // Map Sanity sections back into paragraph structure, or use static
  const introParagraphs = sanityData?.sections?.length
    ? sanityData.sections.slice(0, 3).map((s: any) => s.content)
    : staticContent.introParagraphs;
  
  const bodyParagraphs = sanityData?.sections?.length && sanityData.sections.length > 3
    ? sanityData.sections.slice(3).map((s: any) => ({ text: s.content, bold: false }))
    : staticContent.bodyParagraphs;

  const seoTitle = "Om oss – Faglig trygghet og personlig omsorg";
  const seoDescription = "CMedical er Nordens ledende klinikk for gynekologi, fertilitet og urologi. Kvinnehelse er vårt strategiske satsningsområde. Siden 2002 har over 150 000 pasienter fått behandling hos oss.";

  useEffect(() => {
    document.title = `${seoTitle} | CMedical`;
  }, []);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={seoTitle}
        description={seoDescription}
        canonical="/om-oss"
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Om oss", path: "/om-oss" },
        ]}
      />
      {/* HERO — full-bleed split 50/50, image fills the right half */}
      <header className="bg-brand-warm pt-24 lg:pt-0">
        <div className="grid lg:grid-cols-2 min-h-[640px] lg:min-h-[720px]">
          {/* Left — eyebrow + title + intro */}
          <div className="flex flex-col justify-center page-edge-text-left py-12 lg:py-20">
            <div className="max-w-xl w-full">
              <p className="text-xs font-light text-brand-dark/60 mb-6">Om CMedical</p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-brand-dark leading-[1.05]">
                {title}
              </h2>
              {introParagraphs.length > 0 && (
                <div className="space-y-5 text-brand-dark/80 text-base md:text-lg leading-relaxed font-light mb-10">
                  {introParagraphs.map((p: string, i: number) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              )}
              <Button
                className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-sm px-8 h-11 font-light"
                onClick={() => navigate('/booking')}
              >
                Book konsultasjon
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right — image fills the entire half */}
          <div className="relative min-h-[420px] lg:min-h-full bg-secondary/40">
            <img
              src={heroImage}
              alt="Omsorg hos CMedical - Familie"
              className="absolute inset-0 w-full h-full object-cover object-[30%_20%]"
            />
          </div>
        </div>
      </header>

      {/* Continued content */}
      <article className="bg-brand-warm">
        <div className="container mx-auto px-6 md:px-16 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <div className="text-brand-dark/80 text-[15px] md:text-base leading-[1.8] font-light">
              {bodyParagraphs.map((p: any, i: number) =>
                p.heading ? (
                  <h2
                    key={i}
                    className="text-2xl md:text-3xl font-light text-brand-dark mt-16 first:mt-0 mb-5"
                  >
                    {p.heading}
                  </h2>
                ) : (
                  <p key={i} className={`mt-5 ${p.bold ? "text-brand-dark font-normal" : ""}`}>
                    {p.text || p}
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      </article>

      <ClinicGrid />

      <SpecialistsSection />


      <CTASection
        title="Ta vare på livet og underlivet"
        subtitle="Bli tatt på alvor – med faglig trygghet, respekt og helhetlig oppfølging"
        primaryCTA="Book time nå"
        secondaryCTA="Kontakt oss"
        secondaryLink="/contact"
      />
    </PageLayout>
  );
};

export default About;
