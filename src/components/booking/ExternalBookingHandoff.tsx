"use client";

import { trackWithGTM } from "@/lib/tracking";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { FC, useEffect } from "react";

interface Props {
  clinicLabel: string;
  externalBookingUrl: string;
}

export const ExternalBookingHandoff: FC<Props> = ({ clinicLabel, externalBookingUrl }) => {
  useEffect(() => {
    trackWithGTM("booking_init", { booking_method: "external" });
  }, []);

  return (
    <div className="border border-brand-dark/10 rounded-2xl p-8 bg-brand-beige/30 text-center space-y-5">
      <h2 className="text-2xl font-light text-brand-dark">
        Bestill time ved CMedical {clinicLabel}
      </h2>
      <p className="text-sm text-brand-dark/70 font-light leading-relaxed max-w-md mx-auto">
        Booking for denne klinikken skjer på vår partners nettside. Klikk under for å fortsette
        til timebestilling.
      </p>
      <Button asChild className="rounded-sm">
        <a href={externalBookingUrl} target="_blank" rel="noopener noreferrer">
          Fortsett til booking
          <ExternalLink className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
        </a>
      </Button>
    </div>
  );
};
