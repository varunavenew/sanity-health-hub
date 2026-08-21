import {
  extractBirthdateIsoFromPersonnummer,
  formatPatientNumberForLookup,
} from "@/lib/booking/personalNumber";

/** Stable codes returned to the client — map to localized copy in the booking UI. */
export type BookingValidationCode = "INVALID_PERSONALNUMBER";

export class BookingValidationError extends Error {
  readonly code: BookingValidationCode;

  constructor(code: BookingValidationCode) {
    super(code);
    this.name = "BookingValidationError";
    this.code = code;
  }
}

export function isValidPersonalnumberForWebAccount(raw: string): boolean {
  return (
    formatPatientNumberForLookup(raw) != null &&
    extractBirthdateIsoFromPersonnummer(raw) != null
  );
}

export function assertValidPersonalnumberForWebAccount(raw: string): void {
  if (!isValidPersonalnumberForWebAccount(raw)) {
    throw new BookingValidationError("INVALID_PERSONALNUMBER");
  }
}
