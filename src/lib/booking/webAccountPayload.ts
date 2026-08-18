import { randomBytes } from "node:crypto";
import { formatPatientNumberForLookup } from "@/lib/booking/personalNumber";

export type WebAccountCustomerInput = {
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  /** Raw or already-normalized birth / personal number. */
  personalnumber: string;
};

/** Unique username for Metodika webaccount create (Henrik: can be any unique value). */
export function generateWebAccountUsername(): string {
  const stamp = Date.now().toString(36);
  const rand = randomBytes(4).toString("hex");
  return `web-${stamp}-${rand}`;
}

/**
 * Body for POST /webaccounts per Metodika / Henrik schema.
 * Links webaccount to patient via accounttype SSN + plain 11-digit patientnumber.
 */
export function buildWebAccountCreateBody(
  customer: WebAccountCustomerInput,
): Record<string, unknown> {
  const patientnumber = formatPatientNumberForLookup(customer.personalnumber);
  if (!patientnumber) {
    throw new Error("Invalid personalnumber: expected 11-digit fødselsnummer.");
  }

  return {
    username: generateWebAccountUsername(),
    firstname: customer.firstname,
    lastname: customer.lastname,
    patientnumber,
    email: customer.email,
    phonemobile: customer.mobile,
    smsallowed: true,
    passwordtype: "nopassword",
    accounttype: "SSN",
  };
}
