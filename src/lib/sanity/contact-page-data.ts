import { resolveContactRequestDialogCopy } from "@/lib/sanity/contact-request-dialog-copy";
import { mapClinicListRows } from "@/lib/sanity/clinic-list-row";
import { normalizePageSections } from "@/lib/sanity/page-sections";

export type ContactFormCopy = {
  title: string;
  subtitle: string;
  nameLabel: string;
  namePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  clinicLabel: string;
  clinicPlaceholder: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitButton: string;
  successTitle: string;
  successDescription: string;
  errorTitle: string;
  errorDescription: string;
  sensitiveDataNote: string;
};

function mapContactForm(raw: Record<string, unknown> | null | undefined): ContactFormCopy | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");
  const mapped: ContactFormCopy = {
    title: str(raw.title),
    subtitle: str(raw.subtitle),
    nameLabel: str(raw.nameLabel),
    namePlaceholder: str(raw.namePlaceholder),
    phoneLabel: str(raw.phoneLabel),
    phonePlaceholder: str(raw.phonePlaceholder),
    emailLabel: str(raw.emailLabel),
    emailPlaceholder: str(raw.emailPlaceholder),
    clinicLabel: str(raw.clinicLabel),
    clinicPlaceholder: str(raw.clinicPlaceholder),
    subjectLabel: str(raw.subjectLabel),
    subjectPlaceholder: str(raw.subjectPlaceholder),
    messageLabel: str(raw.messageLabel),
    messagePlaceholder: str(raw.messagePlaceholder),
    submitButton: str(raw.submitButton),
    successTitle: str(raw.successTitle),
    successDescription: str(raw.successDescription),
    errorTitle: str(raw.errorTitle),
    errorDescription: str(raw.errorDescription),
    sensitiveDataNote: str(raw.sensitiveDataNote),
  };
  const hasAny = Object.values(mapped).some((v) => v.length > 0);
  return hasAny ? mapped : undefined;
}

/** Maps a normalized contactPage document to the shape `useContactPage` returns. */
export function mapContactPageData(data: Record<string, unknown> | null, lang: "no" | "en") {
  if (!data) return null;
  const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");
  const ctaCards = ((data.ctaCards as Record<string, unknown>[]) || []).map((card) => ({
    ...card,
    title: str(card.title),
    description: str(card.description),
    ctaText: str(card.ctaText),
    ctaLink: str(card.ctaLink),
    icon: str(card.icon) || "Calendar",
    ctaAction: str(card.ctaAction) || "navigate",
    variant: str(card.variant) || "solid",
  }));
  const rawSection = data.clinicsSection as
    | {
        showSection?: boolean;
        title?: string;
        clinics?: unknown[];
      }
    | undefined;
  const curatedClinics = rawSection?.clinics?.length
    ? mapClinicListRows(rawSection.clinics, lang, { preserveOrder: true })
    : undefined;
  const clinicsSection = rawSection
    ? {
        showSection: rawSection.showSection !== false,
        title: typeof rawSection.title === "string" ? rawSection.title.trim() : "",
        clinics: curatedClinics,
      }
    : undefined;
  return {
    ...data,
    title: str(data.title),
    introText: str(data.introText),
    subtitle: str(data.introText),
    ctaCards,
    clinicsSection,
    contactForm: mapContactForm(data.contactForm as Record<string, unknown> | undefined),
    pageSections: normalizePageSections(data.pageSections),
    contactRequestDialog: resolveContactRequestDialogCopy(
      data as Parameters<typeof resolveContactRequestDialogCopy>[0],
    ),
  };
}
