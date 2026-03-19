import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { CTASection } from "@/components/layout/CTASection";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroFamily from "@/assets/hero/hero-family.jpg";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { ClinicGrid } from "@/components/ClinicGrid";
import { useAboutPage } from "@/hooks/useSanity";
import { getImageUrl } from "@/lib/sanityClient";
import { PageSEO } from "@/components/seo/PageSEO";

interface AboutProps {
  isChatOpen: boolean;
}

// Static fallback content
const staticContent = {
  title: "Faglig trygghet og personlig omsorg – for din helse",
  introParagraphs: [
    "Helse handler om mer enn behandling. Det handler om å bli sett, forstått og fulgt opp – uten unødige forsinkelser eller usikkerhet underveis.",
    "CMedical er etablert på en tydelig erkjennelse: Mange opplever et helsevesen preget av ventetid, fragmenterte forløp og manglende kontinuitet. Vår rolle er å skape et alternativ – der høyspesialisert og tverrfaglig kompetanse kombineres med tilgjengelighet og ekte omsorg.",
    "Vi skal forene det fremste innen medisinsk presisjon med varme, respekt og tydelig kommunikasjon. Pasienten skal oppleve trygghet i hvert møte, forutsigbarhet i hvert steg og kvalitet i alle ledd.",
  ],
  bodyParagraphs: [
    { text: "Kvinnehelse er et strategisk satsningsområde i CMedical. Kvinners helse har i for stor grad vært underprioritert, både som del av folkeopplysning, medisinsk tilbud og i forskning. Derfor bygger vi et helhetlig og subspesialisert tilbud som følger kvinnen gjennom hele livsløpet – fra pubertet og fertilitet til barneønske og graviditet, barseltid og før, under og etter overgangsalder. Ekspertteam innen blant annet endometriose, infertilitet, vulvalidelser, fødselsskader og menopause sikrer direkte tilgang til riktig kompetanse – uten omveier.", bold: false },
    { text: "Ambisjonen er tydelig: Kvinnehelse for livet.", bold: true },
    { text: "Samtidig favner tilbudet bredt innen gynekologi, fertilitet, ortopedi og urologi – fra grundig utredning til avansert kirurgi. Tverrfaglige fagområder som osteopati, psykologi, sexologi og ernæring er integrert for å sikre en helhetlig tilnærming til både kropp og livssituasjon.", bold: false },
    { text: "Teknologi tas i bruk der den gir dokumentert verdi. Som landets eneste private klinikk med robotassistert kirurgi kombineres innovasjon med erfaring for å gi mer presise og skånsomme inngrep. Hos oss kommer du til den beste hjelpen – raskt.", bold: false },
    { text: "CMedical skal sette en ny standard for privat spesialisthelsetjeneste – der moderne teknologi, korte beslutningslinjer og høyeste kompetanse møtes i omgivelser preget av ro og verdighet.", bold: false },
    { text: "Dette er vårt løfte: Faglig trygghet og personlig omsorg – for din helse, i alle livets faser.", bold: true },
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
      {/* Letter-style content */}
      <article className="bg-brand-warm pt-20">
        <div className="container mx-auto px-6 md:px-16 py-10 md:py-14">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <header className="mb-8 pb-6 border-b border-brand-dark/10">
              <p className="text-muted-foreground text-xs mb-2">Om CMedical</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-brand-dark">
                {title}
              </h1>
            </header>

            {/* Main content - intro */}
            <div className="space-y-5 text-brand-dark/80 text-[15px] md:text-base leading-[1.8] font-light">
              {introParagraphs.map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="container mx-auto px-6 md:px-16 pb-10 md:pb-14">
          <div className="max-w-3xl mx-auto">
            <img 
              src={heroImage} 
              alt="Omsorg hos CMedical - Familie"
              className="w-full aspect-[3/2] object-cover object-[30%_20%]"
            />
          </div>
        </div>

        {/* Continued content */}
        <div className="container mx-auto px-6 md:px-16 pb-10 md:pb-14">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-5 text-brand-dark/80 text-[15px] md:text-base leading-[1.8] font-light">
              {bodyParagraphs.map((p: any, i: number) => (
                <p key={i} className={p.bold ? "text-brand-dark font-normal pt-2" : ""}>
                  {p.text || p}
                </p>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 pt-6 border-t border-brand-dark/10">
              <Button 
                className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-sm px-8 h-11 font-light"
                onClick={() => navigate('/booking')}
              >
                Book konsultasjon
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </article>

      <ClinicGrid />

      {/* Specialists section - dark themed */}
      <section className="bg-brand-dark py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-5xl mx-auto">
            <div className="mb-10">
              <p className="text-white/60 text-xs mb-3">Vårt team</p>
              <h2 className="text-2xl md:text-3xl font-light text-white mb-3">
                Møt våre spesialister
              </h2>
              <p className="text-white/70 font-light max-w-xl">
                Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {specialists.slice(0, 8).map((specialist) => (
                <Link
                  to={`/spesialister/${specialist.slug}`}
                  key={specialist.slug}
                  className="group"
                >
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-3 bg-brand-dark">
                    <img 
                      src={specialist.image} 
                      alt={specialist.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 saturate-[0.7] brightness-[0.95] contrast-[1.05]"
                    />
                    <div className="absolute inset-0 bg-brand-dark/15 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-normal text-white text-sm mb-0.5">{specialist.name}</h3>
                      <p className="text-white/70 text-xs font-light">
                        {specialist.title}
                        {specialist.subtitle && specialist.subtitle !== specialist.title && ` · ${specialist.subtitle}`}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-10">
              <Button 
                className="rounded-sm bg-transparent border border-white/30 text-white hover:bg-white hover:text-brand-dark transition-colors font-light"
                asChild
              >
                <Link to="/spesialister">
                  Se alle {specialists.length} spesialister
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

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
