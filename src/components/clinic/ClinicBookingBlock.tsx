import { ArrowRight, ExternalLink, Phone, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ClinicBookingData {
  method?: "info" | "pasientsky" | "closed";
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
 * Pre-footer booking CTA for clinic pages.
 * Dark, centered, mirrors the global "Ta vare på livet og underlivet" CTA design.
 */
export const ClinicBookingBlock = ({
  booking,
  clinicLabel,
  clinicId,
  phone,
  email,
}: ClinicBookingBlockProps) => {
  const method = booking?.method || "info";

  // Always build a "Bestill time" primary (light) + "Ring oss" outline,
  // and fall back to email if no phone. Subheading depends on method.
  let bookingHref: string | null = null;
  let bookingExternal = false;
  let bookingIcon: "arrow" | "external" = "arrow";

  if (method === "pasientsky") {
    if (booking?.serviceProviderId) {
      bookingHref = `https://booking.pasientsky.no/?serviceProviderId=${booking.serviceProviderId}`;
      bookingExternal = true;
      bookingIcon = "external";
    } else {
      bookingHref = clinicId ? `/booking?klinikk=${clinicId}` : "/booking";
    }
  } else if (method === "info") {
    if (booking?.externalBookingUrl) {
      bookingHref = booking.externalBookingUrl;
      bookingExternal = true;
      bookingIcon = "external";
    } else {
      bookingHref = clinicId ? `/booking?klinikk=${clinicId}` : "/booking";
    }
  }
  // closed → no booking button

  let subheading =
    "Bestill time ved å ringe oss eller sende en e-post. Vi hjelper deg med å finne riktig spesialist og tidspunkt.";
  if (method === "closed") {
    subheading =
      booking?.closedMessage ||
      `Bookingsystemet ved CMedical ${clinicLabel} er midlertidig utilgjengelig. Kontakt oss på telefon eller e-post.`;
  }

  const phoneHref = phone ? `tel:+47${phone.replace(/\s/g, "")}` : null;
  const emailHref = email ? `mailto:${email}` : null;

  return (
    <section className="bg-brand-dark py-20 md:py-28" aria-labelledby="booking-heading">
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            id="booking-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-light text-white leading-[1.15] mb-5"
          >
            Bestill time ved CMedical {clinicLabel}
          </h2>
          <p className="text-base text-white/70 font-light leading-relaxed max-w-xl mx-auto mb-10">
            {subheading}
          </p>

          {method === "closed" && (
            <div className="inline-flex items-center gap-2 text-xs text-white/60 font-light mb-6">
              <Lock className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
              Stengt for online booking
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center flex-wrap">
            {bookingHref && (
              <Button asChild variant="cta-dark" size="lg" className="px-8 h-14 text-base">
                <a
                  href={bookingHref}
                  target={bookingExternal ? "_blank" : undefined}
                  rel={bookingExternal ? "noopener noreferrer" : undefined}
                >
                  Bestill time
                  {bookingIcon === "arrow" ? (
                    <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                  ) : (
                    <ExternalLink className="ml-2 w-4 h-4" aria-hidden="true" />
                  )}
                </a>
              </Button>
            )}
            {phoneHref && (
              <Button asChild variant="cta-outline-dark" size="lg" className="px-8 h-14 text-base">
                <a href={phoneHref}>
                  <Phone className="mr-2 w-4 h-4" aria-hidden="true" />
                  {phone}
                </a>
              </Button>
            )}
            {!phoneHref && emailHref && (
              <Button asChild variant="cta-outline-dark" size="lg" className="px-8 h-14 text-base">
                <a href={emailHref}>
                  <Mail className="mr-2 w-4 h-4" aria-hidden="true" />
                  Send e-post
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

