/** Default bottom CTA + FAQ heading per treatment category (NO + EN). */

export const defaultPageUi = {
  quickInfoItems: [
    { no: "Ingen henvisning", en: "No referral required" },
    { no: "Kort ventetid", en: "Short waiting times" },
    { no: "Forsikring godkjent", en: "Insurance accepted" },
  ],
  linkedServicesSectionTitle: {
    no: "Vårt tverrfaglige team",
    en: "Our interdisciplinary team",
  },
  processSectionTitle: {
    no: "Slik foregår behandlingen",
    en: "How treatment works",
  },
};

export type CategoryBottomCtaCopy = {
  quickInfoItems?: { no: string; en: string }[];
  linkedServicesSectionTitle?: { no: string; en: string };
  processSectionTitle?: { no: string; en: string };
  faqSectionTitle: { no: string; en: string };
  bottomCta: {
    title: { no: string; en: string };
    subtitle: { no: string; en: string };
    primaryLabel: { no: string; en: string };
    secondaryLabel: { no: string; en: string };
    primaryPath?: string;
    secondaryPath?: string;
  };
};

export const treatmentCategoryBottomCtaByKey: Record<string, CategoryBottomCtaCopy> = {
  gynekologi: {
    ...defaultPageUi,
    faqSectionTitle: { no: "Ofte stilte spørsmål", en: "Frequently asked questions" },
    bottomCta: {
      title: { no: "Klar for å ta neste steg?", en: "Ready to take the next step?" },
      subtitle: {
        no: "Bestill time enkelt online. Ingen henvisning nødvendig, og vi har kort ventetid.",
        en: "Book an appointment easily online. No referral required, and we have short waiting times.",
      },
      primaryLabel: {
        no: "Bestill time hos en gynekolog",
        en: "Book an appointment with a gynecologist",
      },
      secondaryLabel: { no: "Kontakt oss", en: "Contact us" },
      secondaryPath: "/kontakt",
    },
  },
  fertilitet: {
    ...defaultPageUi,
    faqSectionTitle: { no: "Ofte stilte spørsmål", en: "Frequently asked questions" },
    bottomCta: {
      title: { no: "Klar for å ta neste steg?", en: "Ready to take the next step?" },
      subtitle: {
        no: "Bestill time enkelt online. Ingen henvisning nødvendig, og vi har kort ventetid.",
        en: "Book an appointment easily online. No referral required, and we have short waiting times.",
      },
      primaryLabel: {
        no: "Bestill time hos en fertilitetsspesialist",
        en: "Book an appointment with a fertility specialist",
      },
      secondaryLabel: { no: "Kontakt oss", en: "Contact us" },
      secondaryPath: "/kontakt",
    },
  },
  urologi: {
    ...defaultPageUi,
    faqSectionTitle: { no: "Ofte stilte spørsmål", en: "Frequently asked questions" },
    bottomCta: {
      title: { no: "Klar for å ta neste steg?", en: "Ready to take the next step?" },
      subtitle: {
        no: "Bestill time enkelt online. Ingen henvisning nødvendig, og vi har kort ventetid.",
        en: "Book an appointment easily online. No referral required, and we have short waiting times.",
      },
      primaryLabel: {
        no: "Bestill time hos en urolog",
        en: "Book an appointment with a urologist",
      },
      secondaryLabel: { no: "Kontakt oss", en: "Contact us" },
      secondaryPath: "/kontakt",
    },
  },
  ortopedi: {
    ...defaultPageUi,
    faqSectionTitle: { no: "Ofte stilte spørsmål", en: "Frequently asked questions" },
    bottomCta: {
      title: { no: "Klar for å ta neste steg?", en: "Ready to take the next step?" },
      subtitle: {
        no: "Bestill time enkelt online. Ingen henvisning nødvendig, og vi har kort ventetid.",
        en: "Book an appointment easily online. No referral required, and we have short waiting times.",
      },
      primaryLabel: {
        no: "Bestill time hos en ortoped",
        en: "Book an appointment with an orthopedic specialist",
      },
      secondaryLabel: { no: "Kontakt oss", en: "Contact us" },
      secondaryPath: "/kontakt",
    },
  },
  graviditet: {
    ...defaultPageUi,
    faqSectionTitle: { no: "Ofte stilte spørsmål", en: "Frequently asked questions" },
    bottomCta: {
      title: { no: "Klar for å ta neste steg?", en: "Ready to take the next step?" },
      subtitle: {
        no: "Bestill time enkelt online. Ingen henvisning nødvendig, og vi har kort ventetid.",
        en: "Book an appointment easily online. No referral required, and we have short waiting times.",
      },
      primaryLabel: {
        no: "Bestill time hos en fostermedisiner",
        en: "Book an appointment with a fetal medicine specialist",
      },
      secondaryLabel: { no: "Kontakt oss", en: "Contact us" },
      secondaryPath: "/kontakt",
    },
  },
  "flere-fagomrader": {
    ...defaultPageUi,
    faqSectionTitle: { no: "Ofte stilte spørsmål", en: "Frequently asked questions" },
    bottomCta: {
      title: { no: "Klar for å ta neste steg?", en: "Ready to take the next step?" },
      subtitle: {
        no: "Bestill time enkelt online. Ingen henvisning nødvendig, og vi har kort ventetid.",
        en: "Book an appointment easily online. No referral required, and we have short waiting times.",
      },
      primaryLabel: {
        no: "Bestill time hos en spesialist",
        en: "Book an appointment with a specialist",
      },
      secondaryLabel: { no: "Kontakt oss", en: "Contact us" },
      secondaryPath: "/kontakt",
    },
  },
};
