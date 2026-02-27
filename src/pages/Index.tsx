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


interface IndexProps {
  isChatOpen: boolean;
}

const Index = ({ isChatOpen }: IndexProps) => {
  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Hero carousel */}
      <HeroBanner />
      
      {/* Tagline Banner */}
      <TaglineBanner />
      
      {/* Fagområder */}
      <HeroCompact />
      
      {/* Value badges */}
      <ValueBadges />
      
      {/* Promo blocks (2 bilder) */}
      <PromoBlocks />
      
      {/* FAQ */}
      <LifePhasesSection />
      
      <SpecialistsSection />
      
      <GoogleReviewsSection />
      <BookingCTA />
    </PageLayout>
  );
};

export default Index;
