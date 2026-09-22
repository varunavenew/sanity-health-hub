import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Clock,
  Loader2,
  MapPin,
  Phone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useSpecialistProfileUi } from "@/components/specialist/SpecialistProfileUiContext";
import {
  SPECIALIST_INLINE_BOOKING_SECTION_ID,
  useSpecialistPageBookingOptional,
} from "@/components/specialist/SpecialistPageBooking";
import { useNavCmsPath } from "@/hooks/useNavCmsPath";
import { useClinics } from "@/hooks/useSanity";
import { useSpecialistMetodikaBooking, type BookingCategoryFromApi } from "@/hooks/useBookingCategoryServices";
import { useCaregiverWbActivities } from "@/hooks/useCaregiverWbActivities";
import { resolveBookingCaregiverUserId } from "@/lib/booking/filterClinicsForSpecialist";
import { formatDurationMinutes } from "@/lib/booking/duration";
import {
  bookableActivityIdsForMetodikaClinic,
  moelvPasientskyClinicFromPageClinics,
  resolveSpecialistPageClinics,
  specialistPageClinicHasBookableOnlineSlots,
  metodikaPageClinicHasBookableSlots,
  SPECIALIST_PAGE_FALLBACK_PHONE,
  isMoelvPasientskyPageClinic,
  type SpecialistPageClinic,
  type SpecialistPageMetodikaClinic,
  type SpecialistPagePasientskyClinic,
  type SpecialistPagePhoneClinic,
} from "@/lib/booking/specialist-page-clinics";
import {
  bookingUrlForSpecialistContext,
  filterServicesForCaregiverWbActivities,
  filterSpecialistBookingCategories,
  formatBookingServicePrice,
  resolveSpecialistBookingCategoryIds,
} from "@/lib/booking/specialist-booking";
import { specialistShowsProfileBookingButton } from "@/lib/sanity/specialist-cta";
import { bookingSupportTelHref } from "@/lib/sanity/booking-page-copy";
import { Link, useLocaleParam, useNavigate } from "@/lib/router";
import {
  trackBookingInit,
  trackBookingUnavailable,
} from "@/lib/tracking/booking-analytics";
import { trackBookingMenuStart } from "@/lib/tracking/seo-events";
import type { Specialist } from "@/lib/sanity/specialist-types";

const BOOKING_API_BASE = "/api/booking";

interface InlineBookingSectionProps {
  specialist: Specialist;
}

