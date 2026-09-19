/**
 * Build Laravel → Metodika aptavailabletimes URL from query params.
 * Prefer hyphenated Metodika names (start-datetime, caregiver_user-id, …).
 */
export function aptAvailableTimesUrl(
  base: string,
  searchParams: URLSearchParams,
): string {
  const root = base.replace(/\/$/, "");
  const qs = searchParams.toString();
  if (!qs) return `${root}/`;
  return `${root}/?${qs}`;
}
