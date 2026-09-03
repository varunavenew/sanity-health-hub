"use client";

import { AssetImg } from "@/components/AssetImg";
import { SplitHeroMedia } from "@/components/layout/SplitHeroMedia";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { TreatmentCtaButtons } from "@/components/treatments/TreatmentCtaButtons";
import { FaqSection } from "@/components/layout/FaqSection";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { PageSectionInsuranceBlock } from "@/components/page-sections/PageSectionInsuranceBlock";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { resolveTreatmentInsurance } from "@/lib/sanity/insurance-dual-read";
import { resolveCmsMedia } from "@/lib/sanity/media-dual-read";
import { PageSEO } from "@/components/seo/PageSEO";
import { CategoryReviews } from "@/components/treatments/CategoryReviews";
import { ScrollArrows } from "@/components/ui/ScrollArrows";
import { buildBookingUrl, type BookingLinkParams } from "@/lib/bookingLinks";
import { trackBookingMenuStart } from "@/lib/tracking/seo-events";
import { Link } from "@/lib/router";
import type { PageSection } from "@/lib/sanity/page-sections";
import type { Specialist } from "@/lib/sanity/specialist-types";
import {
  hasBenefitsSection,
  hasExpertAreasSection,
  hasFaqSection,
  hasInsuranceSection,
  hasMidCtaSection,
  hasProcessSection,
  hasRelatedSection,
  hasSymptomsSection,
  hasTextSection,
  isMeaningfulReasonItem,
  filterMeaningfulPageSections,
} from "@/lib/sanity/section-visibility";
import { renderLightMarkdown } from "@/lib/light-markdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArrowRight, Check, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

export interface SubTreatmentContent {
  seoTitle: string;
  seoDescription: string;
  canonical: string;
  homeBreadcrumbLabel: string;
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
  heroPriceLabel?: string;
  hideSeePriser?: boolean;
  booking: BookingLinkParams;
  primaryCtaLabel?: string;
  flowTitle: string;
  flow: { n: string; title: string; desc: string | ReactNode }[];
  flowImage?: string;
  flowImageAlt?: string;
  heroImage?: string;
  heroImageAlt?: string;
  heroVideo?: string;
  heroMedia?: unknown;
  flowLinkLabel?: string;
  flowLinkHref?: string;
  reasonsTitle: string;
  reasonsLead?: string;
  reasonsLead2?: string;
  reasons: { n: string; title: string; desc: string | ReactNode; id?: string }[];
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
  midCtaPrimaryLabel?: string;
  midCtaCallLabel?: string;
  midCtaShowCallButton?: boolean;
  reviewsSectionTitle?: string;
  googleReviews?: { id: string; name: string; rating: number; text: string; date?: string; source: "google" | "legelisten" }[];
  legelistenReviews?: { id: string; name: string; rating: number; text: string; date?: string; source: "google" | "legelisten" }[];
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
  faqSectionTitle?: string;
  faqs?: { question: string; answer: string }[];
}

