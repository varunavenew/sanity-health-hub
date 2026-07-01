import type {
  BookingExternalClinic,
  BookingMetodikaClinic,
  BookingPasientskyClinic,
} from "@/lib/booking/mapApiLocation";
import type { SanityClinicListRow } from "@/hooks/useSanity";
import {
  bookingIdToCategoryPage,
  categoryPageToBookingId,
} from "@/lib/bookingLinks";

export type SanityManagedBookingClinic = BookingPasientskyClinic | BookingExternalClinic;

/** Step 1 clinic badge — sourced exclusively from Sanity CMS. */
export type CategoryClinicDisplayTag = {
  tagKey: string;
  id: string;
  slug: string;
  label: string;
  image?: string;
  sortOrder: number;
  bookingMappingOk: boolean;
};

export type SanityClinicMappingIssue = {
  clinicId: string;
  clinicLabel: string;
  reason: string;
};

export type SanityMetodikaMappingAudit = {
  sanityIssues: SanityClinicMappingIssue[];
  unmatchedMetodika: { apiLocationId: number; label: string }[];
  unmatchedSanityMetodika: SanityClinicListRow[];
};

function isVisibleOnBookingStep1(clinic: SanityClinicListRow): boolean {
  if (clinic.booking?.method === "closed") return false;
  return Boolean(clinic.services?.length);
}

function toDisplayTag(
  clinic: SanityClinicListRow,
  bookingMappingOk: boolean,
): CategoryClinicDisplayTag {
  return {
    tagKey: clinic.id,
    id: clinic.id,
    slug: clinic.slug,
    label: clinic.label,
    image: clinic.primaryImage,
    sortOrder: clinic.sortOrder ?? 9999,
    bookingMappingOk,
  };
}

/** Validate booking config for a Sanity clinic (warn-only for step 1 display). */
export function validateSanityClinicBookingConfig(
  clinic: SanityClinicListRow,
): { ok: true } | { ok: false; reason: string } {
  const booking = clinic.booking;
  if (!booking?.method) {
    return { ok: false, reason: "missing booking.method" };
  }
  if (booking.method === "closed") {
    return { ok: false, reason: "clinic closed for booking" };
  }
  if (booking.method === "pasientsky" && !booking.serviceProviderId?.trim()) {
    return { ok: false, reason: "pasientsky missing serviceProviderId" };
  }
  if (booking.method === "metodika") {
    const id = booking.metodikaLocationId;
    if (typeof id !== "number" || !Number.isFinite(id) || id <= 0) {
      return {
        ok: false,
        reason: "metodika missing metodikaLocationId (step 2 will use label match fallback)",
      };
    }
  }
  if (booking.method === "info") {
    if (!booking.externalBookingUrl?.trim()) {
      return { ok: false, reason: "external booking missing externalBookingUrl" };
    }
  }
  return { ok: true };
}

function warnSanityClinicMapping(clinic: SanityClinicListRow, reason: string) {
  if (typeof console !== "undefined") {
    console.warn(
      `[booking/sanity] Clinic "${clinic.label}" (${clinic.id}): ${reason}`,
    );
  }
}

/** Step 1 badges for one category — Sanity only, preserves Studio sortOrder. */
export function sanityClinicDisplayTagsForCategory(
  clinics: SanityClinicListRow[],
  categoryId?: string,
  categoryApiSlug?: string,
): CategoryClinicDisplayTag[] {
  const categoryKeys = resolveBookingCategoryKeys(categoryId, categoryApiSlug);
  const tags: CategoryClinicDisplayTag[] = [];

  for (const clinic of clinics) {
    if (!isVisibleOnBookingStep1(clinic)) continue;
    if (!clinicOffersBookingCategory(clinic.services, categoryKeys)) continue;

    const validation = validateSanityClinicBookingConfig(clinic);
    if (validation.ok === false) {
      warnSanityClinicMapping(clinic, validation.reason);
    }

    tags.push(toDisplayTag(clinic, validation.ok));
  }

  return tags;
}

