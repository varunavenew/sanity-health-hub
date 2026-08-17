const OPENING_HOURS_LINE_BREAK =
  /\s+(?=(?:Man|Tir|Ons|Tor|Fre|Lør|Søn|Mon|Tue|Wed|Thu|Fri|Sat|Sun)(?:[–-][\p{L}]+)?\s+\d)/gu;

/** Split inline opening-hours copy into one line per day/range (e.g. "Man–tor … Fre …"). */
export function formatOpeningHours(hours: string | undefined | null): string {
  const trimmed = hours?.trim() ?? "";
  if (!trimmed) return "";
  if (trimmed.includes("\n")) return trimmed;
  return trimmed.replace(OPENING_HOURS_LINE_BREAK, "\n");
}

export function formatOpeningHoursLines(hours: string | undefined | null): string[] {
  return formatOpeningHours(hours)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
