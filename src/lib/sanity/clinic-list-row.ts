import type { ClinicLocation } from "@/lib/maps/clinic-location";
import { clinicMapsUrl } from "@/lib/maps/clinic-location";
import { parseSortOrder } from "@/lib/sortAlphabetical";

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
  sortOrder?: number;
  primaryImage?: string;
  locationSearch?: ClinicLocation;
  mapsUrl?: string;
  services?: string[];
  booking?: SanityClinicBooking;
};

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
  return {
    _createdAt: typeof c._createdAt === "string" ? c._createdAt : undefined,
    label: label.trim(),
    slug: (c.slug as string) || (c.id as string) || "",
    id: (c.id as string) || (c.slug as string) || "",
    address,
    phone: typeof c.phone === "string" ? c.phone : undefined,
    hours: typeof c.hours === "string" ? c.hours : undefined,
    sortOrder: parseSortOrder(c.sortOrder) ?? undefined,
    primaryImage,
    locationSearch,
    mapsUrl: clinicMapsUrl(locationSearch, address),
    services,
    booking,
  };
}
