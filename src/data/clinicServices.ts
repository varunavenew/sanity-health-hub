// Clinic data with services mapping based on CMedical's actual clinic offerings
// Source: Fagområder per klinikk documentation

export type BookingSystem = 'metodika' | 'pasientsky' | 'external';

export interface Clinic {
  id: string;
  label: string;
  address: string;
  phone: string;
  hours: string;
  services: string[]; // Category IDs that this clinic offers
  bookingSystem: BookingSystem;
  externalBookingUrl?: string; // For external booking systems
  mapsUrl?: string; // Google Maps link
}

export const clinics: Clinic[] = [
  { 
    id: "majorstuen", 
    label: "Oslo Majorstuen", 
    address: "Kirkeveien 64B, 0366 Oslo",
    phone: "22 60 00 50",
    hours: "Man–Fre 08:00–16:00",
    bookingSystem: "metodika",
    mapsUrl: "https://maps.google.com/?q=Kirkeveien+64B+0366+Oslo",
    services: [
      "fertilitet",
      "fostermedisiner",
      "gynekolog",
      "ernaringsfysiolog",
      "psykolog",
      "sexolog",
      "gastrokirurg",
      "ortoped",
      "handterapeut",
      "revmatolog",
      "urolog",
      "hudlege",
      "areknuter",
      "sprengte-blodkar",
      "fysioterapeut", // Osteopati
      "uroterapi",
    ]
  },
  { 
    id: "bekkestua", 
    label: "Bekkestua", 
    address: "Gamle Ringeriksvei 36, 1357 Bekkestua",
    phone: "22 60 00 50",
    hours: "Man–Fre 08:00–16:00",
    bookingSystem: "metodika",
    mapsUrl: "https://maps.google.com/?q=Gamle+Ringeriksvei+36+1357+Bekkestua",
    services: [
      "gynekolog",
      "hudlege",
    ]
  },
  { 
    id: "ski", 
    label: "Ski", 
    address: "Ski",
    phone: "22 60 00 50",
    hours: "Man–Fre 08:00–16:00",
    bookingSystem: "metodika",
    mapsUrl: "https://maps.google.com/?q=Ski+Norway",
    services: [
      "gynekolog",
    ]
  },
  { 
    id: "moss", 
    label: "Moss", 
    address: "Lilleengveien 8, 1523 Moss",
    phone: "69 25 40 00",
    hours: "Man–Fre 08:00–15:30",
    bookingSystem: "external",
    externalBookingUrl: "https://colosseumfaust.no/spesialister/",
    mapsUrl: "https://maps.google.com/?q=Lilleengveien+8+1523+Moss",
    services: [
      "gynekolog",
      "ortoped",
      "gastrokirurg",
      "fysioterapeut",
      "plastikkirurgi",
    ]
  },
  { 
    id: "moelv", 
    label: "Moelv", 
    address: "Storgata 60, 2390 Moelv",
    phone: "23 60 00 50",
    hours: "Man–Fre 08:30–15:30",
    bookingSystem: "pasientsky",
    mapsUrl: "https://maps.google.com/?q=Storgata+60+2390+Moelv",
    services: [
      "gynekolog",
      "ortoped",
      "urolog",
      "areknuter",
      "karkirurgi",
      "hjertespesialist",
      "almennlege",
    ]
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