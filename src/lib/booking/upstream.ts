import {
  currentBookingUpstreamEnv,
  resolveTestBookingApiBaseFromLive,
  type BookingUpstreamEnv,
} from "@/lib/booking/bookingUpstreamEnv.server";
import { unwrapList } from "@/lib/booking/unwrap-list";

export { metodikaSearchTime } from "@/lib/booking/metodikaSearchTime";
export { unwrapList } from "@/lib/booking/unwrap-list";
export type { BookingUpstreamEnv } from "@/lib/booking/bookingUpstreamEnv.server";

const LIVE_BOOKING_API_BASE =
  process.env.BOOKING_API_BASE_URL || "http://13.50.107.42/api/v1/resources";

/** Derive Laravel TEST resource base from LIVE base, or use TEST_BOOKING_API_BASE_URL. */
export function resolveBookingApiBase(
  env: BookingUpstreamEnv = currentBookingUpstreamEnv(),
): string {
  if (env === "test") {
    const explicit = process.env.TEST_BOOKING_API_BASE_URL?.trim();
    if (explicit) return explicit.replace(/\/$/, "");
    return resolveTestBookingApiBaseFromLive(LIVE_BOOKING_API_BASE);
  }
  return LIVE_BOOKING_API_BASE.replace(/\/$/, "");
}

export type BookingUrls = {
  freetimes: string;
  rooms: string;
  locations: string;
  users: string;
  wbactivities: string;
  webaccounts: string;
  appointments: string;
  itemPrices: string;
  activityGroups: string;
  aptAvailableTimes: string;
};

function buildBookingUrls(env: BookingUpstreamEnv): BookingUrls {
  const base = resolveBookingApiBase(env);

  if (env === "test") {
    // Never inherit LIVE-only absolute URL overrides (would hit LIVE Laravel).
    return {
      freetimes: `${base}/wbfreetimes`,
      rooms: `${base}/rooms`,
      locations: `${base}/locations`,
      users: `${base}/users`,
      wbactivities: `${base}/wbactivities`,
      webaccounts: `${base}/webaccounts`,
      appointments: `${base}/appointments`,
      itemPrices: `${base}/itemprices`,
      activityGroups: `${base}/wbactivitygroups`,
      aptAvailableTimes: `${base}/aptavailabletimes`,
    };
  }

  return {
    freetimes: process.env.BOOKING_FREETIMES_URL || `${base}/wbfreetimes`,
    rooms: process.env.BOOKING_ROOMS_URL || `${base}/rooms`,
    locations: process.env.BOOKING_LOCATIONS_URL || `${base}/locations`,
    users: process.env.BOOKING_USERS_URL || `${base}/users`,
    wbactivities:
      process.env.BOOKING_WBACTIVITIES_URL || `${base}/wbactivities`,
    webaccounts:
      process.env.BOOKING_WEBACCOUNTS_URL || `${base}/webaccounts`,
    appointments:
      process.env.BOOKING_APPOINTMENTS_URL || `${base}/appointments`,
    itemPrices:
      process.env.BOOKING_ITEM_PRICES_URL ||
      process.env.PRICE_URL ||
      `${base}/itemprices`,
    activityGroups:
      process.env.BOOKING_ACTIVITY_GROUPS_URL || `${base}/wbactivitygroups`,
    aptAvailableTimes:
      process.env.BOOKING_APT_AVAILABLE_TIMES_URL || `${base}/aptavailabletimes`,
  };
}

export function bookingUrlsFor(env: BookingUpstreamEnv = currentBookingUpstreamEnv()): BookingUrls {
  return buildBookingUrls(env);
}

/**
 * LIVE by default. Inside `runWithBookingUpstreamEnv('test', …)` resolves TEST Laravel URLs.
 * Existing LIVE imports keep working without call-site changes.
 */
export const BOOKING_URLS: BookingUrls = new Proxy({} as BookingUrls, {
  get(_target, prop: string | symbol) {
    if (typeof prop !== "string") return undefined;
    const urls = buildBookingUrls(currentBookingUpstreamEnv());
    return urls[prop as keyof BookingUrls];
  },
});

/** LIVE uses BOOKING_API_KEY; TEST prefers TEST_BOOKING_API_KEY then falls back. */
export function getBookingApiKey(
  env: BookingUpstreamEnv = currentBookingUpstreamEnv(),
): string | undefined {
  if (env === "test") {
    return process.env.TEST_BOOKING_API_KEY || process.env.BOOKING_API_KEY;
  }
  return process.env.BOOKING_API_KEY;
}

