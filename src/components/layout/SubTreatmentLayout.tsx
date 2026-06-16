import { useEffect, ReactNode, ComponentType, SVGProps } from "react";

import { BookingCTA } from "@/components/homepage/BookingCTA";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { CategoryReviews } from "@/components/treatments/CategoryReviews";
import { buildBookingUrl } from "@/lib/bookingLinks";
import { type Specialist } from "@/data/specialists";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import { InsurancePartners } from "@/components/treatments/InsurancePartners";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import promiseComfort from "@/assets/promises/familie-komfort.webp.asset.json";
import promiseSpecialists from "@/assets/promises/spesialiste.webp.asset.json";
import promiseUnderOneRoof from "@/assets/promises/endokrinologi.jpg.asset.json";

const promiseImages = [promiseComfort.url, promiseSpecialists.url, promiseUnderOneRoof.url];

export interface SubTreatmentContent {
 // Meta
 seoTitle: string;
 seoDescription: string;
 canonical: string;
 // Breadcrumb
 parent: { name: string; path: string };
 /** Optional ancestor shown between Hjem and parent (e.g. "Flere fagområder"). */
 grandparent?: { name: string; path: string };
 title: string;
 // Hero
 eyebrow: string;
 heroTitle: ReactNode;
 heroDescription: string;
 heroPoints: { title: string; desc: string }[];
 rating?: string;
 heroPrice?: string; // e.g. "Pris fra 2 200 kr" — shown above CTA
 hideSeePriser?: boolean; // hides the secondary "Se priser" link
 
