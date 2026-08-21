import {
  isExternalClinic,
  isPasientskyClinic,
  type BookingClinic,
} from "@/lib/booking/mapApiLocation";
import { track } from "@/lib/tracking";

export type BookingMethod = "metodika" | "pasientsky" | "external";

export type BookingCompletedTrackingParams = {
  booking_method: BookingMethod;
  transaction_id?: string | number | null;
  value?: number | null;
  currency?: string | null;
  clinic?: string | null;
  service_name?: string | null;
  category?: string | null;
  practitioner?: string | null;
};

/** Dedupe booking_completed per Metodika/Pasientsky appointment id (same session). */
const firedBookingCompletedIds = new Set<string>();

/** Parse service price for GA4 value — null when unknown or non-positive (never send 0 as “unknown”). */
export function parseBookingTrackingValue(price?: string | null): number | null {
  if (price == null || !String(price).trim()) return null;
  const n = parseInt(String(price).replace(/\s/g, ""), 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

/** Build non-PII booking_completed context from Metodika flow state (before submit). */
export function metodikaBookingCompletedFromState(input: {
  clinic?: { label?: string } | null;
  service?: { name?: string; price?: string } | null;
  category?: string | null;
  specialist?: { name?: string } | null;
}): Omit<BookingCompletedTrackingParams, "booking_method" | "transaction_id"> {
  return {
    value: parseBookingTrackingValue(input.service?.price),
    currency: "NOK",
    clinic: input.clinic?.label?.trim() || null,
    service_name: input.service?.name?.trim() || null,
    category: input.category?.trim() || null,
    practitioner: input.specialist?.name?.trim() || null,
  };
}

export function bookingMethodForClinic(clinic?: BookingClinic | null): BookingMethod {
  if (!clinic) return "metodika";
  if (isPasientskyClinic(clinic)) return "pasientsky";
  if (isExternalClinic(clinic)) return "external";
  return "metodika";
}

/** Signal GTM to block Microsoft Clarity on booking flows (health data). */
export function initBookingPageAnalytics() {
  track("booking_page_context", {
    page_type: "booking",
    block_clarity: true,
  });
}

export function trackBookingInit(bookingMethod: BookingMethod = "metodika") {
  track("booking_init", { booking_method: bookingMethod });
}

export function trackBookingSelectClinic(clinic: BookingClinic) {
  track("booking_select_clinic", {
    clinic: clinic.label,
    booking_method: bookingMethodForClinic(clinic),
  });
}

export function trackBookingStep(
  stepNumber: number,
  stepName: string,
  bookingMethod: BookingMethod = "metodika",
) {
  track("booking_step", {
    step_number: stepNumber,
    step_name: stepName,
    booking_method: bookingMethod,
  });
}

/** `transaction_id` must be Metodika appointment ID only — never PII. Fires at most once per id. */
export function trackBookingCompleted(params: BookingCompletedTrackingParams) {
  const txId =
    params.transaction_id != null ? String(params.transaction_id).trim() : "";
  if (txId) {
    if (firedBookingCompletedIds.has(txId)) return;
    firedBookingCompletedIds.add(txId);
  }

  const payload: Record<string, unknown> = {
    booking_method: params.booking_method,
    value: params.value ?? null,
    currency: params.currency ?? "NOK",
    clinic: params.clinic ?? null,
    service_name: params.service_name ?? null,
    category: params.category ?? null,
    practitioner: params.practitioner ?? null,
  };
  if (txId) payload.transaction_id = txId;

  track("booking_completed", payload);
}
