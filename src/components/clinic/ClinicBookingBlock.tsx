import { useState, useRef, useEffect } from "react";
import {
  Calendar,
  ExternalLink,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  Clock,
  Shield,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router";

export interface ClinicBookingData {
  method?: "info" | "pasientsky" | "metodika" | "closed";
  serviceProviderId?: string;
  externalBookingUrl?: string;
  closedMessage?: string;
}

interface ClinicBookingBlockProps {
  booking?: ClinicBookingData;
  clinicLabel: string;
  clinicId?: string;
  phone?: string;
  email?: string;
}

/**
 * Premium dark booking CTA for clinic pages.
 * Matches the homepage BookingCTA dark variant design.
 */
export const ClinicBookingBlock = ({
  booking,
  clinicLabel,
  clinicId,
  phone,
  email,
}: ClinicBookingBlockProps) => {
  const method = booking?.method || "info";
  const bookingHref = clinicId
    ? `/booking?klinikk=${encodeURIComponent(clinicId)}`
    : "/booking";

  const [showPhonePicker, setShowPhonePicker] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowPhonePicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ── CLOSED state: keep it contained + tasteful ── */
  if (method === "closed") {
    return (
      <section className="py-20 md:py-28 bg-brand-dark" aria-labelledby="booking-heading">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 mb-6">
              <Lock className="w-4 h-4 text-white/40" strokeWidth={1.5} aria-hidden="true" />
              <span className="text-xs text-white/40 uppercase tracking-widest font-light">
                Booking
              </span>
            </div>
            <h2 id="booking-heading" className="text-2xl md:text-3xl font-light text-white mb-4">
              Bestill time ved CMedical {clinicLabel}
            </h2>
            <p className="text-white/60 font-light text-base mb-10 max-w-xl mx-auto leading-relaxed">
              {booking?.closedMessage ||
                `Bookingsystemet ved CMedical ${clinicLabel} er midlertidig utilgjengelig. Kontakt oss på telefon eller e-post for å bestille time.`}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {phone && (
                <a
                  href={`tel:+47${phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white text-sm font-light rounded-sm hover:bg-white/10 transition-colors"
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  {phone}
                </a>
              )}
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white text-sm font-light rounded-sm hover:bg-white/10 transition-colors"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  {email}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ── ACTIVE booking states (pasientsky / metodika / info) ── */
  const subtitle =
    method === "metodika"
      ? "Velg tjeneste, klinikk og behandler – alt i én enkel booking."
      : method === "pasientsky"
      ? "Velg spesialist, dato og tidspunkt som passer for deg."
      : booking?.externalBookingUrl
      ? "Velg tjeneste, klinikk og behandler – alt i én enkel booking."
      : "Ring oss eller send e-post, så finner vi riktig spesialist og tid for deg.";

  const hasBookingLink =
    method === "pasientsky" ||
    method === "metodika" ||
    (method === "info" && (booking?.externalBookingUrl || clinicId));

  return (
    <section className="py-20 md:py-28 bg-brand-dark" aria-labelledby="clinic-booking-heading">
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-3xl mx-auto text-center">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-6">
            <Calendar className="w-4 h-4 text-white/40" strokeWidth={1.5} aria-hidden="true" />
            <span className="text-xs text-white/40 uppercase tracking-widest font-light">
              Booking
            </span>
          </div>

          {/* Title */}
          <h2
            id="clinic-booking-heading"
            className="text-2xl md:text-3xl font-light text-white mb-4"
          >
            Bestill time ved CMedical {clinicLabel}
          </h2>

          {/* Subtitle */}
          <p className="text-white/60 font-light text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {hasBookingLink ? (
              <Button variant="cta-dark" size="lg" asChild>
                <Link to={bookingHref}>
                  <Calendar className="mr-2 w-5 h-5" />
                  Bestill time nå
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            ) : (
              /* info-only with no booking link — just a phone CTA */
              phone && (
                <Button variant="cta-dark" size="lg" asChild>
                  <a href={`tel:+47${phone.replace(/\s/g, "")}`}>
                    <Phone className="mr-2 w-5 h-5" />
                    Ring oss
                  </a>
                </Button>
              )
            )}

            {/* Secondary: phone picker or email */}
            {hasBookingLink && (phone || email) && (
              <div className="relative" ref={dropdownRef}>
                <Button
                  variant="cta-outline-dark"
                  size="lg"
                  onClick={() => setShowPhonePicker(!showPhonePicker)}
                >
                  <Phone className="mr-2 w-5 h-5" />
                  Ring oss
                  <ChevronDown
                    className={`ml-2 w-4 h-4 transition-transform ${showPhonePicker ? "rotate-180" : ""}`}
                  />
                </Button>

                {showPhonePicker && (
                  <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-xl border border-border overflow-hidden z-50 min-w-[240px]">
                    {phone && (
                      <a
                        href={`tel:+47${phone.replace(/\s/g, "")}`}
                        className="flex items-center justify-between px-4 py-3 hover:bg-secondary transition-colors"
                      >
                        <span className="text-sm font-normal text-foreground">
                          CMedical {clinicLabel}
                        </span>
                        <span className="text-sm text-muted-foreground font-light">{phone}</span>
                      </a>
                    )}
                    {email && (
                      <a
                        href={`mailto:${email}`}
                        className="flex items-center justify-between px-4 py-3 hover:bg-secondary transition-colors border-t border-border"
                      >
                        <span className="text-sm font-normal text-foreground flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" />
                          E-post
                        </span>
                        <span className="text-sm text-muted-foreground font-light truncate max-w-[130px]">
                          {email}
                        </span>
                      </a>
                    )}
                    {booking?.externalBookingUrl && (
                      <a
                        href={booking.externalBookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-3 hover:bg-secondary transition-colors border-t border-border text-sm text-brand-dark font-light"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Ekstern bookinglenke
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick-info badges */}
          <div className="flex flex-wrap items-center justify-center gap-8">
            <span className="flex items-center gap-2 text-sm text-white/50">
              <Clock className="w-4 h-4" aria-hidden="true" />
              Ledig time innen 1–3 dager
            </span>
            <span className="flex items-center gap-2 text-sm text-white/50">
              <Shield className="w-4 h-4" aria-hidden="true" />
              Ingen henvisning nødvendig
            </span>
          </div>

        </div>
      </div>
    </section>
  );
};
