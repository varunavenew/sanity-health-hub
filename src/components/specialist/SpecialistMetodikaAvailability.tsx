"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { FriendlyEmpty } from "@/components/booking/FriendlyEmpty";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useCaregiverWbActivities } from "@/hooks/useCaregiverWbActivities";
import { useSpecialistMetodikaBooking } from "@/hooks/useBookingCategoryServices";
import { useBookingPage } from "@/hooks/useSanity";
import type { BookingAvailabilitySlot } from "@/app/api/booking/availability/route";
import {
  fodselsnummerFieldError,
  isFodselsnummerReadyForSubmit,
} from "@/lib/booking/booking-validation";
import { minutesToLengthTime } from "@/lib/booking/duration";
import { resolveBookingCaregiverUserId } from "@/lib/booking/filterClinicsForSpecialist";
import {
  formatBookingLongDate,
  formatBookingShortDate,
  type BookingDateLang,
} from "@/lib/booking/format-booking-date";
import { metodikaSearchTime } from "@/lib/booking/metodikaSearchTime";
import { normalizeFodselsnummerInput } from "@/lib/booking/personalNumber";
import {
  isValidNorwegianMobileFieldInput,
  normalizeNorwegianMobileForMetodika,
  stripNorwegianMobileInputForField,
} from "@/lib/booking/phoneMobile";
import {
  filterServicesForCaregiverWbActivities,
  filterSpecialistBookingCategories,
  formatBookingServicePrice,
  resolveSpecialistBookingCategoryIds,
} from "@/lib/booking/specialist-booking";
import type { SpecialistPageMetodikaClinic } from "@/lib/booking/specialist-page-clinics";
import { SPECIALIST_PAGE_FALLBACK_PHONE } from "@/lib/booking/specialist-page-clinics";
import {
  defaultBookingPageCopyForLang,
  splitTemplateLink,
} from "@/lib/sanity/booking-page-copy";
import type { Specialist } from "@/lib/sanity/specialist-types";
import { Link, useLocaleParam } from "@/lib/router";
import {
  metodikaBookingCompletedFromState,
  trackBookingCompleted,
  trackBookingFailed,
  trackBookingInit,
  trackBookingSubmitted,
} from "@/lib/tracking/booking-analytics";
import { cn } from "@/lib/utils";

const BOOKING_LEGAL_POLICY_PATH = "/personvern";

type FlatService = {
  name: string;
  price: string;
  apiActivityId: number;
  categoryLabel?: string;
};

export type SpecialistMetodikaService = FlatService & {
  durationMinutes?: number;
};

type SelectedSlot = {
  startDateTime: string;
  time: string;
  roomId: number;
  caregiverUserId: number;
  durationMinutes?: number;
  lengthTime: string;
};

function LinkedTemplateText({
  template,
  token,
  href,
  linkText,
}: {
  template: string;
  token: string;
  href: string;
  linkText: string;
}) {
  const [before, after] = splitTemplateLink(template, token);
  return (
    <>
      {before}
      <Link to={href} className="underline hover:text-foreground transition-colors">
        {linkText}
      </Link>
      {after}
    </>
  );
}

function dayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseSlotDay(iso: string): string {
  return iso.slice(0, 10);
}