/** All Sanity clinics eligible for step 1 badges (for «Alle klinikker» comparison). */
export function sanityAllClinicDisplayTags(
  clinics: SanityClinicListRow[],
): CategoryClinicDisplayTag[] {
  const tags: CategoryClinicDisplayTag[] = [];

  for (const clinic of clinics) {
    if (!isVisibleOnBookingStep1(clinic)) continue;
    const validation = validateSanityClinicBookingConfig(clinic);
    tags.push(toDisplayTag(clinic, validation.ok));
  }

  return tags;
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

export function normalizeClinicLabelForCompare(label: string): string {
  return label
    .toLowerCase()
    .replace(/^cmedical\s+/i, "")
    .replace(/^oslo\s+/i, "")
    .trim();
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

export function findSanityClinicBySlugOrId(
  clinics: SanityClinicListRow[],
  slugOrId: string,
): SanityClinicListRow | undefined {
  const normalized = slugOrId.trim().toLowerCase();
  return clinics.find(
    (clinic) =>
      clinic.id.toLowerCase() === normalized || clinic.slug.toLowerCase() === normalized,
  );
}

export function findSanityManagedClinicBySlug(
  clinics: SanityClinicListRow[],
  slugOrId: string,
): SanityManagedBookingClinic | null {
  const row = findSanityClinicBySlugOrId(clinics, slugOrId);
  return row ? sanityManagedClinicFromSanity(row) : null;
}

/** Match a Metodika location to its Sanity clinic row (ID first, then label). */
export function findSanityClinicForMetodikaLocation(
  clinics: SanityClinicListRow[],
  apiLocationId: number,
  apiLabel?: string,
): SanityClinicListRow | undefined {
  const byLocationId = clinics.find(
    (clinic) => clinic.booking?.metodikaLocationId === apiLocationId,
  );
  if (byLocationId) return byLocationId;

  if (!apiLabel?.trim()) return undefined;
  const normalizedApi = normalizeClinicLabelForCompare(apiLabel);

  return clinics.find((clinic) => {
    if (clinic.booking?.method !== "metodika") return false;
    const normalized = normalizeClinicLabelForCompare(clinic.label);
    return (
      normalized === normalizedApi ||
      normalized.includes(normalizedApi) ||
      normalizedApi.includes(normalized)
    );
  });
}

/** Apply Sanity display fields to a Metodika clinic option (step 2). */
export function enrichMetodikaClinicWithSanity(
  metodika: BookingMetodikaClinic,
  sanity?: SanityClinicListRow,
): BookingMetodikaClinic {
  if (!sanity) return metodika;
  return {
    ...metodika,
    label: sanity.label,
    sanityClinicId: sanity.id,
    sanityImage: sanity.primaryImage,
  };
}

/** Compare Sanity metodika clinics with live Metodika locations (dev diagnostics). */
export function auditSanityMetodikaClinicMappings(
  sanityClinics: SanityClinicListRow[],
  metodikaClinics: BookingMetodikaClinic[],
): SanityMetodikaMappingAudit {
  const sanityIssues: SanityClinicMappingIssue[] = [];
  const unmatchedSanityMetodika: SanityClinicListRow[] = [];
  const matchedMetodikaIds = new Set<number>();

  for (const clinic of sanityClinics) {
    if (clinic.booking?.method !== "metodika") continue;
    const validation = validateSanityClinicBookingConfig(clinic);
    if (validation.ok === false) {
      sanityIssues.push({
        clinicId: clinic.id,
        clinicLabel: clinic.label,
        reason: validation.reason,
      });
    }

    const locationId = clinic.booking?.metodikaLocationId;
    let match: BookingMetodikaClinic | undefined;
    if (typeof locationId === "number") {
      match = metodikaClinics.find((m) => m.apiLocationId === locationId);
    } else {
      const normalizedSanity = normalizeClinicLabelForCompare(clinic.label);
      match = metodikaClinics.find((m) => {
        const normalizedApi = normalizeClinicLabelForCompare(m.label);
        return (
          normalizedSanity === normalizedApi ||
          normalizedSanity.includes(normalizedApi) ||
          normalizedApi.includes(normalizedSanity)
        );
      });
    }

    if (match) {
      matchedMetodikaIds.add(match.apiLocationId);
    } else if (isVisibleOnBookingStep1(clinic)) {
      unmatchedSanityMetodika.push(clinic);
    }
  }

  const unmatchedMetodika = metodikaClinics
    .filter((m) => !matchedMetodikaIds.has(m.apiLocationId))
    .map((m) => ({ apiLocationId: m.apiLocationId, label: m.label }));

  return { sanityIssues, unmatchedMetodika, unmatchedSanityMetodika };
}

export function logSanityMetodikaMappingAudit(audit: SanityMetodikaMappingAudit) {
  if (typeof console === "undefined") return;
  if (
    audit.sanityIssues.length === 0 &&
    audit.unmatchedMetodika.length === 0 &&
    audit.unmatchedSanityMetodika.length === 0
  ) {
    return;
  }

  console.group("[booking/sanity] Clinic mapping audit");
  for (const issue of audit.sanityIssues) {
    console.warn(`Sanity config: ${issue.clinicLabel} (${issue.clinicId}) — ${issue.reason}`);
  }
  for (const clinic of audit.unmatchedSanityMetodika) {
    console.warn(
      `Sanity clinic not found in Metodika for current service: ${clinic.label} (${clinic.id})`,
    );
  }
  for (const loc of audit.unmatchedMetodika) {
    console.warn(
      `Metodika location not mapped in Sanity: ${loc.label} (location-id ${loc.apiLocationId})`,
    );
  }
  console.groupEnd();
}

/** Drop Sanity clinics already represented in Metodika locations (by name). */
export function mergeMetodikaAndSanityClinics<T extends { label: string }>(
  metodika: T[],
  sanity: SanityManagedBookingClinic[],
): Array<T | SanityManagedBookingClinic> {
  const normalizeLabel = (label: string) => normalizeClinicLabelForCompare(label);

  const metodikaNames = new Set(metodika.map((c) => normalizeLabel(c.label)));

  const extraSanity = sanity.filter((clinic) => {
    const name = normalizeLabel(clinic.label);
    return ![...metodikaNames].some(
      (apiName) => apiName.includes(name) || name.includes(apiName),
    );
  });

  return [...metodika, ...extraSanity];
}
