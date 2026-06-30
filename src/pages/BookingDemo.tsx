import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, X, Calendar, MapPin, Clock, Check, ChevronDown, ChevronLeft, ChevronRight, ArrowRight, Info, Phone, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpecialistsData, Specialist } from "@/hooks/useSpecialistsData";
import { format, addDays, addWeeks, eachDayOfInterval, endOfWeek, isSameDay, startOfWeek } from "date-fns";
import { nb } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import { clinics as staticClinics, getClinicsForService as staticGetClinicsForService, Clinic } from "@/data/clinicServices";
import { useClinics } from "@/hooks/useSanity";
import { categoryPageToBookingId, slugifyNo } from "@/lib/bookingLinks";
import { buildGoogleCalendarUrl, downloadICS, combineDateAndTime, parseDurationToMinutes } from "@/lib/calendarLinks";
import { FriendlyEmpty } from "@/components/booking/FriendlyEmpty";
import { useIsMobile } from "@/hooks/use-mobile";

// Booking services data based on CMedical's actual structure
const bookingServices = [
 {
 id: "fostermedisiner",
 label: "Graviditet - fostermedisiner",
 services: [
 { name: "Organrettet ultralyd (En mer avansert ultralyd)", price: "2100", duration: "30 minutter" },
 { name: "Organrettet ultralyd + NIPT test (uke 12-14)", price: "9950", duration: "30 minutter" },
 { name: "Svangerskapskontroll", price: "2100", duration: "30 minutter" },
 { name: "Tidlig ultralyd + NIPT-test", price: "8990", duration: "30 minutter" },
 { name: "Tidlig ultralyd", price: "2100", duration: "30 minutter" },
 ]
 },
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

// Deterministic mock availability — same inputs always produce the same slots,
// so a "fully booked" day stays visibly fully booked while the user navigates.
// Each specialist has their own weekly pattern (one weekday off, occasional full days).
const hashString = (s: string): number => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

const dateKey = (date: Date): string =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

// Per-specialist recurring busy weekday + occasional fully booked days.
const isSpecialistAvailable = (specialistId: string, date: Date): boolean => {
  const dow = date.getDay();
  if (dow === 0 || dow === 6) return false;
  const seed = hashString(specialistId);
  // Each specialist has one weekday off (1-5 = Mon-Fri).
  const dayOff = (seed % 5) + 1;
  if (dow === dayOff) return false;
  // Roughly 1 in 4 working days is "fully booked".
  const h = hashString(`${specialistId}:${dateKey(date)}`);
  if (h % 4 === 0) return false;
  return true;
};

const generateTimeSlots = (date: Date, specialistList: Specialist[]) => {
  const baseSlots = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30"];
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) return [];

  const availablePool = specialistList.filter((s) => isSpecialistAvailable(s.slug ?? s.name, date));
  if (availablePool.length === 0) return [];

  const key = dateKey(date);
  const slots: { time: string; specialist: Specialist }[] = [];
  baseSlots.forEach((time, i) => {
    const h = hashString(`${key}:${time}:${availablePool.map((s) => s.slug ?? s.name).join(",")}`);
    // ~70% of base slots are open on an available day.
    if (h % 10 < 7) {
      const spec = availablePool[h % availablePool.length];
      slots.push({ time, specialist: spec });
    }
  });
  return slots;
};


