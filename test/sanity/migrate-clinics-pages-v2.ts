#!/usr/bin/env npx tsx
/**
 * Migration: clinicPage content → new (Phase 17B) clinicPage schema.
 *
 * Writes every field the new schema expects, with NO + EN
 * internationalized-array v5 values (`{ _key, _type, language, value }`):
 *
 *   General      title, slug, address, phone, email, hours (i18n),
 *                contactDescription (i18n)
 *   Page Content description (i18n), valueProposition, detail.parking /
 *                publicTransport / accessibility (i18n, all required)
 *   Shared       faqSectionTitle (i18n), faqs[] (inline `clinicFaq` items, i18n)
 *   SEO          seo.metaTitle / seo.metaDescription (i18n)
 *   Advanced     booking.method (+ ids / urls), locationSearch, services[],
 *                sortOrder
 *
 * Safe to re-run: uses `createIfNotExists` + `patch(...).set(...)`, so images
 * (primaryImage / heroMedia / gallery), references (treatments, specialists,
 * faqCollection) and pageSections already in Sanity are never overwritten.
 *
 * Usage:
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-clinics-pages-v2.ts --dry-run
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-clinics-pages-v2.ts
 *   cd test && SANITY_TOKEN=<token> FORCE=1 npx tsx sanity/migrate-clinics-pages-v2.ts
 *
 * Flags / env:
 *   --dry-run   print the payloads, write nothing
 *   FORCE=1     also overwrite fields that already have a value
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

/** internationalizedArraySlug (NO + EN) — matches clinicPage schema + Studio. */
const i18nSlug = (no: string, en = no) =>
  LANGS.map((language) => ({
    _key: language,
    _type: "internationalizedArraySlugValue",
    language,
    value: { _type: "slug", current: language === "no" ? no : en },
  }));

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

const isEmpty = (v: any) =>
  v === undefined ||
  v === null ||
  v === "" ||
  (Array.isArray(v) && v.length === 0) ||
  (typeof v === "object" && !Array.isArray(v) && Object.keys(v).length === 0);

function shouldWriteField(key: string, doc: Record<string, unknown> | undefined): boolean {
  if (FORCE || !doc) return true;
  if (key === "slug") {
    return !isI18nSlugArray(doc.slug) || !(slugFromDoc(doc)?.trim());
  }
  return isEmpty(doc[key]);
}

// ─── Source content (NO + EN) ─────────────────────────────────────────────
interface Bi {
  no: string;
  en: string;
}
interface ClinicSource {
  slug: string;
  title: Bi;
  address: string;
  phone: string;
  email?: string;
  hours: Bi;
  contactDescription?: Bi;
  description: Bi;
  valueProposition?: { vp1?: Bi; highlight?: string; socialProof?: Bi };
  detail: { parking: Bi; publicTransport: Bi; accessibility: Bi };
  booking: {
    method: "info" | "pasientsky" | "metodika" | "closed";
    serviceProviderId?: string;
    metodikaLocationId?: number;
    externalBookingUrl?: string;
    closedMessage?: Bi;
  };
  locationSearch?: { lat: number; lng: number };
  services: string[];
  sortOrder: number;
  faqs: { q: Bi; a: Bi }[];
  seo: { title: Bi; description: Bi };
}

