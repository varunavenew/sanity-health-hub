/**
 * Metodika webaccount `username` / `phonemobile`: digits only with country code.
 * Example: `+47 406 17 409` → `4740617409`
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
 * Normalize any user-entered Norwegian mobile to Metodika format (`4740617409`).
 * Handles +47 / 0047 / spaces and duplicated country codes (e.g. +4747…).
 */
export function normalizeNorwegianMobileForMetodika(raw: string): string {
  let digits = digitsOnly(raw);

  while (digits.length > 10 && digits.startsWith("47")) {
    digits = digits.slice(2);
  }

  if (digits.length === 8) {
    digits = `47${digits}`;
  }

  if (digits.length !== 10 || !digits.startsWith("47")) {
    throw new Error("Invalid mobile: expected Norwegian mobile number.");
  }

  return digits;
}
