/** Parse booking API `timelength` (e.g. "0:45:00", "1:00:00", or "1 hour"). */
export function parseDurationMinutes(timelength?: string): number | null {
  if (!timelength) return null;
  const trimmed = timelength.trim();
  const unitMatch = trimmed.match(
    /^(\d+(?:[.,]\d+)?)\s*(hours?|timer?|minutes?|minutter|min)\s*$/i,
  );
  if (unitMatch) {
    const n = Number(unitMatch[1].replace(",", "."));
    if (!Number.isFinite(n)) return null;
    const unit = unitMatch[2].toLowerCase();
    if (unit.startsWith("hour") || unit.startsWith("time")) return Math.round(n * 60);
    return Math.round(n);
  }
  const parts = trimmed.split(":").map(Number);
  if (parts.length >= 2 && parts.every((n) => !Number.isNaN(n))) {
    if (parts.length >= 3) {
      const [hours, minutes] = parts;
      return (hours ?? 0) * 60 + (minutes ?? 0);
    }
    const [hours, minutes] = parts;
    return (hours ?? 0) * 60 + (minutes ?? 0);
  }
  return null;
}

/** Booking API `lengthtime` format, e.g. "00:45:00". */
export function minutesToLengthTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:00`;
}

function isEnglishLocale(locale?: string): boolean {
  return (locale ?? "").toLowerCase().startsWith("en");
}

/**
 * Human duration for booking/pricing UI.
 * Defaults to Norwegian so mixed copy like «Varighet 1 hour» cannot leak from a missing locale.
 */
export function formatDurationMinutes(minutes: number, locale: string = "no"): string {
  if (isEnglishLocale(locale)) {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const remainder = minutes % 60;
    if (remainder === 0) return hours === 1 ? "1 hour" : `${hours} hours`;
    const hourLabel = hours === 1 ? "1 hour" : `${hours} hours`;
    return `${hourLabel} ${remainder} minutes`;
  }

  if (minutes < 60) return `${minutes} minutter`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (remainder === 0) return hours === 1 ? "1 time" : `${hours} timer`;
  const hourLabel = hours === 1 ? "1 time" : `${hours} timer`;
  return `${hourLabel} ${remainder} minutter`;
}

/** Replace leaked English API units (`hour` / `hours`) in an already-built label. */
export function localizeDurationLabel(label: string, locale: string = "no"): string {
  if (isEnglishLocale(locale)) return label;
  return label
    .replace(/\bhours\b/gi, "timer")
    .replace(/\bhour\b/gi, "time")
    .replace(/\bminutes\b/gi, "minutter")
    .replace(/\bminute\b/gi, "minutt");
}
