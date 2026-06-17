import { useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { HeroBanner } from "@/components/homepage/HeroBanner";
import { GoogleReviewsSection } from "@/components/homepage/GoogleReviewsSection";
import { ValueBadges } from "@/components/homepage/ValueBadges";
import { PromoBlocks } from "@/components/homepage/PromoBlocks";
import { LifePhasesSection } from "@/components/homepage/LifePhasesSection";
import { SpecialistsSection } from "@/components/homepage/SpecialistsSection";
import { ResultsStatsSection } from "@/components/shared/ResultsStatsSection";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { LightCardGrid } from "./_shared";

/**
 * Demo 3 — Asymmetrisk kutt
 * Hero møter kortgridden direkte (ingen hvit stripe). En liten gul
 * accent-blokk med "Våre tjenester" sitter forskjøvet over skjøten —
 * skarp visuell kontrast, null margin.
 */
const HomeDemoCut = ({ isChatOpen = false }: { isChatOpen?: boolean }) => {
  useEffect(() => {
    document.title = "Hjem demo · Asymmetrisk kutt · CMedical";
  }, []);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <h1 className="sr-only">CMedical — demo: asymmetrisk kutt</h1>
      <HeroBanner />
      <section className="bg-background relative">
        {/* Liten gul accent-etikett over skjøten, venstreforskjøvet */}
        <div className="page-shell relative">
          <div className="absolute left-6 md:left-16 -top-6 z-10 bg-accent text-brand-dark px-5 py-2 text-sm font-light">
            Våre tjenester
          </div>
        </div>
        <div className="pt-12 md:pt-14">
          <div className="page-shell">
            <LightCardGrid />
          </div>
        </div>
      </section>

      <GoogleReviewsSection />
      <ValueBadges />
      <PromoBlocks />
      <LifePhasesSection />
      <SpecialistsSection />
      <ResultsStatsSection
        title="Tall som forteller en historie."
        description="Du fortjener åpenhet. Her er noen av tallene som beskriver hverdagen vår."
        category="CMedical totalt"
        stats={[
          { v: "45 000+", k: "Konsultasjoner", sub: "Per år" },
          { v: "40+", k: "Spesialister", sub: "På tvers av fagfelt" },
          { v: "98%", k: "Vil anbefale oss", sub: "Pasientundersøkelse" },
          { v: "< 3 dager", k: "Ventetid", sub: "Snitt til første time" },
        ]}
      />
      <BookingCTA />
    </PageLayout>
  );
};

export default HomeDemoCut;
