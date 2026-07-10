"use client";

import { BookingCTA } from "@/components/homepage/BookingCTA";
import type { PageSectionBookingCtaConfig } from "@/lib/sanity/page-sections";

type Props = {
  config: PageSectionBookingCtaConfig;
};

export function PageSectionBookingCtaBlock({ config }: Props) {
  return (
    <BookingCTA
      title={config.title}
      subtitle={config.subtitle}
      image={config.image}
      imageAlt={config.imageAlt}
      variant="dark"
      primaryLabel={config.primaryLabel}
      primaryPath={config.primaryPath}
      bookingCategoryId={config.bookingCategory?.categoryId}
      showSecondaryButton={config.showSecondaryButton}
      secondaryLabel={config.secondaryLabel}
      secondaryPath={config.secondaryPath}
      quickInfoItems={config.quickInfoItems}
    />
  );
}
