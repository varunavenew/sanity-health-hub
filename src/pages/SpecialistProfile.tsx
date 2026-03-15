import { useParams, useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { InlineBookingSection } from "@/components/specialist/InlineBookingSection";
import { SpecialistHero } from "@/components/specialist/SpecialistHero";
import { SpecialistBio } from "@/components/specialist/SpecialistBio";
import { SpecialistFAQ } from "@/components/specialist/SpecialistFAQ";
import { RelatedSpecialists } from "@/components/specialist/RelatedSpecialists";
import { motion } from "framer-motion";

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
            <Button onClick={() => navigate(-1)} variant="outline" className="rounded-full">
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

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <SpecialistHero specialist={specialist} onScrollToBooking={scrollToBooking} />

      <SpecialistBio specialist={specialist} />

      {/* Booking */}
      <section ref={bookingRef} className="py-14 md:py-20 bg-secondary/20 scroll-mt-20">
        <div className="container mx-auto px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h2 className="text-xl md:text-2xl font-light text-foreground mb-2">
              Bestill time
            </h2>
            <p className="text-sm text-muted-foreground font-light mb-8">
              Velg tjeneste og finn en tid som passer. Ingen henvisning nødvendig.
            </p>
            <InlineBookingSection specialist={specialist} />
          </motion.div>
        </div>
      </section>

      <SpecialistFAQ />

      <RelatedSpecialists specialists={relatedSpecialists} />

      {/* Sticky mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-md border-t border-border/40 px-4 py-3 safe-area-pb">
        <Button
          onClick={scrollToBooking}
          className="w-full rounded-full"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Bestill time hos {specialist.name.split(" ")[0]}
        </Button>
      </div>
    </PageLayout>
  );
};

export default SpecialistProfile;
