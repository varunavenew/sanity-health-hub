declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/** Push a GTM-style event when `window.dataLayer` is available. */
export function trackWithGTM(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...data });
}
