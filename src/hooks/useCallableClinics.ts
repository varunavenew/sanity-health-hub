import { useMemo } from "react";
import { resolveSpecialistPageClinics, SPECIALIST_PAGE_FALLBACK_PHONE } from "@/lib/booking/specialist-page-clinics";
import { useClinics } from "@/hooks/useSanity";
import { clinicOffersCategoryPage } from "@/lib/booking/sanityBookingClinic";
import type { Specialist } from "@/lib/sanity/specialist-types";

export type CallableClinic = { label: string; phone: string };

/**
 * Clinics a visitor can call, narrowed to those whose Sanity `services` cover
 * `categoryId`. Pass no category to get every clinic with a phone number.
 *
 * When `specialist` is set (profile page), only clinics that specialist works at.
 *
 * `pending` stays true until the clinic list has loaded so callers can keep a
 * call button mounted instead of flashing it away on first render.
 */
export function useCallableClinics(
  categoryId?: string,
  specialist?: Specialist,
): {
  clinics: CallableClinic[];
  pending: boolean;
} {
  const { data, isPending } = useClinics();

  const clinics = useMemo(() => {
    if (specialist) {
      return resolveSpecialistPageClinics(specialist, data ?? [])
        .map((clinic) => ({
          label: clinic.label,
          phone: clinic.phone?.trim() || SPECIALIST_PAGE_FALLBACK_PHONE,
        }))
        .filter((clinic) => clinic.phone.trim().length > 0);
    }

    return (data ?? [])
      .filter(
        (clinic) =>
          clinic.phone && clinicOffersCategoryPage(clinic.services, categoryId),
      )
      .map((clinic) => ({ label: clinic.label, phone: clinic.phone! }));
  }, [data, categoryId, specialist]);

  return { clinics, pending: isPending };
}
