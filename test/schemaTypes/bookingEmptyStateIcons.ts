/** Curated icon keys for booking empty states (matches src/lib/icons.ts). */
export const BOOKING_ICON_NONE = 'none'

const NONE_OPTION = { title: 'None (hide icon)', value: BOOKING_ICON_NONE } as const

export const BOOKING_EMPTY_STATE_ICON_OPTIONS = [
  NONE_OPTION,
  { title: 'Heart handshake (default)', value: 'heart-handshake' },
  { title: 'Heart handshake (CMedical)', value: 'heart-handshake-cm' },
  { title: 'Hand heart', value: 'hand-heart' },
  { title: 'Heart', value: 'heart' },
  { title: 'Heart pulse', value: 'heart-pulse' },
  { title: 'Phone', value: 'phone' },
  { title: 'Calendar', value: 'calendar' },
  { title: 'Clock', value: 'clock' },
  { title: 'Help circle', value: 'help-circle' },
  { title: 'Info', value: 'info' },
  { title: 'Stethoscope', value: 'stethoscope' },
  { title: 'Map pin', value: 'map-pin' },
  { title: 'Users', value: 'users' },
  { title: 'Consultation (CMedical)', value: 'consultation' },
] as const

/** Icon on the dark “call us” pill button in empty states. */
export const BOOKING_CALL_BUTTON_ICON_OPTIONS = [
  NONE_OPTION,
  { title: 'Phone (default)', value: 'phone' },
  { title: 'Phone (CMedical thin)', value: 'phone-cm' },
  { title: 'Mail', value: 'mail' },
  { title: 'Help circle', value: 'help-circle' },
  { title: 'Info', value: 'info' },
  { title: 'Calendar', value: 'calendar' },
  { title: 'Hand heart', value: 'hand-heart' },
  { title: 'Heart handshake', value: 'heart-handshake' },
] as const

export const BOOKING_EMPTY_STATE_ICON_DEFAULT = 'heart-handshake'
export const BOOKING_CALL_BUTTON_ICON_DEFAULT = 'phone'