function upcomingDays(count: number): Date[] {
  const days: Date[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  for (let i = 0; i < count; i += 1) {
    days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

interface SpecialistMetodikaAvailabilityProps {
  specialist: Specialist;
  clinic: SpecialistPageMetodikaClinic;
  /**
   * BFF prefix. LIVE default `/api/booking`.
   * TEST uses `/api/test/booking` (gated UI only).
   */
  bookingApiBase?: string;
  /** Skip service picker when the user already chose a service on the profile. */
  initialService?: FlatService;
}

export function SpecialistMetodikaAvailability({
  specialist,
  clinic,
  bookingApiBase = "/api/booking",
  initialService,
}: SpecialistMetodikaAvailabilityProps) {
  const locale = useLocaleParam();
  const dateLang: BookingDateLang = locale === "en" ? "en" : "no";
  const { data: bookingPage } = useBookingPage();
  const copy = bookingPage ?? defaultBookingPageCopyForLang(dateLang);

  const bookingCategoryIds = useMemo(
    () => resolveSpecialistBookingCategoryIds(specialist),
    [specialist],
  );
  const caregiverUserId = resolveBookingCaregiverUserId(specialist);
  const { categories: metodikaCategories, loading: categoriesLoading } =
    useSpecialistMetodikaBooking(bookingCategoryIds, bookingApiBase);
  const { allowedIds, loading: matrixLoading } =
    useCaregiverWbActivities(caregiverUserId, bookingApiBase);

  const services = useMemo((): FlatService[] => {
    const filtered = filterSpecialistBookingCategories(specialist, metodikaCategories);
    const withCaregiver = filtered.map((category) => ({
      ...category,
      services: filterServicesForCaregiverWbActivities(category.services, allowedIds),
    }));
    const flat: FlatService[] = [];
    for (const category of withCaregiver) {
      for (const service of category.services) {
        if (service.apiActivityId == null) continue;
        flat.push({
          name: service.name,
          price: service.price,
          apiActivityId: service.apiActivityId,
          categoryLabel: category.label,
        });
      }
    }
    return flat;
  }, [specialist, metodikaCategories, allowedIds]);

  const [selectedService, setSelectedService] = useState<FlatService | null>(null);
  const [hintSlots, setHintSlots] = useState<BookingAvailabilitySlot[]>([]);
  const [hintsLoading, setHintsLoading] = useState(false);
  const [activityTypeId, setActivityTypeId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [daySlots, setDaySlots] = useState<BookingAvailabilitySlot[]>([]);
  const [timesLoading, setTimesLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthNumber: "",
    phone: "",
    email: "",
    acceptTerms: false,
    acceptDataProcessing: false,
    acceptMarketing: false,
  });
  const [birthNumberError, setBirthNumberError] = useState<string | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const phone = clinic.phone || SPECIALIST_PAGE_FALLBACK_PHONE;
  const days = useMemo(() => upcomingDays(7), []);

  useEffect(() => {
    trackBookingInit("metodika");
  }, [clinic.id]);

  useEffect(() => {
    if (initialService) {
      setSelectedService(initialService);
      return;
    }
    if (services.length === 1) setSelectedService(services[0]);
  }, [initialService, services]);

  useEffect(() => {
    setHintSlots([]);
    setActivityTypeId(null);
    setSelectedDate(undefined);
    setDaySlots([]);
    setSelectedSlot(null);
    setIsSubmitted(false);
    setSubmitError(null);
  }, [selectedService?.apiActivityId, clinic.apiLocationId]);

  useEffect(() => {
    const activityId = selectedService?.apiActivityId;
    if (activityId == null) return;

    let cancelled = false;
    setHintsLoading(true);

    async function loadHints() {
      try {
        const params = new URLSearchParams({
          wbactivityId: String(activityId),
          locationId: String(clinic.apiLocationId),
        });
        if (caregiverUserId != null) {
          params.set("caregiverUserId", String(caregiverUserId));
        }
        const res = await fetch(`${bookingApiBase}/availability?${params.toString()}`);
        const json = (await res.json()) as {
          ok?: boolean;
          slots?: BookingAvailabilitySlot[];
          activityTypeId?: number;
        };
        if (cancelled) return;
        setHintSlots(res.ok && json.ok && Array.isArray(json.slots) ? json.slots : []);
        if (typeof json.activityTypeId === "number") {
          setActivityTypeId(json.activityTypeId);
        }
      } catch {
        if (!cancelled) setHintSlots([]);
      } finally {
        if (!cancelled) setHintsLoading(false);
      }
    }

    loadHints();
    return () => {
      cancelled = true;
    };
  }, [selectedService?.apiActivityId, clinic.apiLocationId, caregiverUserId, bookingApiBase]);

  useEffect(() => {
    const activityId = selectedService?.apiActivityId;
    if (!selectedDate || activityId == null) {
      setDaySlots([]);
      return;
    }

    let cancelled = false;
    setTimesLoading(true);

    async function loadDay() {
      try {
        const params = new URLSearchParams({
          wbactivityId: String(activityId),
          locationId: String(clinic.apiLocationId),
          searchFromTime: metodikaSearchTime(selectedDate, false),
          searchToTime: metodikaSearchTime(selectedDate, true),
        });
        if (caregiverUserId != null) {
          params.set("caregiverUserId", String(caregiverUserId));
        }
        const res = await fetch(`${bookingApiBase}/availability?${params.toString()}`);
        const json = (await res.json()) as {
          ok?: boolean;
          slots?: BookingAvailabilitySlot[];
          activityTypeId?: number;
        };
        if (cancelled) return;
        setDaySlots(res.ok && json.ok && Array.isArray(json.slots) ? json.slots : []);
        if (typeof json.activityTypeId === "number") {
          setActivityTypeId(json.activityTypeId);
        }
      } catch {
        if (!cancelled) setDaySlots([]);
      } finally {
        if (!cancelled) setTimesLoading(false);
      }
    }

    loadDay();
    return () => {
      cancelled = true;
    };
  }, [selectedDate, selectedService?.apiActivityId, clinic.apiLocationId, caregiverUserId, bookingApiBase]);

  const hintDays = useMemo(() => {
    const keys = new Set<string>();
    for (const slot of hintSlots) {
      if (slot.locationId != null && slot.locationId !== clinic.apiLocationId) continue;
      keys.add(parseSlotDay(slot.startDateTime));
    }
    return keys;
  }, [hintSlots, clinic.apiLocationId]);

  useEffect(() => {
    if (!initialService || selectedDate || hintDays.size === 0) return;
    const firstAvailable = days.find((day) => hintDays.has(dayKey(day)));
    if (firstAvailable) setSelectedDate(firstAvailable);
  }, [initialService, hintDays, days, selectedDate]);

  const visibleSlots = selectedDate ? daySlots : [];
  const loadingServices =
    categoriesLoading || (caregiverUserId != null && matrixLoading);

  const selectSlot = (slot: BookingAvailabilitySlot) => {
    const roomId = slot.roomId;
    const slotCaregiver = slot.caregiverUserId ?? caregiverUserId;
    if (roomId == null || slotCaregiver == null) return;
    const lengthTime =
      slot.lengthTime?.trim() ||
      (slot.durationMinutes != null
        ? minutesToLengthTime(slot.durationMinutes)
        : "00:30:00");
    setSelectedSlot({
      startDateTime: slot.startDateTime,
      time: slot.time,
      roomId,
      caregiverUserId: slotCaregiver,
      durationMinutes: slot.durationMinutes,
      lengthTime,
    });
    setSubmitError(null);
  };

  const handleSubmit = async () => {
    if (
      !formData.acceptTerms ||
      !formData.acceptDataProcessing ||
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !isValidNorwegianMobileFieldInput(formData.phone) ||
      !selectedService ||
      !selectedSlot
    ) {
      return;
    }
    if (activityTypeId == null) {
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
    const completedTracking = metodikaBookingCompletedFromState({
      clinic: { label: clinic.label },
      service: selectedService,
      category: selectedService.categoryLabel ?? null,
      specialist,
      slot: selectedSlot,
    });

    trackBookingSubmitted({
      booking_method: "metodika",
      clinic: clinic.label,
      service_name: selectedService.name,
    });

    try {
      const res = await fetch(`${bookingApiBase}/complete`, {
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
            wbactivityId: selectedService.apiActivityId,
            activityTypeId,
            mainCaregiverUserId: selectedSlot.caregiverUserId,
            roomId: selectedSlot.roomId,
            starttime: selectedSlot.startDateTime,
            lengthtime: selectedSlot.lengthTime,
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
        setSubmitError(json.message ?? copy.errorSubmit);
        return;
      }
      if (json.appointmentId != null && String(json.appointmentId).trim()) {
        trackBookingCompleted({
          booking_method: "metodika",
          transaction_id: json.appointmentId,
          ...completedTracking,
        });
      }
      setIsSubmitted(true);
    } catch {
      trackBookingFailed({ error_type: "network", booking_method: "metodika" });
      setSubmitError(copy.errorSubmitNetwork);
    } finally {
      setSubmitLoading(false);
    }
  };

  const canSubmit =
    formData.acceptTerms &&
    formData.acceptDataProcessing &&
    Boolean(formData.firstName.trim()) &&
    Boolean(formData.lastName.trim()) &&
    isValidNorwegianMobileFieldInput(formData.phone) &&
    isFodselsnummerReadyForSubmit(formData.birthNumber) &&
    !submitLoading;

  if (loadingServices) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        <span className="text-sm font-light">{copy.step1Loading}</span>
      </div>
    );
  }

  if (bookingCategoryIds.length === 0 || services.length === 0) {
    return (
      <FriendlyEmpty
        title={copy.step4NotOnlineTitle}
        message={copy.step4NotOnlineMessage}
        phone={phone}
        phoneLabel={copy.supportPhoneLabel}
      />
    );
  }

  if (isSubmitted && selectedService && selectedSlot && selectedDate) {
    return (
      <div className="space-y-3 rounded-lg bg-white p-6 text-center">
        <p className="text-lg font-normal text-foreground">{copy.successTitle}</p>
        <p className="text-sm font-light text-muted-foreground">
          {formData.email.trim() ? copy.successMessageSmsEmail : copy.successMessageSms}
        </p>
        <p className="text-sm font-light text-foreground">
          {selectedService.name}
          <br />
          {clinic.label} · {formatBookingLongDate(selectedDate, dateLang)} {selectedSlot.time}
        </p>
      </div>
    );
  }

  if (selectedSlot && selectedService && selectedDate) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          className="text-sm font-light text-muted-foreground underline-offset-4 hover:underline"
          onClick={() => setSelectedSlot(null)}
        >
          {copy.backLabel}
        </button>
        <p className="text-sm font-light text-foreground">
          {selectedService.name} · {clinic.label}
          <br />
          {formatBookingLongDate(selectedDate, dateLang)} {selectedSlot.time}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="sp-firstName" className="text-sm text-foreground/70">
              {copy.formFirstNameLabel}
            </label>
            <Input
              id="sp-firstName"
              name="given-name"
              autoComplete="given-name"
              value={formData.firstName}
              onChange={(event) =>
                setFormData({ ...formData, firstName: event.target.value })
              }
              placeholder={copy.formFirstNamePlaceholder}
              className="mt-1.5"
            />
          </div>
          <div>
            <label htmlFor="sp-lastName" className="text-sm text-foreground/70">
              {copy.formLastNameLabel}
            </label>
            <Input
              id="sp-lastName"
              name="family-name"
              autoComplete="family-name"
              value={formData.lastName}
              onChange={(event) =>
                setFormData({ ...formData, lastName: event.target.value })
              }
              placeholder={copy.formLastNamePlaceholder}
              className="mt-1.5"
            />
          </div>
        </div>
        <div>
          <label htmlFor="sp-birthNumber" className="text-sm text-foreground/70">
            {copy.formBirthNumberLabel}
          </label>
          <Input
            id="sp-birthNumber"
            name="birthNumber"
            autoComplete="off"
            inputMode="numeric"
            value={formData.birthNumber}
            onChange={(event) => {
              const val = normalizeFodselsnummerInput(event.target.value);
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
            aria-invalid={birthNumberError ? true : undefined}
            className={cn("mt-1.5", birthNumberError && "border-destructive")}
          />
          {birthNumberError ? (
            <p className="mt-1.5 text-xs font-light text-destructive" role="alert">
              {birthNumberError}
            </p>
          ) : (
            <p className="mt-1.5 text-xs font-light text-muted-foreground">
              {copy.formBirthNumberHelp}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="sp-phone" className="text-sm text-foreground/70">
            {copy.formPhoneLabel}
          </label>
          <div className="mt-1.5 flex h-10 overflow-hidden rounded-md border border-input bg-background">
            <span className="flex shrink-0 items-center border-r border-input px-3 text-sm text-muted-foreground">
              +47
            </span>
            <Input
              id="sp-phone"
              name="tel"
              autoComplete="tel-national"
              type="tel"
              inputMode="numeric"
              maxLength={8}
              value={formData.phone}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  phone: stripNorwegianMobileInputForField(event.target.value),
                })
              }
              placeholder={copy.formPhonePlaceholder.replace(/^\+47\s*/i, "")}
              className="h-full rounded-none border-0 shadow-none focus-visible:ring-0"
            />
          </div>
        </div>
        <div>
          <label htmlFor="sp-email" className="text-sm text-foreground/70">
            {copy.formEmailLabel}
          </label>
          <Input
            id="sp-email"
            name="email"
            autoComplete="email"
            type="email"
            value={formData.email}
            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
            placeholder={copy.formEmailPlaceholder}
            className="mt-1.5"
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Checkbox
              id="sp-terms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, acceptTerms: checked === true })
              }
              className="mt-0.5"
            />
            <label htmlFor="sp-terms" className="cursor-pointer text-sm font-light leading-relaxed">
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
              id="sp-privacy"
              checked={formData.acceptDataProcessing}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, acceptDataProcessing: checked === true })
              }
              className="mt-0.5"
            />
            <label htmlFor="sp-privacy" className="cursor-pointer text-sm font-light leading-relaxed">
              <LinkedTemplateText
                template={copy.formPrivacyCheckbox}
                token="{{privacyLink}}"
                href={BOOKING_LEGAL_POLICY_PATH}
                linkText={copy.formPrivacyLinkText}
              />
            </label>
          </div>
        </div>
        {submitError ? (
          <p className="text-sm font-light text-destructive" role="alert">
            {submitError}
          </p>
        ) : null}
        <Button
          type="button"
          className="w-full"
          disabled={!canSubmit}
          onClick={() => void handleSubmit()}
        >
          {submitLoading ? copy.step5SubmittingLabel : copy.step5SubmitLabel}
        </Button>
        <CallUsRow phone={phone} label={copy.supportPhoneLabel} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {services.length > 1 && !initialService ? (
        <div className="space-y-2">
          <p className="text-sm font-normal text-foreground">{copy.stepLabelService}</p>
          <div className="flex flex-wrap gap-2">
            {services.map((service) => (
              <button
                key={service.apiActivityId}
                type="button"
                onClick={() => setSelectedService(service)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm font-light transition-colors",
                  selectedService?.apiActivityId === service.apiActivityId
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-foreground hover:border-foreground/50",
                )}
              >
                {service.name}
                {service.price ? (
                  <span className="ml-1 opacity-70">{formatBookingServicePrice(service.price)}</span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      ) : selectedService ? (
        <>
          {!hintsLoading && hintDays.size === 0 ? (
            <FriendlyEmpty
              title={copy.step4NoSlotsTitle}
              message={copy.step4NoSlotsMessage}
              phone={phone}
              phoneLabel={copy.supportPhoneLabel}
            />
          ) : (
            <>
              <p className="text-sm font-light text-muted-foreground">{selectedService.name}</p>
              <div className="space-y-2">
                <p className="text-sm font-normal text-foreground">{copy.step4PickTimeLabel}</p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {days.map((day) => {
                    const key = dayKey(day);
                    const hasHint = hintDays.has(key);
                    const isSelected = selectedDate ? dayKey(selectedDate) === key : false;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => {
                          setSelectedDate(day);
                          setSelectedSlot(null);
                        }}
                        className={cn(
                          "min-w-[4.5rem] shrink-0 rounded-lg border px-2 py-2 text-center text-xs font-light transition-colors",
                          isSelected
                            ? "border-foreground bg-foreground text-background"
                            : hasHint
                              ? "border-foreground/40 text-foreground"
                              : "border-border text-muted-foreground",
                        )}
                      >
                        {formatBookingShortDate(day, dateLang)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {hintsLoading && !selectedDate ? (
                <div className="flex items-center gap-2 py-4 text-sm font-light text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  {copy.step4LoadingTimes}
                </div>
              ) : null}

              {selectedDate ? (
                timesLoading ? (
                  <div className="flex items-center gap-2 py-4 text-sm font-light text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    {copy.step4LoadingTimes}
                  </div>
                ) : visibleSlots.length === 0 ? (
                  <FriendlyEmpty
                    title={copy.step4NoSlotsTitle}
                    message={copy.step4NoSlotsMessage}
                    phone={phone}
                    phoneLabel={copy.supportPhoneLabel}
                  />
                ) : (
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                    {visibleSlots.map((slot) => (
                      <button
                        key={`${slot.startDateTime}-${slot.roomId ?? ""}`}
                        type="button"
                        onClick={() => selectSlot(slot)}
                        className="rounded-lg border border-border px-2 py-2 text-sm font-light hover:border-foreground/50"
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )
              ) : null}

              {!(selectedDate && visibleSlots.length === 0) && hintDays.size > 0 ? (
                <CallUsRow phone={phone} label={copy.supportPhoneLabel} />
              ) : null}
            </>
          )}
        </>
      ) : (
        <p className="text-sm font-light text-muted-foreground">{copy.step1Heading}</p>
      )}
    </div>
  );
}

function CallUsRow({ phone, label }: { phone: string; label: string }) {
  const telHref = `tel:${phone.replace(/\s+/g, "")}`;
  return (
    <a
      href={telHref}
      className="inline-flex items-center justify-center gap-2 text-sm font-light text-muted-foreground underline-offset-4 hover:underline"
    >
      {label} · {phone}
    </a>
  );
}
