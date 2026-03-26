import { PageLayout } from "@/components/layout/PageLayout";
import { HeroCompact } from "@/components/homepage/HeroCompact";
import { HeroBanner } from "@/components/homepage/HeroBanner";
import { PromoBlocks } from "@/components/homepage/PromoBlocks";
import { LifePhasesSection } from "@/components/homepage/LifePhasesSection";
import { TaglineBanner } from "@/components/homepage/TaglineBanner";
import { ValueBadges } from "@/components/homepage/ValueBadges";
import { SpecialistsSection } from "@/components/homepage/SpecialistsSection";
import { GoogleReviewsSection } from "@/components/homepage/GoogleReviewsSection";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { HomepageSEO } from "@/components/seo/HomepageSEO";
import { useHomepage } from "@/hooks/useSanity";

interface IndexProps {
  isChatOpen: boolean;
}

const Index = ({ isChatOpen }: IndexProps) => {
  const { data: homepage } = useHomepage();

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <HomepageSEO seo={homepage?.seo} />

      {/* H1 – synlig for søkemotorer, visuelt integrert i hero */}
      <h1 className="sr-only">
        CMedical – Skandinavias ledende klinikk for gynekologi, fertilitet og urologi
      </h1>

      {/* Hero carousel */}
      <HeroBanner />
      
      {/* Tagline Banner */}
      <TaglineBanner />
      
      {/* H2: Fagområder */}
      <HeroCompact />
      
      {/* Value badges */}
      <ValueBadges />
      
      {/* H2: Promo blocks */}
      <PromoBlocks />
      
      {/* H2: FAQ */}
      <LifePhasesSection />
      
      {/* H2: Anmeldelser */}
      <GoogleReviewsSection />

      {/* H2: Spesialister */}
      <SpecialistsSection />

      {/* H2: Booking CTA */}
      <BookingCTA />
    </PageLayout>
  );
};

export default Index;
