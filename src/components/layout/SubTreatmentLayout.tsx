import { useEffect, ReactNode, ComponentType, SVGProps } from "react";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Star, Phone, Clock, FileX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { buildBookingUrl } from "@/lib/bookingLinks";
import { type Specialist } from "@/data/specialists";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import { InsurancePartners } from "@/components/treatments/InsurancePartners";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";

export interface SubTreatmentContent {
 // Meta
 seoTitle: string;
 seoDescription: string;
 canonical: string;
 // Breadcrumb
 parent: { name: string; path: string };
 title: string;
 // Hero
 eyebrow: string;
 heroTitle: ReactNode;
 heroDescription: string;
 heroPoints: { title: string; desc: string }[];
 rating?: string;
 heroPrice?: string; // e.g. "Pris fra 2 200 kr" — shown above CTA
 hideSeePriser?: boolean; // hides the secondary "Se priser" link
 heroBadges?: { label: string; icon?: "clock" | "fileX" | "check" }[]; // replaces rating badge when provided
 // Booking
 booking: { kategori: string; tjeneste?: string };
 primaryCtaLabel?: string;
 // Section 2 — flow / hva skjer
 flowEyebrow: string;
 flowTitle: string;
 flow: { n: string; title: string; desc: string }[];
 flowImage?: string; // when set, renders split layout with image on the right
 flowImageAlt?: string;
 flowLinkLabel?: string;
 flowLinkHref?: string;
 // Section 3 — hvem / symptomer
 reasonsEyebrow: string;
 reasonsTitle: string;
 reasonsLead?: string;
 reasonsLead2?: string;
 reasons: { n: string; title: string; desc: string }[];
 // Section 4 — løfter (cards with optional icon and "Les mer" link)
 promises: {
 eyebrow: string;
 title: string;
 desc: string;
 Icon?: ComponentType<SVGProps<SVGSVGElement>>;
 href?: string;
 ctaLabel?: string;
 }[];
 // Section 4c — optional text+image content section ("Det beste fra to klinikker"-style)
 textSection?: {
 eyebrow: string;
 title: string;
 lead?: string;
 points?: { n: string; title: string; desc: string }[];
 image: string;
 imageAlt?: string;
 };
 // Section 4d — optional expert areas (image cards grid)
 expertAreas?: {
 eyebrow?: string;
 title: string;
 description?: string;
 items: { eyebrow?: string; title: string; desc: string; href: string; image: string }[];
 };
 // Section 5 — relaterte
 relatedEyebrow?: string;
 relatedTitle?: string;
 related: { eyebrow: string; title: string; desc: string; href: string }[];
 // Final CTA
 ctaTitle: string;
 ctaDescription: string;
 // Specialists section
 specialistCategory?: Specialist["category"];
 specialistSlugs?: string[]; // optional whitelist of who does this service
 specialistCtaLabel?: string;
 specialistCtaHref?: string;
 specialistEyebrow?: string;
 specialistTitle?: string;
 specialistDescription?: string;
}

interface Props {
 isChatOpen: boolean;
 content: SubTreatmentContent;
}


