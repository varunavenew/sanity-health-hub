import type { ClinicLocation } from "@/lib/maps/clinic-location";
import { clinicMapsUrl } from "@/lib/maps/clinic-location";
import {
  dedupeBySlug,
  filterPublishedDocuments,
} from "@/lib/sanity/published-docs";
import { parseSortOrder, sortBySortOrder } from "@/lib/sortAlphabetical";

export type SanityClinicBooking = {
  method?: "info" | "pasientsky" | "metodika" | "closed";
  serviceProviderId?: string;
  metodikaLocationId?: number;
  externalBookingUrl?: string;
};

export type SanityClinicListRow = {
  _createdAt?: string;
  id: string;
  slug: string;
  label: string;
  address: string;
  phone?: string;
  hours?: string;
  description?: string;
  sortOrder?: number;
  primaryImage?: string;
  heroMedia?: unknown;
  detail?: {
    parking?: string;
    publicTransport?: string;
    accessibility?: string;
  };
  locationSearch?: ClinicLocation;
  mapsUrl?: string;
  services?: string[];
  booking?: SanityClinicBooking;
};

function normalizeClinicDetail(raw: unknown): SanityClinicListRow["detail"] | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  const parking = typeof d.parking === "string" ? d.parking : undefined;
  const publicTransport =
    typeof d.publicTransport === "string" ? d.publicTransport : undefined;
  const accessibility = typeof d.accessibility === "string" ? d.accessibility : undefined;
  if (!parking && !publicTransport && !accessibility) return undefined;
  return { parking, publicTransport, accessibility };
}

export function normalizeClinicRow(c: Record<string, unknown>): SanityClinicListRow {
  const label =
    typeof c.label === "string"
      ? c.label
      : typeof c.title === "string"
        ? c.title
        : "";
  const locationSearch = c.locationSearch as ClinicLocation | undefined;
  const address = typeof c.address === "string" ? c.address : "";
  const bookingRaw = c.booking as Record<string, unknown> | undefined;
  const booking =
    bookingRaw && typeof bookingRaw === "object"
      ? {
          method: bookingRaw.method as SanityClinicBooking["method"] | undefined,
          serviceProviderId:
            typeof bookingRaw.serviceProviderId === "string"
              ? bookingRaw.serviceProviderId
              : undefined,
          metodikaLocationId:
            typeof bookingRaw.metodikaLocationId === "number"
              ? bookingRaw.metodikaLocationId
              : undefined,
          externalBookingUrl:
            typeof bookingRaw.externalBookingUrl === "string"
              ? bookingRaw.externalBookingUrl
              : undefined,
        }
      : undefined;
  const services = Array.isArray(c.services)
    ? c.services.filter((item): item is string => typeof item === "string")
    : undefined;
  const primaryImage =
    typeof c.primaryImage === "string" && c.primaryImage.trim()
      ? c.primaryImage.trim()
      : undefined;
  const description =
    typeof c.description === "string" && c.description.trim()
      ? c.description.trim()
      : undefined;
  return {
    _createdAt: typeof c._createdAt === "string" ? c._createdAt : undefined,
    label: label.trim(),
    slug: (c.slug as string) || (c.id as string) || "",
    id: (c.id as string) || (c.slug as string) || "",
    address,
    phone: typeof c.phone === "string" ? c.phone : undefined,
    hours: typeof c.hours === "string" ? c.hours : undefined,
    description,
    sortOrder: parseSortOrder(c.sortOrder) ?? undefined,
    primaryImage,
    heroMedia: c.heroMedia,
    detail: normalizeClinicDetail(c.detail),
    locationSearch,
    mapsUrl: clinicMapsUrl(locationSearch, address),
    services,
    booking,
  };
}

export function mapClinicListRows(
  rows: unknown[] | null | undefined,
  lang: "no" | "en",
  options?: { preserveOrder?: boolean },
): SanityClinicListRow[] {
  const published = filterPublishedDocuments(rows || [])
    .map((c) => normalizeClinicRow(c as Record<string, unknown>))
    .filter((c) => c.label && c.address);
  const deduped = dedupeBySlug(published);
  if (options?.preserveOrder) {
    // Keep Sanity reference-array order (Contact curated list / drag-and-drop).
    return deduped;
  }
  return sortBySortOrder(deduped, (c) => c.sortOrder, (c) => c.label, lang);
}