 // Booking
 booking: { kategori: string; tjeneste?: string };
 primaryCtaLabel?: string;
 // Section 2 — flow / hva skjer
 flowEyebrow: string;
 flowTitle: string;
 flow: { n: string; title: string; desc: string }[];
 flowImage?: string; // image used in the "Slik foregår det" section (e.g. clinic interior)
 flowImageAlt?: string;
 heroImage?: string; // dedicated image for hero right column; falls back to flowImage
 heroImageAlt?: string;
 flowLinkLabel?: string;
 flowLinkHref?: string;
 // Section 3 — hvem / symptomer
 reasonsEyebrow: string;
 reasonsTitle: string;
 reasonsLead?: string;
 reasonsLead2?: string;
 reasons: { n: string; title: string; desc: ReactNode }[];
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

const ReasonsEditorial = ({
  title,
  lead,
  lead2,
  items,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  lead2?: string;
  items: { n: string; title: string; desc: ReactNode }[];
}) => {
  if (!items || items.length === 0) return null;

  // Use accordion when there is enough content that the section would
  // otherwise become very long. Keep the first item open by default so the
  // reader immediately sees the primary copy without extra scroll.
  const useAccordion = items.length > 2;
  const proseClasses =
    "text-sm md:text-base font-light text-muted-foreground leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:marker:text-foreground/40";

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Sticky left intro */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-[1.1] mb-6">
                {title}
              </h2>
              {lead && (
                <p className="text-base font-light text-muted-foreground leading-relaxed mb-3">
                  {lead}
                </p>
              )}
              {lead2 && (
                <p className="text-base font-light text-muted-foreground leading-relaxed">
                  {lead2}
                </p>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            {useAccordion ? (
              <Accordion
                type="single"
                collapsible
                defaultValue={`reason-0`}
                className="border-t border-border/60"
              >
                {items.map((r, i) => (
                  <AccordionItem
                    key={r.n}
                    value={`reason-${i}`}
                    className="border-b border-border/60"
                  >
                    <AccordionTrigger className="py-6 text-left text-lg md:text-xl font-normal text-foreground hover:no-underline">
                      {r.title}
                    </AccordionTrigger>
                    <AccordionContent className="pb-8">
                      <div className={proseClasses}>
                        {typeof r.desc === "string" ? <p>{r.desc}</p> : r.desc}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <ol className="divide-y divide-border/60 border-t border-border/60">
                {items.map((r) => (
                  <li key={r.n} className="py-8 first:pt-8">
                    <h3 className="text-lg md:text-xl font-normal text-foreground mb-3 leading-snug">
                      {r.title}
                    </h3>
                    <div className={proseClasses}>
                      {typeof r.desc === "string" ? <p>{r.desc}</p> : r.desc}
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

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
 ...(c.grandparent ? [c.grandparent] : []),
 c.parent,
 { name: c.title, path: c.canonical },
 ]}
 />
 <h1 className="sr-only">{c.title} hos CMedical</h1>

  {/* 1. HERO — full-bleed split 50/50, image fills the right half */}
  {(() => {
    const heroImg = c.heroImage ?? c.flowImage;
    return (
      <header className="bg-brand-light pt-24 lg:pt-0">
        <div className="grid lg:grid-cols-2 min-h-[640px] lg:min-h-[720px]">
          {/* Left — breadcrumb + copy + CTA */}
          <div className="flex flex-col justify-center page-edge-text-left py-12 lg:py-20">
            <nav className="text-xs font-light text-foreground/60 flex items-center gap-2 mb-8 lg:mb-10">
              <Link to="/" className="hover:text-foreground">Hjem</Link>
              <span>›</span>
              {c.grandparent && (
                <>
                  <Link to={c.grandparent.path} className="hover:text-foreground">{c.grandparent.name}</Link>
                  <span>›</span>
                </>
              )}
              <Link to={c.parent.path} className="hover:text-foreground">{c.parent.name}</Link>
              <span>›</span>
              <span className="text-foreground/80">{c.title}</span>
            </nav>

            <div className="max-w-xl w-full">

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
                {c.heroTitle}
              </h2>
              <p className="text-base md:text-lg font-light leading-relaxed mb-10 text-muted-foreground">
                {c.heroDescription}
              </p>

              <div className="mb-8 max-w-sm">
                {c.heroPrice && (
                  <div className="mb-4 text-sm font-light text-foreground/80">
                    <span className="block text-base text-foreground">{c.title}</span>
                    <span className="block">{c.heroPrice}</span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <Button
                    variant="cta"
                    size="lg"
                    className="px-6 w-full sm:w-auto"
                    onClick={() => (window.location.href = buildBookingUrl(c.booking))}
                  >
                    Se ledige tider og book
                  </Button>
                  <CallUsClinicPicker variant="light" label="Ring oss" />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-light text-foreground">
                {c.heroPoints.map((p) => (
                  <span key={p.title} className="inline-flex items-center gap-2">
                    <Check className="w-4 h-4 text-foreground shrink-0" strokeWidth={1.5} />
                    {p.title}
                  </span>
                ))}
              </div>

            </div>
          </div>

          {/* Right — image fills the entire half */}
          <div className="relative min-h-[420px] lg:min-h-full bg-secondary/40">
            {heroImg && (
              <img
                src={heroImg}
                alt={c.heroImageAlt ?? c.flowImageAlt ?? c.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>
        </div>
        <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
      </header>
    );
  })()}


  {/* 2. REASONS / INFO — editorial sticky split */}
  <ReasonsEditorial
    eyebrow={c.reasonsEyebrow}
    title={c.reasonsTitle}
    lead={c.reasonsLead}
    lead2={c.reasonsLead2}
    items={c.reasons}
  />


 {/* 3. FLOW — image on opposite side from hero (left) so two split sections don't stack on same side */}
  {c.flowImage ? (
 <section className="bg-brand-light text-foreground">
 <div className="grid lg:grid-cols-2 items-stretch min-h-[640px] lg:min-h-screen">
 <div className="relative bg-secondary/40 min-h-[420px] lg:min-h-full overflow-hidden order-1 lg:order-none">
 <img
 src={c.flowImage}
 alt={c.flowImageAlt ?? ""}
 loading="lazy"
 className="absolute inset-0 w-full h-full object-cover"
 />
 </div>
 <div className="px-6 md:px-12 lg:px-20 py-16 lg:py-24 flex flex-col justify-center order-2 lg:order-none">
  <div className="max-w-lg">
 <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-12">
 {c.flowTitle}
 </h2>

 <ol className="divide-y divide-border/40 border-t border-border/40">
 {c.flow.map((step) => (
 <li key={step.n} className="py-5">
 <h3 className="text-base font-normal text-foreground mb-1.5 leading-snug">
 {step.title}
 </h3>
 <p className="text-sm font-light text-muted-foreground leading-relaxed">
 {step.desc}
 </p>
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
 </div>
 </section>
 ) : (
 <section className="bg-brand-light text-foreground py-20 md:py-28">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="max-w-2xl mb-14">
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

 {/* 3b. EXPERT AREAS — image cards (optional) */}
 {c.expertAreas && c.expertAreas.items.length > 0 && (
 <section className="bg-secondary/40 py-20 md:py-28">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto">
 <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-14">
 <div className="lg:col-span-6">
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
  <div className="p-7 flex flex-col flex-1">
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

      {/* 4. RELATED — moved above promises so methods/subsider stands first */}
      {c.related.length > 0 && (
        <section className="bg-secondary/40 py-20 md:py-28">
          <div className="container mx-auto px-6 md:px-16">
            <div className="max-w-6xl mx-auto">
              <div className="max-w-2xl mb-12">
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

      {/* 4b. REVIEWS — pasienttilbakemeldinger (samme som fertilitet) */}
      <CategoryReviews categoryId={c.booking.kategori} categoryTitle={c.parent.name} />


  {/* 4c. TEXT SECTION — optional split text+image, like "Det beste fra to klinikker" */}
  {c.textSection && (
  <section className="bg-background">
  <div className="grid lg:grid-cols-12 lg:items-stretch">
  <div className="lg:col-span-7 px-6 md:px-16 lg:px-20 py-20 lg:py-28 h-full flex flex-col justify-center">
  <div className="max-w-xl">
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
  <div className="lg:col-span-5 relative bg-secondary/40 min-h-[420px] lg:h-full overflow-hidden">
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
 <h2 className="text-2xl md:text-3xl font-light leading-tight">
 Få {c.title.toLowerCase()} hos en spesialist denne{"\u00A0"}uken.
 </h2>
 </div>
 <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
 {c.heroPrice && (
 <div className="text-sm font-light text-foreground/80">
 <span className="block text-base text-foreground">{c.title}</span>
 <span className="block">{c.heroPrice}</span>
 </div>
 )}
 <Button
 variant="cta"
 size="lg"
 className="px-6"
 onClick={() => (window.location.href = buildBookingUrl(c.booking))}
 >
 Se ledige tider og book
 </Button>
 <CallUsClinicPicker variant="light" label="Ring oss" />

 </div>
 </div>
 </div>
 </section>

 {/* 5. PROMISES — three image cards (moved below related) */}
 <section className="bg-secondary/40 pt-24 md:pt-32 pb-24 md:pb-32">
   <div className="container mx-auto px-6 md:px-16">
     <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 md:gap-10">
       {c.promises.map((p, i) => (
         <div key={p.title} className="group flex flex-col">
           <div className="relative w-full aspect-[4/3] overflow-hidden bg-secondary mb-6">
             <img
               src={promiseImages[i % promiseImages.length]}
               alt=""
               loading="lazy"
               className="absolute inset-0 w-full h-full object-cover"
             />
           </div>
           <h3 className="text-xl md:text-2xl font-light leading-[1.2] text-foreground mb-4 max-w-[28ch]">
             {p.title}
           </h3>
           <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-[48ch]">
             {p.desc}
           </p>
           {p.href && (
             <Link
               to={p.href}
               className="mt-6 inline-flex items-center gap-2 text-sm font-light text-foreground border-b border-foreground/30 pb-1 self-start hover:border-foreground transition-colors"
             >
               {p.ctaLabel ?? "Les mer"}
               <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
             </Link>
           )}
         </div>
       ))}
     </div>
   </div>
 </section>

 {/* 6. SPESIALISTER — samme presentasjon som på fertilitetssiden */}
 {(c.specialistCategory || (c.specialistSlugs && c.specialistSlugs.length > 0)) && (
 <SpecialistsScroller
 category={c.specialistCategory}
 filter={
 c.specialistSlugs && c.specialistSlugs.length > 0
 ? (s: any) => c.specialistSlugs!.includes(s.slug)
 : undefined
 }
 title={c.specialistTitle ?? "Spesialistene som følger deg."}
 description={c.specialistDescription ?? "Erfaring, spisskompetanse og moderne teknologi samlet på ett sted."}
 seeAllHref={c.specialistCtaHref ?? `/spesialister?kategori=${c.specialistCategory ?? ""}`}
 seeAllLabel={c.specialistCtaLabel}
 />
 )}

      {/* SAMARBEIDSPARTNERE / FORSIKRING — før booking CTA */}
      <InsurancePartners />

      {/* BESTILL TIME — unified pre-footer CTA */}
      <BookingCTA />
 </PageLayout>
 );
};

export default SubTreatmentLayout;
