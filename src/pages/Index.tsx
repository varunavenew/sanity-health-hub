import { PageLayout } from "@/components/layout/PageLayout";
import { HeroCompact } from "@/components/homepage/HeroCompact";
import { HeroBanner } from "@/components/homepage/HeroBanner";
import { PromoBlocks } from "@/components/homepage/PromoBlocks";
import { LifePhasesSection } from "@/components/homepage/LifePhasesSection";
import { ValueBadges } from "@/components/homepage/ValueBadges";

import { SpecialistsSection } from "@/components/homepage/SpecialistsSection";
import { GoogleReviewsSection } from "@/components/homepage/GoogleReviewsSection";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { ResultsStatsSection } from "@/components/shared/ResultsStatsSection";
import { HomepageSEO } from "@/components/seo/HomepageSEO";
import { useHomepage } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";

interface IndexProps {
  isChatOpen: boolean;
}

const Index = ({ isChatOpen }: IndexProps) => {
  const { data: homepage } = useHomepage();
  const { t } = useTranslation();

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <HomepageSEO seo={homepage?.seo} />

      <h1 className="sr-only">
        {t("h1")}
      </h1>

      <HeroBanner />
      <HeroCompact />
      <GoogleReviewsSection />
      <PromoBlocks />
      <LifePhasesSection />
      <SpecialistsSection />
      <ResultsStatsSection
        title="Tall som forteller en historie."
        description="Du fortjener åpenhet. Her er noen av tallene som beskriver hverdagen vår — på tvers av spesialiteter, klinikker og pasientmøter."
        category="CMedical totalt"
        stats={[
          { v: "60 000", k: "Årlige pasientbesøk", sub: "På tvers av klinikkene" },
          { v: "3 500", k: "Operasjoner", sub: "Per år" },
          { v: "4,8/5", k: "Snittvurdering", sub: "Fra pasienter på Google" },
          { v: "50+", k: "Spesialister", sub: "På tvers av fagfelt" },
        ]}
        footnote="Tall oppdatert per Q1 2026. Resultater varierer individuelt."
      />
      <BookingCTA />
    </PageLayout>
  );
};

export default Index;
