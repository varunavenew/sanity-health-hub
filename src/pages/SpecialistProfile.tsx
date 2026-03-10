import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Globe, GraduationCap, Briefcase, Calendar, Phone, ArrowRight, ChevronRight, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { serviceCategories } from "@/data/serviceCategories";
import { InlineBookingSection } from "@/components/specialist/InlineBookingSection";
import { motion } from "framer-motion";
import { useState } from "react";

const AccordionItem = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-sm font-normal text-foreground hover:text-brand-dark transition-colors"
      >
        {title}
        {open ? <Minus className="w-4 h-4 text-muted-foreground" /> : <Plus className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="pb-4">{children}</div>}
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

const categoryBookingMap: Record<string, string> = {
  gynekologi: "gynekolog",
  fertilitet: "fertilitet",
  urologi: "urolog",
  ortopedi: "ortoped",
  annet: "",
};

const SpecialistProfile = ({ isChatOpen }: SpecialistProfileProps) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const specialist = specialists.find((s) => s.slug === slug);

  if (!specialist) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-light text-foreground mb-4">Spesialist ikke funnet</h1>
            <Button onClick={() => navigate(-1)} variant="outline" className="rounded-full">
              <ArrowLeft className="mr-2 w-4 h-4" /> Gå tilbake
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  // Get related specialists (same category, exclude self)
  const relatedSpecialists = getSpecialistsByCategory(specialist.category)
    .filter((s) => s.slug !== specialist.slug)
    .slice(0, 4);

  // Get related treatments from service categories
  const categoryConfig = serviceCategories.find(
    (c) => c.id === specialist.category || (specialist.category === "annet" && c.id === "flere")
  );
  const relatedTreatments = categoryConfig?.subcategories.slice(0, 6) || [];

  const bookingUrl = `/booking?kategori=${categoryBookingMap[specialist.category] || specialist.category}`;

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Breadcrumb */}
      <div className="bg-brand-dark pt-20 pb-0">
        <div className="container mx-auto px-6 md:px-16">
          <nav className="flex items-center gap-2 text-sm text-white/50 font-light py-4">
            <Link to="/" className="hover:text-white/80 transition-colors">Hjem</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={categoryPaths[specialist.category] || "/"} className="hover:text-white/80 transition-colors">
              {categoryLabels[specialist.category]}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80">{specialist.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section - Split layout */}
      <section className="bg-brand-dark pb-8 md:pb-12">
        <div className="container mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-start">
            {/* Left: Photo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-[3/4] max-h-[420px] rounded-sm overflow-hidden">
                <img
                  src={specialist.image}
                  alt={specialist.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </motion.div>

            {/* Right: Info + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col justify-center py-4 md:py-6"
            >
              <h1 className="text-3xl md:text-4xl font-light text-white mb-2">
                {specialist.name}
              </h1>
              <p className="text-lg md:text-xl text-white/60 font-light mb-8">
                {specialist.title}
              </p>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {specialist.languages && specialist.languages.length > 0 && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-white/50 mb-1">Språk</p>
                      <p className="text-sm text-white/90 font-light">{specialist.languages.join(", ")}</p>
                    </div>
                  </div>
                )}
                {specialist.clinics && specialist.clinics.length > 0 && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-white/50 mb-1">Klinikker</p>
                      <p className="text-sm text-white/90 font-light">{specialist.clinics.join(", ")}</p>
                    </div>
                  </div>
                )}
                {specialist.education && (
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-white/50 mb-1">Utdanning</p>
                      <p className="text-sm text-white/90 font-light">{specialist.education}</p>
                    </div>
                  </div>
                )}
                {specialist.experience && (
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-accent mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-white/50 mb-1">Erfaring</p>
                      <p className="text-sm text-white/90 font-light">{specialist.experience}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-md px-8 font-normal"
                  onClick={() => navigate(bookingUrl)}
                >
                  <Calendar className="mr-2 w-4 h-4" />
                  Bestill time
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white/30 text-white hover:bg-white/10 rounded-md px-6 font-normal"
                  onClick={() => navigate("/kontakt")}
                >
                  <Phone className="mr-2 w-4 h-4" />
                  Kontakt oss
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      {specialist.bio && (
        <section className="py-10 md:py-16 bg-background">
          <div className="container mx-auto px-6 md:px-16">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-light text-foreground mb-4">
                Om {specialist.name.split(" ")[0]}
              </h2>
              <p className="text-lg text-muted-foreground font-light leading-relaxed">
                {specialist.bio}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Inline Booking */}
      <InlineBookingSection specialist={specialist} />

      {/* Finansiering & Praktisk info */}
      <section className="py-10 md:py-16 bg-secondary/30">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl">
            <h2 className="text-lg font-normal text-foreground mb-4 text-center">Finansiering</h2>
            <p className="text-sm text-muted-foreground font-light leading-relaxed mb-8 text-center">
              Vi er et privat helsetilbud. Det betyr at du betaler selv – eller får utredning eller behandling dekket av helseforsikring.
            </p>

            {/* Accordion items */}
            <div className="divide-y divide-border">
              <AccordionItem title="Pris">
                <p className="text-sm text-muted-foreground font-light">
                  <Link to="/priser" className="text-brand-dark font-normal hover:underline">Prislister finnes her.</Link>
                </p>
              </AccordionItem>

              <AccordionItem title="Forsikring">
                <p className="text-sm text-muted-foreground font-light mb-3">
                  <strong className="text-foreground">Vi har forsikringsavtale med:</strong><br />
                  EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg.
                </p>
                <p className="text-sm text-muted-foreground font-light mb-3">
                  <strong className="text-foreground">Hvordan går jeg frem?</strong> Et typisk behandlingsløp er at du tar kontakt med lege (fastlege eller annen privat lege/legevakt) og får en henvisning til utredning/behandlingen som er nødvendig for deg. Henvisningen sender du til forsikringsselskapet ditt og du kan da be om å få time på CMedical. Forsikringsselskapet tar kontakt med oss og vi ringer deg for å sette opp en time.
                </p>
                <p className="text-sm text-muted-foreground font-light mb-3">
                  <strong className="text-foreground">Hvis forsikringen ikke dekker behandlingen:</strong> Er det behandling som ikke dekkes av din forsikring, men som tilbys hos CMedical, så kan vi tilby deg behandlingen som privat betalende pasient.
                </p>
                <p className="text-sm text-muted-foreground font-light">
                  <strong className="text-foreground">Selskapene har ulike regler.</strong> Forsikringsselskapene har ulike regler for hva de betaler for. De har også ulike produkter som gjør at ikke alle kunder får dekket det samme. Sjekk med ditt forsikringsselskap hva din forsikring dekker.
                </p>
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
      <section className="py-10 md:py-16 bg-background">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl">
            <h2 className="text-lg font-normal text-foreground mb-4 text-center">Ofte stilte spørsmål</h2>
            <p className="text-sm text-muted-foreground font-light leading-relaxed mb-8 text-center">
              Det skal være enkelt å være pasient hos oss. Finner du ikke svar på det du lurer på, finner du kontaktinformasjonen vår i bunnen av siden.
            </p>

            <div className="divide-y divide-border">
              <AccordionItem title="Henvisning">
                <p className="text-sm text-muted-foreground font-light">
                  Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige.
                </p>
              </AccordionItem>

              <AccordionItem title="Ventetid">
                <p className="text-sm text-muted-foreground font-light">
                  Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp <strong className="text-foreground">innen en uke</strong>. Dette varierer selvfølgelig noe avhengig av hva du trenger hjelp med. Ta kontakt med oss så finner vi en tid som passer deg!
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
                  CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året, og sørger for å bruke vår spisskompetanse til å forstå våre pasienters helhetsbilde.
                </p>
              </AccordionItem>

              <AccordionItem title="Personvernerklæring">
                <p className="text-sm text-muted-foreground font-light">
                  Her finner du vår <a href="https://cmedical.no/no/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand-dark font-normal hover:underline">personvernerklæring</a>.
                </p>
              </AccordionItem>
            </div>
          </div>
        </div>
      </section>

      {/* Related Treatments */}
      {relatedTreatments.length > 0 && (
        <section className="py-10 md:py-16 bg-secondary/30">
          <div className="container mx-auto px-6 md:px-16">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-2">
              Behandlinger innen {categoryLabels[specialist.category]?.toLowerCase()}
            </h2>
            <p className="text-muted-foreground font-light mb-8 max-w-2xl">
              Utforsk behandlingene {specialist.name.split(" ")[0]} og teamet tilbyr.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedTreatments.map((treatment) => (
                <Link
                  key={treatment.path}
                  to={treatment.path}
                  className="group flex items-center justify-between p-4 rounded-sm bg-background border border-border/50 hover:border-brand-dark/30 hover:shadow-sm transition-all"
                >
                  <span className="text-sm font-light text-foreground group-hover:text-brand-dark transition-colors">
                    {treatment.label}
                  </span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-dark transition-colors" />
                </Link>
              ))}
            </div>

            <div className="mt-8">
              <Button
                variant="outline"
                className="rounded-full font-light"
                onClick={() => navigate(categoryPaths[specialist.category] || "/")}
              >
                Se alle behandlinger
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Inline Booking CTA */}
      <section className="py-10 md:py-16 bg-brand-dark">
        <div className="container mx-auto px-6 md:px-16 text-center">
          <h2 className="text-2xl md:text-3xl font-light text-white mb-3">
            Bestill time hos {specialist.name.split(" ")[0]}
          </h2>
          <p className="text-white/60 font-light mb-8 max-w-xl mx-auto">
            Rask og enkel timebestilling. Du får bekreftelse på SMS.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-md px-8 font-normal"
              onClick={() => navigate(bookingUrl)}
            >
              <Calendar className="mr-2 w-4 h-4" />
              Bestill time nå
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white/30 text-white hover:bg-white/10 rounded-md px-6 font-normal"
              onClick={() => navigate("/kontakt")}
            >
              <Phone className="mr-2 w-4 h-4" />
              Ring for konsultasjon
            </Button>
          </div>
        </div>
      </section>

      {/* Related Specialists */}
      {relatedSpecialists.length > 0 && (
        <section className="py-10 md:py-16 bg-background">
          <div className="container mx-auto px-6 md:px-16">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-2">
              Andre spesialister innen {categoryLabels[specialist.category]?.toLowerCase()}
            </h2>
            <p className="text-muted-foreground font-light mb-8">
              Vårt team av erfarne spesialister står klare til å hjelpe deg.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedSpecialists.map((s) => (
                <Link
                  key={s.slug}
                  to={`/spesialister/${s.slug}`}
                  className="group"
                >
                  <div className="aspect-[3/4] rounded-sm overflow-hidden mb-2">
                    <img
                      src={s.image}
                      alt={s.name}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-sm font-medium text-foreground">
                    {s.name}
                  </h3>
                  <p className="text-xs text-muted-foreground font-light">{s.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
};

export default SpecialistProfile;
