import { AssetImg } from "@/components/AssetImg";
import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "@/lib/router";
import { ArrowLeft, X, Calendar, MapPin, Clock, Check, ChevronDown, ChevronLeft, ChevronRight, ArrowRight, Info, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpecialistsData, Specialist } from "@/hooks/useSpecialistsData";
import { format, addDays, isSameDay, parseISO } from "date-fns";
import { nb } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import { categoryNumericIdToPageId, findBookingCategoryForPage, slugifyNo } from "@/lib/bookingLinks";
import { formatDurationMinutes, minutesToLengthTime } from "@/lib/booking/duration";
import {
  apiLocationToClinic,
  type BookingApiClinic,
  type CategoryClinicTag,
} from "@/lib/booking/mapApiLocation";
import {
  isBookingCaregiver,
  type BookingCaregiver,
} from "@/lib/booking/bookingCaregiver";
import { FriendlyEmpty } from "@/components/booking/FriendlyEmpty";
import { assetSrc } from "@/lib/media";
import { useBookingPage } from "@/hooks/useSanity";
import {
  DEFAULT_BOOKING_PAGE_COPY,
  fillBookingTemplate,
  splitTemplateLink,
} from "@/lib/sanity/booking-page-copy";

export type BookingServiceCategory = {
  id: string;
  clinicServiceId?: string;
  label: string;
  apiGroupId?: number;
  services: { name: string; price: string; apiActivityId?: number; duration?: string }[];
};

function clinicIdForCategory(category: BookingServiceCategory): string {
  return category.clinicServiceId ?? category.id;
}

