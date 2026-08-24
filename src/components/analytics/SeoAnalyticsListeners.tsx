"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackBookingPhoneClick } from "@/lib/tracking/booking-analytics";
import { trackClickEmail } from "@/lib/tracking/form-events";
import {
  normalizePublicPhoneNumber,
  resolveClickPhoneLocationFromPath,
  trackClickPhone,
  trackVirtualPageView,
} from "@/lib/tracking/seo-events";
import { resolvePageType, stripLocalePrefix } from "@/lib/tracking/page-type";

function isBookingPath(pathname: string): boolean {
  const stripped = stripLocalePrefix(pathname);
  return stripped.startsWith("/booking") || stripped.startsWith("/book-appointment");
}

function resolveEmailLinkLocation(pathname: string): string {
  const pageType = resolvePageType(stripLocalePrefix(pathname));
  if (pageType === "clinic") return "clinic_page";
  if (pageType === "contact") return "contact_page";
  if (pageType === "booking") return "booking";
  return pageType;
}

/**
 * Global SEO listeners: virtual_page_view on route changes,
 * click_phone / booking_phone_click on tel: links,
 * click_email on mailto: links.
 */
export function SeoAnalyticsListeners() {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const lastVirtualPathRef = useRef("");

  useEffect(() => {
    const search = searchParams?.toString();
    const page_path = search ? `${pathname}?${search}` : pathname;
    if (page_path === lastVirtualPathRef.current) return;
    lastVirtualPathRef.current = page_path;

    trackVirtualPageView({
      page_path,
      page_title: typeof document !== "undefined" ? document.title : "",
      page_type: resolvePageType(stripLocalePrefix(pathname)),
    });
  }, [pathname, searchParams]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const telAnchor = target.closest("a[href^='tel:']");
      if (telAnchor instanceof HTMLAnchorElement) {
        const explicitLocation = telAnchor.dataset.phoneLocation?.trim();
        const linkLocation =
          explicitLocation === "header" ||
          explicitLocation === "footer" ||
          explicitLocation === "clinic_page" ||
          explicitLocation === "contact_page" ||
          explicitLocation === "booking"
            ? explicitLocation
            : resolveClickPhoneLocationFromPath(pathname);

        const clinic = telAnchor.dataset.phoneClinic?.trim() || null;
        const phone = normalizePublicPhoneNumber(telAnchor.getAttribute("href") || "");

        if (isBookingPath(pathname)) {
          trackBookingPhoneClick({
            link_location: linkLocation,
            clinic,
          });
        } else {
          trackClickPhone({
            phone_number: phone,
            link_location: linkLocation,
            clinic,
          });
        }
        return;
      }

      const mailAnchor = target.closest("a[href^='mailto:']");
      if (mailAnchor instanceof HTMLAnchorElement) {
        trackClickEmail({
          link_location: resolveEmailLinkLocation(pathname),
          email_type: mailAnchor.dataset.emailType?.trim() || null,
        });
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  return null;
}
