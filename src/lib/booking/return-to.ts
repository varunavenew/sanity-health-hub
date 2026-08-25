const STORAGE_KEY = "cmedical:booking-return-to";

/** True for booking flow paths (locale optional). */
export function isBookingPath(path: string): boolean {
  const pathname = path.split("?")[0].toLowerCase();
  return (
    /(?:^|\/)(?:no|en|nb)\/(?:booking|book-appointment)(?:\/|$)/.test(pathname) ||
    /(?:^|\/)(?:booking|book-appointment|bestill)(?:\/|$)/.test(pathname)
  );
}

/** Same-origin relative paths only; never booking itself. */
export function isSafeBookingReturnPath(path: string): boolean {
  const trimmed = path.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return false;
  if (trimmed.includes("://")) return false;
  if (isBookingPath(trimmed)) return false;
  return true;
}

export function rememberBookingReturnPath(path?: string): void {
  if (typeof window === "undefined") return;
  const candidate =
    path ?? `${window.location.pathname}${window.location.search}`;
  if (!isSafeBookingReturnPath(candidate)) return;
  try {
    sessionStorage.setItem(STORAGE_KEY, candidate);
  } catch {
    /* private mode / quota */
  }
}

export function peekBookingReturnPath(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored && isSafeBookingReturnPath(stored)) return stored;
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * Resolve where to go when closing booking.
 * Prefer `fra` query (explicit), then sessionStorage, then fallback.
 */
export function resolveBookingReturnPath(
  searchParams?: URLSearchParams | { get(name: string): string | null },
  fallback = "/",
): string {
  const fromQuery = searchParams?.get("fra")?.trim();
  if (fromQuery) {
    let decoded = fromQuery;
    try {
      decoded = decodeURIComponent(fromQuery);
    } catch {
      decoded = fromQuery;
    }
    if (isSafeBookingReturnPath(decoded)) return decoded;
  }

  const stored = peekBookingReturnPath();
  if (stored) return stored;

  return fallback;
}

/** Append `fra` and remember current page when building a booking URL in the browser. */
export function withBookingReturnContext(bookingUrl: string): string {
  if (typeof window === "undefined") return bookingUrl;

  const current = `${window.location.pathname}${window.location.search}`;
  if (!isSafeBookingReturnPath(current)) return bookingUrl;

  rememberBookingReturnPath(current);

  try {
    const url = new URL(bookingUrl, window.location.origin);
    if (!isBookingPath(url.pathname)) return bookingUrl;
    if (!url.searchParams.has("fra")) {
      url.searchParams.set("fra", current);
    }
    return `${url.pathname}${url.search}`;
  } catch {
    return bookingUrl;
  }
}
