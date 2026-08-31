import {
  FODSELSNUMMER_LENGTH,
  isValidFodselsnummer,
  personalNumberDigits,
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
  return isValidFodselsnummer(raw);
}

export function assertValidPersonalnumberForWebAccount(raw: string): void {
  if (!isValidPersonalnumberForWebAccount(raw)) {
    throw new BookingValidationError("INVALID_PERSONALNUMBER");
  }
}

/**
 * Frontend field error for fødselsnummer.
 * When `markIncomplete` is true (e.g. on blur), any non-empty value that is not
 * exactly 11 valid digits returns the error message.
 */
export function fodselsnummerFieldError(
  raw: string,
  message: string,
  options?: { markIncomplete?: boolean },
): string | null {
  const digits = personalNumberDigits(raw);
  if (digits.length === 0) return null;
  if (digits.length !== FODSELSNUMMER_LENGTH) {
    return options?.markIncomplete ? message : null;
  }
  return isValidFodselsnummer(digits) ? null : message;
}

/** True when the field has exactly 11 digits passing full validation (submit gate). */
export function isFodselsnummerReadyForSubmit(raw: string): boolean {
  const digits = personalNumberDigits(raw);
  return digits.length === FODSELSNUMMER_LENGTH && isValidFodselsnummer(digits);
}
