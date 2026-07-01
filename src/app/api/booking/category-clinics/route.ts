import { NextResponse } from "next/server";
import type { BookingAvailabilityLocation } from "@/app/api/booking/availability/route";
import { fetchBookingResourceCached, unwrapList } from "@/lib/booking/upstream";
import {
  createLocationResolveCaches,
  mapWithConcurrency,
  resolveLocationsForActivity,
} from "@/lib/booking/resolveActivityLocations";
import type { CategoryClinicTag } from "@/lib/booking/mapApiLocation";

export type { CategoryClinicTag };

const GROUPS_URL =
  process.env.BOOKING_ACTIVITY_GROUPS_URL ||
  "http://13.50.107.42/api/v1/resources/wbactivitygroups";

const ACTIVITIES_URL =
  process.env.BOOKING_ACTIVITIES_URL ||
  "http://13.50.107.42/api/v1/resources/wbactivities";

const DEFAULT_CONCURRENCY = Number(process.env.BOOKING_CATEGORY_CLINICS_CONCURRENCY || 2);

interface ApiGroup {
  id?: number;
  name?: string;
}

interface ApiActivity {
  id?: number;
  name?: string;
  "wbactivitygroup-id"?: number;
  wbactivitygroupId?: number;
}

function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/å/g, "a")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function uniqueCategoryId(label: string, apiGroupId: number): string {
  return slugify(label) || `group-${apiGroupId}`;
}

function activityGroupId(activity: ApiActivity): number | undefined {
  const raw = activity["wbactivitygroup-id"] ?? activity.wbactivitygroupId;
  return typeof raw === "number" ? raw : undefined;
}

function mergeLocations(
  target: Map<number, BookingAvailabilityLocation>,
  locations: BookingAvailabilityLocation[],
) {
  for (const loc of locations) {
    if (!target.has(loc.locationId)) target.set(loc.locationId, loc);
  }
}

/**
 * GET — locations per booking category (from wbfreetimes → rooms → locations).
 * Query: `categoryId` — only resolve clinics for one category (serial activity calls).
 * Query: `serial=1` — resolve activities one-by-one (default when categoryId is set).
 *
 * Response: { ok, byCategoryId, allLocations }
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
  const filterCategoryId = searchParams.get("categoryId")?.trim() || undefined;
  const serial =
    searchParams.get("serial") === "1" ||
    filterCategoryId != null ||
    process.env.BOOKING_CATEGORY_CLINICS_SERIAL === "1";
  const concurrency = serial ? 1 : DEFAULT_CONCURRENCY;

  try {
    const [groupsPayload, activitiesPayload] = await Promise.all([
      fetchBookingResourceCached(GROUPS_URL, apiKey),
      fetchBookingResourceCached(ACTIVITIES_URL, apiKey),
    ]);

    const groups = unwrapList(groupsPayload) as ApiGroup[];
    const activities = unwrapList(activitiesPayload) as ApiActivity[];

    const categoryIdByGroupId = new Map<number, string>();
    for (const group of groups) {
      const label = group.name?.trim() ?? "";
      const apiGroupId = group.id;
      if (!label || apiGroupId === undefined) continue;
      categoryIdByGroupId.set(apiGroupId, uniqueCategoryId(label, apiGroupId));
    }

    const activitiesById = new Map<number, number>();
    for (const activity of activities) {
      const activityId = activity.id;
      const groupId = activityGroupId(activity);
      if (activityId == null || groupId === undefined) continue;
      activitiesById.set(activityId, groupId);
    }

    const activityIds = [...activitiesById.keys()].filter((activityId) => {
      if (!filterCategoryId) return true;
      const groupId = activitiesById.get(activityId);
      if (groupId === undefined) return false;
      const categoryId = categoryIdByGroupId.get(groupId);
      return categoryId === filterCategoryId;
    });
    const caches = createLocationResolveCaches();

    const activityLocationsList = await mapWithConcurrency(
      activityIds,
      concurrency,
      async (activityId) => {
        const locations = await resolveLocationsForActivity(activityId, apiKey, caches);
        return { activityId, locations };
      },
    );

    const byCategoryId: Record<string, CategoryClinicTag[]> = {};
    const allLocationsMap = new Map<number, CategoryClinicTag>();

    for (const { activityId, locations } of activityLocationsList) {
      const groupId = activitiesById.get(activityId);
      if (groupId === undefined) continue;
      const categoryId = categoryIdByGroupId.get(groupId);
      if (!categoryId) continue;

      const bucket = new Map<number, BookingAvailabilityLocation>();
      mergeLocations(bucket, locations);

      if (!byCategoryId[categoryId]) byCategoryId[categoryId] = [];
      const categoryMap = new Map(
        byCategoryId[categoryId].map((c) => [c.locationId, c] as const),
      );

      for (const loc of bucket.values()) {
        const tag = { locationId: loc.locationId, name: loc.name };
        categoryMap.set(loc.locationId, tag);
        allLocationsMap.set(loc.locationId, tag);
      }

      byCategoryId[categoryId] = [...categoryMap.values()].sort((a, b) =>
        a.name.localeCompare(b.name, "nb"),
      );
    }

    const allLocations = [...allLocationsMap.values()].sort((a, b) =>
      a.name.localeCompare(b.name, "nb"),
    );

    return NextResponse.json({ ok: true, byCategoryId, allLocations });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected booking proxy error.";
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}
