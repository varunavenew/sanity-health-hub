import { Link } from "react-router-dom";
import { ArrowRight, CalendarCheck } from "lucide-react";

export interface ServiceListItem {
 title: string;
 desc?: string;
 href: string;
}

interface BookingCtaConfig {
 title?: string;
 desc?: string;
 href?: string;
}

interface ServicesListSectionProps {
 title: string;
 description?: string;
 items: ServiceListItem[];
 background?: "background" | "brand-light";
 /** When set, renders a booking CTA tile that fills the trailing grid cell. */
 bookingCta?: boolean | BookingCtaConfig;
}

export function ServicesListSection({
 title,
 description,
 items,
 background = "background",
 bookingCta,
}: ServicesListSectionProps) {
 const bgClass = background === "brand-light" ? "bg-brand-light" : "bg-background";

 const cta: BookingCtaConfig | null = bookingCta
   ? {
       title: typeof bookingCta === "object" ? bookingCta.title ?? "Bestill time" : "Bestill time",
       desc:
         typeof bookingCta === "object"
           ? bookingCta.desc ?? "Finn ledig tid hos våre spesialister."
           : "Finn ledig tid hos våre spesialister.",
       href: typeof bookingCta === "object" ? bookingCta.href ?? "/booking" : "/booking",
     }
   : null;

 return (
 <section className={`${bgClass} text-foreground py-14 md:py-20`}>
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="grid lg:grid-cols-12 gap-14 lg:gap-24 mb-14">
 <div className="lg:col-span-6">
 <h2 className="text-3xl md:text-5xl font-light leading-tight">
 {title}
 </h2>
 </div>
 {description && (
 <div className="lg:col-span-6 lg:pt-3">
 <p className="text-base font-light text-muted-foreground leading-relaxed">
 {description}
 </p>
 </div>
 )}
 </div>

 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-brand-dark/10 rounded-sm overflow-hidden">
 {items.map((s) => (
 <Link
 key={s.title}
 to={s.href}
 className="bg-background p-6 flex items-start justify-between gap-4 hover:bg-brand-light transition-colors group"
 >
 <div>
 <h3 className="text-base font-normal text-foreground mb-1.5">
 {s.title}
 </h3>
 {s.desc && (
 <p className="text-sm font-light text-muted-foreground leading-snug">
 {s.desc}
 </p>
 )}
 </div>
 <ArrowRight className="w-4 h-4 text-foreground/40 mt-1 flex-shrink-0 group-hover:text-foreground transition-colors" />
 </Link>
 ))}
 {cta && (
				<Link
 to={cta.href!}
 className="bg-background text-foreground p-6 flex items-start justify-between gap-4 hover:bg-brand-light transition-colors group"
 >
 <div>
 <div className="flex items-center gap-2 mb-1.5">
 <CalendarCheck className="w-4 h-4 text-foreground" strokeWidth={1.5} />
 <h3 className="text-base font-normal">{cta.title}</h3>
 </div>
 {cta.desc && (
 <p className="text-sm font-light text-muted-foreground leading-snug">
 {cta.desc}
 </p>
 )}
 </div>
 <ArrowRight className="w-4 h-4 mt-1 flex-shrink-0 text-foreground group-hover:translate-x-0.5 transition-transform" />
 </Link>
 )}
 </div>
 </div>
 </div>
 </section>
 );
}
