/** Unset CMS toggles keep current website behaviour (both buttons visible). */
export function specialistShowsBookingButton(specialist: {
  showBookingButton?: boolean | null;
}): boolean {
  return specialist.showBookingButton !== false;
}

export function specialistShowsCallButton(specialist: {
  showCallButton?: boolean | null;
}): boolean {
  return specialist.showCallButton !== false;
}

export function specialistHasHeroCtas(specialist: {
  showBookingButton?: boolean | null;
  showCallButton?: boolean | null;
}): boolean {
  return specialistShowsBookingButton(specialist) || specialistShowsCallButton(specialist);
}
