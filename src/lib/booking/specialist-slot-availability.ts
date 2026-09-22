import {
  metodikaSlotBookableForProfile,
  resolveMetodikaAvailabilitySlots,
  type ResolvedMetodikaAvailabilitySlot,
} from "@/lib/booking/resolve-metodika-availability-slots";

const SLOT_CHECK_CONCURRENCY = 2;

function parseIdList(value: string | null): number[] {
  if (!value?.trim()) return [];
  return [...new Set(value.split(",").map((part) => Number(part.trim())))]
    .filter((id) => Number.isFinite(id) && id > 0)
    .sort((a, b) => a - b);
}

async function metodikaActivityHasSlot(
  wbactivityId: number,
  locationId: number,
  caregiverUserId: number,
  apiKey: string,
  slotsByActivity: Map<number, ResolvedMetodikaAvailabilitySlot[]>,
): Promise<boolean> {
  let slots = slotsByActivity.get(wbactivityId);
  if (!slots) {
    slots = await resolveMetodikaAvailabilitySlots(wbactivityId, apiKey);
    slotsByActivity.set(wbactivityId, slots);
  }
  return slots.some((slot) =>
    metodikaSlotBookableForProfile({ slot, locationId, caregiverUserId }),
  );
}

export type MetodikaBookableActivityPair = {
  locationId: number;
  wbactivityId: number;
};

/** Profile treatments (wbactivity × Metodika location) that have caregiver freetime. */
export async function specialistMetodikaBookableActivityPairs(params: {
  wbactivityIds: number[];
  locationIds: number[];
  caregiverUserId?: number;
  apiKey: string;
}): Promise<MetodikaBookableActivityPair[]> {
  const { wbactivityIds, locationIds, caregiverUserId, apiKey } = params;
  if (wbactivityIds.length === 0 || locationIds.length === 0) return [];
  if (caregiverUserId == null) return [];

  const checks: Array<{ wbactivityId: number; locationId: number }> = [];
  for (const locationId of locationIds) {
    for (const wbactivityId of wbactivityIds) {
      checks.push({ wbactivityId, locationId });
    }
  }

  const bookable: MetodikaBookableActivityPair[] = [];
  const slotsByActivity = new Map<number, ResolvedMetodikaAvailabilitySlot[]>();

  for (let index = 0; index < checks.length; index += SLOT_CHECK_CONCURRENCY) {
    const batch = checks.slice(index, index + SLOT_CHECK_CONCURRENCY);
    const results = await Promise.all(
      batch.map(({ wbactivityId, locationId }) =>
        metodikaActivityHasSlot(
          wbactivityId,
          locationId,
          caregiverUserId,
          apiKey,
          slotsByActivity,
        ),
      ),
    );
    batch.forEach(({ wbactivityId, locationId }, batchIndex) => {
      if (results[batchIndex]) {
        bookable.push({ locationId, wbactivityId });
      }
    });
  }

  return bookable;
}

/** True when any caregiver treatment has freetime at a Metodika clinic location. */
export async function specialistHasMetodikaSlots(params: {
  wbactivityIds: number[];
  locationIds: number[];
  caregiverUserId?: number;
  apiKey: string;
}): Promise<boolean> {
  const pairs = await specialistMetodikaBookableActivityPairs(params);
  return pairs.length > 0;
}

type PasientskyCalendarRow = {
  id?: string;
  containsSelectedTimeslotTypes?: boolean;
};

function normalizePasientskyCalendars(json: unknown): PasientskyCalendarRow[] {
  if (!json || typeof json !== "object") return [];
  const root = json as Record<string, unknown>;
  if (Array.isArray(root.calendars)) return root.calendars as PasientskyCalendarRow[];
  if (Array.isArray(root.data)) return root.data as PasientskyCalendarRow[];
  const data = root.data;
  if (data && typeof data === "object") {
    const nested = data as Record<string, unknown>;
    if (Array.isArray(nested.calendars)) {
      return nested.calendars as PasientskyCalendarRow[];
    }
  }
  return [];
}

function plannerApiBase(): string | undefined {
  return (
    process.env.PATIENTSKY_API_URL?.trim() ||
    process.env.NEXT_PUBLIC_PATIENTSKY_API_URL?.trim() ||
    undefined
  );
}

function formatDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

async function fetchPasientskyCalendars(
  serviceProviderId: string,
): Promise<PasientskyCalendarRow[]> {
  const base = plannerApiBase();
  if (!base) return [];

  const from = new Date();
  const to = new Date();
  to.setMonth(to.getMonth() + 6);

  const path =
    process.env.PATIENTSKY_CALENDARS_PATH?.trim() ||
    `/open-api/service-providers/{serviceProviderId}/external-booking-flow`;
  const resolvedPath = path.replace(
    "{serviceProviderId}",
    encodeURIComponent(serviceProviderId),
  );
  const url = new URL(resolvedPath, base.endsWith("/") ? base : `${base}/`);

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customBookingFlowId: null,
      calendarIds: null,
      timeslotTypeIds: null,
      dateRange: { from: formatDate(from), to: formatDate(to) },
      selectedDateForDetails: null,
    }),
    next: { revalidate: 300 },
  });

  if (!res.ok) return [];
  const json = (await res.json()) as unknown;
  return normalizePasientskyCalendars(json);
}

/** True when Pasientsky returns a bookable calendar for this specialist/clinic. */
export async function specialistHasPasientskySlots(params: {
  serviceProviderId: string;
  calendarId?: string;
}): Promise<boolean> {
  const calendars = await fetchPasientskyCalendars(params.serviceProviderId);
  if (calendars.length === 0) return false;

  const calendarId = params.calendarId?.trim();
  const relevant = calendarId
    ? calendars.filter((row) => row.id?.trim() === calendarId)
    : calendars;

  if (relevant.length === 0) return false;

  return relevant.some((row) => row.containsSelectedTimeslotTypes !== false);
}

export function parseSpecialistSlotsQuery(searchParams: URLSearchParams): {
  wbactivityIds: number[];
  locationIds: number[];
  caregiverUserId?: number;
  pasientskyServiceProviderId?: string;
  pasientskyCalendarId?: string;
} {
  const caregiverRaw =
    searchParams.get("caregiverUserId") ?? searchParams.get("caregiver_user-id");
  const caregiverUserId = caregiverRaw ? Number(caregiverRaw) : undefined;

  return {
    wbactivityIds: parseIdList(searchParams.get("wbactivityIds")),
    locationIds: parseIdList(searchParams.get("locationIds")),
    ...(Number.isFinite(caregiverUserId) && caregiverUserId! > 0
      ? { caregiverUserId }
      : {}),
    pasientskyServiceProviderId:
      searchParams.get("pasientskyServiceProviderId")?.trim() || undefined,
    pasientskyCalendarId:
      searchParams.get("pasientskyCalendarId")?.trim() || undefined,
  };
}