const CACHE_TTL_MS = Number(process.env.BOOKING_CACHE_TTL_MS || 5 * 60 * 1000);
const FREETIMES_CACHE_TTL_MS = Number(
  process.env.BOOKING_FREETIMES_CACHE_TTL_MS || 45 * 1000,
);
const FREETIMES_NEGATIVE_CACHE_TTL_MS = Number(
  process.env.BOOKING_FREETIMES_NEGATIVE_CACHE_MS || 30 * 1000,
);
const FREETIMES_CACHE_LOG = process.env.BOOKING_FREETIMES_CACHE_LOG === "1";
const MAX_RETRIES = Number(process.env.BOOKING_FETCH_MAX_RETRIES || 3);
const RETRYABLE_STATUSES = new Set([429, 502, 503, 504]);

const EMPTY_FREETIMES_SENTINEL = Symbol("empty-freetimes");

const FREETIMES_MAX_IN_FLIGHT = Number(process.env.BOOKING_FREETIMES_MAX_IN_FLIGHT || 8);
const FREETIMES_THROTTLE_MS = Number(process.env.BOOKING_FREETIMES_THROTTLE_MS || 0);

const responseCache = new Map<string, { expiresAt: number; data: unknown }>();
const inFlightRequests = new Map<string, Promise<unknown>>();

let freetimesInFlight = 0;
const freetimesWaitQueue: Array<() => void> = [];

async function acquireFreetimesSlot(): Promise<void> {
  if (freetimesInFlight < FREETIMES_MAX_IN_FLIGHT) {
    freetimesInFlight++;
    return;
  }
  await new Promise<void>((resolve) => {
    freetimesWaitQueue.push(resolve);
  });
  freetimesInFlight++;
}

function releaseFreetimesSlot(): void {
  freetimesInFlight--;
  const next = freetimesWaitQueue.shift();
  if (!next) return;
  if (FREETIMES_THROTTLE_MS > 0) {
    setTimeout(next, FREETIMES_THROTTLE_MS);
  } else {
    next();
  }
}

function isFreetimesUrl(url: string): boolean {
  return url.includes("/wbfreetimes");
}

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

function bookingCacheKey(url: string, apiKey: string): string {
  return `${url}::${apiKey}`;
}

export interface FreetimesQueryOptions {
  version?: number;
  /** Metodika `maxtimes` — profile availability probe uses 1. */
  maxTimes?: number;
  queryMode?: "alltimes";
  useInterval?: boolean;
  searchFromTime?: string;
  searchToTime?: string;
  locationId?: number;
  caregiverUserId?: number;
}

export function freetimesUrlFor(
  wbactivityId: string | number,
  options?: FreetimesQueryOptions,
): string {
  const params = new URLSearchParams();
  params.set("wbactivity-id", String(wbactivityId));

  if (options?.version != null) {
    params.set("version", String(options.version));
  }
  if (options?.maxTimes != null) {
    params.set("maxtimes", String(options.maxTimes));
  }
  if (options?.queryMode) {
    params.set("querymode", options.queryMode);
  }
  if (options?.useInterval) {
    params.set("useinterval", "true");
  }
  if (options?.searchFromTime) {
    params.set("searchfromtime", options.searchFromTime);
  }
  if (options?.searchToTime) {
    params.set("searchtotime", options.searchToTime);
  }
  if (options?.locationId != null) {
    params.set("location-id", String(options.locationId));
  }
  if (options?.caregiverUserId != null) {
    params.set("caregiver_user-id", String(options.caregiverUserId));
  }

  return `${BOOKING_URLS.freetimes}?${params.toString()}`;
}

