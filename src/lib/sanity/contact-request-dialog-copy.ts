export type ContactRequestDialogCopy = {
  dialogTitle: string;
  dialogDescription: string;
  nameLabel: string;
  namePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  clinicLabel: string;
  clinicPlaceholder: string;
  categoryLabel: string;
  categoryPlaceholder: string;
  categoryOtherLabel: string;
  timingLabel: string;
  timingAsapLabel: string;
  timingSpecificLabel: string;
  dayLabel: string;
  timeOfDayLabel: string;
  timeOfDayPlaceholder: string;
  timeMorningLabel: string;
  timeAfternoonLabel: string;
  timeEveningLabel: string;
  detailsLabel: string;
  detailsOptionalSuffix: string;
  detailsPlaceholder: string;
  cancelButton: string;
  submitButton: string;
  submittingButton: string;
  privacyNote: string;
  toastValidationTitle: string;
  toastValidationDescription: string;
  validationNameRequired: string;
  validationPhoneRequired: string;
  validationClinicRequired: string;
  validationCategoryRequired: string;
  toastSuccessTitle: string;
  toastSuccessDescription: string;
};

export const CONTACT_REQUEST_DIALOG_FIELD_KEYS = [
  "dialogTitle",
  "dialogDescription",
  "nameLabel",
  "namePlaceholder",
  "phoneLabel",
  "phonePlaceholder",
  "clinicLabel",
  "clinicPlaceholder",
  "categoryLabel",
  "categoryPlaceholder",
  "categoryOtherLabel",
  "timingLabel",
  "timingAsapLabel",
  "timingSpecificLabel",
  "dayLabel",
  "timeOfDayLabel",
  "timeOfDayPlaceholder",
  "timeMorningLabel",
  "timeAfternoonLabel",
  "timeEveningLabel",
  "detailsLabel",
  "detailsOptionalSuffix",
  "detailsPlaceholder",
  "cancelButton",
  "submitButton",
  "submittingButton",
  "privacyNote",
  "toastValidationTitle",
  "toastValidationDescription",
  "validationNameRequired",
  "validationPhoneRequired",
  "validationClinicRequired",
  "validationCategoryRequired",
  "toastSuccessTitle",
  "toastSuccessDescription",
] as const satisfies readonly (keyof ContactRequestDialogCopy)[];

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function resolveContactRequestDialogCopy(
  cms: Partial<ContactRequestDialogCopy> | null | undefined,
): ContactRequestDialogCopy | null {
  if (!cms) return null;

  const copy = {} as ContactRequestDialogCopy;
  for (const key of CONTACT_REQUEST_DIALOG_FIELD_KEYS) {
    copy[key] = str(cms[key]);
  }

  const hasTitle = Boolean(copy.dialogTitle);
  return hasTitle ? copy : null;
}
