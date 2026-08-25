import { track } from "@/lib/tracking";

function isBookingPath(path: string) {
  const pathname = path.split("?")[0].toLowerCase();
  return (
    pathname.includes("/booking") ||
    pathname.includes("/book-appointment") ||
    pathname.includes("/bestill")
  );
}

/** Header / menu CTA into the booking flow — no PII. */
export function trackBookingMenuStartForPath(
  path: string,
  source: string,
) {
  if (!path || !isBookingPath(path)) return;
  track("booking_menu_start", {
    source,
    booking_method: "metodika",
  });
}
