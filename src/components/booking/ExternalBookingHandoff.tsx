"use client";

import { trackWithGTM } from "@/lib/tracking";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Phone } from "lucide-react";
import { FC, useEffect } from "react";

interface Props {
  clinicLabel: string;
  externalBookingUrl: string;
  address?: string;
  phone?: string;
  hours?: string;
}

function formatPhoneHref(phone?: string): string | undefined {
  if (!phone) return "tel:+4769254000";
  const normalized = phone.replace(/[^\d+]/g, "");
  return normalized.startsWith("+") ? `tel:${normalized}` : `tel:+47${normalized}`;
}

function displayPhone(phone?: string): string {
  if (!phone) return "+47 69 25 40 00";
  return phone.trim().startsWith("+") ? phone : `+47 ${phone}`;
}

export const ExternalBookingHandoff: FC<Props> = ({
  clinicLabel,
  externalBookingUrl,
  address,
  phone,
  hours,
}) => {
  useEffect(() => {
    trackWithGTM("booking_init", { booking_method: "external" });
  }, []);

  const phoneHref = formatPhoneHref(phone);
  const phoneLabel = displayPhone(phone);
  const title = /^cmedical\s/i.test(clinicLabel) ? clinicLabel : `CMedical ${clinicLabel}`;

  return (
    <section className="mx-auto flex min-h-[calc(100vh-11rem)] w-full max-w-[430px] flex-col items-center justify-center py-8 text-center">
      <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-brand-beige/80 text-brand-dark/60">
        <MapPin className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
      </div>

      <h2 className="text-[28px] font-light leading-tight text-brand-dark">{title}</h2>
      {address && (
        <p className="mt-3 text-sm font-light leading-relaxed text-brand-dark/60">
          {address}
        </p>
      )}

      <div className="mt-10 w-full rounded-lg bg-white px-6 py-8 shadow-[0_1px_0_rgba(43,31,25,0.08)] ring-1 ring-brand-dark/5">
        <p className="text-sm font-light text-brand-dark/70">
          Call us to book an appointment.
        </p>
        <a
          href={phoneHref}
          className="mt-5 inline-flex items-center justify-center gap-4 text-[28px] font-light leading-none tracking-normal text-brand-dark transition-colors hover:text-brand-dark/70"
        >
          <Phone className="h-5 w-5" strokeWidth={1.8} aria-hidden="true" />
          <span>{phoneLabel}</span>
        </a>
        {hours && (
          <p className="mt-5 text-xs font-light leading-relaxed text-brand-dark/60">
            {hours}
          </p>
        )}
      </div>

      <div className="mt-6 w-full rounded-lg bg-white px-6 py-7 shadow-[0_1px_0_rgba(43,31,25,0.08)] ring-1 ring-brand-dark/5">
        <p className="text-sm font-light text-brand-dark/70">
          Or book an appointment online with our partner
        </p>
        <Button asChild className="mt-5 h-11 rounded bg-brand-dark px-6 text-sm font-light text-white hover:bg-brand-dark/90">
          <a href={externalBookingUrl} target="_blank" rel="noopener noreferrer">
            Book an appointment online
            <ArrowRight className="ml-2 h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
          </a>
        </Button>
      </div>
    </section>
  );
};
