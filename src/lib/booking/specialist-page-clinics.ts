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
  apiLocationId: number;
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
  return pageClinics.find((clinic): clinic is SpecialistPagePasientskyClinic => {
    if (clinic.kind !== "pasientsky") return false;
    const slug = clinic.slug.toLowerCase();
    const label = normalizeClinicLabelForCompare(clinic.label);
    return slug.includes("moelv") || label.includes("moelv");
  });
}

/** Inline profile booking band uses Metodika / phone only — not PatientSky Moelv. */
export function pageClinicsForInlineProfileBooking(
  pageClinics: SpecialistPageClinic[],
): SpecialistPageClinic[] {
  return pageClinics.filter((clinic) => clinic.kind !== "pasientsky");
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
const SLUG_METODIKA_LOCATION_FALLBACK: Readonly<Record<string, number>> = {
  majorstuen: 1,
  majorstua: 1,
  bekkestua: 2,
};

function resolvePageClinicKind(
  row: SanityClinicListRow,
  slug: string,
): SpecialistPageClinic["kind"] | null {
  const method = row.booking?.method;
  if (method === "pasientsky" || method === "metodika") return method;

  const fromSlug = inferKindFromSlug(slug);
  if (fromSlug) return fromSlug;

  // CMS "info" or unset — default to phone when slug heuristics do not apply.
  if (method === "info" || !method) return "phone";

  return null;
}

function resolveMetodikaLocationId(
  row: SanityClinicListRow,
  slug: string,
): number | undefined {
  const fromCms = row.booking?.metodikaLocationId;
  if (typeof fromCms === "number" && Number.isFinite(fromCms) && fromCms > 0) {
    return fromCms;
  }
  for (const [key, id] of Object.entries(SLUG_METODIKA_LOCATION_FALLBACK)) {
    if (slug.includes(key)) return id;
  }
  return undefined;
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
    const apiLocationId = resolveMetodikaLocationId(row, slug);
    if (typeof apiLocationId === "number" && Number.isFinite(apiLocationId)) {
      return { ...base, kind: "metodika", apiLocationId };
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
