import { PageLayout } from "@/components/layout/PageLayout";
import { HeroCompact } from "@/components/homepage/HeroCompact";
import { HeroBanner } from "@/components/homepage/HeroBanner";
import { PromoBlocks } from "@/components/homepage/PromoBlocks";
import { LifePhasesSection } from "@/components/homepage/LifePhasesSection";
import { ValueBadges } from "@/components/homepage/ValueBadges";
import { ServicesStrip } from "@/components/homepage/ServicesStrip";
import { AnimatedStatsSection } from "@/components/treatments/AnimatedStatsSection";

import { SpecialistsSection } from "@/components/homepage/SpecialistsSection";
import { GoogleReviewsSection } from "@/components/homepage/GoogleReviewsSection";
import { BookingCTA } from "@/components/homepage/BookingCTA";
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
      <ServicesStrip />
      <AnimatedStatsSection
        categoryLabel="Gynekologi"
        description="Vi måler det vi gjør — fordi du fortjener åpenhet. Her er resultatene våre innen gynekologi de siste årene."
        stats={[
          { v: "9 600+", k: "Konsultasjoner", sub: "Per år" },
          { v: "2 100", k: "Ultralydundersøkelser", sub: "I 2024" },
          { v: "98%", k: "Vil anbefale oss", sub: "Pasientundersøkelse" },
          { v: "<7 dager", k: "Ventetid", sub: "Snitt til første time" },
        ]}
      />
      <HeroCompact />
      <GoogleReviewsSection />
      <ValueBadges />
      <PromoBlocks />
      <LifePhasesSection />
      <SpecialistsSection />
      <BookingCTA />
    </PageLayout>
  );
};

export default Index;

