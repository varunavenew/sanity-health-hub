import { PageLayout } from "@/components/layout/PageLayout";
import { HeroBanner } from "@/components/homepage/HeroBanner";
import { HeroCompact } from "@/components/homepage/HeroCompact";
import { LifePhasesSection } from "@/components/homepage/LifePhasesSection";
import { SpecialistsSectionElegant } from "@/components/homepage/SpecialistsSectionElegant";
import { GoogleReviewsSection } from "@/components/homepage/GoogleReviewsSection";
import { PromoBlocks } from "@/components/homepage/PromoBlocks";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { ResultsStatsSection } from "@/components/shared/ResultsStatsSection";
import { HomepageSEO } from "@/components/seo/HomepageSEO";
import { useHomepage } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";

interface Props { isChatOpen?: boolean }

/**
 * Hjem — Kompakt. Tallene tidlig som trust-anker, så tjenestene,
 * deretter mennesker og omtaler. Tettere rytme, mindre vertikal scroll.
 */
const HomeDemoKompakt = ({ isChatOpen = false }: Props) => {
  const { data: homepage } = useHomepage();
  const { t } = useTranslation();

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <HomepageSEO seo={homepage?.seo} />
      <h1 className="sr-only">{t("h1")}</h1>

      <HeroBanner />
      <ResultsStatsSection
        title="CMedical i tall."
        description="Et raskt overblikk over hvem vi er og hva vi gjør."
        category="CMedical totalt"
        stats={[
          { v: "45 000+", k: "Konsultasjoner", sub: "Per år" },
          { v: "40+", k: "Spesialister", sub: "På tvers av fagfelt" },
          { v: "98%", k: "Vil anbefale oss", sub: "Pasientundersøkelse" },
          { v: "< 3 dager", k: "Ventetid", sub: "Snitt til første time" },
        ]}
        footnote="Tall oppdatert per Q1 2026."
      />
      <HeroCompact showHeader={false} />
      <LifePhasesSection />
      <SpecialistsSectionElegant />
      <GoogleReviewsSection />
      <PromoBlocks />
      <BookingCTA />
    </PageLayout>
  );
};

export default HomeDemoKompakt;
