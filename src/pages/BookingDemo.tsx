import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, X, Calendar, MapPin, Clock, Check, ChevronDown, ChevronRight, ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { specialists, Specialist } from "@/data/specialists";
import { format, addDays } from "date-fns";
import { nb } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import { clinics, getClinicsForService, Clinic } from "@/data/clinicServices";

// Booking services data based on CMedical's actual structure
const bookingServices = [
  {
    id: "fertilitet",
    label: "Fertilitet",
    services: [
      { name: "Enkel sædanalyse", price: "1950", duration: "30 minutter" },
      { name: "Fertilitetsutredning enkeltperson/single", price: "2850", duration: "1 time" },
      { name: "Fertilitetsutredning par", price: "2850", duration: "1 time" },
      { name: "Infertilitet Mann (inkl. sædprøve)", price: "2850", duration: "45 minutter" },
      { name: "Samtaleterapi under fertilitetsbehandling", price: "1000", duration: "1 time" },
      { name: "Telefonkonsultasjon fertilitet", price: "2850", duration: "45 minutter" },
      { name: "Uforpliktende telefonsamtale om fertilitet med sykepleier", price: "0", duration: "20 minutter" },
    ]
  },
  {
    id: "fostermedisiner",
    label: "Fostermedisiner - graviditet",
    services: [
      { name: "Organrettet ultralyd (En mer avansert ultralyd)", price: "2100", duration: "30 minutter" },
      { name: "Organrettet ultralyd + NIPT test (uke 12-14)", price: "9950", duration: "30 minutter" },
      { name: "Svangerskapskontroll", price: "2100", duration: "30 minutter" },
      { name: "Tidlig ultralyd + NIPT-test", price: "8990", duration: "30 minutter" },
      { name: "Tidlig ultralyd", price: "2100", duration: "30 minutter" },
    ]
  },
  {
    id: "gynekolog",
    label: "Gynekolog",
    services: [
      { name: "Blødningsforstyrrelser / muskelknuter / polypper / hormonelt", price: "3200", duration: "45 minutter" },
      { name: "Endometriose / adenomyose", price: "3200", duration: "45 minutter" },
      { name: "Fremfall / tyngdefølelse underliv / fødselsskader", price: "2100", duration: "30 minutter" },
      { name: "Generell undersøkelse", price: "2100", duration: "30 minutter" },
      { name: "Kontroll etter fødsel", price: "2100", duration: "30 minutter" },
      { name: "Overgangsalder", price: "3200", duration: "45 minutter" },
      { name: "PCOS / Hormonforstyrrelser", price: "3200", duration: "45 minutter" },
      { name: "Smerter i underlivet / Vulvodyni / Vaginisme", price: "3200", duration: "45 minutter" },
      { name: "Tidlig ultralyd enkel", price: "2100", duration: "30 minutter" },
      { name: "Urinlekkasje", price: "2100", duration: "30 minutter" },
      { name: "Ammehjelp ved brystbetennelsesproblematikk", price: "3200", duration: "45 minutter" },
      { name: "Digitaltime Gynekolog", price: "2100", duration: "20 minutter" },
      { name: "Hudlidelser vulva", price: "2100", duration: "30 minutter" },
      { name: "Kontroll / oppfølging", price: "2100", duration: "30 minutter" },
      { name: "Premenstruelle plager (PMS / PMDD)", price: "3200", duration: "45 minutter" },
      { name: "Svangerskapsoppfølging", price: "2100", duration: "30 minutter" },
    ]
  },
  {
    id: "fysioterapeut",
    label: "Fysioterapeut / Osteopat",
    services: [
      { name: "Oppfølgingstime Fysioterapeut / Osteopat", price: "1800", duration: "1 time" },
      { name: "Oppfølgingstime hos Fysioterapeut/Osteopat", price: "950", duration: "30 minutter" },
    ]
  },
  {
    id: "ernaringsfysiolog",
    label: "Klinisk Ernæringsfysiolog",
    services: [
      { name: "Klinisk ernæringsfysiolog", price: "1990", duration: "1 time" },
      { name: "Klinisk ernæringsfysiolog oppfølging 45 min", price: "1490", duration: "45 minutter" },
    ]
  },
  {
    id: "psykolog",
    label: "Psykolog",
    services: [
      { name: "Psykolog 50 min", price: "1900", duration: "1 time" },
      { name: "Psykolog 50 min, digitaltime", price: "1900", duration: "1 time" },
      { name: "Psykolog 80 min", price: "2500", duration: "1 time 30 minutter" },
      { name: "Psykolog 80 min, digitaltime", price: "2500", duration: "1 time 30 minutter" },
      { name: "Psykolog partime 50 min", price: "2300", duration: "1 time" },
      { name: "Psykolog partime 80 min", price: "2950", duration: "1 time 30 minutter" },
    ]
  },
  {
    id: "sexolog",
    label: "Sexolog",
    services: [
      { name: "Sexolog for par", price: "1600", duration: "1 time" },
      { name: "Sexolog", price: "1600", duration: "1 time" },
    ]
  },
  {
    id: "endokrinolog",
    label: "Endokrinolog",
    services: [
      { name: "Endokrinolog 60 min konsultasjon", price: "4500", duration: "1 time" },
      { name: "Endokrinolog oppfølging/kontroll 30 min", price: "2900", duration: "30 minutter" },
    ]
  },
  {
    id: "gastrokirurg",
    label: "Gastrokirurg",
    services: [
      { name: "Digital konsultasjon fedme vurdering for robotkirurgi", price: "0", duration: "45 minutter" },
      { name: "Endetarmsplager", price: "2100", duration: "30 minutter" },
      { name: "Mage / tarm spesialist", price: "2100", duration: "30 minutter" },
    ]
  },
  {
    id: "handterapeut",
    label: "Håndterapeut",
    services: [
      { name: "Konsultasjon håndterapeut", price: "1400", duration: "45 minutter" },
    ]
  },
  {
    id: "ortoped",
    label: "Ortoped",
    services: [
      { name: "Konsultasjon ortoped albue", price: "1800", duration: "30 minutter" },
      { name: "Konsultasjon ortoped fot/ankel", price: "1800", duration: "30 minutter" },
      { name: "Konsultasjon ortoped hofte", price: "1800", duration: "30 minutter" },
      { name: "Konsultasjon ortoped hånd", price: "1800", duration: "30 minutter" },
      { name: "Konsultasjon ortoped kne", price: "1800", duration: "30 minutter" },
      { name: "Konsultasjon ortoped skulder", price: "1800", duration: "30 minutter" },
    ]
  },
  {
    id: "revmatolog",
    label: "Revmatolog",
    services: [
      { name: "Førstegangskonsultasjon revmatolog", price: "3150", duration: "45 minutter" },
    ]
  },
  {
    id: "sprengte-blodkar",
    label: "Sprengte blodkar",
    services: [
      { name: "Kosmetisk behandling av sprengte blodkar 60 min", price: "2500", duration: "1 time" },
    ]
  },
  {
    id: "areknuter",
    label: "Åreknuter",
    services: [
      { name: "Vurdering åreknuter", price: "1800", duration: "30 minutter" },
    ]
  },
  {
    id: "urolog",
    label: "Urolog",
    services: [
      { name: "Konsultasjon urolog", price: "1900", duration: "30 minutter" },
      { name: "Blod i urin, cystoskopi", price: "2650", duration: "30 minutter" },
      { name: "Prostataundersøkelse", price: "1900", duration: "30 minutter" },
      { name: "Sterilisering Mann", price: "6500", duration: "30 minutter" },
      { name: "Uforpliktende samtale på telefon om prostata med uroterapeut", price: "0", duration: "15 minutter" },
    ]
  },
];

