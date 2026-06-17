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

type Block = { heading?: string; text?: string; bold?: boolean };

// Static fallback content (current approved copy)
const staticContent = {
  title: "Ledende ekspertise. Personlig omsorg.",
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
  ] as Block[],
};

const About = ({ isChatOpen }: AboutProps) => {
  const navigate = useNavigate();
  const { specialists } = useSpecialistsData();
  const { data: sanityData } = useAboutPage();

  const title = sanityData?.title || staticContent.title;
  const heroImage = sanityData?.heroImage ? getImageUrl(sanityData.heroImage) : heroFamily;

  const bodyParagraphs: Block[] =
    sanityData?.sections?.length
      ? sanityData.sections.map((s: any) => ({ text: s.content }))
      : staticContent.bodyParagraphs;

  // Split content so the image sits between the first chapter and the rest –
  // mirroring the older letter-style layout.
  let splitIndex = bodyParagraphs.findIndex(
    (b, i) => i > 0 && b.heading
  );
  if (splitIndex === -1) splitIndex = Math.ceil(bodyParagraphs.length / 2);
  const introBlocks = bodyParagraphs.slice(0, splitIndex);
  const restBlocks = bodyParagraphs.slice(splitIndex);

  const seoTitle = "Om oss – Faglig trygghet og personlig omsorg";
  const seoDescription =
    "CMedical er Nordens ledende klinikk for gynekologi, fertilitet og urologi. Kvinnehelse er vårt strategiske satsningsområde. Siden 2002 har over 150 000 pasienter fått behandling hos oss.";

  useEffect(() => {
    document.title = `${seoTitle} | CMedical`;
  }, []);

  const renderBlock = (p: Block, i: number) => {
    if (p.heading) {
      return (
        <h2
          key={`h-${i}`}
          className="text-xl md:text-2xl font-light text-brand-dark pt-6 first:pt-0"
        >
          {p.heading}
        </h2>
      );
    }
    return (
      <p
        key={`p-${i}`}
        className={p.bold ? "text-brand-dark font-normal pt-2" : ""}
      >
        {p.text}
      </p>
    );
  };

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
            <header className="mb-8 pb-6 border-b border-brand-dark/10">
              <p className="text-muted-foreground text-xs mb-2">Om CMedical</p>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-brand-dark">
                {title}
              </h1>
            </header>

            <div className="space-y-5 text-brand-dark/80 text-[15px] md:text-base leading-[1.8] font-light">
              {introBlocks.map(renderBlock)}
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
              {restBlocks.map(renderBlock)}
            </div>

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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
              {specialists.slice(0, 8).map((specialist) => (
                <Link
                  to={`/spesialister/${specialist.slug}`}
                  key={specialist.slug}
                  className="group"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-brand-dark">
                    <img
                      src={specialist.image}
                      alt={specialist.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
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
