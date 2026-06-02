/** Slim category copy for Sanity migrations (no React/icons/image imports). */

export type CategoryLandingSeed = {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  servicesHeading: string;
  servicesIntro: string;
  serviceLinks: Record<string, string>;
  groups: Array<{ label: string; serviceNames: string[] }>;
  journey: Array<{ label: string; title: string; body: string }>;
  bookingPath: string;
};
