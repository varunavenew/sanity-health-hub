"use client";

import { trackBookingCompleted, trackBookingInit } from "@/lib/tracking/booking-analytics";
import { cn } from "@/lib/utils";
import { FC, useEffect, useMemo, useRef } from "react";

interface Props {
  serviceProviderId: string;
  calendarId?: string;
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
  className,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframeBaseUrl = process.env.NEXT_PUBLIC_PATIENTSKY_IFRAME_URL;
  const initTracked = useRef(false);

  useEffect(() => {
    if (initTracked.current) return;
    initTracked.current = true;
    trackBookingInit("pasientsky");
  }, []);

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
    if (!iframeBaseUrl) return null;
    const nextUrl = new URL("/embedded/planner/booking", iframeBaseUrl);
    nextUrl.searchParams.set("serviceProviderId", serviceProviderId);
    if (calendarId) nextUrl.searchParams.set("calendarId", calendarId);
    return nextUrl;
  }, [calendarId, iframeBaseUrl, serviceProviderId]);

  if (!iframeBaseUrl || !url) {
    return (
      <p className="text-sm text-muted-foreground font-light">
        Pasientsky-booking er ikke konfigurert (mangler NEXT_PUBLIC_PATIENTSKY_IFRAME_URL).
      </p>
    );
  }

  return (
    <iframe
      className={cn("w-full min-h-screen", className)}
      src={url.toString()}
      ref={iframeRef}
      scrolling="no"
      title="Bestill time i Pasientsky"
    />
  );
};