const clinics: ClinicSource[] = [
  {
    slug: "majorstuen",
    title: { no: "Oslo Majorstuen", en: "Oslo Majorstuen" },
    address: "Sørkedalsveien 10 B, 0369 Oslo",
    phone: "22 60 00 50",
    email: "post@cmedical.no",
    hours: {
      no: "Man–Fre 08:00–16:00",
      en: "Mon–Fri 08:00–16:00",
    },
    contactDescription: {
      no: "Ta kontakt på telefon eller e-post, så hjelper resepsjonen deg med timeavtale og praktiske spørsmål.",
      en: "Call or email us — our reception will help you with appointments and practical questions.",
    },
    description: {
      no: "CMedical Majorstuen er vår hovedklinikk i Oslo, sentralt plassert i Sørkedalsveien 10 B. Her tilbyr vi det bredeste spekteret av spesialisthelsetjenester, fra gynekologi og fertilitet til ortopedi og urologi. Klinikken er moderne innredet med pasientkomfort i fokus.",
      en: "CMedical Majorstuen is our main clinic in Oslo, centrally located at Sørkedalsveien 10 B. Here we offer the broadest range of specialist healthcare services, from gynaecology and fertility to orthopaedics and urology. The clinic is modern and designed with patient comfort in mind.",
    },
    valueProposition: {
      vp1: { no: "Kort ventetid", en: "Short waiting time" },
      highlight: "08:00–16:00",
      socialProof: { no: "Ingen henvisning", en: "No referral needed" },
    },
    detail: {
      parking: {
        no: "Gateparkering tilgjengelig i nærområdet. Nærmeste parkeringshus er Colosseum Park (5 min gange).",
        en: "Street parking is available nearby. The closest car park is Colosseum Park (5 min walk).",
      },
      publicTransport: {
        no: "Majorstuen T-banestasjon (alle linjer) – 3 minutters gange. Trikk 11, 12 og 19 stopper rett utenfor.",
        en: "Majorstuen metro station (all lines) – a 3 minute walk. Trams 11, 12 and 19 stop right outside.",
      },
      accessibility: {
        no: "Universelt utformet med heis og trinnfri adkomst.",
        en: "Universally designed with a lift and step-free access.",
      },
    },
    booking: { method: "metodika", metodikaLocationId: 1 },
    locationSearch: { lat: 59.9296, lng: 10.7118 },
    services: [
      "fertilitet", "fostermedisiner", "gynekolog", "ernaringsfysiolog",
      "psykolog", "sexolog", "gastrokirurg", "ortoped", "handterapeut",
      "revmatolog", "urolog", "hudlege", "areknuter", "sprengte-blodkar",
      "fysioterapeut", "uroterapi",
    ],
    sortOrder: 1,
    faqs: [
      {
        q: { no: "Trenger jeg henvisning?", en: "Do I need a referral?" },
        a: {
          no: "For de fleste konsultasjoner trengs ingen henvisning. Ved bruk av forsikring eller offentlig refusjon kan det være krav om henvisning fra fastlege.",
          en: "Most consultations require no referral. A referral from your GP may be required when using insurance or public reimbursement.",
        },
      },
      {
        q: { no: "Kan jeg bruke helseforsikring?", en: "Can I use health insurance?" },
        a: {
          no: "Ja, klinikken samarbeider med de fleste forsikringsselskap. Avklar dekning med forsikringsselskapet på forhånd.",
          en: "Yes, the clinic works with most insurance companies. Please confirm coverage with your insurer in advance.",
        },
      },
      {
        q: { no: "Hvor lang tid tar en konsultasjon?", en: "How long does a consultation take?" },
        a: {
          no: "En standardkonsultasjon varer normalt 30–45 minutter, avhengig av type undersøkelse.",
          en: "A standard consultation usually lasts 30–45 minutes, depending on the type of examination.",
        },
      },
      {
        q: { no: "Er det ventetid for time?", en: "Is there a waiting time for appointments?" },
        a: {
          no: "Ventetiden er kort. De fleste får time innen 1–2 uker.",
          en: "Waiting times are short. Most patients get an appointment within 1–2 weeks.",
        },
      },
    ],
    seo: {
      title: {
        no: "CMedical Oslo Majorstuen – spesialistklinikk",
        en: "CMedical Oslo Majorstuen – specialist clinic",
      },
      description: {
        no: "Besøk CMedical Oslo Majorstuen i Sørkedalsveien 10 B. Se åpningstider, tjenester, spesialister og kontaktinformasjon.",
        en: "Visit CMedical Oslo Majorstuen at Sørkedalsveien 10 B. See opening hours, services, specialists and contact details.",
      },
    },
  },
  {
    slug: "bekkestua",
    title: { no: "Bekkestua", en: "Bekkestua" },
    address: "Gamle Ringeriksvei 36, 1357 Bekkestua",
    phone: "22 60 00 50",
    email: "post@cmedical.no",
    hours: { no: "Man–fre 08:00–16:00", en: "Mon–Fri 08:00–16:00" },
    contactDescription: {
      no: "Ring eller send e-post for timeavtale og praktiske spørsmål.",
      en: "Call or email us for appointments and practical questions.",
    },
    description: {
      no: "CMedical Bekkestua ligger sentralt på Bekkestua i Bærum. Klinikken tilbyr gynekologi og hudhelse i moderne og rolige omgivelser.",
      en: "CMedical Bekkestua is centrally located in Bekkestua, Bærum. The clinic offers gynaecology and dermatology in modern, calm surroundings.",
    },
    valueProposition: {
      vp1: { no: "Kort ventetid", en: "Short waiting time" },
      highlight: "08:00–16:00",
      socialProof: { no: "Ingen henvisning", en: "No referral needed" },
    },
    detail: {
      parking: {
        no: "Gratis parkering tilgjengelig rett utenfor klinikken.",
        en: "Free parking is available right outside the clinic.",
      },
      publicTransport: {
        no: "Bekkestua stasjon (Kolsåsbanen) – 2 minutters gange.",
        en: "Bekkestua station (Kolsås line) – a 2 minute walk.",
      },
      accessibility: {
        no: "Trinnfri adkomst til klinikken.",
        en: "Step-free access to the clinic.",
      },
    },
    booking: { method: "metodika", metodikaLocationId: 2 },
    locationSearch: { lat: 59.9214, lng: 10.5259 },
    services: ["gynekolog", "hudlege"],
    sortOrder: 2,
    faqs: [
      {
        q: { no: "Trenger jeg henvisning?", en: "Do I need a referral?" },
        a: {
          no: "For de fleste konsultasjoner trengs ingen henvisning. Sjekk med forsikringsselskapet ved ønske om forsikringsdekning.",
          en: "Most consultations require no referral. Check with your insurer if you want insurance coverage.",
        },
      },
      {
        q: { no: "Hvilke tjenester tilbys på Bekkestua?", en: "Which services are offered at Bekkestua?" },
        a: {
          no: "Klinikken tilbyr gynekologi og hudlege.",
          en: "The clinic offers gynaecology and dermatology.",
        },
      },
      {
        q: { no: "Er det parkering?", en: "Is there parking?" },
        a: {
          no: "Ja, det er gratis parkering rett utenfor klinikken.",
          en: "Yes, there is free parking right outside the clinic.",
        },
      },
    ],
    seo: {
      title: { no: "CMedical Bekkestua – klinikk i Bærum", en: "CMedical Bekkestua – clinic in Bærum" },
      description: {
        no: "Besøk CMedical Bekkestua i Gamle Ringeriksvei 36. Gynekologi og hudlege, åpningstider og kontaktinformasjon.",
        en: "Visit CMedical Bekkestua at Gamle Ringeriksvei 36. Gynaecology and dermatology, opening hours and contact details.",
      },
    },
  },
  {
    slug: "moss",
    title: { no: "Moss", en: "Moss" },
    address: "Lilleengveien 8, 1523 Moss",
    phone: "69 25 40 00",
    email: "post@cmedical.no",
    hours: { no: "Man–fre 08:00–15:30", en: "Mon–Fri 08:00–15:30" },
    contactDescription: {
      no: "Timebestilling skjer via vår samarbeidspartner. Ring gjerne klinikken ved spørsmål.",
      en: "Appointments are booked via our partner. Feel free to call the clinic with any questions.",
    },
    description: {
      no: "CMedical Moss holder til i Lilleengveien 8 og tilbyr et bredt spekter av tjenester inkludert gynekologi, ortopedi, gastrokirurgi og fysioterapi.",
      en: "CMedical Moss is located at Lilleengveien 8 and offers a wide range of services including gynaecology, orthopaedics, gastrointestinal surgery and physiotherapy.",
    },
    valueProposition: {
      vp1: { no: "Kort ventetid", en: "Short waiting time" },
      highlight: "08:00–15:30",
      socialProof: { no: "Ingen henvisning", en: "No referral needed" },
    },
    detail: {
      parking: {
        no: "Gratis parkering rett utenfor klinikken.",
        en: "Free parking right outside the clinic.",
      },
      publicTransport: {
        no: "Moss stasjon (tog fra Oslo S) – ca. 10 minutters gange eller kort busstur.",
        en: "Moss station (train from Oslo S) – about a 10 minute walk or a short bus ride.",
      },
      accessibility: {
        no: "Universelt utformet med trinnfri adkomst.",
        en: "Universally designed with step-free access.",
      },
    },
    booking: { method: "info", externalBookingUrl: "https://colosseumfaust.no/spesialister/" },
    locationSearch: { lat: 59.4369, lng: 10.6716 },
    services: ["gynekolog", "ortoped", "gastrokirurg", "fysioterapeut"],
    sortOrder: 3,
    faqs: [
      {
        q: { no: "Hvordan bestiller jeg time i Moss?", en: "How do I book an appointment in Moss?" },
        a: {
          no: "Timebestilling gjøres via Colosseum Faust sitt bookingsystem.",
          en: "Appointments are booked through Colosseum Faust's booking system.",
        },
      },
      {
        q: { no: "Trenger jeg henvisning?", en: "Do I need a referral?" },
        a: {
          no: "For de fleste konsultasjoner trengs ingen henvisning. Sjekk med forsikringsselskapet dersom det er relevant.",
          en: "Most consultations require no referral. Check with your insurer if relevant.",
        },
      },
      {
        q: { no: "Er det parkering?", en: "Is there parking?" },
        a: {
          no: "Ja, det er gratis parkering rett utenfor klinikken.",
          en: "Yes, there is free parking right outside the clinic.",
        },
      },
    ],
    seo: {
      title: { no: "CMedical Moss – spesialistklinikk", en: "CMedical Moss – specialist clinic" },
      description: {
        no: "Besøk CMedical Moss i Lilleengveien 8. Gynekologi, ortopedi, kirurgi og fysioterapi. Se åpningstider og kontaktinformasjon.",
        en: "Visit CMedical Moss at Lilleengveien 8. Gynaecology, orthopaedics, surgery and physiotherapy. See opening hours and contact details.",
      },
    },
  },
  {
    slug: "moelv",
    title: { no: "Moelv", en: "Moelv" },
    address: "Storgata 60, 2390 Moelv",
    phone: "23 60 00 50",
    email: "post@cmedical.no",
    hours: { no: "Man–fre 08:30–15:30", en: "Mon–Fri 08:30–15:30" },
    contactDescription: {
      no: "Ring eller send e-post for timeavtale og praktiske spørsmål.",
      en: "Call or email us for appointments and practical questions.",
    },
    description: {
      no: "CMedical Moelv ligger i Storgata 60 og er vår klinikk i Innlandet. Her tilbyr vi gynekologi, ortopedi, urologi, karkirurgi og allmennmedisin.",
      en: "CMedical Moelv is located at Storgata 60 and is our clinic in Innlandet. Here we offer gynaecology, orthopaedics, urology, vascular surgery and general practice.",
    },
    valueProposition: {
      vp1: { no: "Kort ventetid", en: "Short waiting time" },
      highlight: "08:30–15:30",
      socialProof: { no: "Ingen henvisning", en: "No referral needed" },
    },
    detail: {
      parking: {
        no: "Gratis parkering rett utenfor klinikken.",
        en: "Free parking right outside the clinic.",
      },
      publicTransport: {
        no: "Moelv stasjon (tog fra Oslo S via Hamar) – 5 minutters gange.",
        en: "Moelv station (train from Oslo S via Hamar) – a 5 minute walk.",
      },
      accessibility: {
        no: "Trinnfri adkomst til alle behandlingsrom.",
        en: "Step-free access to all treatment rooms.",
      },
    },
    booking: { method: "pasientsky", serviceProviderId: "cmedical-moelv" },
    locationSearch: { lat: 60.9297, lng: 10.7003 },
    services: ["gynekolog", "ortoped", "urolog", "areknuter", "karkirurgi", "hjertespesialist", "almennlege"],
    sortOrder: 4,
    faqs: [
      {
        q: { no: "Trenger jeg henvisning?", en: "Do I need a referral?" },
        a: {
          no: "For de fleste konsultasjoner trengs ingen henvisning.",
          en: "Most consultations require no referral.",
        },
      },
      {
        q: { no: "Hvilke tjenester tilbys i Moelv?", en: "Which services are offered in Moelv?" },
        a: {
          no: "Klinikken tilbyr gynekologi, ortopedi, urologi, karkirurgi og allmennmedisin.",
          en: "The clinic offers gynaecology, orthopaedics, urology, vascular surgery and general medicine.",
        },
      },
      {
        q: { no: "Er det parkering?", en: "Is there parking?" },
        a: {
          no: "Ja, det er gratis parkering rett utenfor klinikken.",
          en: "Yes, there is free parking right outside the clinic.",
        },
      },
    ],
    seo: {
      title: { no: "CMedical Moelv – klinikk i Innlandet", en: "CMedical Moelv – clinic in Innlandet" },
      description: {
        no: "Besøk CMedical Moelv i Storgata 60. Gynekologi, ortopedi, urologi og allmennmedisin. Åpningstider og kontaktinformasjon.",
        en: "Visit CMedical Moelv at Storgata 60. Gynaecology, orthopaedics, urology and general practice. Opening hours and contact details.",
      },
    },
  },
];

