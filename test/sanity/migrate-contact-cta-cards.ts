/**
 * Migrate Contact page CTA cards (Hjelpekort) to Sanity.
 *
 * Usage:
 *   npx ts-node --esm test/sanity/migrate-contact-cta-cards.ts
 */
import { sanityClient as client } from "./config";

const CONTACT_ID = "contactPage";

async function migrate() {
  console.log("🚀 Migrating Contact CTA cards...\n");

  await client.createIfNotExists({
    _id: CONTACT_ID,
    _type: "contactPage",
    title: "Kontakt oss",
  });

  const ctaCards = [
    {
      _key: "cta-1",
      icon: "Calendar",
      title: "Vil du at vi skal kontakte deg?",
      description:
        "Fyll ut et kort skjema – velg klinikk, fagområde og når det passer best at vi ringer.",
      ctaText: "Be om å bli kontaktet",
      ctaAction: "openContactDialog",
      variant: "solid",
    },
    {
      _key: "cta-2",
      icon: "Calendar",
      title: "Vil du booke direkte?",
      description: "Velg tjeneste, klinikk og behandler – alt i én enkel booking.",
      ctaText: "Bestill time nå",
      ctaAction: "navigate",
      ctaLink: "/booking",
      variant: "solid",
    },
    {
      _key: "cta-3",
      icon: "Shield",
      title: "Har du helseforsikring?",
      description:
        "De fleste av våre behandlinger dekkes av helseforsikring. Sjekk med ditt selskap.",
      ctaText: "Les om forsikring",
      ctaAction: "navigate",
      ctaLink: "/forsikring",
      variant: "outline",
    },
  ];

  await client.patch(CONTACT_ID).set({ ctaCards }).commit();

  console.log("✅ Migrated 3 CTA cards to Contact page.");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
