"use client";

import { trackBookingCompleted, trackBookingInit } from "@/lib/tracking/booking-analytics";
import { matchPasientskyCalendarId } from "@/lib/booking/pasientskyCalendarMatch";
import { cn } from "@/lib/utils";
import { FC, useEffect, useMemo, useRef, useState } from "react";

interface Props {
  serviceProviderId: string;
  /** Explicit Pasientsky calendar / timebok id when known. */
  calendarId?: string;
  /** Sanity specialist name — used to resolve Behandler when calendarId is missing. */
  specialistName?: string;
  /** Stored on specialist in Sanity when editors set a Pasientsky calendar id. */
  specialistCalendarId?: string;
  className?: string;
}

interface ResizeExternalBookingMessageData {
  height: number;
  type: "resizeExternalBooking";
}

const isResizeExternalBookingMessage = (
  data: unknown,
): data is ResizeExternalBookingMessageData =>
  typeof data === "object" &&
  data != null &&
  "type" in data &&
  (data as ResizeExternalBookingMessageData).type === "resizeExternalBooking";

export const PatientskyIframe: FC<Props> = ({
  serviceProviderId,
  calendarId,
  specialistName,
  specialistCalendarId,
  className,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeBaseUrl = process.env.NEXT_PUBLIC_PATIENTSKY_IFRAME_URL;
  const initTracked = useRef(false);
  const [resolvedCalendarId, setResolvedCalendarId] = useState<string | undefined>(
    specialistCalendarId?.trim() || calendarId?.trim() || undefined,
  );
  const [calendarLookupDone, setCalendarLookupDone] = useState(
    Boolean(specialistCalendarId?.trim() || calendarId?.trim() || !specialistName?.trim()),
  );

  useEffect(() => {
    if (initTracked.current) return;
    initTracked.current = true;
    trackBookingInit("pasientsky");
  }, []);

  useEffect(() => {
    const explicit = specialistCalendarId?.trim() || calendarId?.trim();
    if (explicit) {
      setResolvedCalendarId(explicit);
      setCalendarLookupDone(true);
      return;
    }

    if (!specialistName?.trim()) {
      setResolvedCalendarId(undefined);
      setCalendarLookupDone(true);
      return;
    }

    let cancelled = false;
    setCalendarLookupDone(false);

    void (async () => {
      try {
        const res = await fetch(
          `/api/booking/pasientsky/calendars?serviceProviderId=${encodeURIComponent(serviceProviderId)}`,
        );
        const json = (await res.json()) as {
          ok?: boolean;
          calendars?: Array<{ id?: string; name?: string }>;
        };
        if (cancelled) return;
        const calendars = (json.calendars ?? [])
          .filter(
            (row): row is { id: string; name: string } =>
              typeof row.id === "string" &&
              Boolean(row.id.trim()) &&
              typeof row.name === "string" &&
              Boolean(row.name.trim()),
          )
          .map((row) => ({ id: row.id.trim(), name: row.name.trim() }));
        setResolvedCalendarId(
          matchPasientskyCalendarId(calendars, specialistName) ?? undefined,
        );
      } catch {
        if (!cancelled) setResolvedCalendarId(undefined);
      } finally {
        if (!cancelled) setCalendarLookupDone(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [calendarId, serviceProviderId, specialistCalendarId, specialistName]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.event === "booking-completed") {
        const rawId = event.data?.appointmentId ?? event.data?.transaction_id;
        trackBookingCompleted({
          booking_method: "pasientsky",
          transaction_id:
            typeof rawId === "string" || typeof rawId === "number" ? rawId : undefined,
        });
      }

      if (isResizeExternalBookingMessage(event.data) && iframeRef.current) {
        iframeRef.current.height = event.data.height.toString();
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const url = useMemo(() => {
    if (!iframeBaseUrl || !calendarLookupDone) return null;
    const nextUrl = new URL("/embedded/planner/booking", iframeBaseUrl);
    nextUrl.searchParams.set("serviceProviderId", serviceProviderId);
    if (resolvedCalendarId) {
      nextUrl.searchParams.set("calendarId", resolvedCalendarId);
    }
    return nextUrl;
  }, [calendarLookupDone, iframeBaseUrl, resolvedCalendarId, serviceProviderId]);

  if (!iframeBaseUrl) {
    return (
      <p className="text-sm text-muted-foreground font-light">
        Pasientsky-booking er ikke konfigurert (mangler NEXT_PUBLIC_PATIENTSKY_IFRAME_URL).
      </p>
    );
  }

  if (!calendarLookupDone || !url) {
    return (
      <p className="text-sm text-muted-foreground font-light px-4 py-8">
        Laster bestillingsskjema…
      </p>
    );
  }

  return (
    <iframe
      key={`${serviceProviderId}-${resolvedCalendarId ?? "all"}`}
      className={cn("w-full min-h-screen", className)}
      src={url.toString()}
      ref={iframeRef}
      scrolling="no"
      title="Bestill time i Pasientsky"
    />
  );
};
