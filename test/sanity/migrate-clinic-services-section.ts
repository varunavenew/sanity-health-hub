#!/usr/bin/env npx tsx
/**
 * Migration: "Tjenester ved denne klinikken" section → clinicPage.servicesSection
 *
 * Writes, per clinic (NO + EN internationalized-array v5 values):
 *   servicesSection.title        "Tjenester ved denne klinikken"
 *   servicesSection.description  "CMedical <klinikk> tilbyr N ulike tjenester. …"
 *   servicesSection.items[]      { serviceId, label (i18n), href? }
 *
 * Also keeps Advanced → services[] (Service IDs) in sync.
 *
 * Source: inline clinic service lists + catalogue below (original migration content).
 * Schema: test/schemaTypes/clinicPage.ts → servicesSection
 *
 * Safe to re-run: only writes when empty, unless FORCE=1.
 *
 * Usage:
 *   cd test && npx tsx sanity/migrate-clinic-services-section.ts --dry-run
 *   cd test && npx tsx sanity/migrate-clinic-services-section.ts
 *   cd test && FORCE=1 npx tsx sanity/migrate-clinic-services-section.ts
 */
import { sanityClient } from "./config";

const DRY = process.argv.includes("--dry-run");
const FORCE = process.env.FORCE === "1";

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

const isEmpty = (v: unknown) =>
  v === undefined ||
  v === null ||
  v === "" ||
  (Array.isArray(v) && v.length === 0) ||
  (typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0);

function isI18nSlugArray(val: unknown): boolean {
  return (
    Array.isArray(val) &&
    val.length > 0 &&
    typeof val[0] === "object" &&
    val[0] !== null &&
    String((val[0] as { _type?: string })._type).startsWith("internationalizedArraySlug")
  );
}

function slugFromDoc(doc: { slug?: unknown; _id?: string }): string | undefined {
  const slug = doc.slug;
  if (slug && typeof slug === "object" && !Array.isArray(slug)) {
    const current = (slug as { current?: string }).current;
    if (typeof current === "string" && current.trim()) return current.trim();
  }
  if (isI18nSlugArray(slug)) {
    const items = slug as { language?: string; value?: { current?: string } }[];
    const no = items.find((item) => item.language === "no");
    if (no?.value?.current?.trim()) return no.value.current.trim();
    return items[0]?.value?.current?.trim();
  }
  const id = doc._id?.replace(/^drafts\./, "") || "";
  if (id.startsWith("clinicPage-")) return id.slice("clinicPage-".length);
  return undefined;
}

/** Display labels + optional internal links for service IDs (frontend fallback catalogue). */
interface ServiceDef {
  no: string;
  en: string;
  href?: string;
}

const SERVICES: Record<string, ServiceDef> = {
  fertilitet: { no: "Fertilitet", en: "Fertility", href: "/behandlinger/fertilitet" },
  fostermedisiner: {
    no: "Fostermedisin",
    en: "Fetal medicine",
    href: "/behandlinger/graviditet/ultralyd",
  },
  gynekolog: { no: "Gynekologi", en: "Gynaecology", href: "/behandlinger/gynekologi" },
  ernaringsfysiolog: {
    no: "Ernæringsfysiolog",
    en: "Clinical nutritionist",
    href: "/behandlinger/flere-fagomrader/ernaringsfysiolog",
  },
  psykolog: { no: "Psykolog", en: "Psychologist", href: "/behandlinger/flere-fagomrader/psykologi" },
  sexolog: { no: "Sexolog", en: "Sexologist", href: "/behandlinger/flere-fagomrader/sexologi" },
  gastrokirurg: {
    no: "Gastrokirurgi",
    en: "Gastrointestinal surgery",
    href: "/behandlinger/flere-fagomrader/gastrokirurgi",
  },
  ortoped: { no: "Ortopedi", en: "Orthopaedics", href: "/behandlinger/ortopedi" },
  handterapeut: { no: "Håndterapeut", en: "Hand therapist" },
  revmatolog: {
    no: "Revmatolog",
    en: "Rheumatologist",
    href: "/behandlinger/flere-fagomrader/revmatologi",
  },
  urolog: { no: "Urologi", en: "Urology", href: "/behandlinger/urologi" },
  hudhelse: { no: "Hudhelse", en: "Skin health", href: "/behandlinger/flere-fagomrader/hudhelse" },
  hudlege: { no: "Hudlege", en: "Dermatologist", href: "/behandlinger/flere-fagomrader/hudhelse" },
  areknuter: {
    no: "Åreknutebehandling",
    en: "Varicose vein treatment",
    href: "/behandlinger/flere-fagomrader/areknuter",
  },
  "sprengte-blodkar": {
    no: "Sprengte blodkar",
    en: "Broken capillaries",
    href: "/behandlinger/flere-fagomrader/hudhelse",
  },
  fysioterapeut: { no: "Fysioterapeut", en: "Physiotherapist" },
  uroterapi: { no: "Uroterapi", en: "Urotherapy" },
  osteopati: { no: "Osteopati", en: "Osteopathy", href: "/behandlinger/flere-fagomrader/osteopati" },
  robotkirurgi: {
    no: "Robotassistert kirurgi",
    en: "Robot-assisted surgery",
    href: "/behandlinger/flere-fagomrader/robotkirurgi",
  },
  endokrinolog: { no: "Endokrinolog", en: "Endocrinologist" },
  overvektskirurgi: { no: "Overvektskirurgi", en: "Bariatric surgery" },
  karkirurgi: {
    no: "Karkirurgi",
    en: "Vascular surgery",
    href: "/behandlinger/flere-fagomrader/areknuter",
  },
  hjertespesialist: { no: "Hjertespesialist", en: "Cardiologist" },
  almennlege: { no: "Allmennlege", en: "General practitioner" },
};

