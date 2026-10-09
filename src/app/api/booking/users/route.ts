import { NextResponse } from "next/server";
import {
  normalizeBookingCaregiver,
  type BookingCaregiver,
} from "@/lib/booking/bookingCaregiver";
import {
  fetchSanityCaregiverPortraits,
  resolveSanityCaregiverImage,
} from "@/lib/booking/sanityBookingCaregiver";
import {
  BOOKING_URLS,
  bookingResourceUrl,
  fetchBookingResourceCached,
  unwrapList,
} from "@/lib/booking/upstream";

const USERS_LIST_CACHE_TTL_MS = 5 * 60 * 1000;

let usersByIdCache: {
  expiresAt: number;
  byId: Map<number, Record<string, unknown>>;
} | null = null;
let usersByIdInFlight: Promise<Map<number, Record<string, unknown>>> | null = null;

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

function indexUsersPayload(payload: unknown): Map<number, Record<string, unknown>> {
  const byId = new Map<number, Record<string, unknown>>();
  for (const entry of unwrapList(payload)) {
    if (!entry || typeof entry !== "object") continue;
    const row = entry as Record<string, unknown>;
    const rawId = row.id;
    const id = typeof rawId === "number" ? rawId : Number(rawId);
    if (!Number.isFinite(id) || id <= 0) continue;
    byId.set(id, row);
  }
  return byId;
}

/** One upstream list call — step 3 used to N× fetch users/{id}. */
async function loadMetodikaUsersById(
  apiKey: string,
): Promise<Map<number, Record<string, unknown>>> {
  const now = Date.now();
  if (usersByIdCache && usersByIdCache.expiresAt > now) {
    return usersByIdCache.byId;
  }
  if (usersByIdInFlight) return usersByIdInFlight;

  usersByIdInFlight = (async () => {
    const payload = await fetchBookingResourceCached(BOOKING_URLS.users, apiKey);
    const byId = indexUsersPayload(payload);
    usersByIdCache = { byId, expiresAt: Date.now() + USERS_LIST_CACHE_TTL_MS };
    return byId;
  })().finally(() => {
    usersByIdInFlight = null;
  });

  return usersByIdInFlight;
}

async function fetchUserById(
  apiKey: string,
  userId: number,
): Promise<Record<string, unknown> | null> {
  const url = bookingResourceUrl(BOOKING_URLS.users, userId);
  const payload = await fetchBookingResourceCached(url, apiKey);
  const entry = unwrapList(payload)[0];
  return entry && typeof entry === "object"
    ? (entry as Record<string, unknown>)
    : null;
}

function caregiverFromEntry(
  entry: Record<string, unknown>,
  specialty: string | undefined,
  portraits: Awaited<ReturnType<typeof fetchSanityCaregiverPortraits>>,
): BookingCaregiver | null {
  const caregiver = normalizeBookingCaregiver(entry, specialty);
  if (!caregiver) return null;
  const sanityImage = resolveSanityCaregiverImage(portraits, {
    apiUserId: caregiver.apiUserId,
    name: caregiver.name,
  });
  return sanityImage ? { ...caregiver, image: sanityImage } : caregiver;
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
    const [portraits, usersById] = await Promise.all([
      fetchSanityCaregiverPortraits(),
      loadMetodikaUsersById(apiKey),
    ]);

    const caregivers = await Promise.all(
      ids.map(async (userId) => {
        let entry = usersById.get(userId);
        if (!entry) {
          try {
            entry = (await fetchUserById(apiKey, userId)) ?? undefined;
          } catch {
            return null;
          }
        }
        if (!entry) return null;
        return caregiverFromEntry(entry, specialty || undefined, portraits);
      }),
    );

    const users = caregivers
      .filter((item): item is BookingCaregiver => item !== null)
      .sort((a, b) => a.name.localeCompare(b.name, "nb"));

    return NextResponse.json(
      { ok: true, users },
      {
        headers: {
          "Cache-Control": "private, max-age=300, stale-while-revalidate=600",
        },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected booking proxy error.";
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}