/** Brown booking band on specialist profiles — clinic first, then branch by system. */
export function SpecialistInlineBookingBand({ specialist }: InlineBookingSectionProps) {
  const ui = useSpecialistProfileUi();
  const pageBooking = useSpecialistPageBookingOptional();
  const { data: sanityClinics = [] } = useClinics();
  const pageClinics = useMemo(
    () => resolveSpecialistPageClinics(specialist, sanityClinics),
    [specialist, sanityClinics],
  );
  const moelvPasientskyClinic = useMemo(
    () => moelvPasientskyClinicFromPageClinics(pageClinics),
    [pageClinics],
  );
  const moelvOnlyProfileBooking =
    Boolean(moelvPasientskyClinic) && pageClinics.length === 1;
  const bookingCategoryIds = useMemo(
    () => resolveSpecialistBookingCategoryIds(specialist),
    [
      specialist.bookingCategoryIds,
      specialist.category,
      specialist.title,
      specialist.subtitle,
      specialist.sanityCategories,
    ],
  );

  if (!specialistShowsProfileBookingButton(specialist, pageBooking)) return null;
  if (moelvOnlyProfileBooking) return null;
  if (bookingCategoryIds.length === 0 && pageClinics.length === 0) return null;

  return (
    <section
      id={SPECIALIST_INLINE_BOOKING_SECTION_ID}
      className="scroll-mt-20 bg-brand-dark py-14 md:py-20"
    >
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-4"
          >
            <h2 className="mb-3 text-2xl font-light text-white md:text-3xl">
              {ui.bookingSectionTitle}
            </h2>
            <p className="max-w-sm text-sm font-light leading-relaxed text-white/60">
              {ui.bookingSectionDescription}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-8"
          >
            <InlineBookingSection specialist={specialist} pageClinics={pageClinics} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function InlineBookingSection({
  specialist,
  pageClinics,
}: InlineBookingSectionProps & {
  pageClinics: ReturnType<typeof resolveSpecialistPageClinics>;
}) {
  const ui = useSpecialistProfileUi();
  const locale = useLocaleParam();
  const isEn = locale === "en";
  const priserPath = useNavCmsPath("pricing") || "/priser";
  const navigate = useNavigate();
  const pageBooking = useSpecialistPageBookingOptional();
  const [selectedClinic, setSelectedClinic] = useState<SpecialistPageClinic | null>(null);
  const bookingCategoryIds = useMemo(
    () => resolveSpecialistBookingCategoryIds(specialist),
    [
      specialist.bookingCategoryIds,
      specialist.category,
      specialist.title,
      specialist.subtitle,
      specialist.sanityCategories,
    ],
  );
  const hasMetodikaClinic = pageClinics.some((clinic) => clinic.kind === "metodika");
  const caregiverUserId = resolveBookingCaregiverUserId(specialist);
  const { categories: metodikaCategories, loading: categoriesLoading } =
    useSpecialistMetodikaBooking(
      hasMetodikaClinic ? bookingCategoryIds : [],
      BOOKING_API_BASE,
    );
  const {
    allowedIds,
    durationMinutesByActivityId,
    loading: wbActivitiesLoading,
  } = useCaregiverWbActivities(
    hasMetodikaClinic ? caregiverUserId : undefined,
    BOOKING_API_BASE,
  );

  const bookableClinics = useMemo(() => {
    if (!pageBooking) return pageClinics;
    return pageClinics.filter((clinic) =>
      specialistPageClinicHasBookableOnlineSlots(clinic, {
        availabilityLoading: pageBooking.availabilityLoading,
        metodikaBookableByLocation: pageBooking.metodikaBookableByLocation,
        hasPasientskySlots: pageBooking.hasPasientskySlots,
      }),
    );
  }, [
    pageClinics,
    pageBooking?.availabilityLoading,
    pageBooking?.hasPasientskySlots,
    pageBooking?.metodikaBookableByLocation,
  ]);

  const bookableClinicIdsKey = useMemo(
    () => bookableClinics.map((clinic) => clinic.id).join(","),
    [bookableClinics],
  );

  const isMultiClinicProfile = pageClinics.length > 1;

  useEffect(() => {
    if (isMultiClinicProfile) {
      setSelectedClinic((prev) => (prev?.kind === "metodika" ? prev : null));
      return;
    }
    if (bookableClinics.length === 1 && bookableClinics[0].kind === "metodika") {
      setSelectedClinic((prev) =>
        prev?.id === bookableClinics[0].id ? prev : bookableClinics[0],
      );
      return;
    }
    setSelectedClinic((prev) => {
      if (prev && bookableClinics.some((clinic) => clinic.id === prev.id)) {
        return prev;
      }
      return null;
    });
  }, [bookableClinicIdsKey, pageBooking?.bookingFocusKey, isMultiClinicProfile]);

  const handleSelectClinic = (clinic: SpecialistPageClinic) => {
    if (isMoelvPasientskyPageClinic(clinic)) {
      trackBookingMenuStart({
        entry_point: "specialist_page",
        practitioner: specialist.name,
        specialty: specialist.title || specialist.expertise?.[0]?.label || null,
        clinic: clinic.label,
      });
      navigate(
        bookingUrlForSpecialistContext({
          specialistSlug: specialist.slug,
          klinikk: clinic.slug,
        }),
      );
      return;
    }
    setSelectedClinic(clinic);
  };

  if (
    !isMultiClinicProfile &&
    bookableClinics.length === 0 &&
    !pageBooking?.availabilityLoading
  ) {
    return (
      <p className="py-4 text-sm font-light text-white/60">{ui.bookingEmptyMessage}</p>
    );
  }

  if (bookableClinics.length === 0 && pageBooking?.availabilityLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-white/60">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        <span className="text-sm font-light">{ui.bookingLoadingLabel}</span>
      </div>
    );
  }

  const showClinicPicker = isMultiClinicProfile
    ? selectedClinic?.kind !== "metodika"
    : bookableClinics.length > 1 && selectedClinic == null;
  const clinicPrompt = isEn ? "Choose a clinic" : "Velg klinikk";
  const backLabel = isEn ? "Back" : "Tilbake";

  return (
    <div>
      {showClinicPicker ? (
        isMultiClinicProfile ? (
          <MultiClinicProfileClinicPicker
            clinics={pageClinics}
            availabilityLoading={Boolean(pageBooking?.availabilityLoading)}
            metodikaBookableByLocation={
              pageBooking?.metodikaBookableByLocation ?? new Map()
            }
            hasPasientskySlots={pageBooking?.hasPasientskySlots ?? false}
            prompt={clinicPrompt}
            isEn={isEn}
            onSelect={handleSelectClinic}
          />
        ) : (
          <ClinicPicker
            clinics={bookableClinics}
            prompt={clinicPrompt}
            isEn={isEn}
            onSelect={handleSelectClinic}
          />
        )
      ) : selectedClinic ? (
        <div className="space-y-4">
          {isMultiClinicProfile || bookableClinics.length > 1 ? (
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm font-light text-white/70 transition-colors hover:text-white"
              onClick={() => setSelectedClinic(null)}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              {backLabel}
            </button>
          ) : null}

          <ClinicBookingBranch
            specialist={specialist}
            clinic={selectedClinic}
            priserPath={priserPath}
            ui={ui}
            isEn={isEn}
            bookingCategoryIds={bookingCategoryIds}
            metodikaCategories={metodikaCategories}
            categoriesLoading={categoriesLoading}
            allowedIds={allowedIds}
            durationMinutesByActivityId={durationMinutesByActivityId}
            wbActivitiesLoading={wbActivitiesLoading}
            caregiverUserId={caregiverUserId}
          />
        </div>
      ) : null}
    </div>
  );
}

function ClinicPicker({
  clinics,
  prompt,
  isEn,
  onSelect,
}: {
  clinics: SpecialistPageClinic[];
  prompt: string;
  isEn: boolean;
  onSelect: (clinic: SpecialistPageClinic) => void;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-light text-white/70">{prompt}</p>
      <div className="space-y-2">
        {clinics.map((clinic) => (
          <button
            key={clinic.id}
            type="button"
            onClick={() => onSelect(clinic)}
            className="flex w-full items-center justify-between rounded-sm border border-white/15 bg-white/10 px-5 py-4 text-left transition-colors hover:bg-white/15"
          >
            <span>
              <span className="block text-sm font-normal text-white">{clinic.label}</span>
              {clinic.address ? (
                <span className="mt-0.5 block text-xs font-light text-white/60">
                  {clinic.address}
                </span>
              ) : null}
            </span>
            <span className="text-xs font-light text-white/50">
              {clinic.kind === "phone"
                ? isEn
                  ? "Call"
                  : "Ring"
                : isEn
                  ? "Book"
                  : "Bestill"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** Majorstuen + Moelv: show both clinics; Metodika rows without slots are informational only. */
function MultiClinicProfileClinicPicker({
  clinics,
  availabilityLoading,
  metodikaBookableByLocation,
  hasPasientskySlots,
  prompt,
  isEn,
  onSelect,
}: {
  clinics: SpecialistPageClinic[];
  availabilityLoading: boolean;
  metodikaBookableByLocation: Map<number, Set<number>>;
  hasPasientskySlots: boolean;
  prompt: string;
  isEn: boolean;
  onSelect: (clinic: SpecialistPageClinic) => void;
}) {
  const bookLabel = isEn ? "Book" : "Bestill";
  const noSlotsMessage = (label: string) =>
    isEn
      ? `${label} has no available appointments online right now.`
      : `${label} har ingen ledige timer på nett akkurat nå.`;

  return (
    <div className="space-y-3">
      <p className="text-sm font-light text-white/70">{prompt}</p>
      <div className="space-y-2">
        {clinics.map((clinic) => {
          if (clinic.kind === "metodika") {
            const hasSlots =
              !availabilityLoading &&
              metodikaPageClinicHasBookableSlots(clinic, metodikaBookableByLocation);

            if (availabilityLoading) {
              return (
                <div
                  key={clinic.id}
                  className="flex w-full items-center justify-between rounded-sm border border-white/15 bg-white/10 px-5 py-4 text-left"
                >
                  <span>
                    <span className="block text-sm font-normal text-white">{clinic.label}</span>
                    {clinic.address ? (
                      <span className="mt-0.5 block text-xs font-light text-white/60">
                        {clinic.address}
                      </span>
                    ) : null}
                  </span>
                  <Loader2 className="h-4 w-4 animate-spin text-white/40" aria-hidden="true" />
                </div>
              );
            }

            if (!hasSlots) {
              return (
                <div
                  key={clinic.id}
                  className="rounded-sm border border-white/10 bg-white/5 px-5 py-4 text-left"
                  role="status"
                >
                  <span className="block text-sm font-normal text-white/80">{clinic.label}</span>
                  {clinic.address ? (
                    <span className="mt-0.5 block text-xs font-light text-white/50">
                      {clinic.address}
                    </span>
                  ) : null}
                  <p className="mt-2 text-xs font-light leading-relaxed text-white/55">
                    {noSlotsMessage(clinic.label)}
                  </p>
                </div>
              );
            }

            return (
              <button
                key={clinic.id}
                type="button"
                onClick={() => onSelect(clinic)}
                className="flex w-full items-center justify-between rounded-sm border border-white/15 bg-white/10 px-5 py-4 text-left transition-colors hover:bg-white/15"
              >
                <span>
                  <span className="block text-sm font-normal text-white">{clinic.label}</span>
                  {clinic.address ? (
                    <span className="mt-0.5 block text-xs font-light text-white/60">
                      {clinic.address}
                    </span>
                  ) : null}
                </span>
                <span className="text-xs font-light text-white/50">{bookLabel}</span>
              </button>
            );
          }

          if (clinic.kind === "pasientsky") {
            const moelvPasientsky = isMoelvPasientskyPageClinic(clinic);
            const bookable =
              !availabilityLoading &&
              (moelvPasientsky || hasPasientskySlots);

            if (availabilityLoading) {
              return (
                <div
                  key={clinic.id}
                  className="flex w-full items-center justify-between rounded-sm border border-white/15 bg-white/10 px-5 py-4 text-left"
                >
                  <span>
                    <span className="block text-sm font-normal text-white">{clinic.label}</span>
                    {clinic.address ? (
                      <span className="mt-0.5 block text-xs font-light text-white/60">
                        {clinic.address}
                      </span>
                    ) : null}
                  </span>
                  <Loader2 className="h-4 w-4 animate-spin text-white/40" aria-hidden="true" />
                </div>
              );
            }

            if (!bookable) {
              return (
                <div
                  key={clinic.id}
                  className="rounded-sm border border-white/10 bg-white/5 px-5 py-4 text-left"
                  role="status"
                >
                  <span className="block text-sm font-normal text-white/80">{clinic.label}</span>
                  {clinic.address ? (
                    <span className="mt-0.5 block text-xs font-light text-white/50">
                      {clinic.address}
                    </span>
                  ) : null}
                  <p className="mt-2 text-xs font-light leading-relaxed text-white/55">
                    {noSlotsMessage(clinic.label)}
                  </p>
                </div>
              );
            }

            return (
              <button
                key={clinic.id}
                type="button"
                onClick={() => onSelect(clinic)}
                className="flex w-full items-center justify-between rounded-sm border border-white/15 bg-white/10 px-5 py-4 text-left transition-colors hover:bg-white/15"
              >
                <span>
                  <span className="block text-sm font-normal text-white">{clinic.label}</span>
                  {clinic.address ? (
                    <span className="mt-0.5 block text-xs font-light text-white/60">
                      {clinic.address}
                    </span>
                  ) : null}
                </span>
                <span className="text-xs font-light text-white/50">{bookLabel}</span>
              </button>
            );
          }

          if (clinic.kind === "phone") {
            return (
              <button
                key={clinic.id}
                type="button"
                onClick={() => onSelect(clinic)}
                className="flex w-full items-center justify-between rounded-sm border border-white/15 bg-white/10 px-5 py-4 text-left transition-colors hover:bg-white/15"
              >
                <span>
                  <span className="block text-sm font-normal text-white">{clinic.label}</span>
                  {clinic.address ? (
                    <span className="mt-0.5 block text-xs font-light text-white/60">
                      {clinic.address}
                    </span>
                  ) : null}
                </span>
                <span className="text-xs font-light text-white/50">
                  {isEn ? "Call" : "Ring"}
                </span>
              </button>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

function ClinicBookingBranch({
  specialist,
  clinic,
  priserPath,
  ui,
  isEn,
  bookingCategoryIds,
  metodikaCategories,
  categoriesLoading,
  allowedIds,
  durationMinutesByActivityId,
  wbActivitiesLoading,
  caregiverUserId,
}: {
  specialist: Specialist;
  clinic: SpecialistPageClinic;
  priserPath: string;
  ui: ReturnType<typeof useSpecialistProfileUi>;
  isEn: boolean;
  bookingCategoryIds: number[];
  metodikaCategories: BookingCategoryFromApi[];
  categoriesLoading: boolean;
  allowedIds: Set<number>;
  durationMinutesByActivityId: Map<number, number>;
  wbActivitiesLoading: boolean;
  caregiverUserId: number | undefined;
}) {
  if (clinic.kind === "phone") {
    return <InlinePhoneClinic clinic={clinic} isEn={isEn} />;
  }

  if (clinic.kind !== "metodika") {
    return (
      <p className="py-4 text-sm font-light text-white/60">
        {isEn ? "Online booking is not available for this clinic here." : "Online booking er ikke tilgjengelig for denne klinikken her."}
      </p>
    );
  }

  return (
    <MetodikaTreatmentPicker
      specialist={specialist}
      clinic={clinic}
      priserPath={priserPath}
      ui={ui}
      isEn={isEn}
      bookingCategoryIds={bookingCategoryIds}
      metodikaCategories={metodikaCategories}
      categoriesLoading={categoriesLoading}
      allowedIds={allowedIds}
      durationMinutesByActivityId={durationMinutesByActivityId}
      wbActivitiesLoading={wbActivitiesLoading}
      caregiverUserId={caregiverUserId}
    />
  );
}

function InlinePhoneClinic({
  clinic,
  isEn,
}: {
  clinic: SpecialistPagePhoneClinic;
  isEn: boolean;
}) {
  useEffect(() => {
    trackBookingInit("external");
    trackBookingUnavailable({
      clinic: clinic.label,
      booking_method: "external",
    });
  }, [clinic.label]);

  const telHref = bookingSupportTelHref(clinic.phone);
  const title = /^cmedical\s/i.test(clinic.label)
    ? clinic.label
    : `CMedical ${clinic.label}`;

  return (
    <div className="rounded-sm border border-white/15 bg-white/10 px-6 py-8 text-center">
      <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white/70">
        <MapPin className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="text-lg font-light text-white">{title}</p>
      {clinic.address ? (
        <p className="mt-2 text-sm font-light text-white/60">{clinic.address}</p>
      ) : null}
      <p className="mt-6 text-sm font-light text-white/70">
        {isEn ? "Call us to book an appointment." : "Ring oss for å bestille time."}
      </p>
      <a
        href={telHref}
        className="mt-5 inline-flex items-center justify-center gap-3 text-2xl font-light text-white transition-colors hover:text-white/80"
      >
        <Phone className="h-5 w-5" aria-hidden="true" />
        <span>{clinic.phone}</span>
      </a>
      {clinic.hours ? (
        <p className="mt-4 text-xs font-light text-white/60">{clinic.hours}</p>
      ) : null}
    </div>
  );
}

function InlineMetodikaCallUs({
  clinic,
  isEn,
}: {
  clinic: SpecialistPageMetodikaClinic | SpecialistPagePasientskyClinic;
  isEn: boolean;
}) {
  const phone = clinic.phone || SPECIALIST_PAGE_FALLBACK_PHONE;
  const telHref = bookingSupportTelHref(phone);
  const label = isEn ? "Call us and we will help you" : "Ring oss så hjelper vi deg";

  return (
    <div className="mt-4 border-t border-white/10 pt-4 text-center">
      <a
        href={telHref}
        className="inline-flex items-center justify-center gap-2 text-sm font-light text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
      >
        <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          {label} · {phone}
        </span>
      </a>
    </div>
  );
}

function MetodikaTreatmentPicker({
  specialist,
  clinic,
  priserPath,
  ui,
  isEn,
  bookingCategoryIds,
  metodikaCategories,
  categoriesLoading,
  allowedIds,
  durationMinutesByActivityId,
  wbActivitiesLoading,
  caregiverUserId,
}: {
  specialist: Specialist;
  clinic: SpecialistPageMetodikaClinic | SpecialistPagePasientskyClinic;
  priserPath: string;
  ui: ReturnType<typeof useSpecialistProfileUi>;
  isEn: boolean;
  bookingCategoryIds: number[];
  metodikaCategories: BookingCategoryFromApi[];
  categoriesLoading: boolean;
  allowedIds: Set<number>;
  durationMinutesByActivityId: Map<number, number>;
  wbActivitiesLoading: boolean;
  caregiverUserId: number | undefined;
}) {
  const pageBooking = useSpecialistPageBookingOptional();
  const bookableAtClinic = useMemo(() => {
    if (clinic.kind !== "metodika") return new Set<number>();
    return bookableActivityIdsForMetodikaClinic(
      clinic,
      pageBooking?.metodikaBookableByLocation ?? new Map(),
    );
  }, [pageBooking?.metodikaBookableByLocation, clinic]);

  const dateLang = isEn ? "en" : "no";
  const navigate = useNavigate();
  const caregiverCategories = useMemo(() => {
    const filtered = filterSpecialistBookingCategories(specialist, metodikaCategories);
    if (caregiverUserId == null || allowedIds.size === 0) return [];
    return filtered
      .map((category) => ({
        ...category,
        services: filterServicesForCaregiverWbActivities(
          category.services,
          allowedIds,
        ).filter(
          (service) =>
            service.apiActivityId != null &&
            bookableAtClinic.has(service.apiActivityId),
        ),
      }))
      .filter((category) => category.services.length > 0);
  }, [
    specialist,
    metodikaCategories,
    allowedIds,
    caregiverUserId,
    bookableAtClinic,
  ]);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);

  const categories = caregiverCategories;
  const isLoading =
    categoriesLoading ||
    (wbActivitiesLoading && categories.length === 0) ||
    Boolean(pageBooking?.availabilityLoading);

  const resolveServiceDurationMinutes = (service: {
    apiActivityId?: number;
    durationMinutes?: number;
  }): number | undefined => {
    if (service.durationMinutes != null) return service.durationMinutes;
    if (service.apiActivityId == null) return undefined;
    return durationMinutesByActivityId.get(service.apiActivityId);
  };

  if (bookingCategoryIds.length === 0) {
    return (
      <InlinePhoneClinic
        clinic={{
          ...clinic,
          kind: "phone",
          phone: clinic.phone || SPECIALIST_PAGE_FALLBACK_PHONE,
        }}
        isEn={isEn}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-white/60">
        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
        <span className="text-sm font-light">{ui.bookingLoadingLabel}</span>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-sm font-light text-white/60">{ui.bookingEmptyMessage}</p>
        <InlinePhoneClinic
          clinic={{
            ...clinic,
            kind: "phone",
            phone: clinic.phone || SPECIALIST_PAGE_FALLBACK_PHONE,
          }}
          isEn={isEn}
        />
      </div>
    );
  }

  const navigateToBookingFlow = (
    apiGroupId: number,
    categorySlug: string,
    serviceName: string,
    apiActivityId: number,
  ) => {
    navigate(
      bookingUrlForSpecialistContext({
        specialistSlug: specialist.slug,
        apiGroupId,
        kategori: categorySlug,
        aktivitetId: apiActivityId,
        klinikk: clinic.slug,
        tjeneste: serviceName,
      }),
    );
  };

  const handleSelectService = (
    apiGroupId: number,
    categorySlug: string,
    categoryLabel: string,
    serviceName: string,
    servicePrice: string,
    apiActivityId?: number,
  ) => {
    if (apiActivityId == null) return;

    trackBookingMenuStart({
      entry_point: "specialist_page",
      practitioner: specialist.name,
      specialty: specialist.title || specialist.expertise?.[0]?.label || null,
      clinic: clinic.label,
      category: categorySlug,
      service_name: serviceName,
    });

    navigateToBookingFlow(apiGroupId, categorySlug, serviceName, apiActivityId);
  };

  const effectiveExpanded =
    categories.length === 1 ? categories[0].apiGroupId : expandedCategory;

  return (
    <div>
      <div className="space-y-3">
        {categories.map((category) => (
          <div
            key={category.apiGroupId}
            className="overflow-hidden rounded-sm border border-white/15 bg-white/10"
          >
            <button
              type="button"
              onClick={() =>
                categories.length > 1 &&
                setExpandedCategory(
                  effectiveExpanded === category.apiGroupId ? null : category.apiGroupId,
                )
              }
              aria-expanded={effectiveExpanded === category.apiGroupId}
              className={`flex w-full items-center justify-between px-5 py-4 text-left transition-colors ${
                categories.length > 1 ? "cursor-pointer hover:bg-white/15" : "cursor-default"
              }`}
            >
              <span className="methodika-sentence-case text-sm font-medium text-white">
                {category.label}
              </span>
              {categories.length > 1 &&
                (effectiveExpanded === category.apiGroupId ? (
                  <ChevronUp className="h-4 w-4 text-white/40" aria-hidden="true" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-white/40" aria-hidden="true" />
                ))}
            </button>

            <AnimatePresence initial={false}>
              {effectiveExpanded === category.apiGroupId ? (
                <motion.div
                  key={`services-${category.apiGroupId}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="scrollbar-dark-subtle max-h-[min(28rem,50vh)] overflow-y-auto overscroll-y-contain border-t border-white/10 pr-1">
                    {category.services.map((service) => {
                      const activityId = service.apiActivityId;
                      const durationMinutes = resolveServiceDurationMinutes(service);
                      const durationLabel =
                        durationMinutes != null
                          ? formatDurationMinutes(durationMinutes, dateLang)
                          : undefined;

                      return (
                        <button
                          key={service.apiActivityId ?? service.name}
                          type="button"
                          onClick={() =>
                            handleSelectService(
                              category.apiGroupId,
                              category.id,
                              category.label,
                              service.name,
                              service.price,
                              service.apiActivityId,
                            )
                          }
                          className="group flex w-full items-center justify-between gap-4 border-b border-white/5 px-5 py-4 text-left transition-colors last:border-b-0 hover:bg-white/15"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="methodika-sentence-case truncate pr-4 text-sm font-normal text-white">
                              {service.name}
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs font-medium text-white/80">
                              {durationLabel ? (
                                <span className="inline-flex items-center gap-1.5">
                                  <Clock
                                    className="h-3.5 w-3.5 shrink-0 stroke-[1.5] text-white/70"
                                    aria-hidden="true"
                                  />
                                  <span>{durationLabel}</span>
                                </span>
                              ) : null}
                              <span>{formatBookingServicePrice(service.price)}</span>
                            </div>
                          </div>
                          <ArrowRight
                            className="h-4 w-4 shrink-0 text-white/40 transition-colors group-hover:text-white"
                            aria-hidden="true"
                          />
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <InlineMetodikaCallUs clinic={clinic} isEn={isEn} />

      <div className="mt-6">
        <Button
          variant="outline"
          className="rounded-full border-brand-mid bg-brand-mid text-sm font-light text-brand-dark hover:bg-brand-mid/80"
          asChild
        >
          <Link
            to={priserPath}
            onClick={() => {
              trackBookingMenuStart({
                entry_point: "specialist_page",
                practitioner: specialist.name,
                specialty: specialist.title || specialist.expertise?.[0]?.label || null,
                clinic: clinic.label,
              });
            }}
          >
            {ui.bookingViewAllLabel}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
