"use client";

import { PageLayout } from "@/components/layout/PageLayout";
import { HeroCompact } from "@/components/homepage/HeroCompact";
import { HeroBanner } from "@/components/homepage/HeroBanner";
import { PromoBlocks } from "@/components/homepage/PromoBlocks";
import { LifePhasesSection } from "@/components/homepage/LifePhasesSection";
import { TaglineBanner } from "@/components/homepage/TaglineBanner";
import { ValueBadges } from "@/components/homepage/ValueBadges";
import { StatsBar } from "@/components/homepage/StatsBar";

import { SpecialistsSection } from "@/components/homepage/SpecialistsSection";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { useHomepage } from "@/hooks/useSanity";
import { GoogleReviewsSection } from "@/components/homepage/GoogleReviewsSection";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { HomepageDataProvider } from "@/components/homepage/HomepageDataProvider";
import type { HomepageData } from "@/lib/sanity/homepage-data";
import { useTranslation } from "react-i18next";

interface IndexProps {
  isChatOpen: boolean;
  initialHomepage?: HomepageData | null;
  sanityLang?: "no" | "en";
}

const IndexContent = ({ isChatOpen }: { isChatOpen: boolean }) => {
  const { t } = useTranslation();
  const { data: homepage, isPending } = useHomepage();
  const pageSections = homepage?.pageSections;

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <h1 className="sr-only">
        {t("h1")}
      </h1>

      <HeroBanner />
      <TaglineBanner />
      <StatsBar />
      <HeroCompact />
      <GoogleReviewsSection />
      <ValueBadges />
      <PromoBlocks />
      <LifePhasesSection />
      {!isPending &&
        (pageSections?.length ? (
          <PageSectionsRenderer sections={pageSections} />
        ) : (
          <SpecialistsSection />
        ))}
      <BookingCTA />
    </PageLayout>
  );
};

const Index = ({
  isChatOpen,
  initialHomepage = null,
  sanityLang = "no",
}: IndexProps) => (
  <HomepageDataProvider lang={sanityLang} data={initialHomepage}>
    <IndexContent isChatOpen={isChatOpen} />
  </HomepageDataProvider>
);

export default Index;
