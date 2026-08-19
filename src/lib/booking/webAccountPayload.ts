import { formatPatientNumberForLookup } from "@/lib/booking/personalNumber";
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
 * Username and phonemobile use normalized Norwegian mobile (`4740617409`).
 */
export function buildWebAccountCreateBody(
  customer: WebAccountCustomerInput,
): Record<string, unknown> {
  const patientnumber = formatPatientNumberForLookup(customer.personalnumber);
  if (!patientnumber) {
    throw new Error("Invalid personalnumber: expected 11-digit fødselsnummer.");
  }

  const phonemobile = normalizeNorwegianMobileForMetodika(customer.mobile);

  return {
    username: phonemobile,
    firstname: customer.firstname,
    lastname: customer.lastname,
    patientnumber,
    email: customer.email,
    phonemobile,
    smsallowed: true,
    passwordtype: "nopassword",
    accounttype: "SSN",
  };
}
