#!/usr/bin/env npx tsx
/**
 * Migration: "Tjenester ved denne klinikken" section → clinicPage.servicesSection
 *
 * Writes, per clinic (NO + EN internationalized-array v5 values):
 *   servicesSection.title        "Tjenester ved denne klinikken"
 *   servicesSection.description  "CMedical <klinikk> tilbyr N ulike tjenester. …"
 *   servicesSection.items[]      { serviceId, label (i18n), href }
 *
 * The plain `services` string-ID array is kept in sync as well, so existing
 * static fallbacks keep working.
 *
 * Safe to re-run: only writes when the field is empty, unless FORCE=1.
 *
 * Usage:
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-clinic-services-section.ts --dry-run
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-clinic-services-section.ts
 *   cd test && SANITY_TOKEN=<token> FORCE=1 npx tsx sanity/migrate-clinic-services-section.ts
 */
import { sanityClient } from "./config";

const DRY = process.argv.includes("--dry-run");
const FORCE = process.env.FORCE === "1";

// ─── i18n v5 helpers ──────────────────────────────────────────────────────
type L = "no" | "en";
const LANGS: L[] = ["no", "en"];

const i18n = (type: "String" | "Text", no: string, en: string) =>
  LANGS.map((language) => ({
    _key: language,
    _type: `internationalizedArray${type}Value`,
    language,
    value: language === "no" ? no : en,
  }));

const i18nString = (no: string, en: string) => i18n("String", no, en);
const i18nText = (no: string, en: string) => i18n("Text", no, en);

const isEmpty = (v: any) =>
  v === undefined ||
  v === null ||
  v === "" ||
  (Array.isArray(v) && v.length === 0) ||
  (typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0);

// ─── Service catalogue (id → label NO/EN + internal link) ─────────────────
interface ServiceDef {
  no: string;
  en: string;
  href?: string;
}

const SERVICES: Record<string, ServiceDef> = {
  fertilitet: { no: "Fertilitet", en: "Fertility", href: "/behandlinger/fertilitet" },
  fostermedisiner: { no: "Fostermedisin", en: "Fetal medicine", href: "/behandlinger/graviditet/ultralyd" },
  gynekolog: { no: "Gynekologi", en: "Gynaecology", href: "/behandlinger/gynekologi" },
  ernaringsfysiolog: { no: "Ernæringsfysiolog", en: "Clinical nutritionist", href: "/behandlinger/flere-fagomrader/ernaringsfysiolog" },
  psykolog: { no: "Psykolog", en: "Psychologist", href: "/behandlinger/flere-fagomrader/psykologi" },
  sexolog: { no: "Sexolog", en: "Sexologist", href: "/behandlinger/flere-fagomrader/sexologi" },
  gastrokirurg: { no: "Gastrokirurgi", en: "Gastrointestinal surgery", href: "/behandlinger/flere-fagomrader/gastrokirurgi" },
  ortoped: { no: "Ortopedi", en: "Orthopaedics", href: "/behandlinger/ortopedi" },
  handterapeut: { no: "Håndterapeut", en: "Hand therapist" },
  revmatolog: { no: "Revmatolog", en: "Rheumatologist", href: "/behandlinger/flere-fagomrader/revmatologi" },
  urolog: { no: "Urologi", en: "Urology", href: "/behandlinger/urologi" },
  hudhelse: { no: "Hudhelse", en: "Skin health", href: "/behandlinger/flere-fagomrader/hudhelse" },
  hudlege: { no: "Hudlege", en: "Dermatologist", href: "/behandlinger/flere-fagomrader/hudhelse" },
  areknuter: { no: "Åreknutebehandling", en: "Varicose vein treatment", href: "/behandlinger/flere-fagomrader/areknuter" },
  "sprengte-blodkar": { no: "Sprengte blodkar", en: "Broken capillaries", href: "/behandlinger/flere-fagomrader/hudhelse" },
  fysioterapeut: { no: "Fysioterapeut", en: "Physiotherapist" },
  uroterapi: { no: "Uroterapi", en: "Urotherapy" },
  osteopati: { no: "Osteopati", en: "Osteopathy", href: "/behandlinger/flere-fagomrader/osteopati" },
  robotkirurgi: { no: "Robotassistert kirurgi", en: "Robot-assisted surgery", href: "/behandlinger/flere-fagomrader/robotkirurgi" },
  endokrinolog: { no: "Endokrinolog", en: "Endocrinologist" },
  overvektskirurgi: { no: "Overvektskirurgi", en: "Bariatric surgery" },
  plastikkirurgi: { no: "Plastikkirurgi", en: "Plastic surgery", href: "/behandlinger/flere-fagomrader/plastikkirurgi" },
  karkirurgi: { no: "Karkirurgi", en: "Vascular surgery", href: "/behandlinger/flere-fagomrader/areknuter" },
  hjertespesialist: { no: "Hjertespesialist", en: "Cardiologist" },
  almennlege: { no: "Allmennlege", en: "General practitioner" },
};

