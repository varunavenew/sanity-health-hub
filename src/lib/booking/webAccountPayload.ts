import {
  extractBirthdateIsoFromPersonnummer,
  formatPatientNumberForLookup,
} from "@/lib/booking/personalNumber";
import { assertValidPersonalnumberForWebAccount } from "@/lib/booking/booking-validation";
import { normalizeNorwegianMobileForMetodika } from "@/lib/booking/phoneMobile";

export type WebAccountCustomerInput = {
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  /** Raw or already-normalized birth / personal number. */
  personalnumber: string;
};

/**
 * Body for POST /webaccounts per Metodika / Henrik schema.
 * Links webaccount to patient via accounttype SSN + `DDMMYY-XXXXX` patientnumber.
 * Username and phonemobile use 8-digit local mobile only (`40617409`, no country code).
 */
export function buildWebAccountCreateBody(
  customer: WebAccountCustomerInput,
): Record<string, unknown> {
  assertValidPersonalnumberForWebAccount(customer.personalnumber);
  const patientnumber = formatPatientNumberForLookup(customer.personalnumber)!;
  const birthdate = extractBirthdateIsoFromPersonnummer(customer.personalnumber)!;

  const phonemobile = normalizeNorwegianMobileForMetodika(customer.mobile);

  return {
    username: phonemobile,
    firstname: customer.firstname,
    lastname: customer.lastname,
    patientnumber,
    birthdate,
    email: customer.email,
    phonemobile,
    smsallowed: true,
    passwordtype: "nopassword",
    accounttype: "SSN",
  };
}
