import { useEffect, useRef, ReactNode, ComponentType, SVGProps } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

import { BookingCTA } from "@/components/homepage/BookingCTA";
import { Link } from "react-router-dom";
import { ArrowRight, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArrows } from "@/components/ui/ScrollArrows";

import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { CategoryReviews } from "@/components/treatments/CategoryReviews";
import { buildBookingUrl } from "@/lib/bookingLinks";
import { type Specialist } from "@/data/specialists";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import { InsurancePartners } from "@/components/treatments/InsurancePartners";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { getServiceImageFromHref } from "@/data/serviceImages";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import promiseComfort from "@/assets/promises/familie-komfort.webp.asset.json";
import promiseUnderOneRoof from "@/assets/promises/alt-under-samme-tak.jpg.asset.json";
import promiseSpecialist from "@/assets/promises/spesialister-med-dybde.jpg.asset.json";

const promiseImages = [promiseComfort.url, promiseSpecialist.url, promiseUnderOneRoof.url];

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
 heroTitle: ReactNode;
 heroDescription: string;
 /** Optional non-clickable theme chips shown in the hero (e.g. "Vi behandler blant annet: ..."). */
 heroThemes?: string[];
 heroPoints: { title: string; desc: string }[];
 /** Optional small line shown above the hero CTA (e.g. "Tilbys på CMedical Bekkestua"). */
 heroAvailability?: string;
 rating?: string;
 heroPrice?: string; // e.g. "Pris fra 2 200 kr" — shown above CTA
 hideSeePriser?: boolean; // hides the secondary "Se priser" link
 
 // Booking
 booking: { kategori: string; tjeneste?: string };
 primaryCtaLabel?: string;
 // Section 2 — flow / hva skjer
 flowTitle: string;
 flow: { n: string; title: string; desc: string }[];
 flowImage?: string; // image used in the "Slik foregår det" section (e.g. clinic interior)
 flowImageAlt?: string;
 heroImage?: string; // dedicated image for hero right column; falls back to flowImage
 heroImageAlt?: string;
 heroVideo?: string; // optional video for hero right column; takes precedence over heroImage
 flowLinkLabel?: string;
 flowLinkHref?: string;
  // Section 3 — hvem / symptomer
 reasonsTitle: string;
 reasonsLead?: string;
 reasonsLead2?: string;
 reasons: { n: string; title: string; desc: ReactNode }[];
 /** How to render the right-side reasons content.
  *  - "prose": one continuous article with bold subheadings (no accordion). Default.
  *  - "accordion": click-to-open items for distinct sub-topics.
  *  - "auto": legacy behavior (accordion when items > 2). */
 reasonsLayout?: "prose" | "accordion" | "auto";
 // Section 4 — løfter (cards with optional icon and "Les mer" link)
 promises: {
 title: string;
 desc: string;
 Icon?: ComponentType<SVGProps<SVGSVGElement>>;
 href?: string;
 ctaLabel?: string;
 }[];
 // Section 4c — optional text+image content section ("Det beste fra to klinikker"-style)
 textSection?: {
 title: string;
 lead?: string;
 points?: { n: string; title: string; desc: string }[];
 image: string;
 imageAlt?: string;
 };
 // Section 4d — optional expert areas (image cards grid)
 expertAreas?: {
 title: string;
 description?: string;
 items: { title: string; desc: string; href: string; image: string }[];
 };
   // Section 5 — relaterte
 relatedTitle?: string;
 /** Optional ingress/lead paragraph rendered next to the related-section heading (Flere fagområder-style header). */
 relatedLead?: string;
  related: { title: string; desc: string; href: string; image?: string }[];
  /** When true, render the related cards right after the hero (as section 2) instead of after the flow. Used for landing pages where the cards represent the actual treatments included in the service. */
  relatedAsIntro?: boolean;
  /** When true, render the related cards between the reasons text and the flow (as section 3). Used when the page has its own text content but the cards still represent treatments included in this service. */
  relatedAsServices?: boolean;
  /** Sibling services in the same navigation group — rendered as "Relaterte tjenester" before the promises section. */
  siblingServices?: { title: string; desc: string; href: string; image?: string }[];
 // Final CTA
 ctaTitle: string;
 ctaDescription: string;
 /** Warm, fagområde-specific heading for the mid-page conversion band ("Snakk med en av våre …"). */
 conversationCtaTitle?: string;
 // Specialists section
 specialistCategory?: Specialist["category"];
 specialistSlugs?: string[]; // optional whitelist of who does this service
 specialistCtaLabel?: string;
 specialistCtaHref?: string;
 specialistTitle?: string;
 specialistDescription?: string;
}

