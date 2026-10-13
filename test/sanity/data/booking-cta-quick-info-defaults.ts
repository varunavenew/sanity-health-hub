import { i18nString } from "../lib/category-landing-i18n";

/** Reference booking band quick info (check icons on the site). */
export const DEFAULT_BOOKING_CTA_QUICK_INFO = [
  { icon: "check" as const, no: "Kort ventetid", en: "Short waiting time" },
  { icon: "check" as const, no: "Ingen henvisning nødvendig", en: "No referral needed" },
];

/** Sanity array items for `quickInfoItems` on ctaCollection / pageSectionBookingCta. */
export const DEFAULT_BOOKING_CTA_QUICK_INFO_SANITY = DEFAULT_BOOKING_CTA_QUICK_INFO.map(
  (item, index) => ({
    _key: `qi-${index}`,
    icon: item.icon,
    text: i18nString(item.no, item.en),
  }),
);
