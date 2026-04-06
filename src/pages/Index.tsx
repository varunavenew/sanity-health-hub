import { PageLayout } from "@/components/layout/PageLayout";
import { HeroCompact } from "@/components/homepage/HeroCompact";
import { HeroBanner } from "@/components/homepage/HeroBanner";
import { PromoBlocks } from "@/components/homepage/PromoBlocks";
import { LifePhasesSection } from "@/components/homepage/LifePhasesSection";
import { TaglineBanner } from "@/components/homepage/TaglineBanner";
import { ValueBadges } from "@/components/homepage/ValueBadges";
import { StatsBar } from "@/components/homepage/StatsBar";

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
      <TaglineBanner />
      <StatsBar />
      <HeroCompact />
      <ValueBadges />
      <PromoBlocks />
      <LifePhasesSection />
      <GoogleReviewsSection />
      <SpecialistsSection />
      <BookingCTA />
    </PageLayout>
  );
};

export default Index;