export const SubTreatmentLayout = ({ isChatOpen, content: c }: Props) => {
 useEffect(() => {
 document.title = `${c.title} | CMedical`;
 }, [c.title]);


 return (
 <PageLayout isChatOpen={isChatOpen}>
 <PageSEO
 title={c.seoTitle}
 description={c.seoDescription}
 canonical={c.canonical}
 breadcrumbs={[
 { name: "Hjem", path: "/" },
 c.parent,
 { name: c.title, path: c.canonical },
 ]}
 />
 <h1 className="sr-only">{c.title} hos CMedical</h1>

 {/* BREADCRUMB */}
 <div className="bg-brand-light pt-24 lg:pt-28 pb-4">
 <div className="container mx-auto px-6 md:px-16">
 <nav className="text-xs font-light text-foreground/60 flex items-center gap-2">
 <Link to="/" className="hover:text-foreground">Hjem</Link>
 <span>›</span>
 <Link to={c.parent.path} className="hover:text-foreground">{c.parent.name}</Link>
 <span>›</span>
 <span className="text-foreground/80">{c.title}</span>
 </nav>
 </div>
 </div>

 {/* 1. HERO */}
 <header className="bg-brand-light pb-20 md:pb-28">
 <div className="container mx-auto px-6 md:px-16">
 <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
 <div>
 <p className="text-xs text-foreground/60 mb-6 uppercase">
 {c.eyebrow}
 </p>
 <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
 {c.heroTitle}
 </h2>
 <p className="text-base md:text-lg font-light leading-relaxed mb-10 text-muted-foreground max-w-md">
 {c.heroDescription}
 </p>

 {c.heroPrice && (
 <div className="mb-4">
 <p className="text-base font-normal text-foreground mb-1">
 {c.title}
 </p>
 <p className="text-sm font-light text-muted-foreground">
 {c.heroPrice}
 </p>
 </div>
 )}

 <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-8">
 <Button
 variant="cta"
 size="lg"
 className="px-8 w-full sm:w-auto"
 onClick={() => (window.location.href = buildBookingUrl(c.booking))}
 >
 {c.primaryCtaLabel ?? "Bestill time"}
 </Button>
 {!c.hideSeePriser && (
 <Link
 to="/priser"
 className="text-sm font-light text-foreground hover:text-foreground/70 border-b border-foreground/40 hover:border-foreground pb-0.5 transition-colors"
 >
 Se priser
 </Link>
 )}
 </div>

 {c.heroBadges && c.heroBadges.length > 0 ? (
 <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-light text-muted-foreground">
 {c.heroBadges.map((b) => {
 const Icon = b.icon === "fileX" ? FileX : b.icon === "check" ? Check : Clock;
 return (
 <span key={b.label} className="inline-flex items-center gap-2">
 <Icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
 {b.label}
 </span>
 );
 })}
 </div>
 ) : c.rating ? (
 <div className="inline-flex items-center gap-3 rounded-2xl bg-card border border-border/60 px-4 py-3 text-sm font-light text-brand-dark shadow-sm">
 <div className="flex" aria-hidden="true">
 {[0, 1, 2, 3, 4].map((i) => (
 <Star key={i} className="w-3.5 h-3.5 text-brand-dark fill-brand-dark" />
 ))}
 </div>
 <span>{c.rating}</span>
 </div>
 ) : null}
 </div>


 <div className="bg-secondary/50 p-8 md:p-10 rounded-sm">
 <ul className="space-y-6">
 {c.heroPoints.map((p) => (
 <li key={p.title} className="flex items-start gap-4">
 <span className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
 <Check className="w-3.5 h-3.5 text-foreground" />
 </span>
 <div>
 <h3 className="text-base font-normal text-foreground mb-1">
 {p.title}
 </h3>
 <p className="text-sm font-light text-muted-foreground leading-relaxed">
 {p.desc}
 </p>
 </div>
 </li>
 ))}
 </ul>
 </div>
 </div>
 </div>
 </header>

 {/* 2. FLOW */}
  {c.flowImage ? (
 <section className="bg-brand-light text-foreground">
 <div className="grid lg:grid-cols-2 items-stretch">
 <div className="px-6 md:px-12 lg:px-20 py-16 lg:py-24 flex flex-col justify-center">
 <div className="max-w-md">
 <p className="text-xs text-foreground/60 mb-3 uppercase">
 {c.flowEyebrow}
 </p>
 <h2 className="text-2xl md:text-3xl lg:text-4xl font-light leading-[1.15] text-foreground mb-10">
 {c.flowTitle}
 </h2>

 <ol className="space-y-6">
 {c.flow.map((step, idx) => (
 <li key={step.n} className="flex gap-4">
 <span className="text-[10px] font-light text-foreground/50 pt-1 tabular-nums shrink-0 w-5">
 {String(idx + 1).padStart(2, "0")}
 </span>
 <div>
 <h3 className="text-sm font-normal text-foreground mb-1 leading-snug">
 {step.title}
 </h3>
 <p className="text-xs font-light text-muted-foreground leading-relaxed">
 {step.desc}
 </p>
 </div>
 </li>
 ))}
 </ol>

 {c.flowLinkHref && (
 <Link
 to={c.flowLinkHref}
 className="mt-10 inline-flex items-center gap-2 text-sm font-light text-foreground hover:gap-2.5 transition-all"
 >
 {c.flowLinkLabel ?? "Les mer"}
 <ArrowRight className="w-3.5 h-3.5" />
 </Link>
 )}
 </div>
 </div>
 <div className="relative bg-secondary/40 min-h-[360px] lg:min-h-[560px] overflow-hidden">
 <img
 src={c.flowImage}
 alt={c.flowImageAlt ?? ""}
 loading="lazy"
 className="absolute inset-0 w-full h-full object-cover"
 />
 </div>
 </div>
 </section>
 ) : (
 <section className="bg-brand-light text-foreground py-20 md:py-28">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="max-w-2xl mb-14">
 <p className="text-xs text-foreground/60 mb-4 uppercase">
 {c.flowEyebrow}
 </p>
 <h2 className="text-3xl md:text-5xl font-light leading-tight">
 {c.flowTitle}
 </h2>
 </div>

 {(() => {
 const colMap: Record<number, string> = {
 3: "md:grid-cols-3",
 4: "md:grid-cols-4",
 5: "md:grid-cols-5",
 6: "md:grid-cols-3",
 };
 const cols = colMap[c.flow.length] ?? "md:grid-cols-4";
 return (
 <div className={`grid grid-cols-2 ${cols} gap-px bg-brand-dark/10 rounded-sm overflow-hidden`}>
 {c.flow.map((step) => (
 <div key={step.n} className="bg-background p-5 md:p-6 flex flex-col">
 <p className="text-xs text-brand-dark mb-4 uppercase">
 {step.n}
 </p>
 <h3 className="text-base md:text-lg font-normal mb-2 md:mb-3 leading-snug text-foreground">
 {step.title}
 </h3>
 <p className="text-sm font-light text-muted-foreground leading-relaxed">
 {step.desc}
 </p>
 </div>
 ))}
 </div>
 );
 })()}
 </div>
 </div>
 </section>
 )}

 {/* 3. REASONS / SYMPTOMS */}
 <section className="bg-background py-20 md:py-28">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16">
 <div className="lg:col-span-5">
 <p className="text-xs text-foreground/60 mb-4 uppercase">
 {c.reasonsEyebrow}
 </p>
 <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-6">
 {c.reasonsTitle}
 </h2>
 {c.reasonsLead && (
 <p className="text-base font-light text-muted-foreground leading-relaxed mb-4 max-w-md">
 {c.reasonsLead}
 </p>
 )}
 {c.reasonsLead2 && (
 <p className="text-base font-light text-muted-foreground leading-relaxed max-w-md mb-8">
 {c.reasonsLead2}
 </p>
 )}
 <Button
 variant="cta"
 size="lg"
 className="px-8"
 onClick={() => (window.location.href = buildBookingUrl(c.booking))}
 >
 {c.primaryCtaLabel ?? "Bestill time"}
 </Button>
 </div>

 <div className="lg:col-span-7">
 <div className="divide-y divide-border/60 border-t border-border/60">
 {c.reasons.map((r) => (
 <div key={r.n} className="grid grid-cols-12 gap-4 py-6">
 <div className="col-span-2 md:col-span-1 text-xs font-light text-foreground/60 pt-1">
 {r.n}
 </div>
 <div className="col-span-10 md:col-span-11">
 <h3 className="text-base font-normal text-foreground mb-1.5">
 {r.title}
 </h3>
 <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-md">
 {r.desc}
 </p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* 3b. EXPERT AREAS — image cards (optional) */}
 {c.expertAreas && c.expertAreas.items.length > 0 && (
 <section className="bg-secondary/40 py-20 md:py-28">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-14">
 <div className="lg:col-span-6">
 {c.expertAreas.eyebrow && (
 <p className="text-xs text-foreground/60 mb-4 uppercase">{c.expertAreas.eyebrow}</p>
 )}
 <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
 {c.expertAreas.title}
 </h2>
 </div>
 {c.expertAreas.description && (
 <div className="lg:col-span-6 lg:pt-3">
 <p className="text-base font-light text-muted-foreground leading-relaxed">
 {c.expertAreas.description}
 </p>
 </div>
 )}
 </div>

 <div className="grid md:grid-cols-2 gap-6">
 {c.expertAreas.items.map((a) => (
 <Link
 key={a.title}
 to={a.href}
 className="bg-background rounded-sm border border-border/40 flex flex-col group hover:border-foreground/30 transition-colors overflow-hidden"
 >
 <div className="relative w-full aspect-[16/9] overflow-hidden bg-secondary">
 <img
 src={a.image}
 alt={a.title}
 loading="lazy"
 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
 />
 </div>
 <div className="p-7 flex flex-col flex-1">
 {a.eyebrow && (
 <p className="text-xs text-foreground/80 mb-3 uppercase">{a.eyebrow}</p>
 )}
 <h3 className="text-xl font-light text-foreground mb-3">
 {a.title}
 </h3>
 <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">
 {a.desc}
 </p>
 <span className="inline-flex items-center text-sm font-light text-foreground gap-2 group-hover:gap-2.5 transition-all">
 Les mer
 <ArrowRight className="w-3.5 h-3.5" />
 </span>
 </div>
 </Link>
 ))}
 </div>
 </div>
 </div>
 </section>
 )}

 {/* 4. PROMISES — icon-cards with optional "Les mer" link */}
 <section className="bg-secondary/40 pt-0 pb-20 md:pb-24">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
 {c.promises.map((p) => (
 <div
 key={p.title}
 className="bg-background p-7 rounded-sm border border-border/40 flex flex-col"
 >
 {p.Icon && (
 <div className="w-12 h-12 flex items-center justify-center mb-5 text-foreground/80">
 <p.Icon className="w-10 h-10" aria-hidden="true" />
 </div>
 )}
 <p className="text-xs text-foreground/80 mb-4 uppercase">
 {p.eyebrow}
 </p>
 <h3 className="text-lg font-normal text-foreground mb-3">
 {p.title}
 </h3>
 <p className="text-sm font-light text-muted-foreground leading-relaxed flex-1">
 {p.desc}
 </p>
 {p.href && (
 <Link
 to={p.href}
 className="mt-6 inline-flex items-center text-sm font-light text-foreground hover:text-foreground/70 hover:gap-2.5 gap-2 transition-all"
 >
 {p.ctaLabel ?? "Les mer"}
 <ArrowRight className="w-3.5 h-3.5" />
 </Link>
 )}
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* 4c. TEXT SECTION — optional split text+image, like "Det beste fra to klinikker" */}
 {c.textSection && (
 <section className="bg-background">
 <div className="grid lg:grid-cols-12">
 <div className="lg:col-span-7 px-6 md:px-16 lg:px-20 py-20 lg:py-28">
 <div className="max-w-xl">
 <p className="text-xs text-foreground/60 mb-5">
 {c.textSection.eyebrow}
 </p>
 <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-[1.1] text-foreground mb-6">
 {c.textSection.title}
 </h2>
 {c.textSection.lead && (
 <p className="text-base font-light text-muted-foreground leading-relaxed mb-12">
 {c.textSection.lead}
 </p>
 )}
 {c.textSection.points && c.textSection.points.length > 0 && (
 <div className="divide-y divide-border/60 border-t border-border/60">
 {c.textSection.points.map((step) => (
 <div key={step.n} className="grid grid-cols-12 gap-4 py-6">
 <div className="col-span-2 md:col-span-1 text-xs font-light text-foreground/60 pt-1">
 {step.n}
 </div>
 <div className="col-span-10 md:col-span-11">
 <h3 className="text-base font-normal text-foreground mb-1.5">
 {step.title}
 </h3>
 <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-md">
 {step.desc}
 </p>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </div>
 <div className="lg:col-span-5 relative bg-secondary/40 min-h-[420px] lg:min-h-full overflow-hidden">
 <img
 src={c.textSection.image}
 alt={c.textSection.imageAlt ?? ""}
 loading="lazy"
 className="absolute inset-0 w-full h-full object-cover"
 />
 </div>
 </div>
 </section>
 )}


 {/* 4b. MID-PAGE CONVERSION BAND */}
 <section className="bg-brand-light text-foreground py-14 md:py-16 border-t border-brand-dark/10">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
 <div className="max-w-3xl">
 <p className="text-xs mb-3 uppercase text-brand-dark">Klar når du er</p>
 <h2 className="text-2xl md:text-3xl font-light leading-tight">
 Få {c.title.toLowerCase()} hos en spesialist denne uken.
 </h2>
 </div>
 <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
 <Button
 variant="cta"
 size="lg"
 className="px-8"
 onClick={() => (window.location.href = buildBookingUrl(c.booking))}
 >
 {c.primaryCtaLabel ?? "Bestill time"}
 </Button>
 <CallUsClinicPicker variant="light" label="Ring oss" />

 </div>
 </div>
 </div>
 </section>

 {/* 5. RELATED */}
 {c.related.length > 0 && (
 <section className="bg-secondary/40 py-20 md:py-28">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="max-w-2xl mb-12">
 <p className="text-xs text-foreground/60 mb-4 uppercase">
 {c.relatedEyebrow ?? "Relaterte områder"}
 </p>
 <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
 {c.relatedTitle ?? "Du er kanskje også interessert i"}
 </h2>
 </div>

 <div className="grid md:grid-cols-3 gap-6">
 {c.related.map((a) => (
 <Link
 key={a.title}
 to={a.href}
 className="bg-background p-7 rounded-sm border border-border/40 flex flex-col group hover:border-foreground/30 transition-colors"
 >
 <p className="text-xs text-foreground/80 mb-4 uppercase">
 {a.eyebrow}
 </p>
 <h3 className="text-lg font-normal text-foreground mb-3">
 {a.title}
 </h3>
 <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">
 {a.desc}
 </p>
 <span className="inline-flex items-center text-sm font-light text-foreground gap-2 group-hover:gap-2.5 transition-all">
 Les mer
 <ArrowRight className="w-3.5 h-3.5" />
 </span>
 </Link>
 ))}
 </div>
 </div>
 </div>
 </section>
 )}

 {/* 6. SPESIALISTER — samme presentasjon som på fertilitetssiden */}
 {(c.specialistCategory || (c.specialistSlugs && c.specialistSlugs.length > 0)) && (
 <SpecialistsScroller
 category={c.specialistCategory}
 filter={
 c.specialistSlugs && c.specialistSlugs.length > 0
 ? (s: any) => c.specialistSlugs!.includes(s.slug)
 : undefined
 }
 eyebrow={c.specialistEyebrow ?? "Våre eksperter"}
 title={c.specialistTitle ?? "Spesialistene som følger deg."}
 description={c.specialistDescription ?? "Erfaring, spisskompetanse og moderne teknologi samlet på ett sted."}
 seeAllHref={c.specialistCtaHref ?? `/spesialister?kategori=${c.specialistCategory ?? ""}`}
 seeAllLabel={c.specialistCtaLabel}
 />
 )}

 {/* BESTILL TIME — unified pre-footer CTA */}
 <BookingCTA />

  {/* SAMARBEIDSPARTNERE / FORSIKRING — før footer */}
  <InsurancePartners />
 </PageLayout>
 );
};

export default SubTreatmentLayout;
