import {
  type BookingClinic,
  isMetodikaClinic,
} from "@/lib/booking/mapApiLocation";
import {
  MAJORSTUEN_GROUP_CLINIC_ID,
  clinicCoversMetodikaLocation,
  metodikaLocationIdsForClinic,
} from "@/lib/booking/majorstuen-location-group";
import type { SanityClinicListRow } from "@/lib/sanity/clinic-list-row";

/** True when the booked service is a digital/video appointment (hide clinic address). */
export function isDigitalBookingService(serviceName: string | undefined): boolean {
  const name = serviceName?.trim() ?? "";
  if (!name) return false;
  return /\bdigital\b/i.test(name) || /\bdigitaltime\b/i.test(name);
}

/** Phone / telehealth-style Metodika services (no physical clinic choice). */
export function isPhoneBookingService(serviceName: string | undefined): boolean {
  const name = serviceName?.trim() ?? "";
  if (!name) return false;
  return /\btelefon/i.test(name);
}

/**
 * BT-11b: phone/digital (and gratis uforpliktende) skip step 2 — auto-pick default Metodika location.
 * Physical in-clinic services keep the clinic picker.
 */
export function shouldSkipBookingClinicSelectionStep(params: {
  serviceName?: string;
  servicePrice?: string;
}): boolean {
  const name = params.serviceName?.trim() ?? "";
  if (isDigitalBookingService(name) || isPhoneBookingService(name)) return true;
  if (
    isFreeBookingServicePrice(params.servicePrice) &&
    /\buforpliktende\b/i.test(name)
  ) {
    return true;
  }
  return false;
}

/**
 * When step 2 is skipped, book against one Metodika location (avoid 10A/10B picker).
 * Prefers Sanity metodikaLocationId (lowest sortOrder), then Majorstuen 10A, then lowest id.
 */
export function pickDefaultBookingClinicForRemoteService(
  clinics: BookingClinic[],
  sanityClinics: SanityClinicListRow[],
): BookingClinic | undefined {
  if (clinics.length === 0) return undefined;
  if (clinics.length === 1) return clinics[0];

  const metodika = clinics.filter(isMetodikaClinic);
  const pool = metodika.length > 0 ? metodika : clinics;

  const sanityMetodika = sanityClinics
    .filter(
      (row) =>
        row.booking?.method === "metodika" &&
        typeof row.booking.metodikaLocationId === "number",
    )
    .sort((a, b) => (a.sortOrder ?? 9999) - (b.sortOrder ?? 9999));

  const groupedMajorstuen = pool.find(
    (clinic) => isMetodikaClinic(clinic) && clinic.id === MAJORSTUEN_GROUP_CLINIC_ID,
  );
  if (groupedMajorstuen) return groupedMajorstuen;

  for (const row of sanityMetodika) {
    const locationId = row.booking!.metodikaLocationId!;
    const match = pool.find(
      (clinic) =>
        isMetodikaClinic(clinic) && clinicCoversMetodikaLocation(clinic, locationId),
    );
    if (match) return match;
  }

  const majorstuenTenA = pool.find(
    (clinic) =>
      isMetodikaClinic(clinic) &&
      metodikaLocationIdsForClinic(clinic).some((id) => id === 1),
  );
  if (majorstuenTenA) return majorstuenTenA;

  const sorted = [...pool].sort((a, b) => {
    if (isMetodikaClinic(a) && isMetodikaClinic(b)) {
      return a.apiLocationId - b.apiLocationId;
    }
    return a.label.localeCompare(b.label, "nb");
  });
  return sorted[0];
}

/** Gratis / 0 kr treatments are booked as digital appointments (no physical address). */
export function isFreeBookingServicePrice(price: string | undefined): boolean {
  if (price == null) return false;
  const trimmed = price.trim();
  if (!trimmed) return false;
  if (trimmed === "0") return true;
  const digits = trimmed.replace(/[^\d]/g, "");
  if (!digits) return false;
  const n = parseInt(digits, 10);
  return Number.isFinite(n) && n === 0;
}

export function shouldHideBookingClinicAddress(params: {
  serviceName?: string;
  servicePrice?: string;
}): boolean {
  return (
    isDigitalBookingService(params.serviceName) ||
    isFreeBookingServicePrice(params.servicePrice)
  );
}

/** Avoid using a street/postal string as the clinic name in booking summaries. */
function looksLikeStreetAddress(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (/,\s*\d{4}\b/u.test(t)) return true;
  if (/\b\d{4}\s+[A-Za-zÆØÅæøå]/u.test(t)) return true;
  return /\b(veien|vei|gate|gata|allé|alle)\b/ui.test(t) && /\d/.test(t);
}

function withOptionalNamePrefix(base: string, namePrefix?: string): string {
  const prefix = namePrefix?.trim() ?? "";
  if (!base) return "";
  if (!prefix) return base;
  const normalizedBase = base.toLowerCase();
  const normalizedPrefix = prefix.replace(/\s*[–-]\s*$/, "").trim().toLowerCase();
  if (normalizedPrefix && normalizedBase.startsWith(normalizedPrefix)) {
    return base;
  }
  return `${prefix}${base}`;
}

/**
 * Booking summary clinic **name** — always from Sanity when matched (`label`),
 * never the street address. Works for every clinic document in CMS.
 */
export function bookingConfirmationClinicName(params: {
  clinic?: BookingClinic;
  sanityClinic?: SanityClinicListRow;
  /** When Sanity row is unavailable (e.g. specialist profile booking). */
  preferredName?: string;
  namePrefix?: string;
}): string {
  const sanityName = params.sanityClinic?.label?.trim();
  if (sanityName) {
    return withOptionalNamePrefix(sanityName, params.namePrefix);
  }

  const preferred = params.preferredName?.trim();
  if (preferred && !looksLikeStreetAddress(preferred)) {
    return withOptionalNamePrefix(preferred, params.namePrefix);
  }

  const fallback = params.clinic?.label?.trim() ?? "";
  if (fallback && !looksLikeStreetAddress(fallback)) {
    return withOptionalNamePrefix(fallback, params.namePrefix);
  }

  return withOptionalNamePrefix(preferred || fallback, params.namePrefix);
}

export function bookingConfirmationClinicAddress(params: {
  sanityClinic?: SanityClinicListRow;
  /** Fallback when Sanity row is unavailable (e.g. specialist inline booking). */
  fallbackAddress?: string;
  isDigital: boolean;
}): string | undefined {
  if (params.isDigital) return undefined;
  const address =
    params.sanityClinic?.address?.trim() || params.fallbackAddress?.trim() || "";
  return address || undefined;
}
