import {
  fetchProcedurePriceMap,
  parsePriceFromActivityName,
  resolveActivityPrice,
  stripPriceFromActivityName,
} from "@/lib/booking/item-prices";
import { displayBookingActivityName } from "@/lib/booking/activity-display-names";
import { parseDurationMinutes } from "@/lib/booking/duration";
import {
  fetchBookingResourceCached,
  unwrapList,
  wbactivitiesListUrl,
} from "@/lib/booking/upstream";

const GROUPS_URL =
  process.env.BOOKING_ACTIVITY_GROUPS_URL ||
  "http://13.50.107.42/api/v1/resources/wbactivitygroups";

/** Same upstream as activity-groups; `fields=timelength` for step 1 duration without freetimes. */
const ACTIVITIES_URL =
  process.env.BOOKING_ACTIVITIES_URL ||
  wbactivitiesListUrl({ fields: "timelength" });

export interface BookingServiceFromApi {
  name: string;
  price: string;
  apiActivityId?: number;
  /** Minutes from Metodika wbactivities `timelength` (formatted client-side). */
  durationMinutes?: number;
}

export interface BookingCategoryFromApi {
  id: string;
  clinicServiceId: string;
  label: string;
  apiGroupId: number;
  services: BookingServiceFromApi[];
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
  timelength?: string;
  "wbactivitygroup-id"?: number;
  wbactivitygroupId?: number;
}

const GROUP_LABEL_TO_CLINIC_ID: Record<string, string> = {
  fertilitet: "fertilitet",
  saedanalyse: "fertilitet",
  urolog: "urolog",
  gynekolog: "gynekolog",
  graviditet: "fostermedisiner",
  fostermedisiner: "fostermedisiner",
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
): BookingServiceFromApi | null {
  const rawName = activity.name?.trim();
  if (!rawName) return null;

  const procedureId = activityProcedureId(activity);
  const price = resolveActivityPrice(rawName, procedureId, priceMap);
  const durationMinutes = parseDurationMinutes(activity.timelength?.trim());

  return {
    name: stripPriceFromActivityName(rawName),
    price,
    apiActivityId: activity.id,
    ...(durationMinutes != null ? { durationMinutes } : {}),
  };
}

function compareCategories(a: BookingCategoryFromApi, b: BookingCategoryFromApi): number {
  return a.label.localeCompare(b.label, "nb");
}

export type BuildBookingActivityGroupsOptions = {
  includeApiPrices?: boolean;
  baseDate?: string;
};

/** Shared Metodika activity-groups catalog (used by API route + RSC prefetch). */
export async function buildBookingActivityGroupsCatalog(
  apiKey: string,
  options: BuildBookingActivityGroupsOptions = {},
): Promise<BookingCategoryFromApi[]> {
  const { includeApiPrices = false, baseDate } = options;

  const [groupsPayload, activitiesPayload] = await Promise.all([
    fetchBookingResourceCached(GROUPS_URL, apiKey),
    fetchBookingResourceCached(ACTIVITIES_URL, apiKey),
  ]);

  const groups = unwrapList(groupsPayload) as ApiGroup[];
  const activities = unwrapList(activitiesPayload) as ApiActivity[];

  const priceMap = includeApiPrices
    ? await fetchProcedurePriceMap(
        [
          ...new Set(
            activities
              .map((activity) => {
                const rawName = activity.name?.trim();
                if (!rawName) return undefined;
                if (parsePriceFromActivityName(rawName) !== "0") return undefined;
                return activityProcedureId(activity);
              })
              .filter((id): id is number => id !== undefined),
          ),
        ],
        apiKey,
        baseDate ? { baseDate } : undefined,
      )
    : new Map<number, string>();

  const servicesByGroupId = new Map<number, BookingServiceFromApi[]>();
  for (const activity of activities) {
    const groupId = activityGroupId(activity);
    if (groupId === undefined) continue;
    const service = normalizeActivity(activity, priceMap);
    if (!service) continue;
    const list = servicesByGroupId.get(groupId) ?? [];
    list.push(service);
    servicesByGroupId.set(groupId, list);
  }

  return groups
    .map((group) => {
      const label = group.name?.trim() ?? "";
      const apiGroupId = group.id;
      if (!label || apiGroupId === undefined) return null;

      const clinicServiceId = clinicServiceIdForGroup(label);
      const services = (servicesByGroupId.get(apiGroupId) ?? [
        { name: label, price: "0" },
      ]).map((service) => ({
        ...service,
        name: displayBookingActivityName(service.name, clinicServiceId),
      }));
      services.sort((a, b) => a.name.localeCompare(b.name, "nb"));

      return {
        id: uniqueCategoryId(label, apiGroupId),
        clinicServiceId,
        label,
        apiGroupId,
        services,
      };
    })
    .filter((item): item is BookingCategoryFromApi => item !== null)
    .sort(compareCategories);
}
