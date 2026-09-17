import { NextResponse } from "next/server";
import {
  caregiverIdsForWbActivityAtLocation,
  findWbActivityEntry,
  locationIdsForCaregiverOnActivity,
  locationIdsForWbActivity,
  parseWbActivitiesMatrix,
  wbactivityIdsForCaregiver,
  type WbActivityMatrixEntry,
} from "@/lib/booking/wbactivitiesMatrix";
import {
  fetchBookingResourceCached,
  getBookingApiKey,
  wbactivitiesListUrl,
} from "@/lib/booking/upstream";

const WBACTIVITIES_FIELDS =
  "timelength,pricetype,supplementaryinformation,location";

function wbactivitiesUrl(): string {
  return wbactivitiesListUrl({ fields: WBACTIVITIES_FIELDS });
}

function parseOptionalInt(value: string | null): number | undefined {
  if (value == null || value.trim() === "") return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

async function loadMatrix(apiKey: string): Promise<WbActivityMatrixEntry[]> {
  const now = Date.now();
  if (parsedMatrixCache && parsedMatrixCache.expiresAt > now) {
    return parsedMatrixCache.matrix;
  }

  const payload = await fetchBookingResourceCached(wbactivitiesUrl(), apiKey);
  const matrix = parseWbActivitiesMatrix(payload);
  parsedMatrixCache = {
    matrix,
    expiresAt: now + PARSED_MATRIX_CACHE_TTL_MS,
  };
  return matrix;
}

const PARSED_MATRIX_CACHE_TTL_MS = 5 * 60 * 1000;
let parsedMatrixCache: {
  expiresAt: number;
  matrix: WbActivityMatrixEntry[];
} | null = null;

/**
 * GET /api/booking/wbactivities
 * Proxies Metodika wbactivities with location/caregiver matrix (Henrik flow).
 *
 * Query params:
 * - wbactivityId — single activity entry
 * - caregiverUserId — filter activities/locations for one caregiver
 * - locationId — with wbactivityId, list caregivers at location
 */
export async function GET(request: Request) {
  const apiKey = getBookingApiKey();
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, message: "Missing BOOKING_API_KEY environment variable." },
      { status: 500 },
    );
  }

  const { searchParams } = new URL(request.url);
  const wbactivityId = parseOptionalInt(
    searchParams.get("wbactivityId") ?? searchParams.get("wbactivity-id"),
  );
  const caregiverUserId = parseOptionalInt(
    searchParams.get("caregiverUserId") ?? searchParams.get("caregiver_user-id"),
  );
  const locationId = parseOptionalInt(
    searchParams.get("locationId") ?? searchParams.get("location-id"),
  );

  try {
    const matrix = await loadMatrix(apiKey);

    if (wbactivityId != null && caregiverUserId != null && locationId != null) {
      const entry = findWbActivityEntry(matrix, wbactivityId);
      const allowed = entry
        ? caregiverIdsForWbActivityAtLocation(entry, locationId).includes(
            caregiverUserId,
          )
        : false;
      return NextResponse.json({
        ok: true,
        allowed,
        wbactivityId,
        caregiverUserId,
        locationId,
      });
    }

    if (wbactivityId != null && locationId != null) {
      const entry = findWbActivityEntry(matrix, wbactivityId);
      const caregiverUserIds = caregiverIdsForWbActivityAtLocation(entry, locationId);
      return NextResponse.json({
        ok: true,
        wbactivityId,
        locationId,
        caregiverUserIds,
        ...(entry ? { activity: entry } : {}),
      });
    }

    if (wbactivityId != null && caregiverUserId != null) {
      const entry = findWbActivityEntry(matrix, wbactivityId);
      const locationIds = locationIdsForCaregiverOnActivity(entry, caregiverUserId);
      return NextResponse.json({
        ok: true,
        wbactivityId,
        caregiverUserId,
        locationIds,
        ...(entry ? { activity: entry } : {}),
      });
    }

    if (wbactivityId != null) {
      const entry = findWbActivityEntry(matrix, wbactivityId);
      if (!entry) {
        return NextResponse.json(
          { ok: false, message: `wbactivity ${wbactivityId} not found.` },
          { status: 404 },
        );
      }
      return NextResponse.json(
        {
          ok: true,
          activity: entry,
          locationIds: locationIdsForWbActivity(entry),
        },
        {
          headers: {
            "Cache-Control": "private, max-age=300, stale-while-revalidate=600",
          },
        },
      );
    }

    if (caregiverUserId != null) {
      const wbactivityIds = wbactivityIdsForCaregiver(matrix, caregiverUserId);
      const activities = matrix.filter((entry) =>
        wbactivityIds.includes(entry.wbactivityId),
      );
      return NextResponse.json({
        ok: true,
        caregiverUserId,
        wbactivityIds,
        activities,
      });
    }

    return NextResponse.json({ ok: true, activities: matrix });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected booking proxy error.";
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}
