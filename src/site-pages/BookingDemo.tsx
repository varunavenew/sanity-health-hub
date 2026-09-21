"use client";

import { AssetImg } from "@/components/AssetImg";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams, Link, useLocaleParam, useLocation } from "@/lib/router";
import { ArrowLeft, X, Calendar, MapPin, Phone, Clock, Check, ChevronDown, ChevronLeft, ChevronRight, ArrowRight, Info, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpecialistsData, Specialist } from "@/hooks/useSpecialistsData";
import {
  format,
  addDays,
  addWeeks,
  isSameDay,
  parseISO,
  startOfWeek,
} from "date-fns";
import { formatDurationMinutes, localizeDurationLabel, minutesToLengthTime } from "@/lib/booking/duration";
import {
  bookingDateFnsLocale,
  formatBookingLongDate,
  formatBookingMonthShort,
  formatBookingShortDate,
} from "@/lib/booking/format-booking-date";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import {
  categoryNumericIdToPageId,
  findBookingCategoryByApiGroupId,
  findBookingCategoryForPage,
  parseTjenesteValg,
} from "@/lib/bookingLinks";
import { resolveBookingReturnPath, peekBookingReturnPath, rememberBookingReturnPath } from "@/lib/booking/return-to";
import {
  filterServicesByOptions,
  resolvePreselectedService,
} from "@/lib/booking/resolve-booking-service";
import {
  apiLocationToClinic,
  isExternalClinic,
  isMetodikaClinic,
  isPasientskyClinic,
  isSanityManagedClinic,
  type BookingClinic,
  type BookingMetodikaClinic,
} from "@/lib/booking/mapApiLocation";
import {
  auditSanityMetodikaClinicMappings,
  enrichMetodikaClinicWithSanity,
  findSanityClinicForMetodikaLocation,
  findSanityClinicBySlugOrId,
  findSanityManagedClinicBySlug,
  isPlaceholderMetodikaLocationLabel,
  logSanityMetodikaMappingAudit,
  mergeMetodikaAndSanityClinics,
  metodikaClinicsFromMatrix,
  sanityManagedClinicsForCategory,
} from "@/lib/booking/sanityBookingClinic";
import {
  allStep1ClinicDisplayTags,
  step1ClinicDisplayTagsForCategory,
} from "@/lib/sanity/booking-page-step1-clinics";
import {
  bookingActivityGroupsQueryKey,
  fetchBookingActivityGroupsClient,
} from "@/lib/booking/fetchActivityGroups.client";
import {
  bookingPersonForModal,
  isBookingCaregiver,
  resolveSanitySpecialistForCaregiver,
  type BookingCaregiver,
} from "@/lib/booking/bookingCaregiver";
import {
  clinicAllowedForSpecialist,
  filterClinicsForPreselectedSpecialist,
  filterClinicsForWbActivity,
  resolveBookingCaregiverUserId,
} from "@/lib/booking/filterClinicsForSpecialist";
import { metodikaClinicFromSanityRow } from "@/lib/booking/booking-locked-clinic";
import {
  fetchWbActivityMatrixClient,
  prefetchWbActivityMatrix,
} from "@/lib/booking/fetchWbActivityMatrix.client";
import { caregiverIdsForWbActivityAtLocation } from "@/lib/booking/wbactivitiesMatrix";
import { useWbActivityMatrix } from "@/hooks/useWbActivityMatrix";
import { pasientskyCalendarIdForSpecialist } from "@/lib/booking/pasientskySpecialist";
import { resolvePasientskyTimeslotTypeId } from "@/lib/booking/pasientskyTimeslotMapping";
import { BookingStepLoader } from "@/components/booking/BookingStepLoader";
import { PatientskyIframe } from "@/components/booking/PatientskyIframe";
import { ExternalBookingHandoff } from "@/components/booking/ExternalBookingHandoff";
import { FriendlyEmpty } from "@/components/booking/FriendlyEmpty";
import { BookingSupportFooter } from "@/components/booking/BookingSupportFooter";
import { BookingPageAnalytics } from "@/components/analytics/BookingPageAnalytics";
import {
  bookingMethodForClinic,
  metodikaBookingCompletedFromState,
  trackBookingBack,
  trackBookingClose,
  trackBookingCompleted,
  trackBookingFailed,
  trackBookingInit,
  trackBookingSelectCategory,
  trackBookingSelectClinic,
  trackBookingStep,
  trackBookingSubmitted,
} from "@/lib/tracking/booking-analytics";
import { trackBookingMenuStart, trackBookingStart } from "@/lib/tracking/seo-events";
import { resolveBookingSpecialistImage } from "@/lib/booking/caregiverPlaceholders";
import { assetSrc } from "@/lib/media";
import { useBookingPage, useClinics } from "@/hooks/useSanity";
import { GeoPageEnhancements } from "@/components/seo/GeoPageEnhancements";
import {
  defaultBookingPageCopyForLang,
  fillBookingTemplate,
  splitTemplateLink,
} from "@/lib/sanity/booking-page-copy";
import {
  fetchBookingDaySlotsClient,
  peekBookingDaySlotsClient,
} from "@/lib/booking/fetchBookingDaySlots.client";
import {
  fetchBookingUsersClient,
  peekBookingUsersClient,
} from "@/lib/booking/fetchBookingUsers.client";
import {
  isValidNorwegianMobileFieldInput,
  normalizeNorwegianMobileForMetodika,
  stripNorwegianMobileInputForField,
} from "@/lib/booking/phoneMobile";
import {
  fodselsnummerFieldError,
  isFodselsnummerReadyForSubmit,
} from "@/lib/booking/booking-validation";
import { normalizeFodselsnummerInput } from "@/lib/booking/personalNumber";

export type BookingServiceCategory = {
  id: string;
  clinicServiceId?: string;
  label: string;
  apiGroupId?: number;
  services: {
    name: string;
    price: string;
    apiActivityId?: number;
    durationMinutes?: number;
  }[];
};

function clinicIdForCategory(category: BookingServiceCategory): string {
  return category.clinicServiceId ?? category.id;
}

function dayKey(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

const CALENDAR_WEEK_STARTS_ON = 1 as const;
const MAX_CALENDAR_WEEKS = 52;

function weekOffsetForDate(date: Date, anchor: Date): number {
  const base = startOfWeek(anchor, { weekStartsOn: CALENDAR_WEEK_STARTS_ON });
  const target = startOfWeek(date, { weekStartsOn: CALENDAR_WEEK_STARTS_ON });
  return Math.round((target.getTime() - base.getTime()) / (7 * 24 * 60 * 60 * 1000));
}

function LinkedTemplateText({
  template,
  token,
  href,
  linkText,
  linkClassName = "underline hover:text-brand-dark transition-colors",
}: {
  template: string;
  token: string;
  href: string;
  linkText: string;
  linkClassName?: string;
}) {
  const [before, after] = splitTemplateLink(template, token);
  return (
    <>
      {before}
      <Link to={href} className={linkClassName}>
        {linkText}
      </Link>
      {after}
    </>
  );
}

/** Terms links on step 5 open the same page as the privacy-policy link. */
const BOOKING_LEGAL_POLICY_PATH = "/personvern";

type BookingServiceItem = {
  name: string;
  price: string;
  apiActivityId?: number;
  durationMinutes?: number;
};

function activityIdsForCategory(category: BookingServiceCategory): number[] {
  return category.services
    .map((s) => s.apiActivityId)
    .filter((id): id is number => typeof id === "number");
}

function serviceDurationLabel(service: BookingServiceItem, locale: string): string | null {
  if (service.durationMinutes == null) return null;
  return localizeDurationLabel(
    formatDurationMinutes(service.durationMinutes, locale),
    locale,
  );
}

function isFetalMedicineSortId(id: string | undefined): boolean {
  const normalized = (id || "").trim().toLowerCase();
  return (
    normalized === "fostermedisiner" ||
    normalized === "graviditet" ||
    normalized === "fostermedisiner-graviditet"
  );
}

function sortBookingCategories(a: BookingServiceCategory, b: BookingServiceCategory) {
  if (isFetalMedicineSortId(a.id) || isFetalMedicineSortId(a.clinicServiceId)) return -1;
  if (isFetalMedicineSortId(b.id) || isFetalMedicineSortId(b.clinicServiceId)) return 1;
  return a.label.localeCompare(b.label, "nb");
}

type ApiFreeTimeSlot = {
  startDateTime: string;
  time: string;
  durationMinutes?: number;
  lengthTime?: string;
  caregiverUserId?: number;
  roomId?: number;
  locationId?: number;
  locationName?: string;
};

type SelectedBookingSlot = {
  startDateTime: string;
  time: string;
  roomId: number;
  caregiverUserId: number;
  durationMinutes?: number;
  lengthTime: string;
};

type DisplayTimeSlot = {
  time: string;
  startDateTime: string;
  durationMinutes?: number;
  lengthTime?: string;
  caregiverUserId?: number;
  roomId?: number;
};

interface BookingData {
  category?: string;
  categoryId?: string;
  /** activity-groups category slug (may differ from categoryId / clinicServiceId). */
  categoryApiSlug?: string;
  service?: BookingServiceItem;
  clinic?: BookingClinic;
  specialistChosen?: boolean; // true once user has passed the specialist step
  /** Step 3 "Første ledige" — persists through slot pick so back from step 5 restores all specialists. */
  firstAvailableFlow?: boolean;
  date?: Date;
  time?: string;
  specialist?: Specialist | BookingCaregiver;
  /** Duration from wbfreetimes `timelength` for the selected slot. */
  slotDurationMinutes?: number;
  selectedSlot?: SelectedBookingSlot;
  activityTypeId?: number;
}

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  birthNumber: string;
  note: string;
  acceptTerms: boolean;
  acceptMarketing: boolean;
  acceptDataProcessing: boolean;
}

