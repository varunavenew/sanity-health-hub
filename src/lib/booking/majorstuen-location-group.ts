import type { BookingClinic, BookingMetodikaClinic } from "@/lib/booking/mapApiLocation";
import { isMetodikaClinic } from "@/lib/booking/mapApiLocation";
import {
  locationIdsForCaregiverOnActivity,
  locationIdsForWbActivity,
  type WbActivityMatrixEntry,
} from "@/lib/booking/wbactivitiesMatrix";

/** Metodika LIVE: 1 = Majorstuen 10A, 2 = Majorstuen 10B */
export const MAJORSTUEN_METODIKA_LOCATION_IDS = [1, 2] as const;

export const MAJORSTUEN_GROUP_CLINIC_ID = "location-majorstuen";

export const MAJORSTUEN_DISPLAY_LABEL = "Majorstuen";

const MAJORSTUEN_BADGE_KEYS = new Set(["majorstuen-10a", "majorstuen-10b"]);

export function isMajorstuenMetodikaLocationId(locationId: number): boolean {
  return (MAJORSTUEN_METODIKA_LOCATION_IDS as readonly number[]).includes(locationId);
}

export function isMajorstuenGroupedClinic(clinic: BookingMetodikaClinic): boolean {
  return clinic.id === MAJORSTUEN_GROUP_CLINIC_ID || (clinic.apiLocationIds?.length ?? 0) > 1;
}

export function isMajorstuenClinicLabel(label: string): boolean {
  const normalized = label
    .toLowerCase()
    .replace(/^cmedical\s+/i, "")
    .replace(/^oslo\s+/i, "")
    .trim();
  if (normalized === "majorstuen") return true;
  return /majorstuen\s*10\s*[ab]/i.test(label);
}

export function metodikaLocationIdsForClinic(clinic: BookingMetodikaClinic): number[] {
  if (clinic.apiLocationIds?.length) {
    return [...clinic.apiLocationIds];
  }
  return [clinic.apiLocationId];
}

export function clinicCoversMetodikaLocation(
  clinic: BookingMetodikaClinic,
  locationId: number,
): boolean {
  return metodikaLocationIdsForClinic(clinic).includes(locationId);
}

export function slotMatchesMetodikaClinic(
  slot: { locationId?: number },
  clinic: BookingMetodikaClinic,
): boolean {
  if (slot.locationId == null) return true;
  return clinicCoversMetodikaLocation(clinic, slot.locationId);
}

export function intersectMajorstuenLocationIds(ids: number[]): number[] {
  const allowed = new Set<number>(MAJORSTUEN_METODIKA_LOCATION_IDS);
  return [...new Set(ids.filter((id) => allowed.has(id)))].sort((a, b) => a - b);
}

export type MetodikaAvailabilityLocationHint = {
  locationId?: number;
};

function locationIdsFromAvailabilityHints(
  hints: ReadonlyArray<MetodikaAvailabilityLocationHint>,
): number[] {
  const ids = new Set<number>();
  for (const hint of hints) {
    if (typeof hint.locationId === "number" && hint.locationId > 0) {
      ids.add(hint.locationId);
    }
  }
  return [...ids].sort((a, b) => a - b);
}

/** Step-2 / booking clinic row represents the merged Majorstuen campus (not only 10A). */
export function clinicTouchesMajorstuen(clinic: BookingMetodikaClinic): boolean {
  if (isMajorstuenGroupedClinic(clinic)) return true;
  if (isMajorstuenClinicLabel(clinic.label)) return true;
  return metodikaLocationIdsForClinic(clinic).some(isMajorstuenMetodikaLocationId);
}

/**
 * Which Majorstuen campus(es) apply for this service — prefer live availability slots,
 * then wbactivities matrix. Never assume 10A when slots only exist at 10B.
 */
export function majorstuenLocationIdsForService(
  activityEntry: WbActivityMatrixEntry | null | undefined,
  availabilityHints: ReadonlyArray<MetodikaAvailabilityLocationHint> = [],
): number[] {
  const fromSlots = intersectMajorstuenLocationIds(
    locationIdsFromAvailabilityHints(availabilityHints),
  );
  if (fromSlots.length > 0) return fromSlots;

  if (activityEntry) {
    return intersectMajorstuenLocationIds(locationIdsForWbActivity(activityEntry));
  }
  return [];
}

