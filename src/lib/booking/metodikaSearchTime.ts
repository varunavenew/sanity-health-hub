/** Metodika expects local datetime strings without timezone, e.g. 2026-08-31T00:00:00 */
export function metodikaSearchTime(date: Date, endOfDay = false): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return endOfDay ? `${y}-${m}-${d}T23:59:59` : `${y}-${m}-${d}T00:00:00`;
}
