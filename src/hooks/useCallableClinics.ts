import { useMemo } from "react";
import { useClinics } from "@/hooks/useSanity";
import { clinicOffersCategoryPage } from "@/lib/booking/sanityBookingClinic";

export type CallableClinic = { label: string; phone: string };

/**
 * Clinics a visitor can call, narrowed to those whose Sanity `services` cover
 * `categoryId`. Pass no category to get every clinic with a phone number.
 *
 * `pending` stays true until the clinic list has loaded so callers can keep a
 * call button mounted instead of flashing it away on first render.
 */
export function useCallableClinics(categoryId?: string): {
  clinics: CallableClinic[];
  pending: boolean;
} {
  const { data, isPending } = useClinics();

  const clinics = useMemo(
    () =>
      (data ?? [])
        .filter(
          (clinic) =>
            clinic.phone && clinicOffersCategoryPage(clinic.services, categoryId),
        )
        .map((clinic) => ({ label: clinic.label, phone: clinic.phone! })),
    [data, categoryId],
  );

  return { clinics, pending: isPending };
}
