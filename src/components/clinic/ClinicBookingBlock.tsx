import { Calendar, ExternalLink, Phone, Mail, Lock } from "lucide-react";
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
 * Standardized booking flow visualization for clinic pages.
 * Mirrors the schema's three booking methods: info / pasientsky / closed.
 */
export const ClinicBookingBlock = ({
 booking,
 clinicLabel,
 clinicId,
 phone,
 email,
}: ClinicBookingBlockProps) => {
 const method = booking?.method || "info";

 return (
 <section className="bg-background py-10 md:py-14" aria-labelledby="booking-heading">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-3xl mx-auto">
 <div className="flex items-center gap-2 mb-2">
 <Calendar className="w-4 h-4 text-brand-dark/75" strokeWidth={1.5} aria-hidden="true" />
 <p className="text-xs text-muted-foreground font-light uppercase">
 Booking
 </p>
 </div>
 <h2 id="booking-heading" className="text-lg font-normal text-foreground mb-6">
 Bestill time ved CMedical {clinicLabel}
 </h2>

 {method === "pasientsky" && (
 <div className="border border-border/40 rounded-sm p-6 bg-brand-warm/30">
 <p className="text-sm text-foreground font-light leading-[1.8] mb-5">
 Bestill time direkte i vårt bookingsystem. Du velger spesialist, dato og tidspunkt
 som passer for deg.
 </p>
 <Button asChild className="rounded-sm">
 <a
 href={
 booking?.serviceProviderId
 ? `https://booking.pasientsky.no/?serviceProviderId=${booking.serviceProviderId}`
 : clinicId
 ? `/booking?klinikk=${clinicId}`
 : "/booking"
 }
 target={booking?.serviceProviderId ? "_blank" : undefined}
 rel={booking?.serviceProviderId ? "noopener noreferrer" : undefined}
 >
 Book time nå
 {booking?.serviceProviderId && (
 <ExternalLink className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
 )}
 </a>
 </Button>
 </div>
 )}

 {method === "info" && (
 <div className="border border-border/40 rounded-sm p-6">
 <p className="text-sm text-foreground font-light leading-[1.8] mb-5">
 Bestill time ved å ringe oss eller sende en e-post. Vi hjelper deg med å finne
 riktig spesialist og tidspunkt.
 </p>
 <div className="space-y-3">
 {phone && (
 <a
 href={`tel:+47${phone.replace(/\s/g, "")}`}
 className="flex items-center gap-3 text-sm text-foreground hover:text-brand-dark transition-colors group"
 >
 <Phone className="w-4 h-4 text-brand-dark/75" strokeWidth={1.5} aria-hidden="true" />
 <span className="font-light group-hover:underline">{phone}</span>
 </a>
 )}
 {email && (
 <a
 href={`mailto:${email}`}
 className="flex items-center gap-3 text-sm text-foreground hover:text-brand-dark transition-colors group"
 >
 <Mail className="w-4 h-4 text-brand-dark/75" strokeWidth={1.5} aria-hidden="true" />
 <span className="font-light group-hover:underline">{email}</span>
 </a>
 )}
 {booking?.externalBookingUrl && (
 <a
 href={booking.externalBookingUrl}
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center gap-1.5 text-sm font-normal text-brand-dark hover:gap-2.5 transition-all border-b border-brand-dark/40 hover:border-brand-dark pb-1 mt-2"
 >
 Gå til ekstern bookinglenke
 <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
 </a>
 )}
 </div>
 </div>
 )}

 {method === "closed" && (
 <div className="border border-border/40 rounded-sm p-6 bg-muted/40">
 <div className="flex items-start gap-3">
 <Lock className="w-4 h-4 text-brand-dark/75 mt-0.5 flex-shrink-0" strokeWidth={1.5} aria-hidden="true" />
 <div>
 <p className="text-sm font-normal text-foreground mb-1">Stengt for booking</p>
 <p className="text-sm text-muted-foreground font-light leading-[1.8]">
 {booking?.closedMessage ||
 `Bookingsystemet ved CMedical ${clinicLabel} er midlertidig utilgjengelig. Kontakt oss på telefon eller e-post for å bestille time.`}
 </p>
 <div className="flex flex-wrap gap-4 mt-4">
 {phone && (
 <a
 href={`tel:+47${phone.replace(/\s/g, "")}`}
 className="inline-flex items-center gap-1.5 text-sm text-brand-dark hover:underline"
 >
 <Phone className="w-3.5 h-3.5" aria-hidden="true" />
 {phone}
 </a>
 )}
 {email && (
 <a
 href={`mailto:${email}`}
 className="inline-flex items-center gap-1.5 text-sm text-brand-dark hover:underline"
 >
 <Mail className="w-3.5 h-3.5" aria-hidden="true" />
 {email}
 </a>
 )}
 </div>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>
 </section>
 );
};
