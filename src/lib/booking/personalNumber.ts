/** Digits only from a fødselsnummer / birth number input. */
export function personalNumberDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}

/**
 * Format for Metodika webaccount POST (`personalnumber`) when still sent.
 * Example: `25099112345` → `250991-12345`
 */
export function formatPersonalNumberForCreate(raw: string): string {
  const digits = personalNumberDigits(raw);
  if (digits.length === 11) {
    return `${digits.slice(0, 6)}-${digits.slice(6)}`;
  }
  return digits;
}

/**
 * Resolve full birth year from Norwegian fødselsnummer YY + individnummer.
 * @see https://en.wikipedia.org/wiki/National_identity_number_(Norway)
 */
export function norwegianBirthYear(yy: number, individnummer: number): number {
  if (individnummer >= 0 && individnummer <= 499) {
    return 1900 + yy;
  }
  if (individnummer >= 500 && individnummer <= 749) {
    return yy >= 54 ? 1800 + yy : 2000 + yy;
  }
  if (individnummer >= 750 && individnummer <= 899) {
    return 2000 + yy;
  }
  // 900–999 → 1940–1999
  return 1900 + yy;
}

function splitFodselsnummer(raw: string): {
  dd: string;
  mm: string;
  yyyy: number;
  rest: string;
} | null {
  const digits = personalNumberDigits(raw);
  if (digits.length !== 11) return null;

  const dd = digits.slice(0, 2);
  const mm = digits.slice(2, 4);
  const yy = Number(digits.slice(4, 6));
  const individnummer = Number(digits.slice(6, 9));
  const rest = digits.slice(6);
  const yyyy = norwegianBirthYear(yy, individnummer);
  return { dd, mm, yyyy, rest };
}

/**
 * Metodika `patientnumber` for GET lookup + POST create (Henrik).
 * Prefer dash form: `12-01-1977xxxxx` (not dots).
 * Example: `25099112345` → `25-09-199112345`
 */
export function formatPatientNumberForLookup(raw: string): string | null {
  const parts = splitFodselsnummer(raw);
  if (!parts) return null;
  return `${parts.dd}-${parts.mm}-${parts.yyyy}${parts.rest}`;
}

/**
 * Legacy dotted form previously used in logs (`12.01.1977xxxxx`).
 * Kept for lookup fallback against older webaccounts.
 */
export function formatPatientNumberDottedLegacy(raw: string): string | null {
  const parts = splitFodselsnummer(raw);
  if (!parts) return null;
  return `${parts.dd}.${parts.mm}.${parts.yyyy}${parts.rest}`;
}

/** Candidate patientnumber strings to try for lookup (dash first, then legacy dotted). */
export function patientNumberLookupCandidates(raw: string): string[] {
  const primary = formatPatientNumberForLookup(raw);
  const legacy = formatPatientNumberDottedLegacy(raw);
  return [...new Set([primary, legacy].filter((v): v is string => Boolean(v)))];
}
