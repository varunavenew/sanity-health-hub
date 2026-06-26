import type {
  BookingExternalClinic,
  BookingPasientskyClinic,
} from "@/lib/booking/mapApiLocation";
import type { CategoryClinicTag } from "@/lib/booking/mapApiLocation";
import type { SanityClinicListRow } from "@/hooks/useSanity";
import {
  bookingIdToCategoryPage,
  categoryPageToBookingId,
} from "@/lib/bookingLinks";

export type SanityManagedBookingClinic = BookingPasientskyClinic | BookingExternalClinic;

/** Clinic tag for booking step 1 category rows (Metodika + Sanity-managed). */
export type CategoryClinicDisplayTag = {
  tagKey: string;
  name: string;
};

function normalizeClinicLabelForCompare(label: string): string {
  return label
    .toLowerCase()
    .replace(/^cmedical\s+/i, "")
    .replace(/^oslo\s+/i, "")
    .trim();
}

/** Merge Metodika location tags with Sanity-managed clinics (e.g. Moss, Moelv). */
export function mergeCategoryClinicDisplayTags(
  apiTags: CategoryClinicTag[],
  sanityClinics: SanityManagedBookingClinic[],
): CategoryClinicDisplayTag[] {
  const apiNames = new Set(apiTags.map((t) => normalizeClinicLabelForCompare(t.name)));
  const merged: CategoryClinicDisplayTag[] = apiTags.map((t) => ({
    tagKey: `loc-${t.locationId}`,
    name: t.name,
  }));

  for (const clinic of sanityClinics) {
    const normalized = normalizeClinicLabelForCompare(clinic.label);
    const duplicate = [...apiNames].some(
      (apiName) => apiName.includes(normalized) || normalized.includes(apiName),
    );
    if (!duplicate) {
      merged.push({ tagKey: `sanity-${clinic.id}`, name: clinic.label });
    }
  }

  return merged.sort((a, b) => a.name.localeCompare(b.name, "nb"));
}

/** All ids that may identify a booking category in clinic.services or activity-groups. */
export function resolveBookingCategoryKeys(
  categoryId?: string,
  categoryApiSlug?: string,
): string[] {
  const keys = new Set<string>();
  for (const raw of [categoryId, categoryApiSlug]) {
    if (!raw?.trim()) continue;
    const key = raw.trim().toLowerCase();
    keys.add(key);
    const pageId = bookingIdToCategoryPage[key];
    if (pageId) {
      keys.add(pageId);
      const bookingId = categoryPageToBookingId[pageId];
      if (bookingId) keys.add(bookingId);
    }
    const bookingFromPage = categoryPageToBookingId[key];
    if (bookingFromPage) keys.add(bookingFromPage);
  }
  return [...keys];
}

function clinicOffersBookingCategory(
  clinicServices: string[] | undefined,
  categoryKeys: string[],
): boolean {
  if (!categoryKeys.length) return true;
  if (!clinicServices?.length) return false;
  const offered = new Set(clinicServices.map((s) => s.trim().toLowerCase()).filter(Boolean));
  return categoryKeys.some((key) => offered.has(key.toLowerCase()));
}

export function sanityManagedClinicFromSanity(
  clinic: SanityClinicListRow,
): SanityManagedBookingClinic | null {
  const booking = clinic.booking;
  if (!booking) return null;

  const serviceProviderId = booking.serviceProviderId?.trim();
  if (booking.method === "pasientsky" && serviceProviderId) {
    return {
      id: clinic.id,
      label: clinic.label,
      bookingSystem: "pasientsky",
      serviceProviderId,
    };
  }

  const externalBookingUrl = booking.externalBookingUrl?.trim();
  if (booking.method === "info" && externalBookingUrl) {
    return {
      id: clinic.id,
      label: clinic.label,
      bookingSystem: "external",
      externalBookingUrl,
    };
  }

  return null;
}

/**
 * Sanity clinics for step 2 when Metodika has no location (e.g. Moelv / Pasientsky, Moss / external).
 * Metodika-only clinics (method metodika or info without external URL) are excluded — those come from the API.
 */
export function sanityManagedClinicsForCategory(
  clinics: SanityClinicListRow[],
  categoryId?: string,
  categoryApiSlug?: string,
): SanityManagedBookingClinic[] {
  const categoryKeys = resolveBookingCategoryKeys(categoryId, categoryApiSlug);

  return clinics
    .map((clinic) => {
      const managed = sanityManagedClinicFromSanity(clinic);
      if (!managed) return null;
      if (!clinicOffersBookingCategory(clinic.services, categoryKeys)) return null;
      return managed;
    })
    .filter((clinic): clinic is SanityManagedBookingClinic => clinic != null);
}

export function findSanityManagedClinicBySlug(
  clinics: SanityClinicListRow[],
  slugOrId: string,
): SanityManagedBookingClinic | null {
  const normalized = slugOrId.trim().toLowerCase();
  const row = clinics.find(
    (clinic) =>
      clinic.id.toLowerCase() === normalized || clinic.slug.toLowerCase() === normalized,
  );
  return row ? sanityManagedClinicFromSanity(row) : null;
}

/** Drop Sanity clinics already represented in Metodika locations (by name). */
export function mergeMetodikaAndSanityClinics<T extends { label: string }>(
  metodika: T[],
  sanity: SanityManagedBookingClinic[],
): Array<T | SanityManagedBookingClinic> {
  const normalizeLabel = (label: string) =>
    label
      .toLowerCase()
      .replace(/^cmedical\s+/i, "")
      .replace(/^oslo\s+/i, "")
      .trim();

  const metodikaNames = new Set(metodika.map((c) => normalizeLabel(c.label)));

  const extraSanity = sanity.filter((clinic) => {
    const name = normalizeLabel(clinic.label);
    return ![...metodikaNames].some(
      (apiName) => apiName.includes(name) || name.includes(apiName),
    );
  });

  return [...metodika, ...extraSanity];
}
