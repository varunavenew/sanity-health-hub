/**
 * Migrate static clinic data to Sanity CMS.
 *
 * Usage:
 *   SANITY_TOKEN=<token> npx tsx test/sanity/migrate-clinics.ts
 */
import { sanityClient } from "./config";

interface StaticClinic {
  id: string;
  slug: string;
  label: string;
  address: string;
  phone: string;
  hours: string;
  services: string[];
  bookingSystem: string;
  externalBookingUrl?: string;
  mapsUrl?: string;
  detail: {
    description: string;
    parking?: string;
    publicTransport?: string;
    accessibility?: string;
  };
}

// Static data from src/data/clinicServices.ts
const clinics: StaticClinic[] = [
  {
    id: "majorstuen",
    slug: "majorstuen",
    label: "Oslo Majorstuen",
    address: "Kirkeveien 64B, 0366 Oslo",
    phone: "22 60 00 50",
    hours: "Man–Fre 08:00–16:00",
    bookingSystem: "metodika",
    mapsUrl: "https://maps.google.com/?q=Kirkeveien+64B+0366+Oslo",
    services: [
      "fertilitet", "fostermedisiner", "gynekolog", "ernaringsfysiolog",
      "psykolog", "sexolog", "gastrokirurg", "ortoped", "handterapeut",
      "revmatolog", "urolog", "hudlege", "areknuter", "sprengte-blodkar",
      "fysioterapeut", "uroterapi",
    ],
    detail: {
      description: "CMedical Majorstuen er vår hovedklinikk i Oslo, sentralt plassert i Kirkeveien 64B. Her tilbyr vi det bredeste spekteret av spesialisthelsetjenester, fra gynekologi og fertilitet til ortopedi og urologi. Klinikken er moderne innredet med pasientkomfort i fokus.",
      parking: "Gateparkering tilgjengelig i nærområdet. Nærmeste parkeringshus er Colosseum Park (5 min gange).",
      publicTransport: "Majorstuen T-banestasjon (alle linjer) – 3 minutters gange. Trikk 11, 12 og 19 stopper rett utenfor.",
      accessibility: "Universelt utformet med heis og trinnfri adkomst.",
    },
  },
  {
    id: "bekkestua",
    slug: "bekkestua",
    label: "Bekkestua",
    address: "Gamle Ringeriksvei 36, 1357 Bekkestua",
    phone: "22 60 00 50",
    hours: "Man–Fre 08:00–16:00",
    bookingSystem: "metodika",
    mapsUrl: "https://maps.google.com/?q=Gamle+Ringeriksvei+36+1357+Bekkestua",
    services: ["gynekolog", "hudlege"],
    detail: {
      description: "CMedical Bekkestua ligger sentralt på Bekkestua i Bærum. Klinikken tilbyr gynekologi og hudlege i moderne og rolige omgivelser.",
      parking: "Gratis parkering tilgjengelig rett utenfor klinikken.",
      publicTransport: "Bekkestua stasjon (Kolsåsbanen) – 2 minutters gange.",
      accessibility: "Trinnfri adkomst til klinikken.",
    },
  },
  {
    id: "ski",
    slug: "ski",
    label: "Ski",
    address: "Ski",
    phone: "22 60 00 50",
    hours: "Man–Fre 08:00–16:00",
    bookingSystem: "metodika",
    mapsUrl: "https://maps.google.com/?q=Ski+Norway",
    services: ["gynekolog"],
    detail: {
      description: "CMedical Ski tilbyr gynekologiske tjenester i Ski sentrum, sør for Oslo. Et praktisk tilbud for pasienter i Follo-regionen.",
      parking: "Parkering tilgjengelig i nærheten.",
      publicTransport: "Ski stasjon (tog fra Oslo S) – kort gangavstand.",
      accessibility: "Tilrettelagt for rullestolbrukere.",
    },
  },
  {
    id: "moss",
    slug: "moss",
    label: "Moss",
    address: "Lilleengveien 8, 1523 Moss",
    phone: "69 25 40 00",
    hours: "Man–Fre 08:00–15:30",
    bookingSystem: "external",
    externalBookingUrl: "https://colosseumfaust.no/spesialister/",
    mapsUrl: "https://maps.google.com/?q=Lilleengveien+8+1523+Moss",
    services: ["gynekolog", "ortoped", "gastrokirurg", "fysioterapeut", "plastikkirurgi"],
    detail: {
      description: "CMedical Moss holder til i Lilleengveien 8 og tilbyr et bredt spekter av tjenester inkludert gynekologi, ortopedi, gastrokirurgi og fysioterapi.",
      parking: "Gratis parkering rett utenfor klinikken.",
      publicTransport: "Moss stasjon (tog fra Oslo S) – ca. 10 minutters gange eller kort busstur.",
      accessibility: "Universelt utformet med trinnfri adkomst.",
    },
  },
  {
    id: "moelv",
    slug: "moelv",
    label: "Moelv",
    address: "Storgata 60, 2390 Moelv",
    phone: "23 60 00 50",
    hours: "Man–Fre 08:30–15:30",
    bookingSystem: "pasientsky",
    mapsUrl: "https://maps.google.com/?q=Storgata+60+2390+Moelv",
    services: ["gynekolog", "ortoped", "urolog", "areknuter", "karkirurgi", "hjertespesialist", "almennlege"],
    detail: {
      description: "CMedical Moelv ligger i Storgata 60 og er vår klinikk i Innlandet. Her tilbyr vi gynekologi, ortopedi, urologi, karkirurgi og allmennmedisin.",
      parking: "Gratis parkering rett utenfor klinikken.",
      publicTransport: "Moelv stasjon (tog fra Oslo S via Hamar) – 5 minutters gange.",
      accessibility: "Trinnfri adkomst til alle behandlingsrom.",
    },
  },
];

