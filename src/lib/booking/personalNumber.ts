/** Norwegian national identity number — always 11 digits (DDMMYY + 5-digit serial/check). */
export const FODSELSNUMMER_LENGTH = 11;

/** Digits only from a fødselsnummer / birth number input. */
export function personalNumberDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}

/** Normalize booking-form input — digits only, max 11. */
export function normalizeFodselsnummerInput(raw: string): string {
  return personalNumberDigits(raw).slice(0, FODSELSNUMMER_LENGTH);
}

const MOD11_K1_WEIGHTS = [3, 7, 6, 1, 8, 9, 4, 5, 2] as const;
const MOD11_K2_WEIGHTS = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2] as const;

/** Norwegian fødselsnummer mod-11 control digit; `null` when remainder yields 10 (invalid). */
function mod11ControlDigit(values: number[], weights: readonly number[]): number | null {
  const sum = values.reduce((acc, digit, index) => acc + digit * weights[index], 0);
  const remainder = sum % 11;
  const control = 11 - remainder;
  if (control === 10) return null;
  if (control === 11) return 0;
  return control;
}

/** Validate both mod-11 control digits (positions 10 and 11). */
export function isValidFodselsnummerMod11(digits: string): boolean {
  if (digits.length !== 11 || !/^\d{11}$/.test(digits)) return false;
  const parts = digits.split("").map(Number);
  const k1 = mod11ControlDigit(parts.slice(0, 9), MOD11_K1_WEIGHTS);
  if (k1 == null || k1 !== parts[9]) return false;
  const k2 = mod11ControlDigit(parts.slice(0, 10), MOD11_K2_WEIGHTS);
  if (k2 == null || k2 !== parts[10]) return false;
  return true;
}

function isValidCalendarDate(year: number, month: number, day: number): boolean {
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

/**
 * Full fødselsnummer validation: 11 digits, mod-11, valid calendar date,
 * D-number day > 40 rule, and Norwegian century mapping.
 */
export function isValidFodselsnummer(raw: string): boolean {
  const digits = personalNumberDigits(raw);
  if (digits.length !== 11) return false;
  if (!isValidFodselsnummerMod11(digits)) return false;

  const rawDay = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const yy = Number(digits.slice(4, 6));
  const individnummer = Number(digits.slice(6, 9));

  if (month < 1 || month > 12) return false;
  if (rawDay < 1 || rawDay > 71) return false;
  if (rawDay > 40 && rawDay <= 71) {
    const dDay = rawDay - 40;
    if (dDay < 1 || dDay > 31) return false;
  } else if (rawDay > 31) {
    return false;
  }

  const day = rawDay > 40 ? rawDay - 40 : rawDay;
  const year = norwegianBirthYear(yy, individnummer);
  return isValidCalendarDate(year, month, day);
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
  if (!isValidFodselsnummer(raw)) return null;
  const parts = splitFodselsnummer(raw);
  if (!parts) return null;
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
