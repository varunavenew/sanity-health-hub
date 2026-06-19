import { PageLayout } from "@/components/layout/PageLayout";
import { HeroCompact } from "@/components/homepage/HeroCompact";
import { HeroBanner } from "@/components/homepage/HeroBanner";
import { PromoBlocks } from "@/components/homepage/PromoBlocks";
import { LifePhasesSection } from "@/components/homepage/LifePhasesSection";
import { ValueBadges } from "@/components/homepage/ValueBadges";
import { SpecialistsSectionElegant } from "@/components/homepage/SpecialistsSectionElegant";
import { GoogleReviewsSection } from "@/components/homepage/GoogleReviewsSection";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { ResultsStatsSection } from "@/components/shared/ResultsStatsSection";
import { NewsSplitScreen } from "@/components/homepage/NewsSplitScreen";
import { HomepageSEO } from "@/components/seo/HomepageSEO";
import { useHomepage } from "@/hooks/useSanity";
import { useTranslation } from "react-i18next";

interface Props {
  isChatOpen?: boolean;
}

/**
 * Eksperimentell kopi av hjemmesiden (Index.tsx) — brukes som lekekasse
 * for å teste enkelte grep uten å påvirke den live hjemmesiden.
 * Rute: /hjem-demo/lek
 */
const HomeDemoLek = ({ isChatOpen = false }: Props) => {
  const { data: homepage } = useHomepage();
  const { t } = useTranslation();

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <HomepageSEO seo={homepage?.seo} />

      <h1 className="sr-only">{t("h1")}</h1>

      <HeroBanner />
      <PatientTrustSection />
      <HeroCompact showHeader={false} />
      <GoogleReviewsSection showTrustSection={false} />
      <NewsSplitScreen />
      <LifePhasesSection />
      <SpecialistsSectionElegant />
      <ResultsStatsSection
        title="Tall som forteller en historie."
        description="Du fortjener åpenhet. Her er noen av tallene som beskriver hverdagen vår — på tvers av spesialiteter, klinikker og pasientmøter."
        category="CMedical totalt"
        stats={[
          { v: "45 000+", k: "Konsultasjoner", sub: "Per år" },
          { v: "40+", k: "Spesialister", sub: "På tvers av fagfelt" },
          { v: "98%", k: "Vil anbefale oss", sub: "Pasientundersøkelse" },
          { v: "< 3 dager", k: "Ventetid", sub: "Snitt til første time" },
        ]}
        footnote="Tall oppdatert per Q1 2026. Resultater varierer individuelt."
        className="!border-t-0"
      />
      <BookingCTA />
    </PageLayout>
  );
};

export default HomeDemoLek;