/** Metodika location ids for availability queries — matrix + optional caregiver scoped. */
export function effectiveMetodikaLocationIdsForBooking(
  clinic: BookingMetodikaClinic,
  activityEntry: WbActivityMatrixEntry | null | undefined,
  caregiverUserId?: number | null,
  availabilityHints: ReadonlyArray<MetodikaAvailabilityLocationHint> = [],
): number[] {
  let ids = metodikaLocationIdsForClinic(clinic);

  const majorstuenSlotIds = clinicTouchesMajorstuen(clinic)
    ? intersectMajorstuenLocationIds(locationIdsFromAvailabilityHints(availabilityHints))
    : [];
  const majorstuenCampusFromSlots = majorstuenSlotIds.length > 0;

  if (clinicTouchesMajorstuen(clinic)) {
    const fromService = majorstuenLocationIdsForService(activityEntry, availabilityHints);
    if (fromService.length > 0) {
      ids = fromService;
    } else if (
      !isMajorstuenGroupedClinic(clinic) &&
      metodikaLocationIdsForClinic(clinic).length === 1 &&
      isMajorstuenMetodikaLocationId(clinic.apiLocationId)
    ) {
      // Legacy Sanity row pinned to 10A — probe both campuses until service hints arrive.
      ids = [...MAJORSTUEN_METODIKA_LOCATION_IDS];
    }
  }

  if (activityEntry && !majorstuenCampusFromSlots) {
    const activityLocs = new Set(locationIdsForWbActivity(activityEntry));
    ids = ids.filter((id) => activityLocs.has(id));
  }
  if (caregiverUserId != null && caregiverUserId > 0 && activityEntry) {
    const caregiverLocs = new Set(
      locationIdsForCaregiverOnActivity(activityEntry, caregiverUserId),
    );
    ids = ids.filter((id) => caregiverLocs.has(id));
  }
  return ids;
}

export function selectedMetodikaLocationIdsFromClinic(
  clinic: BookingClinic | undefined,
  activityEntry?: WbActivityMatrixEntry | null,
  caregiverUserId?: number | null,
  availabilityHints: ReadonlyArray<MetodikaAvailabilityLocationHint> = [],
): number[] | undefined {
  if (!clinic || !isMetodikaClinic(clinic)) return undefined;
  const ids = effectiveMetodikaLocationIdsForBooking(
    clinic,
    activityEntry,
    caregiverUserId,
    availabilityHints,
  );
  return ids.length > 0 ? ids : undefined;
}

/** Location ids this service uses at a clinic (for step-2 narrowing of grouped Majorstuen). */
export function serviceMetodikaLocationIdsForClinic(
  clinic: BookingMetodikaClinic,
  activityEntry: WbActivityMatrixEntry | null | undefined,
  availabilityHints: ReadonlyArray<MetodikaAvailabilityLocationHint> = [],
): number[] {
  if (clinicTouchesMajorstuen(clinic)) {
    const majorstuen = majorstuenLocationIdsForService(activityEntry, availabilityHints);
    if (majorstuen.length > 0) return majorstuen;
  }
  if (activityEntry) {
    const fromMatrix = locationIdsForWbActivity(activityEntry);
    const clinicIds = metodikaLocationIdsForClinic(clinic);
    const overlap = clinicIds.filter((id) => fromMatrix.includes(id));
    if (overlap.length > 0) return overlap;
  }
  return metodikaLocationIdsForClinic(clinic);
}

export function majorstuenLocationIdsForActivityAndCaregiver(
  baseIds: number[],
  activityEntry: WbActivityMatrixEntry | null | undefined,
  caregiverUserId?: number | null,
): number[] {
  let ids = intersectMajorstuenLocationIds(baseIds);
  if (!activityEntry) return ids;

  const activityLocs = new Set(locationIdsForWbActivity(activityEntry));
  ids = ids.filter((id) => activityLocs.has(id));

  if (caregiverUserId != null && caregiverUserId > 0) {
    const caregiverLocs = new Set(
      locationIdsForCaregiverOnActivity(activityEntry, caregiverUserId),
    );
    ids = ids.filter((id) => caregiverLocs.has(id));
  }

  return ids;
}

export function createMajorstuenGroupedClinic(
  partials: BookingMetodikaClinic[],
  locationIds: number[],
): BookingMetodikaClinic | null {
  if (locationIds.length === 0) return null;

  const primary =
    partials.find((p) => p.apiLocationId === locationIds[0]) ?? partials[0];
  const sanityClinicId =
    partials.find((p) => p.sanityClinicId?.toLowerCase().includes("majorstuen"))
      ?.sanityClinicId ?? primary?.sanityClinicId;

  return {
    id: MAJORSTUEN_GROUP_CLINIC_ID,
    label: MAJORSTUEN_DISPLAY_LABEL,
    apiLocationId: locationIds[0],
    apiLocationIds: locationIds,
    bookingSystem: "metodika",
    ...(sanityClinicId ? { sanityClinicId } : {}),
    ...(primary?.sanityImage ? { sanityImage: primary.sanityImage } : {}),
  };
}

