import { metodikaSearchTime } from "@/lib/booking/metodikaSearchTime";
import { mapWithConcurrency } from "@/lib/booking/resolveActivityLocations";
import {
  fetchBookingFreetimesList,
  type FreetimesQueryOptions,
} from "@/lib/booking/upstream";

const DEFAULT_DAY_CONCURRENCY = Number(
  process.env.BOOKING_ALLTIMES_DAY_CONCURRENCY || 3,
);
const MAX_DAYS = Number(process.env.BOOKING_ALLTIMES_MAX_DAYS || 120);

function parseSearchDate(value: string): Date | null {
  const day = value.trim().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return null;
  const [y, m, d] = day.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return Number.isNaN(date.getTime()) ? null : date;
}

function eachDayInclusive(from: Date, to: Date): Date[] {
  const days: Date[] = [];
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setHours(0, 0, 0, 0);

  while (cursor <= end && days.length < MAX_DAYS) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function isSameCalendarDay(from: string, to: string): boolean {
  return from.trim().slice(0, 10) === to.trim().slice(0, 10);
}

/** Metodika alltimes only returns full slot lists for a single day — fan out one request per day. */
export async function fetchAlltimesForDayRange(
  wbactivityId: string | number,
  apiKey: string,
  searchFromTime: string,
  searchToTime: string,
  baseOptions?: Pick<
    FreetimesQueryOptions,
    "locationId" | "caregiverUserId"
  >,
): Promise<unknown[]> {
  if (isSameCalendarDay(searchFromTime, searchToTime)) {
    return fetchBookingFreetimesList(wbactivityId, apiKey, {
      version: 3,
      queryMode: "alltimes",
      useInterval: true,
      searchFromTime,
      searchToTime,
      ...baseOptions,
    });
  }

  const fromDate = parseSearchDate(searchFromTime);
  const toDate = parseSearchDate(searchToTime);
  if (!fromDate || !toDate || fromDate > toDate) return [];

  const days = eachDayInclusive(fromDate, toDate);
  const dayResults = await mapWithConcurrency(
    days,
    DEFAULT_DAY_CONCURRENCY,
    (day) =>
      fetchBookingFreetimesList(wbactivityId, apiKey, {
        version: 3,
        queryMode: "alltimes",
        useInterval: true,
        searchFromTime: metodikaSearchTime(day, false),
        searchToTime: metodikaSearchTime(day, true),
        ...baseOptions,
      }),
  );

  const merged: unknown[] = [];
  const seen = new Set<string>();

  for (const daySlots of dayResults) {
    for (const entry of daySlots) {
      if (!entry || typeof entry !== "object") continue;
      const start = (entry as Record<string, unknown>).startdatetime;
      if (typeof start !== "string" || seen.has(start)) continue;
      seen.add(start);
      merged.push(entry);
    }
  }

  return merged;
}
