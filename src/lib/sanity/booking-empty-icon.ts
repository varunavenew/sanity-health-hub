/** Sanity dropdown value — hide the icon entirely (no default fallback). */
export const BOOKING_ICON_NONE = "none";

export function isBookingIconNone(key?: string | null): boolean {
  return key?.trim().toLowerCase() === BOOKING_ICON_NONE;
}