// Generate mock available times for a date
const generateTimeSlots = (date: Date, specialistList: Specialist[]) => {
  const baseSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"];
  const dayOfWeek = date.getDay();
  
  if (dayOfWeek === 0 || dayOfWeek === 6) return [];
  
  const slots = baseSlots.slice(0, 6 + Math.floor(Math.random() * 6)).map(time => ({
    time,
    specialist: specialistList[Math.floor(Math.random() * specialistList.length)]
  }));
  
  return slots;
};

interface BookingData {
  category?: string;
  categoryId?: string;
  service?: { name: string; price: string; duration: string };
  clinic?: Clinic;
  specialistChosen?: boolean; // true once user has passed the specialist step
  date?: Date;
  time?: string;
  specialist?: Specialist;
}

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthNumber: string;
  acceptTerms: boolean;
  acceptMarketing: boolean;
  acceptDataProcessing: boolean;
}

const BookingDemo = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedSpecialistInfo, setSelectedSpecialistInfo] = useState<Specialist | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    birthNumber: "",
    acceptTerms: true,
    acceptMarketing: false,
    acceptDataProcessing: true,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentStep = useMemo(() => 
    !bookingData.service ? 1 : !bookingData.clinic ? 2 : !bookingData.specialistChosen ? 3 : !bookingData.time ? 4 : 5
  , [bookingData.service, bookingData.clinic, bookingData.specialistChosen, bookingData.time]);
  const totalSteps = 5;

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Pre-expand category from URL param (e.g., /booking?kategori=gynekolog)
  useEffect(() => {
    const kategori = searchParams.get('kategori');
    if (kategori && !bookingData.service) {
      // Map category page IDs to booking service IDs
      const categoryToBookingMap: Record<string, string> = {
        gynekologi: 'gynekolog',
        urologi: 'urolog',
        fertilitet: 'fertilitet',
        ortopedi: 'ortoped',
        'flere-fagomrader': 'flere',
      };
      const bookingCategoryId = categoryToBookingMap[kategori] || kategori;
      const matchingCategory = bookingServices.find(c => c.id === bookingCategoryId);
      if (matchingCategory) {
        setExpandedCategory(matchingCategory.id);
      }
    }
  }, [searchParams]);

  const filteredSpecialists = specialists.slice(0, 8);

  const availableSlots = selectedDate && filteredSpecialists.length > 0
    ? generateTimeSlots(selectedDate, filteredSpecialists)
    : [];

  const handleClose = () => navigate("/");

  const handleSelectService = (categoryId: string, categoryLabel: string, service: { name: string; price: string; duration: string }) => {
    const clinicsForService = getClinicsForService(categoryId);
    
    if (clinicsForService.length === 1) {
      setBookingData({ 
        categoryId,
        category: categoryLabel, 
        service,
        clinic: clinicsForService[0],
        specialistChosen: false,
        date: undefined,
        time: undefined,
        specialist: undefined
      });
    } else {
      setBookingData({ 
        categoryId,
        category: categoryLabel, 
        service,
        clinic: undefined,
        specialistChosen: false,
        date: undefined,
        time: undefined,
        specialist: undefined
      });
    }
  };

  // Get available clinics based on selected service category
  const availableClinics = bookingData.categoryId 
    ? getClinicsForService(bookingData.categoryId) 
    : clinics;

  const handleSelectClinic = (clinic: Clinic) => {
    setBookingData({ ...bookingData, clinic, specialistChosen: false, date: undefined, time: undefined, specialist: undefined });
  };

  const handleSelectTimeSlot = (time: string, specialist: Specialist) => {
    setBookingData({ ...bookingData, date: selectedDate, time, specialist });
  };

  const handleSubmit = () => {
    if (formData.acceptTerms && formData.acceptDataProcessing && formData.firstName && formData.lastName && formData.phone && formData.birthNumber) {
      setIsSubmitted(true);
    }
  };

  const resetStep = (step: 'category' | 'clinic' | 'specialist' | 'time') => {
    if (step === 'category') {
      setBookingData({});
      setExpandedCategory(null);
    } else if (step === 'clinic') {
      setBookingData({ ...bookingData, clinic: undefined, specialistChosen: false, date: undefined, time: undefined, specialist: undefined });
    } else if (step === 'specialist') {
      setBookingData({ ...bookingData, specialistChosen: false, specialist: undefined, date: undefined, time: undefined });
    } else if (step === 'time') {
      setBookingData({ ...bookingData, date: undefined, time: undefined, specialist: bookingData.specialist });
    }
  };

  // Confirmation screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f5f4f0] flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-background" />
          </div>
          
          <h1 className="text-3xl font-light text-foreground mb-2">
            Bestilling bekreftet
          </h1>
          <p className="text-muted-foreground mb-8 font-light">
            Du vil motta en bekreftelse på SMS{formData.email ? " og e-post" : ""}.
          </p>
          
          <div className="bg-white rounded-lg p-6 text-left mb-6">
            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Behandling</span>
                <span className="font-medium">{bookingData.service?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Klinikk</span>
                <span className="font-medium">CMedical – {bookingData.clinic?.label}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Adresse</span>
                <span className="font-medium">{bookingData.clinic?.address}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">Dato og tid</span>
                <span className="font-medium">{bookingData.date && format(bookingData.date, "d. MMM yyyy", { locale: nb })} kl. {bookingData.time}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Behandler</span>
                <span className="font-medium">{bookingData.specialist?.name}</span>
              </div>
            </div>
          </div>
          
          <Button
            onClick={() => navigate("/")} 
            className="bg-foreground text-background hover:bg-foreground/90 px-8 py-3 rounded-lg font-normal"
          >
            Tilbake til forsiden
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f4f0]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-foreground">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={handleClose} 
            className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Lukk bestilling og gå til forsiden"
          >
            <X className="w-5 h-5 text-background" aria-hidden="true" />
          </button>
          <h1 className="text-sm tracking-wide text-background/90 uppercase">Bestill time</h1>
          <div className="w-9" aria-hidden="true" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Step Indicator - Clickable */}
        <div className="flex items-center justify-center mb-8">
          {[1, 2, 3, 4, 5].map((step) => {
            const canNavigate = currentStep > step;
            return (
              <div key={step} className="flex items-center">
                <button
                  onClick={() => {
                    if (canNavigate) {
                      if (step === 1) resetStep('category');
                      else if (step === 2) resetStep('clinic');
                      else if (step === 3) resetStep('specialist');
                      else if (step === 4) resetStep('time');
                    }
                  }}
                  disabled={!canNavigate && currentStep !== step}
                  className={cn(
                    "w-8 h-8 rounded-sm flex items-center justify-center text-xs font-medium transition-all duration-300 border-2",
                    currentStep === step 
                      ? "bg-foreground text-background border-foreground" 
                      : currentStep > step
                        ? "bg-foreground/20 text-foreground border-foreground/20 hover:bg-foreground/30 cursor-pointer"
                        : "bg-muted/50 text-muted-foreground/50 border-muted/50 cursor-not-allowed"
                  )}
                >
                  {currentStep > step ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step
                  )}
                </button>
                {step < 5 && (
                  <div 
                    className={cn(
                      "w-8 h-[2px] transition-colors duration-300",
                      currentStep > step 
                        ? "bg-foreground/30" 
                        : "bg-muted/40"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>
        {/* Persistent Summary Banner */}
        {bookingData.service && (
          <div className="bg-white rounded-lg p-4 mb-6 text-sm">
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              {bookingData.service && (
                <div>
                  <span className="text-muted-foreground text-xs">Tjeneste: </span>
                  <span className="font-normal">{bookingData.service.name}</span>
                </div>
              )}
              {bookingData.clinic && (
                <div>
                  <span className="text-muted-foreground text-xs">Klinikk: </span>
                  <span className="font-normal">{bookingData.clinic.label}</span>
                </div>
              )}
              {bookingData.specialist && (
                <div>
                  <span className="text-muted-foreground text-xs">Behandler: </span>
                  <span className="font-normal">{bookingData.specialist.name}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Select Service */}
          {!bookingData.service ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-light text-foreground text-center mb-6">
                Velg tjeneste
              </h2>
              
              <div className="space-y-3">
                {[...bookingServices].sort((a, b) => a.label.localeCompare(b.label, 'nb')).map((category) => {
                  const availableClinicsForCategory = getClinicsForService(category.id);
                  
                  return (
                  <div key={category.id} className="rounded-lg overflow-hidden">
                    {/* Category Header */}
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 bg-white rounded-lg transition-all",
                        expandedCategory === category.id && "rounded-b-none"
                      )}
                    >
                      <span className="font-normal text-foreground">{category.label}</span>
                      
                      {/* Clinic availability badges - inline */}
                      <div className="flex items-center gap-3 ml-auto mr-4">
                        <div className="flex items-center gap-1.5">
                          {availableClinicsForCategory.length === clinics.length ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-beige text-foreground/70 font-light">
                              Alle klinikker
                            </span>
                          ) : availableClinicsForCategory.length > 0 ? (
                            availableClinicsForCategory.map((clinic) => {
                              const clinicName = clinic.id === 'majorstuen' ? 'Majorstuen' 
                                : clinic.id === 'bekkestua' ? 'Bekkestua' 
                                : clinic.id === 'moss' ? 'Moss' 
                                : 'Moelv';
                              
                              return (
                                <span
                                  key={clinic.id}
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-brand-beige text-foreground/70 font-light"
                                >
                                  {clinicName}
                                </span>
                              );
                            })
                          ) : null}
                        </div>
                        <ChevronDown 
                          className={cn(
                            "w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0",
                            expandedCategory === category.id && "rotate-180"
                          )} 
                        />
                      </div>
                    </button>
                    
                    {/* Services List */}
                    <AnimatePresence>
                      {expandedCategory === category.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden bg-white border-t border-border/10"
                        >
                          <div className="p-3 space-y-2">
                            {category.services.map((service, index) => (
                              <button
                                key={index}
                                onClick={() => handleSelectService(category.id, category.label, service)}
                                className="w-full flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors text-left group"
                              >
                                <div className="flex-1 pr-4">
                                  <span className="text-foreground block font-normal">
                                    {service.name}
                                  </span>
                                  <div className="flex items-center gap-3 mt-1">
                                    <span className="text-sm text-foreground/70">
                                      {service.price !== "0" ? `fra kr ${service.price},-` : "Gratis"}
                                    </span>
                                    <span className="text-muted-foreground/40">·</span>
                                    <span className="text-sm text-muted-foreground">
                                      {service.duration}
                                    </span>
                                  </div>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center flex-shrink-0">
                                  <ArrowRight className="w-4 h-4 text-background" />
                                </div>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  );
                })}
              </div>
            </motion.div>
          ) : !bookingData.clinic ? (
            /* Step 2: Select Clinic */
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <button 
                onClick={() => resetStep('category')} 
                className="flex items-center gap-1.5 text-sm text-foreground hover:text-foreground/70 transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="underline">Tilbake</span>
              </button>
              <h2 className="text-2xl font-light text-foreground mb-4">
                Velg klinikk
              </h2>
              
              {availableClinics.length === 0 ? (
                <div className="p-6 bg-white rounded-lg text-center">
                  <p className="text-muted-foreground">
                    Ingen klinikker tilbyr denne tjenesten for øyeblikket.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableClinics.map((clinic) => (
                    <button
                      key={clinic.id}
                      onClick={() => handleSelectClinic(clinic)}
                      className="w-full flex items-center gap-4 p-4 bg-white rounded-lg hover:bg-muted/30 transition-colors text-left group"
                    >
                      <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-normal text-foreground">{clinic.label}</p>
                        <p className="text-sm text-muted-foreground">{clinic.address}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              )}

            </motion.div>
          ) : !bookingData.specialistChosen ? (
            /* Step 3: Select Specialist (optional) */
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <button 
                onClick={() => resetStep('clinic')} 
                className="flex items-center gap-1.5 text-sm text-foreground hover:text-foreground/70 transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="underline">Tilbake</span>
              </button>
              <h2 className="text-2xl font-light text-foreground mb-2">
                Velg behandler
              </h2>
              <p className="text-sm text-muted-foreground font-light mb-4">
                Velg en behandler, eller gå videre for å se alle ledige tider.
              </p>

              {/* Skip / Any specialist */}
                <button
                  onClick={() => setBookingData({ ...bookingData, specialistChosen: true, specialist: undefined })}
                  className="w-full flex items-center gap-4 p-4 bg-white rounded-lg hover:bg-muted/30 transition-colors text-left group border-2 border-transparent hover:border-foreground/10"
                >
                  <div className="w-12 h-12 rounded-sm bg-muted/50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-foreground" />
                  </div>
                <div className="flex-1">
                  <p className="font-normal text-foreground">Første ledige</p>
                  <p className="text-sm text-muted-foreground">Vis alle ledige tider uavhengig av behandler</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredSpecialists.map((spec) => (
                  <div key={spec.name} className="relative">
                    <button
                      onClick={() => setBookingData({ ...bookingData, specialistChosen: true, specialist: spec })}
                      className="w-full flex flex-col items-center p-4 bg-white rounded-lg hover:bg-muted/30 hover:shadow-md transition-all text-center group"
                    >
                      <div className="w-14 h-14 rounded-sm overflow-hidden mb-2.5">
                        <img src={spec.image} alt={spec.name} className="w-full h-full object-cover object-top" />
                      </div>
                      <span className="text-sm font-normal text-foreground leading-tight">{spec.name}</span>
                      <span className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{spec.title}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSpecialistInfo(spec);
                      }}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors"
                      aria-label={`Les mer om ${spec.name}`}
                    >
                      <Info className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : !bookingData.time ? (
            /* Step 4: Select Date & Time */
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <button 
                onClick={() => resetStep('specialist')} 
                className="flex items-center gap-1.5 text-sm text-foreground hover:text-foreground/70 transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="underline">Tilbake</span>
              </button>
              <h2 className="text-2xl font-light text-foreground mb-4">
                Velg tid
                {bookingData.specialist && (
                  <span className="text-base text-muted-foreground font-light ml-2">
                    – {bookingData.specialist.name}
                  </span>
                )}
              </h2>
              
              {/* Calendar */}
              <div className="bg-white rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-foreground" />
                  <span className="font-normal">Velg dato</span>
                </div>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today || date.getDay() === 0 || date.getDay() === 6;
                  }}
                  fromDate={new Date()}
                  className="!w-full"
                  locale={nb}
                />
              </div>

              {/* Time Slots */}
              {selectedDate && (
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-foreground" />
                    <span className="font-normal capitalize">
                      {format(selectedDate, "EEEE d. MMMM", { locale: nb })}
                    </span>
                  </div>
                  
                  {availableSlots.length > 0 ? (
                    bookingData.specialist ? (
                      /* If specialist is pre-selected, show simple time list */
                      <div className="space-y-2">
                        {availableSlots.map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => handleSelectTimeSlot(slot.time, bookingData.specialist!)}
                            className="w-full flex items-center justify-between p-4 border border-border/30 rounded-lg hover:bg-muted/30 hover:border-foreground/30 transition-all text-left"
                          >
                            <span className="font-normal text-foreground">{slot.time}</span>
                            <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      /* If no specialist selected, show time + specialist in rows */
                      <div className="space-y-2">
                        {availableSlots.map((slot, index) => (
                          <div key={index} className="relative">
                            <button
                              onClick={() => handleSelectTimeSlot(slot.time, slot.specialist)}
                              className="w-full flex items-center gap-4 p-4 border border-border/30 rounded-lg hover:bg-muted/30 hover:border-foreground/30 transition-all text-left"
                            >
                              <div className="w-10 h-10 rounded-sm overflow-hidden flex-shrink-0">
                                <img src={slot.specialist.image} alt={slot.specialist.name} className="w-full h-full object-cover object-top" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-normal text-foreground block">{slot.specialist.name}</span>
                                <span className="text-xs text-muted-foreground">{slot.specialist.title}</span>
                              </div>
                              <span className="font-normal text-foreground text-lg">{slot.time}</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Ingen ledige timer denne dagen</p>
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          ) : (
            /* Step 5: Confirm & Personal Info */
            <motion.div
              key="step5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <button 
                onClick={() => resetStep('time')} 
                className="flex items-center gap-1.5 text-sm text-foreground hover:text-foreground/70 transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="underline">Tilbake</span>
              </button>
              <h2 className="text-2xl font-light text-foreground mb-4">
                Bekreft
              </h2>

              {/* Summary Card */}
              <div className="bg-white rounded-lg p-5">
                <h3 className="font-normal text-lg mb-4">Din bestilling</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Tjeneste</span>
                    <p className="font-normal mt-1">{bookingData.service?.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Pris</span>
                    <p className="font-normal mt-1">{bookingData.service?.price === "0" ? "Gratis" : `${bookingData.service?.price} kr`}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Klinikk</span>
                    <p className="font-normal mt-1">{bookingData.clinic?.label}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Varighet</span>
                    <p className="font-normal mt-1">{bookingData.service?.duration}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Dato</span>
                    <p className="font-normal mt-1 capitalize">{bookingData.date && format(bookingData.date, "EEEE d. MMMM", { locale: nb })}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Tid</span>
                    <p className="font-normal mt-1">{bookingData.time}</p>
                  </div>
                </div>
                {bookingData.specialist && (
                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border/20">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={bookingData.specialist.image} alt={bookingData.specialist.name} />
                      <AvatarFallback>{bookingData.specialist.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-normal">{bookingData.specialist.name}</p>
                      <p className="text-sm text-muted-foreground">{bookingData.specialist.title}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Personal Info Form */}
              <div className="bg-white rounded-lg p-5">
                <h3 className="font-normal text-lg mb-4">Dine opplysninger</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="firstName" className="text-sm text-muted-foreground">Fornavn *</label>
                      <Input
                        id="firstName"
                        name="given-name"
                        autoComplete="given-name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Fornavn"
                        className="mt-1.5 h-12 rounded-lg border-border/50"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="text-sm text-muted-foreground">Etternavn *</label>
                      <Input
                        id="lastName"
                        name="family-name"
                        autoComplete="family-name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Etternavn"
                        className="mt-1.5 h-12 rounded-lg border-border/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="birthNumber" className="text-sm text-muted-foreground">Fødselsnummer (11 siffer) *</label>
                    <Input
                      id="birthNumber"
                      name="birthNumber"
                      value={formData.birthNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 11);
                        setFormData({ ...formData, birthNumber: val });
                      }}
                      placeholder="DDMMÅÅXXXXX"
                      maxLength={11}
                      inputMode="numeric"
                      className="mt-1.5 h-12 rounded-lg border-border/50"
                    />
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      * Fødselsnummeret er påkrevd for sikker identifisering og journalføring i henhold til helsepersonelloven. Opplysningene behandles konfidensielt og deles ikke med tredjepart.
                    </p>
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-sm text-muted-foreground">Mobilnummer *</label>
                    <Input
                      id="phone"
                      name="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+47 XXX XX XXX"
                      type="tel"
                      inputMode="tel"
                      className="mt-1.5 h-12 rounded-lg border-border/50"
                    />
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      Bekreftelse og påminnelse sendes på SMS til dette nummeret.
                    </p>
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm text-muted-foreground">E-postadresse</label>
                    <Input
                      id="email"
                      name="email"
                      autoComplete="email"
                      value={formData.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="din@epost.no"
                      type="email"
                      className="mt-1.5 h-12 rounded-lg border-border/50"
                    />
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                      Valgfritt. Bekreftelse sendes også til e-post om oppgitt.
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-4 text-xs text-muted-foreground leading-relaxed space-y-2">
                    <p><strong className="text-foreground/70">Avbestillingsregler:</strong> Om- eller avbestilling må skje senest 24 timer før avtalt tidspunkt. Ved manglende oppmøte eller sen avbestilling vil det påløpe et gebyr.</p>
                    <p>«<a href="/vilkar" className="underline hover:text-foreground transition-colors">Vilkår</a>» – les vilkårene for bestilling og behandling hos CMedical.</p>
                  </div>
                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="terms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
                        className="mt-0.5"
                      />
                      <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                        Jeg godtar <a href="/vilkar" className="underline">vilkårene</a> for bestilling *
                      </label>
                    </div>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="dataProcessing"
                        checked={formData.acceptDataProcessing}
                        onCheckedChange={(checked) => setFormData({ ...formData, acceptDataProcessing: checked as boolean })}
                        className="mt-0.5"
                      />
                      <label htmlFor="dataProcessing" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                        Jeg samtykker til at CMedical kan behandle innsendt informasjon i henhold til <a href="/personvern" className="underline">personvernerklæringen</a> *
                      </label>
                    </div>
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="acceptInfo"
                        checked={formData.acceptMarketing}
                        onCheckedChange={(checked) => setFormData({ ...formData, acceptMarketing: checked as boolean })}
                        className="mt-0.5"
                      />
                      <label htmlFor="acceptInfo" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                        Jeg ønsker å motta informasjon og nyheter fra CMedical
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!formData.acceptTerms || !formData.acceptDataProcessing || !formData.firstName || !formData.lastName || !formData.phone || !formData.birthNumber || formData.birthNumber.length !== 11}
                className={cn(
                  "w-full h-14 rounded-lg text-base font-normal transition-all",
                  formData.acceptTerms && formData.acceptDataProcessing && formData.firstName && formData.lastName && formData.phone && formData.birthNumber && formData.birthNumber.length === 11
                    ? "bg-foreground text-background hover:bg-foreground/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                Bekreft bestilling
              </Button>

            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Specialist Info Dialog */}
      <Dialog open={!!selectedSpecialistInfo} onOpenChange={(open) => !open && setSelectedSpecialistInfo(null)}>
        <DialogContent className="sm:max-w-2xl bg-brand-beige border-none p-0 overflow-hidden">
          {selectedSpecialistInfo && (
            <div className="flex flex-col">
              {/* Header with image left, info right */}
              <div className="relative pt-8 pb-6 px-8">
                <div className="flex items-start gap-6">
                  {/* Image */}
                  <div className="flex-shrink-0">
                    <div className="h-28 w-28 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
                      <img 
                        src={selectedSpecialistInfo.image} 
                        alt={selectedSpecialistInfo.name} 
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  </div>
                  
                  {/* Name, title and badges */}
                  <div className="flex-1 pt-2">
                    <h3 className="text-2xl font-normal text-foreground tracking-tight">{selectedSpecialistInfo.name}</h3>
                    <p className="text-base text-muted-foreground mt-1 font-light">{selectedSpecialistInfo.title}</p>
                    
                    {/* Expertise badges */}
                    {selectedSpecialistInfo.expertise && selectedSpecialistInfo.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {selectedSpecialistInfo.expertise.map((exp, idx) => (
                          <span 
                            key={idx} 
                            className="px-3 py-1 text-sm font-light bg-white/60 text-foreground/80 rounded-full"
                          >
                            {exp}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Bio and details section */}
              <div className="px-8 pb-8 space-y-5">
                {/* Bio */}
                {selectedSpecialistInfo.bio && (
                  <div>
                    <p className="text-base text-muted-foreground font-light leading-relaxed">
                      {selectedSpecialistInfo.bio}
                    </p>
                  </div>
                )}
                
                {/* Info cards grid - 2x2 */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-foreground/10">
                  {selectedSpecialistInfo.languages && selectedSpecialistInfo.languages.length > 0 && (
                    <div className="bg-white/50 rounded-xl p-4">
                      <p className="text-xs uppercase tracking-wider text-foreground/60 mb-1.5">Språk</p>
                      <p className="text-sm text-foreground font-light">{selectedSpecialistInfo.languages.join(", ")}</p>
                    </div>
                  )}
                  {selectedSpecialistInfo.clinics && selectedSpecialistInfo.clinics.length > 0 && (
                    <div className="bg-white/50 rounded-xl p-4">
                      <p className="text-xs uppercase tracking-wider text-foreground/60 mb-1.5">Klinikk</p>
                      <p className="text-sm text-foreground font-light">{selectedSpecialistInfo.clinics.join(", ")}</p>
                    </div>
                  )}
                  {selectedSpecialistInfo.education && (
                    <div className="bg-white/50 rounded-xl p-4">
                      <p className="text-xs uppercase tracking-wider text-foreground/60 mb-1.5">Utdanning</p>
                      <p className="text-sm text-foreground font-light">{selectedSpecialistInfo.education}</p>
                    </div>
                  )}
                  {selectedSpecialistInfo.experience && (
                    <div className="bg-white/50 rounded-xl p-4">
                      <p className="text-xs uppercase tracking-wider text-foreground/60 mb-1.5">Erfaring</p>
                      <p className="text-sm text-foreground font-light">{selectedSpecialistInfo.experience}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingDemo;
