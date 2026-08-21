"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  normalizePublicPhoneNumber,
  resolveClickPhoneLocationFromPath,
  trackClickPhone,
  trackVirtualPageView,
} from "@/lib/tracking/seo-events";
import { resolvePageType, stripLocalePrefix } from "@/lib/tracking/page-type";

/**
 * Global SEO listeners: virtual_page_view on route changes + click_phone on tel: links.
 * Mount once inside locale providers (client-side navigation).
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

      const anchor = target.closest("a[href^='tel:']");
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;

      const explicitLocation = anchor.dataset.phoneLocation?.trim();
      const linkLocation =
        explicitLocation === "header" ||
        explicitLocation === "footer" ||
        explicitLocation === "clinic_page" ||
        explicitLocation === "contact_page" ||
        explicitLocation === "booking"
          ? explicitLocation
          : resolveClickPhoneLocationFromPath(pathname);

      const clinic = anchor.dataset.phoneClinic?.trim() || null;
      trackClickPhone({
        phone_number: normalizePublicPhoneNumber(anchor.getAttribute("href") || ""),
        link_location: linkLocation,
        clinic,
      });
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname]);

  return null;
}
