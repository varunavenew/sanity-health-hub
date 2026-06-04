"use client";

import { AssetImg } from "@/components/AssetImg";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router";
import { ArrowRight, Check, Star, Quote } from "lucide-react";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { buildBookingUrl } from "@/lib/bookingLinks";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import { ServicesListSection } from "@/components/layout/ServicesListSection";
import { SymptomServiceSection } from "@/components/treatments/SymptomServiceSection";
import { TagList } from "@/components/treatments/TagList";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { useTreatmentCategory } from "@/hooks/useSanity";
import type { CategoryLandingAudience } from "@/lib/sanity/category-data";
import type { CategoryLandingPageProps } from "@/lib/behandlinger/create-category-landing-page";

import fertilityHeroFallback from "@/assets/categories/fertilitet-real.jpg";
import gynekologiHeroFallback from "@/assets/categories/gynekologi.jpg";
import urologiHeroFallback from "@/assets/categories/urologi.jpg";
import ortopediHeroFallback from "@/assets/categories/ortopedi.jpg";
import graviditetHeroFallback from "@/assets/hero/hero-pregnancy.jpg";
import flereFagomraderHeroFallback from "@/assets/categories/flere-fagomrader.jpg";
import heroClinicLounge from "@/assets/hero/hero-clinic-lounge.jpg";
import { AnimatedStat } from "@/components/AnimatedStat";
import type { ImageRef } from "@/lib/media";

const CATEGORY_HERO_FALLBACK: Record<string, ImageRef> = {
  fertilitet: fertilityHeroFallback,
  gynekologi: gynekologiHeroFallback,
  urologi: urologiHeroFallback,
  ortopedi: ortopediHeroFallback,
  graviditet: graviditetHeroFallback,
  "flere-fagomrader": flereFagomraderHeroFallback,
};

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
  CategoryLandingAudience["icon"],
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  couple: SegmentCoupleIcon,
  horizon: SegmentHorizonIcon,
  arch: SegmentArchIcon,
};

