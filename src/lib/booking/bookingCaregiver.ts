import { personNamesLooselyEqual } from "@/lib/booking/caregiverNameMatch";
import { placeholderImageForCaregiverId } from "@/lib/booking/caregiverPlaceholders";
import type { Specialist } from "@/lib/sanity/specialist-types";
import type { ImageRef } from "@/lib/media";

export type BookingCaregiver = {
  name: string;
  title: string;
  image: ImageRef;
  apiUserId: number;
  slug: string;
  phonemobile?: string;
};

/** Match Metodika caregiver to Sanity specialist (metodikaUserId, then name). */
export function resolveSanitySpecialistForCaregiver(
  caregiver: BookingCaregiver,
  specialists: Specialist[],
): Specialist | undefined {
  const byId = specialists.find((s) => s.metodikaUserId === caregiver.apiUserId);
  if (byId) return byId;
  return specialists.find((s) => personNamesLooselyEqual(s.name, caregiver.name));
}

export function bookingPersonForModal(
  person: Specialist | BookingCaregiver,
  specialists: Specialist[],
): Specialist | BookingCaregiver {
  if (!isBookingCaregiver(person)) return person;
  return resolveSanitySpecialistForCaregiver(person, specialists) ?? person;
}

export function isBookingCaregiver(value: unknown): value is BookingCaregiver {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as BookingCaregiver).apiUserId === "number"
  );
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
