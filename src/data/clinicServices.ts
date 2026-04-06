// Extended clinic data with detail page content
// Source: Fagområder per klinikk documentation

export type BookingSystem = 'metodika' | 'pasientsky' | 'external';

export interface ClinicDetail {
  description: string;
  parking?: string;
  publicTransport?: string;
  accessibility?: string;
  images?: string[]; // placeholder for future clinic images
}

export interface Clinic {
  id: string;
  slug: string;
  label: string;
  address: string;
  phone: string;
  hours: string;
  services: string[]; // Category IDs that this clinic offers
  bookingSystem: BookingSystem;
  externalBookingUrl?: string;
  mapsUrl?: string;
  detail: ClinicDetail;
}

export const clinics: Clinic[] = [
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

// Helper function to get clinics that offer a specific service category
export const getClinicsForService = (serviceCategoryId: string): Clinic[] => {
  return clinics.filter(clinic => clinic.services.includes(serviceCategoryId));
};

// Helper function to check if a clinic offers a service
export const clinicOffersService = (clinicId: string, serviceCategoryId: string): boolean => {
  const clinic = clinics.find(c => c.id === clinicId);
  return clinic ? clinic.services.includes(serviceCategoryId) : false;
};

// Helper to find clinic by slug
export const getClinicBySlug = (slug: string): Clinic | undefined => {
  return clinics.find(c => c.slug === slug);
};
