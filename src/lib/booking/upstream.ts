const BOOKING_API_BASE =
  process.env.BOOKING_API_BASE_URL || "http://13.50.107.42/api/v1/resources";

export const BOOKING_URLS = {
  freetimes: process.env.BOOKING_FREETIMES_URL || `${BOOKING_API_BASE}/wbfreetimes`,
  rooms: process.env.BOOKING_ROOMS_URL || `${BOOKING_API_BASE}/rooms`,
  locations: process.env.BOOKING_LOCATIONS_URL || `${BOOKING_API_BASE}/locations`,
  users: process.env.BOOKING_USERS_URL || `${BOOKING_API_BASE}/users`,
  wbactivities:
    process.env.BOOKING_WBACTIVITIES_URL || `${BOOKING_API_BASE}/wbactivities`,
  webaccounts:
    process.env.BOOKING_WEBACCOUNTS_URL || `${BOOKING_API_BASE}/webaccounts`,
  appointments:
    process.env.BOOKING_APPOINTMENTS_URL || `${BOOKING_API_BASE}/appointments`,
  itemPrices:
    process.env.BOOKING_ITEM_PRICES_URL ||
    process.env.PRICE_URL ||
    `${BOOKING_API_BASE}/itemprices`,
};

const CACHE_TTL_MS = Number(process.env.BOOKING_CACHE_TTL_MS || 5 * 60 * 1000);
const MAX_RETRIES = Number(process.env.BOOKING_FETCH_MAX_RETRIES || 3);
const RETRYABLE_STATUSES = new Set([429, 502, 503, 504]);

const responseCache = new Map<string, { expiresAt: number; data: unknown }>();

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function retryDelayMs(response: Response, attempt: number): number {
  const retryAfter = response.headers.get("retry-after");
  if (retryAfter) {
    const seconds = Number(retryAfter);
    if (Number.isFinite(seconds) && seconds > 0) return seconds * 1000;
  }
  return Math.min(500 * 2 ** attempt, 8000);
}

export function unwrapList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== "object") return [];

  const root = payload as Record<string, unknown>;
  const level1 = root.data;

  if (Array.isArray(level1)) return level1;
  if (level1 && typeof level1 === "object") {
    const nested = (level1 as Record<string, unknown>).data;
    if (Array.isArray(nested)) return nested;
  }

  if (Array.isArray(root.result)) return root.result;
  return [];
}

async function fetchBookingResponse(
  url: string,
  apiKey: string,
  init?: RequestInit,
): Promise<Response> {
  let lastResponse: Response | undefined;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const response = await fetch(url, {
      ...init,
      headers: {
        "X-API-KEY": apiKey,
        Accept: "application/json",
        ...init?.headers,
      },
      cache: "no-store",
    });

    if (response.ok || !RETRYABLE_STATUSES.has(response.status) || attempt === MAX_RETRIES) {
      return response;
    }

    lastResponse = response;
    await sleep(retryDelayMs(response, attempt));
  }

  return lastResponse!;
}

export async function fetchBookingResource(
  url: string,
  apiKey: string,
): Promise<unknown> {
  const response = await fetchBookingResponse(url, apiKey);

  if (!response.ok) {
    throw new Error(`Upstream booking API failed (${response.status}) for ${url}`);
  }

  return response.json();
}

/** Cached fetch for relatively static catalog endpoints (groups, activities). */
export async function fetchBookingResourceCached(
  url: string,
  apiKey: string,
): Promise<unknown> {
  const cacheKey = `${url}::${apiKey}`;
  const hit = responseCache.get(cacheKey);
  if (hit && hit.expiresAt > Date.now()) return hit.data;

  const data = await fetchBookingResource(url, apiKey);
  responseCache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  return data;
}

export function bookingResourceUrl(base: string, id: number | string): string {
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}id=${encodeURIComponent(String(id))}`;
}

export async function postBookingResource(
  url: string,
  apiKey: string,
  body: Record<string, unknown>,
): Promise<unknown> {
  const response = await fetchBookingResponse(url, apiKey, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    let message = `Upstream booking API failed (${response.status}) for ${url}`;
    if (payload && typeof payload === "object") {
      const obj = payload as Record<string, unknown>;
      const status = obj.status;
      if (status && typeof status === "object" && status !== null) {
        const desc = (status as Record<string, unknown>).description;
        if (typeof desc === "string" && desc.trim()) {
          message = desc;
        }
      }
      if (typeof obj.message === "string" && obj.message.trim()) {
        message = obj.message;
      }
    }
    throw new Error(message);
  }

  return payload;
}