// ─── Per-clinic service order (mirrors src/data/clinicServices.ts) ────────
const clinics: { slug: string; label: { no: string; en: string }; services: string[] }[] = [
  {
    slug: "majorstuen",
    label: { no: "Oslo Majorstuen", en: "Oslo Majorstuen" },
    services: [
      "fertilitet", "fostermedisiner", "gynekolog", "ernaringsfysiolog",
      "psykolog", "sexolog", "gastrokirurg", "ortoped", "handterapeut",
      "revmatolog", "urolog", "hudhelse", "areknuter", "sprengte-blodkar",
      "fysioterapeut", "uroterapi", "osteopati", "robotkirurgi",
      "endokrinolog", "overvektskirurgi",
    ],
  },
  {
    slug: "bekkestua",
    label: { no: "Bekkestua", en: "Bekkestua" },
    services: ["gynekolog", "hudhelse", "hudlege", "ernaringsfysiolog"],
  },
  {
    slug: "moss",
    label: { no: "Moss", en: "Moss" },
    services: ["gynekolog", "ortoped", "gastrokirurg", "fysioterapeut", "plastikkirurgi", "areknuter"],
  },
  {
    slug: "moelv",
    label: { no: "Moelv", en: "Moelv" },
    services: ["gynekolog", "ortoped", "urolog", "areknuter", "karkirurgi", "hjertespesialist", "almennlege"],
  },
];

const SECTION_TITLE = { no: "Tjenester ved denne klinikken", en: "Services at this clinic" };

const buildDescription = (clinic: (typeof clinics)[number]) => {
  const count = clinic.services.length;
  const allLinked = clinic.services.every((id) => SERVICES[id]?.href);
  return {
    no: `CMedical ${clinic.label.no} tilbyr ${count} ulike tjenester. ${
      allLinked ? "Klikk for å lese mer." : "Klikk på tjenestene med pil for å lese mer."
    }`,
    en: `CMedical ${clinic.label.en} offers ${count} different services. ${
      allLinked ? "Click to read more." : "Click the services with an arrow to read more."
    }`,
  };
};

const buildItems = (clinic: (typeof clinics)[number]) =>
  clinic.services.map((id) => {
    const svc = SERVICES[id] || { no: id, en: id };
    return {
      _key: `${clinic.slug}-${id}`,
      _type: "clinicServiceItem",
      serviceId: id,
      label: i18nString(svc.no, svc.en),
      ...(svc.href ? { href: svc.href } : {}),
    };
  });

async function migrate() {
  console.log(`🏥 Migrating clinic services section${DRY ? " (dry run)" : ""}${FORCE ? " [FORCE]" : ""}\n`);

  const docs = await sanityClient.fetch<{ _id: string; slug: string; servicesSection?: any; services?: string[] }[]>(
    `*[_type == "clinicPage"]{ _id, "slug": slug.current, servicesSection, services }`
  );

  for (const clinic of clinics) {
    const doc = docs.find((d) => d.slug === clinic.slug);
    if (!doc) {
      console.warn(`  ⚠️  No clinicPage found for slug "${clinic.slug}" — skipped`);
      continue;
    }

    const desc = buildDescription(clinic);
    const payload = {
      _type: "clinicServicesSection",
      title: i18nString(SECTION_TITLE.no, SECTION_TITLE.en),
      description: i18nText(desc.no, desc.en),
      items: buildItems(clinic),
    };

    const set: Record<string, any> = {};
    if (FORCE || isEmpty(doc.servicesSection)) set.servicesSection = payload;
    if (FORCE || isEmpty(doc.services)) set.services = clinic.services;

    if (Object.keys(set).length === 0) {
      console.log(`  ⏭️  ${clinic.slug} — already populated (use FORCE=1 to overwrite)`);
      continue;
    }

    if (DRY) {
      console.log(`  📝 ${clinic.slug} →`, JSON.stringify(set, null, 2));
      continue;
    }

    await sanityClient.patch(doc._id).set(set).commit();
    console.log(`  ✅ ${clinic.slug} (${clinic.services.length} tjenester)`);
  }

  console.log(`\n✨ Done${DRY ? " (nothing written)" : ""}.`);
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err.message);
  process.exit(1);
});
