"use client";

import { BookingCTA } from "@/components/homepage/BookingCTA";
import type { PageSectionBookingCtaConfig } from "@/lib/sanity/page-sections";
import { hasBookingCtaSection } from "@/lib/sanity/section-visibility";

type Props = {
  config: PageSectionBookingCtaConfig;
};

/**
 * Shared Booking CTA band from pageSections.
 *
 * Quick info resolution order:
 * 1. CTA Collection / inline band (via dual-read → config.quickInfoItems)
 * 2. Ultimate FE i18n defaults only when CMS left quickInfoItems unset
 * 3. Explicit CMS `[]` hides chips
 *
 * Empty / non-meaningful config → do not render this block.
 * SubTreatmentLayout still falls back to a default BookingCTA when no
 * usable pageSectionBookingCta exists (pending seed migration).
 */
export function PageSectionBookingCtaBlock({ config }: Props) {
  if (!hasBookingCtaSection(config)) return null;

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
      backgroundColor={config.backgroundColor}
      textColor={config.textColor}
    />
  );
}
