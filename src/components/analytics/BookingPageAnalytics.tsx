"use client";

import { useEffect, useRef } from "react";
import { initBookingPageAnalytics } from "@/lib/tracking/booking-analytics";

/** Signals GTM to block Microsoft Clarity on booking pages. */
export function BookingPageAnalytics() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    initBookingPageAnalytics();
  }, []);

  return null;
}
