import { NextResponse } from "next/server";
import {
  normalizeBookingCaregiver,
  type BookingCaregiver,
} from "@/lib/booking/bookingCaregiver";
import {
  BOOKING_URLS,
  bookingResourceUrl,
  fetchBookingResource,
  unwrapList,
} from "@/lib/booking/upstream";

const DEFAULT_CONCURRENCY = 6;

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  if (items.length === 0) return [];
  const results = new Array<R>(items.length);
  let index = 0;

  async function worker() {
    while (index < items.length) {
      const current = index++;
      results[current] = await fn(items[current]);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );
  return results;
}

function parseIdsParam(raw: string | null): number[] {
  if (!raw?.trim()) return [];
  return [
    ...new Set(
      raw
        .split(",")
        .map((part) => Number(part.trim()))
        .filter((id) => Number.isFinite(id) && id > 0),
    ),
  ];
}

/**
 * GET ?id=33 or ?ids=33,45,67
 * Proxies booking system users (caregivers).
 */
export async function GET(request: Request) {
  const apiKey = process.env.BOOKING_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, message: "Missing BOOKING_API_KEY environment variable." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const ids = parseIdsParam(searchParams.get("ids") ?? searchParams.get("id"));

  if (ids.length === 0) {
    return NextResponse.json(
      { ok: false, message: "Missing id or ids query parameter." },
      { status: 400 },
    );
  }

  const specialty = searchParams.get("specialty")?.trim();

  try {
    const caregivers = await mapWithConcurrency(ids, DEFAULT_CONCURRENCY, async (userId) => {
      try {
        const url = bookingResourceUrl(BOOKING_URLS.users, userId);
        const payload = await fetchBookingResource(url, apiKey);
        const entries = unwrapList(payload);
        const entry = entries[0];
        if (!entry || typeof entry !== "object") return null;
        return normalizeBookingCaregiver(
          entry as Record<string, unknown>,
          specialty || undefined,
        );
      } catch {
        return null;
      }
    });

    const users = caregivers
      .filter((item): item is BookingCaregiver => item !== null)
      .sort((a, b) => a.name.localeCompare(b.name, "nb"));

    return NextResponse.json({ ok: true, users });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected booking proxy error.";
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}
