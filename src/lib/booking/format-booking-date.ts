import { format, type Locale } from "date-fns";
import { enUS, nb } from "date-fns/locale";

export type BookingDateLang = "no" | "en";

function dateFnsLocale(lang: BookingDateLang): Locale {
  return lang === "en" ? enUS : nb;
}

function localeTag(lang: BookingDateLang): string {
  return lang === "en" ? "en-GB" : "nb-NO";
}

/** Capitalize only the first letter — do not use CSS `capitalize` (it title-cases every word). */
export function capitalizeBookingWord(value: string, lang: BookingDateLang = "no"): string {
  const trimmed = value.trim();
  if (!trimmed) return value;
  const first = trimmed.charAt(0).toLocaleUpperCase(localeTag(lang));
  return `${first}${trimmed.slice(1)}`;
}

/**
 * Long booking date: weekday and month both start with a capital letter.
 * Example (nb): «Mandag 19. November»
 */
export function formatBookingLongDate(date: Date, lang: BookingDateLang = "no"): string {
  const locale = dateFnsLocale(lang);
  const weekday = capitalizeBookingWord(format(date, "EEEE", { locale }), lang);
  const day = format(date, "d", { locale });
  const month = capitalizeBookingWord(format(date, "MMMM", { locale }), lang);
  return `${weekday} ${day}. ${month}`;
}

/** Short month with a capital first letter, e.g. «Nov». */
export function formatBookingMonthShort(date: Date, lang: BookingDateLang = "no"): string {
  return capitalizeBookingWord(format(date, "MMM", { locale: dateFnsLocale(lang) }), lang);
}

/** Example (nb): «19. Nov 2026». */
export function formatBookingShortDate(date: Date, lang: BookingDateLang = "no"): string {
  const locale = dateFnsLocale(lang);
  const day = format(date, "d", { locale });
  const month = formatBookingMonthShort(date, lang);
  const year = format(date, "yyyy", { locale });
  return `${day}. ${month} ${year}`;
}

export function bookingDateFnsLocale(lang: BookingDateLang): Locale {
  return dateFnsLocale(lang);
}
