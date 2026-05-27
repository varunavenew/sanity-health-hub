/** Parse booking API `timelength` (e.g. "0:45:00" or "1:00:00"). */
export function parseDurationMinutes(timelength?: string): number | null {
  if (!timelength) return null;
  const parts = timelength.split(":").map(Number);
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

export function formatDurationMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (remainder === 0) return hours === 1 ? "1 hour" : `${hours} hours`;
  const hourLabel = hours === 1 ? "1 hour" : `${hours} hours`;
  return `${hourLabel} ${remainder} minutes`;
}
