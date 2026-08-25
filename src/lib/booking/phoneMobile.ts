/**
 * Metodika webaccount `username` / `phonemobile`: 8-digit local number only (no country code).
 * Example: `+47 406 17 409` → `40617409`
 */

function digitsOnly(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }
  return digits;
}

/** Strip country code for the booking UI field shown after a fixed +47 prefix. */
export function stripNorwegianMobileInputForField(raw: string): string {
  let digits = digitsOnly(raw);

  while (digits.startsWith("47") && digits.length > 8) {
    digits = digits.slice(2);
  }

  return digits.slice(0, 8);
}

/** Local part after +47 prefix — exactly 8 digits required before submit. */
export function isValidNorwegianMobileFieldInput(raw: string): boolean {
  return stripNorwegianMobileInputForField(raw).length === 8;
}

/**
 * Normalize any user-entered Norwegian mobile to Metodika format (`40617409`).
 * Strips +47 / 0047 / spaces and duplicated country codes (e.g. +4747…).
 */
export function normalizeNorwegianMobileForMetodika(raw: string): string {
  const local = stripNorwegianMobileInputForField(raw);

  if (local.length !== 8) {
    throw new Error("Invalid mobile: expected 8-digit Norwegian mobile number.");
  }

  return local;
}
