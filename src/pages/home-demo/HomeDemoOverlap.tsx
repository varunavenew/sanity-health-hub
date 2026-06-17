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
 * Demo 2 — Overlappende kortgrid
 * Tjenestegridden løftes opp og legger seg over nederste del av hero.
 * Den hvite "Våre tjenester"-stripa er borte; en liten inline-label
 * over kortene erstatter den.
 */
const HomeDemoOverlap = ({ isChatOpen = false }: { isChatOpen?: boolean }) => {
  useEffect(() => {
    document.title = "Hjem demo · Overlappende grid · CMedical";
  }, []);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <h1 className="sr-only">CMedical — demo: overlappende kortgrid</h1>
      <HeroBanner />
      {/* Negativ margin overlapper hero med kortene */}
      <section className="bg-background relative -mt-24 md:-mt-32 pb-6 md:pb-8">
        <div className="page-shell">
          <div className="flex items-end justify-between pb-4 md:pb-5">
            <span className="text-[11px] text-brand-light/80 font-light">Våre tjenester</span>
            <span className="text-[11px] text-brand-light/80 font-light">Se alle →</span>
          </div>
        </div>
        <div className="page-shell">
          <LightCardGrid />
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

export default HomeDemoOverlap;