function dayKey(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

/** Short label for step 1 clinic badges (from booking API location names). */
function clinicBadgeLabel(locationName: string): string {
  return locationName.replace(/^CMedical\s+/i, "").replace(/^Oslo\s+/i, "").trim() || locationName;
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
      <a href={href} className={linkClassName}>
        {linkText}
      </a>
      {after}
    </>
  );
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  if (items.length === 0) return [];
  const results = new Array<R>(items.length);
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (nextIndex < items.length) {
      const i = nextIndex++;
      results[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return results;
}

type BookingServiceItem = {
  name: string;
  price: string;
  apiActivityId?: number;
  duration?: string;
};

function serviceDurationLabel(
  service: BookingServiceItem,
  durationByActivityId: Record<number, { status: string; label?: string }>,
): string | null {
  if (service.apiActivityId != null) {
    const state = durationByActivityId[service.apiActivityId];
    if (!state || state.status === "none") return service.duration ?? null;
    if (state.status === "loading") return null;
    return state.label ?? null;
  }
  return service.duration ?? null;
}

function sortBookingCategories(a: BookingServiceCategory, b: BookingServiceCategory) {
  if (a.id === "fostermedisiner") return -1;
  if (b.id === "fostermedisiner") return 1;
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
  service?: BookingServiceItem;
  clinic?: BookingApiClinic;
  specialistChosen?: boolean; // true once user has passed the specialist step
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
  acceptTerms: boolean;
  acceptMarketing: boolean;
  acceptDataProcessing: boolean;
}

const BookingDemo = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { specialists } = useSpecialistsData();
  const { data: copy = DEFAULT_BOOKING_PAGE_COPY } = useBookingPage();
  const [bookingServices, setBookingServices] = useState<BookingServiceCategory[]>([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [categoryClinicsById, setCategoryClinicsById] = useState<
    Record<string, CategoryClinicTag[]>
  >({});
  const [allBookingLocations, setAllBookingLocations] = useState<CategoryClinicTag[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadBookingCatalog() {
      try {
        const [groupsRes, clinicsRes] = await Promise.all([
          fetch("/api/booking/activity-groups"),
          fetch("/api/booking/category-clinics"),
        ]);

        const groupsJson = (await groupsRes.json()) as {
          ok?: boolean;
          categories?: BookingServiceCategory[];
        };
        const clinicsJson = (await clinicsRes.json()) as {
          ok?: boolean;
          byCategoryId?: Record<string, CategoryClinicTag[]>;
          allLocations?: CategoryClinicTag[];
        };

        if (cancelled) return;

        if (
          groupsRes.ok &&
          groupsJson.ok &&
          Array.isArray(groupsJson.categories) &&
          groupsJson.categories.length > 0
        ) {
          setBookingServices(groupsJson.categories);
          if (typeof window !== "undefined") {
            console.log("[booking/category] wbactivities loaded via /api/booking/activity-groups", {
              source: "api",
              categoryCount: groupsJson.categories.length,
              categories: groupsJson.categories.map((c) => ({
                id: c.id,
                clinicServiceId: c.clinicServiceId,
                label: c.label,
                serviceCount: c.services?.length ?? 0,
                services: c.services?.map((s) => ({
                  name: s.name,
                  apiActivityId: s.apiActivityId,
                  price: s.price,
                })),
              })),
            });
          }
        } else {
          setBookingServices([]);
        }

        if (clinicsRes.ok && clinicsJson.ok) {
          setCategoryClinicsById(clinicsJson.byCategoryId ?? {});
          setAllBookingLocations(clinicsJson.allLocations ?? []);
        } else {
          setCategoryClinicsById({});
          setAllBookingLocations([]);
        }
      } catch {
        if (!cancelled) {
          setBookingServices([]);
          setCategoryClinicsById({});
          setAllBookingLocations([]);
        }
      } finally {
        if (!cancelled) setServicesLoading(false);
      }
    }

    loadBookingCatalog();
    return () => {
      cancelled = true;
    };
  }, []);

  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);
  // Horisontal 7-dagers stripe (hverdager)
  const VISIBLE_DAYS = 7;
  const [dateOffset, setDateOffset] = useState(0);
  const [dateDirection, setDateDirection] = useState<1 | -1>(1);
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
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
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [apiFreeTimeSlots, setApiFreeTimeSlots] = useState<ApiFreeTimeSlot[]>([]);
  const [apiBookingClinics, setApiBookingClinics] = useState<BookingApiClinic[]>([]);
  const [availabilityFromApi, setAvailabilityFromApi] = useState(false);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  /** True after clinic availability has been checked for the current service. */
  const [clinicsAvailabilityReady, setClinicsAvailabilityReady] = useState(false);
  const [bookingCaregivers, setBookingCaregivers] = useState<BookingCaregiver[]>([]);
  const [caregiversLoading, setCaregiversLoading] = useState(false);
  const [timesLoading, setTimesLoading] = useState(false);
  /** Duration per activity from wbfreetimes only (no static fallback). */
  const [durationByActivityId, setDurationByActivityId] = useState<
    Record<number, { status: "loading" } | { status: "ready"; label: string } | { status: "none" }>
  >({});

  const totalSteps = 5;
  const stepNameByIndex = useMemo(
    () =>
      [
        null,
        copy.stepLabelService,
        copy.stepLabelClinic,
        copy.stepLabelSpecialist,
        copy.stepLabelTime,
        copy.stepLabelConfirm,
      ] as const,
    [copy],
  );
  const stepProgressLabel = (step: number) =>
    fillBookingTemplate(copy.stepProgressTemplate, { step, total: totalSteps });

  const currentStep = useMemo(() => 
    !bookingData.service ? 1 : !bookingData.clinic ? 2 : !bookingData.specialistChosen ? 3 : !bookingData.time ? 4 : 5
  , [bookingData.service, bookingData.clinic, bookingData.specialistChosen, bookingData.time]);
  const progressAriaLabels = ["tjeneste", "klinikk", "behandler", "tid", "bekreft"] as const;

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  // Prefill from URL params: ?kategori=gynekologi&kategoriId=1&tjeneste=endometriose&spesialist=slug&klinikk=majorstuen
  // Jumps to the first unfilled step so users coming from a specific
  // page never have to start over.
  useEffect(() => {
    if (bookingData.service || bookingData.clinic || bookingData.specialist) return;
    if (specialists.length === 0 || servicesLoading) return;

    const kategori = searchParams.get("kategori");
    const kategoriIdRaw = searchParams.get("kategoriId");
    const tjeneste = searchParams.get("tjeneste");
    const spesialistSlug = searchParams.get("spesialist");
    const klinikkId = searchParams.get("klinikk");
    const kategoriId = kategoriIdRaw != null ? Number(kategoriIdRaw) : NaN;
    const kategoriFromNumericId =
      Number.isFinite(kategoriId) && kategoriId > 0
        ? categoryNumericIdToPageId[kategoriId]
        : undefined;
    const effectiveKategori = kategori || kategoriFromNumericId;

    if (!effectiveKategori && !tjeneste && !spesialistSlug && !klinikkId) return;

    // 1. Resolve category
    let resolvedCategoryListId: string | undefined;
    let resolvedCategoryClinicId: string | undefined;
    let resolvedCategoryLabel: string | undefined;
    let matchingCategory: ReturnType<typeof findBookingCategoryForPage>;
    if (effectiveKategori && effectiveKategori !== "flere-fagomrader") {
      matchingCategory = findBookingCategoryForPage(effectiveKategori, bookingServices);
      if (matchingCategory) {
        resolvedCategoryListId = matchingCategory.id;
        resolvedCategoryClinicId = clinicIdForCategory(matchingCategory);
        resolvedCategoryLabel = matchingCategory.label;
        setExpandedCategory(matchingCategory.id);
        setFilterToCategoryId(matchingCategory.id);
        if (typeof window !== "undefined") {
          console.log("[booking/category] matched category for URL prefill", {
            effectiveKategori,
            categoryListId: resolvedCategoryListId,
            clinicServiceId: resolvedCategoryClinicId,
            label: resolvedCategoryLabel,
            servicesFromWbactivities: matchingCategory.services,
          });
        }
      }
    }

    // If specialist is given but no category, derive from the specialist's category
    let resolvedSpecialist: Specialist | undefined;
    if (spesialistSlug) {
      resolvedSpecialist = specialists.find((s) => s.slug === spesialistSlug);
      if (resolvedSpecialist && !resolvedCategoryListId) {
        const derivedPageId = resolvedSpecialist.category;
        const derivedCat = findBookingCategoryForPage(derivedPageId, bookingServices);
        if (derivedCat) {
          resolvedCategoryListId = derivedCat.id;
          resolvedCategoryClinicId = clinicIdForCategory(derivedCat);
          resolvedCategoryLabel = derivedCat.label;
          setExpandedCategory(derivedCat.id);
          setFilterToCategoryId(derivedCat.id);
        }
      }
    }

    // 2. Resolve specific service within category (slug or fuzzy name match)
    let resolvedService: BookingServiceItem | undefined;
    if (tjeneste && resolvedCategoryListId) {
      const cat = bookingServices.find((c) => c.id === resolvedCategoryListId);
      const targetSlug = slugifyNo(tjeneste);
      resolvedService = cat?.services.find((s) => {
        const nameSlug = slugifyNo(s.name);
        return nameSlug === targetSlug || nameSlug.includes(targetSlug) || targetSlug.includes(nameSlug);
      });
    }

    // 3. Clinic from URL is resolved after API availability loads (see effect below)

    // 4. Commit prefilled state — only if we have at least service/clinic/specialist
    if (resolvedService || resolvedSpecialist) {
      const next: BookingData = {};
      if (resolvedCategoryClinicId) next.categoryId = resolvedCategoryClinicId;
      if (resolvedCategoryLabel) next.category = resolvedCategoryLabel;
      if (resolvedService) next.service = resolvedService;
      if (resolvedSpecialist) {
        next.specialist = resolvedSpecialist;
        next.specialistChosen = true;
      }
      setBookingData(next);
      if (matchingCategory && typeof window !== "undefined") {
        console.log("[booking/category] prefill committed", {
          categoryId: next.categoryId,
          categoryLabel: next.category,
          selectedService: next.service,
        });
      }
    }
    // If only kategori was given, expandedCategory is already set above.
  }, [searchParams, specialists, bookingServices, servicesLoading, bookingData.service, bookingData.clinic, bookingData.specialist]);

  // Log services for the active category filter (step 1 UI)
  useEffect(() => {
    if (servicesLoading || bookingServices.length === 0) return;
    const activeId = filterToCategoryId ?? expandedCategory;
    if (!activeId) return;
    const cat = bookingServices.find((c) => c.id === activeId);
    if (!cat) return;
    if (typeof window !== "undefined") {
      console.log("[booking/category] services shown for category", {
        categoryId: cat.id,
        clinicServiceId: cat.clinicServiceId,
        label: cat.label,
        serviceCount: cat.services.length,
        services: cat.services.map((s) => ({
          name: s.name,
          apiActivityId: s.apiActivityId,
          price: s.price,
        })),
      });
    }
  }, [filterToCategoryId, expandedCategory, bookingServices, servicesLoading]);

  // Step 1: load duration from wbfreetimes when a category is expanded
  useEffect(() => {
    if (!expandedCategory) return;

    const category = bookingServices.find((c) => c.id === expandedCategory);
    if (!category) return;

    const activityIds = category.services
      .map((s) => s.apiActivityId)
      .filter((id): id is number => typeof id === "number");

    if (activityIds.length === 0) return;

    let cancelled = false;

    setDurationByActivityId((prev) => {
      const next = { ...prev };
      for (const id of activityIds) next[id] = { status: "loading" };
      return next;
    });

    async function loadDurationsForCategory() {
      const results = await mapWithConcurrency(activityIds, 3, async (id) => {
        try {
          const res = await fetch(`/api/booking/freetimes?wbactivityId=${id}`);
          const json = (await res.json()) as {
            ok?: boolean;
            slots?: ApiFreeTimeSlot[];
          };
          const slots = res.ok && json.ok && Array.isArray(json.slots) ? json.slots : [];
          const mins = slots.find((s) => s.durationMinutes != null)?.durationMinutes;
          if (mins == null) return { id, status: "none" as const };
          return {
            id,
            status: "ready" as const,
            label: formatDurationMinutes(mins),
          };
        } catch {
          return { id, status: "none" as const };
        }
      });

      if (cancelled) return;

      setDurationByActivityId((prev) => {
        const next = { ...prev };
        for (const result of results) {
          if (result.status === "ready") {
            next[result.id] = { status: "ready", label: result.label };
          } else {
            next[result.id] = { status: "none" };
          }
        }
        return next;
      });
    }

    loadDurationsForCategory();
    return () => {
      cancelled = true;
    };
  }, [expandedCategory, bookingServices]);

  // wbfreetimes → rooms → locations (availability API)
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
    setTimesLoading(true);

    async function loadAvailability() {
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
            ? json.locations.map(apiLocationToClinic)
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
          setTimesLoading(false);
          setClinicsAvailabilityReady(true);
        }
      }
    }

    loadAvailability();
    return () => {
      cancelled = true;
    };
  }, [bookingData.service?.apiActivityId]);

  // Prefill clinic from ?klinikk= when it matches an API location id (location-1) or legacy slug after load
  const pendingKlinikkRef = useRef<string | null>(null);
  useEffect(() => {
    pendingKlinikkRef.current = searchParams.get("klinikk");
  }, [searchParams]);

  useEffect(() => {
    const klinikk = pendingKlinikkRef.current;
    if (!klinikk || bookingData.clinic || !bookingData.service?.apiActivityId) return;
    if (!availabilityFromApi || apiBookingClinics.length === 0) return;

    const byId = apiBookingClinics.find((c) => c.id === klinikk || c.id === `location-${klinikk}`);
    const bySlug = apiBookingClinics.find((c) =>
      c.label.toLowerCase().includes(klinikk.replace(/-/g, " ")),
    );
    const match = byId ?? bySlug;
    if (match) {
      setBookingData((prev) => ({ ...prev, clinic: match }));
      pendingKlinikkRef.current = null;
    }
  }, [
    availabilityFromApi,
    apiBookingClinics,
    bookingData.clinic,
    bookingData.service?.apiActivityId,
  ]);

  const hasApiActivity = Boolean(bookingData.service?.apiActivityId);

  const selectedCaregiverUserId =
    bookingData.specialist && isBookingCaregiver(bookingData.specialist)
      ? bookingData.specialist.apiUserId
      : undefined;

  const caregiverIdsFromSlots = useMemo(() => {
    if (!hasApiActivity) return [];
    const selectedLocationId =
      bookingData.clinic && "apiLocationId" in bookingData.clinic
        ? bookingData.clinic.apiLocationId
        : undefined;
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
  }, [hasApiActivity, apiFreeTimeSlots, bookingData.clinic]);

  useEffect(() => {
    if (!hasApiActivity || caregiverIdsFromSlots.length === 0) {
      setBookingCaregivers([]);
      setCaregiversLoading(false);
      return;
    }

    let cancelled = false;
    setCaregiversLoading(true);

    const specialty = encodeURIComponent(bookingData.category ?? "");
    const ids = caregiverIdsFromSlots.join(",");

    void (async () => {
      try {
        const res = await fetch(
          `/api/booking/users?ids=${ids}${specialty ? `&specialty=${specialty}` : ""}`,
        );
        const json = (await res.json()) as { ok?: boolean; users?: BookingCaregiver[] };
        if (cancelled) return;
        if (res.ok && json.ok && Array.isArray(json.users)) {
          setBookingCaregivers(json.users);
        } else {
          setBookingCaregivers([]);
        }
      } catch {
        if (!cancelled) setBookingCaregivers([]);
      } finally {
        if (!cancelled) setCaregiversLoading(false);
      }
    })();

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
    for (const slot of apiFreeTimeSlots) {
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
      const day = parseISO(slot.startDateTime);
      day.setHours(0, 0, 0, 0);
      keys.add(day.toISOString());
    }
    return keys;
  }, [apiFreeTimeSlots, bookingData.clinic, selectedCaregiverUserId]);

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

  const bookableDates = useMemo(
    () => weekdayDates.filter((d) => datesWithApiSlots.has(dayKey(d))),
    [weekdayDates, datesWithApiSlots],
  );

  const canGoPrevRange = dateOffset > 0;
  const canGoNextRange = dateOffset + VISIBLE_DAYS < weekdayDates.length;

  // Pick first API day with slots when entering step 4 (no static default date)
  useEffect(() => {
    if (currentStep !== 4 || !hasApiActivity || timesLoading) return;
    if (apiFreeTimeSlots.length === 0) {
      setSelectedDate(undefined);
      return;
    }

    const selectedHasSlots =
      selectedDate != null && datesWithApiSlots.has(dayKey(selectedDate));
    if (selectedHasSlots) return;

    const firstDay = bookableDates[0];
    if (!firstDay) {
      setSelectedDate(undefined);
      return;
    }
    setSelectedDate(firstDay);
    const idx = weekdayDates.findIndex((d) => isSameDay(d, firstDay));
    setDateOffset(Math.max(0, Math.min(idx, Math.max(0, weekdayDates.length - VISIBLE_DAYS))));
  }, [
    currentStep,
    hasApiActivity,
    timesLoading,
    apiFreeTimeSlots.length,
    datesWithApiSlots,
    bookableDates,
    weekdayDates,
    selectedDate,
  ]);

  // Keep selected day visible in the 7-day stripe when selection changes
  useEffect(() => {
    if (!selectedDate) return;
    const idx = weekdayDates.findIndex((d) => isSameDay(d, selectedDate));
    if (idx < 0) return;
    setDateOffset((prev) => {
      if (idx >= prev && idx < prev + VISIBLE_DAYS) return prev;
      return Math.max(0, Math.min(idx, Math.max(0, weekdayDates.length - VISIBLE_DAYS)));
    });
  }, [selectedDate, weekdayDates]);

  const availableSlots = useMemo((): DisplayTimeSlot[] => {
    if (!selectedDate || !hasApiActivity) return [];

    const selectedLocationId =
      bookingData.clinic && "apiLocationId" in bookingData.clinic
        ? bookingData.clinic.apiLocationId
        : undefined;

    return apiFreeTimeSlots
      .filter((slot) => isSameDay(parseISO(slot.startDateTime), selectedDate))
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
      }));
  }, [
    selectedDate,
    apiFreeTimeSlots,
    hasApiActivity,
    bookingData.clinic && "apiLocationId" in bookingData.clinic
      ? bookingData.clinic.apiLocationId
      : undefined,
    selectedCaregiverUserId,
  ]);

  const selectedDayDurationLabel = useMemo(() => {
    if (!selectedDate || apiFreeTimeSlots.length === 0) return null;
    const onDay = apiFreeTimeSlots.filter((slot) =>
      isSameDay(parseISO(slot.startDateTime), selectedDate),
    );
    const mins = onDay.find((slot) => slot.durationMinutes != null)?.durationMinutes;
    if (mins == null) return null;
    return formatDurationMinutes(mins);
  }, [selectedDate, apiFreeTimeSlots]);

  const handleClose = () => navigate("/");

  /** Prevents re-auto-selecting clinic after user goes back from step 3. */
  const autoSelectedClinicActivityRef = useRef<number | null>(null);

  const handleSelectService = (
    categoryId: string,
    categoryLabel: string,
    service: BookingServiceItem,
  ) => {
    autoSelectedClinicActivityRef.current = null;
    setClinicsAvailabilityReady(false);

    setBookingData({
      categoryId,
      category: categoryLabel,
      service,
      clinic: undefined,
      specialistChosen: false,
      date: undefined,
      time: undefined,
      specialist: undefined,
      slotDurationMinutes: undefined,
      selectedSlot: undefined,
      activityTypeId: undefined,
    });
  };

  // Step 2: only clinics returned by the booking availability API (no static fallback)
  const availableClinics: BookingApiClinic[] = useMemo(() => {
    if (!bookingData.service?.apiActivityId) return [];
    return apiBookingClinics;
  }, [bookingData.service?.apiActivityId, apiBookingClinics]);

  // Auto-select when API returns exactly one location (once per service; not after "Tilbake")
  useEffect(() => {
    const activityId = bookingData.service?.apiActivityId;
    if (!activityId || bookingData.clinic) return;
    if (!availabilityFromApi || availableClinics.length !== 1) return;
    if (autoSelectedClinicActivityRef.current === activityId) return;

    autoSelectedClinicActivityRef.current = activityId;
    setBookingData((prev) => ({ ...prev, clinic: availableClinics[0] }));
  }, [
    bookingData.service?.apiActivityId,
    bookingData.clinic,
    availabilityFromApi,
    availableClinics,
  ]);

  const handleSelectClinic = (clinic: BookingApiClinic) => {
    setBookingData({
      ...bookingData,
      clinic,
      specialistChosen: false,
      date: undefined,
      time: undefined,
      specialist: undefined,
      slotDurationMinutes: undefined,
      selectedSlot: undefined,
    });
    setBookingCaregivers([]);
    setDateOffset(0);
  };

  const handleSelectTimeSlot = (slot: DisplayTimeSlot) => {
    const roomId = slot.roomId;
    const caregiverUserId =
      (bookingData.specialist && isBookingCaregiver(bookingData.specialist)
        ? bookingData.specialist.apiUserId
        : undefined) ?? slot.caregiverUserId;

    const lengthTime =
      slot.lengthTime?.trim() ||
      (slot.durationMinutes != null ? minutesToLengthTime(slot.durationMinutes) : "00:30:00");

    if (roomId == null || caregiverUserId == null) return;

    setBookingData({
      ...bookingData,
      date: selectedDate,
      time: slot.time,
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

    setSubmitLoading(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/booking/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            firstname: formData.firstName.trim(),
            lastname: formData.lastName.trim(),
            email: formData.email.trim(),
            mobile: formData.phone.trim(),
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
            smsreminder: true,
            smsconfirmation: true,
            emailconfirmation: true,
            createifnotexists: true,
          },
        }),
      });

      const json = (await res.json()) as { ok?: boolean; message?: string };

      if (!res.ok || !json.ok) {
        setSubmitError(
          json.message ??
            copy.errorSubmit,
        );
        return;
      }

      setIsSubmitted(true);
    } catch {
      setSubmitError(
        copy.errorSubmitNetwork,
      );
    } finally {
      setSubmitLoading(false);
    }
  };

  const resetStep = (step: 'category' | 'clinic' | 'specialist' | 'time') => {
    if (step === 'category') {
      autoSelectedClinicActivityRef.current = null;
      setBookingData({});
      setExpandedCategory(null);
    } else if (step === 'clinic') {
      setBookingData({
        ...bookingData,
        clinic: undefined,
        specialistChosen: false,
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
        specialist: bookingData.specialist,
        slotDurationMinutes: undefined,
        selectedSlot: undefined,
      });
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
            {copy.successTitle}
          </h1>
          <p className="text-muted-foreground mb-8 font-light">
            {formData.email ? copy.successMessageSmsEmail : copy.successMessageSms}
          </p>
          
          <div className="bg-white rounded-lg p-6 text-left mb-6">
            <div className="space-y-4 text-sm">
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">{copy.successLabelTreatment}</span>
                <span className="font-medium">{bookingData.service?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">{copy.successLabelClinic}</span>
                <span className="font-medium">{copy.successClinicPrefix}{bookingData.clinic?.label}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/30">
                <span className="text-muted-foreground">{copy.successLabelDateTime}</span>
                <span className="font-medium">{bookingData.date && format(bookingData.date, "d. MMM yyyy", { locale: nb })} kl. {bookingData.time}</span>
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
        </div>
      </div>
    );
  }

  const progressBackTarget = (["category", "clinic", "specialist", "time"] as const)[
    currentStep - 2
  ];

  return (
    <div className="min-h-screen bg-white">
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
        {/* Step Indicator */}
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
            <span className="text-xs font-normal text-brand-dark">
              {stepNameByIndex[currentStep]}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((step) => {
              const canNavigate = currentStep > step;
              const isActive = currentStep === step;
              const isDone = currentStep > step;
              const labels = progressAriaLabels;
              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => {
                    if (canNavigate) {
                      if (step === 1) resetStep("category");
                      else if (step === 2) resetStep("clinic");
                      else if (step === 3) resetStep("specialist");
                      else if (step === 4) resetStep("time");
                    }
                  }}
                  disabled={!canNavigate && !isActive}
                  aria-label={`Steg ${step}: ${labels[step - 1]}`}
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "flex-1 h-1 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2",
                    isActive && "bg-brand-dark",
                    isDone && "bg-brand-dark/40 hover:bg-brand-dark/60 cursor-pointer",
                    !isActive && !isDone && "bg-brand-dark/10 cursor-not-allowed",
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
                  <span className="text-brand-dark/60 text-xs">{copy.summaryServiceLabel} </span>
                  <span className="font-normal text-brand-dark">{bookingData.service.name}</span>
                </div>
              )}
              {bookingData.clinic && (
                <div>
                  <span className="text-brand-dark/60 text-xs">{copy.summaryClinicLabel} </span>
                  <span className="font-normal text-brand-dark">{bookingData.clinic.label}</span>
                </div>
              )}
              {bookingData.specialist && (
                <div>
                  <span className="text-brand-dark/60 text-xs">{copy.summarySpecialistLabel} </span>
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
                  ? fillBookingTemplate(copy.step1HeadingFiltered, {
                      category:
                        bookingServices.find((c) => c.id === filterToCategoryId)?.label ?? "",
                    })
                  : copy.step1Heading}
              </h2>

              {filterToCategoryId && (
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
                <p className="text-center text-sm text-brand-dark/60 font-light">{copy.step1Loading}</p>
              )}

              {!servicesLoading && bookingServices.length === 0 && (
                <FriendlyEmpty
                  title={copy.step1EmptyTitle}
                  message={copy.step1EmptyMessage}
                  phone={copy.supportPhone}
                  phoneLabel={copy.supportPhoneLabel}
                />
              )}

              {bookingServices.length > 0 && (
              <div className="space-y-3">
                {[...bookingServices]
                  .filter((c) => !filterToCategoryId || c.id === filterToCategoryId)
                  .sort(sortBookingCategories)
                  .map((category) => {
                    const clinicsForCategory = categoryClinicsById[category.id] ?? [];
                    const showAlleKlinikker =
                      clinicsForCategory.length > 0 &&
                      allBookingLocations.length > 0 &&
                      clinicsForCategory.length === allBookingLocations.length;
                    const isExpanded = expandedCategory === category.id;

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
                          <span className="font-normal text-brand-dark min-w-0">{category.label}</span>
                          <div className="flex items-center gap-3 ml-auto flex-shrink-0">
                            <div className="flex items-center gap-1.5 flex-wrap justify-end max-w-[50vw] sm:max-w-[280px]">
                              {showAlleKlinikker ? (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-brand-dark/10 text-brand-dark/70 font-light">
                                  {copy.step1AllClinicsBadge}
                                </span>
                              ) : (
                                clinicsForCategory.map((clinic) => (
                                  <span
                                    key={clinic.locationId}
                                    className="text-xs px-2 py-0.5 rounded-full bg-white border border-brand-dark/10 text-brand-dark/70 font-light whitespace-nowrap"
                                  >
                                    {clinicBadgeLabel(clinic.name)}
                                  </span>
                                ))
                              )}
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
                                {category.services.map((service) => {
                                  const isFree = service.price === "0";
                                  const duration = serviceDurationLabel(
                                    service,
                                    durationByActivityId,
                                  );
                                  const durationLoading =
                                    service.apiActivityId != null &&
                                    durationByActivityId[service.apiActivityId]?.status ===
                                      "loading";

                                  return (
                                    <button
                                      key={service.apiActivityId ?? service.name}
                                      type="button"
                                      onClick={() =>
                                        handleSelectService(
                                          clinicIdForCategory(category),
                                          category.label,
                                          service,
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
                                        <span className="text-brand-dark block font-normal">
                                          {service.name}
                                        </span>
                                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                                          <span className="text-sm text-brand-dark/80">
                                            {isFree ? copy.step1PriceFree : fillBookingTemplate(copy.step1PriceFrom, { price: service.price })}
                                          </span>
                                          {!isFree && (duration || durationLoading) ? (
                                            <>
                                              <span className="text-brand-dark/40">·</span>
                                              <span className="text-sm text-brand-dark/70">
                                                {durationLoading
                                                  ? copy.step1LoadingDuration
                                                  : duration}
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

              {bookingData.service?.apiActivityId && availabilityLoading && (
                <p className="text-sm text-brand-dark/60 font-light mb-4">
                  {copy.step2Loading}
                </p>
              )}

              {clinicsAvailabilityReady && availableClinics.length === 0 && (
                <FriendlyEmpty
                  title={copy.step2EmptyTitle}
                  message={copy.step2EmptyMessage}
                  phone={copy.supportPhone}
                  phoneLabel={copy.supportPhoneLabel}
                />
              )}

              {clinicsAvailabilityReady && availableClinics.length > 0 && (
                <div className="space-y-3">
                  {availableClinics.map((clinic) => (
                    <button
                      key={clinic.id}
                      type="button"
                      onClick={() => handleSelectClinic(clinic)}
                      className="w-full flex items-center gap-4 p-5 bg-brand-beige/30 border border-brand-dark/10 rounded-2xl hover:bg-white hover:border-brand-dark/30 transition-colors text-left group"
                    >
                      <div className="w-11 h-11 rounded-full bg-brand-beige flex items-center justify-center group-hover:bg-brand-dark/5 transition-colors">
                        <MapPin className="w-5 h-5 text-brand-dark" strokeWidth={1.5} />
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

              {hasApiActivity && caregiversLoading && (
                <p className="text-sm text-brand-dark/60 font-light mb-4">
                  {copy.step3Loading}
                </p>
              )}

              {/* Skip / Any specialist */}
                <button
                  onClick={() =>
                    setBookingData({
                      ...bookingData,
                      specialistChosen: true,
                      specialist: undefined,
                      date: undefined,
                      time: undefined,
                      slotDurationMinutes: undefined,
                    })
                  }
                  className="w-full flex items-center gap-4 p-5 bg-brand-beige/30 border border-brand-dark/10 rounded-2xl hover:bg-white hover:border-brand-dark/30 transition-colors text-left group"
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                            specialist: spec,
                            date: undefined,
                            time: undefined,
                            slotDurationMinutes: undefined,
                          })
                        }
                        className="w-full flex flex-col items-center p-5 bg-brand-beige/30 border border-brand-dark/10 rounded-2xl hover:bg-white hover:border-brand-dark/30 transition-colors text-center group"
                      >
                        <div className="w-16 h-16 rounded-full overflow-hidden mb-3 ring-1 ring-brand-dark/10">
                          <AssetImg
                            src={spec.image}
                            alt={spec.name}
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
                      {"bio" in spec && spec.bio ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSpecialistInfo(spec as Specialist);
                          }}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-brand-beige hover:bg-brand-dark hover:text-brand-warm flex items-center justify-center transition-colors"
                          aria-label={`Les mer om ${spec.name}`}
                        >
                          <Info className="w-3.5 h-3.5" />
                        </button>
                      ) : null}
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
                    <p className="text-xs text-brand-dark/60 font-medium mb-1 uppercase">
                      {copy.step4SelectedDayLabel}
                    </p>
                    <h3 className="text-xl font-light text-brand-dark capitalize">
                      {selectedDate
                        ? format(selectedDate, "EEEE d. MMMM", { locale: nb })
                        : bookableDates.length > 0
                          ? format(bookableDates[0], "EEEE d. MMMM", { locale: nb })
                          : copy.step4NoDaysLabel}
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
                      disabled={
                        dateOffset === 0 &&
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
                        setDateOffset(Math.max(0, dateOffset - VISIBLE_DAYS));
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
                        setDateOffset(
                          Math.min(weekdayDates.length - VISIBLE_DAYS, dateOffset + VISIBLE_DAYS),
                        );
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
                        const hasSlots = datesWithApiSlots.has(dayKey(date));
                        const isPast = date < today;
                        const isDisabled =
                          isPast ||
                          (hasApiActivity &&
                            !timesLoading &&
                            apiFreeTimeSlots.length > 0 &&
                            !hasSlots);

                        return (
                          <button
                            key={date.toISOString()}
                            type="button"
                            onClick={() => {
                              if (!isDisabled) setSelectedDate(date);
                            }}
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
                              {format(date, "EEE", { locale: nb })}
                            </span>
                            <span
                              className={cn(
                                "text-2xl leading-none",
                                isSelected ? "font-medium" : "font-light",
                              )}
                            >
                              {format(date, "d", { locale: nb })}
                            </span>
                            <span
                              className={cn(
                                "text-xs font-light",
                                isSelected
                                  ? "text-brand-warm/80"
                                  : isDisabled
                                    ? "text-brand-dark/25"
                                    : "text-brand-dark/60",
                              )}
                            >
                              {isToday ? copy.step4TodayLabel : format(date, "MMM", { locale: nb })}
                            </span>
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
                      <p className="text-xs text-brand-dark/60 font-medium mb-1 uppercase">
                        {copy.step4PickTimeLabel}
                      </p>
                      <h3 className="text-xl font-light text-brand-dark capitalize">
                        {format(selectedDate, "EEEE d. MMMM", { locale: nb })}
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
                    />
                  ) : timesLoading ? (
                    <p className="text-sm text-brand-dark/60 font-light">{copy.step4LoadingTimes}</p>
                  ) : availableSlots.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.startDateTime}
                          onClick={() => handleSelectTimeSlot(slot)}
                          className="py-3 px-4 bg-white border border-brand-dark/10 rounded-md text-brand-dark font-light text-base hover:bg-brand-dark hover:text-brand-warm hover:border-brand-dark transition-all"
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <FriendlyEmpty
                      title={copy.step4NoSlotsTitle}
                      message={copy.step4NoSlotsMessage}
                      phone={copy.supportPhone}
                      phoneLabel={copy.supportPhoneLabel}
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
                  <div>
                    <span className="text-brand-dark/60 text-xs uppercase">{copy.step5LabelService}</span>
                    <p className="font-normal mt-1 text-brand-dark">{bookingData.service?.name}</p>
                  </div>
                  <div>
                    <span className="text-brand-dark/60 text-xs uppercase">{copy.step5LabelPrice}</span>
                    <p className="font-normal mt-1 text-brand-dark">
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
                  <div>
                    <span className="text-brand-dark/60 text-xs uppercase">{copy.step5LabelClinic}</span>
                    <p className="font-normal mt-1 text-brand-dark">{bookingData.clinic?.label}</p>
                  </div>
                  {bookingData.slotDurationMinutes != null && (
                    <div>
                      <span className="text-brand-dark/60 text-xs uppercase">{copy.step5LabelDuration}</span>
                      <p className="font-normal mt-1 text-brand-dark">
                        {formatDurationMinutes(bookingData.slotDurationMinutes)}
                      </p>
                    </div>
                  )}
                  <div>
                    <span className="text-brand-dark/60 text-xs uppercase">{copy.step5LabelDate}</span>
                    <p className="font-normal mt-1 capitalize text-brand-dark">
                      {bookingData.date && format(bookingData.date, "EEEE d. MMMM", { locale: nb })}
                    </p>
                  </div>
                  <div>
                    <span className="text-brand-dark/60 text-xs uppercase">{copy.step5LabelTime}</span>
                    <p className="font-normal mt-1 text-brand-dark">{bookingData.time}</p>
                  </div>
                </div>
                {bookingData.specialist && (
                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-brand-dark/10">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={assetSrc(bookingData.specialist.image)} alt={bookingData.specialist.name} />
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
                      value={formData.birthNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 11);
                        setFormData({ ...formData, birthNumber: val });
                      }}
                      placeholder={copy.formBirthNumberPlaceholder}
                      maxLength={11}
                      inputMode="numeric"
                      className="mt-1.5 h-12 rounded-lg border-brand-dark/30 bg-white focus-visible:bg-white text-brand-dark placeholder:text-brand-dark/60"
                    />
                    <p className="text-xs text-brand-dark/60 mt-1.5 leading-relaxed font-light">
                      {copy.formBirthNumberHelp}
                    </p>
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-sm text-brand-dark/70">{copy.formPhoneLabel}</label>
                    <Input
                      id="phone"
                      name="tel"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={copy.formPhonePlaceholder}
                      type="tel"
                      inputMode="tel"
                      className="mt-1.5 h-12 rounded-lg border-brand-dark/30 bg-white focus-visible:bg-white text-brand-dark placeholder:text-brand-dark/60"
                    />
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
                    <p className="text-xs text-brand-dark/60 mt-1.5 leading-relaxed font-light">
                      {copy.formEmailHelp}
                    </p>
                  </div>
                  <div className="bg-brand-beige rounded-lg p-4 text-xs text-brand-dark/70 leading-relaxed space-y-2 font-light">
                    <p><strong className="text-brand-dark font-normal">Avbestillingsregler:</strong> {copy.formCancellationRules}</p>
                    <p>
                      <LinkedTemplateText
                        template={copy.formTermsPageTeaser}
                        token="{{termsLink}}"
                        href="/vilkar"
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
                          href="/vilkar"
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
                          href="/personvern"
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
                  !formData.birthNumber ||
                  formData.birthNumber.length !== 11 ||
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
                    formData.birthNumber &&
                    formData.birthNumber.length === 11 &&
                    bookingData.service?.apiActivityId &&
                    bookingData.selectedSlot
                    ? "bg-brand-dark text-brand-warm hover:bg-brand-dark/90 shadow-sm"
                    : "bg-brand-beige text-brand-dark/40 cursor-not-allowed"
                )}
              >
                {submitLoading ? copy.step5SubmittingLabel : copy.step5SubmitLabel}
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
                      <AssetImg 
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
