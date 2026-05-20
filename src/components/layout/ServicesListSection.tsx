import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export interface ServiceListItem {
 title: string;
 desc?: string;
 href: string;
}

interface ServicesListSectionProps {
 eyebrow?: string;
 title: string;
 description?: string;
 items: ServiceListItem[];
 background?: "background" | "brand-light";
}

export function ServicesListSection({
 eyebrow = "Tjenester",
 title,
 description,
 items,
 background = "background",
}: ServicesListSectionProps) {
 const bgClass = background === "brand-light" ? "bg-brand-light" : "bg-background";

 return (
 <section className={`${bgClass} text-foreground py-20 md:py-28`}>
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-14">
 <div className="lg:col-span-6">
 <p className="text-xs text-foreground/60 mb-4">
 {eyebrow}
 </p>
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
 </div>
 </div>
 </div>
 </section>
 );
}
