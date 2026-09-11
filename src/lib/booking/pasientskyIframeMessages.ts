const COMPLETION_SIGNALS = new Set([
  "bookingcompleted",
  "bookingconfirmed",
  "appointmentcreated",
  "appointmentbooked",
  "bookingsuccess",
  "reservationcompleted",
]);

export function pasientskyIframeOrigin(
  iframeBaseUrl: string | undefined,
): string | null {
  if (!iframeBaseUrl?.trim()) return null;
  try {
    return new URL(iframeBaseUrl).origin;
  } catch {
    return null;
  }
}

export function isPasientskyMessageOrigin(
  origin: string,
  iframeBaseUrl: string | undefined,
): boolean {
  const allowed = pasientskyIframeOrigin(iframeBaseUrl);
  return Boolean(allowed && origin === allowed);
}

export function coercePasientskyMessageData(data: unknown): unknown {
  if (typeof data !== "string") return data;
  const trimmed = data.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return data;
  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return data;
  }
}

export function asMessageRecord(
  data: unknown,
): Record<string, unknown> | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  return data as Record<string, unknown>;
}

/** Lowercase and strip separators so `booking-completed` and `bookingCompleted` match. */
export function normalizePasientskySignal(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function isPasientskyCompletionMessage(data: Record<string, unknown>): boolean {
  const signal = normalizePasientskySignal(
    data.event ?? data.type ?? data.name ?? data.action,
  );
  return COMPLETION_SIGNALS.has(signal);
}

function pickId(value: unknown): string | number | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return undefined;
}

export function resolvePasientskyTransactionId(
  data: Record<string, unknown>,
): string | number | undefined {
  const appointment = asMessageRecord(data.appointment);
  const nested = asMessageRecord(data.data);
  return (
    pickId(data.appointmentId) ??
    pickId(data.transaction_id) ??
    pickId(appointment?.id) ??
    pickId(nested?.appointmentId) ??
    pickId(data.id)
  );
}

export function stringifyPasientskyDebugPayload(data: unknown): string {
  try {
    const raw = typeof data === "string" ? data : JSON.stringify(data);
    if (raw.length <= 500) return raw;
    return `${raw.slice(0, 500)}…`;
  } catch {
    return "[unserializable]";
  }
}
