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

export async function fetchBookingResource(
  url: string,
  apiKey: string,
): Promise<unknown> {
  const response = await fetch(url, {
    headers: { "X-API-KEY": apiKey, Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Upstream booking API failed (${response.status}) for ${url}`);
  }

  return response.json();
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
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "X-API-KEY": apiKey,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
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
