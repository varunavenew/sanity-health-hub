/**
 * Migrate Contact page CTA cards (Hjelpekort) to Sanity with NO + EN i18n fields.
 *
 * Usage:
 *   npm run migrate:contact-cta-cards --prefix test
 */
import { sanityClient as client } from "./config";
import { i18nString, i18nText } from "./lib/category-landing-i18n";

const CONTACT_ID = "contactPage";

async function migrate() {
  console.log("🚀 Migrating Contact CTA cards (i18n)...\n");

  await client.createIfNotExists({
    _id: CONTACT_ID,
    _type: "contactPage",
    title: i18nString("Kontakt oss", "Contact us"),
  });

  const ctaCards = [
    {
      _key: "cta-1",
      icon: "Calendar",
      title: i18nString(
        "Vil du at vi skal kontakte deg?",
        "Would you like us to contact you?",
      ),
      description: i18nText(
        "Fyll ut et kort skjema – velg klinikk, fagområde og når det passer best at vi ringer.",
        "Fill out a short form – choose clinic, specialty and when it suits you best for us to call.",
      ),
      ctaText: i18nString("Be om å bli kontaktet", "Request a callback"),
      ctaAction: "openContactDialog",
      variant: "solid",
    },
    {
      _key: "cta-2",
      icon: "Calendar",
      title: i18nString("Vil du booke direkte?", "Want to book directly?"),
      description: i18nText(
        "Velg tjeneste, klinikk og behandler – alt i én enkel booking.",
        "Choose service, clinic and practitioner – all in one simple booking.",
      ),
      ctaText: i18nString("Bestill time nå", "Book appointment"),
      ctaAction: "navigate",
      ctaLink: "/booking",
      variant: "solid",
    },
    {
      _key: "cta-3",
      icon: "Shield",
      title: i18nString("Har du helseforsikring?", "Do you have health insurance?"),
      description: i18nText(
        "De fleste av våre behandlinger dekkes av helseforsikring. Sjekk med ditt selskap.",
        "Most of our treatments are covered by health insurance. Check with your provider.",
      ),
      ctaText: i18nString("Les om forsikring", "Read about insurance"),
      ctaAction: "navigate",
      ctaLink: "/forsikring",
      variant: "outline",
    },
  ];

  await client.patch(CONTACT_ID).set({ ctaCards }).commit();

  console.log("✅ Migrated 3 CTA cards to contactPage.");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
