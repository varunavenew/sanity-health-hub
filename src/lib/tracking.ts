import { sanitizeTrackingParams } from "@/lib/tracking/privacy";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Push a custom event to GTM via dataLayer.
 * Params are sanitized — no PII (names, phone, email, birth number, etc.).
 */
export function track(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...sanitizeTrackingParams(params) });
}

/** @deprecated Prefer `track`. */
export const trackWithGTM = track;
