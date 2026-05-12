import { BookingCTA } from "@/components/homepage/BookingCTA";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  primaryCTA?: string;
  primaryLink?: string;
  secondaryCTA?: string;
  secondaryLink?: string;
  dark?: boolean;
}

/**
 * Unified pre-footer CTA. All variants on the site (Hjem, Tjenester, Fertilitet,
 * Om oss, Priser etc.) render the same BookingCTA — same design, layout and
 * style as the home version. Props are accepted for backwards compatibility
 * but intentionally ignored to keep the section identical across pages.
 */
export const CTASection = (_props: CTASectionProps) => {
  return <BookingCTA />;
};
