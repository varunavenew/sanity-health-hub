import { NextResponse } from "next/server";
import {
  fetchProcedurePriceMap,
  parsePriceFromActivityName,
} from "@/lib/booking/item-prices";
import { fetchBookingResourceCached, unwrapList } from "@/lib/booking/upstream";

const GROUPS_URL =
  process.env.BOOKING_ACTIVITY_GROUPS_URL ||
  "http://13.50.107.42/api/v1/resources/wbactivitygroups";

const ACTIVITIES_URL =
  process.env.BOOKING_ACTIVITIES_URL ||
  "http://13.50.107.42/api/v1/resources/wbactivities";

interface BookingService {
  name: string;
  price: string;
  apiActivityId?: number;
}

export interface BookingCategory {
  id: string;
  clinicServiceId: string;
  label: string;
  apiGroupId: number;
  services: BookingService[];
}

interface ApiGroup {
  id?: number;
  name?: string;
}

interface ApiActivity {
  id?: number;
  "activity-id"?: number;
  activityId?: number;
  name?: string;
  "wbactivitygroup-id"?: number;
  wbactivitygroupId?: number;
}

const GROUP_LABEL_TO_CLINIC_ID: Record<string, string> = {
  fertilitet: "fertilitet",
  saedanalyse: "fertilitet",
  urolog: "urolog",
  gynekolog: "gynekolog",
  "fostermedisiner-graviditet": "fostermedisiner",
  "fysioterapeut-osteopat": "fysioterapeut",
  sexolog: "sexolog",
  "klinisk-ernaeringsfysiolog": "ernaringsfysiolog",
  hudlege: "hudlege",
  ortoped: "ortoped",
  psykolog: "psykolog",
  gastrokirurg: "gastrokirurg",
  revmatolog: "revmatolog",
  areknuter: "areknuter",
  endokrinolog: "endokrinolog",
  "sprengte-blodkar": "sprengte-blodkar",
  handterapeut: "handterapeut",
};

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

function cleanActivityName(name: string): string {
  return name.replace(/\s*fra\s+kr\s*[\d\s.,]+-?\s*/gi, "").trim();
}

function activityGroupId(activity: ApiActivity): number | undefined {
  const raw = activity["wbactivitygroup-id"] ?? activity.wbactivitygroupId;
  return typeof raw === "number" ? raw : undefined;
}

function activityProcedureId(activity: ApiActivity): number | undefined {
  const raw = activity["activity-id"] ?? activity.activityId;
  return typeof raw === "number" ? raw : undefined;
}

function uniqueCategoryId(label: string, apiGroupId: number): string {
  return slugify(label) || `group-${apiGroupId}`;
}

function clinicServiceIdForGroup(label: string): string {
  const slug = slugify(label);
  return GROUP_LABEL_TO_CLINIC_ID[slug] ?? slug;
}

function normalizeActivity(
  activity: ApiActivity,
  priceMap: Map<number, string>,
): BookingService | null {
  const rawName = activity.name?.trim();
  if (!rawName) return null;

  const procedureId = activityProcedureId(activity);
  const price =
    procedureId !== undefined && priceMap.has(procedureId)
      ? priceMap.get(procedureId)!
      : parsePriceFromActivityName(rawName);

  return {
    name: cleanActivityName(rawName),
    price,
    apiActivityId: activity.id,
  };
}

function compareCategories(a: BookingCategory, b: BookingCategory): number {
  return a.label.localeCompare(b.label, "nb");
}

export async function GET(request: Request) {
  const apiKey = process.env.BOOKING_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, message: "Missing BOOKING_API_KEY environment variable." },
      { status: 500 },
    );
  }

  const includePrices =
    new URL(request.url).searchParams.get("prices") === "1";

  try {
    const [groupsPayload, activitiesPayload] = await Promise.all([
      fetchBookingResourceCached(GROUPS_URL, apiKey),
      fetchBookingResourceCached(ACTIVITIES_URL, apiKey),
    ]);

    const groups = unwrapList(groupsPayload) as ApiGroup[];
    const activities = unwrapList(activitiesPayload) as ApiActivity[];

    const priceMap = includePrices
      ? await fetchProcedurePriceMap(
          [
            ...new Set(
              activities
                .map((a) => activityProcedureId(a))
                .filter((id): id is number => id !== undefined),
            ),
          ],
          apiKey,
        )
      : new Map<number, string>();

    const servicesByGroupId = new Map<number, BookingService[]>();
    for (const activity of activities) {
      const groupId = activityGroupId(activity);
      if (groupId === undefined) continue;
      const service = normalizeActivity(activity, priceMap);
      if (!service) continue;
      const list = servicesByGroupId.get(groupId) ?? [];
      list.push(service);
      servicesByGroupId.set(groupId, list);
    }

    const categories: BookingCategory[] = groups
      .map((group) => {
        const label = group.name?.trim() ?? "";
        const apiGroupId = group.id;
        if (!label || apiGroupId === undefined) return null;

        const services = servicesByGroupId.get(apiGroupId) ?? [
          { name: label, price: "0" },
        ];
        services.sort((a, b) => a.name.localeCompare(b.name, "nb"));

        return {
          id: uniqueCategoryId(label, apiGroupId),
          clinicServiceId: clinicServiceIdForGroup(label),
          label,
          apiGroupId,
          services,
        };
      })
      .filter((item): item is BookingCategory => item !== null)
      .sort(compareCategories);

    return NextResponse.json(
      { ok: true, categories },
      {
        headers: {
          "Cache-Control": "private, max-age=300, stale-while-revalidate=600",
        },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected booking proxy error.";
    console.error("[booking/activity-groups] error:", message);
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}
