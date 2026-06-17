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
 * Demo 1 — Mørk tonal blend
 * Hero slider og tjenestene deler samme mørke bakgrunn. Ingen hvit
 * "Våre tjenester"-stripe — bare en tynn rad med liten label + paginering
 * som binder seksjonene sammen.
 */
const HomeDemoBlend = ({ isChatOpen = false }: { isChatOpen?: boolean }) => {
  useEffect(() => {
    document.title = "Hjem demo · Mørk tonal blend · CMedical";
  }, []);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <h1 className="sr-only">CMedical — demo: mørk tonal blend</h1>
      <div className="bg-brand-dark">
        <HeroBanner />
        {/* Tynn label-rad i samme mørke tone — limen mellom seksjonene */}
        <div className="border-t border-brand-light/10">
          <div className="page-shell flex items-center justify-between py-3">
            <span className="text-[11px] text-brand-light/60 font-light">Våre tjenester</span>
            <span className="text-[11px] text-brand-light/60 font-light">6 fagområder</span>
          </div>
        </div>
        {/* Kortene løses ned med 1px lyse hairlines mot mørk bakgrunn */}
        <div className="border-t border-brand-light/10">
          <LightCardGrid />
        </div>
      </div>

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

export default HomeDemoBlend;
