import { track } from "@/lib/tracking";
import { parseBookingTrackingValue } from "@/lib/tracking/booking-analytics";
import type { PageType } from "@/lib/tracking/page-type";
import { resolvePageType, stripLocalePrefix } from "@/lib/tracking/page-type";

export type BookingMenuEntryPoint =
  | "header_cta"
  | "price_page"
  | "service_page_cta"
  | "clinic_page"
  | "specialist_page"
  | "insurance_page"
  | "contact_page"
  | "deep_link";

export type BookingMenuStartParams = {
  entry_point: BookingMenuEntryPoint;
  category?: string | null;
  service_name?: string | null;
  price_from?: number | null;
  clinic?: string | null;
  practitioner?: string | null;
  specialty?: string | null;
};

export type ClickPhoneLinkLocation =
  | "header"
  | "footer"
  | "clinic_page"
  | "contact_page"
  | "booking";

/** Largest-volume Google Ads signal — every entry into booking. */
export function trackBookingMenuStart(params: BookingMenuStartParams) {
  track("booking_menu_start", {
    entry_point: params.entry_point,
    category: params.category ?? null,
    service_name: params.service_name ?? null,
    price_from: params.price_from ?? null,
    clinic: params.clinic ?? null,
    practitioner: params.practitioner ?? null,
    specialty: params.specialty ?? null,
  });
}

/** First active choice in booking step 1 — not on page load. */
let bookingStartFired = false;

export function trackBookingStart(bookingMethod: "metodika" | "pasientsky" | "external" = "metodika") {
  if (bookingStartFired) return;
  bookingStartFired = true;
  track("booking_start", { booking_method: bookingMethod });
}

export function trackVirtualPageView(input: {
  page_path: string;
  page_title: string;
  page_type: PageType;
}) {
  track("virtual_page_view", {
    page_path: input.page_path,
    page_title: input.page_title,
    page_type: input.page_type,
  });
}

export function trackClickPhone(input: {
  phone_number: string;
  link_location: ClickPhoneLinkLocation;
  clinic?: string | null;
}) {
  track("click_phone", {
    phone_number: normalizePublicPhoneNumber(input.phone_number),
    link_location: input.link_location,
    clinic: input.clinic ?? null,
  });
}

/** Normalize tel: href or display number to +47… public format. */
export function normalizePublicPhoneNumber(raw: string): string {
  const digits = raw.replace(/^tel:/i, "").replace(/[^\d+]/g, "");
  if (!digits) return raw;
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("47") && digits.length >= 10) return `+${digits}`;
  return `+47${digits.replace(/^0+/, "")}`;
}

export function parsePriceFromLabel(price?: string | null): number | null {
  return parseBookingTrackingValue(price);
}

export function inferClickPhoneLocation(pageType: PageType): ClickPhoneLinkLocation {
  switch (pageType) {
    case "clinic":
      return "clinic_page";
    case "contact":
      return "contact_page";
    case "booking":
      return "booking";
    default:
      return "footer";
  }
}

export function resolveClickPhoneLocationFromPath(pathname: string): ClickPhoneLinkLocation {
  const pageType = resolvePageType(stripLocalePrefix(pathname));
  if (pageType === "clinic" || pageType === "contact" || pageType === "booking") {
    return inferClickPhoneLocation(pageType);
  }
  return "footer";
}

export function isBookingDestination(path: string): boolean {
  const normalized = path.split("?")[0].replace(/\/+$/, "");
  return /\/booking$/.test(normalized) || normalized.endsWith("/book-appointment");
}

/** Fire booking_menu_start when navigating to booking from a tracked entry point. */
export function trackBookingMenuStartForPath(
  path: string,
  entry_point: BookingMenuEntryPoint,
  context?: Omit<BookingMenuStartParams, "entry_point">,
) {
  if (!isBookingDestination(path)) return;
  trackBookingMenuStart({ entry_point, ...context });
}