/** Merge separate 10A/10B Metodika rows into one “Majorstuen” picker option. */
export function groupMajorstuenMetodikaClinics(
  clinics: BookingMetodikaClinic[],
): BookingMetodikaClinic[] {
  const alreadyGrouped = clinics.some(
    (c) => c.id === MAJORSTUEN_GROUP_CLINIC_ID || (c.apiLocationIds?.length ?? 0) > 1,
  );
  if (alreadyGrouped) {
    return clinics.map((c) =>
      c.id === MAJORSTUEN_GROUP_CLINIC_ID
        ? { ...c, label: MAJORSTUEN_DISPLAY_LABEL }
        : c,
    );
  }

  const majorstuenPartials: BookingMetodikaClinic[] = [];
  const others: BookingMetodikaClinic[] = [];

  for (const clinic of clinics) {
    if (isMajorstuenMetodikaLocationId(clinic.apiLocationId)) {
      majorstuenPartials.push(clinic);
    } else {
      others.push(clinic);
    }
  }

  if (majorstuenPartials.length === 0) return clinics;

  const locationIds = intersectMajorstuenLocationIds(
    majorstuenPartials.map((c) => c.apiLocationId),
  );
  const grouped = createMajorstuenGroupedClinic(majorstuenPartials, locationIds);
  if (!grouped) return clinics;

  return [...others, grouped];
}

export function metodikaClinicsShareMajorstuenGroup(
  a: BookingMetodikaClinic,
  b: BookingMetodikaClinic,
): boolean {
  if (a.id === MAJORSTUEN_GROUP_CLINIC_ID && b.id === MAJORSTUEN_GROUP_CLINIC_ID) {
    return true;
  }
  if (a.id === MAJORSTUEN_GROUP_CLINIC_ID) {
    return metodikaLocationIdsForClinic(b).some(isMajorstuenMetodikaLocationId);
  }
  if (b.id === MAJORSTUEN_GROUP_CLINIC_ID) {
    return metodikaLocationIdsForClinic(a).some(isMajorstuenMetodikaLocationId);
  }
  return false;
}

export type MajorstuenDisplayTag = {
  tagKey: string;
  id: string;
  slug: string;
  label: string;
  sortOrder: number;
  image?: string;
  bookingMappingOk?: boolean;
};

/** Collapse step-1 “Majorstuen 10A / 10B” badges into one “Majorstuen” chip. */
export function mergeMajorstuenStep1DisplayTags<T extends MajorstuenDisplayTag>(
  tags: T[],
): T[] {
  const majorstuenIndexes: number[] = [];
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    const key = tag.tagKey?.toLowerCase() ?? "";
    if (
      MAJORSTUEN_BADGE_KEYS.has(key) ||
      isMajorstuenClinicLabel(tag.label) ||
      tag.slug?.includes("majorstuen") ||
      tag.id?.includes("majorstuen")
    ) {
      majorstuenIndexes.push(i);
    }
  }

  if (majorstuenIndexes.length <= 1) {
    return tags.map((tag) =>
      majorstuenIndexes.length === 1 && majorstuenIndexes[0] === tags.indexOf(tag)
        ? { ...tag, label: MAJORSTUEN_DISPLAY_LABEL }
        : tag,
    );
  }

  const merged = majorstuenIndexes
    .map((i) => tags[i])
    .reduce((best, tag) => (tag.sortOrder < best.sortOrder ? tag : best));

  const result: T[] = [];
  let mergedInserted = false;
  for (let i = 0; i < tags.length; i++) {
    if (majorstuenIndexes.includes(i)) {
      if (!mergedInserted) {
        result.push({
          ...merged,
          tagKey: "majorstuen",
          id: merged.id?.includes("majorstuen") ? merged.id : "majorstuen",
          slug: merged.slug?.includes("majorstuen") ? merged.slug : "majorstuen",
          label: MAJORSTUEN_DISPLAY_LABEL,
        });
        mergedInserted = true;
      }
      continue;
    }
    result.push(tags[i]);
  }
  return result;
}
