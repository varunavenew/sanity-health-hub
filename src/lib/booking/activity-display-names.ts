/**
 * Display-only labels for Metodika wbactivity names.
 * Booking still uses Metodika ids; this does not rename the activity upstream.
 */

const GYNECOLOGY_CLINIC_SERVICE_IDS = new Set(["gynekolog", "gynekologi"]);

const GYNECOLOGY_DISPLAY_NAMES: Record<string, string> = {
  "generell undersokelse": "Generell gynekologisk undersøkelse",
};

function nameKey(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

export function displayBookingActivityName(
  name: string,
  clinicServiceId?: string,
): string {
  const trimmed = name.trim();
  if (!trimmed) return trimmed;
  if (clinicServiceId && !GYNECOLOGY_CLINIC_SERVICE_IDS.has(clinicServiceId)) {
    return trimmed;
  }
  return GYNECOLOGY_DISPLAY_NAMES[nameKey(trimmed)] ?? trimmed;
}
