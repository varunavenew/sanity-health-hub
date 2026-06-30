import { useParams, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { InlineBookingSection } from "@/components/specialist/InlineBookingSection";
import { SpecialistHero } from "@/components/specialist/SpecialistHero";
import { SpecialistBio } from "@/components/specialist/SpecialistBio";
import { SpecialistFeaturedService } from "@/components/specialist/SpecialistFeaturedService";
import { FaqSection } from "@/components/layout/FaqSection";
import { useFaqs } from "@/hooks/useSanity";

const staticFaqs = [
  { id: "henvisning", question: "Henvisning", answer: "Du trenger ikke henvisning for å bestille time hos oss. Du kan enkelt booke direkte via vår nettside eller ringe oss. Hvis du har henvisning fra fastlege, ta den gjerne med til konsultasjonen." },
  { id: "ventetid", question: "Ventetid", answer: "Vi tilbyr korte ventetider. De fleste får time innen 1-3 dager, avhengig av behandlingstype og tilgjengelighet." },
  { id: "sykemelding", question: "Sykemelding", answer: "Våre spesialister kan skrive sykemelding hvis det er medisinsk grunnlag for det. Dette vurderes individuelt i forbindelse med konsultasjonen." },
  { id: "utredning", question: "Utredning", answer: "Vi tilbyr grundig utredning innen alle våre tjenester. Utredningen tilpasses din situasjon og kan inkludere samtale, undersøkelse, blodprøver og bildediagnostikk." },
  { id: "selskapet", question: "Selskapet", answer: "CMedical er Nordens ledende klinikk for livet og underlivet, med særlig vekt på kvinnehelse. Vi er også opptatt av menns helse og fertilitet som angår alle som er involvert i å skape liv. Siden 2002 har over 150 000 pasienter fått behandling hos oss." },
  { id: "forsikring", question: "Forsikring", answer: "Vi har avtale med de fleste forsikringsselskaper, inkludert EuroAccident, Falck, Fremtind, Gjensidige, Storebrand, Tryg og Vertikal Helse. Kontakt ditt forsikringsselskap for å sjekke hva din forsikring dekker, og be om å få time hos CMedical." },
];

const SpecialistFAQBlock = () => {
  const { data: sanityFaqs } = useFaqs("generelt");
  const faqs = sanityFaqs && sanityFaqs.length > 0
    ? sanityFaqs.map((f: any, i: number) => ({ id: `faq-${i}`, question: f.question, answer: f.answer }))
    : staticFaqs;
  return <FaqSection faqs={faqs} />;
};
import { RelatedSpecialists } from "@/components/specialist/RelatedSpecialists";
import { SpecialistReviews } from "@/components/specialist/SpecialistReviews";
import { motion } from "framer-motion";
import { PageSEO } from "@/components/seo/PageSEO";

interface SpecialistProfileProps {
  isChatOpen: boolean;
}

const SpecialistProfile = ({ isChatOpen }: SpecialistProfileProps) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const bookingRef = useRef<HTMLDivElement>(null);
  const { findBySlug, byCategory } = useSpecialistsData();

  const specialist = findBySlug(slug || "");

  if (!specialist) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-light text-foreground mb-4">Spesialist ikke funnet</h1>
            <Button onClick={() => navigate(-1)} variant="outline" className="rounded-2xl md:rounded-full">
              Gå tilbake
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const relatedSpecialists = byCategory(specialist.category)
    .filter((s) => s.slug !== specialist.slug)
    .slice(0, 4);

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const firstName = specialist.name.split(" ")[0];

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={`${specialist.name} – ${specialist.title}`}
        description={`Bestill time hos ${specialist.name}, ${specialist.title} hos CMedical. ${specialist.expertise?.join(', ')}. Ingen henvisning nødvendig.`}
        canonical={`/spesialister/${specialist.slug}`}
        type="profile"
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Spesialister", path: "/spesialister" },
          { name: specialist.name, path: `/spesialister/${specialist.slug}` },
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Physician",
          name: specialist.name,
          jobTitle: specialist.title,
          medicalSpecialty: specialist.expertise || [],
          worksFor: {
            "@type": "MedicalClinic",
            name: "CMedical",
          },
          url: `https://cmedical.no/spesialister/${specialist.slug}`,
        }}
      />
      {/* 1. Hero — warm intro with portrait */}
      <SpecialistHero specialist={specialist} onScrollToBooking={scrollToBooking} />

      {/* 2. Story — editorial bio with optional media */}
      <SpecialistBio specialist={specialist} />

      {/* 2b. Featured service — tjenesten i denne saken */}
      <SpecialistFeaturedService specialist={specialist} />

      {/* 3. Reviews (optional, hides if none) */}
      <SpecialistReviews specialist={specialist} />



      {/* 3. Booking — the conversion point */}
      <section ref={bookingRef} className="py-14 md:py-20 bg-brand-dark scroll-mt-20">
        <div className="container mx-auto px-6 md:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-4"
            >
              <h2 className="text-2xl md:text-3xl font-light text-white mb-3">
                Bestill time hos {firstName}
              </h2>
              <p className="text-sm text-white/60 font-light leading-relaxed max-w-sm">
                Velg tjeneste og finn en tid som passer. Ingen henvisning nødvendig.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="md:col-span-8"
            >
              <InlineBookingSection specialist={specialist} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. Relaterte spesialister */}
      <RelatedSpecialists specialists={relatedSpecialists} />

      {/* 5. FAQ — trust & practical info */}
      <SpecialistFAQBlock />

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-md border-t border-border/40 px-4 py-3 safe-area-pb">
        <Button
          onClick={scrollToBooking}
          className="w-full rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
          Bestill time hos {firstName}
        </Button>
      </div>
    </PageLayout>
  );
};

export default SpecialistProfile;
