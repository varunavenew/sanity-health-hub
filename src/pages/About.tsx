import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { CTASection } from "@/components/layout/CTASection";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAboutPage, useSpecialists } from "@/hooks/useSanity";
import { specialists as staticSpecialists } from "@/data/specialists";
import { ClinicGrid } from "@/components/ClinicGrid";
import cmedicalHands from "@/assets/hero/cmedical-hands.jpg";

interface AboutProps {
  isChatOpen: boolean;
}

const About = ({ isChatOpen }: AboutProps) => {
  const navigate = useNavigate();
  const { data: page } = useAboutPage();
  const { data: sanitySpecialists } = useSpecialists();

  const specialists = sanitySpecialists?.length ? sanitySpecialists : staticSpecialists;
  const heroImage = page?.heroImage || cmedicalHands;

  useEffect(() => {
    document.title = "Om oss | CMedical - Nordens ledende klinikk for livet og underlivet";
  }, []);

  // Fallback content sections
  const sections = page?.sections || [
    { title: "", content: "CMedical er her for mennesker som ønsker trygg og spesialisert hjelp for kroppen og underlivet – uansett kjønn, livssituasjon eller behov. Vi har et særlig engasjement for kvinnehelse. Samtidig møter vi også menn med samme faglige omtanke, og ser helse i et helhetlig perspektiv – særlig når det gjelder fertilitet, som berører alle som ønsker eller forsøker å skape liv." },
    { title: "", content: "Hos oss skal du føle deg ivaretatt fra første kontakt. Vi tilbyr utredning og behandling der medisinsk presisjon kombineres med trygghet, respekt og rom for spørsmål. Målet er at du skal forstå prosessen, oppleve forutsigbarhet og få den hjelpen som passer din kropp og din livsfase." },
    { title: "", content: "Behandlingen utføres av erfarne spesialister som samarbeider tett i tverrfaglige miljøer. Det gir deg presise vurderinger, skånsomme inngrep og god oppfølging gjennom hele forløpet." },
    { title: "", content: "Vi vet at rammene rundt behandlingen påvirker opplevelsen. Derfor møter du moderne klinikker innredet i varme toner, rolige omgivelser og ansatte som setter av nødvendig tid til deg." },
    { title: "", content: "Vi ønsker at flere skal ha tilgang til spesialisthelsetjenester. Derfor tilrettelegger vi for behandling til priser som gjør det mulig å få kvalifisert hjelp uten at det går på bekostning av omsorg eller kvalitet." },
    { title: "", content: "Hos CMedical handler alt om at du skal bli tatt på alvor – med faglig trygghet, verdighet og helhetlig støtte gjennom hele behandlingen." },
  ];

  const ctaData = page?.cta || {
    title: "Ta vare på livet og underlivet",
    subtitle: "Bli tatt på alvor – med faglig trygghet, respekt og helhetlig oppfølging",
    primaryCta: "Book time nå",
    secondaryCta: "Kontakt oss",
    secondaryLink: "/contact",
  };

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <article className="bg-brand-warm pt-20">
        <div className="container mx-auto px-6 md:px-16 py-10 md:py-14">
          <div className="max-w-2xl mx-auto">
            <header className="mb-8 pb-6 border-b border-brand-dark/10">
              <p className="text-brand-dark/40 text-xs tracking-[0.15em] mb-2">Om CMedical</p>
              <h1 className="text-3xl md:text-4xl font-light text-brand-dark">
                {page?.title || "Livet og underlivet"}
              </h1>
            </header>
            <div className="space-y-4 text-brand-dark/75 text-[15px] leading-[1.75] font-light">
              {sections.slice(0, 2).map((s: any, i: number) => (
                <p key={i}>{s.content}</p>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 md:px-16 pb-10 md:pb-14">
          <div className="max-w-2xl mx-auto">
            <img src={heroImage} alt="Omsorg hos CMedical" className="w-full aspect-[3/2] object-cover" />
          </div>
        </div>

        <div className="container mx-auto px-6 md:px-16 pb-10 md:pb-14">
          <div className="max-w-2xl mx-auto">
            <div className="space-y-4 text-brand-dark/75 text-[15px] leading-[1.75] font-light">
              {sections.slice(2).map((s: any, i: number) => (
                <p key={i} className={i === sections.slice(2).length - 1 ? "text-brand-dark font-normal pt-2" : ""}>
                  {s.content}
                </p>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-brand-dark/10">
              <Button className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-sm px-8 h-11 font-light" onClick={() => navigate('/booking')}>
                Book konsultasjon<ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </article>

      <ClinicGrid />

      {/* Specialists section */}
      <section className="bg-brand-dark py-16 md:py-24">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-white/50 text-xs tracking-[0.15em] mb-3">Vårt team</p>
              <h2 className="text-2xl md:text-3xl font-light text-white mb-4">Møt våre spesialister</h2>
              <p className="text-white/60 font-light max-w-xl mx-auto">Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {specialists.slice(0, 8).map((specialist: any) => (
                <Link to={`/spesialister/${specialist.slug}`} key={specialist.slug} className="group">
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-3 bg-white/5">
                    <img src={specialist.image} alt={specialist.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-normal text-white text-sm mb-0.5">{specialist.name}</h3>
                      <p className="text-white/70 text-xs font-light">{specialist.title}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10">
              <Button className="rounded-sm bg-transparent border border-white/30 text-white hover:bg-white hover:text-brand-dark transition-colors font-light" asChild>
                <Link to="/spesialister">
                  Se alle {specialists.length} spesialister<ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title={ctaData.title}
        subtitle={ctaData.subtitle}
        primaryCTA={ctaData.primaryCta}
        secondaryCTA={ctaData.secondaryCta}
        secondaryLink={ctaData.secondaryLink}
      />
    </PageLayout>
  );
};

export default About;
