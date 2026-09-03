type SpecialistBookingFields = {
  showBookingButton?: boolean | null;
  metodikaUserId?: number | null;
  bookingCategoryIds?: number[] | null;
};

function hasPositiveId(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

/** Online booking works only when both Metodika user ID and activity groups are set. */
export function specialistHasOnlineBookingConfig(specialist: {
  metodikaUserId?: number | null;
  bookingCategoryIds?: number[] | null;
}): boolean {
  const hasMetodikaId = hasPositiveId(specialist.metodikaUserId);
  const hasActivityGroups = (specialist.bookingCategoryIds ?? []).some(hasPositiveId);
  return hasMetodikaId && hasActivityGroups;
}

/** Unset CMS toggles keep current website behaviour (both buttons visible). */
export function specialistShowsBookingButton(
  specialist: SpecialistBookingFields,
): boolean {
  return specialist.showBookingButton !== false;
}

export function specialistShowsCallButton(specialist: {
  showCallButton?: boolean | null;
}): boolean {
  return specialist.showCallButton !== false;
}

export function specialistHasHeroCtas(specialist: SpecialistBookingFields & {
  showCallButton?: boolean | null;
}): boolean {
  return specialistShowsBookingButton(specialist) || specialistShowsCallButton(specialist);
}
