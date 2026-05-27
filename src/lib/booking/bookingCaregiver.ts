import type { ImageRef } from "@/lib/media";
import { placeholderImageForCaregiverId } from "@/lib/booking/caregiverPlaceholders";

export type BookingCaregiver = {
  name: string;
  title: string;
  image: ImageRef;
  apiUserId: number;
  slug: string;
  phonemobile?: string;
};

export function isBookingCaregiver(
  value: { apiUserId?: number },
): value is BookingCaregiver {
  return typeof value.apiUserId === "number";
}

interface ApiBookingUser {
  id?: number;
  firstname?: string;
  lastname?: string;
  caregiver?: boolean;
  deactivated?: boolean;
  phonemobile?: string;
}

function looksLikePlaceholderText(value: string): boolean {
  const trimmed = value.trim();
  if (trimmed.length > 48) return true;
  return /lorem ipsum|pellentesque|consectetur/i.test(trimmed);
}

export function formatCaregiverDisplayName(
  firstname: string | undefined,
  lastname: string | undefined,
  userId: number,
): string {
  const first = (firstname ?? "").trim();
  const last = (lastname ?? "").trim();
  if (looksLikePlaceholderText(first) || looksLikePlaceholderText(last)) {
    return `Behandler ${userId}`;
  }
  const full = [first, last].filter(Boolean).join(" ");
  return full || `Behandler ${userId}`;
}

export function normalizeBookingCaregiver(
  entry: ApiBookingUser,
  specialtyLabel?: string,
): BookingCaregiver | null {
  const id = entry.id;
  if (id == null || entry.deactivated) return null;
  if (entry.caregiver === false) return null;

  return {
    name: formatCaregiverDisplayName(entry.firstname, entry.lastname, id),
    title: specialtyLabel?.trim() || "Behandler",
    image: placeholderImageForCaregiverId(id),
    apiUserId: id,
    slug: `booking-user-${id}`,
    phonemobile: entry.phonemobile?.trim() || undefined,
  };
}
