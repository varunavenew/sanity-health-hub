import { describe, expect, it } from "vitest";
import {
  MAJORSTUEN_GROUP_CLINIC_ID,
  effectiveMetodikaLocationIdsForBooking,
  majorstuenLocationIdsForService,
  type MetodikaAvailabilityLocationHint,
} from "@/lib/booking/majorstuen-location-group";
import type { BookingMetodikaClinic } from "@/lib/booking/mapApiLocation";

const majorstuenSanity10A: BookingMetodikaClinic = {
  id: "location-1",
  label: "Majorstuen",
  apiLocationId: 1,
  bookingSystem: "metodika",
};

const majorstuenGrouped: BookingMetodikaClinic = {
  id: MAJORSTUEN_GROUP_CLINIC_ID,
  label: "Majorstuen",
  apiLocationId: 1,
  apiLocationIds: [1, 2],
  bookingSystem: "metodika",
};

function slotsAt(...locationIds: number[]): MetodikaAvailabilityLocationHint[] {
  return locationIds.map((locationId) => ({ locationId }));
}

describe("majorstuenLocationIdsForService", () => {
  it("prefers availability slots over assuming 10A", () => {
    expect(majorstuenLocationIdsForService(null, slotsAt(2))).toEqual([2]);
  });

  it("returns both campuses when slots exist at 10A and 10B", () => {
    expect(majorstuenLocationIdsForService(null, slotsAt(1, 2))).toEqual([1, 2]);
  });
});

describe("effectiveMetodikaLocationIdsForBooking", () => {
  it("uses 10B for eggfrys-style services when only location 2 has slots", () => {
    expect(
      effectiveMetodikaLocationIdsForBooking(
        majorstuenSanity10A,
        null,
        null,
        slotsAt(2),
      ),
    ).toEqual([2]);
  });

  it("keeps 10A-only services on location 1", () => {
    expect(
      effectiveMetodikaLocationIdsForBooking(
        majorstuenGrouped,
        null,
        null,
        slotsAt(1),
      ),
    ).toEqual([1]);
  });

  it("queries both campuses before availability hints load", () => {
    expect(
      effectiveMetodikaLocationIdsForBooking(majorstuenSanity10A, null, null, []),
    ).toEqual([1, 2]);
  });
});