// FAQ data per clinic
const clinicFaqs: Record<string, { question: string; answer: string }[]> = {
  majorstuen: [
    { question: "Trenger jeg henvisning?", answer: "For de fleste konsultasjoner trenger du ikke henvisning. Dersom du ønsker å bruke forsikring eller offentlig refusjon, kan det være krav om henvisning fra fastlege." },
    { question: "Kan jeg bruke helseforsikring?", answer: "Ja, vi samarbeider med de fleste forsikringsselskap. Ta kontakt med ditt forsikringsselskap i forkant for å avklare dekning." },
    { question: "Hvor lang tid tar en konsultasjon?", answer: "En standardkonsultasjon varer normalt 30–45 minutter, avhengig av type undersøkelse." },
    { question: "Er det ventetid for time?", answer: "Vi tilstreber kort ventetid. De fleste får time innen 1–2 uker." },
  ],
  bekkestua: [
    { question: "Trenger jeg henvisning?", answer: "For de fleste konsultasjoner trenger du ikke henvisning. Sjekk med ditt forsikringsselskap dersom du ønsker forsikringsdekning." },
    { question: "Hvilke tjenester tilbys på Bekkestua?", answer: "Vi tilbyr gynekologi og hudlege ved vår klinikk på Bekkestua." },
    { question: "Er det parkering?", answer: "Ja, det er gratis parkering rett utenfor klinikken." },
  ],
  ski: [
    { question: "Hvilke tjenester tilbys i Ski?", answer: "Vi tilbyr gynekologiske tjenester ved vår klinikk i Ski." },
    { question: "Trenger jeg henvisning?", answer: "For de fleste konsultasjoner trenger du ikke henvisning." },
  ],
  moss: [
    { question: "Hvordan bestiller jeg time i Moss?", answer: "Timebestilling gjøres via Colosseum Faust sitt bookingsystem." },
    { question: "Trenger jeg henvisning?", answer: "For de fleste konsultasjoner trenger du ikke henvisning. Sjekk med forsikringsselskapet dersom relevant." },
    { question: "Er det parkering?", answer: "Ja, det er gratis parkering rett utenfor klinikken." },
  ],
  moelv: [
    { question: "Trenger jeg henvisning?", answer: "For de fleste konsultasjoner trenger du ikke henvisning." },
    { question: "Hvilke tjenester tilbys i Moelv?", answer: "Vi tilbyr gynekologi, ortopedi, urologi, karkirurgi og allmennmedisin." },
    { question: "Er det parkering?", answer: "Ja, det er gratis parkering rett utenfor klinikken." },
  ],
};

function mapBookingMethod(system: string): string {
  switch (system) {
    case "metodika": return "info";
    case "pasientsky": return "pasientsky";
    case "external": return "info";
    default: return "info";
  }
}

async function migrate() {
  console.log("🏥 Migrating clinics to Sanity...\n");

  const transaction = sanityClient.transaction();

  for (const clinic of clinics) {
    const docId = `clinicPage-${clinic.slug}`;
    const faqs = clinicFaqs[clinic.slug] || [];

    const doc: Record<string, any> = {
      _id: docId,
      _type: "clinicPage",
      title: clinic.label,
      slug: { _type: "slug", current: clinic.slug },
      description: clinic.detail.description,
      address: clinic.address,
      phone: clinic.phone,
      hours: clinic.hours,
      services: clinic.services,
      detail: {
        parking: clinic.detail.parking || undefined,
        publicTransport: clinic.detail.publicTransport || undefined,
        accessibility: clinic.detail.accessibility || undefined,
      },
      booking: {
        method: mapBookingMethod(clinic.bookingSystem),
        externalBookingUrl: clinic.externalBookingUrl || undefined,
      },
      faqs: faqs.map((faq, i) => ({
        _key: `faq-${clinic.slug}-${i}`,
        question: faq.question,
        answer: faq.answer,
      })),
      seo: {
        metaTitle: `CMedical ${clinic.label} – Klinikk`,
        metaDescription: `Besøk CMedical ${clinic.label}. ${clinic.address}. Åpningstider, tjenester og kontaktinformasjon.`,
      },
    };

    transaction.createOrReplace(doc);
    console.log(`  ✅ ${clinic.label} (${docId})`);
  }

  await transaction.commit();
  console.log(`\n✨ Successfully migrated ${clinics.length} clinics to Sanity.`);
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err.message);
  process.exit(1);
});
