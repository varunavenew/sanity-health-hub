/**
 * Metodika webaccount `username` / `phonemobile`: digits only with country code.
 * Example: `+47 406 17 409` → `4740617409`
 */
export function normalizeNorwegianMobileForMetodika(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) {
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
