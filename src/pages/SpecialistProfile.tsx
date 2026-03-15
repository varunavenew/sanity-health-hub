import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Plus, Minus, Calendar, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { serviceCategories as staticServiceCategories } from "@/data/serviceCategories";
import { useTreatmentCategories } from "@/hooks/useSanity";
import { InlineBookingSection } from "@/components/specialist/InlineBookingSection";
import { motion } from "framer-motion";
import { useState } from "react";

const AccordionItem = ({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/60 last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-sm font-normal text-foreground hover:text-brand-dark transition-colors"
      >
        {title}
        {open ? <Minus className="w-4 h-4 text-muted-foreground" /> : <Plus className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="pb-5 -mt-1">{children}</div>}
    </div>
  );
};

interface SpecialistProfileProps {
  isChatOpen: boolean;
}

const categoryLabels: Record<string, string> = {
  gynekologi: "Gynekologi",
  fertilitet: "Fertilitet",
  urologi: "Urologi",
  ortopedi: "Ortopedi",
  annet: "Flere tjenester",
};

const categoryPaths: Record<string, string> = {
  gynekologi: "/gynekologi",
  fertilitet: "/fertilitet",
  urologi: "/urologi",
  ortopedi: "/ortopedi",
  annet: "/flere-fagomrader",
};