// Find first bookable weekday (skips weekends + days with no slots).
const getFirstAvailableDate = (fromDate: Date, specialistList: Specialist[]): Date => {
 const start = new Date(fromDate);
 start.setHours(0, 0, 0, 0);
 for (let i = 0; i < 60; i++) {
 const d = addDays(start, i);
 const dow = d.getDay();
 if (dow === 0 || dow === 6) continue;
 if (specialistList.length === 0) return d;
 if (generateTimeSlots(d, specialistList).length > 0) return d;
 }
 return addDays(start, 1);
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
 const isMobile = useIsMobile();
 const [searchParams] = useSearchParams();
 const { specialists } = useSpecialistsData();
 const { data: sanityClinics } = useClinics();
 const clinics: Clinic[] = (sanityClinics?.length ? sanityClinics : staticClinics) as Clinic[];
 const getClinicsForService = (serviceId: string) => clinics.filter(c => c.services?.includes(serviceId));
 const today = useMemo(() => {
 const date = new Date();
 date.setHours(0, 0, 0, 0);
 return date;
 }, []);
 const [viewMonth, setViewMonth] = useState<Date>(() => {
 const d = new Date();
 d.setDate(1);
 d.setHours(0, 0, 0, 0);
 return d;
 });
 const currentMonthStart = useMemo(() => {
 const d = new Date();
 d.setDate(1);
 d.setHours(0, 0, 0, 0);
 return d;
 }, []);
 const monthDays = useMemo(() => {
 const start = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
 const end = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0);
 return eachDayOfInterval({ start, end });
 }, [viewMonth]);
 const canGoPrev = viewMonth.getTime() > currentMonthStart.getTime();

 // Horisontal dato-stripe — kun ledige hverdager
 const VISIBLE_DAYS = 7;
 const [dateOffset, setDateOffset] = useState(0);
 const [dateDirection, setDateDirection] = useState<1 | -1>(1);
 const [bookingData, setBookingData] = useState<BookingData>({});
 const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
 const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
 // When user arrives with ?kategori=..., filter step 1 to that category only.
 // Cleared by "Vis alle tjenester" button so the user can change their mind.
 const [filterToCategoryId, setFilterToCategoryId] = useState<string | null>(null);
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
 const [externalClinic, setExternalClinic] = useState<Clinic | null>(null);

 const currentStep = useMemo(() => 
 !bookingData.service ? 1 : !bookingData.clinic ? 2 : !bookingData.specialistChosen ? 3 : !bookingData.time ? 4 : 5
 , [bookingData.service, bookingData.clinic, bookingData.specialistChosen, bookingData.time]);
 const totalSteps = 5;

 // Scroll to top when step changes
 useEffect(() => {
 window.scrollTo({ top: 0, behavior: 'smooth' });
 }, [currentStep]);

 // Prefill from URL params: ?kategori=gynekologi&tjeneste=endometriose&spesialist=slug&klinikk=majorstuen
 // Jumps to the first unfilled step so users coming from a specific
 // page never have to start over.
 useEffect(() => {
 if (bookingData.service || bookingData.clinic || bookingData.specialist) return;
 if (specialists.length === 0) return;

 const kategori = searchParams.get("kategori");
 const tjeneste = searchParams.get("tjeneste");
 const spesialistSlug = searchParams.get("spesialist");
 const klinikkId = searchParams.get("klinikk");

 if (!kategori && !tjeneste && !spesialistSlug && !klinikkId) return;

 // 1. Resolve category
 let resolvedCategoryId: string | undefined;
 let resolvedCategoryLabel: string | undefined;
 if (kategori) {
 const bookingCategoryId = categoryPageToBookingId[kategori] || kategori;
 const matchingCategory = bookingServices.find((c) => c.id === bookingCategoryId);
 if (matchingCategory) {
 resolvedCategoryId = matchingCategory.id;
 resolvedCategoryLabel = matchingCategory.label;
 setExpandedCategory(matchingCategory.id);
 setFilterToCategoryId(matchingCategory.id);
 }
 }

 // If specialist is given but no category, derive from the specialist's category
 let resolvedSpecialist: Specialist | undefined;
 if (spesialistSlug) {
 resolvedSpecialist = specialists.find((s) => s.slug === spesialistSlug);
 if (resolvedSpecialist && !resolvedCategoryId) {
 const specCatToBookingId: Record<string, string> = {
 gynekologi: "gynekolog",
 fertilitet: "fertilitet",
 urologi: "urolog",
 ortopedi: "ortoped",
 };
 const derivedId = specCatToBookingId[resolvedSpecialist.category];
 const derivedCat = derivedId ? bookingServices.find((c) => c.id === derivedId) : undefined;
 if (derivedCat) {
 resolvedCategoryId = derivedCat.id;
 resolvedCategoryLabel = derivedCat.label;
 setExpandedCategory(derivedCat.id);
 setFilterToCategoryId(derivedCat.id);
 }
 }
 }

 // 2. Resolve specific service within category (slug or fuzzy name match)
 let resolvedService: { name: string; price: string; duration: string } | undefined;
 if (tjeneste && resolvedCategoryId) {
 const cat = bookingServices.find((c) => c.id === resolvedCategoryId);
 const targetSlug = slugifyNo(tjeneste);
 resolvedService = cat?.services.find((s) => {
 const nameSlug = slugifyNo(s.name);
 return nameSlug === targetSlug || nameSlug.includes(targetSlug) || targetSlug.includes(nameSlug);
 });
 }

 // 3. Resolve clinic
 let resolvedClinic: Clinic | undefined;
 if (klinikkId) {
 resolvedClinic = clinics.find((c) => c.id === klinikkId);
 }
 // Auto-select clinic if a service is resolved and only one clinic offers it
 if (!resolvedClinic && resolvedCategoryId && resolvedService) {
 const clinicsForService = clinics.filter((c) => c.services?.includes(resolvedCategoryId!));
 if (clinicsForService.length === 1) {
 resolvedClinic = clinicsForService[0];
 }
 }

 // 4. Commit prefilled state — only if we have at least service/clinic/specialist
 if (resolvedService || resolvedClinic || resolvedSpecialist) {
 const next: BookingData = {};
 if (resolvedCategoryId) next.categoryId = resolvedCategoryId;
 if (resolvedCategoryLabel) next.category = resolvedCategoryLabel;
 if (resolvedService) next.service = resolvedService;
 if (resolvedClinic) next.clinic = resolvedClinic;
 if (resolvedSpecialist) {
 next.specialist = resolvedSpecialist;
 next.specialistChosen = true;
 }
 setBookingData(next);
 }
 // If only kategori was given, expandedCategory is already set above.
 }, [searchParams, specialists, clinics]);

 const filteredSpecialists = specialists.slice(0, 8);

 // Vis alle hverdager (også uten ledige tider) — dager uten slots blir disabled.
 const weekdayDates = useMemo(() => {
 const out: Date[] = [];
 for (let i = 0; i < 365; i++) {
 const d = addDays(today, i);
 const dow = d.getDay();
 if (dow === 0 || dow === 6) continue;
 out.push(d);
 }
 return out;
 }, [today]);

 // Hvilke av disse som faktisk har ledige tider for valgt spesialist (eller alle).
 const bookableDates = useMemo(() => {
 const pool = bookingData.specialist ? [bookingData.specialist] : filteredSpecialists;
 if (pool.length === 0) return [] as Date[];
 return weekdayDates.filter((d) => generateTimeSlots(d, pool).length > 0);
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [weekdayDates, bookingData.specialist, filteredSpecialists.length]);

 const canGoPrevRange = dateOffset > 0;
 const canGoNextRange = dateOffset + VISIBLE_DAYS < weekdayDates.length;


 // Auto-pick first bookable date when entering step 4 (or specialist/service changes)
 useEffect(() => {
 if (!bookingData.specialistChosen) return;
 if (bookableDates.length === 0) return;
 if (selectedDate) {
 const stillValid = bookableDates.some((d) => isSameDay(d, selectedDate));
 if (stillValid) return;
 }
 const next = bookableDates[0];
 setSelectedDate(next);
 const idx = 0;
 setDateOffset(Math.max(0, Math.min(idx, bookableDates.length - VISIBLE_DAYS)));
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [bookingData.specialistChosen, bookingData.specialist, bookingData.service, bookableDates]);

 const availableSlots = selectedDate && filteredSpecialists.length > 0
 ? generateTimeSlots(selectedDate, filteredSpecialists)
 : [];

 const handleClose = () => navigate("/");

 const handleSelectService = (categoryId: string, categoryLabel: string, service: { name: string; price: string; duration: string }) => {
 const clinicsForService = getClinicsForService(categoryId);
 
 if (clinicsForService.length === 1) {
 const onlyClinic = clinicsForService[0];
 if (onlyClinic.bookingSystem === 'external') {
 setBookingData({ categoryId, category: categoryLabel, service });
 setExternalClinic(onlyClinic);
 return;
 }
 setBookingData({ 
 categoryId,
 category: categoryLabel, 
 service,
 clinic: onlyClinic,
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
 if (clinic.bookingSystem === 'external') {
 setExternalClinic(clinic);
 return;
 }
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
    const startDateTime = bookingData.date && bookingData.time
      ? combineDateAndTime(bookingData.date, bookingData.time)
      : null;
    const duration = parseDurationToMinutes(bookingData.service?.duration);
    const eventTitle = `${bookingData.service?.name ?? "Time"} – CMedical`;
    const eventLocation = bookingData.clinic
      ? `CMedical ${bookingData.clinic.label}, ${bookingData.clinic.address}`
      : "CMedical";
    const eventDescription = [
      `Behandling: ${bookingData.service?.name ?? ""}`,
      bookingData.specialist?.name ? `Behandler: ${bookingData.specialist.name}` : "",
      bookingData.clinic?.phone ? `Telefon: +47 ${bookingData.clinic.phone}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const calendarInput = startDateTime
      ? {
          title: eventTitle,
          description: eventDescription,
          location: eventLocation,
          start: startDateTime,
          durationMinutes: duration,
        }
      : null;
    const gcalUrl = calendarInput ? buildGoogleCalendarUrl(calendarInput) : "#";

    // Desktop: keep the original simple confirmation layout (pre-mobile redesign).
    if (!isMobile) {
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

            {calendarInput && (
              <div className="flex flex-col sm:flex-row gap-2 mb-4">
                <a
                  href={gcalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-white text-foreground text-sm font-light border border-border hover:border-foreground/40 transition-colors flex-1"
                >
                  Legg i Google Kalender
                </a>
                <button
                  type="button"
                  onClick={() => downloadICS(calendarInput)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-white text-foreground text-sm font-light border border-border hover:border-foreground/40 transition-colors flex-1"
                >
                  Last ned .ics (Apple/Outlook)
                </button>
              </div>
            )}

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

    // Mobile: redesigned confirmation per customer feedback.
    return (
      <div className="min-h-screen bg-[#f5f4f0] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="max-w-xl w-full"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 18 }}
              className="w-16 h-16 rounded-full bg-brand-dark flex items-center justify-center mx-auto mb-5 shadow-sm"
            >
              <Check className="w-8 h-8 text-brand-warm" strokeWidth={2.5} />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-light text-brand-dark mb-2">
              Timen din er bekreftet
            </h1>
            <p className="text-brand-dark/60 font-light">
              Vi sender bekreftelse på SMS{formData.email ? " og e-post" : ""}.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-brand-dark/5 mb-5">
            <div className="flex items-start gap-4 pb-5 mb-5 border-b border-brand-dark/10">
              {bookingData.specialist?.image && (
                <img
                  src={bookingData.specialist.image}
                  alt={bookingData.specialist.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-brand-beige flex-shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="text-xs uppercase text-brand-dark/50 font-medium mb-1">Behandling</p>
                <p className="text-lg font-medium text-brand-dark leading-snug">
                  {bookingData.service?.name}
                </p>
                {bookingData.specialist?.name && (
                  <p className="text-sm text-brand-dark/70 font-light mt-1">
                    hos {bookingData.specialist.name}
                  </p>
                )}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-brand-dark/50 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-xs uppercase text-brand-dark/50 font-medium mb-1">Dato</p>
                  <p className="text-sm text-brand-dark font-light capitalize">
                    {bookingData.date && format(bookingData.date, "EEEE d. MMMM yyyy", { locale: nb })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-dark/50 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-xs uppercase text-brand-dark/50 font-medium mb-1">Tid</p>
                  <p className="text-sm text-brand-dark font-light">
                    kl. {bookingData.time}
                    {bookingData.service?.duration && (
                      <span className="text-brand-dark/60"> · {bookingData.service.duration}</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <MapPin className="w-5 h-5 text-brand-dark/50 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-xs uppercase text-brand-dark/50 font-medium mb-1">Sted</p>
                  <p className="text-sm text-brand-dark font-light">
                    CMedical – {bookingData.clinic?.label}
                  </p>
                  {bookingData.clinic?.address && (
                    <p className="text-sm text-brand-dark/60 font-light">{bookingData.clinic.address}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {calendarInput && (
            <div className="bg-brand-beige/30 rounded-2xl p-5 mb-5 border border-brand-dark/5">
              <p className="text-sm text-brand-dark font-medium mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" strokeWidth={1.5} />
                Legg i kalenderen
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href={gcalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-brand-dark text-sm font-light border border-brand-dark/15 hover:border-brand-dark/40 transition-colors flex-1"
                >
                  Google Kalender
                </a>
                <button
                  type="button"
                  onClick={() => downloadICS(calendarInput)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-brand-dark text-sm font-light border border-brand-dark/15 hover:border-brand-dark/40 transition-colors flex-1"
                >
                  Apple / Outlook (.ics)
                </button>
              </div>
              <p className="text-xs text-brand-dark/50 font-light mt-3">
                .ics-filen åpner kalenderen din automatisk på mobil.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => navigate("/")}
              className="bg-brand-dark text-brand-warm hover:bg-brand-dark/90 rounded-2xl flex-1 h-11 font-normal"
            >
              Tilbake til forsiden
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/kontakt")}
              className="rounded-2xl flex-1 h-11 font-light border-brand-dark/20 text-brand-dark"
            >
              Kontakt klinikken
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }


 // External clinic view (e.g., Moss → Colosseum Faust)
 if (externalClinic) {
 return (
 <div className="min-h-screen bg-[#f5f4f0] flex flex-col">
 <header className="sticky top-0 z-50 bg-foreground border-t border-brand-light/20">
 <div className="container mx-auto px-4 h-16 flex items-center justify-between">
 <button 
 onClick={() => setExternalClinic(null)} 
 className="flex items-center gap-1.5 text-sm text-background/80 hover:text-background transition-colors"
 >
 <ArrowLeft className="w-4 h-4" />
 <span>Tilbake</span>
 </button>
 <h1 className="text-sm text-background/90">CMedical {externalClinic.label}</h1>
 <button 
 onClick={handleClose}
 className="p-2 -mr-2 hover:bg-white/10 rounded-2xl md:rounded-full transition-colors"
 aria-label="Lukk"
 >
 <X className="w-5 h-5 text-background" />
 </button>
 </div>
 </header>

 <main className="flex-1 flex items-center justify-center px-6 py-16">
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.4 }}
 className="max-w-md w-full text-center"
 >
 <div className="mb-10">
 <div className="w-16 h-16 rounded-full bg-brand-dark/10 flex items-center justify-center mx-auto mb-6">
 <MapPin className="w-7 h-7 text-brand-dark/60" strokeWidth={1.5} />
 </div>
 <h2 className="text-2xl md:text-3xl font-light text-foreground mb-2">
 CMedical {externalClinic.label}
 </h2>
 <p className="text-sm text-muted-foreground font-light">
 {externalClinic.address}
 </p>
 </div>

 <div className="bg-white rounded-lg p-8 mb-6 shadow-sm">
 <p className="text-muted-foreground font-light mb-4">
 Ring oss for å bestille time
 </p>
 <a 
 href={`tel:+47${externalClinic.phone.replace(/\s/g, '')}`}
 className="inline-flex items-center gap-3 text-2xl md:text-3xl font-light text-foreground hover:text-foreground/80 transition-colors"
 >
 <Phone className="w-6 h-6" strokeWidth={1.5} />
 +47 {externalClinic.phone}
 </a>
 <p className="text-xs text-muted-foreground mt-3 font-light">
 {externalClinic.hours}
 </p>
 </div>

 {externalClinic.externalBookingUrl && (
 <div className="bg-white rounded-lg p-6 shadow-sm">
 <p className="text-sm text-muted-foreground font-light mb-4">
 Eller bestill time online hos vår samarbeidspartner
 </p>
 <a
 href={externalClinic.externalBookingUrl}
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark text-white rounded-sm hover:bg-brand-dark/90 transition-colors font-light text-sm"
 >
 Bestill time online
 <ArrowRight className="w-4 h-4" />
 </a>
 </div>
 )}
 </motion.div>
 </main>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-white">
 {/* Header */}
   <header className="sticky top-0 z-50 bg-white border-b border-brand-dark/10">
   <div className="container mx-auto px-4 h-16 flex items-center justify-between">
   <div className="w-9" aria-hidden="true" />
   <h1 className="text-sm text-brand-dark">Bestill time</h1>
   <button 
   onClick={handleClose} 
   className="p-2 -mr-2 hover:bg-brand-dark/5 rounded-2xl md:rounded-full transition-colors"
   aria-label="Lukk bestilling og gå til forsiden"
   >
   <X className="w-5 h-5 text-brand-dark" aria-hidden="true" />
   </button>
  </div>
  </header>

 <main className="container mx-auto px-4 pt-8 pb-16 md:pb-20 max-w-2xl">
 {/* Step Indicator — minimal CMedical stil */}
 <div className="mb-8">
  <div className="flex items-center justify-between mb-2 px-1">
  {currentStep > 1 ? (
  <button
  onClick={() => {
  const target = (["category", "clinic", "specialist", "time"] as const)[currentStep - 2];
  resetStep(target);
  }}
  className="flex items-center gap-1 text-xs font-light text-brand-dark hover:text-brand-dark/70 transition-colors"
  >
  <ArrowLeft className="w-3 h-3" />
  <span className="underline">Tilbake</span>
  <span className="text-brand-dark/60 ml-2">· Steg {currentStep} av 5</span>
  </button>
  ) : (
  <span className="text-xs font-light text-brand-dark/60">
  Steg {currentStep} av 5
  </span>
  )}
  <span className="text-xs font-normal text-brand-dark">
  {[null, "Tjeneste", "Klinikk", "Behandler", "Tid", "Bekreft"][currentStep]}
  </span>
  </div>
 <div className="flex items-center gap-1.5">
 {[1, 2, 3, 4, 5].map((step) => {
 const canNavigate = currentStep > step;
 const isActive = currentStep === step;
 const isDone = currentStep > step;
 const labels = ["tjeneste", "klinikk", "behandler", "tid", "bekreft"];
 return (
 <button
 key={step}
 onClick={() => {
 if (canNavigate) {
 if (step === 1) resetStep('category');
 else if (step === 2) resetStep('clinic');
 else if (step === 3) resetStep('specialist');
 else if (step === 4) resetStep('time');
 }
 }}
 disabled={!canNavigate && !isActive}
 aria-label={`Steg ${step}: ${labels[step - 1]}`}
 aria-current={isActive ? "step" : undefined}
 className={cn(
 "flex-1 h-1 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2",
 isActive && "bg-brand-dark",
 isDone && "bg-brand-dark/40 hover:bg-brand-dark/60 cursor-pointer",
 !isActive && !isDone && "bg-brand-dark/10 cursor-not-allowed"
 )}
 />
 );
 })}
 </div>
 </div>
 {/* Persistent Summary Banner */}
 {bookingData.service && (
 <div className="bg-brand-beige/30 border border-brand-dark/10 rounded-2xl p-4 mb-6 text-sm">
 <div className="flex flex-wrap gap-x-6 gap-y-1">
 {bookingData.service && (
 <div>
 <span className="text-brand-dark/60 text-xs">Tjeneste: </span>
 <span className="font-normal text-brand-dark">{bookingData.service.name}</span>
 </div>
 )}
 {bookingData.clinic && (
 <div>
 <span className="text-brand-dark/60 text-xs">Klinikk: </span>
 <span className="font-normal text-brand-dark">{bookingData.clinic.label}</span>
 </div>
 )}
 {bookingData.specialist && (
 <div>
 <span className="text-brand-dark/60 text-xs">Behandler: </span>
 <span className="font-normal text-brand-dark">{bookingData.specialist.name}</span>
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
 <h2 className="text-2xl font-light text-brand-dark text-center mb-6">
 {filterToCategoryId
 ? `Velg tjeneste innen ${bookingServices.find(c => c.id === filterToCategoryId)?.label ?? ""}`
 : "Velg tjeneste"}
 </h2>

 {filterToCategoryId && (
 <div className="flex justify-center -mt-2 mb-2">
 <button
 onClick={() => {
 setFilterToCategoryId(null);
 setExpandedCategory(null);
 }}
 className="text-sm text-foreground/70 hover:text-foreground underline underline-offset-4"
 >
 Vis alle tjenester
 </button>
 </div>
 )}

 <div className="space-y-3">
 {[...bookingServices]
 .filter((c) => !filterToCategoryId || c.id === filterToCategoryId)
 .sort((a, b) => {
 // "Graviditet - fostermedisiner" always first
 if (a.id === 'fostermedisiner') return -1;
 if (b.id === 'fostermedisiner') return 1;
 return a.label.localeCompare(b.label, 'nb');
 }).map((category) => {
 const availableClinicsForCategory = getClinicsForService(category.id);
 
 return (
 <div key={category.id} className="rounded-2xl overflow-hidden border border-brand-dark/10">
 {/* Category Header */}
 <button
 onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
 className={cn(
 "w-full flex items-center justify-between p-5 bg-brand-beige/40 hover:bg-brand-beige/60 transition-all",
 expandedCategory === category.id && "bg-brand-beige/60"
 )}
 >
 <span className="font-normal text-brand-dark">{category.label}</span>
 
 {/* Clinic availability badges - inline */}
 <div className="flex items-center gap-3 ml-auto mr-4">
 <div className="flex items-center gap-1.5">
 {availableClinicsForCategory.length === clinics.length ? (
 <span className="text-xs px-2 py-0.5 rounded-2xl md:rounded-full bg-white border border-brand-dark/10 text-brand-dark/70 font-light">
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
 className="text-xs px-2 py-0.5 rounded-2xl md:rounded-full bg-white border border-brand-dark/10 text-brand-dark/70 font-light"
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
 className="overflow-hidden bg-white border-t border-brand-dark/10"
 >
 <div className="p-3 space-y-2">
 {category.services.map((service, index) => (
 <button
 key={index}
 onClick={() => handleSelectService(category.id, category.label, service)}
 className={cn(
 "w-full flex items-center justify-between p-4 border rounded-xl hover:shadow-sm transition-all text-left group",
                  service.price === "0"
                    ? "bg-[#DDF5E8] border-[#7ECDA6]/40 hover:bg-[#D0F0DE] hover:border-[#7ECDA6]/70"
                    : "bg-brand-beige/30 border-brand-dark/10 hover:bg-white hover:border-brand-dark/30"
 )}
 >
 <div className="flex-1 pr-4">
 <span className="text-brand-dark block font-normal">
 {service.name}
 </span>
 <div className="flex items-center gap-3 mt-1">
 <span className="text-sm text-brand-dark/80">
 {service.price !== "0" ? `Fra kr ${service.price},-` : "Gratis"}
 </span>
 <span className="text-brand-dark/40">·</span>
 <span className="text-sm text-brand-dark/70">
 {service.duration}
 </span>
 </div>
 </div>
 <div className={cn(
 "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
 service.price === "0" ? "bg-[#3A9E73]" : "bg-brand-dark"
 )}>
 <ArrowRight className="w-4 h-4 text-brand-warm" />
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
 <h2 className="text-2xl font-light text-brand-dark mb-4">
 Velg klinikk
 </h2>
 
 {availableClinics.length === 0 ? (
 <FriendlyEmpty
 title="Ingen klinikker tilgjengelig akkurat nå"
 message="Denne tjenesten er ikke bookbar online for øyeblikket. Vi hjelper deg gjerne med å finne riktig time."
 />
 ) : (
 <div className="space-y-3">
 {availableClinics.map((clinic) => (
 <button
 key={clinic.id}
 onClick={() => handleSelectClinic(clinic)}
 className="w-full flex items-center gap-4 p-5 bg-brand-beige/30 border border-brand-dark/10 rounded-2xl hover:bg-white hover:border-brand-dark/30 hover:shadow-[0_4px_20px_rgba(66,51,42,0.06)] transition-all text-left group"
 >
 <div className="w-11 h-11 rounded-full bg-brand-beige flex items-center justify-center group-hover:bg-brand-dark/5 transition-colors">
 {clinic.bookingSystem === 'external' ? (
 <Phone className="w-5 h-5 text-brand-dark" strokeWidth={1.5} />
 ) : (
 <MapPin className="w-5 h-5 text-brand-dark" strokeWidth={1.5} />
 )}
 </div>
 <div className="flex-1">
 <p className="font-normal text-brand-dark">{clinic.label}</p>
 <p className="text-sm text-brand-dark/60 font-light">{clinic.address}</p>
 {clinic.bookingSystem === 'external' && (
 <p className="text-xs text-brand-dark/75 mt-0.5 font-light">Ring for timebestilling</p>
 )}
 </div>
 <ChevronRight className="w-5 h-5 text-brand-dark/40 group-hover:text-brand-dark group-hover:translate-x-0.5 transition-all" />
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
 <h2 className="text-2xl font-light text-brand-dark mb-2">
 Velg behandler
 </h2>
 <p className="text-sm text-brand-dark/60 font-light mb-4">
 Velg en behandler, eller gå videre for å se alle ledige tider.
 </p>

 {/* Skip / Any specialist */}
 <button
 onClick={() => setBookingData({ ...bookingData, specialistChosen: true, specialist: undefined })}
 className="w-full flex items-center gap-4 p-5 bg-brand-beige/30 border border-brand-dark/10 rounded-2xl hover:bg-white hover:border-brand-dark/30 hover:shadow-[0_4px_20px_rgba(66,51,42,0.06)] transition-all text-left group"
 >
 <div className="w-12 h-12 rounded-full bg-brand-beige flex items-center justify-center">
 <Calendar className="w-5 h-5 text-brand-dark" strokeWidth={1.5} />
 </div>
 <div className="flex-1">
 <p className="font-normal text-brand-dark">Første ledige</p>
 <p className="text-sm text-brand-dark/60 font-light">Vis alle ledige tider uavhengig av behandler</p>
 </div>
 <ChevronRight className="w-5 h-5 text-brand-dark/40 group-hover:text-brand-dark group-hover:translate-x-0.5 transition-all" />
 </button>

 <div className="grid grid-cols-2 gap-3">
 {filteredSpecialists.map((spec) => (
 <div key={spec.name} className="relative">
 <button
 onClick={() => setBookingData({ ...bookingData, specialistChosen: true, specialist: spec })}
 className="w-full flex flex-col items-center p-5 bg-brand-beige/30 border border-brand-dark/10 rounded-2xl hover:bg-white hover:border-brand-dark/30 hover:shadow-[0_4px_20px_rgba(66,51,42,0.06)] transition-all text-center group"
 >
 <div className="w-16 h-16 rounded-full overflow-hidden mb-3 ring-1 ring-brand-dark/10">
 <img src={spec.image} alt={spec.name} className="w-full h-full object-cover object-top" />
 </div>
 <span className="text-sm font-normal text-brand-dark leading-tight">{spec.name}</span>
 <span className="text-xs text-brand-dark/60 mt-1 line-clamp-1 font-light">{spec.title}</span>
 </button>
 <button
 onClick={(e) => {
 e.stopPropagation();
 setSelectedSpecialistInfo(spec);
 }}
 className="absolute top-2 right-2 w-6 h-6 rounded-full bg-brand-beige hover:bg-brand-dark hover:text-brand-warm flex items-center justify-center transition-colors"
 aria-label={`Les mer om ${spec.name}`}
 >
 <Info className="w-3.5 h-3.5" />
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
 <h2 className="text-2xl font-light text-brand-dark mb-4">
 Velg tid
 {bookingData.specialist && (
 <span className="text-base text-brand-dark/60 font-light ml-2">
 – {bookingData.specialist.name}
 </span>
 )}
 </h2>
 
 {/* Horisontal dato-stripe — kun ledige hverdager */}
 <div className="bg-brand-beige/30 rounded-2xl p-6 border border-brand-dark/10">
 <div className="mb-5 flex items-end justify-between">
 <div>
  <p className="text-xs text-brand-dark/60 font-medium mb-1">
 Valgt dag
 </p>
 <h3 className="text-xl font-light text-brand-dark capitalize">
 {selectedDate
 ? format(selectedDate, "EEEE d. MMMM", { locale: nb })
 : bookableDates.length > 0
 ? format(bookableDates[0], "EEEE d. MMMM", { locale: nb })
 : "Ingen ledige dager"}
 </h3>
 </div>
 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={() => {
 setDateDirection(-1);
 setDateOffset(0);
 if (bookableDates.length > 0) setSelectedDate(bookableDates[0]);
 }}
 disabled={dateOffset === 0 && (!selectedDate || (bookableDates[0] && isSameDay(selectedDate, bookableDates[0])))}
 aria-label="Tilbake til f\u00f8rste ledige dag"
 title="Tilbake til f\u00f8rste ledige dag"
 className={cn(
 "flex h-10 w-10 items-center justify-center rounded-md border transition-colors mr-1",
 "border-brand-dark/15 bg-white text-brand-dark hover:bg-brand-beige hover:border-brand-dark/40 disabled:text-brand-dark/30 disabled:cursor-not-allowed disabled:hover:bg-white"
 )}
 >
 <RotateCcw className="w-4 h-4" />
 </button>
 <button
 type="button"
 onClick={() => {
 if (!canGoPrevRange) return;
 setDateDirection(-1);
 setDateOffset(Math.max(0, dateOffset - VISIBLE_DAYS));
 }}
 disabled={!canGoPrevRange}
 aria-label="Forrige dager"
 className={cn(
 "flex h-10 w-10 items-center justify-center rounded-md border bg-white transition-colors",
 canGoPrevRange
 ? "border-brand-dark/15 text-brand-dark/75 hover:text-brand-dark hover:border-brand-dark/30 hover:bg-brand-beige/40"
 : "border-brand-dark/10 text-brand-dark/20 cursor-not-allowed"
 )}
 >
 <ChevronLeft className="w-4 h-4" />
 </button>
 <button
 type="button"
 onClick={() => {
 if (!canGoNextRange) return;
 setDateDirection(1);
 setDateOffset(Math.min(weekdayDates.length - VISIBLE_DAYS, dateOffset + VISIBLE_DAYS));
 }}
 disabled={!canGoNextRange}
 aria-label="Neste dager"
 className={cn(
 "flex h-10 w-10 items-center justify-center rounded-md border bg-white transition-colors",
 canGoNextRange
 ? "border-brand-dark/15 text-brand-dark/75 hover:text-brand-dark hover:border-brand-dark/30 hover:bg-brand-beige/40"
 : "border-brand-dark/10 text-brand-dark/20 cursor-not-allowed"
 )}
 >
 <ChevronRight className="w-4 h-4" />
 </button>
 </div>
 </div>

 <div className="overflow-hidden min-h-24">
 <AnimatePresence mode="wait" initial={false}>
 <motion.div
 key={dateOffset}
 initial={{ opacity: 0, x: dateDirection * 24 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: dateDirection * -24 }}
 transition={{ duration: 0.25, ease: "easeOut" }}
 className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3"
 >
 {weekdayDates.slice(dateOffset, dateOffset + VISIBLE_DAYS).map((date) => {
 const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
 const isToday = isSameDay(date, today);
 const pool = bookingData.specialist ? [bookingData.specialist] : filteredSpecialists;
 const hasSlots = generateTimeSlots(date, pool).length > 0;
 const isDisabled = !hasSlots;

 return (
 <button
 key={date.toISOString()}
 type="button"
 onClick={() => { if (!isDisabled) setSelectedDate(date); }}
 disabled={isDisabled}
 aria-label={format(date, "EEEE d. MMMM", { locale: nb })}
 aria-pressed={isSelected}
 title={isDisabled ? "Ingen ledige timer denne dagen" : undefined}
 className={cn(
 "group relative flex flex-col items-center justify-center gap-1 h-24 rounded-xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2",
 isSelected
 ? "bg-brand-dark border-brand-dark text-brand-warm shadow-sm"
 : isDisabled
 ? "bg-brand-beige/20 border-brand-dark/5 text-brand-dark/30 cursor-not-allowed"
 : "bg-white border-brand-dark/10 text-brand-dark hover:border-brand-dark/40 hover:bg-brand-beige/50"
 )}
 >
 <span className={cn(
  "text-xs font-medium",
 isSelected ? "text-brand-warm/80" : isDisabled ? "text-brand-dark/25" : "text-brand-dark/60"
 )}>
 {format(date, "EEE", { locale: nb })}
 </span>
 <span className={cn(
 "text-2xl leading-none",
 isSelected ? "font-medium" : "font-light"
 )}>
 {format(date, "d", { locale: nb })}
 </span>
  <span className={cn(
  "text-[10px] font-light leading-none",
  isSelected ? "text-brand-warm/80" : isDisabled ? "text-brand-dark/40" : "text-brand-dark/60"
  )}>
   {isDisabled && isMobile ? "Opptatt" : isToday ? "I dag" : format(date, "MMM", { locale: nb })}
   </span>
   {isDisabled && isMobile && (
     <span className="absolute inset-x-3 top-1/2 h-px bg-brand-dark/15 -rotate-12" aria-hidden />
   )}
 </button>
 );
 })}
 </motion.div>
 </AnimatePresence>
 </div>
 </div>



 {/* Time Slots — CMedical beige/brun stil, 3 per rad */}
 {selectedDate && (
 <div className="bg-brand-beige/30 rounded-2xl p-6 border border-brand-dark/10">
 <div className="mb-5 flex items-end justify-between">
 <div>
  <p className="text-xs text-brand-dark/60 font-medium mb-1">
 Velg en tid
 </p>
 <h3 className="text-xl font-light text-brand-dark capitalize">
 {format(selectedDate, "EEEE d. MMMM", { locale: nb })}
 </h3>
 </div>
 {bookingData.service?.duration && (
 <span className="text-xs text-brand-dark/60 font-medium">
 Varighet {bookingData.service.duration}
 </span>
 )}
 </div>

 {availableSlots.length > 0 ? (
 bookingData.specialist ? (
 /* Spesialist valgt — kun tider */
 <div className="grid grid-cols-3 gap-2 sm:gap-3">
 {availableSlots.map((slot, index) => (
 <button
 key={index}
 onClick={() => handleSelectTimeSlot(slot.time, bookingData.specialist!)}
 className="py-3 px-4 bg-white border border-brand-dark/10 rounded-md text-brand-dark font-light text-base hover:bg-brand-dark hover:text-brand-warm hover:border-brand-dark transition-all"
 >
 {slot.time}
 </button>
 ))}
 </div>
 ) : (
 /* Ingen spesialist — tid + behandler i rad */
 <div className="space-y-2">
 {availableSlots.map((slot, index) => (
 <button
 key={index}
 onClick={() => handleSelectTimeSlot(slot.time, slot.specialist)}
 className="w-full flex items-center gap-4 p-3 bg-white border border-brand-dark/10 rounded-md hover:border-brand-dark/40 hover:shadow-sm transition-all text-left"
 >
 <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-brand-dark/10">
 <img src={slot.specialist.image} alt={slot.specialist.name} className="w-full h-full object-cover object-top" />
 </div>
 <div className="flex-1 min-w-0">
 <span className="text-sm font-normal text-brand-dark block">{slot.specialist.name}</span>
 <span className="text-xs text-brand-dark/60 font-light">{slot.specialist.title}</span>
 </div>
 <span className="font-light text-brand-dark text-lg tabular-nums">{slot.time}</span>
 </button>
 ))}
 </div>
 )
 ) : (
 <FriendlyEmpty
 title="Ingen ledige timer denne dagen"
 message="Prøv en annen dag i kalenderen, eller gi oss en ringedirekte – vi finner ofte en åpning som ikke ligger ute online."
 />
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
 <h2 className="text-2xl font-light text-brand-dark mb-4">
 Bekreft
 </h2>

 {/* Summary Card */}
 <div className="bg-brand-beige/30 border border-brand-dark/10 rounded-2xl p-6">
 <h3 className="font-normal text-lg mb-4 text-brand-dark">Din bestilling</h3>
 <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
 <div>
  <span className="text-brand-dark/60 text-xs">Tjeneste</span>
 <p className="font-normal mt-1 text-brand-dark">{bookingData.service?.name}</p>
 </div>
 <div>
  <span className="text-brand-dark/60 text-xs">Pris</span>
 <p className="font-normal mt-1 text-brand-dark">{bookingData.service?.price === "0" ? "Gratis" : `Fra ${bookingData.service?.price} kr`}</p>
 <p className="text-xs text-brand-dark/75 mt-0.5 font-light">Prisen kan påvirkes av tid på døgnet, helg og eventuelle tillegg.</p>
 </div>
 <div>
  <span className="text-brand-dark/60 text-xs">Klinikk</span>
 <p className="font-normal mt-1 text-brand-dark">{bookingData.clinic?.label}</p>
 </div>
 <div>
  <span className="text-brand-dark/60 text-xs">Varighet</span>
 <p className="font-normal mt-1 text-brand-dark">{bookingData.service?.duration}</p>
 </div>
 <div>
  <span className="text-brand-dark/60 text-xs">Dato</span>
 <p className="font-normal mt-1 capitalize text-brand-dark">{bookingData.date && format(bookingData.date, "EEEE d. MMMM", { locale: nb })}</p>
 </div>
 <div>
  <span className="text-brand-dark/60 text-xs">Tid</span>
 <p className="font-normal mt-1 text-brand-dark">{bookingData.time}</p>
 </div>
 </div>
 {bookingData.specialist && (
 <div className="flex items-center gap-3 mt-5 pt-4 border-t border-brand-dark/10">
 <Avatar className="h-10 w-10">
 <AvatarImage src={bookingData.specialist.image} alt={bookingData.specialist.name} />
 <AvatarFallback>{bookingData.specialist.name.slice(0, 2)}</AvatarFallback>
 </Avatar>
 <div>
 <p className="font-normal text-brand-dark">{bookingData.specialist.name}</p>
 <p className="text-sm text-brand-dark/60 font-light">{bookingData.specialist.title}</p>
 </div>
 </div>
 )}
 </div>

 {/* Personal Info Form */}
 <div className="bg-brand-beige/30 border border-brand-dark/10 rounded-2xl p-6">
 <h3 className="font-normal text-lg mb-4 text-brand-dark">Dine opplysninger</h3>
 <div className="space-y-4">
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label htmlFor="firstName" className="text-sm text-brand-dark/70">Fornavn *</label>
 <Input
 id="firstName"
 name="given-name"
 autoComplete="given-name"
 value={formData.firstName}
 onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
 placeholder="Fornavn"
 className="mt-1.5 h-12 rounded-lg border-brand-dark/30 bg-white focus-visible:bg-white text-brand-dark placeholder:text-brand-dark/60"
 />
 </div>
 <div>
 <label htmlFor="lastName" className="text-sm text-brand-dark/70">Etternavn *</label>
 <Input
 id="lastName"
 name="family-name"
 autoComplete="family-name"
 value={formData.lastName}
 onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
 placeholder="Etternavn"
 className="mt-1.5 h-12 rounded-lg border-brand-dark/30 bg-white focus-visible:bg-white text-brand-dark placeholder:text-brand-dark/60"
 />
 </div>
 </div>
 <div>
 <label htmlFor="birthNumber" className="text-sm text-brand-dark/70">Fødselsnummer (11 siffer) *</label>
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
 className="mt-1.5 h-12 rounded-lg border-brand-dark/30 bg-white focus-visible:bg-white text-brand-dark placeholder:text-brand-dark/60"
 />
 <p className="text-xs text-brand-dark/60 mt-1.5 leading-relaxed font-light">
 * Fødselsnummeret er påkrevd for sikker identifisering og journalføring i henhold til helsepersonelloven. Opplysningene behandles konfidensielt og deles ikke med tredjepart.
 </p>
 </div>
 <div>
 <label htmlFor="phone" className="text-sm text-brand-dark/70">Mobilnummer *</label>
 <Input
 id="phone"
 name="tel"
 autoComplete="tel"
 value={formData.phone}
 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
 placeholder="+47 XXX XX XXX"
 type="tel"
 inputMode="tel"
 className="mt-1.5 h-12 rounded-lg border-brand-dark/30 bg-white focus-visible:bg-white text-brand-dark placeholder:text-brand-dark/60"
 />
 <p className="text-xs text-brand-dark/60 mt-1.5 leading-relaxed font-light">
 Bekreftelse og påminnelse sendes på SMS til dette nummeret.
 </p>
 </div>
 <div>
 <label htmlFor="email" className="text-sm text-brand-dark/70">E-postadresse</label>
 <Input
 id="email"
 name="email"
 autoComplete="email"
 value={formData.email || ""}
 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
 placeholder="din@epost.no"
 type="email"
 className="mt-1.5 h-12 rounded-lg border-brand-dark/30 bg-white focus-visible:bg-white text-brand-dark placeholder:text-brand-dark/60"
 />
 <p className="text-xs text-brand-dark/60 mt-1.5 leading-relaxed font-light">
 Valgfritt. Bekreftelse sendes også til e-post om oppgitt.
 </p>
 </div>
 <div className="bg-brand-beige rounded-lg p-4 text-xs text-brand-dark/70 leading-relaxed space-y-2 font-light">
 <p><strong className="text-brand-dark font-normal">Avbestillingsregler:</strong> Om- eller avbestilling må skje senest 24 timer før avtalt tidspunkt. Ved manglende oppmøte eller sen avbestilling vil det påløpe et gebyr.</p>
 <p>«<a href="/vilkar" className="underline hover:text-brand-dark transition-colors">Vilkår</a>» – les vilkårene for bestilling og behandling hos CMedical.</p>
 </div>
 <div className="space-y-3 pt-2">
 <div className="flex items-start gap-3">
 <Checkbox
 id="terms"
 checked={formData.acceptTerms}
 onCheckedChange={(checked) => setFormData({ ...formData, acceptTerms: checked as boolean })}
 className="mt-0.5"
 />
 <label htmlFor="terms" className="text-sm text-brand-dark/80 leading-relaxed cursor-pointer font-light">
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
 <label htmlFor="dataProcessing" className="text-sm text-brand-dark/80 leading-relaxed cursor-pointer font-light">
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
 <label htmlFor="acceptInfo" className="text-sm text-brand-dark/80 leading-relaxed cursor-pointer font-light">
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
 ? "bg-brand-dark text-brand-warm hover:bg-brand-dark/90 shadow-sm"
 : "bg-brand-beige text-brand-dark/40 cursor-not-allowed"
 )}
 >
 Bekreft bestilling
  </Button>

  </motion.div>
  )}
  </AnimatePresence>

  {/* Hjelp / kontakt oss */}
  <div className="mt-10 pt-6 border-t border-brand-dark/10 text-center">
  <p className="text-sm text-brand-dark/60 font-light leading-relaxed">
  Om du opplever utfordringer med online timebestilling,<br />
  er du hjertelig velkommen til å ringe oss på{' '}
  <a href="tel:+47226000050" className="text-brand-dark underline hover:text-brand-dark/70 transition-colors">
  +47 22 60 00 50
  </a>.
  </p>
  <p className="text-xs text-brand-dark/50 font-light mt-1.5">
  Vi er tilgjengelige fra 08:00 – 20:00 alle hverdager.
  </p>
  </div>
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
 className="px-3 py-1 text-sm font-light bg-white/60 text-foreground/80 rounded-2xl md:rounded-full"
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
 <p className="text-xs text-foreground/60 mb-1.5">Språk</p>
 <p className="text-sm text-foreground font-light">{selectedSpecialistInfo.languages.join(", ")}</p>
 </div>
 )}
 {selectedSpecialistInfo.clinics && selectedSpecialistInfo.clinics.length > 0 && (
 <div className="bg-white/50 rounded-xl p-4">
 <p className="text-xs text-foreground/60 mb-1.5">Klinikk</p>
 <p className="text-sm text-foreground font-light">{selectedSpecialistInfo.clinics.join(", ")}</p>
 </div>
 )}
 {selectedSpecialistInfo.education && (
 <div className="bg-white/50 rounded-xl p-4">
 <p className="text-xs text-foreground/60 mb-1.5">Utdanning</p>
 <p className="text-sm text-foreground font-light">{selectedSpecialistInfo.education}</p>
 </div>
 )}
 {selectedSpecialistInfo.experience && (
 <div className="bg-white/50 rounded-xl p-4">
 <p className="text-xs text-foreground/60 mb-1.5">Erfaring</p>
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
