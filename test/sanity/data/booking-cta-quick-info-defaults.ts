import { i18nString } from "../lib/category-landing-i18n";

/** Reference quick-info rows under Booking CTA buttons (NO + EN). */
export const DEFAULT_BOOKING_CTA_QUICK_INFO = [
  { icon: "clock" as const, no: "Kort ventetid", en: "Short waiting time" },
  { icon: "shield" as const, no: "Ingen henvisning", en: "No referral" },
];

/** Sanity array items for `quickInfoItems` on ctaCollection / pageSectionBookingCta. */
export const DEFAULT_BOOKING_CTA_QUICK_INFO_SANITY = DEFAULT_BOOKING_CTA_QUICK_INFO.map(
  (item) => ({
    _key: item.icon,
    icon: item.icon,
    text: i18nString(item.no, item.en),
  }),
);