interface Props {
 isChatOpen: boolean;
 content: SubTreatmentContent;
}

// Titles that should never appear as a section-2 item. They duplicate content
// shown elsewhere on the page (USPs in hero, specialists section further down)
// or are empty trust badges with no clinical content.
const REASONS_BLACKLIST = [
  "erfarne spesialister",
  "våre spesialister",
  "spesialister med dybde",
  "ingen ventetid",
  "ingen henvisning",
  "korte ventetider",
  "kort ventetid",
  "alt under samme tak",
];

const isBlacklisted = (title: string): boolean => {
  const t = title.trim().toLowerCase();
  return REASONS_BLACKLIST.some((b) => t === b || t.startsWith(b));
};

const ReasonsEditorial = ({
   title,
   lead,
   lead2,
   items,
   layout = "prose",
}: {
   title: string;
   lead?: string;
   lead2?: string;
   items: { n: string; title: string; desc: ReactNode }[];
   layout?: "prose" | "accordion" | "auto";
}) => {
   const isMobile = useIsMobile();
   // Filter out blacklisted items and items with no real content.
   const cleanItems = (items ?? []).filter(
     (r) => !isBlacklisted(r.title) && (r.desc !== undefined && r.desc !== null && r.desc !== ""),
   );
   if (cleanItems.length === 0) return null;

   const effectiveLayout: "prose" | "accordion" =
     layout === "auto" ? (cleanItems.length > 4 ? "accordion" : "prose") : layout;

   const proseClasses =
     "text-sm md:text-base font-light text-muted-foreground leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:marker:text-foreground/40";

   return (
     <section className="py-20 md:py-28 bg-background">
       <div className="container mx-auto px-6 md:px-16">
         <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-16 lg:gap-28">
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
             {effectiveLayout === "accordion" ? (
               <Accordion
                 type="single"
                 collapsible
                 defaultValue={isMobile ? undefined : `reason-0`}
                 onValueChange={(val) => {
                   if (!val) return;
                   requestAnimationFrame(() => {
                     setTimeout(() => {
                       const el = document.getElementById(`acc-${val}`);
                       if (!el) return;
                       const headerOffset = 96;
                       const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
                       window.scrollTo({ top, behavior: "smooth" });
                     }, 220);
                   });
                 }}
                 className="border-t border-border/60"
               >
                 {cleanItems.map((r, i) => (
                   <AccordionItem
                     key={r.n}
                     value={`reason-${i}`}
                     id={`acc-reason-${i}`}
                     className="border-b border-border/60 scroll-mt-24"
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
               // FORM A — one continuous article. Subheadings are inline
               // mid-titles, never click-to-open.
               <article className="space-y-10">
                 {cleanItems.map((r, idx) => (
                   <div key={r.n} className={idx === 0 ? "" : ""}>
                     <h3 className="text-lg md:text-xl font-normal text-foreground mb-3 leading-snug">
                       {r.title}
                     </h3>
                     <div className={proseClasses}>
                       {typeof r.desc === "string" ? <p>{r.desc}</p> : r.desc}
                     </div>
                   </div>
                 ))}
               </article>
             )}
           </div>
         </div>
       </div>
     </section>
   );
};

/**
 * Render a related-services block — ALWAYS as the global "Flere fagområder"
 * image-card layout (image on top, title, short description, "Les mer →").
 * If an item is missing its own image, fall back to the service's dedicated
 * hero via the route href, then to the category hero. We never render a
 * text-only list or a card without an image.
 */
const RelatedBlock = ({
  items,
  columns = 2,
}: {
  items: { title: string; desc: string; href: string; image?: string }[];
  columns?: 2 | 3;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  if (items.length === 0) return null;
  const resolved = items.map((a) => ({
    ...a,
    image: a.image ?? getServiceImageFromHref(a.href),
  }));
  const gridCols = columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3";
  return (
    <>
      <div
        ref={ref}
        className={`flex md:grid grid-cols-1 ${gridCols} gap-2 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide`}
        style={{ scrollbarWidth: "none" }}
      >
        {resolved.map((a) => (
          <Link
            key={a.title}
            to={a.href}
            className="bg-background rounded-sm border border-border/40 flex flex-col group hover:border-foreground/30 transition-colors overflow-hidden shrink-0 w-[92%] md:w-auto snap-start"
          >
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-secondary">
              {a.image && (
                <img
                  src={a.image}
                  alt={a.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              )}
            </div>
            <div className="p-7 flex flex-col flex-1">
              <h3 className="text-lg font-normal text-foreground mb-3">{a.title}</h3>
              <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">{a.desc}</p>
              <span className="inline-flex items-center text-sm font-light text-foreground gap-2 group-hover:gap-2.5 transition-all">
                Les mer
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
      <ScrollArrows scrollRef={ref} />
    </>
  );
};

const SEE_ALL_LABELS: Record<string, string> = {
  gynekologi: "gynekologi-tjenester",
  fertilitet: "fertilitet-tjenester",
  urologi: "urologi-tjenester",
  ortopedi: "ortopedi-tjenester",
  graviditet: "graviditet-tjenester",
  gastrokirurgi: "gastrokirurgi-tjenester",
  hudbehandlinger: "hudbehandlinger",
};

const getSeeAllLink = (canonical: string): { href: string; label: string } | null => {
  const path = canonical.replace(/\/+$/, "");
  const lastSlash = path.lastIndexOf("/");
  if (lastSlash <= 0) return null;
  const parentPath = path.slice(0, lastSlash);
  if (parentPath === "/behandlinger/flere-fagomrader") {
    return { href: parentPath, label: "Se alle behandlinger" };
  }
  const lastSegment = parentPath.split("/").pop() ?? "";
  const label = SEE_ALL_LABELS[lastSegment] ?? `${lastSegment.toLowerCase()}-tjenester`;
  return { href: parentPath, label: `Se alle ${label}` };
};

const RelatedServicesCarousel = ({
  items,
  seeAll,
}: {
  items: { title: string; desc: string; href: string; image?: string }[];
  seeAll: { href: string; label: string } | null;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const resolved = items.map((a) => ({
    ...a,
    image: a.image ?? getServiceImageFromHref(a.href),
  }));
  const showArrows = resolved.length > 2;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector<HTMLElement>("[data-related-card]");
    const step = card ? card.offsetWidth + 24 : 320;
    scrollRef.current.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };

  return (
    <section className="bg-background py-20 md:py-28 overflow-hidden">
      <div className="container mx-auto px-6 md:px-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
              Relaterte tjenester
            </h2>
          </div>
          {showArrows && (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-secondary transition-colors text-foreground"
                aria-label="Scroll venstre"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-secondary transition-colors text-foreground"
                aria-label="Scroll høyre"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto pl-6 md:pl-16 pr-0">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory pr-6 md:pr-16"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
        >
          {resolved.map((a) => (
            <Link
              key={a.title}
              data-related-card
              to={a.href}
              className="relative flex-shrink-0 w-[85vw] sm:w-[360px] md:w-[400px] aspect-[4/5] snap-start rounded-sm overflow-hidden group bg-secondary"
            >
              {a.image && (
                <img
                  src={a.image}
                  alt={a.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 flex items-end justify-between gap-3">
                <h3 className="text-lg md:text-xl font-normal text-white leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                  {a.title}
                </h3>
                <ArrowRight className="w-4 h-4 text-white flex-shrink-0 mb-1 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
        <div className="md:hidden px-6">
          <ScrollArrows scrollRef={scrollRef} />
        </div>
      </div>



      {seeAll && (
        <div className="container mx-auto px-6 md:px-16">
          <div className="mt-10 flex justify-center">
            <Link
              to={seeAll.href}
              className="inline-flex items-center text-sm font-light text-foreground gap-2 hover:gap-2.5 transition-all border-b border-foreground/30 pb-1"
            >
              {seeAll.label}
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export const SubTreatmentLayout = ({ isChatOpen, content: c }: Props) => {
 const expertAreasRef = useRef<HTMLDivElement>(null);
 const promisesRef = useRef<HTMLDivElement>(null);
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
        {/* Mobile-only: breadcrumb + title above the image (hybrid order) */}
        <div className="lg:hidden page-edge-text-left pb-4">
          <nav className="text-xs font-light text-foreground/60 flex items-center gap-2 mb-4 flex-wrap">
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
          <h2
            lang="no"
            className="text-4xl font-light text-foreground leading-[1.05] hyphens-auto [overflow-wrap:anywhere]"
          >
            {c.heroTitle}
          </h2>
        </div>
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 lg:min-h-[720px]">
          {/* Left — breadcrumb + copy + CTA */}
          <div className="flex flex-col justify-center page-edge-text-left py-12 lg:py-20">
            <nav className="hidden lg:flex text-xs font-light text-foreground/60 items-center gap-2 mb-8 lg:mb-10">
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

              <h2
                lang="no"
                className="hidden lg:block text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05] hyphens-auto [overflow-wrap:anywhere]"
              >
                {c.heroTitle}
              </h2>

              <p className="text-base md:text-lg font-light leading-relaxed mb-6 text-muted-foreground">
                {c.heroDescription}
              </p>

              {c.heroAvailability && (
                <p className="mb-6 text-sm font-light text-foreground/70">
                  {c.heroAvailability}
                </p>
              )}

              {c.heroThemes && c.heroThemes.length > 0 && (
                <div className="mb-8">
                  <p className="text-sm font-light text-foreground/70 mb-2">Vi behandler blant annet:</p>
                  <ul className="flex flex-wrap gap-1.5" aria-label="Temaer vi behandler">
                    {c.heroThemes.map((t) => (
                      <li
                        key={t}
                        className="text-xs font-light text-foreground/70 border border-foreground/15 px-2 py-1 rounded-2xl md:rounded-full"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}




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
            {c.heroVideo ? (
              <video
                src={c.heroVideo}
                poster={heroImg}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : heroImg ? (
              <img
                src={heroImg}
                alt={c.heroImageAlt ?? c.flowImageAlt ?? c.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : null}
          </div>
        </div>
        <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
      </header>
    );
  })()}


  {/* RELATED (as intro) — for landing pages where the cards are the actual treatments inside this service */}
  {c.relatedAsIntro && c.related.length > 0 && (
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          {c.relatedLead ? (
            <div className="grid lg:grid-cols-12 gap-6 md:gap-14 lg:gap-24 mb-10 md:mb-14">
              <div className="lg:col-span-6">
                <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
                  {c.relatedTitle ?? "Dette inngår i tjenesten"}
                </h2>
              </div>
              <div className="lg:col-span-6 lg:pt-3">
                <p className="text-base font-light text-muted-foreground leading-relaxed">
                  {c.relatedLead}
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mb-8 md:mb-12">
              <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
                {c.relatedTitle ?? "Dette inngår i tjenesten"}
              </h2>
            </div>
          )}
          <RelatedBlock items={c.related} columns={2} />
        </div>
      </div>
    </section>
  )}

  {/* 2. REASONS / INFO — editorial sticky split */}
  <ReasonsEditorial
    title={c.reasonsTitle}
    lead={c.reasonsLead}
    lead2={c.reasonsLead2}
    items={c.reasons}
    layout={c.reasonsLayout}
  />

  {/* 3. RELATED (as services) — treatments included in this service, shown before flow */}
  {c.relatedAsServices && c.related.length > 0 && (
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
              {c.relatedTitle ?? "Dette hjelper vi deg med"}
            </h2>
          </div>
          <RelatedBlock items={c.related} />
        </div>
      </div>
    </section>
  )}



 {/* 3. FLOW — image on opposite side from hero (left) so two split sections don't stack on same side */}
  {c.flowImage ? (
 <section className="bg-brand-light text-foreground">
 <h2 className="lg:hidden text-3xl font-light leading-tight text-foreground px-6 md:px-12 pt-12 pb-4">
 {c.flowTitle}
 </h2>
 <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 lg:items-stretch lg:min-h-screen">
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
 <h2 className="hidden lg:block text-3xl md:text-5xl font-light leading-tight text-foreground mb-12">
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
 <div className="grid lg:grid-cols-12 gap-14 lg:gap-24 mb-14">
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

  <div ref={expertAreasRef} className="flex md:grid md:grid-cols-2 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
  {c.expertAreas.items.map((a) => (
  <Link
  key={a.title}
  to={a.href}
  className="bg-background rounded-sm border border-border/40 flex flex-col group hover:border-foreground/30 transition-colors overflow-hidden shrink-0 w-[85vw] md:w-auto snap-center"
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
  <ScrollArrows scrollRef={expertAreasRef} />
 </div>
 </div>
 </section>
 )}

      {/* 4. RELATED — moved above promises so methods/subsider stands first */}
      {!c.relatedAsIntro && !c.relatedAsServices && c.related.length > 0 && (
        <section className="bg-secondary/40 py-20 md:py-28">
          <div className="container mx-auto px-6 md:px-16">
            <div className="max-w-6xl mx-auto">
              <div className="max-w-2xl mb-12">
                <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
                  {c.relatedTitle ?? "Du er kanskje også interessert i"}
                </h2>
              </div>

              <RelatedBlock items={c.related} />
            </div>
          </div>
        </section>
      )}


      {/* 4b. PROMISES — three image cards (swapped above reviews) */}
      <section className="bg-secondary/40 pt-24 md:pt-32 pb-24 md:pb-32">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
          <div ref={promisesRef} className="flex md:grid md:grid-cols-3 gap-4 md:gap-10 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {c.promises.map((p, i) => (
              <div key={p.title} className="group flex flex-col shrink-0 w-[85vw] md:w-auto snap-center">
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-secondary mb-6">
                  <img
                    src={promiseImages[i]}
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
          <ScrollArrows scrollRef={promisesRef} />
          </div>
        </div>
      </section>


  {/* 4c. TEXT SECTION — optional split text+image, like "Det beste fra to klinikker" */}
  {c.textSection && (
  <section className="bg-background">
  <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 lg:items-stretch">
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
 <section className="bg-brand-light text-foreground py-10 md:py-16 border-t border-brand-dark/10">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
 <div className="max-w-3xl">
 <h2 className="text-xl md:text-3xl font-light leading-tight">
 {c.conversationCtaTitle ?? "Snakk med en av våre spesialister"}
 </h2>
 </div>
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-center w-full md:w-auto">
        <Button
 variant="cta"
 size="lg"
 className="px-6 w-full md:w-auto h-14 md:h-12"
 onClick={() => (window.location.href = buildBookingUrl(c.booking))}
 >
 Se ledige tider og book
 </Button>
        <div className="w-full md:w-auto">
          <CallUsClinicPicker variant="light" label="Ring oss" className="w-full h-14 md:h-12" />
        </div>
      </div>
 </div>
 </div>
 </section>

 {/* 5. REVIEWS — pasienttilbakemeldinger (flyttet under promises) */}
 <CategoryReviews categoryId={c.booking.kategori} categoryTitle={c.parent.name} />

 {/* 6. SPESIALISTER — samme presentasjon som på fertilitetssiden */}
 <SpecialistsScroller
 category={c.specialistCategory}
 filter={
 c.specialistSlugs && c.specialistSlugs.length > 0
 ? (s: any) => c.specialistSlugs!.includes(s.slug)
 : undefined
 }
 fallbackCategory={c.specialistCategory ?? "annet"}
 title={c.specialistTitle ?? "Spesialister som utfører dette"}
 description={c.specialistDescription ?? "Erfaring, spisskompetanse og moderne teknologi samlet på ett sted."}
 seeAllHref={c.specialistCtaHref ?? `/spesialister?kategori=${c.specialistCategory ?? ""}`}
 seeAllLabel={c.specialistCtaLabel}
 />

      {/* SAMARBEIDSPARTNERE / FORSIKRING — før booking CTA */}
      <InsurancePartners />

      {/* RELATERTE TJENESTER — søsken-tjenester som horisontal karusell */}
      {c.siblingServices && c.siblingServices.length > 0 && (
        <RelatedServicesCarousel
          items={c.siblingServices}
          seeAll={getSeeAllLink(c.canonical)}
        />
      )}

      {/* BESTILL TIME — unified pre-footer CTA */}
      <BookingCTA />
 </PageLayout>
 );
};

export default SubTreatmentLayout;
