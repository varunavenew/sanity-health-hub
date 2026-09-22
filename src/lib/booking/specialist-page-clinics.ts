import { specialistClinicConstraintKeys } from "@/lib/booking/filterClinicsForSpecialist";
import { normalizeClinicLabelForCompare } from "@/lib/booking/sanityBookingClinic";
import { slugifyNo } from "@/lib/bookingLinks";
import { pasientskyCalendarIdForSpecialist } from "@/lib/booking/pasientskySpecialist";
import type { SanityClinicListRow } from "@/lib/sanity/clinic-list-row";
import type { Specialist } from "@/lib/sanity/specialist-types";

export const SPECIALIST_PAGE_FALLBACK_PHONE = "22 60 00 50";

type SpecialistPageClinicBase = {
  id: string;
  slug: string;
  label: string;
  phone?: string;
  hours?: string;
  address?: string;
};

export type SpecialistPageMetodikaClinic = SpecialistPageClinicBase & {
  kind: "metodika";
  /** Primary Metodika location (CMS or first campus id). */
  apiLocationId: number;
  /** Majorstuen is 10A + 10B in Metodika — probe every campus location. */
  apiLocationIds: number[];
};

export type SpecialistPagePasientskyClinic = SpecialistPageClinicBase & {
  kind: "pasientsky";
  serviceProviderId: string;
};

export type SpecialistPagePhoneClinic = SpecialistPageClinicBase & {
  kind: "phone";
  phone: string;
};

export type SpecialistPageClinic =
  | SpecialistPageMetodikaClinic
  | SpecialistPagePasientskyClinic
  | SpecialistPagePhoneClinic;

/** Moelv PatientSky branch — book via /booking iframe, not inline Metodika picker. */
export function moelvPasientskyClinicFromPageClinics(
  pageClinics: SpecialistPageClinic[],
): SpecialistPagePasientskyClinic | undefined {
  return pageClinics.find((clinic): clinic is SpecialistPagePasientskyClinic =>
    isMoelvPasientskyPageClinic(clinic),
  );
}

/** PatientSky Moelv only — other locations must use Metodika/phone branches. */
export function isMoelvPasientskyPageClinic(
  clinic: SpecialistPageClinic,
): clinic is SpecialistPagePasientskyClinic {
  if (clinic.kind !== "pasientsky") return false;
  const slug = clinic.slug.toLowerCase();
  const label = normalizeClinicLabelForCompare(clinic.label);
  return slug.includes("moelv") || label.includes("moelv");
}

/** Inline profile booking band uses Metodika / phone only — not PatientSky Moelv. */
export function pageClinicsForInlineProfileBooking(
  pageClinics: SpecialistPageClinic[],
): SpecialistPageClinic[] {
  return pageClinics.filter((clinic) => clinic.kind !== "pasientsky");
}

/** After freetime probe — whether this clinic row should appear in the profile picker. */
export function specialistPageClinicHasBookableOnlineSlots(
  clinic: SpecialistPageClinic,
  input: {
    availabilityLoading: boolean;
    metodikaBookableByLocation: Map<number, Set<number>>;
    hasPasientskySlots: boolean;
  },
): boolean {
  if (input.availabilityLoading) return true;
  if (clinic.kind === "phone") return true;
  if (clinic.kind === "metodika") {
    return bookableActivityIdsForMetodikaClinic(
      clinic,
      input.metodikaBookableByLocation,
    ).size > 0;
  }
  if (clinic.kind === "pasientsky") {
    return input.hasPasientskySlots;
  }
  return false;
}

/** Metodika room ids for this profile clinic row (CMS + campus fallbacks). */
export function metodikaClinicLocationIds(
  clinic: SpecialistPageMetodikaClinic,
): number[] {
  const ids =
    clinic.apiLocationIds.length > 0
      ? clinic.apiLocationIds
      : [clinic.apiLocationId];
  return [...new Set(ids.filter((id) => Number.isFinite(id) && id > 0))];
}

/**
 * Metodika location to use in /booking for this activity — prefers CMS primary
 * `apiLocationId`, then other campus ids (e.g. Majorstuen 10B).
 */
export function resolveMetodikaLocationIdForActivity(
  clinic: SpecialistPageMetodikaClinic,
  metodikaBookableByLocation: Map<number, Set<number>>,
  wbactivityId: number,
): number | undefined {
  if (metodikaBookableByLocation.get(clinic.apiLocationId)?.has(wbactivityId)) {
    return clinic.apiLocationId;
  }
  for (const locationId of metodikaClinicLocationIds(clinic)) {
    if (locationId === clinic.apiLocationId) continue;
    if (metodikaBookableByLocation.get(locationId)?.has(wbactivityId)) {
      return locationId;
    }
  }
  return undefined;
}

/** Treatments with freetime at any Metodika room for this clinic campus. */
export function bookableActivityIdsForMetodikaClinic(
  clinic: SpecialistPageMetodikaClinic,
  metodikaBookableByLocation: Map<number, Set<number>>,
): Set<number> {
  const ids = new Set<number>();
  for (const locationId of metodikaClinicLocationIds(clinic)) {
    const atLocation = metodikaBookableByLocation.get(locationId);
    if (!atLocation) continue;
    for (const wbactivityId of atLocation) ids.add(wbactivityId);
  }
  return ids;
}

export function metodikaPageClinicHasBookableSlots(
  clinic: SpecialistPageMetodikaClinic,
  metodikaBookableByLocation: Map<number, Set<number>>,
): boolean {
  return bookableActivityIdsForMetodikaClinic(clinic, metodikaBookableByLocation).size > 0;
}

