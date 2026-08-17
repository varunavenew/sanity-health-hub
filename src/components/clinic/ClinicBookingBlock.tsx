import { Lock, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@/lib/router";
import { buildBookingUrl } from "@/lib/bookingLinks";

export interface ClinicBookingData {
  method?: "info" | "pasientsky" | "metodika" | "closed";
  serviceProviderId?: string;
  externalBookingUrl?: string;
  closedMessage?: string;
}

interface ClinicBookingBlockProps {
  booking?: ClinicBookingData;
  clinicLabel: string;
  /** Clinic slug for booking deep links (?klinikk=majorstuen). */
  clinicSlug?: string;
  phone?: string;
  email?: string;
}

const DEFAULT_SUBTITLE =
  "Bestill time ved å ringe oss eller sende en e-post. Vi hjelper deg med å finne riktig spesialist og tidspunkt.";

/**
 * Dark booking CTA band for clinic pages.
 */
export const ClinicBookingBlock = ({
  booking,
  clinicLabel,
  clinicSlug,
  phone,
  email,
}: ClinicBookingBlockProps) => {
  const navigate = useNavigate();
  const method = booking?.method || "info";
  const externalBookingUrl = booking?.externalBookingUrl?.trim();

  const handlePrimaryBookingClick = () => {
    if (method === "info" && externalBookingUrl) {
      window.location.href = externalBookingUrl;
      return;
    }
    navigate(
      clinicSlug
        ? buildBookingUrl({ klinikk: clinicSlug })
        : buildBookingUrl(),
    );
  };

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
            <h2 id="booking-heading" className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-[1.15] mb-5">
              Bestill time ved CMedical {clinicLabel}
            </h2>
            <p className="text-white/60 font-light text-base mb-10 max-w-xl mx-auto leading-relaxed">
              {booking?.closedMessage ||
                `Bookingsystemet ved CMedical ${clinicLabel} er midlertidig utilgjengelig. Kontakt oss på telefon eller e-post for å bestille time.`}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {phone ? (
                <a
                  href={`tel:+47${phone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white text-sm font-light rounded-2xl hover:bg-white/10 transition-colors"
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  {phone}
                </a>
              ) : null}
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white text-sm font-light rounded-2xl hover:bg-white/10 transition-colors"
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  {email}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const hasBookingLink =
    method === "pasientsky" ||
    method === "metodika" ||
    (method === "info" && (externalBookingUrl || clinicSlug));

  return (
    <section className="py-20 md:py-28 bg-brand-dark" aria-labelledby="clinic-booking-heading">
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            id="clinic-booking-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-[1.15] mb-5"
          >
            Bestill time ved CMedical {clinicLabel}
          </h2>

          <p className="text-white/60 font-light text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            {DEFAULT_SUBTITLE}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {hasBookingLink ? (
              <Button variant="cta" size="lg" onClick={handlePrimaryBookingClick}>
                Bestill time
              </Button>
            ) : null}

            {phone ? (
              <Button variant="cta-outline-dark" size="lg" asChild>
                <a href={`tel:+47${phone.replace(/\s/g, "")}`}>
                  <Phone className="mr-2 w-5 h-5" aria-hidden="true" />
                  {phone}
                </a>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};
