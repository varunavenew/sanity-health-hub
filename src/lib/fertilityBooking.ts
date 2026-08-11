// Booking-tjeneste per fertilitetsside.
//
// Kunden krever at ALLE fertilitetssider åpner bookingflyten med en konkret
// tjeneste forhåndsvalgt — ingen side skal peke til generell booking.
//
//  a) Utvalgte sider → «Fertilitetsutredning» (time fra 2 850 kr)
//  b) Alle andre fertilitetssider → «Gratis uforpliktende samtale om fertilitet» (Gratis)

export const FERTILITY_SERVICE_UTREDNING = "fertilitetsutredning";
export const FERTILITY_SERVICE_SAMTALE = "gratis-uforpliktende-samtale-om-fertilitet";

export const FERTILITY_PRICE_UTREDNING = "time fra 2 850 kr";
export const FERTILITY_PRICE_SAMTALE = "Gratis";

export const FERTILITY_LABEL_UTREDNING = "Fertilitetsutredning";
export const FERTILITY_LABEL_SAMTALE = "Gratis uforpliktende samtale om fertilitet";

/** Sider som skal booke «Fertilitetsutredning». Nøkkel = subId (slug). */
const UTREDNING_PAGES = new Set<string>([
  "assistert-befruktning",
  "ivf",
  "fertilitetsutredning",
  "fertilitetsutredning-i-juli",
  "fertilitetssjekk",
  "assistert-befruktning-for-par-og-single",
  "mann-og-kvinne-i-parforhold",
  "to-kvinner-i-parforhold",
  "singel-kvinne",
  "singel-mann",
  "eggfrys",
  "nedfrysing",
  "nedfrysing-av-egg",
]);

export interface FertilityBookingChoice {
  tjeneste: string;
  price: string;
  label: string;
}

/**
 * Returnerer riktig bookbar tjeneste + prisvisning for en fertilitetsside.
 * `subId` er slug under /behandlinger/fertilitet/ (undefined = landingssiden).
 */
export function getFertilityBooking(subId?: string): FertilityBookingChoice {
  if (subId && UTREDNING_PAGES.has(subId)) {
    return {
      tjeneste: FERTILITY_SERVICE_UTREDNING,
      price: FERTILITY_PRICE_UTREDNING,
      label: FERTILITY_LABEL_UTREDNING,
    };
  }
  return {
    tjeneste: FERTILITY_SERVICE_SAMTALE,
    price: FERTILITY_PRICE_SAMTALE,
    label: FERTILITY_LABEL_SAMTALE,
  };
}