const BookingDemo = () => {
  const navigate = useNavigate();
  const locale = useLocaleParam();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const serviceChoiceSlugs = useMemo(
    () => parseTjenesteValg(searchParams.get("tjenesteValg")),
    [searchParams],
  );
  const hasServiceChoice = serviceChoiceSlugs.length > 1;
  const { specialists } = useSpecialistsData();
  const { data: bookingPageData = defaultBookingPageCopyForLang(locale) } = useBookingPage();
  const copy = bookingPageData;
  const bookingGeoSummary = bookingPageData.geoSummary;
  const { data: sanityClinics = [] } = useClinics();
  const {
    data: bookingServices = [],
    isLoading: servicesLoading,
  } = useQuery({
    queryKey: bookingActivityGroupsQueryKey(locale),
    queryFn: () => fetchBookingActivityGroupsClient(locale),
    staleTime: 5 * 60 * 1000,
  });

  // Full-page jumps (window.location.href = "/booking") may skip navigate/Link hooks.
  // Capture same-origin referrer once when no return path was stored yet.
  useEffect(() => {
    if (searchParams.get("fra")) return;
    if (peekBookingReturnPath()) return;
    try {
      const ref = document.referrer;
      if (!ref) return;
      const url = new URL(ref);
      if (url.origin !== window.location.origin) return;
      rememberBookingReturnPath(`${url.pathname}${url.search}`);
    } catch {
      /* ignore */
    }
  }, [searchParams]);

  const allStep1ClinicTags = useMemo(
    () => allStep1ClinicDisplayTags(bookingPageData.step1CategoryClinicBadges, sanityClinics),
    [bookingPageData.step1CategoryClinicBadges, sanityClinics],
  );

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);
  // Horisontal 7-dagers stripe (mandag–søndag, som Metodika)
  const VISIBLE_DAYS = 7;
  const [weekOffset, setWeekOffset] = useState(0);
  const [dateDirection, setDateDirection] = useState<1 | -1>(1);
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  // When user arrives with ?kategori=..., filter step 1 to that category only.
  // Cleared by "Vis alle tjenester" button so the user can change their mind.
  const [filterToCategoryId, setFilterToCategoryId] = useState<string | null>(null);
  const [selectedSpecialistInfo, setSelectedSpecialistInfo] = useState<
    Specialist | BookingCaregiver | null
  >(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    birthNumber: "",
    note: "",
    acceptTerms: true,
    acceptMarketing: false,
    acceptDataProcessing: true,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [birthNumberError, setBirthNumberError] = useState<string | null>(null);
  const [apiFreeTimeSlots, setApiFreeTimeSlots] = useState<ApiFreeTimeSlot[]>([]);
  const [apiBookingClinics, setApiBookingClinics] = useState<BookingMetodikaClinic[]>([]);
  const [availabilityFromApi, setAvailabilityFromApi] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  /** True after clinic availability has been checked for the current service. */
  const [clinicsAvailabilityReady, setClinicsAvailabilityReady] = useState(false);
  const [bookingCaregivers, setBookingCaregivers] = useState<BookingCaregiver[]>([]);
  const [caregiversLoading, setCaregiversLoading] = useState(false);
  const [timesLoading, setTimesLoading] = useState(false);
  /** Full alltimes slots per day (fetched on date click). Discovery stays in apiFreeTimeSlots. */
  const [slotsByDayKey, setSlotsByDayKey] = useState<Record<string, ApiFreeTimeSlot[]>>({});
  const slotsByDayRef = useRef<Record<string, ApiFreeTimeSlot[]>>({});
  /** Tracks step-4 calendar init per clinic/specialist so date clicks are not overwritten. */
  const step4CalendarInitKeyRef = useRef<string | null>(null);
  const daySlotsFetchGenRef = useRef(0);
  /** Prevents duplicate booking_completed if submit succeeds twice in the same session. */
  const bookingCompletedTrackedRef = useRef(false);

  const step1ClinicTagsByCategoryId = useMemo(() => {
    const result: Record<string, ReturnType<typeof step1ClinicDisplayTagsForCategory>> = {};
    for (const category of bookingServices) {
      result[category.id] = step1ClinicDisplayTagsForCategory(
        bookingPageData.step1CategoryClinicBadges,
        sanityClinics,
        category.id,
        category.clinicServiceId,
      );
    }
    return result;
  }, [bookingServices, bookingPageData.step1CategoryClinicBadges, sanityClinics]);

  const enrichedMetodikaClinics = useMemo(
    () =>
      apiBookingClinics.map((metodika) => {
        const sanity = findSanityClinicForMetodikaLocation(
          sanityClinics,
          metodika.apiLocationId,
          metodika.label,
        );
        return enrichMetodikaClinicWithSanity(metodika, sanity);
      }),
    [apiBookingClinics, sanityClinics],
  );

  useEffect(() => {
    if (!apiBookingClinics.length || !sanityClinics.length) return;
    const audit = auditSanityMetodikaClinicMappings(sanityClinics, apiBookingClinics);
    logSanityMetodikaMappingAudit(audit);
  }, [apiBookingClinics, sanityClinics]);

  const isPasientskyBooking =
    bookingData.clinic != null && isPasientskyClinic(bookingData.clinic);

  const isExternalBooking =
    bookingData.clinic != null && isExternalClinic(bookingData.clinic);

  const selectedSanityClinic = useMemo(() => {
    const clinic = bookingData.clinic;
    if (!clinic) return undefined;
    if (isMetodikaClinic(clinic) && clinic.sanityClinicId) {
      return sanityClinics.find((row) => row.id === clinic.sanityClinicId);
    }
    return (
      sanityClinics.find((row) => row.id === clinic.id) ??
      sanityClinics.find((row) => row.slug === clinic.id) ??
      (isPasientskyClinic(clinic)
        ? sanityClinics.find((row) => row.booking?.method === "pasientsky")
        : undefined)
    );
  }, [bookingData.clinic, sanityClinics]);

  const pasientskySpecialist = useMemo(() => {
    if (bookingData.specialist) return bookingData.specialist;
    const slug = searchParams.get("spesialist");
    if (!slug) return undefined;
    return specialists.find((s) => s.slug === slug);
  }, [bookingData.specialist, searchParams, specialists]);

  /** Moelv + linked specialist from profile — skip Metodika service step, open PatientSky. */
  const pasientskyDirectIframe = Boolean(
    isPasientskyBooking &&
      bookingData.clinic &&
      pasientskySpecialist &&
      !bookingData.service,
  );

  const isSanityManagedBooking =
    bookingData.clinic != null && isSanityManagedClinic(bookingData.clinic);

  /** Pasientsky (Moelv): always 3 steps — tjeneste → klinikk → bestill (iframe). */
  const pasientskyTotalSteps = 3;

  const totalSteps = isPasientskyBooking ? pasientskyTotalSteps : 5;

  const stepNameByIndex = useMemo(() => {
    const pasientskyBookLabel = "Bestill";
    if (isPasientskyBooking) {
      return [
        null,
        copy.stepLabelService,
        copy.stepLabelClinic,
        pasientskyBookLabel,
      ] as const;
    }
    return [
      null,
      copy.stepLabelService,
      copy.stepLabelClinic,
      copy.stepLabelSpecialist,
      copy.stepLabelTime,
      copy.stepLabelConfirm,
    ] as const;
  }, [copy, isPasientskyBooking]);

  const stepProgressLabel = (step: number) =>
    fillBookingTemplate(copy.stepProgressTemplate, { step, total: totalSteps });

  const currentStep = useMemo(() => {
    if (isPasientskyBooking) {
      if (pasientskyDirectIframe) return 3;
      if (!bookingData.service) return 1;
      if (!bookingData.clinic) return 2;
      return 3;
    }
    if (!bookingData.service) return 1;
    if (!bookingData.clinic) return 2;
    if (!bookingData.specialistChosen) return 3;
    if (!bookingData.time) return 4;
    return 5;
  }, [
    bookingData.service,
    bookingData.clinic,
    bookingData.specialistChosen,
    bookingData.time,
    isPasientskyBooking,
    pasientskyDirectIframe,
  ]);

  const isFirstAvailableFlow = Boolean(bookingData.firstAvailableFlow);

  const progressAriaLabels = useMemo(() => {
    if (isPasientskyBooking) {
      return ["tjeneste", "klinikk", "bestill"] as const;
    }
    return ["tjeneste", "klinikk", "behandler", "tid", "bekreft"] as const;
  }, [isPasientskyBooking]);

  const progressStepNumbers = useMemo(
    () => Array.from({ length: totalSteps }, (_, i) => i + 1),
    [totalSteps],
  );

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  const trackedStepRef = useRef<number | null>(null);
  const bookingInitTracked = useRef(false);
  const deepLinkMenuStartTracked = useRef(false);
  /** After empty-clinic «Bestill time», skip URL service prefill so the user can pick another service. */
  const skipServicePrefillRef = useRef(false);

  useEffect(() => {
    if (bookingInitTracked.current || isPasientskyBooking || isExternalBooking) return;
    bookingInitTracked.current = true;
    trackBookingInit("metodika");
  }, [isPasientskyBooking, isExternalBooking]);

  useEffect(() => {
    if (deepLinkMenuStartTracked.current) return;
    const hasDeepLinkParam = [
      "kategori",
      "kategoriId",
      "tjeneste",
      "tjenesteValg",
      "aktivitetId",
      "spesialist",
      "klinikk",
    ].some((key) => searchParams.get(key));
    if (!hasDeepLinkParam) return;

    deepLinkMenuStartTracked.current = true;
    trackBookingMenuStart({
      entry_point: "deep_link",
      category: searchParams.get("kategori"),
      service_name: searchParams.get("tjeneste"),
      clinic: searchParams.get("klinikk"),
      practitioner: null,
      specialty: null,
    });
  }, [searchParams]);

  useEffect(() => {
    if (trackedStepRef.current === currentStep) return;
    trackedStepRef.current = currentStep;
    const stepName = progressAriaLabels[currentStep - 1] ?? `step_${currentStep}`;
    trackBookingStep(
      currentStep,
      stepName,
      bookingMethodForClinic(bookingData.clinic),
      {
        service_name: bookingData.service?.name ?? null,
        category: bookingData.category ?? null,
        clinic: bookingData.clinic?.label ?? null,
      },
    );
  }, [currentStep, progressAriaLabels, bookingData.clinic, bookingData.service, bookingData.category]);

  // Prefill from URL params: ?kategori=gynekologi&kategoriId=1&tjeneste=endometriose&spesialist=slug&klinikk=majorstuen
  // Jumps to the first unfilled step so users coming from a specific
  // page never have to start over.
  useEffect(() => {
    // After "Bestill time" on the empty-clinic state, do not re-lock the non-bookable service.
    if (skipServicePrefillRef.current) return;
    // Clinic may already be set from ?klinikk= (Pasientsky/Moelv) before this runs —
    // still allow service/specialist prefill. Only skip once service is chosen.
    if (bookingData.service) return;
    if (servicesLoading || bookingServices.length === 0) return;

    const kategori = searchParams.get("kategori");
    const kategoriIdRaw = searchParams.get("kategoriId");
    const tjeneste = searchParams.get("tjeneste");
    const tjenesteValg = parseTjenesteValg(searchParams.get("tjenesteValg"));
    const aktivitetIdRaw = searchParams.get("aktivitetId");
    const spesialistSlug = searchParams.get("spesialist");
    const klinikkId = searchParams.get("klinikk");
    // Specialist prefill needs the specialists list; kategori/tjeneste do not.
    if (spesialistSlug && specialists.length === 0) return;
    const kategoriId = kategoriIdRaw != null ? Number(kategoriIdRaw) : NaN;
    const aktivitetId =
      aktivitetIdRaw != null ? Number(aktivitetIdRaw) : NaN;
    const kategoriFromNumericId =
      Number.isFinite(kategoriId) && kategoriId > 0
        ? categoryNumericIdToPageId[kategoriId]
        : undefined;
    const effectiveKategori = kategori || kategoriFromNumericId;

    if (
      !effectiveKategori &&
      !kategoriIdRaw &&
      !tjeneste &&
      tjenesteValg.length === 0 &&
      !Number.isFinite(aktivitetId) &&
      !spesialistSlug &&
      !klinikkId
    ) {
      return;
    }

    // 1. Resolve category
    let resolvedCategoryListId: string | undefined;
    let resolvedCategoryClinicId: string | undefined;
    let resolvedCategoryLabel: string | undefined;
    let matchingCategory: BookingServiceCategory | undefined;

    const applyResolvedCategory = (cat: BookingServiceCategory) => {
      resolvedCategoryListId = cat.id;
      resolvedCategoryClinicId = clinicIdForCategory(cat);
      resolvedCategoryLabel = cat.label;
      setExpandedCategory(cat.id);
      setFilterToCategoryId(cat.id);
    };
    if (effectiveKategori && effectiveKategori !== "flere-fagomrader") {
      matchingCategory = findBookingCategoryForPage(effectiveKategori, bookingServices);
      if (matchingCategory) {
        applyResolvedCategory(matchingCategory);
      }
    }

    if (!matchingCategory && Number.isFinite(kategoriId) && kategoriId > 0) {
      matchingCategory = findBookingCategoryByApiGroupId(bookingServices, kategoriId);
      if (matchingCategory) {
        applyResolvedCategory(matchingCategory);
      }
    }

    // If specialist is given but no category, derive from the specialist's category
    let resolvedSpecialist: Specialist | undefined;
    if (spesialistSlug && !bookingData.specialist) {
      resolvedSpecialist = specialists.find((s) => s.slug === spesialistSlug);
      if (
        resolvedSpecialist &&
        !resolvedCategoryListId &&
        !Number.isFinite(kategoriId)
      ) {
        const derivedPageId = resolvedSpecialist.category;
        const derivedCat = findBookingCategoryForPage(derivedPageId, bookingServices);
        if (derivedCat) {
          matchingCategory = derivedCat;
          applyResolvedCategory(derivedCat);
        }
      }
    }

    // 2. Resolve specific service — prefer Metodika aktivitetId (pricing Step 2 shortcut)
    let resolvedService: BookingServiceItem | undefined;
    if (Number.isFinite(aktivitetId) && aktivitetId > 0) {
      for (const cat of bookingServices) {
        const hit = cat.services.find((s) => s.apiActivityId === aktivitetId);
        if (hit) {
          resolvedService = hit;
          if (!matchingCategory) {
            matchingCategory = cat;
            applyResolvedCategory(cat);
          }
          break;
        }
      }
      // If activity cannot be resolved: keep category context for Step 1 fallback
      // (expandedCategory / filter already set). Do not invent a service.
    }

    if (!resolvedService && tjenesteValg.length === 1 && resolvedCategoryListId) {
      const cat = bookingServices.find((c) => c.id === resolvedCategoryListId);
      if (cat) {
        const filtered = filterServicesByOptions(cat.services, tjenesteValg);
        resolvedService = resolvePreselectedService(filtered, tjenesteValg[0]);
      }
    }

    if (!resolvedService && tjeneste && resolvedCategoryListId && tjenesteValg.length === 0) {
      const cat = bookingServices.find((c) => c.id === resolvedCategoryListId);
      if (cat) {
        resolvedService = resolvePreselectedService(cat.services, tjeneste);
      }
    }

    // Multi-service choice: expand category but do not auto-select a service.
    if (tjenesteValg.length > 1 && resolvedCategoryListId) {
      setExpandedCategory(resolvedCategoryListId);
    }

    // 3. Clinic from URL is resolved after API availability loads (see effect below)

    // 4. Commit prefilled state — merge into existing clinic from ?klinikk=
    if (resolvedService || resolvedSpecialist) {
      setBookingData((prev) => {
        const next: BookingData = { ...prev };
        if (resolvedCategoryListId) next.categoryId = resolvedCategoryListId;
        if (matchingCategory?.clinicServiceId) {
          next.categoryApiSlug = matchingCategory.clinicServiceId;
        }
        if (resolvedCategoryLabel) next.category = resolvedCategoryLabel;
        if (resolvedService) next.service = resolvedService;
        if (resolvedSpecialist) {
          next.specialist = resolvedSpecialist;
          next.specialistChosen = true;
          next.firstAvailableFlow = false;
        }
        return next;
      });
    }
    // If only kategori was given (or aktivitetId failed to resolve), Step 1
    // keeps the relevant category expanded/filtered — no error page.
  }, [searchParams, specialists, bookingServices, servicesLoading, bookingData.service, bookingData.specialist]);

  // Apply ?spesialist= even when clinic was already set (Pasientsky Moelv deep link race).
  useEffect(() => {
    const spesialistSlug = searchParams.get("spesialist");
    if (!spesialistSlug || bookingData.specialist || specialists.length === 0) return;
    const match = specialists.find((s) => s.slug === spesialistSlug);
    if (!match) return;
    setBookingData((prev) => ({
      ...prev,
      specialist: match,
      specialistChosen: true,
      firstAvailableFlow: false,
    }));
  }, [searchParams, specialists, bookingData.specialist]);

  // Step 2 prefetch when a category accordion opens.
  useEffect(() => {
    if (!expandedCategory) return;
    const category = bookingServices.find((c) => c.id === expandedCategory);
    if (!category) return;
    for (const id of activityIdsForCategory(category)) {
      prefetchWbActivityMatrix(id);
    }
  }, [expandedCategory, bookingServices]);

  // Warm wbactivities matrix as soon as a treatment is chosen (step 3 caregivers).
  useEffect(() => {
    prefetchWbActivityMatrix(bookingData.service?.apiActivityId);
  }, [bookingData.service?.apiActivityId]);

  // wbfreetimes → rooms → locations: discovery (clinics + caregivers, 1 slot/day)
  useEffect(() => {
    const activityId = bookingData.service?.apiActivityId;
    if (!activityId) {
      setApiFreeTimeSlots([]);
      setApiBookingClinics([]);
      setAvailabilityFromApi(false);
      setAvailabilityLoading(false);
      setClinicsAvailabilityReady(true);
      setBookingData((prev) => ({ ...prev, activityTypeId: undefined, selectedSlot: undefined }));
      return;
    }

    let cancelled = false;
    setClinicsAvailabilityReady(false);
    setAvailabilityLoading(true);

    async function loadDiscovery() {
      try {
        const res = await fetch(`/api/booking/availability?wbactivityId=${activityId}`);
        const json = (await res.json()) as {
          ok?: boolean;
          slots?: ApiFreeTimeSlot[];
          locations?: { locationId: number; name: string; roomIds: number[] }[];
          activityTypeId?: number;
        };
        if (cancelled) return;

        if (res.ok && json.ok && Array.isArray(json.slots)) {
          setApiFreeTimeSlots(json.slots);
          const mappedClinics = Array.isArray(json.locations)
            ? json.locations
                .map(apiLocationToClinic)
                .filter((clinic) => !isPlaceholderMetodikaLocationLabel(clinic.label))
            : [];
          setApiBookingClinics(mappedClinics);
          setAvailabilityFromApi(mappedClinics.length > 0);
          setBookingData((prev) => ({
            ...prev,
            activityTypeId:
              typeof json.activityTypeId === "number" ? json.activityTypeId : undefined,
          }));
        } else {
          setApiFreeTimeSlots([]);
          setApiBookingClinics([]);
          setAvailabilityFromApi(false);
        }
      } catch {
        if (!cancelled) {
          setApiFreeTimeSlots([]);
          setApiBookingClinics([]);
          setAvailabilityFromApi(false);
        }
      } finally {
        if (!cancelled) {
          setAvailabilityLoading(false);
          setClinicsAvailabilityReady(true);
        }
      }
    }

    loadDiscovery();
    return () => {
      cancelled = true;
    };
  }, [bookingData.service?.apiActivityId]);

  const slotsFetchContextKey = [
    bookingData.service?.apiActivityId ?? "",
    bookingData.clinic && "apiLocationId" in (bookingData.clinic ?? {})
      ? (bookingData.clinic as BookingMetodikaClinic).apiLocationId
      : "",
    resolveBookingCaregiverUserId(bookingData.specialist) ?? "",
  ].join(":");

  // Clear per-day slot cache when service, clinic, or specialist changes
  useEffect(() => {
    slotsByDayRef.current = {};
    setSlotsByDayKey({});
    step4CalendarInitKeyRef.current = null;
    setSelectedDate(undefined);
  }, [slotsFetchContextKey]);

  const prefetchDaySlots = useCallback(
    (date: Date) => {
      const activityId = bookingData.service?.apiActivityId;
      const selectedLocationId =
        bookingData.clinic && "apiLocationId" in bookingData.clinic
          ? bookingData.clinic.apiLocationId
          : undefined;
      if (!activityId || selectedLocationId == null) return;

      const key = dayKey(date);
      if (slotsByDayRef.current[key]) return;

      const caregiverUserId = resolveBookingCaregiverUserId(bookingData.specialist);
      void fetchBookingDaySlotsClient({
        wbactivityId: activityId,
        date,
        locationId: selectedLocationId,
        caregiverUserId: caregiverUserId ?? undefined,
      }).then((slots) => {
        if (slotsByDayRef.current[key]) return;
        slotsByDayRef.current[key] = slots;
        setSlotsByDayKey((prev) => (prev[key] ? prev : { ...prev, [key]: slots }));
      });
    },
    [bookingData.service?.apiActivityId, bookingData.clinic, bookingData.specialist],
  );

  // Fetch alltimes for the selected day — fast /api/booking/day-slots
  useEffect(() => {
    const activityId = bookingData.service?.apiActivityId;
    const selectedLocationId =
      bookingData.clinic && "apiLocationId" in bookingData.clinic
        ? bookingData.clinic.apiLocationId
        : undefined;

    if (
      currentStep !== 4 ||
      !selectedDate ||
      !activityId ||
      selectedLocationId == null
    ) {
      setTimesLoading(false);
      return;
    }

    const key = dayKey(selectedDate);
    const cached = slotsByDayRef.current[key];
    if (cached) {
      setTimesLoading(false);
      return;
    }

    const caregiverUserId = resolveBookingCaregiverUserId(bookingData.specialist);
    const peeked = peekBookingDaySlotsClient({
      wbactivityId: activityId,
      date: selectedDate,
      locationId: selectedLocationId,
      caregiverUserId: caregiverUserId ?? undefined,
    });
    if (peeked) {
      slotsByDayRef.current[key] = peeked;
      setSlotsByDayKey((prev) => ({ ...prev, [key]: peeked }));
      setTimesLoading(false);
      return;
    }

    const fetchGen = ++daySlotsFetchGenRef.current;
    let cancelled = false;
    setTimesLoading(true);

    void fetchBookingDaySlotsClient({
      wbactivityId: activityId,
      date: selectedDate,
      locationId: selectedLocationId,
      caregiverUserId: caregiverUserId ?? undefined,
    })
      .then((slots) => {
        if (cancelled || fetchGen !== daySlotsFetchGenRef.current) return;
        slotsByDayRef.current[key] = slots;
        setSlotsByDayKey((prev) => ({ ...prev, [key]: slots }));
      })
      .catch(() => {
        if (cancelled || fetchGen !== daySlotsFetchGenRef.current) return;
        slotsByDayRef.current[key] = [];
        setSlotsByDayKey((prev) => ({ ...prev, [key]: [] }));
      })
      .finally(() => {
        if (!cancelled && fetchGen === daySlotsFetchGenRef.current) {
          setTimesLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    currentStep,
    selectedDate,
    bookingData.service?.apiActivityId,
    bookingData.clinic && "apiLocationId" in (bookingData.clinic ?? {})
      ? (bookingData.clinic as BookingMetodikaClinic).apiLocationId
      : undefined,
    bookingData.specialist,
    slotsFetchContextKey,
  ]);

  const hasApiActivity = Boolean(bookingData.service?.apiActivityId);

  const { activity: wbActivityMatrix } = useWbActivityMatrix(
    bookingData.service?.apiActivityId,
  );

  const matrixMetodikaClinics = useMemo(
    () => metodikaClinicsFromMatrix(sanityClinics, wbActivityMatrix),
    [sanityClinics, wbActivityMatrix],
  );

  const metodikaClinicsForStep2 = useMemo(() => {
    if (matrixMetodikaClinics.length > 0) return matrixMetodikaClinics;
    return enrichedMetodikaClinics.filter(
      (clinic) => !isPlaceholderMetodikaLocationLabel(clinic.label),
    );
  }, [matrixMetodikaClinics, enrichedMetodikaClinics]);

  // Prefill clinic from ?klinikk=
  const pendingKlinikkRef = useRef<string | null>(null);
  useEffect(() => {
    pendingKlinikkRef.current = searchParams.get("klinikk");
  }, [searchParams]);

  useEffect(() => {
    const klinikk = pendingKlinikkRef.current;
    if (!klinikk || bookingData.clinic) return;

    const allowClinic = (clinic: BookingClinic) => {
      if (!bookingData.specialistChosen || !bookingData.specialist) return true;
      return clinicAllowedForSpecialist(
        clinic,
        bookingData.specialist,
        apiFreeTimeSlots,
        wbActivityMatrix,
      );
    };

    const sanityRow = findSanityClinicBySlugOrId(sanityClinics, klinikk);
    if (sanityRow) {
      const managed = findSanityManagedClinicBySlug(sanityClinics, klinikk);
      if (managed) {
        if (!allowClinic(managed)) {
          pendingKlinikkRef.current = null;
          return;
        }
        setBookingData((prev) => ({ ...prev, clinic: managed }));
        pendingKlinikkRef.current = null;
        return;
      }

      const metodikaFromSanity = metodikaClinicFromSanityRow(sanityRow);
      if (metodikaFromSanity && allowClinic(metodikaFromSanity)) {
        setBookingData((prev) => ({ ...prev, clinic: metodikaFromSanity }));
        pendingKlinikkRef.current = null;
        return;
      }
    }

    if (!bookingData.service?.apiActivityId) return;
    if (!availabilityFromApi || enrichedMetodikaClinics.length === 0) return;

    const bySanitySlug = sanityRow
      ? enrichedMetodikaClinics.find((c) => c.sanityClinicId === sanityRow.id)
      : undefined;
    const byId = enrichedMetodikaClinics.find(
      (c) => c.id === klinikk || c.id === `location-${klinikk}`,
    );
    const bySlug = enrichedMetodikaClinics.find((c) =>
      c.label.toLowerCase().includes(klinikk.replace(/-/g, " ")),
    );
    const match = bySanitySlug ?? byId ?? bySlug;
    if (match) {
      if (!allowClinic(match)) {
        pendingKlinikkRef.current = null;
        return;
      }
      setBookingData((prev) => ({ ...prev, clinic: match }));
      pendingKlinikkRef.current = null;
    }
  }, [
    availabilityFromApi,
    enrichedMetodikaClinics,
    bookingData.clinic,
    bookingData.service?.apiActivityId,
    bookingData.specialist,
    bookingData.specialistChosen,
    apiFreeTimeSlots,
    sanityClinics,
    wbActivityMatrix,
  ]);

  // Direct Sanity-managed deep link: /booking?klinikk=moelv|moss (no Metodika service required)
  useEffect(() => {
    const klinikk = searchParams.get("klinikk");
    if (!klinikk || bookingData.clinic || bookingData.service) return;

    const sanityMatch = findSanityManagedClinicBySlug(sanityClinics, klinikk);
    if (sanityMatch) {
      // Preserve specialist/category already resolved from ?spesialist=
      setBookingData((prev) => ({ ...prev, clinic: sanityMatch }));
    }
  }, [searchParams, sanityClinics, bookingData.clinic, bookingData.service]);

  const pasientskyTimeslotTypeId = useMemo(() => {
    if (!isPasientskyBooking || !bookingData.service?.apiActivityId) return undefined;
    return resolvePasientskyTimeslotTypeId({
      clinic: selectedSanityClinic,
      metodikaActivityId: bookingData.service.apiActivityId,
      serviceName: bookingData.service.name,
    });
  }, [
    isPasientskyBooking,
    bookingData.service?.apiActivityId,
    bookingData.service?.name,
    selectedSanityClinic,
  ]);

  const selectedCaregiverUserId = resolveBookingCaregiverUserId(
    bookingData.specialist,
  );

  const caregiverByUserId = useMemo(() => {
    const map = new Map<number, BookingCaregiver>();
    for (const caregiver of bookingCaregivers) {
      map.set(caregiver.apiUserId, caregiver);
    }
    return map;
  }, [bookingCaregivers]);

  const caregiverIdsFromSlots = useMemo(() => {
    if (!hasApiActivity) return [];
    const selectedLocationId =
      bookingData.clinic && "apiLocationId" in bookingData.clinic
        ? bookingData.clinic.apiLocationId
        : undefined;

    if (wbActivityMatrix && selectedLocationId != null) {
      const fromMatrix = caregiverIdsForWbActivityAtLocation(
        wbActivityMatrix,
        selectedLocationId,
      );
      if (fromMatrix.length > 0) return fromMatrix;
    }

    const ids = new Set<number>();
    for (const slot of apiFreeTimeSlots) {
      if (
        selectedLocationId != null &&
        slot.locationId != null &&
        slot.locationId !== selectedLocationId
      ) {
        continue;
      }
      if (slot.caregiverUserId != null) ids.add(slot.caregiverUserId);
    }
    return [...ids].sort((a, b) => a - b);
  }, [hasApiActivity, apiFreeTimeSlots, bookingData.clinic, wbActivityMatrix]);

  useEffect(() => {
    if (!hasApiActivity || caregiverIdsFromSlots.length === 0) {
      setBookingCaregivers([]);
      setCaregiversLoading(false);
      return;
    }

    const specialty = bookingData.category ?? "";
    const peeked = peekBookingUsersClient(caregiverIdsFromSlots, specialty);
    if (peeked) {
      setBookingCaregivers(peeked);
      setCaregiversLoading(false);
      return;
    }

    let cancelled = false;
    setCaregiversLoading(true);

    void fetchBookingUsersClient(caregiverIdsFromSlots, specialty)
      .then((users) => {
        if (!cancelled) setBookingCaregivers(users);
      })
      .catch(() => {
        if (!cancelled) setBookingCaregivers([]);
      })
      .finally(() => {
        if (!cancelled) setCaregiversLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [hasApiActivity, caregiverIdsFromSlots, bookingData.category]);

  const step3Caregivers: (Specialist | BookingCaregiver)[] = hasApiActivity
    ? bookingCaregivers
    : specialists;

  const datesWithApiSlots = useMemo(() => {
    const selectedLocationId =
      bookingData.clinic && "apiLocationId" in bookingData.clinic
        ? bookingData.clinic.apiLocationId
        : undefined;
    const keys = new Set<string>();

    const addFromSlots = (slots: ApiFreeTimeSlot[]) => {
      for (const slot of slots) {
        if (
          selectedLocationId != null &&
          slot.locationId != null &&
          slot.locationId !== selectedLocationId
        ) {
          continue;
        }
        if (
          selectedCaregiverUserId != null &&
          slot.caregiverUserId != null &&
          slot.caregiverUserId !== selectedCaregiverUserId
        ) {
          continue;
        }
        keys.add(dayKey(parseISO(slot.startDateTime)));
      }
    };

    addFromSlots(apiFreeTimeSlots);

    for (const [key, slots] of Object.entries(slotsByDayKey)) {
      if (slots.length > 0) keys.add(key);
    }

    return keys;
  }, [
    apiFreeTimeSlots,
    bookingData.clinic,
    selectedCaregiverUserId,
    slotsByDayKey,
  ]);

  const currentWeekStart = useMemo(
    () => startOfWeek(today, { weekStartsOn: CALENDAR_WEEK_STARTS_ON }),
    [today],
  );

  const visibleWeekStart = useMemo(
    () => addWeeks(currentWeekStart, weekOffset),
    [currentWeekStart, weekOffset],
  );

  const visibleDates = useMemo(
    () => Array.from({ length: VISIBLE_DAYS }, (_, i) => addDays(visibleWeekStart, i)),
    [visibleWeekStart],
  );

  const bookableDates = useMemo(() => {
    const dates: Date[] = [];
    for (const key of datesWithApiSlots) {
      dates.push(new Date(key));
    }
    dates.sort((a, b) => a.getTime() - b.getTime());
    return dates.filter((d) => d >= today);
  }, [datesWithApiSlots, today]);

  const canGoPrevRange = weekOffset > 0;
  const canGoNextRange = weekOffset < MAX_CALENDAR_WEEKS;
  const step4NoBookableDays =
    hasApiActivity && clinicsAvailabilityReady && bookableDates.length === 0;

  // Prefetch day slots so step 4 times appear instantly from cache.
  useEffect(() => {
    if (currentStep < 3 || !hasApiActivity || !clinicsAvailabilityReady) return;
    const selectedLocationId =
      bookingData.clinic && "apiLocationId" in bookingData.clinic
        ? bookingData.clinic.apiLocationId
        : undefined;
    if (selectedLocationId == null) return;

    bookableDates.slice(0, 3).forEach(prefetchDaySlots);
    visibleDates.forEach((date) => {
      if (date >= today && datesWithApiSlots.has(dayKey(date))) {
        prefetchDaySlots(date);
      }
    });
  }, [
    currentStep,
    hasApiActivity,
    clinicsAvailabilityReady,
    bookableDates,
    visibleDates,
    datesWithApiSlots,
    today,
    prefetchDaySlots,
    bookingData.clinic,
  ]);

  // Pick first API day with slots when entering step 4 (no static default date)
  useEffect(() => {
    if (currentStep !== 4 || !hasApiActivity) return;

    const selectedLocationId =
      bookingData.clinic && "apiLocationId" in bookingData.clinic
        ? bookingData.clinic.apiLocationId
        : undefined;
    if (selectedLocationId != null && !clinicsAvailabilityReady) return;

    const initKey = slotsFetchContextKey;
    if (
      step4CalendarInitKeyRef.current === initKey &&
      selectedDate != null &&
      selectedDate >= today &&
      datesWithApiSlots.has(dayKey(selectedDate))
    ) {
      return;
    }

    const firstDay = bookableDates[0];
    if (!firstDay) {
      step4CalendarInitKeyRef.current = initKey;
      setSelectedDate(undefined);
      return;
    }
    step4CalendarInitKeyRef.current = initKey;
    setSelectedDate(firstDay);
    prefetchDaySlots(firstDay);
    setWeekOffset(Math.max(0, Math.min(MAX_CALENDAR_WEEKS, weekOffsetForDate(firstDay, today))));
  }, [
    currentStep,
    hasApiActivity,
    clinicsAvailabilityReady,
    bookableDates,
    selectedDate,
    today,
    bookingData.clinic,
    datesWithApiSlots,
    slotsFetchContextKey,
    prefetchDaySlots,
  ]);

  // Keep selected day visible in the 7-day stripe when selection changes
  useEffect(() => {
    if (!selectedDate) return;
    const offset = weekOffsetForDate(selectedDate, today);
    if (offset < 0 || offset > MAX_CALENDAR_WEEKS) return;
    setWeekOffset((prev) => {
      if (offset === prev) return prev;
      return offset;
    });
  }, [selectedDate, today]);

  const selectedDaySlots = useMemo(() => {
    if (!selectedDate) return [];
    return slotsByDayKey[dayKey(selectedDate)] ?? [];
  }, [selectedDate, slotsByDayKey]);

  const availableSlots = useMemo((): DisplayTimeSlot[] => {
    if (!selectedDate || !hasApiActivity) return [];

    const selectedLocationId =
      bookingData.clinic && "apiLocationId" in bookingData.clinic
        ? bookingData.clinic.apiLocationId
        : undefined;

    return selectedDaySlots
      .filter(
        (slot) =>
          selectedLocationId == null ||
          slot.locationId == null ||
          slot.locationId === selectedLocationId,
      )
      .filter(
        (slot) =>
          selectedCaregiverUserId == null ||
          slot.caregiverUserId == null ||
          slot.caregiverUserId === selectedCaregiverUserId,
      )
      .map((slot) => ({
        time: slot.time,
        startDateTime: slot.startDateTime,
        durationMinutes: slot.durationMinutes,
        lengthTime: slot.lengthTime,
        caregiverUserId: slot.caregiverUserId,
        roomId: slot.roomId,
      }))
      .sort(
        (a, b) =>
          new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime(),
      );
  }, [
    selectedDate,
    selectedDaySlots,
    hasApiActivity,
    bookingData.clinic && "apiLocationId" in bookingData.clinic
      ? bookingData.clinic.apiLocationId
      : undefined,
    selectedCaregiverUserId,
  ]);

  const selectedDayDurationLabel = useMemo(() => {
    if (!selectedDate || selectedDaySlots.length === 0) return null;
    const mins = selectedDaySlots.find((slot) => slot.durationMinutes != null)?.durationMinutes;
    if (mins == null) return null;
    return localizeDurationLabel(formatDurationMinutes(mins, locale), locale);
  }, [selectedDate, selectedDaySlots, locale]);

  const handleClose = () => {
    trackBookingClose();
    const returnTo = resolveBookingReturnPath(searchParams, "/");
    navigate(returnTo);
  };

  /** Prevents re-auto-selecting clinic after user goes back from step 3. */
  const autoSelectedClinicActivityRef = useRef<number | null>(null);

  const handleBookAnotherWay = () => {
    skipServicePrefillRef.current = true;
    autoSelectedClinicActivityRef.current = null;
    setClinicsAvailabilityReady(false);
    setBookingData({});
    setExpandedCategory(null);
    setFilterToCategoryId(null);

    const next = new URLSearchParams(searchParams.toString());
    for (const key of ["aktivitetId", "tjeneste", "tjenesteValg"]) {
      next.delete(key);
    }
    const qs = next.toString();
    navigate(qs ? `${pathname}?${qs}` : pathname, { replace: true });
  };

  const handleSelectService = (
    categoryId: string,
    categoryLabel: string,
    service: BookingServiceItem,
    categoryApiSlug?: string,
  ) => {
    trackBookingStart("metodika");
    trackBookingSelectCategory({
      category: categoryLabel,
      service_name: service.name,
      booking_method: "metodika",
    });
    autoSelectedClinicActivityRef.current = null;
    setClinicsAvailabilityReady(false);
    prefetchWbActivityMatrix(service.apiActivityId);

    setBookingData({
      categoryId: categoryId,
      categoryApiSlug,
      category: categoryLabel,
      service,
      clinic: undefined,
      specialistChosen: false,
      firstAvailableFlow: undefined,
      date: undefined,
      time: undefined,
      specialist: undefined,
      slotDurationMinutes: undefined,
      selectedSlot: undefined,
      activityTypeId: undefined,
    });
  };

  const sanityManagedClinicOptions = useMemo(
    () =>
      sanityManagedClinicsForCategory(
        sanityClinics,
        bookingData.categoryId,
        bookingData.categoryApiSlug,
      ),
    [sanityClinics, bookingData.categoryId, bookingData.categoryApiSlug],
  );

  const prefetchCaregiversForClinic = useCallback(
    (clinic: BookingClinic) => {
      if (!hasApiActivity || !wbActivityMatrix || !isMetodikaClinic(clinic)) return;
      const ids = caregiverIdsForWbActivityAtLocation(
        wbActivityMatrix,
        clinic.apiLocationId,
      );
      if (ids.length === 0) return;
      void fetchBookingUsersClient(ids, bookingData.category ?? undefined);
    },
    [hasApiActivity, wbActivityMatrix, bookingData.category],
  );

  useEffect(() => {
    const clinic = bookingData.clinic;
    if (!clinic || !isMetodikaClinic(clinic) || !wbActivityMatrix) return;
    prefetchCaregiversForClinic(clinic);
  }, [bookingData.clinic, wbActivityMatrix, prefetchCaregiversForClinic]);

  // Step 2: Metodika locations (enriched from Sanity) + Pasientsky / external from Sanity.
  // When a specialist is already chosen (e.g. ?spesialist=), only show clinics where they work.
  const availableClinics: BookingClinic[] = useMemo(() => {
    const metodika = bookingData.service?.apiActivityId ? metodikaClinicsForStep2 : [];
    const metodikaForActivity = filterClinicsForWbActivity(metodika, wbActivityMatrix);
    const merged = mergeMetodikaAndSanityClinics(metodikaForActivity, sanityManagedClinicOptions);
    if (!bookingData.specialistChosen || !bookingData.specialist) return merged;
    return filterClinicsForPreselectedSpecialist(
      merged,
      bookingData.specialist,
      apiFreeTimeSlots,
      wbActivityMatrix,
    );
  }, [
    bookingData.service?.apiActivityId,
    bookingData.specialist,
    bookingData.specialistChosen,
    metodikaClinicsForStep2,
    sanityManagedClinicOptions,
    apiFreeTimeSlots,
    wbActivityMatrix,
  ]);

  const step2Ready =
    !bookingData.service?.apiActivityId ||
    matrixMetodikaClinics.length > 0 ||
    clinicsAvailabilityReady;

  // Auto-select when exactly one clinic is available (once per service; not after "Tilbake")
  useEffect(() => {
    const activityId = bookingData.service?.apiActivityId;
    if (!activityId || bookingData.clinic) return;
    if (pendingKlinikkRef.current?.trim()) return;
    if (!step2Ready) return;
    if (availableClinics.length !== 1) return;
    if (autoSelectedClinicActivityRef.current === activityId) return;

    autoSelectedClinicActivityRef.current = activityId;
    const onlyClinic = availableClinics[0];
    prefetchCaregiversForClinic(onlyClinic);
    setBookingData((prev) => ({
      ...prev,
      clinic: onlyClinic,
      // Keep preselected specialist when auto-picking their only clinic
      specialist: prev.specialist,
      specialistChosen: prev.specialistChosen,
    }));
  }, [
    bookingData.service?.apiActivityId,
    bookingData.clinic,
    step2Ready,
    availableClinics,
    prefetchCaregiversForClinic,
  ]);

  const handleSelectClinic = (clinic: BookingClinic) => {
    trackBookingSelectClinic(clinic);
    prefetchCaregiversForClinic(clinic);
    const keepSpecialist =
      Boolean(bookingData.specialistChosen) &&
      Boolean(bookingData.specialist) &&
      clinicAllowedForSpecialist(
        clinic,
        bookingData.specialist,
        apiFreeTimeSlots,
        wbActivityMatrix,
      );

    setBookingData({
      ...bookingData,
      clinic,
      specialistChosen: keepSpecialist || Boolean(bookingData.firstAvailableFlow),
      firstAvailableFlow: keepSpecialist ? false : bookingData.firstAvailableFlow,
      date: undefined,
      time: undefined,
      specialist: keepSpecialist ? bookingData.specialist : undefined,
      slotDurationMinutes: undefined,
      selectedSlot: undefined,
    });

    if (isMetodikaClinic(clinic) && wbActivityMatrix) {
      const ids = caregiverIdsForWbActivityAtLocation(
        wbActivityMatrix,
        clinic.apiLocationId,
      );
      const specialty = bookingData.category ?? "";
      const peeked = peekBookingUsersClient(ids, specialty);
      setBookingCaregivers(peeked ?? []);
    } else {
      setBookingCaregivers([]);
    }

    setWeekOffset(0);
    slotsByDayRef.current = {};
    setSlotsByDayKey({});
  };

  const handleSelectTimeSlot = (slot: DisplayTimeSlot) => {
    const roomId = slot.roomId;
    const slotCaregiver =
      slot.caregiverUserId != null
        ? caregiverByUserId.get(slot.caregiverUserId)
        : undefined;
    const caregiverUserId =
      resolveBookingCaregiverUserId(bookingData.specialist) ??
      slot.caregiverUserId;

    const resolvedSpecialist: Specialist | BookingCaregiver | undefined =
      bookingData.specialist ??
      (slotCaregiver
        ? resolveSanitySpecialistForCaregiver(slotCaregiver, specialists) ??
          slotCaregiver
        : undefined);

    const lengthTime =
      slot.lengthTime?.trim() ||
      (slot.durationMinutes != null ? minutesToLengthTime(slot.durationMinutes) : "00:30:00");

    if (roomId == null || caregiverUserId == null) return;

    setBookingData({
      ...bookingData,
      date: selectedDate,
      time: slot.time,
      specialist: resolvedSpecialist,
      slotDurationMinutes: slot.durationMinutes,
      selectedSlot: {
        startDateTime: slot.startDateTime,
        time: slot.time,
        roomId,
        caregiverUserId,
        durationMinutes: slot.durationMinutes,
        lengthTime,
      },
    });
  };

  const handleSubmit = async () => {
    if (
      !formData.acceptTerms ||
      !formData.acceptDataProcessing ||
      !formData.firstName ||
      !formData.lastName ||
      !formData.phone ||
      !isValidNorwegianMobileFieldInput(formData.phone) ||
      !formData.birthNumber
    ) {
      return;
    }

    const activityId = bookingData.service?.apiActivityId;
    const slot = bookingData.selectedSlot;

    if (!activityId || !slot) {
      setSubmitError(copy.errorMissingData);
      return;
    }

    if (bookingData.activityTypeId == null) {
      setSubmitError(copy.errorActivityType);
      return;
    }

    if (!isFodselsnummerReadyForSubmit(formData.birthNumber)) {
      setBirthNumberError(
        fodselsnummerFieldError(formData.birthNumber, copy.errorInvalidBirthNumber, {
          markIncomplete: true,
        }),
      );
      return;
    }

    setSubmitLoading(true);
    setSubmitError(null);
    setBirthNumberError(null);

    const completedTracking = metodikaBookingCompletedFromState({
      clinic: bookingData.clinic,
      service: bookingData.service,
      category: bookingData.category,
      specialist: bookingData.specialist,
      slot: bookingData.selectedSlot,
    });

    trackBookingSubmitted({
      booking_method: "metodika",
      clinic: bookingData.clinic?.label ?? null,
      service_name: bookingData.service?.name ?? null,
    });

    try {
      const res = await fetch("/api/booking/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            firstname: formData.firstName.trim(),
            lastname: formData.lastName.trim(),
            email: formData.email.trim(),
            mobile: normalizeNorwegianMobileForMetodika(formData.phone),
            personalnumber: formData.birthNumber,
            newsletter: formData.acceptMarketing,
          },
          appointment: {
            wbactivityId: activityId,
            activityTypeId: bookingData.activityTypeId,
            mainCaregiverUserId: slot.caregiverUserId,
            roomId: slot.roomId,
            starttime: slot.startDateTime,
            lengthtime: slot.lengthTime,
            note: formData.note.trim() || undefined,
            smsreminder: true,
            smsconfirmation: true,
            emailconfirmation: true,
            createifnotexists: true,
          },
        }),
      });

      const json = (await res.json()) as {
        ok?: boolean;
        message?: string;
        code?: string;
        appointmentId?: string | number;
      };

      if (!res.ok || !json.ok) {
        if (json.code === "INVALID_PERSONALNUMBER") {
          setBirthNumberError(copy.errorInvalidBirthNumber);
          trackBookingFailed({
            error_type: "invalid_personalnumber",
            booking_method: "metodika",
          });
          return;
        }
        trackBookingFailed({
          error_type: json.code ?? "api_error",
          booking_method: "metodika",
        });
        setSubmitError(
          json.message ??
            copy.errorSubmit,
        );
        return;
      }

      if (json.appointmentId != null && String(json.appointmentId).trim()) {
        trackBookingCompleted({
          booking_method: "metodika",
          transaction_id: json.appointmentId,
          ...completedTracking,
        });
        bookingCompletedTrackedRef.current = true;
      }

      setIsSubmitted(true);
    } catch {
      trackBookingFailed({
        error_type: "network",
        booking_method: "metodika",
      });
      setSubmitError(
        copy.errorSubmitNetwork,
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const stepNumberForResetTarget = (
    step: "category" | "clinic" | "specialist" | "time",
  ): number => {
    switch (step) {
      case "category":
        return 1;
      case "clinic":
        return 2;
      case "specialist":
        return 3;
      case "time":
        return 4;
      default:
        return 1;
    }
  };

  const resetStep = (step: 'category' | 'clinic' | 'specialist' | 'time') => {
    const toStep = stepNumberForResetTarget(step);
    if (currentStep > toStep) {
      trackBookingBack({
        from_step: currentStep,
        to_step: toStep,
        booking_method: bookingMethodForClinic(bookingData.clinic),
      });
    }
    if (step === 'category') {
      autoSelectedClinicActivityRef.current = null;
      setBookingData({});
      setExpandedCategory(null);
    } else if (step === 'clinic') {
      setBookingData({
        ...bookingData,
        clinic: undefined,
        specialistChosen: false,
        firstAvailableFlow: undefined,
        date: undefined,
        time: undefined,
        specialist: undefined,
        slotDurationMinutes: undefined,
        selectedSlot: undefined,
      });
    } else if (step === 'specialist') {
      setBookingData({
        ...bookingData,
        specialistChosen: false,
        firstAvailableFlow: undefined,
        specialist: undefined,
        date: undefined,
        time: undefined,
        slotDurationMinutes: undefined,
        selectedSlot: undefined,
      });
    } else if (step === 'time') {
      setBookingData({
        ...bookingData,
        date: undefined,
        time: undefined,
        specialist: bookingData.firstAvailableFlow ? undefined : bookingData.specialist,
        slotDurationMinutes: undefined,
        selectedSlot: undefined,
      });
    }
  };

  // Confirmation screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#f5f4f0] flex items-center justify-center p-6">
        <BookingPageAnalytics />
        <div className="max-w-lg w-full text-center">
          <div className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-background" />
          </div>
          
          <h1 className="text-3xl font-light text-foreground mb-2">
            {copy.successTitle}
          </h1>
          <p className="text-muted-foreground mb-8 font-light">
            {formData.email ? copy.successMessageSmsEmail : copy.successMessageSms}
          </p>
          
          <div className="bg-white rounded-lg p-6 text-left mb-6">
            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">{copy.successLabelTreatment}</span>
                <span className="methodika-sentence-case font-medium">{bookingData.service?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">{copy.successLabelClinic}</span>
                <span className="font-medium">{copy.successClinicPrefix}{bookingData.clinic?.label}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">{copy.successLabelDateTime}</span>
                <span className="font-medium">{bookingData.date && formatBookingShortDate(bookingData.date, locale)} kl. {bookingData.time}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">{copy.successLabelSpecialist}</span>
                <span className="font-medium">{bookingData.specialist?.name}</span>
              </div>
            </div>
          </div>
          
          <Button
            onClick={() => navigate("/")} 
            className="bg-foreground text-background hover:bg-foreground/90 px-8 py-3 rounded-lg font-normal"
          >
            {copy.successBackHome}
          </Button>

          <BookingSupportFooter text={copy.supportFooterText} phone={copy.supportPhone} />
        </div>
      </div>
    );
  }

  const progressBackTarget = isPasientskyBooking
    ? pasientskyDirectIframe
      ? ("clinic" as const)
      : !bookingData.service
        ? ("category" as const)
        : bookingData.clinic
          ? ("clinic" as const)
          : ("category" as const)
    : isSanityManagedBooking
      ? bookingData.service
        ? ("clinic" as const)
        : ("category" as const)
      : (["category", "clinic", "specialist", "time"] as const)[currentStep - 2];

  return (
    <div className="min-h-screen bg-white">
      <BookingPageAnalytics />
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-brand-dark/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="w-9" aria-hidden="true" />
          <h1 className="text-sm text-brand-dark">{copy.pageTitle}</h1>
          <button
            onClick={handleClose}
            className="p-2 -mr-2 hover:bg-brand-dark/5 rounded-full transition-colors"
            aria-label={copy.closeAriaLabel}
          >
            <X className="w-5 h-5 text-brand-dark" aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-8 pb-16 md:pb-20 max-w-2xl">
        <GeoPageEnhancements
          name={copy.pageTitle}
          geoSummary={bookingGeoSummary}
          fallbackDescription={copy.step1Heading}
          path="/booking"
          locale={locale}
          className="mb-6"
        />
        {/* Step Indicator */}
        {!isExternalBooking && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2 px-1">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => progressBackTarget && resetStep(progressBackTarget)}
                  className="flex items-center gap-1 text-xs font-light text-brand-dark hover:text-brand-dark/70 transition-colors"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span className="underline">{copy.backLabel}</span>
                  <span className="text-brand-dark/60 ml-2">· {stepProgressLabel(currentStep)}</span>
                </button>
              ) : (
                <span className="text-xs font-light text-brand-dark/60">{stepProgressLabel(currentStep)}</span>
              )}
              <span className={cn(
                "text-xs text-brand-dark",
                currentStep === totalSteps ? "font-medium" : "font-normal",
              )}>
                {stepNameByIndex[currentStep]}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {progressStepNumbers.map((step) => {
                const canNavigate = currentStep > step;
                const isActive = currentStep === step;
                const isDone = currentStep > step;
                const labels = progressAriaLabels;
                return (
                  <button
                    key={step}
                    type="button"
                    onClick={() => {
                      if (!canNavigate) return;
                      if (isPasientskyBooking) {
                        if (step === 1) resetStep("category");
                        else if (step === 2) resetStep("clinic");
                        return;
                      }
                      if (step === 1) resetStep("category");
                      else if (step === 2) resetStep("clinic");
                      else if (step === 3) resetStep("specialist");
                      else if (step === 4) resetStep("time");
                    }}
                    disabled={!canNavigate && !isActive}
                    aria-label={`Steg ${step}: ${labels[step - 1]}`}
                    aria-current={isActive ? "step" : undefined}
                    className={cn(
                      "flex-1 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2",
                      isActive ? "h-1 bg-brand-dark" : "h-1 bg-brand-dark/10",
                      isDone && "hover:bg-brand-dark/20 cursor-pointer",
                      !isDone && !isActive && "cursor-not-allowed",
                    )}
                  />
                );
              })}
            </div>
          </div>
        )}
        {/* Persistent Summary Banner */}
        {((bookingData.service && !isExternalBooking) ||
          (pasientskyDirectIframe && !isExternalBooking)) && (
          <div className="bg-brand-beige/30 border border-brand-dark/10 rounded-2xl p-4 mb-6 text-sm">
            <div className="flex flex-wrap gap-x-6 gap-y-1">
              {bookingData.service && (
                <div className="min-w-0">
                  <span className="text-brand-dark/60 text-xs">{copy.summaryServiceLabel} </span>
                  <span className="methodika-sentence-case font-normal text-brand-dark">
                    {bookingData.service.name}
                  </span>
                </div>
              )}
              {bookingData.clinic && (
                <div>
                  <span className="text-brand-dark/60 text-xs">{copy.summaryClinicLabel} </span>
                  <span className="font-normal text-brand-dark">{bookingData.clinic.label}</span>
                </div>
              )}
              {(bookingData.specialist ?? pasientskySpecialist) && (
                <div>
                  <span className="text-brand-dark/60 text-xs">{copy.summarySpecialistLabel} </span>
                  <span className="font-normal text-brand-dark">
                    {(bookingData.specialist ?? pasientskySpecialist)?.name}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        {isSanityManagedBooking &&
          !isExternalBooking &&
          !pasientskyDirectIframe &&
          !bookingData.service &&
          bookingData.clinic && (
          <div className="bg-brand-beige/30 border border-brand-dark/10 rounded-2xl p-4 mb-6 text-sm">
            <div>
              <span className="text-brand-dark/60 text-xs">{copy.summaryClinicLabel} </span>
              <span className="font-normal text-brand-dark">{bookingData.clinic.label}</span>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {isPasientskyBooking &&
          bookingData.clinic &&
          (bookingData.service || pasientskyDirectIframe) &&
          isPasientskyClinic(bookingData.clinic) ? (
            <motion.div
              key="pasientsky"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="-mx-4"
            >
              <PatientskyIframe
                serviceProviderId={bookingData.clinic.serviceProviderId}
                specialistName={pasientskySpecialist?.name}
                specialistTitle={pasientskySpecialist?.title}
                specialistCalendarId={pasientskyCalendarIdForSpecialist(
                  pasientskySpecialist,
                )}
                timeslotTypeId={pasientskyTimeslotTypeId}
                metodikaActivityId={bookingData.service?.apiActivityId}
                serviceName={bookingData.service?.name}
              />
            </motion.div>
          ) : isExternalBooking &&
            bookingData.clinic &&
            isExternalClinic(bookingData.clinic) ? (
            <motion.div
              key="external"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ExternalBookingHandoff
                clinicLabel={bookingData.clinic.label}
                externalBookingUrl={bookingData.clinic.externalBookingUrl}
                address={selectedSanityClinic?.address}
                phone={selectedSanityClinic?.phone}
                hours={selectedSanityClinic?.hours}
              />
            </motion.div>
          ) : !bookingData.service ? (
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
                  ? fillBookingTemplate(copy.step1HeadingFiltered, {
                      category:
                        bookingServices.find((c) => c.id === filterToCategoryId)?.label ?? "",
                    })
                  : copy.step1Heading}
              </h2>

              {filterToCategoryId && !hasServiceChoice && (
                <div className="flex justify-center -mt-2 mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFilterToCategoryId(null);
                      setExpandedCategory(null);
                    }}
                    className="text-sm text-brand-dark/70 hover:text-brand-dark underline underline-offset-4"
                  >
                    {copy.step1ShowAllServices}
                  </button>
                </div>
              )}

              {servicesLoading && (
                <BookingStepLoader message={copy.step1Loading} skeletonCount={4} />
              )}

              {!servicesLoading && bookingServices.length === 0 && (
                <FriendlyEmpty
                  title={copy.step1EmptyTitle}
                  message={copy.step1EmptyMessage}
                  phone={copy.supportPhone}
                  phoneLabel={copy.supportPhoneLabel}
                />
              )}

              {!servicesLoading && bookingServices.length > 0 && (
              <div className="space-y-3">
                {[...bookingServices]
                  .filter((c) => !filterToCategoryId || c.id === filterToCategoryId)
                  .sort(sortBookingCategories)
                  .map((category) => {
                    const clinicsForCategory = step1ClinicTagsByCategoryId[category.id] ?? [];
                    const showAlleKlinikker =
                      clinicsForCategory.length > 0 &&
                      allStep1ClinicTags.length > 0 &&
                      clinicsForCategory.length === allStep1ClinicTags.length;
                    const visibleServices = hasServiceChoice
                      ? filterServicesByOptions(category.services, serviceChoiceSlugs)
                      : category.services;
                    if (hasServiceChoice && visibleServices.length === 0) return null;
                    const isExpanded =
                      expandedCategory === category.id ||
                      (hasServiceChoice && filterToCategoryId === category.id);

                    return (
                      <div
                        key={category.id}
                        className="rounded-2xl overflow-hidden border border-brand-dark/10"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedCategory(isExpanded ? null : category.id)}
                          className={cn(
                            "w-full flex items-center justify-between gap-3 p-5 text-left transition-colors",
                            "bg-brand-beige/40 hover:bg-brand-beige/60",
                            isExpanded && "bg-brand-beige/60",
                          )}
                        >
                          <span className="methodika-sentence-case font-normal text-brand-dark min-w-0">
                            {category.label}
                          </span>
                          <div className="flex items-center gap-3 ml-auto flex-shrink-0">
                            <div className="flex items-center gap-1.5 flex-wrap justify-end max-w-[50vw] sm:max-w-[280px]">
                              {!isExpanded &&
                                (showAlleKlinikker ? (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-brand-dark/10 text-brand-dark/70 font-light">
                                    {copy.step1AllClinicsBadge}
                                  </span>
                                ) : clinicsForCategory.length > 0 ? (
                                  clinicsForCategory.map((clinic) => (
                                    <span
                                      key={clinic.tagKey}
                                      className="text-xs px-2 py-0.5 rounded-full bg-white border border-brand-dark/10 text-brand-dark/70 font-light whitespace-nowrap"
                                    >
                                      {clinic.label}
                                    </span>
                                  ))
                                ) : null)}
                            </div>
                            <ChevronDown
                              className={cn(
                                "w-5 h-5 text-brand-dark/45 transition-transform duration-300 flex-shrink-0",
                                isExpanded && "rotate-180",
                              )}
                            />
                          </div>
                        </button>

                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden bg-white border-t border-brand-dark/10"
                            >
                              <div className="p-3 space-y-2">
                                {visibleServices.map((service) => {
                                  const isFree = service.price === "0";
                                  const duration = serviceDurationLabel(service, locale);

                                  return (
                                    <button
                                      key={service.apiActivityId ?? service.name}
                                      type="button"
                                      data-service={service.name}
                                      onMouseEnter={() =>
                                        prefetchWbActivityMatrix(service.apiActivityId)
                                      }
                                      onFocus={() =>
                                        prefetchWbActivityMatrix(service.apiActivityId)
                                      }
                                      onClick={() =>
                                        handleSelectService(
                                          category.id,
                                          category.label,
                                          service,
                                          category.clinicServiceId,
                                        )
                                      }
                                      className={cn(
                                        "w-full flex items-center justify-between gap-4 p-4 border rounded-xl transition-colors text-left group",
                                        isFree
                                          ? "bg-[#DDF5E8] border-[#7ECDA6]/40 hover:bg-[#D0F0DE] hover:border-[#7ECDA6]/70"
                                          : "bg-brand-beige/30 border-brand-dark/10 hover:bg-white hover:border-brand-dark/30",
                                      )}
                                    >
                                      <div className="flex-1 pr-4 min-w-0">
                                        <span className="methodika-sentence-case text-brand-dark font-normal">
                                          {service.name}
                                        </span>
                                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                                          <span className="text-sm text-brand-dark/80">
                                            {isFree ? copy.step1PriceFree : fillBookingTemplate(copy.step1PriceFrom, { price: service.price })}
                                          </span>
                                          {!isFree && duration ? (
                                            <>
                                              <span className="text-brand-dark/40">·</span>
                                              <span className="text-sm text-brand-dark/70">
                                                {duration}
                                              </span>
                                            </>
                                          ) : null}
                                        </div>
                                      </div>
                                      <div
                                        className={cn(
                                          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                          isFree ? "bg-[#3A9E73]" : "bg-brand-dark",
                                        )}
                                      >
                                        <ArrowRight className="w-4 h-4 text-brand-warm" />
                                      </div>
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
              </div>
              )}
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
              <h2 className="text-2xl font-light text-brand-dark mb-4">{copy.step2Heading}</h2>

              {bookingData.service?.apiActivityId && !step2Ready && (
                <BookingStepLoader message={copy.step2Loading} />
              )}

              {step2Ready && availableClinics.length === 0 && (
                <FriendlyEmpty
                  title={copy.step2EmptyTitle}
                  message={copy.step2EmptyMessage}
                  phone={copy.step2EmptyPhone}
                  phoneLabel={copy.step2EmptyButtonLabel}
                  secondaryLabel={copy.step2EmptyBookLabel}
                  onSecondaryClick={handleBookAnotherWay}
                />
              )}

              {step2Ready && availableClinics.length > 0 && (
                <div className="space-y-3">
                  {availableClinics.map((clinic) => (
                    <button
                      key={clinic.id}
                      type="button"
                      onMouseEnter={() => {
                        if (isMetodikaClinic(clinic)) prefetchCaregiversForClinic(clinic);
                      }}
                      onClick={() => handleSelectClinic(clinic)}
                      className="w-full flex items-center gap-4 p-5 bg-brand-beige/30 border border-brand-dark/10 rounded-2xl hover:bg-white hover:border-brand-dark/30 transition-colors text-left group"
                    >
                      <div className="w-11 h-11 rounded-full bg-brand-beige flex items-center justify-center group-hover:bg-brand-dark/5 transition-colors shrink-0">
                        {isExternalClinic(clinic) ? (
                          <Phone className="w-5 h-5 text-brand-dark" strokeWidth={1.5} />
                        ) : (
                          <MapPin className="w-5 h-5 text-brand-dark" strokeWidth={1.5} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-normal text-brand-dark">{clinic.label}</p>
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
              <h2 className="text-2xl font-light text-brand-dark mb-2">{copy.step3Heading}</h2>
              <p className="text-sm text-brand-dark/60 font-light mb-4">
                {copy.step3Subtitle}
              </p>

              {/* Skip / Any specialist — always visible; practitioners load in background */}
                <button
                  onClick={() =>
                    setBookingData({
                      ...bookingData,
                      specialistChosen: true,
                      firstAvailableFlow: true,
                      specialist: undefined,
                      date: undefined,
                      time: undefined,
                      slotDurationMinutes: undefined,
                    })
                  }
                  className="w-full flex items-center gap-4 p-5 bg-brand-beige/30 border border-brand-dark/10 rounded-2xl hover:bg-white hover:border-brand-dark/30 hover:shadow-[0_4px_20px_rgba(66,51,42,0.06)] transition-all text-left group"
                >
                  <div className="w-12 h-12 rounded-full bg-brand-beige flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-brand-dark" strokeWidth={1.5} />
                  </div>
                <div className="flex-1">
                  <p className="font-normal text-brand-dark">{copy.step3FirstAvailableTitle}</p>
                  <p className="text-sm text-brand-dark/60 font-light">
                    {copy.step3FirstAvailableSubtitle}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-brand-dark/40 group-hover:text-brand-dark group-hover:translate-x-0.5 transition-all" />
              </button>

              {hasApiActivity && caregiversLoading && caregiverIdsFromSlots.length > 0 && (
                <div className="grid grid-cols-2 gap-3" aria-busy="true" aria-label={copy.step3Loading}>
                  {[0, 1].map((slot) => (
                    <div
                      key={slot}
                      className="flex flex-col items-center p-5 bg-brand-beige/20 border border-brand-dark/10 rounded-2xl animate-pulse"
                    >
                      <div className="w-16 h-16 rounded-full bg-brand-beige/80 mb-3" />
                      <div className="h-3 w-24 rounded bg-brand-beige/80" />
                      <div className="mt-2 h-2 w-16 rounded bg-brand-beige/60" />
                    </div>
                  ))}
                </div>
              )}

              {hasApiActivity &&
                !caregiversLoading &&
                step3Caregivers.length === 0 &&
                caregiverIdsFromSlots.length === 0 && (
                  <FriendlyEmpty
                    title={copy.step3EmptyNoCaregiversTitle}
                    message={copy.step3EmptyNoCaregiversMessage}
                    phone={copy.supportPhone}
                    phoneLabel={copy.supportPhoneLabel}
                  />
                )}

              {hasApiActivity &&
                !caregiversLoading &&
                step3Caregivers.length === 0 &&
                caregiverIdsFromSlots.length > 0 && (
                  <FriendlyEmpty
                    title={copy.step3EmptyFetchTitle}
                    message={copy.step3EmptyFetchMessage}
                    phone={copy.supportPhone}
                    phoneLabel={copy.supportPhoneLabel}
                  />
                )}

              {(!hasApiActivity || !caregiversLoading) && step3Caregivers.length > 0 && (
                <div className="grid grid-cols-2 gap-3">
                  {step3Caregivers.map((spec) => (
                    <div
                      key={isBookingCaregiver(spec) ? `api-${spec.apiUserId}` : spec.slug}
                      className="relative"
                    >
                      <button
                        onClick={() =>
                          setBookingData({
                            ...bookingData,
                            specialistChosen: true,
                            firstAvailableFlow: false,
                            specialist: spec,
                            date: undefined,
                            time: undefined,
                            slotDurationMinutes: undefined,
                          })
                        }
                        className="w-full flex flex-col items-center p-5 bg-brand-beige/30 border border-brand-dark/10 rounded-2xl hover:bg-white hover:border-brand-dark/30 hover:shadow-[0_4px_20px_rgba(66,51,42,0.06)] transition-all text-center group"
                      >
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-3 ring-1 ring-brand-dark/10">
                          <AssetImg
                            src={resolveBookingSpecialistImage(spec.image)}
                            alt={spec.name}
                            preset="thumb"
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <span className="text-sm font-normal text-brand-dark leading-tight">
                          {spec.name}
                        </span>
                        <span className="text-xs text-brand-dark/60 mt-1 line-clamp-1 font-light">
                          {spec.title}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSpecialistInfo(bookingPersonForModal(spec, specialists));
                        }}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-brand-beige hover:bg-brand-dark hover:text-brand-warm flex items-center justify-center transition-colors"
                        aria-label={`Les mer om ${spec.name}`}
                      >
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                {copy.step4Heading}
                {bookingData.specialist && (
                  <span className="text-base text-brand-dark/60 font-light ml-2">
                    – {bookingData.specialist.name}
                  </span>
                )}
              </h2>
              
              {/* Horisontal 7-dagers stripe — hverdager, ledighet fra API */}
              <div className="bg-brand-beige/30 rounded-2xl p-6 border border-brand-dark/10">
                <div className="mb-5 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-brand-dark/60 font-medium mb-1">
                      {copy.step4SelectedDayLabel}
                    </p>
                    <h3 className="text-xl font-light text-brand-dark">

                      {selectedDate
                        ? formatBookingLongDate(selectedDate, locale)
                        : bookableDates.length > 0
                          ? formatBookingLongDate(bookableDates[0], locale)
                          : copy.step4NoDaysLabel}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {!step4NoBookableDays ? (
                    <>
                    <button
                      type="button"
                      onClick={() => {
                        setDateDirection(-1);
                        setWeekOffset(0);
                        if (bookableDates.length > 0) setSelectedDate(bookableDates[0]);
                      }}
                      disabled={
                        weekOffset === 0 &&
                        (!selectedDate ||
                          (bookableDates[0] != null && isSameDay(selectedDate, bookableDates[0])))
                      }
                      aria-label="Tilbake til første ledige dag"
                      title="Tilbake til første ledige dag"
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-md border transition-colors mr-1",
                        "border-brand-dark/15 bg-white text-brand-dark hover:bg-brand-beige hover:border-brand-dark/40 disabled:text-brand-dark/30 disabled:cursor-not-allowed disabled:hover:bg-white",
                      )}
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!canGoPrevRange) return;
                        setDateDirection(-1);
                        setWeekOffset(Math.max(0, weekOffset - 1));
                      }}
                      disabled={!canGoPrevRange}
                      aria-label="Forrige dager"
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-md border bg-white transition-colors",
                        canGoPrevRange
                          ? "border-brand-dark/15 text-brand-dark/75 hover:text-brand-dark hover:border-brand-dark/30 hover:bg-brand-beige/40"
                          : "border-brand-dark/10 text-brand-dark/20 cursor-not-allowed",
                      )}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!canGoNextRange) return;
                        setDateDirection(1);
                        setWeekOffset(Math.min(MAX_CALENDAR_WEEKS, weekOffset + 1));
                      }}
                      disabled={!canGoNextRange}
                      aria-label="Neste dager"
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-md border bg-white transition-colors",
                        canGoNextRange
                          ? "border-brand-dark/15 text-brand-dark/75 hover:text-brand-dark hover:border-brand-dark/30 hover:bg-brand-beige/40"
                          : "border-brand-dark/10 text-brand-dark/20 cursor-not-allowed",
                      )}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    </>
                    ) : null}
                  </div>
                </div>

                <div className="overflow-hidden min-h-24">
                  {hasApiActivity && !clinicsAvailabilityReady ? (
                    <BookingStepLoader
                      message={copy.step4LoadingTimes}
                      variant="grid"
                      skeletonCount={7}
                      className="py-4"
                    />
                  ) : step4NoBookableDays ? (
                    <FriendlyEmpty
                      title={copy.step4NoDaysTitle}
                      message={copy.step4NoDaysMessage}
                      phone={copy.supportPhone}
                      phoneLabel={copy.supportPhoneLabel}
                      secondaryLabel={copy.step2EmptyBookLabel}
                      onSecondaryClick={handleBookAnotherWay}
                    />
                  ) : (
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={weekOffset}
                      initial={{ opacity: 0, x: dateDirection * 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: dateDirection * -24 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="grid grid-cols-4 sm:grid-cols-7 gap-2 sm:gap-3"
                    >
                      {visibleDates.map((date) => {
                        const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;
                        const isToday = isSameDay(date, today);
                        const hasSlots = datesWithApiSlots.has(dayKey(date));
                        const isPast = date < today;
                        const calendarDatesReady =
                          !hasApiActivity || clinicsAvailabilityReady;
                        const isDisabled =
                          isPast ||
                          (hasApiActivity && (!calendarDatesReady || !hasSlots));

                        return (
                          <button
                            key={date.toISOString()}
                            type="button"
                            onClick={() => {
                              if (!isDisabled) setSelectedDate(date);
                            }}
                            onMouseEnter={() => {
                              if (!isDisabled && hasApiActivity) prefetchDaySlots(date);
                            }}
                            disabled={isDisabled}
                            aria-label={formatBookingLongDate(date, locale)}
                            aria-pressed={isSelected}
                            title={isDisabled ? "Ingen ledige timer denne dagen" : undefined}
                            className={cn(
                              "group relative flex flex-col items-center justify-center gap-1 h-24 rounded-xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2",
                              isSelected
                                ? "bg-brand-dark border-brand-dark text-brand-warm shadow-sm"
                                : isDisabled
                                  ? "bg-brand-beige/20 border-brand-dark/5 text-brand-dark/30 cursor-not-allowed"
                                  : "bg-white border-brand-dark/10 text-brand-dark hover:border-brand-dark/40 hover:bg-brand-beige/50",
                            )}
                          >
                            <span
                              className={cn(
                                "text-xs font-medium uppercase",
                                isSelected
                                  ? "text-brand-warm/80"
                                  : isDisabled
                                    ? "text-brand-dark/25"
                                    : "text-brand-dark/60",
                              )}
                            >
                              {format(date, "EEE", { locale: bookingDateFnsLocale(locale) })}
                            </span>
                            <span
                              className={cn(
                                "text-2xl leading-none",
                                isSelected ? "font-medium" : "font-light",
                              )}
                            >
                              {format(date, "d", { locale: bookingDateFnsLocale(locale) })}
                            </span>
                            <span
                              className={cn(
                                "text-[10px] font-light leading-none",
                                isSelected
                                  ? "text-brand-warm/80"
                                  : isDisabled
                                    ? "text-brand-dark/25"
                                    : "text-brand-dark/60",
                              )}
                            >
                              {isToday ? copy.step4TodayLabel : formatBookingMonthShort(date, locale)}
                            </span>
                          </button>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                  )}
                </div>
              </div>

              {/* Time Slots — CMedical beige/brun stil, 3 per rad */}
              {selectedDate && (
                <div className="bg-brand-beige/30 rounded-2xl p-6 border border-brand-dark/10">
                  <div className="mb-5 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-brand-dark/60 font-medium mb-1">
                        {copy.step4PickTimeLabel}
                      </p>
                      <h3 className="text-xl font-light text-brand-dark">
                        {formatBookingLongDate(selectedDate, locale)}
                      </h3>
                    </div>
                    {selectedDayDurationLabel && (
                      <span className="text-xs text-brand-dark/60 font-medium">
                        {copy.step4DurationPrefix} {selectedDayDurationLabel}
                      </span>
                    )}
                  </div>

                  {!hasApiActivity ? (
                    <FriendlyEmpty
                      title={copy.step4NotOnlineTitle}
                      message={copy.step4NotOnlineMessage}
                      phone={copy.supportPhone}
                      phoneLabel={copy.supportPhoneLabel}
                      secondaryLabel={copy.step2EmptyBookLabel}
                      onSecondaryClick={handleBookAnotherWay}
                    />
                  ) : timesLoading && availableSlots.length === 0 ? (
                    <BookingStepLoader
                      message={copy.step4LoadingTimes}
                      variant="grid"
                      skeletonCount={9}
                      className="py-2"
                    />
                  ) : availableSlots.length > 0 ? (
                    isFirstAvailableFlow ? (
                      <div className="space-y-2">
                        {availableSlots.map((slot) => {
                          const caregiver =
                            slot.caregiverUserId != null
                              ? caregiverByUserId.get(slot.caregiverUserId)
                              : undefined;
                          return (
                            <button
                              key={`${slot.startDateTime}-${slot.caregiverUserId ?? "unknown"}`}
                              type="button"
                              onClick={() => handleSelectTimeSlot(slot)}
                              className="w-full flex items-center gap-4 p-3 bg-white border border-brand-dark/10 rounded-md hover:border-brand-dark/40 hover:shadow-sm transition-all text-left"
                            >
                              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-brand-dark/10">
                                <AssetImg
                                  src={resolveBookingSpecialistImage(caregiver?.image)}
                                  alt={caregiver?.name ?? copy.stepLabelSpecialist}
                                  className="w-full h-full object-cover object-top"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-sm font-normal text-brand-dark block">
                                  {caregiver?.name ?? copy.stepLabelSpecialist}
                                </span>
                                {caregiver?.title ? (
                                  <span className="text-xs text-brand-dark/60 font-light">
                                    {caregiver.title}
                                  </span>
                                ) : null}
                              </div>
                              <span className="font-light text-brand-dark text-lg tabular-nums">
                                {slot.time}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        {availableSlots.map((slot) => (
                          <button
                            key={`${slot.startDateTime}-${slot.caregiverUserId ?? "single"}`}
                            type="button"
                            onClick={() => handleSelectTimeSlot(slot)}
                            className="py-3 px-4 bg-white border border-brand-dark/10 rounded-md text-brand-dark font-light text-base hover:bg-brand-dark hover:text-brand-warm hover:border-brand-dark transition-all"
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    )
                  ) : (
                    <FriendlyEmpty
                      title={copy.step4NoSlotsTitle}
                      message={copy.step4NoSlotsMessage}
                      phone={copy.supportPhone}
                      phoneLabel={copy.supportPhoneLabel}
                      secondaryLabel={copy.step2EmptyBookLabel}
                      onSecondaryClick={handleBookAnotherWay}
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
              <h2 className="text-2xl font-light text-brand-dark mb-4">{copy.step5Heading}</h2>

              {/* Summary Card */}
              <div className="bg-brand-beige/30 border border-brand-dark/10 rounded-2xl p-6">
                <h3 className="font-normal text-lg mb-4 text-brand-dark">{copy.step5OrderTitle}</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-brand-dark/60 text-xs uppercase">{copy.step5LabelService}</span>
                    <p className="methodika-sentence-case font-normal text-brand-dark block">
                      {bookingData.service?.name}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-brand-dark/60 text-xs uppercase">{copy.step5LabelPrice}</span>
                    <p className="font-normal text-brand-dark">
                      {bookingData.service?.price === "0"
                        ? copy.step5PriceFree
                        : fillBookingTemplate(copy.step5PriceFrom, {
                            price: bookingData.service?.price ?? "",
                          })}
                    </p>
                    <p className="text-xs text-brand-dark/75 mt-0.5 font-light">
                      {copy.step5PriceNote}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-brand-dark/60 text-xs uppercase">{copy.step5LabelClinic}</span>
                    <p className="font-normal text-brand-dark">{bookingData.clinic?.label}</p>
                  </div>
                  {bookingData.slotDurationMinutes != null && (
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-brand-dark/60 text-xs uppercase">{copy.step5LabelDuration}</span>
                      <p className="font-normal text-brand-dark">
                        {localizeDurationLabel(
                          formatDurationMinutes(bookingData.slotDurationMinutes, locale),
                          locale,
                        )}
                      </p>
                    </div>
                  )}
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-brand-dark/60 text-xs uppercase">{copy.step5LabelDate}</span>
                    <p className="font-normal text-brand-dark">
                      {bookingData.date && formatBookingLongDate(bookingData.date, locale)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-brand-dark/60 text-xs uppercase">{copy.step5LabelTime}</span>
                    <p className="font-normal text-brand-dark">{bookingData.time}</p>
                  </div>
                </div>
                {bookingData.specialist && (
                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-brand-dark/10">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={assetSrc(resolveBookingSpecialistImage(bookingData.specialist.image))}
                        alt={bookingData.specialist.name}
                      />
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
              {submitLoading ? (
                <BookingStepLoader
                  message={copy.step5SubmittingLabel}
                  skeletonCount={4}
                />
              ) : (
              <>
              <div className="bg-brand-beige/30 border border-brand-dark/10 rounded-2xl p-6">
                <h3 className="font-normal text-lg mb-4 text-brand-dark">{copy.step5PersonalInfoTitle}</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="firstName" className="text-sm text-brand-dark/70">{copy.formFirstNameLabel}</label>
                      <Input
                        id="firstName"
                        name="given-name"
                        autoComplete="given-name"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder={copy.formFirstNamePlaceholder}
                        className="mt-1.5 h-12 rounded-lg border-brand-dark/30 bg-white focus-visible:bg-white text-brand-dark placeholder:text-brand-dark/60"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="text-sm text-brand-dark/70">{copy.formLastNameLabel}</label>
                      <Input
                        id="lastName"
                        name="family-name"
                        autoComplete="family-name"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder={copy.formLastNamePlaceholder}
                        className="mt-1.5 h-12 rounded-lg border-brand-dark/30 bg-white focus-visible:bg-white text-brand-dark placeholder:text-brand-dark/60"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="birthNumber" className="text-sm text-brand-dark/70">{copy.formBirthNumberLabel}</label>
                    <Input
                      id="birthNumber"
                      name="birthNumber"
                      type="text"
                      autoComplete="off"
                      value={formData.birthNumber}
                      onChange={(e) => {
                        const val = normalizeFodselsnummerInput(e.target.value);
                        setFormData({ ...formData, birthNumber: val });
                        setBirthNumberError(
                          fodselsnummerFieldError(val, copy.errorInvalidBirthNumber),
                        );
                      }}
                      onBlur={() => {
                        setBirthNumberError(
                          fodselsnummerFieldError(formData.birthNumber, copy.errorInvalidBirthNumber, {
                            markIncomplete: true,
                          }),
                        );
                      }}
                      placeholder={copy.formBirthNumberPlaceholder}
                      inputMode="numeric"
                      data-1p-ignore
                      data-lpignore="true"
                      aria-invalid={birthNumberError ? true : undefined}
                      aria-describedby={birthNumberError ? "birthNumber-error" : "birthNumber-help"}
                      className={cn(
                        "mt-1.5 h-12 rounded-lg border-brand-dark/30 bg-white focus-visible:bg-white text-brand-dark placeholder:text-brand-dark/60",
                        birthNumberError && "border-destructive focus-visible:ring-destructive",
                      )}
                    />
                    {birthNumberError ? (
                      <p id="birthNumber-error" className="text-xs text-destructive mt-1.5 leading-relaxed font-light" role="alert">
                        {birthNumberError}
                      </p>
                    ) : (
                      <p id="birthNumber-help" className="text-xs text-brand-dark/60 mt-1.5 leading-relaxed font-light">
                        {copy.formBirthNumberHelp}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-sm text-brand-dark/70">{copy.formPhoneLabel}</label>
                    <div className="mt-1.5 flex h-12 overflow-hidden rounded-lg border border-brand-dark/30 bg-white focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                      <span className="flex shrink-0 items-center border-r border-brand-dark/20 bg-brand-dark/[0.03] px-3 text-sm text-brand-dark/70 select-none">
                        +47
                      </span>
                      <Input
                        id="phone"
                        name="tel"
                        autoComplete="tel-national"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone: stripNorwegianMobileInputForField(e.target.value),
                          })
                        }
                        placeholder={copy.formPhonePlaceholder.replace(/^\+47\s*/i, "") || "XXX XX XXX"}
                        type="tel"
                        inputMode="numeric"
                        maxLength={8}
                        className="h-full min-h-0 flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 text-brand-dark placeholder:text-brand-dark/60"
                      />
                    </div>
                    <p className="text-xs text-brand-dark/60 mt-1.5 leading-relaxed font-light">
                      {copy.formPhoneHelp}
                    </p>
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm text-brand-dark/70">{copy.formEmailLabel}</label>
                    <Input
                      id="email"
                      name="email"
                      autoComplete="email"
                      value={formData.email || ""}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={copy.formEmailPlaceholder}
                      type="email"
                      className="mt-1.5 h-12 rounded-lg border-brand-dark/30 bg-white focus-visible:bg-white text-brand-dark placeholder:text-brand-dark/60"
                    />
                  </div>
                  <div>
                    <label htmlFor="note" className="text-sm text-brand-dark/70">{copy.formNoteLabel}</label>
                    <Textarea
                      id="note"
                      name="note"
                      value={formData.note}
                      onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                      placeholder={copy.formNotePlaceholder}
                      rows={3}
                      className="mt-1.5 min-h-[96px] rounded-lg border-brand-dark/30 bg-white focus-visible:bg-white text-brand-dark placeholder:text-brand-dark/60 resize-y"
                    />
                  </div>
                  <div className="bg-brand-beige rounded-lg p-4 text-xs text-brand-dark/70 leading-relaxed space-y-2 font-light">
                    <p><strong className="text-brand-dark font-normal">{copy.formCancellationRulesHeading}:</strong> {copy.formCancellationRules}</p>
                    <p>
                      <LinkedTemplateText
                        template={copy.formTermsPageTeaser}
                        token="{{termsLink}}"
                        href={BOOKING_LEGAL_POLICY_PATH}
                        linkText={copy.formTermsLinkText}
                      />
                    </p>
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
                        <LinkedTemplateText
                          template={copy.formTermsCheckbox}
                          token="{{termsLink}}"
                          href={BOOKING_LEGAL_POLICY_PATH}
                          linkText={copy.formTermsInlineLinkText}
                        />
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
                        <LinkedTemplateText
                          template={copy.formPrivacyCheckbox}
                          token="{{privacyLink}}"
                          href={BOOKING_LEGAL_POLICY_PATH}
                          linkText={copy.formPrivacyLinkText}
                        />
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
                        {copy.formMarketingCheckbox}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {submitError && (
                <p className="text-sm text-destructive font-light" role="alert">
                  {submitError}
                </p>
              )}

              <Button
                onClick={() => void handleSubmit()}
                disabled={
                  submitLoading ||
                  !formData.acceptTerms ||
                  !formData.acceptDataProcessing ||
                  !formData.firstName ||
                  !formData.lastName ||
                  !formData.phone ||
                  !isValidNorwegianMobileFieldInput(formData.phone) ||
                  !isFodselsnummerReadyForSubmit(formData.birthNumber) ||
                  !bookingData.service?.apiActivityId ||
                  !bookingData.selectedSlot
                }
                className={cn(
                  "w-full h-14 rounded-lg text-base font-normal transition-all",
                  !submitLoading &&
                    formData.acceptTerms &&
                    formData.acceptDataProcessing &&
                    formData.firstName &&
                    formData.lastName &&
                    formData.phone &&
                    isFodselsnummerReadyForSubmit(formData.birthNumber) &&
                    bookingData.service?.apiActivityId &&
                    bookingData.selectedSlot
                    ? "bg-brand-dark text-brand-warm hover:bg-brand-dark/90 hover:text-brand-warm focus:text-brand-warm focus-visible:text-brand-warm active:bg-brand-dark/90 active:text-brand-warm shadow-sm"
                    : "bg-brand-beige text-brand-dark/40 cursor-not-allowed"
                )}
              >
                {copy.step5SubmitLabel}
              </Button>
              </>
              )}

            </motion.div>
          )}
        </AnimatePresence>

        <BookingSupportFooter text={copy.supportFooterText} phone={copy.supportPhone} />
      </main>

      {/* Specialist Info Dialog */}
      <Dialog open={!!selectedSpecialistInfo} onOpenChange={(open) => !open && setSelectedSpecialistInfo(null)}>
        <DialogContent className="sm:max-w-2xl bg-brand-beige border-none p-0 overflow-hidden">
          {selectedSpecialistInfo && (
            <div className="flex flex-col">
              <div className="relative pt-8 pb-6 px-8">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="h-28 w-28 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
                      <AssetImg
                        src={resolveBookingSpecialistImage(selectedSpecialistInfo.image)}
                        alt={selectedSpecialistInfo.name}
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  </div>

                  <div className="flex-1 pt-2">
                    <h3 className="text-2xl font-normal text-foreground tracking-tight">
                      {selectedSpecialistInfo.name}
                    </h3>
                    <p className="text-base text-muted-foreground mt-1 font-light">
                      {selectedSpecialistInfo.title}
                    </p>

                    {!isBookingCaregiver(selectedSpecialistInfo) &&
                      selectedSpecialistInfo.expertise &&
                      selectedSpecialistInfo.expertise.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {selectedSpecialistInfo.expertise.map((exp, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 text-sm font-light bg-white/60 text-foreground/80 rounded-full"
                            >
                              {exp.label}
                            </span>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              </div>

              <div className="px-8 pb-8 space-y-5">
                {!isBookingCaregiver(selectedSpecialistInfo) && selectedSpecialistInfo.bio && (
                  <div>
                    <p className="text-base text-muted-foreground font-light leading-relaxed whitespace-pre-line">
                      {selectedSpecialistInfo.bio}
                    </p>
                  </div>
                )}

                {!isBookingCaregiver(selectedSpecialistInfo) && (
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-foreground/10">
                    {selectedSpecialistInfo.languages && selectedSpecialistInfo.languages.length > 0 && (
                      <div className="bg-white/50 rounded-xl p-4">
                        <p className="text-xs text-foreground/60 mb-1.5">Språk</p>
                        <p className="text-sm text-foreground font-light">
                          {selectedSpecialistInfo.languages.join(", ")}
                        </p>
                      </div>
                    )}
                    {selectedSpecialistInfo.clinics && selectedSpecialistInfo.clinics.length > 0 && (
                      <div className="bg-white/50 rounded-xl p-4">
                        <p className="text-xs text-foreground/60 mb-1.5">Klinikk</p>
                        <p className="text-sm text-foreground font-light">
                          {selectedSpecialistInfo.clinics.join(", ")}
                        </p>
                      </div>
                    )}
                    {selectedSpecialistInfo.education && (
                      <div className="bg-white/50 rounded-xl p-4">
                        <p className="text-xs text-foreground/60 mb-1.5">Utdanning</p>
                        <p className="text-sm text-foreground font-light">
                          {selectedSpecialistInfo.education}
                        </p>
                      </div>
                    )}
                    {selectedSpecialistInfo.experience && (
                      <div className="bg-white/50 rounded-xl p-4">
                        <p className="text-xs text-foreground/60 mb-1.5">Erfaring</p>
                        <p className="text-sm text-foreground font-light">
                          {selectedSpecialistInfo.experience}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingDemo;