// ─── Build the document payload ───────────────────────────────────────────
function buildFields(c: ClinicSource) {
  const fields: Record<string, any> = {
    title: i18nString(c.title.no, c.title.en),
    slug: i18nSlug(c.slug),
    address: c.address,
    phone: c.phone,
    hours: i18nString(c.hours.no, c.hours.en),

    description: i18nText(c.description.no, c.description.en),

    detail: {
      _type: "object",
      parking: i18nText(c.detail.parking.no, c.detail.parking.en),
      publicTransport: i18nText(c.detail.publicTransport.no, c.detail.publicTransport.en),
      accessibility: i18nText(c.detail.accessibility.no, c.detail.accessibility.en),
    },

    faqSectionTitle: i18nString("Ofte stilte spørsmål", "Frequently asked questions"),
    faqs: c.faqs.map((f, i) => ({
      _key: `faq-${c.slug}-${i}`,
      _type: "clinicFaq",
      question: i18nString(f.q.no, f.q.en),
      answer: i18nText(f.a.no, f.a.en),
    })),

    seo: {
      _type: "seo",
      metaTitle: i18nString(c.seo.title.no, c.seo.title.en),
      metaDescription: i18nText(c.seo.description.no, c.seo.description.en),
      noIndex: false,
    },

    booking: {
      _type: "object",
      method: c.booking.method,
      ...(c.booking.serviceProviderId ? { serviceProviderId: c.booking.serviceProviderId } : {}),
      ...(c.booking.metodikaLocationId !== undefined
        ? { metodikaLocationId: c.booking.metodikaLocationId }
        : {}),
      ...(c.booking.externalBookingUrl ? { externalBookingUrl: c.booking.externalBookingUrl } : {}),
      ...(c.booking.closedMessage
        ? { closedMessage: i18nText(c.booking.closedMessage.no, c.booking.closedMessage.en) }
        : {}),
    },

    services: c.services,
    sortOrder: c.sortOrder,
  };

  if (c.email) fields.email = c.email;
  if (c.contactDescription)
    fields.contactDescription = i18nText(c.contactDescription.no, c.contactDescription.en);
  if (c.locationSearch)
    fields.locationSearch = {
      _type: "object",
      lat: c.locationSearch.lat,
      lng: c.locationSearch.lng,
    };
  if (c.valueProposition) {
    const vp: Record<string, any> = { _type: "object" };
    if (c.valueProposition.vp1)
      vp.valueProposition1 = i18nString(c.valueProposition.vp1.no, c.valueProposition.vp1.en);
    if (c.valueProposition.highlight) vp.valueProposition2 = c.valueProposition.highlight;
    if (c.valueProposition.socialProof)
      vp.socialProof = i18nString(
        c.valueProposition.socialProof.no,
        c.valueProposition.socialProof.en,
      );
    fields.valueProposition = vp;
  }

  return fields;
}

