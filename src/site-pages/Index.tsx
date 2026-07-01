"use client";

import { useMemo } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { HeroCompact } from "@/components/homepage/HeroCompact";
import { HeroBanner } from "@/components/homepage/HeroBanner";
import { LifePhasesSection } from "@/components/homepage/LifePhasesSection";
import { SpecialistsSectionElegant } from "@/components/homepage/SpecialistsSectionElegant";
import { GoogleReviewsSection } from "@/components/homepage/GoogleReviewsSection";
import { PatientTrustSection } from "@/components/homepage/PatientTrustSection";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { ResultsStatsSection } from "@/components/shared/ResultsStatsSection";
import { NewsSplitScreen } from "@/components/homepage/NewsSplitScreen";
import { HomepageSEO } from "@/components/seo/HomepageSEO";
import { HomepageDataProvider } from "@/components/homepage/HomepageDataProvider";
import type { HomepageData } from "@/lib/sanity/homepage-data";
import { findHomepageBookingCta } from "@/lib/sanity/homepage-data";
import { useHomepage } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";

interface IndexProps {
  isChatOpen: boolean;
  initialHomepage?: HomepageData | null;
  sanityLang?: "no" | "en";
}

const IndexContent = ({ isChatOpen }: { isChatOpen: boolean }) => {
  const { data: homepage } = useHomepage();
  const { t } = useTranslation();
  const resultsStats = homepage?.resultsStatsSection;
  const bookingCta = useMemo(
    () => findHomepageBookingCta(homepage?.pageSections ?? []),
    [homepage?.pageSections],
  );

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <HomepageSEO seo={homepage?.seo} />

      <h1 className="sr-only">{t("h1")}</h1>

      <HeroBanner />
      <PatientTrustSection />
      <HeroCompact />
      <GoogleReviewsSection />
      <NewsSplitScreen />
      <LifePhasesSection />
      <SpecialistsSectionElegant />
      <ResultsStatsSection
        title={resultsStats?.title ?? ""}
        description={resultsStats?.description}
        category={resultsStats?.category}
        stats={(resultsStats?.stats ?? []).map((row) => ({
          v: row.value,
          k: row.label,
          sub: row.sub,
        }))}
        footnote={resultsStats?.footnote}
        className="!border-t-0"
      />
      <BookingCTA
        title={bookingCta?.title}
        subtitle={bookingCta?.subtitle}
        image={bookingCta?.image}
        imageAlt={bookingCta?.imageAlt}
        variant={bookingCta?.variant}
        primaryLabel={bookingCta?.primaryLabel}
        primaryPath={bookingCta?.primaryPath}
        bookingCategoryId={bookingCta?.bookingCategory?.categoryId}
        showSecondaryButton={bookingCta?.showSecondaryButton}
        secondaryLabel={bookingCta?.secondaryLabel}
        secondaryPath={bookingCta?.secondaryPath}
        quickInfoItems={bookingCta?.quickInfoItems}
      />
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
