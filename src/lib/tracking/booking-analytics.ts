import {
  isExternalClinic,
  isPasientskyClinic,
  type BookingClinic,
} from "@/lib/booking/mapApiLocation";
import { track } from "@/lib/tracking";

export type BookingMethod = "metodika" | "pasientsky" | "external";

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

/** `transaction_id` must be Metodika appointment ID only — never PII. */
export function trackBookingCompleted(params: {
  booking_method: BookingMethod;
  transaction_id?: string | number | null;
}) {
  const payload: Record<string, unknown> = {
    booking_method: params.booking_method,
  };
  if (params.transaction_id != null && String(params.transaction_id).trim()) {
    payload.transaction_id = String(params.transaction_id).trim();
  }
  track("booking_completed", payload);
}