/** Title + ingress stacked; gap only from the grid (overrides global h2+p margin). */
function TreatmentSectionHead({
  title,
  description,
  description2,
  titleClassName = "text-3xl md:text-5xl font-light heading-display text-foreground",
  descriptionClassName = "text-base font-light text-muted-foreground leading-relaxed",
  className = "",
}: {
  title: ReactNode;
  description?: ReactNode;
  description2?: ReactNode;
  titleClassName?: string;
  descriptionClassName?: string;
  className?: string;
}) {
  return (
    <div className={`grid gap-y-3 md:gap-y-4 ${className}`.trim()}>
      <h2 className={`${titleClassName} !mb-0`}>{title}</h2>
      {description ? <p className={`${descriptionClassName} !mb-0`}>{description}</p> : null}
      {description2 ? <p className={descriptionClassName}>{description2}</p> : null}
    </div>
  );
}

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
}: {
  title: string;
  lead?: string;
  lead2?: string;
  items: { n: string; title: string; desc: string | ReactNode; id?: string }[];
}) {
  const cleanItems = (items ?? []).filter(isMeaningfulReasonItem);
  const hasLead = Boolean(lead?.trim() || lead2?.trim());
  const itemsWithIds = cleanItems.map((item, index) => ({
    ...item,
    id: item.id || `reason-${index}`,
  }));

  const [openItem, setOpenItem] = useState<string | undefined>(itemsWithIds[0]?.id);

  const itemIdsKey = itemsWithIds.map((item) => item.id).join("|");

  useEffect(() => {
    const applyHash = () => {
      const hashId = window.location.hash.replace(/^#/, "");
      if (!hashId) return;
      if (!itemIdsKey.split("|").includes(hashId)) return;
      setOpenItem(hashId);
      window.requestAnimationFrame(() => {
        document.getElementById(hashId)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, [itemIdsKey]);

  // Demo pages can show title + lead with no right-column items yet.
  if (cleanItems.length === 0 && !hasLead) return null;

  return (
    <section className="pt-14 md:pt-20 pb-10 bg-background">
      <div className="page-shell">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-16 lg:gap-28">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <TreatmentSectionHead
                title={title}
                description={lead}
                description2={lead2}
                titleClassName="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-[1.1]"
              />
            </div>
          </div>

          <div className="lg:col-span-7">
            {itemsWithIds.length > 0 ? (
              <Accordion
                key={`${title}-${itemsWithIds[0]?.n}-${itemsWithIds[0]?.title}`}
                type="single"
                collapsible
                value={openItem}
                onValueChange={setOpenItem}
                className="w-full"
              >
                {itemsWithIds.map((item, index) => (
                  <AccordionItem
                    key={`${item.n}-${item.title}-${index}`}
                    id={item.id}
                    value={item.id}
                    className="scroll-mt-28 border-b border-border/40"
                  >
                    <AccordionTrigger className="text-left text-lg md:text-xl font-normal text-foreground py-5 hover:no-underline leading-snug [&[data-state=open]>svg]:rotate-180">
                      <span className="pr-4">{item.title}</span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-sm md:text-base font-light text-muted-foreground leading-relaxed space-y-3 pb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:marker:text-foreground/40">
                        {typeof item.desc === "string"
                          ? renderLightMarkdown(item.desc)
                          : item.desc}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : null}
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
  scrollLeftLabel,
  scrollRightLabel,
}: {
  title: string;
  items: { title: string; desc: string | ReactNode; href: string; image?: string; imageAlt?: string }[];
  seeAll: { href: string; label: string } | null;
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
    <section className="bg-background pt-10 pb-20 overflow-hidden">
      <div className="page-shell">
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

      <div className="page-shell pr-0">
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
        <div className="page-shell">
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
    <section className="bg-secondary/40 py-10">
      <div className="page-shell">
        <div className="max-w-6xl mx-auto">
          {lead ? (
            <TreatmentSectionHead
              title={title}
              description={lead}
              className="lg:grid-cols-12 lg:gap-x-24 mb-10 md:mb-14"
              titleClassName="text-3xl md:text-5xl font-light leading-tight text-foreground lg:col-span-6"
              descriptionClassName="text-base font-light text-muted-foreground leading-relaxed lg:col-span-6"
            />
          ) : (
            <TreatmentSectionHead
              title={title}
              className="mb-8 md:mb-12 max-w-2xl"
            />
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
  faqSectionTitle,
  faqs,
}: Props) => {
  const expertAreasRef = useRef<HTMLDivElement>(null);
  const promisesRef = useRef<HTMLDivElement>(null);

  const heroMediaUrl = c.heroImage;
  const resolvedHero = resolveCmsMedia(c.heroMedia, {
    mediaType: c.heroVideo || (c.heroMedia as { mediaType?: string } | undefined)?.mediaType === "video"
      ? "video"
      : "image",
    imageUrl: c.heroImage,
    videoUrl: c.heroVideo,
    videoIsRemoteUrl: true,
  });


  const heroTitle = useMemo(() => parseHeroTitle(c.heroTitle), [c.heroTitle]);

  const insuranceSection = useMemo(
    () =>
      resolveTreatmentInsurance(pageSections, {
        eyebrow: c.insuranceEyebrow,
        title: c.insuranceTitle,
        partners: c.insurancePartners,
      }),
    [pageSections, c.insuranceEyebrow, c.insuranceTitle, c.insurancePartners],
  );

  const breadcrumbItems = useMemo(
    () => [
      { name: c.homeBreadcrumbLabel, path: "/" },
      ...(c.grandparent
        ? [{ name: c.grandparent.name, path: c.grandparent.path }]
        : []),
      { name: c.parent.name, path: c.parent.path },
      { name: c.title },
    ],
    [
      c.homeBreadcrumbLabel,
      c.grandparent,
      c.parent.name,
      c.parent.path,
      c.title,
    ],
  );

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <div className="bg-background">
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
      <header className="bg-brand-light pt-24 lg:pt-0">
        <h1 className="sr-only">{heroTitle}</h1>
        <div className="lg:hidden page-edge-text-left pb-4">
          <PageBreadcrumb items={breadcrumbItems} className="mb-4" />
          <p
            aria-hidden="true"
            className="text-4xl font-light text-foreground leading-[1.05] hyphens-auto [overflow-wrap:anywhere]"
          >
            {heroTitle}
          </p>
        </div>

        <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 split-hero">
          <div className="flex items-center page-edge-text-left py-10 lg:py-20">
            <div className="max-w-xl w-full">
            <PageBreadcrumb items={breadcrumbItems} className="hidden lg:flex mb-6" />
              <p
                aria-hidden="true"
                className="hidden lg:block text-4xl md:text-5xl lg:text-6xl font-light mb-5 text-foreground leading-[1.05] hyphens-auto [overflow-wrap:anywhere]"
              >
                {heroTitle}
              </p>
              {c.heroDescription ? (
                <p className="text-base md:text-lg font-light leading-relaxed mb-8 text-muted-foreground">
                  {c.heroDescription}
                </p>
              ) : null}

              {c.heroAvailability ? (
                <p className="mb-6 text-sm font-light text-foreground/70">{c.heroAvailability}</p>
              ) : null}

              {c.heroThemes && c.heroThemes.length > 0 ? (
                <div className="mb-6">
                  {c.themesAriaLabel?.trim() ? (
                    <p className="mb-2 text-sm font-light text-foreground/80">
                      {c.themesAriaLabel}
                    </p>
                  ) : null}
                  <ul
                    className="flex flex-wrap gap-1.5"
                    aria-label={c.themesAriaLabel?.trim() || undefined}
                  >
                    {c.heroThemes.map((theme) => (
                      <li
                        key={theme}
                        className="text-xs font-light text-foreground/70 border border-foreground/15 px-2 py-1 rounded-[var(--radius)]"
                      >
                        {theme}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="mb-8">
                {c.heroPrice ? (
                  <div className="mb-4 text-sm font-light text-foreground/80">
                    {c.heroPriceLabel ? (
                      <span className="block text-base text-foreground font-normal">
                        {c.heroPriceLabel}
                      </span>
                    ) : null}
                    <span className={c.heroPriceLabel ? "block text-muted-foreground" : "block text-base text-foreground"}>
                      {c.heroPrice}
                    </span>
                  </div>
                ) : null}

                <TreatmentCtaButtons
                  primaryLabel={c.primaryCtaLabel}
                  callLabel={c.callCtaLabel}
                  onPrimary={() => {
                    trackBookingMenuStart({
                      entry_point: "service_page_cta",
                      category: c.booking.kategori ?? null,
                      service_name: c.booking.tjeneste ?? null,
                    });
                    window.location.href = buildBookingUrl(c.booking);
                  }}
                />
                {!c.hideSeePriser ? (
                  <Link
                    to={c.seePricesHref}
                    className="inline-block mt-4 text-sm font-light text-foreground hover:text-foreground/70 border-b border-foreground/40 hover:border-foreground pb-0.5 transition-colors"
                  >
                    {c.seePricesLabel}
                  </Link>
                ) : null}
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

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-light text-foreground">
                {c.heroPoints.map((point) => (
                  <div key={point.title} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-foreground/80 flex-shrink-0" />
                    <span>{point.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {resolvedHero || c.heroVideo || heroMediaUrl ? (
            <SplitHeroMedia
              className="split-media bg-secondary/40"
              media={resolvedHero}
              video={!resolvedHero ? c.heroVideo : undefined}
              src={!resolvedHero ? heroMediaUrl : undefined}
              alt={c.heroImageAlt || ""}
              loading="eager"
            />
          ) : (
            <div className="split-media bg-secondary/40">
              <div className="absolute inset-0 bg-secondary" />
            </div>
          )}
        </div>
        <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
      </header>

      {c.relatedAsIntro && hasRelatedSection(c) ? (
        <RelatedBlock
          title={c.relatedTitle || ""}
          lead={c.relatedLead}
          items={c.related}
          readMoreLabel={c.expertReadMoreLabel}
        />
      ) : null}

      {hasSymptomsSection(c) ? (
        <ReasonsEditorial
          title={c.reasonsTitle}
          lead={c.reasonsLead}
          lead2={c.reasonsLead2}
          items={c.reasons}
        />
      ) : null}

      {hasProcessSection(c) ? (
        c.flowImage ? (
          <section className="bg-brand-light text-foreground">
            <h2 className="lg:hidden text-3xl font-light leading-tight text-foreground page-edge-text-left pt-12 pb-4">
              {c.flowTitle}
            </h2>
            <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 split-section">
              <div className="split-media bg-secondary/40">
                <AssetImg
                  src={c.flowImage}
                  alt={c.flowImageAlt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="px-6 md:px-16 lg:px-20 py-12 lg:py-20 flex items-center">
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
          <section className="bg-brand-light text-foreground py-10">
            <div className="page-shell">
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
        )
      ) : null}

      {hasExpertAreasSection(c) ? (
        <section className="bg-secondary/40 py-10">
          <div className="page-shell">
            <div className="max-w-6xl mx-auto">
              <TreatmentSectionHead
                title={c.expertAreas?.title ?? ""}
                description={c.expertAreas?.description}
                className="lg:grid-cols-12 lg:gap-x-24 mb-14"
                titleClassName="text-3xl md:text-5xl font-light leading-tight text-foreground lg:col-span-6"
                descriptionClassName="text-base font-light text-muted-foreground leading-relaxed lg:col-span-6"
              />
              <div
                ref={expertAreasRef}
                className="flex md:grid md:grid-cols-2 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide"
                style={{ scrollbarWidth: "none" }}
              >
                {(c.expertAreas?.items ?? []).map((area) => (
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
              {c.relatedSeeAll ? (
                <div className="mt-10 flex justify-start">
                  <Link
                    to={c.relatedSeeAll.href}
                    className="inline-flex items-center text-sm font-light text-foreground gap-2 hover:gap-2.5 transition-all border-b border-foreground/30 pb-1"
                  >
                    {c.relatedSeeAll.label}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {hasBenefitsSection(c) ? (
      <section className="bg-secondary/40 py-14 md:py-20">
        <div className="page-shell">
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
                        className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
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
      ) : null}

      {hasTextSection(c) ? (
        <section className="pt-14 md:pt-20 pb-10 bg-background">
          <div className="page-shell">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-16 lg:gap-28">
              <div className="lg:col-span-5">
                <div className="lg:sticky lg:top-28">
                  {c.textSection.title ? (
                    <TreatmentSectionHead
                      title={c.textSection.title}
                      description={c.textSection.lead}
                      titleClassName="text-3xl md:text-4xl lg:text-5xl font-light text-foreground leading-[1.1]"
                    />
                  ) : c.textSection.lead ? (
                    <p className="text-base font-light text-muted-foreground leading-relaxed">
                      {c.textSection.lead}
                    </p>
                  ) : null}
                  {c.textSection.image ? (
                    <div className="relative mt-8 aspect-[4/5] overflow-hidden bg-secondary rounded-sm">
                      <AssetImg
                        src={c.textSection.image}
                        alt={c.textSection.imageAlt}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="lg:col-span-7">
                {c.textSection.points && c.textSection.points.length > 0 ? (
                  <div className="border-t border-border/60">
                    {c.textSection.points.map((point, i) => (
                      <div key={i} className="border-b border-border/60">
                        <h3 className="py-6 text-left text-lg md:text-xl font-normal text-foreground leading-snug">
                          {point.title}
                        </h3>
                        <div className="pb-8 text-sm md:text-base font-light text-muted-foreground leading-relaxed space-y-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_li]:marker:text-foreground/40">
                          <p>{point.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* FAQ — dual-read is resolved in treatment-data; hidden when empty. */}
      {hasFaqSection(faqs) ? (
        <FaqSection
          faqs={(faqs ?? []).map((faq, index) => ({
            id: `treatment-faq-${index}`,
            question: faq.question,
            answer: faq.answer,
          }))}
          title={faqSectionTitle?.trim() || undefined}
          sectionClassName="py-14 md:py-20"
        />
      ) : null}

      <PageSectionsRenderer
        sections={filterMeaningfulPageSections(
          pageSections?.filter(
            (s) =>
              s._type !== "pageSectionBookingCta" &&
              s._type !== "pageSectionSpecialists" &&
              s._type !== "pageSectionInsurance",
          ),
        )}
      />

      {/* MID-PAGE CONVERSION BAND — CMS heading + mid-page button labels */}
      {hasMidCtaSection(c) ? (
      <section className="bg-brand-light text-foreground py-10 border-t border-brand-dark/10">
        <div className="page-shell">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-3xl">
              <TreatmentSectionHead
                title={c.conversationCtaTitle || c.ctaTitle || ""}
                description={c.ctaDescription}
                titleClassName="text-xl md:text-3xl font-light leading-tight"
                descriptionClassName="text-sm md:text-base font-light text-muted-foreground leading-relaxed"
              />
            </div>
            <TreatmentCtaButtons
              primaryLabel={
                c.midCtaPrimaryLabel || c.primaryCtaLabel || c.callCtaLabel
              }
              callLabel={
                c.midCtaShowCallButton === false
                  ? undefined
                  : c.midCtaCallLabel || c.callCtaLabel
              }
              onPrimary={() => {
                trackBookingMenuStart({
                  entry_point: "service_page_cta",
                  category: c.booking.kategori ?? null,
                  service_name: c.booking.tjeneste ?? null,
                });
                window.location.href = buildBookingUrl(c.booking);
              }}
              className="w-full md:w-auto"
            />
          </div>
        </div>
      </section>
      ) : null}

      {/* Demo order: mid-CTA → reviews → specialists → insurance → Relaterte → booking */}
      <CategoryReviews
        categoryId={c.booking.kategori}
        categoryTitle={c.parent.name}
        sectionTitle={c.reviewsSectionTitle}
        curatedReviews={[
          ...(c.googleReviews || []),
          ...(c.legelistenReviews || []),
        ]}
      />

      {(() => {
        const specialistsSections = filterMeaningfulPageSections(
          pageSections?.filter((s) => s._type === "pageSectionSpecialists"),
        );
        return specialistsSections.length > 0 ? (
          <PageSectionsRenderer
            sections={specialistsSections}
            specialistsLayoutVariant="category"
          />
        ) : null;
      })()}

      {insuranceSection && hasInsuranceSection(insuranceSection) ? (
        <PageSectionInsuranceBlock config={insuranceSection} compact />
      ) : null}

      {hasRelatedSection(c) && !c.relatedAsIntro ? (
        <RelatedServicesCarousel
          title={c.relatedTitle || ""}
          items={c.related}
          seeAll={c.relatedSeeAll ?? null}
          scrollLeftLabel={c.scrollLeftLabel}
          scrollRightLabel={c.scrollRightLabel}
        />
      ) : null}

      {(() => {
        // Keep hardcoded fallback until Booking CTA bands are seeded on all
        // treatments (see docs/BOOKING_CTA_FALLBACK_AUDIT.md — 17 prod / 1 dev).
        const bookingCtaSections = filterMeaningfulPageSections(
          pageSections?.filter((s) => s._type === "pageSectionBookingCta"),
        );
        if (bookingCtaSections.length > 0) {
          return <PageSectionsRenderer sections={bookingCtaSections} />;
        }
        return <BookingCTA bookingCategoryId={c.booking.kategori} />;
      })()}

      </div>
    </PageLayout>
  );
};

export default SubTreatmentLayout;
