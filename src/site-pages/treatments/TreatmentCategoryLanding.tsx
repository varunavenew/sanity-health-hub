"use client";

import { AssetImg } from "@/components/AssetImg";
import { useRef } from "react";
import { Link } from "@/lib/router";
import { ArrowRight, Check, Star, Quote, User, Users, Clock } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { combineGeoJsonLd, medicalWebPageJsonLd } from "@/lib/seo/geo-jsonld";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { buildBookingUrl } from "@/lib/bookingLinks";
import { SymptomServiceSection } from "@/components/treatments/SymptomServiceSection";
import { TagList } from "@/components/treatments/TagList";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { ScrollArrows } from "@/components/ui/ScrollArrows";
import { useTreatmentCategory } from "@/hooks/useSanity";
import type {
  CategoryLandingAudience,
  CategoryLandingExpertArea,
  CategoryLandingSegment,
  CategoryLandingSpotlight,
  CategoryLandingStep,
} from "@/lib/sanity/category-data";
import type { CategoryLandingPageProps } from "@/lib/behandlinger/create-category-landing-page";
import {
  segmentTileGridClass,
  statsGridClass,
  threeCardGridClass,
} from "@/lib/ui/grid-cols-for-count";
import { AnimatedStat } from "@/components/AnimatedStat";

export type TreatmentCategoryLandingProps = CategoryLandingPageProps & {
  categoryId: string;
};

const SegmentCoupleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...props}>
    <circle cx="32" cy="40" r="13" />
    <circle cx="48" cy="40" r="13" />
  </svg>
);

const SegmentHorizonIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="48" x2="68" y2="48" />
    <path d="M20 48 A20 20 0 0 1 60 48" />
    <line x1="40" y1="30" x2="40" y2="24" />
  </svg>
);

const SegmentArchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...props}>
    <circle cx="40" cy="48" r="10" />
    <path d="M18 40 Q40 14 62 40" />
  </svg>
);

const AUDIENCE_ICONS: Record<
  Exclude<CategoryLandingAudience["icon"], "">,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  couple: SegmentCoupleIcon,
  horizon: SegmentHorizonIcon,
  arch: SegmentArchIcon,
  user: User,
  users: Users,
  clock: Clock,
};

