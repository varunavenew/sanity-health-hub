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

  // Resolve primary + secondary actions per booking method
  let primary: { label: string; href: string; external?: boolean; icon?: "arrow" | "external" | "phone" } | null = null;
  let secondary: { label: string; href: string; external?: boolean; icon?: "phone" | "mail" } | null = null;
  let subheading =
    "Bli tatt på alvor – med faglig trygghet, respekt og helhetlig oppfølging.";

  if (method === "pasientsky") {
    primary = {
      label: "Bestill time",
      href: booking?.serviceProviderId
        ? `https://booking.pasientsky.no/?serviceProviderId=${booking.serviceProviderId}`
        : clinicId
        ? `/booking?klinikk=${clinicId}`
        : "/booking",
      external: !!booking?.serviceProviderId,
      icon: booking?.serviceProviderId ? "external" : "arrow",
    };
    if (phone) {
      secondary = { label: phone, href: `tel:+47${phone.replace(/\s/g, "")}`, icon: "phone" };
    } else if (email) {
      secondary = { label: "Kontakt oss", href: `mailto:${email}`, icon: "mail" };
    }
  } else if (method === "closed") {
    subheading =
      booking?.closedMessage ||
      `Bookingsystemet ved CMedical ${clinicLabel} er midlertidig utilgjengelig. Kontakt oss på telefon eller e-post.`;
    if (phone) primary = { label: phone, href: `tel:+47${phone.replace(/\s/g, "")}`, icon: "phone" };
    if (email) secondary = { label: "Send e-post", href: `mailto:${email}`, icon: "mail" };
  } else {
    // info
    subheading =
      "Bestill time ved å ringe oss eller sende en e-post. Vi hjelper deg med å finne riktig spesialist og tidspunkt.";
    if (phone) primary = { label: phone, href: `tel:+47${phone.replace(/\s/g, "")}`, icon: "phone" };
    if (email) secondary = { label: "Send e-post", href: `mailto:${email}`, icon: "mail" };
    if (booking?.externalBookingUrl && !primary) {
      primary = { label: "Gå til booking", href: booking.externalBookingUrl, external: true, icon: "external" };
    }
  }

  const renderIcon = (icon?: string) => {
    if (icon === "arrow") return <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />;
    if (icon === "external") return <ExternalLink className="ml-2 w-4 h-4" aria-hidden="true" />;
    if (icon === "phone") return <Phone className="mr-2 w-4 h-4" aria-hidden="true" />;
    if (icon === "mail") return <Mail className="mr-2 w-4 h-4" aria-hidden="true" />;
    return null;
  };

  const isLeadingIcon = (icon?: string) => icon === "phone" || icon === "mail";

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

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {primary && (
              <Button asChild variant="cta-dark" size="lg" className="px-8 h-14 text-base">
                <a
                  href={primary.href}
                  target={primary.external ? "_blank" : undefined}
                  rel={primary.external ? "noopener noreferrer" : undefined}
                >
                  {isLeadingIcon(primary.icon) && renderIcon(primary.icon)}
                  {primary.label}
                  {!isLeadingIcon(primary.icon) && renderIcon(primary.icon)}
                </a>
              </Button>
            )}
            {secondary && (
              <Button asChild variant="cta-outline-dark" size="lg" className="px-8 h-14 text-base">
                <a
                  href={secondary.href}
                  target={secondary.external ? "_blank" : undefined}
                  rel={secondary.external ? "noopener noreferrer" : undefined}
                >
                  {renderIcon(secondary.icon)}
                  {secondary.label}
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
