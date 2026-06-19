import { PageLayout } from "@/components/layout/PageLayout";
import { HeroBanner } from "@/components/homepage/HeroBanner";
import { HeroCompact } from "@/components/homepage/HeroCompact";
import { LifePhasesSection } from "@/components/homepage/LifePhasesSection";
import { SpecialistsSection } from "@/components/homepage/SpecialistsSection";
import { GoogleReviewsSection } from "@/components/homepage/GoogleReviewsSection";
import { PromoBlocks } from "@/components/homepage/PromoBlocks";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { NewsSplitScreen } from "@/components/homepage/NewsSplitScreen";
import { ResultsStatsSection } from "@/components/shared/ResultsStatsSection";
import { HomepageSEO } from "@/components/seo/HomepageSEO";
import { useHomepage } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";

interface Props { isChatOpen?: boolean }

/**
 * Hjem — Fortelling. Bygget som en reise:
 * 1) Hvem du møter (hero) → 2) Hva du kan trenge (livsfaser) →
 * 3) Hvordan vi jobber (tjenester) → 4) Hva andre sier (omtaler) →
 * 5) Det siste fra oss (aktuelt) → 6) Tallene → 7) Book.
 */
const HomeDemoFortelling = ({ isChatOpen = false }: Props) => {
  const { data: homepage } = useHomepage();
  const { t } = useTranslation();

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <HomepageSEO seo={homepage?.seo} />
      <h1 className="sr-only">{t("h1")}</h1>

      <HeroBanner />
      <HeroCompact />
      <LifePhasesSection />
      <PromoBlocks />
      <SpecialistsSection />
      <GoogleReviewsSection />
      <NewsSplitScreen />
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
        footnote="Tall oppdatert per Q1 2026."
      />
      <BookingCTA />
    </PageLayout>
  );
};

export default HomeDemoFortelling;