const TreatmentCategoryLanding = ({
  isChatOpen,
  categoryId,
}: TreatmentCategoryLandingProps) => {
  const { t } = useTranslation();
  const { data: category, isPending } = useTreatmentCategory(categoryId);
  const landing = category?.landingPage;
  const fallbackHero = CATEGORY_HERO_FALLBACK[categoryId] ?? fertilityHeroFallback;

  const heroImage = category?.heroImage || fallbackHero;

  if (isPending) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-[40vh] flex items-center justify-center">
          <p className="text-muted-foreground font-light">{t("common.loading")}</p>
        </div>
      </PageLayout>
    );
  }

  if (!landing) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-[40vh] flex items-center justify-center px-6 text-center">
          <p className="text-muted-foreground font-light max-w-md">
            {category?.title || categoryId}: landing content is not configured in Sanity yet (Behandlingskategori → Landingsside).
          </p>
        </div>
      </PageLayout>
    );
  }

  const { hero, segmentsSection, whySection, audiencesSection, symptomsSection, servicesSection, resultsSection, reviewsSection, specialistsSection } =
    landing;

  const services =
    category?.treatments?.length
      ? category.treatments.map((s) => ({
          title: s.title,
          desc: s.desc,
          href: s.href,
        }))
      : [];

  const stats = category?.stats?.length ? category.stats : [];

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <h1 className="sr-only">{landing.srOnlyTitle || hero.heading}</h1>

      <header className="bg-brand-light pt-24 lg:pt-0">
        <div className="grid lg:grid-cols-2 min-h-[640px] lg:min-h-[720px]">
          <div className="flex items-center px-6 md:px-16 lg:px-20 py-16 lg:py-24">
            <div className="max-w-xl w-full">
              {hero.eyebrow ? (
                <p className="text-xs tracking-wide text-foreground/60 mb-8">{hero.eyebrow}</p>
              ) : null}

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
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

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-10">
                <Button
                  variant="cta"
                  size="lg"
                  className="px-8 w-full sm:w-auto"
                  onClick={() =>
                    (window.location.href = buildBookingUrl({ kategori: categoryId }))
                  }
                >
                  {hero.primaryCtaLabel || t("cta.bookConsultation")}
                </Button>
                <CallUsClinicPicker
                  variant="light"
                  label={hero.secondaryCtaLabel || t("booking.callUs")}
                />
              </div>

              {hero.bullets.length > 0 ? (
                <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-light text-foreground">
                  {hero.bullets.map((u) => (
                    <li key={u} className="inline-flex items-center gap-2">
                      <Check className="w-4 h-4 text-foreground" aria-hidden="true" />
                      <span>{u}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-full">
            <AssetImg
              src={heroImage}
              alt={hero.heroImageAlt || category?.title || "CMedical"}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
      </header>

      {segmentsSection.segments.length > 0 ? (
        <section className="bg-brand-light text-foreground py-20 md:py-28">
          <div className="container mx-auto px-6 md:px-16">
            <div className="max-w-6xl mx-auto">
              <div className="max-w-2xl mb-14">
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

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-brand-dark/10 rounded-sm overflow-hidden">
                {segmentsSection.segments.map((s) => (
                  <div key={s.id} className="bg-background p-7 flex flex-col">
                    <h3 className="text-lg font-normal mb-4 leading-snug">{s.title}</h3>
                    <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">
                      {s.desc}
                    </p>
                    {s.tags.length > 0 ? (
                      <TagList tags={s.tags} initialVisible={3} className="mb-5" />
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
            </div>
          </div>
        </section>
      ) : null}

      {whySection.steps.length > 0 ? (
        <section className="bg-background">
          <div className="grid lg:grid-cols-12">
            <div className="lg:col-span-7 px-6 md:px-16 lg:px-20 py-20 lg:py-28">
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
                  {whySection.steps.map((step) => (
                    <div key={step.n} className="grid grid-cols-12 gap-4 py-6">
                      <div className="col-span-2 md:col-span-1 text-xs font-light text-foreground/40 tracking-wider pt-1">
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

            <div className="lg:col-span-5 relative bg-secondary/40 min-h-[420px] lg:min-h-full overflow-hidden">
              <AssetImg
                src={heroClinicLounge}
                alt={hero.secondaryImageAlt || hero.heroImageAlt}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
      ) : null}

      {audiencesSection.audiences.length > 0 ? (
        <section className="bg-secondary/40 py-20 md:py-28">
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

              <div className="grid md:grid-cols-3 gap-6">
                {audiencesSection.audiences.map((a) => {
                  const Icon = AUDIENCE_ICONS[a.icon] || SegmentCoupleIcon;
                  return (
                    <div
                      key={a.title}
                      className="bg-background p-7 rounded-sm border border-border/40 flex flex-col"
                    >
                      <div className="w-12 h-12 flex items-center justify-center mb-5 text-foreground/80">
                        <Icon className="w-10 h-10" aria-hidden="true" />
                      </div>
                      <h3 className="text-lg font-normal text-foreground mb-3">{a.title}</h3>
                      <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">
                        {a.desc}
                      </p>
                      {a.href ? (
                        <Link
                          to={a.href}
                          className="inline-flex items-center text-sm font-light text-foreground hover:text-foreground/70 hover:gap-2.5 gap-2 transition-all"
                        >
                          {audiencesSection.readMoreLabel || "Les mer"}
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

      {symptomsSection.items.length > 0 ? (
        <SymptomServiceSection
          title={symptomsSection.title}
          description={symptomsSection.description}
          items={symptomsSection.items.map((item) => ({
            symptom: item.symptom,
            service: item.service,
            href: item.href,
          }))}
        />
      ) : null}

      {services.length > 0 ? (
        <ServicesListSection
          eyebrow={servicesSection.eyebrow}
          title={servicesSection.title}
          description={servicesSection.description}
          items={services}
        />
      ) : null}

      {stats.length > 0 ? (
        <section className="bg-brand-light text-foreground py-20 md:py-28">
          <div className="container mx-auto px-6 md:px-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-14">
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

              <div className="border-t border-brand-dark/15 py-8 md:py-10">
                {resultsSection.categoryLabel ? (
                  <p className="text-[11px] tracking-[0.18em] text-brand-dark mb-6 uppercase">
                    {resultsSection.categoryLabel}
                  </p>
                ) : null}
                <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 md:divide-x divide-brand-dark/15">
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
                        <p className="text-xs font-light text-foreground/60">{row.sub}</p>
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

      {reviewsSection.reviews.length > 0 ? (
        <section className="bg-brand-warm py-20 md:py-24">
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
              <div className="grid md:grid-cols-3 gap-6">
                {reviewsSection.reviews.map((r, i) => (
                  <div
                    key={i}
                    className="group relative p-8 rounded-sm bg-white border border-brand-dark/10 hover:border-brand-dark/20 hover:shadow-lg transition-all duration-300"
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
                      <div className="flex items-center gap-1.5 text-xs text-brand-dark/50">
                        <span>Google</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {specialistsSection.title ? (
        <SpecialistsScroller
          category={categoryId}
          title={specialistsSection.title}
          seeAllHref={specialistsSection.seeAllHref}
          seeAllLabel={specialistsSection.seeAllLabel}
        />
      ) : null}

      <PageSectionsRenderer sections={category?.pageSections} />

      <BookingCTA />
    </PageLayout>
  );
};

export default TreatmentCategoryLanding;