function ExpertAreaCards({
  areas,
  layout,
  readMoreLabel,
  scrollRef,
}: {
  areas: CategoryLandingExpertArea[];
  layout: "grid" | "carousel";
  readMoreLabel: string;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const isCarousel = layout === "carousel";
  return (
    <>
      <div
        ref={scrollRef}
        className={
          isCarousel
            ? "flex md:grid md:grid-cols-2 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide"
            : "grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
        }
        style={{ scrollbarWidth: "none" }}
      >
        {areas.map((a, index) => (
          <Link
            key={`${a.title || "area"}-${index}`}
            to={a.href}
            className={`bg-background rounded-sm border border-border/40 flex flex-col group hover:border-foreground/30 transition-colors overflow-hidden ${
              isCarousel ? "shrink-0 w-[78vw] md:w-auto snap-center" : ""
            }`}
          >
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-secondary">
              {a.image ? (
                <AssetImg
                  src={a.image}
                  alt={a.imageAlt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              ) : null}
            </div>
            <div className="p-7 flex flex-col flex-1">
              <h3 className="text-xl font-light text-foreground mb-3">{a.title}</h3>
              <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">
                {a.desc}
              </p>
              <span className="inline-flex items-center text-sm font-light text-foreground gap-2 group-hover:gap-2.5 transition-all">
                {readMoreLabel}
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
      {isCarousel && scrollRef ? <ScrollArrows scrollRef={scrollRef} /> : null}
    </>
  );
}

function SegmentAccordionContent({ segment }: { segment: CategoryLandingSegment }) {
  const links =
    segment.tagLinks.length > 0
      ? segment.tagLinks
      : segment.tags.map((label) => ({ label, href: "" }));

  return (
    <div className="pb-2">
      <p className="text-sm font-light text-muted-foreground leading-relaxed mb-5">
        {segment.desc}
      </p>
      {links.length > 0 ? (
        <div className="mb-5">
          {links.map((tag, index) =>
            tag.href ? (
              <Link
                key={`${tag.label}-${tag.href}-${index}`}
                to={tag.href}
                className="group flex items-center justify-between py-2.5 text-sm font-light text-foreground hover:text-foreground/60 transition-colors border-b border-border/30 last:border-b-0"
              >
                <span>{tag.label}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-muted-foreground" />
              </Link>
            ) : (
              <div
                key={`${tag.label}-${index}`}
                className="py-2.5 text-sm font-light text-foreground border-b border-border/30 last:border-b-0"
              >
                {tag.label}
              </div>
            ),
          )}
        </div>
      ) : null}
      {segment.href ? (
        <Link
          to={segment.href}
          className="inline-flex items-center text-sm font-light text-foreground hover:gap-2.5 gap-2 transition-all pb-2"
        >
          {segment.cta}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      ) : null}
    </div>
  );
}

function PatientJourneySection({
  title,
  description,
  steps,
  ctaLabel,
  ctaHref,
  bookingParams,
}: {
  title: string;
  description: string;
  steps: CategoryLandingStep[];
  ctaLabel: string;
  ctaHref: string;
  bookingParams: { kategori: string; tjeneste?: string };
}) {
  if (steps.length === 0) return null;

  const ctaTarget =
    ctaHref ||
    buildBookingUrl(bookingParams);

  return (
    <section className="bg-background">
      <div className="container mx-auto px-6 md:px-16 py-20 md:py-28">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-14 lg:gap-24">
          <div className="lg:col-span-5">
            {title ? (
              <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-8">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="text-base font-light text-muted-foreground leading-relaxed mb-10 max-w-md">
                {description}
              </p>
            ) : null}
            {ctaLabel ? (
              <Button
                variant="cta"
                size="lg"
                className="px-8"
                onClick={() => {
                  window.location.href = ctaTarget;
                }}
              >
                {ctaLabel}
              </Button>
            ) : null}
          </div>
          <div className="lg:col-span-7">
            <div className="divide-y divide-border/60 border-t border-border/60">
              {steps.map((step, index) => (
                <div key={`${step.n || "step"}-${step.title || ""}-${index}`} className="grid grid-cols-12 gap-4 py-6">
                  <div className="col-span-2 md:col-span-1 text-xs font-light text-foreground/60 pt-1">
                    {step.n}
                  </div>
                  <div className="col-span-10 md:col-span-11">
                    <h3 className="text-base font-normal text-foreground mb-1.5">{step.title}</h3>
                    <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-md">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SpotlightSection({ spotlight }: { spotlight: CategoryLandingSpotlight }) {
  if (!spotlight.title && !spotlight.text) return null;

  return (
    <section className="bg-background">
      <div className="grid lg:grid-cols-2 min-h-[420px]">
        <div className="flex items-center px-6 md:px-16 lg:px-20 py-16 lg:py-24 order-2 lg:order-1">
          <div className="max-w-xl">
            <h2 className="text-3xl md:text-4xl font-light text-foreground leading-tight mb-6">
              {spotlight.title}
              {spotlight.titleEmphasis ? (
                <span className="italic"> {spotlight.titleEmphasis}</span>
              ) : null}
            </h2>
            {spotlight.text ? (
              <p className="text-base font-light text-muted-foreground leading-relaxed mb-8">
                {spotlight.text}
              </p>
            ) : null}
            {spotlight.ctaHref ? (
              <Link
                to={spotlight.ctaHref}
                className="inline-flex items-center gap-2 text-sm font-light text-foreground hover:gap-2.5 transition-all"
              >
                {spotlight.ctaLabel}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : null}
          </div>
        </div>
        {spotlight.image ? (
          <div className="relative min-h-[320px] lg:min-h-full order-1 lg:order-2">
            <AssetImg
              src={spotlight.image}
              alt={spotlight.imageAlt}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

const TreatmentCategoryLanding = ({
  isChatOpen,
  categoryId,
  sanityLang = "no",
}: TreatmentCategoryLandingProps) => {
  const { data: category, isPending } = useTreatmentCategory(categoryId);
  const landing = category?.landingPage;
  const heroImage = category?.heroImage;
  const heroVideo = category?.heroVideo;
  const loadingLabel = category?.loadingLabel || "";
  const expertAreasRef = useRef<HTMLDivElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);

  if (isPending) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-[40vh] flex items-center justify-center">
          <p className="text-muted-foreground font-light" aria-live="polite">
            {loadingLabel}
          </p>
        </div>
      </PageLayout>
    );
  }

  if (!landing) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-[40vh] flex items-center justify-center px-6 text-center">
          <p className="text-muted-foreground font-light max-w-md" aria-live="polite">
            {category?.missingLandingMessage}
          </p>
        </div>
      </PageLayout>
    );
  }

  const {
    hero,
    segmentsSection,
    whySection,
    expertAreasSection,
    supportSection,
    journeySection,
    spotlightSection,
    audiencesSection,
    symptomsSection,
    servicesSection,
    resultsSection,
    reviewsSection,
  } = landing;

  const serviceGroups = servicesSection.groups;

  const stats = category?.stats?.length ? category.stats : [];

  const locale = sanityLang === "en" ? "en" : "nb";
  const categoryPath = category?.slug ? `/${category.slug}` : "";
  const categoryTitle = category?.title || "";
  const summaryText = category?.geoSummary?.trim() || "";
  const geoJsonLd = combineGeoJsonLd(
    medicalWebPageJsonLd({
      name: hero.heading,
      description: summaryText.slice(0, 320),
      url: categoryPath,
      inLanguage: locale === "en" ? "en" : "nb-NO",
    }),
  );

  const hasHeroMedia = Boolean(heroVideo || heroImage);
  const bookingParams = {
    kategori: categoryId,
    ...(hero.primaryBookingService ? { tjeneste: hero.primaryBookingService } : {}),
  };

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <JsonLd data={geoJsonLd.length === 1 ? geoJsonLd[0] : geoJsonLd} />
      <h1 className="sr-only">{landing.srOnlyTitle}</h1>

      {/* Hero */}
      <header className="bg-brand-light pt-24 lg:pt-0">
        <div className="lg:hidden px-6 md:px-16 pb-4">
          <nav aria-label="breadcrumb" className="text-xs font-light text-foreground/60 flex items-center gap-2 mb-4">
            <Link to="/" className="hover:text-foreground">
              {landing.breadcrumbHomeLabel}
            </Link>
            <span aria-hidden="true">›</span>
            <span className="text-foreground/80">{categoryTitle}</span>
          </nav>
          <h2 className="text-4xl font-light text-foreground leading-[1.05]">
            {hero.heading}
            {hero.headingEmphasis ? (
              <span className="block italic">{hero.headingEmphasis}</span>
            ) : null}
          </h2>
        </div>

        <div
          className={`flex flex-col-reverse ${hasHeroMedia ? "lg:grid lg:grid-cols-2" : ""} lg:min-h-[720px]`}
        >
          <div className="flex items-center px-6 md:px-16 lg:px-20 py-16 lg:py-24">
            <div className="max-w-xl w-full">
              <nav
                aria-label="breadcrumb"
                className="hidden lg:flex text-xs font-light text-foreground/60 items-center gap-2 mb-8 lg:mb-10"
              >
                <Link to="/" className="hover:text-foreground">
                  {landing.breadcrumbHomeLabel}
                </Link>
                <span aria-hidden="true">›</span>
                <span className="text-foreground/80">{categoryTitle}</span>
              </nav>

              <h2 className="hidden lg:block text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
                {hero.heading}
                {hero.headingEmphasis ? (
                  <span className="block italic">{hero.headingEmphasis}</span>
                ) : null}
              </h2>

              {hero.body ? (
                <p className="text-base md:text-lg font-light leading-relaxed mb-10 text-muted-foreground whitespace-pre-line">
                  {hero.body}
                </p>
              ) : null}

              {hero.entryPriceLabel && hero.entryPriceValue ? (
                <div className="mb-4 text-sm font-light text-foreground/80">
                  <span className="block text-base text-foreground">{hero.entryPriceLabel}</span>
                  <span className="block">{hero.entryPriceValue}</span>
                </div>
              ) : null}

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-10">
                <Button
                  variant="cta"
                  size="lg"
                  className="px-8 w-full sm:w-auto"
                  onClick={() => {
                    window.location.href = buildBookingUrl(bookingParams);
                  }}
                >
                  {hero.primaryCtaLabel}
                </Button>
                <CallUsClinicPicker
                  variant="light"
                  label={hero.secondaryCtaLabel}
                />
              </div>

              {hero.bullets.length > 0 ? (
                <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-light text-foreground">
                  {hero.bullets.map((u, index) => (
                    <li key={`${u}-${index}`} className="inline-flex items-center gap-2">
                      <Check className="w-4 h-4 text-foreground" aria-hidden="true" />
                      <span>{u}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          {hasHeroMedia ? (
            <div className="relative min-h-[420px] lg:min-h-full">
              {heroVideo ? (
                <video
                  src={heroVideo}
                  poster={heroImage}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : heroImage ? (
                <AssetImg
                  src={heroImage}
                  alt={hero.heroImageAlt}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
      </header>

      {/* Segments — accordion or grid */}
      {segmentsSection.segments.length > 0 ? (
        <section className="bg-brand-light text-foreground py-20 md:py-28">
          <div className="container mx-auto px-6 md:px-16">
            <div
              className={`mx-auto ${
                segmentsSection.layout === "grid" ? "max-w-6xl" : "max-w-3xl"
              }`}
            >
              <div className="max-w-2xl mb-10">
                {segmentsSection.eyebrow ? (
                  <p className="text-xs tracking-wide text-foreground/60 mb-4">
                    {segmentsSection.eyebrow}
                  </p>
                ) : null}
                <h2 className="text-3xl md:text-5xl font-light leading-tight">
                  {segmentsSection.title}
                  {segmentsSection.titleLine2 ? (
                    <span className="block">{segmentsSection.titleLine2}</span>
                  ) : null}
                </h2>
              </div>

              {segmentsSection.layout === "grid" ? (
                <div
                  className={`${segmentTileGridClass(segmentsSection.segments.length)} gap-px bg-brand-dark/10 rounded-sm overflow-hidden`}
                >
                  {segmentsSection.segments.map((s, index) => (
                    <div key={`${s.id || "segment"}-${index}`} className="bg-background p-7 flex flex-col">
                      <h3 className="text-lg font-normal mb-4 leading-snug">{s.title}</h3>
                      <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">
                        {s.desc}
                      </p>
                      {s.tagLinks.length > 0 || s.tags.length > 0 ? (
                        <TagList
                          tags={
                            s.tagLinks.length > 0
                              ? s.tagLinks.map((t) => t.label)
                              : s.tags
                          }
                          initialVisible={3}
                          className="mb-5"
                        />
                      ) : null}
                      {s.href ? (
                        <Link
                          to={s.href}
                          className="inline-flex items-center text-sm font-light text-foreground hover:text-foreground/70 hover:gap-2.5 gap-2 transition-all"
                        >
                          {s.cta}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {segmentsSection.segments.map((p, index) => (
                    <AccordionItem
                      key={`${p.id || p.title}-${index}`}
                      value={p.id || p.title}
                      className="border-b border-border/30"
                    >
                      <AccordionTrigger className="text-left text-base md:text-lg font-normal py-5 hover:no-underline [&[data-state=open]>svg]:rotate-180">
                        <span className="pr-4">{p.title}</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <SegmentAccordionContent segment={p} />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* Why us */}
      {whySection.steps.length > 0 ? (
        <section className="bg-background">
          <div className="grid lg:grid-cols-12">
            <div className="lg:col-span-7 px-6 md:px-16 lg:px-20 py-14 lg:py-20">
              <div className="max-w-xl">
                {whySection.eyebrow ? (
                  <p className="text-xs tracking-wide text-foreground/60 mb-5">{whySection.eyebrow}</p>
                ) : null}
                <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-[1.1] text-foreground mb-6">
                  {whySection.title}
                </h2>
                {whySection.description ? (
                  <p className="text-base font-light text-muted-foreground leading-relaxed mb-12 whitespace-pre-line">
                    {whySection.description}
                  </p>
                ) : null}

                <div className="divide-y divide-border/60 border-t border-border/60">
                  {whySection.steps.map((step, index) => (
                    <div key={`${step.n || "step"}-${index}`} className="grid grid-cols-12 gap-4 py-6">
                      <div className="col-span-2 md:col-span-1 text-xs font-light text-foreground/60 pt-1">
                        {step.n}
                      </div>
                      <div className="col-span-10 md:col-span-11">
                        <h3 className="text-base font-normal text-foreground mb-1.5">{step.title}</h3>
                        <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-md">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {whySection.footerLinkHref ? (
                  <Link
                    to={whySection.footerLinkHref}
                    className="inline-flex items-center gap-2 mt-10 text-sm font-light text-foreground hover:gap-2.5 hover:text-foreground/70 transition-all"
                  >
                    {whySection.footerLinkLabel}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="lg:col-span-5 relative bg-secondary/40 h-[320px] md:h-[420px] lg:h-full overflow-hidden">
              {whySection.image ? (
                <AssetImg
                  src={whySection.image}
                  alt={whySection.imageAlt}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* Audiences */}
      {audiencesSection.audiences.length > 0 ? (
        <section className="bg-secondary/40 py-14 md:py-20">
          <div className="container mx-auto px-6 md:px-16">
            <div className="max-w-6xl mx-auto">
              <div className="max-w-2xl mb-14">
                {audiencesSection.eyebrow ? (
                  <p className="text-xs tracking-wide text-foreground/60 mb-4">
                    {audiencesSection.eyebrow}
                  </p>
                ) : null}
                <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
                  {audiencesSection.title}
                  {audiencesSection.titleAccent ? (
                    <>
                      <br />
                      <span className="text-foreground/70">{audiencesSection.titleAccent}</span>
                    </>
                  ) : null}
                </h2>
              </div>

              <div className={`${threeCardGridClass(audiencesSection.audiences.length)} gap-4 md:gap-6`}>
                {audiencesSection.audiences.map((a) => {
                  const Icon = a.icon ? AUDIENCE_ICONS[a.icon] : null;
                  return (
                    <div
                      key={a.title}
                      className="bg-background rounded-sm border border-border/40 flex flex-col p-7"
                    >
                      <div className="mb-6 text-foreground/80">
                        {Icon ? (
                          <Icon className="w-6 h-6" strokeWidth={1.25} aria-hidden="true" />
                        ) : null}
                      </div>
                      <h3 className="text-lg font-normal text-foreground mb-3">{a.title}</h3>
                      <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">
                        {a.desc}
                      </p>
                      {a.href ? (
                        <Link
                          to={a.href}
                          className="inline-flex items-center text-sm font-light text-foreground hover:text-foreground/70 hover:gap-2.5 gap-2 transition-all self-start"
                        >
                          {audiencesSection.readMoreLabel}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Expert areas */}
      {expertAreasSection.areas.length > 0 ? (
        <section className="bg-secondary/40 py-20 md:py-28">
          <div className="container mx-auto px-6 md:px-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-12 gap-14 lg:gap-24 mb-14">
                <div className="lg:col-span-6">
                  {expertAreasSection.eyebrow ? (
                    <p className="text-xs tracking-wide text-foreground/60 mb-4">
                      {expertAreasSection.eyebrow}
                    </p>
                  ) : null}
                  <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
                    {expertAreasSection.title}
                  </h2>
                </div>
                <div className="lg:col-span-6 lg:pt-3">
                  {expertAreasSection.description ? (
                    <p className="text-base font-light text-muted-foreground leading-relaxed">
                      {expertAreasSection.description}
                    </p>
                  ) : null}
                </div>
              </div>

              <ExpertAreaCards
                areas={expertAreasSection.areas}
                layout={expertAreasSection.layout}
                readMoreLabel={expertAreasSection.readMoreLabel}
                scrollRef={expertAreasRef}
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* Symptoms */}
      {symptomsSection.items.length > 0 ? (
        <SymptomServiceSection
          background="background"
          eyebrow={symptomsSection.eyebrow}
          title={symptomsSection.title}
          description={symptomsSection.description}
          items={symptomsSection.items.map((item) => ({
            symptom: item.symptom,
            service: item.service,
            href: item.href,
            image: item.image,
            imageAlt: item.imageAlt,
          }))}
        />
      ) : null}

      {/* Stats */}
      {stats.length > 0 ? (
        <section className="bg-brand-light text-foreground pt-20 md:pt-28 pb-12 md:pb-16 border-t border-brand-dark/5">
          <div className="container mx-auto px-6 md:px-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-12 gap-14 lg:gap-24 mb-14">
                <div className="lg:col-span-5">
                  {resultsSection.eyebrow ? (
                    <p className="text-xs tracking-wide text-foreground/60 mb-4 uppercase">
                      {resultsSection.eyebrow}
                    </p>
                  ) : null}
                  <h2 className="text-3xl md:text-5xl font-light leading-tight">
                    {resultsSection.title}
                  </h2>
                </div>
                <div className="lg:col-span-7 flex items-end">
                  {resultsSection.description ? (
                    <p className="text-base font-light text-muted-foreground leading-relaxed max-w-xl">
                      {resultsSection.description}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="border-t border-brand-dark/5 py-8 md:py-10">
                {resultsSection.categoryLabel ? (
                  <p className="text-[11px] tracking-[0.18em] text-brand-dark mb-6 uppercase">
                    {resultsSection.categoryLabel}
                  </p>
                ) : null}
                <dl
                  className={`${statsGridClass(stats.length)} gap-y-8 md:gap-y-0 md:divide-x divide-brand-dark/15`}
                >
                  {stats.map((row, i) => (
                    <div
                      key={row.label}
                      className={`md:px-8 ${i === 0 ? "md:pl-0" : ""} ${i === stats.length - 1 ? "md:pr-0" : ""}`}
                    >
                      <dd className="text-3xl md:text-4xl font-light tracking-tight leading-none mb-3">
                        <AnimatedStat value={row.value} />
                      </dd>
                      <dt className="text-sm font-normal text-foreground mb-1">{row.label}</dt>
                      {row.sub ? (
                        <p className="text-xs font-light text-muted-foreground">{row.sub}</p>
                      ) : null}
                    </div>
                  ))}
                </dl>
              </div>

              {resultsSection.footnote ? (
                <p className="text-xs font-light text-muted-foreground mt-8">
                  {resultsSection.footnote}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}

      {/* Services — grouped list */}
      {serviceGroups.length > 0 ? (
        <section className="bg-brand-light text-foreground pt-20 md:pt-28 pb-16 md:pb-20">
          <div className="container mx-auto px-6 md:px-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-12 gap-14 lg:gap-24 mb-14">
                <div className="lg:col-span-6">
                  <h2 className="text-3xl md:text-5xl font-light leading-tight">
                    {servicesSection.title}
                  </h2>
                </div>
                <div className="lg:col-span-6 lg:pt-3">
                  {servicesSection.description ? (
                    <p className="text-base font-light text-muted-foreground leading-relaxed">
                      {servicesSection.description}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-12">
                {serviceGroups.map((group, index) => (
                  <div key={`${group.label || "group"}-${index}`}>
                    <p className="text-xs font-light text-foreground/60 mb-4">{group.label}</p>
                    <ul className="border-t border-brand-dark/10">
                      {group.items.map((s, idx) => (
                        <li key={`${s.title || "service"}-${idx}`} className="border-b border-brand-dark/10">
                          <Link
                            to={s.href}
                            className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_1fr_auto] items-baseline gap-4 sm:gap-8 py-5 group"
                          >
                            <h3 className="text-base font-normal text-foreground group-hover:text-foreground/70 transition-colors">
                              {s.title}
                            </h3>
                            {s.desc ? (
                              <p className="hidden sm:block text-sm font-light text-muted-foreground leading-snug">
                                {s.desc}
                              </p>
                            ) : null}
                            <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:text-foreground transition-colors" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Support services (e.g. psykologi / sexologi) */}
      {supportSection.areas.length > 0 ? (
        <section className="bg-brand-light py-14 md:py-20">
          <div className="container mx-auto px-6 md:px-16">
            <div className="max-w-6xl mx-auto">
              <div className="max-w-2xl mb-10">
                {supportSection.title ? (
                  <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
                    {supportSection.title}
                  </h2>
                ) : null}
                {supportSection.description ? (
                  <p className="text-base font-light text-muted-foreground leading-relaxed mt-6">
                    {supportSection.description}
                  </p>
                ) : null}
              </div>
              <ExpertAreaCards
                areas={supportSection.areas}
                layout="grid"
                readMoreLabel={supportSection.readMoreLabel}
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* Reviews */}
      {reviewsSection.reviews.length > 0 ? (
        <section className="bg-brand-warm pt-10 md:pt-12 pb-14 md:pb-16">
          <div className="container mx-auto px-6 md:px-16">
            <div className="max-w-6xl mx-auto">
              <div className="max-w-xl mb-10">
                {reviewsSection.eyebrow ? (
                  <p className="text-sm text-brand-dark/60 font-light mb-3">{reviewsSection.eyebrow}</p>
                ) : null}
                <h2 className="text-2xl md:text-3xl font-light text-brand-dark leading-tight">
                  {reviewsSection.title}
                </h2>
              </div>
              <div
                ref={reviewsRef}
                className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 md:mx-0 px-4 md:px-0 scrollbar-hide"
                style={{ scrollbarWidth: "none" }}
              >
                {reviewsSection.reviews.map((r, i) => (
                  <div
                    key={i}
                    className="group relative p-8 rounded-sm bg-white border border-brand-dark/10 hover:border-brand-dark/20 hover:shadow-lg transition-all duration-300 shrink-0 w-[78vw] md:w-auto snap-center"
                  >
                    <Quote className="absolute top-6 right-6 w-8 h-8 text-brand-dark/10 rotate-180" />
                    <div className="flex mb-4">
                      {[0, 1, 2, 3, 4].map((s) => (
                        <Star key={s} className="w-4 h-4 fill-[#FFC107] text-[#FFC107]" />
                      ))}
                    </div>
                    <p className="text-brand-dark font-light leading-relaxed mb-6 text-base">
                      &ldquo;{r.text}&rdquo;
                    </p>
                    <div className="pt-4 border-t border-brand-dark/10 flex items-center justify-between">
                      <div>
                        <p className="text-brand-dark font-normal text-sm">{r.author}</p>
                        <p className="text-xs text-brand-dark/60 font-light">{r.date}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-brand-dark/75">
                        <span>Google</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <ScrollArrows scrollRef={reviewsRef} />
            </div>
          </div>
        </section>
      ) : null}

      {spotlightSection ? <SpotlightSection spotlight={spotlightSection} /> : null}

      <PageSectionsRenderer sections={category?.pageSections} />

      {journeySection.steps.length > 0 ? (
        <PatientJourneySection
          title={journeySection.title}
          description={journeySection.description}
          steps={journeySection.steps}
          ctaLabel={journeySection.ctaLabel}
          ctaHref={journeySection.ctaHref}
          bookingParams={bookingParams}
        />
      ) : null}
    </PageLayout>
  );
};

export default TreatmentCategoryLanding;