const SpecialistProfile = ({ isChatOpen }: SpecialistProfileProps) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: sanityCategories } = useTreatmentCategories();
  const { findBySlug, byCategory } = useSpecialistsData();

  const specialist = findBySlug(slug || "");

  if (!specialist) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-light text-foreground mb-4">Spesialist ikke funnet</h1>
            <Button onClick={() => navigate(-1)} variant="outline" className="rounded-full">
              Gå tilbake
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Get related specialists (same category, exclude self)
  const relatedSpecialists = byCategory(specialist.category)
    .filter((s) => s.slug !== specialist.slug)
    .slice(0, 4);

  // Get related treatments
  const serviceCategories = sanityCategories?.length
    ? sanityCategories.map((c: any) => ({
        id: c.categoryId || c.slug,
        label: c.title,
        path: `/${c.categoryId || c.slug}`,
        subcategories: (c.treatments || []).map((t: any) => ({
          label: t.title,
          path: `/behandlinger/${c.categoryId || c.slug}/${t.slug}`,
        })),
      }))
    : staticServiceCategories;
  const categoryConfig = serviceCategories.find(
    (c: any) => c.id === specialist.category || (specialist.category === "annet" && c.id === "flere")
  );
  const relatedTreatments = categoryConfig?.subcategories.slice(0, 6) || [];

  const firstName = specialist.name.split(" ")[0];

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Hero Section - Full-width split like cmedical.no */}
      <section className="bg-brand-dark min-h-[70vh] md:min-h-[80vh] relative">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh] md:min-h-[80vh]">
          {/* Left: Full-bleed Photo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative h-[50vh] md:h-auto"
          >
            <img
              src={specialist.image}
              alt={specialist.name}
              className="w-full h-full object-cover object-top saturate-[0.75] brightness-[0.95]"
            />
            <div className="absolute inset-0 bg-brand-dark/10 mix-blend-multiply" />
          </motion.div>

          {/* Right: Info panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex flex-col justify-between px-8 md:px-16 py-8 md:py-12"
          >
            {/* Top: Two labels */}
            <div className="flex items-start justify-between">
              <span className="text-sm text-white/70 font-light tracking-wide">
                {specialist.subtitle || specialist.title}
              </span>
              <span className="text-sm text-white/70 font-light tracking-wide">
                {specialist.subtitle ? specialist.title : categoryLabels[specialist.category]}
              </span>
            </div>

            {/* Center: Name */}
            <div className="flex-1 flex items-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
                {specialist.name}
              </h1>
            </div>

            {/* Bottom: Clinic location */}
            <div className="text-center">
              <p className="text-sm text-white/70 font-light tracking-wide">
                {specialist.clinics?.join(" · ")}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bio Section */}
      {specialist.bio && (
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-6 md:px-16">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
              {/* Left spacer on desktop for asymmetry */}
              <div className="hidden md:block md:col-span-4" />
              
              {/* Bio content - right-aligned like cmedical.no */}
              <div className="md:col-span-8 lg:col-span-7">
                <h2 className="text-lg font-normal text-foreground mb-8 text-center md:text-left">
                  Om {firstName}
                </h2>
                <div className="space-y-5">
                  {specialist.bio.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="text-[15px] text-muted-foreground font-light leading-[1.8]">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Expertise tags */}
                {specialist.expertise && specialist.expertise.length > 0 && (
                  <div className="mt-10 flex flex-wrap gap-2">
                    {specialist.expertise.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 text-xs font-light text-foreground/70 border border-border/60 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Booking Section */}
      <section className="py-16 md:py-20 bg-background border-t border-border/40">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-2 text-center">
              Bestill time
            </h2>
            <p className="text-sm text-muted-foreground font-light mb-10 text-center">
              Velg tjeneste
            </p>
            <InlineBookingSection specialist={specialist} />
          </div>
        </div>
      </section>

      {/* Finansiering */}
      <section className="py-16 md:py-20 bg-background border-t border-border/40">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-normal text-foreground mb-4 text-center">Finansiering</h2>
            <p className="text-sm text-muted-foreground font-light leading-relaxed mb-10 text-center max-w-lg mx-auto">
              Vi er et privat helsetilbud. Det betyr at du betaler selv – eller får utredning eller behandling dekket av helseforsikring.
            </p>

            <div>
              <AccordionItem title="Pris">
                <p className="text-sm text-muted-foreground font-light">
                  <Link to="/priser" className="text-brand-dark font-normal hover:underline">Prislister finnes her.</Link>
                </p>
              </AccordionItem>

              <AccordionItem title="Forsikring">
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground font-light">
                    <strong className="text-foreground">Vi har forsikringsavtale med:</strong><br />
                    EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg.
                  </p>
                  <p className="text-sm text-muted-foreground font-light">
                    <strong className="text-foreground">Hvordan går jeg frem?</strong> Et typisk behandlingsløp er at du tar kontakt med lege og får en henvisning. Henvisningen sender du til forsikringsselskapet ditt og du kan da be om å få time på CMedical.
                  </p>
                  <p className="text-sm text-muted-foreground font-light">
                    <strong className="text-foreground">Selskapene har ulike regler.</strong> Sjekk med ditt forsikringsselskap hva din forsikring dekker.
                  </p>
                </div>
              </AccordionItem>

              <AccordionItem title="Nedbetaling">
                <p className="text-sm text-muted-foreground font-light">
                  Hos oss kan du benytte deg av nedbetaling på utvalgte klinikker. Spør oss for mer informasjon.
                </p>
              </AccordionItem>
            </div>
          </div>
        </div>
      </section>

      {/* Ofte stilte spørsmål */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-normal text-foreground mb-4 text-center">Ofte stilte spørsmål</h2>
            <p className="text-sm text-muted-foreground font-light leading-relaxed mb-10 text-center max-w-lg mx-auto">
              Det skal være enkelt å være pasient hos oss. Finner du ikke svar på det du lurer på, finner du kontaktinformasjonen vår i bunnen av siden.
            </p>

            <div>
              <AccordionItem title="Henvisning">
                <p className="text-sm text-muted-foreground font-light">
                  Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige.
                </p>
              </AccordionItem>

              <AccordionItem title="Ventetid">
                <p className="text-sm text-muted-foreground font-light">
                  Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp <strong className="text-foreground">innen en uke</strong>. Ta kontakt med oss så finner vi en tid som passer deg!
                </p>
              </AccordionItem>

              <AccordionItem title="Sykemelding">
                <p className="text-sm text-muted-foreground font-light">
                  I de tilfellene der det er behov er det <strong className="text-foreground">mulig</strong> for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer.
                </p>
              </AccordionItem>

              <AccordionItem title="Utredning">
                <p className="text-sm text-muted-foreground font-light">
                  Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca <strong className="text-foreground">30 minutter</strong>.
                </p>
              </AccordionItem>

              <AccordionItem title="Selskapet">
                <p className="text-sm text-muted-foreground font-light">
                  CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året.
                </p>
              </AccordionItem>

              <AccordionItem title="Personvernerklæring">
                <p className="text-sm text-muted-foreground font-light">
                  Her finner du vår <Link to="/personvern" className="text-brand-dark font-normal hover:underline">personvernerklæring</Link>.
                </p>
              </AccordionItem>
            </div>
          </div>
        </div>
      </section>

      {/* Related Specialists */}
      {relatedSpecialists.length > 0 && (
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-6 md:px-16">
            <h2 className="text-lg font-normal text-foreground mb-8 text-center">
              Møt våre spesialister
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedSpecialists.map((s) => (
                <Link
                  key={s.slug}
                  to={`/spesialister/${s.slug}`}
                  className="group"
                >
                  <div className="aspect-[3/4] rounded-sm overflow-hidden mb-3">
                    <img
                      src={s.image}
                      alt={s.name}
                      className="w-full h-full object-cover object-top saturate-[0.75] brightness-[0.95] group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-foreground group-hover:text-brand-dark transition-colors">
                    {s.name}
                  </h3>
                  <p className="text-xs text-muted-foreground font-light mt-0.5">
                    {s.subtitle || s.title}
                  </p>
                </Link>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Button
                variant="outline"
                className="rounded-full font-light text-sm"
                onClick={() => navigate("/spesialister")}
              >
                Se alle spesialister
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
};

export default SpecialistProfile;
