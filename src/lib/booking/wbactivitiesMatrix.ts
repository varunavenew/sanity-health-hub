import { unwrapList } from "@/lib/booking/upstream";

export interface WbActivityCaregiverRef {
  userId: number;
}

export interface WbActivityLocationRef {
  locationId: number;
  caregivers: WbActivityCaregiverRef[];
}

export interface WbActivityMatrixEntry {
  wbactivityId: number;
  procedureId?: number;
  activityTypeId?: number;
  wbactivityGroupId?: number;
  name: string;
  timeLength?: string;
  priceType?: string;
  locations: WbActivityLocationRef[];
}

function readUserId(entry: unknown): number | undefined {
  if (!entry || typeof entry !== "object") return undefined;
  const user = (entry as Record<string, unknown>).user;
  if (!user || typeof user !== "object") return undefined;
  const id = (user as Record<string, unknown>).id;
  return typeof id === "number" ? id : undefined;
}

function parseLocation(entry: unknown): WbActivityLocationRef | null {
  if (!entry || typeof entry !== "object") return null;
  const row = entry as Record<string, unknown>;
  const locationId = row.id;
  if (typeof locationId !== "number") return null;

  const rawCaregivers = row.caregiver;
  const caregivers: WbActivityCaregiverRef[] = [];
  if (Array.isArray(rawCaregivers)) {
    for (const cg of rawCaregivers) {
      const userId = readUserId(cg);
      if (userId != null) caregivers.push({ userId });
    }
  }

  return { locationId, caregivers };
}

/** Parse Metodika wbactivities payload (with location field) into normalized entries. */
export function parseWbActivitiesMatrix(payload: unknown): WbActivityMatrixEntry[] {
  return unwrapList(payload)
    .map((entry): WbActivityMatrixEntry | null => {
      if (!entry || typeof entry !== "object") return null;
      const row = entry as Record<string, unknown>;
      const wbactivityId = row.id;
      const name = typeof row.name === "string" ? row.name.trim() : "";
      if (typeof wbactivityId !== "number" || !name) return null;

      const procedureId = (row["activity-id"] ?? row.activityId) as number | undefined;
      const activityTypeId = (row["activitytype-id"] ?? row.activityTypeId) as
        | number
        | undefined;
      const wbactivityGroupId = (row["wbactivitygroup-id"] ?? row.wbactivitygroupId) as
        | number
        | undefined;
      const timeLength =
        typeof row.timelength === "string" ? row.timelength.trim() : undefined;
      const priceType =
        typeof row.pricetype === "string" ? row.pricetype.trim() : undefined;

      const locations = Array.isArray(row.location)
        ? row.location
            .map(parseLocation)
            .filter((item): item is WbActivityLocationRef => item !== null)
        : [];

      return {
        wbactivityId,
        name,
        ...(typeof procedureId === "number" ? { procedureId } : {}),
        ...(typeof activityTypeId === "number" ? { activityTypeId } : {}),
        ...(typeof wbactivityGroupId === "number" ? { wbactivityGroupId } : {}),
        ...(timeLength ? { timeLength } : {}),
        ...(priceType ? { priceType } : {}),
        locations,
      };
    })
    .filter((item): item is WbActivityMatrixEntry => item !== null);
}

export function findWbActivityEntry(
  matrix: WbActivityMatrixEntry[],
  wbactivityId: number,
): WbActivityMatrixEntry | undefined {
  return matrix.find((entry) => entry.wbactivityId === wbactivityId);
}

/** Location ids where a wbactivity can be booked (Metodika setup). */
export function locationIdsForWbActivity(
  entry: WbActivityMatrixEntry | undefined,
): number[] {
  if (!entry) return [];
  return entry.locations.map((loc) => loc.locationId);
}

/** Caregiver user ids allowed for wbactivity at a location (capability, not availability). */
export function caregiverIdsForWbActivityAtLocation(
  entry: WbActivityMatrixEntry | undefined,
  locationId: number,
): number[] {
  if (!entry) return [];
  const loc = entry.locations.find((item) => item.locationId === locationId);
  if (!loc) return [];
  return [...new Set(loc.caregivers.map((cg) => cg.userId))].sort((a, b) => a - b);
}

/** Location ids where the caregiver may perform this wbactivity. */
export function locationIdsForCaregiverOnActivity(
  entry: WbActivityMatrixEntry | undefined,
  caregiverUserId: number,
): number[] {
  if (!entry) return [];
  return entry.locations
    .filter((loc) => loc.caregivers.some((cg) => cg.userId === caregiverUserId))
    .map((loc) => loc.locationId);
}

/** wbactivity ids the caregiver is configured to perform (any location). */
export function wbactivityIdsForCaregiver(
  matrix: WbActivityMatrixEntry[],
  caregiverUserId: number,
): number[] {
  const ids = new Set<number>();
  for (const entry of matrix) {
    const hasCaregiver = entry.locations.some((loc) =>
      loc.caregivers.some((cg) => cg.userId === caregiverUserId),
    );
    if (hasCaregiver) ids.add(entry.wbactivityId);
  }
  return [...ids].sort((a, b) => a - b);
}

export function caregiverPerformsActivityAtLocation(
  entry: WbActivityMatrixEntry | undefined,
  caregiverUserId: number,
  locationId: number,
): boolean {
  if (!entry) return false;
  const loc = entry.locations.find((item) => item.locationId === locationId);
  if (!loc) return false;
  return loc.caregivers.some((cg) => cg.userId === caregiverUserId);
}
