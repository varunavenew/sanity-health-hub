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
  appointment_date?: string | null;
  duration_minutes?: number | null;
  booking_lead_days?: number | null;
};

export type BookingStepContext = {
  service_name?: string | null;
  category?: string | null;
  clinic?: string | null;
};

const BOOKING_COMPLETED_STORAGE_PREFIX = "cmedical_booking_completed:";

/** Dedupe booking_completed per Metodika/Pasientsky appointment id (session + memory). */
const firedBookingCompletedIds = new Set<string>();

function hasBookingCompletedFired(txId: string): boolean {
  if (firedBookingCompletedIds.has(txId)) return true;
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(BOOKING_COMPLETED_STORAGE_PREFIX + txId) === "1";
  } catch {
    return false;
  }
}

function markBookingCompletedFired(txId: string) {
  firedBookingCompletedIds.add(txId);
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(BOOKING_COMPLETED_STORAGE_PREFIX + txId, "1");
  } catch {
    // sessionStorage unavailable — in-memory dedupe still applies
  }
}

/** Parse service price for GA4 value — null when unknown or non-positive (never send 0 as “unknown”). */
export function parseBookingTrackingValue(price?: string | null): number | null {
  if (price == null || !String(price).trim()) return null;
  const n = parseInt(String(price).replace(/\s/g, ""), 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

/** Lead time in whole days from now until appointment start (null when unknown). */
export function bookingLeadDaysFromIso(startDateTime?: string | null): number | null {
  if (!startDateTime?.trim()) return null;
  const appt = new Date(startDateTime);
  if (Number.isNaN(appt.getTime())) return null;
  const diffMs = appt.getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (24 * 60 * 60 * 1000)));
}

/** Build non-PII booking_completed context from Metodika flow state (before submit). */
export function metodikaBookingCompletedFromState(input: {
  clinic?: { label?: string } | null;
  service?: { name?: string; price?: string } | null;
  category?: string | null;
  specialist?: { name?: string } | null;
  slot?: {
    startDateTime?: string;
    durationMinutes?: number;
  } | null;
}): Omit<BookingCompletedTrackingParams, "booking_method" | "transaction_id"> {
  const appointment_date = input.slot?.startDateTime?.slice(0, 10) ?? null;
  return {
    value: parseBookingTrackingValue(input.service?.price),
    currency: "NOK",
    clinic: input.clinic?.label?.trim() || null,
    service_name: input.service?.name?.trim() || null,
    category: input.category?.trim() || null,
    practitioner: input.specialist?.name?.trim() || null,
    appointment_date,
    duration_minutes: input.slot?.durationMinutes ?? null,
    booking_lead_days: bookingLeadDaysFromIso(input.slot?.startDateTime),
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

export function trackBookingSelectCategory(input: {
  category?: string | null;
  service_name?: string | null;
  booking_method?: BookingMethod;
}) {
  track("booking_select_category", {
    category: input.category ?? null,
    service_name: input.service_name ?? null,
    booking_method: input.booking_method ?? "metodika",
  });
}

export function trackBookingStep(
  stepNumber: number,
  stepName: string,
  bookingMethod: BookingMethod = "metodika",
  context?: BookingStepContext,
) {
  track("booking_step", {
    step_number: stepNumber,
    step_name: stepName,
    booking_method: bookingMethod,
    service_name: context?.service_name ?? null,
    category: context?.category ?? null,
    clinic: context?.clinic ?? null,
  });
}

export function trackBookingBack(input: {
  from_step: number;
  to_step: number;
  booking_method?: BookingMethod;
}) {
  track("booking_back", {
    from_step: input.from_step,
    to_step: input.to_step,
    booking_method: input.booking_method ?? "metodika",
  });
}

export function trackBookingClose() {
  track("booking_close", {});
}

export function trackBookingUnavailable(input: {
  clinic?: string | null;
  booking_method?: BookingMethod;
}) {
  track("booking_unavailable", {
    clinic: input.clinic ?? null,
    booking_method: input.booking_method ?? "external",
  });
}

export function trackBookingPhoneClick(input: {
  link_location?: string | null;
  clinic?: string | null;
}) {
  track("booking_phone_click", {
    link_location: input.link_location ?? "booking",
    clinic: input.clinic ?? null,
  });
}

export function trackBookingSubmitted(input: {
  booking_method?: BookingMethod;
  clinic?: string | null;
  service_name?: string | null;
}) {
  track("booking_submitted", {
    booking_method: input.booking_method ?? "metodika",
    clinic: input.clinic ?? null,
    service_name: input.service_name ?? null,
  });
}

export function trackBookingFailed(input: {
  error_type: string;
  booking_method?: BookingMethod;
}) {
  track("booking_failed", {
    error_type: input.error_type,
    booking_method: input.booking_method ?? "metodika",
  });
}

/** `transaction_id` must be Metodika appointment ID only — never PII. Fires at most once per id. */
export function trackBookingCompleted(params: BookingCompletedTrackingParams) {
  const txId =
    params.transaction_id != null ? String(params.transaction_id).trim() : "";
  if (!txId) return;
  if (hasBookingCompletedFired(txId)) return;
  markBookingCompletedFired(txId);

  track("booking_completed", {
    transaction_id: txId,
    booking_method: params.booking_method,
    value: params.value ?? null,
    currency: params.currency ?? "NOK",
    clinic: params.clinic ?? null,
    service_name: params.service_name ?? null,
    category: params.category ?? null,
    practitioner: params.practitioner ?? null,
    appointment_date: params.appointment_date ?? null,
    duration_minutes: params.duration_minutes ?? null,
    booking_lead_days: params.booking_lead_days ?? null,
  });
}