// ─── Run ──────────────────────────────────────────────────────────────────
async function migrate() {
  console.log(`🏥 Migrating ${clinics.length} clinic pages (NO + EN)${DRY ? " [dry-run]" : ""}\n`);

  const ids = clinics.map((c) => `clinicPage-${c.slug}`);
  const existing: any[] = await sanityClient.fetch(
    `*[_type == "clinicPage" && (
      _id in $ids
      || slug.current in $slugs
      || count(slug[value.current in $slugs]) > 0
    )]{ _id, slug, title, address, phone, email, hours, description, contactDescription, detail, valueProposition, faqSectionTitle, faqs, seo, booking, locationSearch, services, sortOrder }`,
    { ids, slugs: clinics.map((c) => c.slug) },
  );

  let created = 0;
  let patched = 0;
  let skipped = 0;

  for (const c of clinics) {
    const doc =
      existing.find((d) => slugFromDoc(d) === c.slug) ||
      existing.find((d) => d._id.replace(/^drafts\./, "") === `clinicPage-${c.slug}`);
    const id = doc?._id || `clinicPage-${c.slug}`;
    const all = buildFields(c);

    // Only write fields that are empty (unless FORCE=1) so editor changes,
    // images and references in Sanity are preserved.
    const set: Record<string, any> = {};
    for (const [key, value] of Object.entries(all)) {
      if (shouldWriteField(key, doc)) set[key] = value;
    }

    if (Object.keys(set).length === 0) {
      skipped++;
      console.log(`  ⏭  ${c.title.no} — already complete`);
      continue;
    }

    console.log(
      `  ${doc ? "✏️ " : "✨"} ${c.title.no} (${id}) → ${Object.keys(set).join(", ")}`,
    );

    if (DRY) continue;

    await sanityClient
      .transaction()
      .createIfNotExists({ _id: id, _type: "clinicPage" } as any)
      .patch(id, (p) => p.set(set))
      .commit({ autoGenerateArrayKeys: true });

    doc ? patched++ : created++;
  }

  console.log(
    `\n✅ Done — ${created} created, ${patched} updated, ${skipped} unchanged${DRY ? " (dry-run, nothing written)" : ""}.`,
  );
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err.message);
  process.exit(1);
});