// Per-clinic service order (original migration content)
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
    services: ["gynekolog", "ortoped", "gastrokirurg", "fysioterapeut", "areknuter"],
  },
  {
    slug: "moelv",
    label: { no: "Moelv", en: "Moelv" },
    services: ["gynekolog", "ortoped", "urolog", "areknuter", "karkirurgi", "hjertespesialist", "almennlege"],
  },
];

const SECTION_TITLE = { no: "Tjenester ved denne klinikken", en: "Services at this clinic" };

function buildDescription(clinic: (typeof clinics)[number]) {
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
}

function buildItems(clinic: (typeof clinics)[number]) {
  return clinic.services.map((id) => {
    const svc = SERVICES[id] || { no: id, en: id };
    return {
      _key: `${clinic.slug}-${id}`,
      _type: "clinicServiceItem" as const,
      serviceId: id,
      label: i18nString(svc.no, svc.en),
      ...(svc.href ? { href: svc.href } : {}),
    };
  });
}

function servicesEqual(a: string[] | undefined, b: string[]): boolean {
  if (!Array.isArray(a) || a.length !== b.length) return false;
  return a.every((id, i) => id === b[i]);
}

async function migrate() {
  console.log(
    `🏥 Migrating clinic services section${DRY ? " (dry run)" : ""}${FORCE ? " [FORCE]" : ""}\n`,
  );

  const slugs = clinics.map((c) => c.slug);
  const docs = await sanityClient.fetch<
    Array<{ _id: string; slug?: unknown; servicesSection?: unknown; services?: string[] }>
  >(
    `*[_type == "clinicPage" && !(_id in path("drafts.**")) && (
      _id in $ids || slug.current in $slugs || count(slug[value.current in $slugs]) > 0
    )]{ _id, slug, servicesSection, services }`,
    { ids: slugs.map((s) => `clinicPage-${s}`), slugs },
  );

  let updated = 0;
  let skipped = 0;

  for (const clinic of clinics) {
    const doc =
      docs.find((d) => slugFromDoc(d) === clinic.slug) ||
      docs.find((d) => d._id.replace(/^drafts\./, "") === `clinicPage-${clinic.slug}`);

    if (!doc) {
      console.warn(`  ⚠️  No clinicPage found for slug "${clinic.slug}" — skipped`);
      continue;
    }

    const desc = buildDescription(clinic);
    const servicesSection = {
      title: i18nString(SECTION_TITLE.no, SECTION_TITLE.en),
      description: i18nText(desc.no, desc.en),
      items: buildItems(clinic),
    };

    const set: Record<string, unknown> = {};
    if (FORCE || isEmpty(doc.servicesSection)) set.servicesSection = servicesSection;
    if (FORCE || isEmpty(doc.services) || !servicesEqual(doc.services, clinic.services)) {
      set.services = clinic.services;
    }

    if (Object.keys(set).length === 0) {
      skipped++;
      console.log(`  ⏭️  ${clinic.slug} — already populated (use FORCE=1 to overwrite)`);
      continue;
    }

    if (DRY) {
      console.log(`  📝 ${clinic.slug} →`, JSON.stringify(set, null, 2));
      updated++;
      continue;
    }

    await sanityClient.patch(doc._id).set(set).commit({ autoGenerateArrayKeys: true });
    updated++;
    console.log(`  ✅ ${clinic.slug} (${clinic.services.length} services)`);
  }

  console.log(`\n✨ Done — ${updated} updated, ${skipped} skipped${DRY ? " (nothing written)" : ""}.`);
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err?.message || err);
  process.exit(1);
});
