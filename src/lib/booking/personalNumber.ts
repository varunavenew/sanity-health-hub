/** Digits only from a fødselsnummer / birth number input. */
export function personalNumberDigits(raw: string): string {
  return raw.replace(/\D/g, "");
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
  // 900–999: yy 00–39 → 2000–2039; yy 40–99 → 1940–1999 (Henrik century rules)
  if (yy <= 39) {
    return 2000 + yy;
  }
  return 1900 + yy;
}

function splitFodselsnummer(raw: string): {
  digits: string;
  dd: string;
  mm: string;
  yyyy: number;
  rest: string;
} | null {
  const digits = personalNumberDigits(raw);
  if (digits.length !== 11) return null;

  let day = Number(digits.slice(0, 2));
  const mm = digits.slice(2, 4);
  const yy = Number(digits.slice(4, 6));
  const individnummer = Number(digits.slice(6, 9));
  const rest = digits.slice(6);
  // D-number (foreign nationals): day offset +40.
  if (day > 40) day -= 40;
  const dd = String(day).padStart(2, "0");
  const yyyy = norwegianBirthYear(yy, individnummer);
  return { digits, dd, mm, yyyy, rest };
}

/**
 * Metodika webaccount `birthdate` — ISO `YYYY-MM-DD` derived from fødselsnummer.
 * Required so patient card Fødselsdato is not 00.00.0000 (Convene payment chain).
 */
export function extractBirthdateIsoFromPersonnummer(raw: string): string | null {
  const parts = splitFodselsnummer(raw);
  if (!parts) return null;

  const month = Number(parts.mm);
  const day = Number(parts.dd);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;

  return `${parts.yyyy}-${parts.mm}-${parts.dd}`;
}

/**
 * Canonical Metodika `patientnumber` for GET lookup + POST create.
 * Matches existing clinic patients: `DDMMYY-XXXXX`.
 * Example: `07088740259` → `070887-40259`
 */
export function formatPatientNumberForLookup(raw: string): string | null {
  const digits = personalNumberDigits(raw);
  if (digits.length !== 11) return null;
  return `${digits.slice(0, 6)}-${digits.slice(6)}`;
}

/** Plain 11 digits, kept for lookup of any records created without a hyphen. */
export function formatPatientNumberDigitsLegacy(raw: string): string | null {
  const digits = personalNumberDigits(raw);
  if (digits.length !== 11) return null;
  return digits;
}

/**
 * Old booking format that created duplicates (`07-08-198740259`).
 * Kept for lookup fallback so those records can still be reused.
 */
export function formatPatientNumberDashLegacy(raw: string): string | null {
  const parts = splitFodselsnummer(raw);
  if (!parts) return null;
  return `${parts.dd}-${parts.mm}-${parts.yyyy}${parts.rest}`;
}

/**
 * Legacy dotted form previously used (`12.01.1977xxxxx`).
 * Kept for lookup fallback against older webaccounts.
 */
export function formatPatientNumberDottedLegacy(raw: string): string | null {
  const parts = splitFodselsnummer(raw);
  if (!parts) return null;
  return `${parts.dd}.${parts.mm}.${parts.yyyy}${parts.rest}`;
}

/**
 * Candidate patientnumber strings to try for lookup.
 * Prefer `DDMMYY-XXXXX` (existing patients), then older duplicates we created.
 */
export function patientNumberLookupCandidates(raw: string): string[] {
  const primary = formatPatientNumberForLookup(raw);
  const digitsLegacy = formatPatientNumberDigitsLegacy(raw);
  const dashLegacy = formatPatientNumberDashLegacy(raw);
  const dottedLegacy = formatPatientNumberDottedLegacy(raw);
  return [
    ...new Set(
      [primary, digitsLegacy, dashLegacy, dottedLegacy].filter(
        (v): v is string => Boolean(v),
      ),
    ),
  ];
}