/** Deduped fetch with optional TTL cache (shares in-flight requests for the same URL). */
async function fetchBookingResourceDeduped(
  url: string,
  apiKey: string,
  options: { cacheTtlMs: number; negativeCacheTtlMs?: number },
): Promise<unknown> {
  const cacheKey = bookingCacheKey(url, apiKey);
  const hit = responseCache.get(cacheKey);
  if (hit && hit.expiresAt > Date.now()) {
    if (hit.data === EMPTY_FREETIMES_SENTINEL) {
      throw new Error(`Upstream booking API recently failed for ${url}`);
    }
    if (FREETIMES_CACHE_LOG && isFreetimesUrl(url)) {
      console.info(`[booking/freetimes-cache] HIT ${url}`);
    }
    return hit.data;
  }
  if (FREETIMES_CACHE_LOG && isFreetimesUrl(url)) {
    console.info(`[booking/freetimes-cache] MISS ${url}`);
  }

  const inFlight = inFlightRequests.get(cacheKey);
  if (inFlight) return inFlight;

  const promise = (async () => {
    const needsSlot = isFreetimesUrl(url);
    if (needsSlot) await acquireFreetimesSlot();
    try {
      const data = await fetchBookingResource(url, apiKey);
      responseCache.set(cacheKey, {
        data,
        expiresAt: Date.now() + options.cacheTtlMs,
      });
      if (FREETIMES_CACHE_LOG && isFreetimesUrl(url)) {
        console.info(
          `[booking/freetimes-cache] STORE ${url} ttlMs=${options.cacheTtlMs}`,
        );
      }
      return data;
    } catch (error) {
      const negativeTtl = options.negativeCacheTtlMs ?? 0;
      if (negativeTtl > 0) {
        responseCache.set(cacheKey, {
          data: EMPTY_FREETIMES_SENTINEL,
          expiresAt: Date.now() + negativeTtl,
        });
      }
      throw error;
    } finally {
      if (needsSlot) releaseFreetimesSlot();
      inFlightRequests.delete(cacheKey);
    }
  })();

  inFlightRequests.set(cacheKey, promise);
  return promise;
}

/** Cached + deduped wbfreetimes payload for one activity. */
export async function fetchBookingFreetimesPayload(
  wbactivityId: string | number,
  apiKey: string,
  options?: FreetimesQueryOptions,
): Promise<unknown> {
  return fetchBookingResourceDeduped(freetimesUrlFor(wbactivityId, options), apiKey, {
    cacheTtlMs: FREETIMES_CACHE_TTL_MS,
    negativeCacheTtlMs: FREETIMES_NEGATIVE_CACHE_TTL_MS,
  });
}

/** wbfreetimes slot list; returns [] when upstream fails (does not throw). */
export async function fetchBookingFreetimesList(
  wbactivityId: string | number,
  apiKey: string,
  options?: FreetimesQueryOptions,
): Promise<unknown[]> {
  try {
    const payload = await fetchBookingFreetimesPayload(wbactivityId, apiKey, options);
    return unwrapList(payload);
  } catch {
    return [];
  }
}

/** Cached fetch for relatively static catalog endpoints (groups, activities, users). */
export async function fetchBookingResourceCached(
  url: string,
  apiKey: string,
): Promise<unknown> {
  const cacheKey = bookingCacheKey(url, apiKey);
  const hit = responseCache.get(cacheKey);
  if (hit && hit.expiresAt > Date.now()) return hit.data;

  const pending = inFlightRequests.get(cacheKey);
  if (pending) return pending;

  const promise = fetchBookingResource(url, apiKey)
    .then((data) => {
      responseCache.set(cacheKey, { data, expiresAt: Date.now() + CACHE_TTL_MS });
      return data;
    })
    .finally(() => {
      inFlightRequests.delete(cacheKey);
    });

  inFlightRequests.set(cacheKey, promise);
  return promise;
}

export function bookingResourceUrl(base: string, id: number | string): string {
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}id=${encodeURIComponent(String(id))}`;
}

export const WBACTIVITIES_SELLIMIT = 1000;

export interface WbActivitiesListOptions {
  fields?: string;
  sellimit?: number;
  /** Metodika filter: only wbactivities linked to this caregiver user id. */
  caregiverUserId?: number;
}

/** List URL for Metodika wbactivities (Henrik: sellimit=1000 + optional fields). */
export function wbactivitiesListUrl(options?: WbActivitiesListOptions): string {
  const base = BOOKING_URLS.wbactivities.replace(/\/$/, "");
  const params = new URLSearchParams();
  params.set("sellimit", String(options?.sellimit ?? WBACTIVITIES_SELLIMIT));
  if (options?.fields) {
    params.set("fields", options.fields);
  }
  if (options?.caregiverUserId != null) {
    params.set(
      "activitytype.caregiver.user.id",
      String(options.caregiverUserId),
    );
  }
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}${params.toString()}`;
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
