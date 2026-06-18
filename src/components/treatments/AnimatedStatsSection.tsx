import { AnimatedStat } from "@/components/AnimatedStat";

export interface StatRow {
 v: string;
 k: string;
 sub: string;
}

interface AnimatedStatsSectionProps {
 title?: string;
 description?: string;
 categoryLabel: string;
 stats: StatRow[];
 footnote?: string;
 background?: "background" | "brand-light";
}

export function AnimatedStatsSection({
 title = "Tall som forteller en historie.",
 description,
 stats,
 footnote = "Tall oppdatert per Q1 2026. Resultater varierer individuelt.",
 background = "brand-light",
}: AnimatedStatsSectionProps) {
 const bgClass = background === "brand-light" ? "bg-brand-light" : "bg-background";
 return (
 <section className={`${bgClass} text-foreground py-20 md:py-28 border-t border-brand-dark/10`}>
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="grid lg:grid-cols-12 gap-14 lg:gap-24 mb-14">
 <div className="lg:col-span-5">
 <h2 className="text-3xl md:text-5xl font-light leading-tight">
 {title}
 </h2>
 </div>
 {description && (
 <div className="lg:col-span-7 flex items-end">
 <p className="text-base font-light text-muted-foreground leading-relaxed max-w-xl">
 {description}
 </p>
 </div>
 )}
 </div>

 <div className="border-t border-brand-dark/15 py-8 md:py-10">
 <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 md:divide-x divide-brand-dark/15">
 {stats.map((row, i) => (
 <div
 key={row.k}
 className={`md:px-8 ${i === 0 ? "md:pl-0" : ""} ${i === stats.length - 1 ? "md:pr-0" : ""}`}
 >
 <dd className="text-3xl md:text-4xl font-light tracking-tight leading-none mb-3">
 <AnimatedStat value={row.v} />
 </dd>
 <dt className="text-sm font-normal text-foreground mb-1">
 {row.k}
 </dt>
 <p className="text-xs font-light text-muted-foreground">
 {row.sub}
 </p>
 </div>
 ))}
 </dl>
 </div>

 {footnote && (
 <p className="text-xs font-light text-muted-foreground mt-8">
 {footnote}
 </p>
 )}
 </div>
 </div>
 </section>
 );
}
