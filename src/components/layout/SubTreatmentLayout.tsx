"use client";

import { AssetImg } from "@/components/AssetImg";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { PageSEO } from "@/components/seo/PageSEO";
import { CategoryReviews } from "@/components/treatments/CategoryReviews";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ScrollArrows } from "@/components/ui/ScrollArrows";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { buildBookingUrl } from "@/lib/bookingLinks";
import { Link } from "@/lib/router";
import type { PageSection } from "@/lib/sanity/page-sections";
import type { Specialist } from "@/lib/sanity/specialist-types";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef } from "react";

export interface SubTreatmentContent {
  seoTitle: string;
  seoDescription: string;
  canonical: string;
  homeBreadcrumbLabel: string;
  srOnlyTitle: string;
  themesAriaLabel: string;
  seePricesLabel: string;
  seePricesHref: string;
  callCtaLabel: string;
  expertReadMoreLabel: string;
  scrollLeftLabel: string;
  scrollRightLabel: string;
  insuranceEyebrow: string;
  insuranceTitle: string;
  insurancePartners: { key: string; label: string }[];
  parent: { name: string; path: string };
  grandparent?: { name: string; path: string };
  title: string;
  heroTitle: string | ReactNode;
  heroDescription: string;
  heroThemes?: string[];
  heroPoints: { title: string; desc: string }[];
  heroAvailability?: string;
  rating?: string;
  heroPrice?: string;
  hideSeePriser?: boolean;
  booking: { kategori: string; tjeneste?: string };
  primaryCtaLabel?: string;
  flowTitle: string;
  flow: { n: string; title: string; desc: string | ReactNode }[];
  flowImage?: string;
  flowImageAlt?: string;
  heroImage?: string;
  heroImageAlt?: string;
  heroVideo?: string;
  flowLinkLabel?: string;
  flowLinkHref?: string;
  reasonsTitle: string;
  reasonsLead?: string;
  reasonsLead2?: string;
  reasons: { n: string; title: string; desc: string | ReactNode }[];
  reasonsLayout?: "prose" | "accordion" | "auto";
  promises: { eyebrow?: string; title: string; desc: string | ReactNode; image?: string; imageAlt?: string }[];
  textSection?: {
    title: string;
    lead?: string;
    points?: { n: string; title: string; desc: string | ReactNode }[];
    image: string;
    imageAlt?: string;
  };
  expertAreas?: {
    title: string;
    description?: string;
    items: { title: string; desc: string | ReactNode; href: string; image?: string; imageAlt?: string }[];
  };
  relatedTitle?: string;
  relatedLead?: string;
  related: { eyebrow?: string; title: string; desc: string | ReactNode; href: string; image?: string; imageAlt?: string }[];
  relatedAsIntro?: boolean;
  relatedAsServices?: boolean;
  relatedSeeAll?: { href: string; label: string };
  ctaTitle?: string;
  ctaDescription?: string;
  conversationCtaTitle?: string;
  specialistCategory?: Specialist["category"];
  specialistSlugs?: string[];
  specialistCtaLabel?: string;
  specialistCtaHref?: string;
  specialistTitle?: string;
  specialistDescription?: string;
}

interface Props {
  isChatOpen: boolean;
  content: SubTreatmentContent;
  locale?: "no" | "en";
  pageSections?: PageSection[];
}

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

const isBlacklistedReason = (title: string): boolean => {
  const normalized = title.trim().toLowerCase();
  return REASONS_BLACKLIST.some(
    (blacklisted) =>
      normalized === blacklisted || normalized.startsWith(blacklisted),
  );
};

const parseHeroTitle = (heroTitle: string | ReactNode): ReactNode => {
  if (typeof heroTitle !== "string") return heroTitle;

  const parts = heroTitle.split(/(\*[^*]+\*)/g).filter(Boolean);
  return parts.map((part, index) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <span key={`${part}-${index}`} className="italic">
          {part.slice(1, -1)}
        </span>
      );
    }
    return <span key={`${part}-${index}`}>{part}</span>;
  });
};

