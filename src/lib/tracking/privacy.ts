/** Keys that must never be sent to GTM / dataLayer (PII). */
const BLOCKED_PARAM_KEYS = new Set([
  "email",
  "phone",
  "mobile",
  "personalnumber",
  "personal_number",
  "birthnumber",
  "birth_number",
  "firstname",
  "first_name",
  "lastname",
  "last_name",
  "fnr",
  "ssn",
  "name",
  "symptoms",
  "message",
  "password",
  "username",
]);

const BLOCKED_PARAM_FRAGMENTS = [
  "email",
  "phone",
  "mobile",
  "personal",
  "birth",
  "password",
  "symptom",
] as const;

/** Strip PII from event params before pushing to dataLayer. */
export function sanitizeTrackingParams(
  params: Record<string, unknown>,
): Record<string, unknown> {
  const safe: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(params)) {
    const normalizedKey = key.trim().toLowerCase();
    if (BLOCKED_PARAM_KEYS.has(normalizedKey)) continue;
    if (BLOCKED_PARAM_FRAGMENTS.some((fragment) => normalizedKey.includes(fragment))) {
      continue;
    }
    if (value === undefined || value === "") continue;
    // Explicit null is allowed (GA4 custom dimensions — “unknown” vs empty string).
    if (value === null) {
      safe[key] = null;
      continue;
    }
    safe[key] = value;
  }

  return safe;
}
