export type ClinicLocation = {
  placeId?: string
  lat?: number
  lng?: number
  alt?: number
}

/** Google Maps link for directions / opening in Maps app. */
export function clinicMapsUrl(
  location?: ClinicLocation | null,
  address?: string,
): string | undefined {
  if (location?.placeId) {
    return `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(location.placeId)}`
  }
  if (location?.lat != null && location?.lng != null) {
    return `https://www.google.com/maps?q=${location.lat},${location.lng}`
  }
  if (address) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(address)}`
  }
  return undefined
}

/** Embed URL for an inline map iframe (no API key required). */
export function clinicMapsEmbedUrl(
  location?: ClinicLocation | null,
  address?: string,
): string | undefined {
  if (location?.lat != null && location?.lng != null) {
    return `https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`
  }
  if (location?.placeId) {
    return `https://www.google.com/maps?q=place_id:${encodeURIComponent(location.placeId)}&z=15&output=embed`
  }
  if (address) {
    return `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`
  }
  return undefined
}

export function hasClinicCoordinates(location?: ClinicLocation | null): boolean {
  return location?.lat != null && location?.lng != null
}