function normalizeClinicKey(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const slug = slugifyNo(trimmed);
  if (slug) return slug;
  return normalizeClinicLabelForCompare(trimmed);
}

function clinicRowKeys(row: SanityClinicListRow): string[] {
  return [row.id, row.slug, row.label].map(normalizeClinicKey).filter(Boolean);
}

function clinicRowMatchesKeys(row: SanityClinicListRow, keys: string[]): boolean {
  if (keys.length === 0) return false;
  const candidates = clinicRowKeys(row);
  for (const key of keys) {
    for (const candidate of candidates) {
      if (
        candidate === key ||
        candidate.includes(key) ||
        key.includes(candidate)
      ) {
        return true;
      }
    }
  }
  return false;
}

function clinicSlug(row: SanityClinicListRow): string {
  return slugifyNo(row.slug || row.id || row.label);
}

function inferKindFromSlug(
  slug: string,
): SpecialistPageClinic["kind"] | null {
  if (slug.includes("moelv")) return "pasientsky";
  if (slug.includes("moss")) return "phone";
  if (
    slug.includes("majorstuen") ||
    slug.includes("majorstua") ||
    slug.includes("bekkestua")
  ) {
    return "metodika";
  }
  return null;
}

/** Known Metodika location ids when CMS still has method "info" (developer dataset). */
const SLUG_METODIKA_LOCATION_FALLBACK: Readonly<Record<string, number[]>> = {
  majorstuen: [1, 2],
  majorstua: [1, 2],
};

function resolvePageClinicKind(
  row: SanityClinicListRow,
  slug: string,
): SpecialistPageClinic["kind"] | null {
  const slugLower = slug.toLowerCase();
  if (
    slugLower.includes("majorstuen") ||
    slugLower.includes("majorstua") ||
    slugLower.includes("bekkestua")
  ) {
    return "metodika";
  }

  const method = row.booking?.method;
  if (method === "pasientsky" || method === "metodika") return method;

  const fromSlug = inferKindFromSlug(slug);
  if (fromSlug) return fromSlug;

  // CMS "info" or unset — default to phone when slug heuristics do not apply.
  if (method === "info" || !method) return "phone";

  return null;
}

function resolveMetodikaLocationIds(
  row: SanityClinicListRow,
  slug: string,
): number[] {
  const ids = new Set<number>();
  const fromCms = row.booking?.metodikaLocationId;
  if (typeof fromCms === "number" && Number.isFinite(fromCms) && fromCms > 0) {
    ids.add(fromCms);
  }
  for (const [key, fallbackIds] of Object.entries(SLUG_METODIKA_LOCATION_FALLBACK)) {
    if (slug.includes(key)) {
      for (const id of fallbackIds) ids.add(id);
    }
  }
  return [...ids].sort((a, b) => a - b);
}

function clinicSortRank(slug: string): number {
  const order = ["majorstuen", "majorstua", "bekkestua", "moss", "moelv"];
  const index = order.findIndex((key) => slug.includes(key));
  return index === -1 ? 50 : index;
}

function toPageClinic(row: SanityClinicListRow): SpecialistPageClinic | null {
  if (row.booking?.method === "closed") return null;

  const slug = clinicSlug(row);
  const base: SpecialistPageClinicBase = {
    id: row.id || slug,
    slug,
    label: row.label,
    phone: row.phone?.trim() || undefined,
    hours: row.hours?.trim() || undefined,
    address: row.address?.trim() || undefined,
  };

  const inferred = resolvePageClinicKind(row, slug);
  if (!inferred) return null;

  if (inferred === "pasientsky") {
    const serviceProviderId = row.booking?.serviceProviderId?.trim();
    if (!serviceProviderId) return null;
    return { ...base, kind: "pasientsky", serviceProviderId };
  }

  if (inferred === "phone") {
    const phone = base.phone || SPECIALIST_PAGE_FALLBACK_PHONE;
    return { ...base, kind: "phone", phone };
  }

  if (inferred === "metodika") {
    const apiLocationIds = resolveMetodikaLocationIds(row, slug);
    if (apiLocationIds.length > 0) {
      return {
        ...base,
        kind: "metodika",
        apiLocationId: apiLocationIds[0],
        apiLocationIds,
      };
    }
    const phone = base.phone || SPECIALIST_PAGE_FALLBACK_PHONE;
    return { ...base, kind: "phone", phone };
  }

  return null;
}

function moelvFallbackRow(
  clinics: SanityClinicListRow[],
): SanityClinicListRow | undefined {
  return clinics.find((row) => {
    if (row.booking?.method === "closed") return false;
    const slug = clinicSlug(row);
    return slug.includes("moelv") || row.booking?.method === "pasientsky";
  });
}

/**
 * Clinics this specialist works at, mapped to the in-page booking branch:
 * Metodika availability, Moss phone-only, or Moelv Pasientsky iframe.
 */
export function resolveSpecialistPageClinics(
  specialist: Specialist,
  clinics: SanityClinicListRow[],
): SpecialistPageClinic[] {
  const keys = specialistClinicConstraintKeys(specialist);
  let matched = keys.length
    ? clinics.filter((row) => clinicRowMatchesKeys(row, keys))
    : [];

  if (matched.length === 0 && pasientskyCalendarIdForSpecialist(specialist)) {
    const moelv = moelvFallbackRow(clinics);
    if (moelv) matched = [moelv];
  }

  const mapped = matched
    .map(toPageClinic)
    .filter((clinic): clinic is SpecialistPageClinic => clinic != null);

  const seen = new Set<string>();
  return mapped
    .filter((clinic) => {
      const key = clinic.slug || clinic.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => clinicSortRank(a.slug) - clinicSortRank(b.slug));
}
