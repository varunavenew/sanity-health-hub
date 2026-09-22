/**
 * Scope helpers for Sanity ↔ Metodika specialist checks.
 *
 * Only clinics with booking.method === "metodika" (Majorstuen, Bekkestua)
 * should be compared. Moss (info/phone) and Moelv (pasientsky) never use
 * Metodika — specialists only at those clinics must be skipped.
 */

export type ClinicBookingMethod =
  | "info"
  | "pasientsky"
  | "metodika"
  | "closed"
  | string;

export type SpecialistClinicBooking = {
  label?: string;
  slug?: string;
  method?: ClinicBookingMethod;
};

/** Map Sanity booking.method to the wording used in daily-check logs. */
export function bookingMethodLogLabel(method: ClinicBookingMethod | undefined): string {
  if (method === "info") return "phone";
  if (method === "pasientsky") return "pasientsky";
  if (method === "metodika") return "metodika";
  if (method === "closed") return "closed";
  if (!method) return "unknown";
  return method;
}

export type MetodikaCheckScope =
  | { compare: true; metodikaClinics: SpecialistClinicBooking[] }
  | {
      compare: false;
      skipReason: string;
      clinics: SpecialistClinicBooking[];
    };

/**
 * A specialist is in scope iff at least one linked clinic uses Metodika.
 * Multi-clinic people (e.g. Moelv + Majorstuen) stay in scope.
 */
export function resolveMetodikaCheckScope(
  clinics: SpecialistClinicBooking[] | undefined | null,
): MetodikaCheckScope {
  const list = Array.isArray(clinics) ? clinics.filter(Boolean) : [];
  const metodikaClinics = list.filter((c) => c.method === "metodika");
  if (metodikaClinics.length > 0) {
    return { compare: true, metodikaClinics };
  }

  const labels = [
    ...new Set(
      list
        .map((c) => bookingMethodLogLabel(c.method))
        .filter((label) => label !== "metodika"),
    ),
  ];
  const methodPart =
    labels.length > 0 ? labels.join("/") : "unknown";
  return {
    compare: false,
    skipReason: `skipped: clinic uses ${methodPart}`,
    clinics: list,
  };
}
