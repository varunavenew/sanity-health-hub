import type { BookingClinic } from "@/lib/booking/mapApiLocation";
import type { SanityClinicListRow } from "@/lib/sanity/clinic-list-row";

/** True when the booked service is a digital/video appointment (hide clinic address). */
export function isDigitalBookingService(serviceName: string | undefined): boolean {
  const name = serviceName?.trim() ?? "";
  if (!name) return false;
  return /\bdigital\b/i.test(name) || /\bdigitaltime\b/i.test(name);
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

export function bookingConfirmationClinicName(params: {
  clinic?: BookingClinic;
  sanityClinic?: SanityClinicListRow;
  /** When Sanity row is unavailable (e.g. specialist profile booking). */
  preferredName?: string;
  namePrefix?: string;
}): string {
  const prefix = params.namePrefix?.trim() ?? "";
  const sanityName = params.sanityClinic?.label?.trim();
  const preferred = params.preferredName?.trim();
  const fallback = params.clinic?.label?.trim() ?? "";
  const base = sanityName || preferred || fallback;
  if (!base) return "";
  if (!prefix) return base;

  const normalizedBase = base.toLowerCase();
  const normalizedPrefix = prefix.replace(/\s*[–-]\s*$/, "").trim().toLowerCase();
  if (normalizedPrefix && normalizedBase.startsWith(normalizedPrefix)) {
    return base;
  }
  return `${prefix}${base}`;
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
