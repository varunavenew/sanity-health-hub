import { isAppLocale, withLocalePath, type AppLocale } from "@/lib/i18n/routing";

const STORAGE_KEY = "cmedical:booking-return-to";

/** True for booking flow paths (locale optional). */
export function isBookingPath(path: string): boolean {
  const pathname = path.split("?")[0].toLowerCase();
  return (
    /(?:^|\/)(?:no|en|nb)\/(?:booking|book-appointment)(?:\/|$)/.test(pathname) ||
    /(?:^|\/)(?:booking|book-appointment|bestill)(?:\/|$)/.test(pathname)
  );
}

/** Locale from a pathname (`/no/...` → `no`). */
export function localeFromPathname(pathname: string): AppLocale | null {
  const first = pathname.split("/").filter(Boolean)[0];
  return first && isAppLocale(first) ? first : null;
}

/**
 * Prefix a booking path with the given (or current-page) locale.
 * Keeps query params. Safe to call with an already-prefixed path.
 * On the server without an explicit locale, returns the path unchanged
 * (Link / useNavigate apply locale at render time).
 */
export function withBookingLocale(
  bookingUrl: string,
  locale?: AppLocale | null,
): string {
  const resolved =
    locale ??
    (typeof window !== "undefined"
      ? localeFromPathname(window.location.pathname)
      : null);
  if (!resolved) return bookingUrl;
  return withLocalePath(resolved, bookingUrl);
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

/**
 * Append `fra`, remember current page, and prefix the current page locale.
 * Hard navigations (`window.location.href = buildBookingUrl(...)`) must not
 * land on bare `/booking`, or the proxy may redirect via geo/cookie to the
 * wrong locale (e.g. `/se/booking`).
 */
export function withBookingReturnContext(bookingUrl: string): string {
  if (typeof window === "undefined") return bookingUrl;

  const current = `${window.location.pathname}${window.location.search}`;
  const locale = localeFromPathname(window.location.pathname);

  if (isSafeBookingReturnPath(current)) {
    rememberBookingReturnPath(current);
  }

  try {
    const url = new URL(bookingUrl, window.location.origin);
    if (!isBookingPath(url.pathname)) {
      return withBookingLocale(bookingUrl, locale);
    }
    if (isSafeBookingReturnPath(current) && !url.searchParams.has("fra")) {
      url.searchParams.set("fra", current);
    }
    return withBookingLocale(`${url.pathname}${url.search}`, locale);
  } catch {
    return withBookingLocale(bookingUrl, locale);
  }
}
