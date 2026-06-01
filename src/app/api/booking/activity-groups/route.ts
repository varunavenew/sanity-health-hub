import { NextResponse } from "next/server";
import { fetchBookingResource, unwrapList } from "@/lib/booking/upstream";

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
  /** Unique React key / booking step id (from API group label). */
  id: string;
  /** Id used in clinic `services` arrays for availability badges. */
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
  name?: string;
  "wbactivitygroup-id"?: number;
  wbactivitygroupId?: number;
}

/** Map API group labels to clinic `services` ids used in clinic data. */
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

function parsePriceFromName(name: string): string {
  const match = name.match(/fra\s+kr\s*([\d\s]+)/i) ?? name.match(/kr\s*([\d\s]+)/i);
  if (match) return match[1].replace(/\s/g, "").trim();
  return "0";
}

function cleanActivityName(name: string): string {
  return name.replace(/\s*fra\s+kr\s*[\d\s.,]+-?\s*/gi, "").trim();
}

function activityGroupId(activity: ApiActivity): number | undefined {
  const raw = activity["wbactivitygroup-id"] ?? activity.wbactivitygroupId;
  return typeof raw === "number" ? raw : undefined;
}

function uniqueCategoryId(label: string, apiGroupId: number): string {
  return slugify(label) || `group-${apiGroupId}`;
}

function clinicServiceIdForGroup(label: string): string {
  const slug = slugify(label);
  return GROUP_LABEL_TO_CLINIC_ID[slug] ?? slug;
}

function normalizeActivity(activity: ApiActivity): BookingService | null {
  const rawName = activity.name?.trim();
  if (!rawName) return null;

  return {
    name: cleanActivityName(rawName),
    price: parsePriceFromName(rawName),
    apiActivityId: activity.id,
  };
}

function compareCategories(a: BookingCategory, b: BookingCategory): number {
  return a.label.localeCompare(b.label, "nb");
}

export async function GET() {
  const apiKey = process.env.BOOKING_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, message: "Missing BOOKING_API_KEY environment variable." },
      { status: 500 },
    );
  }

  try {
    const [groupsPayload, activitiesPayload] = await Promise.all([
      fetchBookingResource(GROUPS_URL, apiKey),
      fetchBookingResource(ACTIVITIES_URL, apiKey),
    ]);

    const groups = unwrapList(groupsPayload) as ApiGroup[];
    const activities = unwrapList(activitiesPayload) as ApiActivity[];
    const servicesByGroupId = new Map<number, BookingService[]>();
    for (const activity of activities) {
      const groupId = activityGroupId(activity);
      if (groupId === undefined) continue;
      const service = normalizeActivity(activity);
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
          {
            name: label,
            price: "0",
          },
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

    console.log("[booking/activity-groups] fetched categories from wbactivities", {
      categoryCount: categories.length,
      categories: categories.map((c) => ({
        id: c.id,
        clinicServiceId: c.clinicServiceId,
        apiGroupId: c.apiGroupId,
        label: c.label,
        serviceCount: c.services.length,
        services: c.services.map((s) => ({
          name: s.name,
          apiActivityId: s.apiActivityId,
          price: s.price,
        })),
      })),
    });

    return NextResponse.json({ ok: true, categories });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected booking proxy error.";
    return NextResponse.json({ ok: false, message }, { status: 502 });
  }
}