function ReasonsEditorial({
  title,
  lead,
  lead2,
  items,
  layout = "prose",
}: {
  title: string;
  lead?: string;
  lead2?: string;
  items: { n: string; title: string; desc: string | ReactNode }[];
  layout?: "prose" | "accordion" | "auto";
}) {
  const cleanItems = (items ?? []).filter(
    (item) => !isBlacklistedReason(item.title) && (typeof item.desc === "string" ? item.desc.trim() : !!item.desc),
  );

  if (cleanItems.length === 0) return null;

  const effectiveLayout: "prose" | "accordion" =
    layout === "auto" ? (cleanItems.length > 4 ? "accordion" : "prose") : layout;

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-16 lg:gap-28">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-[1.1] mb-6">
                {title}
              </h2>
              {lead ? (
                <p className="text-base font-light text-muted-foreground leading-relaxed mb-3">
                  {lead}
                </p>
              ) : null}
              {lead2 ? (
                <p className="text-base font-light text-muted-foreground leading-relaxed">
                  {lead2}
                </p>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-7">
            {effectiveLayout === "accordion" ? (
              <Accordion
                type="single"
                collapsible
                defaultValue="reason-0"
                className="border-t border-border/60"
              >
                {cleanItems.map((item, index) => (
                  <AccordionItem
                    key={`${item.n}-${item.title}`}
                    value={`reason-${index}`}
                    className="border-b border-border/60"
                  >
                    <AccordionTrigger className="py-6 text-left text-lg md:text-xl font-normal text-foreground hover:no-underline">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="pb-8">
                      <p className="text-sm md:text-base font-light text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <article className="space-y-10">
                {cleanItems.map((item) => (
                  <div key={`${item.n}-${item.title}`}>
                    <h3 className="text-lg md:text-xl font-normal text-foreground mb-3 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-sm md:text-base font-light text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </article>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function RelatedServicesCarousel({
  title,
  items,
  seeAll,
  beforeBooking = false,
  scrollLeftLabel,
  scrollRightLabel,
}: {
  title: string;
  items: { title: string; desc: string | ReactNode; href: string; image?: string; imageAlt?: string }[];
  seeAll: { href: string; label: string } | null;
  /** Tighter bottom spacing when placed directly above the booking CTA. */
  beforeBooking?: boolean;
  scrollLeftLabel: string;
  scrollRightLabel: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  if (!items.length) return null;

  const showArrows = items.length > 2;

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector<HTMLElement>("[data-related-card]");
    const step = card ? card.offsetWidth + 24 : 320;
    scrollRef.current.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };

  return (
    <section
      className={
        beforeBooking
          ? "bg-background pt-20 md:pt-28 pb-10 md:pb-12 overflow-hidden"
          : "bg-background py-20 md:py-28 overflow-hidden"
      }
    >
      <div className="container mx-auto px-6 md:px-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
              {title}
            </h2>
          </div>
          {showArrows ? (
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={() => scroll("left")}
                className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-secondary transition-colors text-foreground"
                aria-label={scrollLeftLabel}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-secondary transition-colors text-foreground"
                aria-label={scrollRightLabel}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="container mx-auto pl-6 md:pl-16 pr-0">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory pr-6 md:pr-16"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
        >
          {items.map((item) => (
            <Link
              key={`${item.title}-${item.href}`}
              data-related-card
              to={item.href}
              className="relative flex-shrink-0 w-[85vw] sm:w-[360px] md:w-[400px] aspect-[4/5] snap-start rounded-sm overflow-hidden group bg-secondary"
            >
              {item.image ? (
                <AssetImg
                  src={item.image}
                  alt={item.imageAlt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 flex items-end justify-between gap-3">
                <h3 className="text-lg md:text-xl font-normal text-white leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
                  {item.title}
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

      {seeAll ? (
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
      ) : null}
    </section>
  );
}

function RelatedBlock({
  title,
  lead,
  items,
  readMoreLabel,
}: {
  title: string;
  lead?: string;
  items: { title: string; desc: string | ReactNode; href: string; image?: string; imageAlt?: string }[];
  readMoreLabel: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  if (!items.length) return null;

  return (
    <section className="bg-secondary/40 py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          {lead ? (
            <div className="grid lg:grid-cols-12 gap-6 md:gap-14 lg:gap-24 mb-10 md:mb-14">
              <div className="lg:col-span-6">
                <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
                  {title}
                </h2>
              </div>
              <div className="lg:col-span-6 lg:pt-3">
                <p className="text-base font-light text-muted-foreground leading-relaxed">
                  {lead}
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mb-8 md:mb-12">
              <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
                {title}
              </h2>
            </div>
          )}

          <div
            ref={scrollRef}
            className="flex md:grid md:grid-cols-2 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide"
            style={{ scrollbarWidth: "none" }}
          >
            {items.map((item) => (
              <Link
                key={`${item.title}-${item.href}`}
                to={item.href}
                className="bg-background rounded-sm border border-border/40 flex flex-col group hover:border-foreground/30 transition-colors overflow-hidden shrink-0 w-[78vw] md:w-auto snap-center"
              >
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                  {item.image ? (
                    <AssetImg
                      src={item.image}
                      alt={item.imageAlt}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary" />
                  )}
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <h3 className="text-lg font-normal text-foreground mb-3">{item.title}</h3>
                  <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">
                    {item.desc}
                  </p>
                  <span className="inline-flex items-center text-sm font-light text-foreground gap-2 group-hover:gap-2.5 transition-all">
                    {readMoreLabel}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <ScrollArrows scrollRef={scrollRef} />
        </div>
      </div>
    </section>
  );
}

export const SubTreatmentLayout = ({
  isChatOpen,
  content: c,
  locale: _locale = "no",
  pageSections,
}: Props) => {
  const { specialists } = useSpecialistsData();
  const expertAreasRef = useRef<HTMLDivElement>(null);
  const promisesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = `${c.title} | CMedical`;
  }, [c.title]);

  const heroMedia = c.heroImage;

  const heroTitle = useMemo(() => parseHeroTitle(c.heroTitle), [c.heroTitle]);

  // Obsolete specialists resolving logic removed as page builder pageSectionSpecialists is used instead

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={c.seoTitle}
        description={c.seoDescription}
        canonical={c.canonical}
        breadcrumbs={[
          { name: c.homeBreadcrumbLabel, path: "/" },
          ...(c.grandparent ? [c.grandparent] : []),
          c.parent,
          { name: c.title, path: c.canonical },
        ]}
      />
      <h1 className="sr-only">{c.srOnlyTitle}</h1>

      <header className="bg-brand-light pt-24 lg:pt-0">
        <div className="lg:hidden px-6 md:px-16 pb-4">
          <nav className="text-xs font-light text-foreground/60 flex items-center gap-2 mb-4 flex-wrap">
            <Link to="/" className="hover:text-foreground">
              {c.homeBreadcrumbLabel}
            </Link>
            <span>›</span>
            {c.grandparent ? (
              <>
                <Link to={c.grandparent.path} className="hover:text-foreground">
                  {c.grandparent.name}
                </Link>
                <span>›</span>
              </>
            ) : null}
            <Link to={c.parent.path} className="hover:text-foreground">
              {c.parent.name}
            </Link>
            <span>›</span>
            <span className="text-foreground/80">{c.title}</span>
          </nav>
          <h2 className="text-4xl font-light text-foreground leading-[1.05]">{heroTitle}</h2>
        </div>

        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 lg:min-h-[720px]">
          <div className="flex flex-col justify-center px-6 md:px-16 py-12 lg:py-20">
            <nav className="hidden lg:flex text-xs font-light text-foreground/60 items-center gap-2 mb-8 lg:mb-10">
              <Link to="/" className="hover:text-foreground">
                {c.homeBreadcrumbLabel}
              </Link>
              <span>›</span>
              {c.grandparent ? (
                <>
                  <Link to={c.grandparent.path} className="hover:text-foreground">
                    {c.grandparent.name}
                  </Link>
                  <span>›</span>
                </>
              ) : null}
              <Link to={c.parent.path} className="hover:text-foreground">
                {c.parent.name}
              </Link>
              <span>›</span>
              <span className="text-foreground/80">{c.title}</span>
            </nav>

            <div className="max-w-xl w-full">
              <h2 className="hidden lg:block text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
                {heroTitle}
              </h2>
              <p className="text-base md:text-lg font-light leading-relaxed mb-6 text-muted-foreground whitespace-pre-line">
                {c.heroDescription}
              </p>

              {c.heroAvailability ? (
                <p className="mb-6 text-sm font-light text-foreground/70">{c.heroAvailability}</p>
              ) : null}

              {c.heroThemes && c.heroThemes.length > 0 ? (
                <div className="mb-8">
                  <ul className="flex flex-wrap gap-1.5" aria-label={c.themesAriaLabel}>
                    {c.heroThemes.map((theme) => (
                      <li
                        key={theme}
                        className="text-xs font-light text-foreground/70 border border-foreground/15 px-2 py-1 rounded-full"
                      >
                        {theme}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mb-8 max-w-sm">
                {c.heroPrice ? (
                  <div className="mb-4 text-sm font-light text-foreground/80">
                    <span className="block text-base text-foreground">{c.heroPrice}</span>
                  </div>
                ) : null}

                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <Button
                    variant="cta"
                    size="lg"
                    className="px-6 w-full sm:w-auto"
                    onClick={() => (window.location.href = buildBookingUrl(c.booking))}
                  >
                    {c.primaryCtaLabel}
                  </Button>
                  {!c.hideSeePriser ? (
                    <Link
                      to={c.seePricesHref}
                      className="text-sm font-light text-foreground hover:text-foreground/70 border-b border-foreground/40 hover:border-foreground pb-0.5 transition-colors"
                    >
                      {c.seePricesLabel}
                    </Link>
                  ) : null}
                  <CallUsClinicPicker variant="light" label={c.callCtaLabel} />
                </div>
              </div>

              {c.rating ? (
                <div className="inline-flex items-center gap-3 rounded-2xl bg-card border border-border/60 px-4 py-3 text-sm font-light text-brand-dark shadow-sm mb-8">
                  <div className="flex" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-brand-dark fill-brand-dark" />
                    ))}
                  </div>
                  <span>{c.rating}</span>
                </div>
              ) : null}

              <ul className="space-y-4">
                {c.heroPoints.map((point) => (
                  <li key={point.title} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-background border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-foreground" />
                    </span>
                    <div>
                      <h3 className="text-base font-normal text-foreground mb-1">
                        {point.title}
                      </h3>
                      <p className="text-sm font-light text-muted-foreground leading-relaxed">
                        {point.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-full bg-secondary/40 overflow-hidden">
            {c.heroVideo ? (
              <video
                src={c.heroVideo}
                poster={heroMedia}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : heroMedia ? (
              <AssetImg
                src={heroMedia}
                alt={c.heroImageAlt}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-secondary" />
            )}
          </div>
        </div>
        <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
      </header>

      {c.relatedAsIntro && c.related.length > 0 ? (
        <RelatedBlock
          title={c.relatedTitle || ""}
          lead={c.relatedLead}
          items={c.related}
          readMoreLabel={c.expertReadMoreLabel}
        />
      ) : null}

      <ReasonsEditorial
        title={c.reasonsTitle}
        lead={c.reasonsLead}
        lead2={c.reasonsLead2}
        items={c.reasons}
        layout={c.reasonsLayout}
      />

      {c.flowImage ? (
        <section className="bg-brand-light text-foreground">
          <h2 className="lg:hidden text-3xl font-light leading-tight text-foreground px-6 md:px-16 pt-12 pb-4">
            {c.flowTitle}
          </h2>
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 lg:items-stretch lg:min-h-screen">
            <div className="relative bg-secondary/40 min-h-[420px] lg:min-h-full overflow-hidden">
              <AssetImg
                src={c.flowImage}
                alt={c.flowImageAlt}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="px-6 md:px-16 lg:px-20 py-16 lg:py-24 flex flex-col justify-center">
              <div className="max-w-lg">
                <h2 className="hidden lg:block text-3xl md:text-5xl font-light leading-tight text-foreground mb-12">
                  {c.flowTitle}
                </h2>
                <ol className="divide-y divide-border/40 border-t border-border/40">
                  {c.flow.map((step) => (
                    <li key={`${step.n}-${step.title}`} className="py-5">
                      <h3 className="text-base font-normal text-foreground mb-1.5 leading-snug">
                        {step.title}
                      </h3>
                      <p className="text-sm font-light text-muted-foreground leading-relaxed">
                        {step.desc}
                      </p>
                    </li>
                  ))}
                </ol>
                {c.flowLinkHref ? (
                  <Link
                    to={c.flowLinkHref}
                    className="mt-10 inline-flex items-center gap-2 text-sm font-light text-foreground hover:gap-2.5 transition-all"
                  >
                    {c.flowLinkLabel}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-brand-light text-foreground py-20 md:py-28">
          <div className="container mx-auto px-6 md:px-16">
            <div className="max-w-6xl mx-auto">
              <div className="max-w-2xl mb-14">
                <h2 className="text-3xl md:text-5xl font-light leading-tight">{c.flowTitle}</h2>
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
                      <div key={`${step.n}-${step.title}`} className="bg-background p-5 md:p-6 flex flex-col">
                        <p className="text-[11px] tracking-wider text-brand-dark mb-4 uppercase">
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

      {c.expertAreas && c.expertAreas.items.length > 0 ? (
        <section className="bg-secondary/40 py-20 md:py-28">
          <div className="container mx-auto px-6 md:px-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-12 gap-14 lg:gap-24 mb-14">
                <div className="lg:col-span-6">
                  <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
                    {c.expertAreas.title}
                  </h2>
                </div>
                {c.expertAreas.description ? (
                  <div className="lg:col-span-6 lg:pt-3">
                    <p className="text-base font-light text-muted-foreground leading-relaxed">
                      {c.expertAreas.description}
                    </p>
                  </div>
                ) : null}
              </div>
              <div
                ref={expertAreasRef}
                className="flex md:grid md:grid-cols-2 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide"
                style={{ scrollbarWidth: "none" }}
              >
                {c.expertAreas.items.map((area) => (
                  <Link
                    key={`${area.title}-${area.href}`}
                    to={area.href}
                    className="bg-background rounded-sm border border-border/40 flex flex-col group hover:border-foreground/30 transition-colors overflow-hidden shrink-0 w-[78vw] md:w-auto snap-center"
                  >
                    <div className="relative w-full aspect-[16/9] overflow-hidden bg-secondary">
                      {area.image ? (
                        <AssetImg
                          src={area.image}
                          alt={area.imageAlt}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary" />
                      )}
                    </div>
                    <div className="p-7 flex flex-col flex-1">
                      <h3 className="text-xl font-light text-foreground mb-3">{area.title}</h3>
                      <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">
                        {area.desc}
                      </p>
                      <span className="inline-flex items-center text-sm font-light text-foreground gap-2 group-hover:gap-2.5 transition-all">
                        {c.expertReadMoreLabel}
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
      ) : null}

      <section className="bg-secondary/40 pt-24 md:pt-32 pb-24 md:pb-32">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div
              ref={promisesRef}
              className="flex md:grid md:grid-cols-3 gap-4 md:gap-10 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide"
              style={{ scrollbarWidth: "none" }}
            >
              {c.promises.map((promise) => (
                <div key={promise.title} className="group flex flex-col shrink-0 w-[78vw] md:w-auto snap-center">
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-secondary mb-6">
                    {promise.image ? (
                      <AssetImg
                        src={promise.image}
                        alt={promise.imageAlt}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <h3 className="text-xl md:text-2xl font-light leading-[1.2] text-foreground mb-4 max-w-[28ch]">
                    {promise.title}
                  </h3>
                  <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-[48ch]">
                    {promise.desc}
                  </p>
                </div>
              ))}
            </div>
            <ScrollArrows scrollRef={promisesRef} />
          </div>
        </div>
      </section>

      {c.textSection ? (
        <section className="bg-background">
          <h2 className="lg:hidden text-3xl font-light leading-[1.1] text-foreground px-6 md:px-16 pt-16 pb-4">
            {c.textSection.title}
          </h2>
          <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 lg:items-stretch">
            <div className="lg:col-span-7 px-6 md:px-16 lg:px-20 py-20 lg:py-28 h-full flex flex-col justify-center">
              <div className="max-w-xl">
                <h2 className="hidden lg:block text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-[1.1] text-foreground mb-6">
                  {c.textSection.title}
                </h2>
                {c.textSection.lead ? (
                  <p className="text-base font-light text-muted-foreground leading-relaxed mb-12">
                    {c.textSection.lead}
                  </p>
                ) : null}
                {c.textSection.points && c.textSection.points.length > 0 ? (
                  <div className="divide-y divide-border/60 border-t border-border/60">
                    {c.textSection.points.map((point) => (
                      <div key={`${point.n}-${point.title}`} className="grid grid-cols-12 gap-4 py-6">
                        <div className="col-span-2 md:col-span-1 text-xs font-light text-foreground/60 pt-1">
                          {point.n}
                        </div>
                        <div className="col-span-10 md:col-span-11">
                          <h3 className="text-base font-normal text-foreground mb-1.5">{point.title}</h3>
                          <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-md">
                            {point.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
            <div className="lg:col-span-5 relative bg-secondary/40 min-h-[420px] lg:h-full overflow-hidden">
              <AssetImg
                src={c.textSection.image}
                alt={c.textSection.imageAlt}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      ) : null}

      <PageSectionsRenderer
        sections={pageSections?.filter(
          (s) => s._type !== "pageSectionBookingCta" && s._type !== "pageSectionSpecialists"
        )}
      />

      {/* MID-PAGE CONVERSION BAND */}
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
                {c.primaryCtaLabel || "Se ledige tider og book"}
              </Button>
              <div className="w-full md:w-auto">
                <CallUsClinicPicker variant="light" label={c.callCtaLabel || "Ring oss"} className="w-full h-14 md:h-12" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <CategoryReviews categoryId={c.booking.kategori} categoryTitle={c.parent.name} />

      {(() => {
        const specialistsSections = pageSections?.filter((s) => s._type === "pageSectionSpecialists");
        return specialistsSections && specialistsSections.length > 0 ? (
          <PageSectionsRenderer sections={specialistsSections} />
        ) : null;
      })()}

      <section className="bg-brand-light text-foreground py-14 md:py-16 border-t border-brand-dark/10">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-4">
              <p className="text-[11px] tracking-[0.18em] text-brand-dark mb-3">
                {c.insuranceEyebrow}
              </p>
              <h3 className="text-xl md:text-2xl font-light leading-snug text-foreground">
                {c.insuranceTitle}
              </h3>
            </div>
            <div className="lg:col-span-8">
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 border-t border-brand-dark/10">
                {c.insurancePartners.map((partner) => (
                  <li
                    key={partner.key}
                    className="border-b border-brand-dark/10 [&:not(:nth-child(2n))]:border-r sm:[&:not(:nth-child(3n))]:border-r md:[&:not(:nth-child(4n))]:border-r border-brand-dark/10 py-4 px-4 text-sm font-light text-foreground/85"
                  >
                    {partner.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {c.related.length > 0 && !c.relatedAsIntro ? (
        <RelatedServicesCarousel
          title={c.relatedTitle || ""}
          items={c.related}
          seeAll={c.relatedSeeAll ?? null}
          scrollLeftLabel={c.scrollLeftLabel}
          scrollRightLabel={c.scrollRightLabel}
        />
      ) : null}

      {(() => {
        const bookingCtaSections = pageSections?.filter((s) => s._type === "pageSectionBookingCta");
        if (bookingCtaSections && bookingCtaSections.length > 0) {
          return <PageSectionsRenderer sections={bookingCtaSections} />;
        }
        return <BookingCTA bookingCategoryId={c.booking.kategori} />;
      })()}

    </PageLayout>
  );
};

export default SubTreatmentLayout;
