"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { ChevronRight, Search, Check } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useNavigate } from "@/lib/router";
import { motion, AnimatePresence } from "framer-motion";
import { useFaqs, useServicesPage } from "@/hooks/useSanity";
import { PageSEO } from "@/components/seo/PageSEO";
import { GeoPageEnhancements } from "@/components/seo/GeoPageEnhancements";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { FaqSection } from "@/components/layout/FaqSection";
import { ServicesListSection } from "@/components/layout/ServicesListSection";
import { SpecialistCarousel } from "@/components/SpecialistCarousel";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { HeroCompact } from "@/components/homepage/HeroCompact";
import { searchSuggestions, type SearchItem } from "@/data/searchData";
import { resolveFlereTjenesterMoreServices } from "@/lib/sanity/services-more-services-items";
import { TRUST_NO_REFERRAL, TRUST_SHORT_WAIT } from "@/lib/trustTags";
import { findHomepageBookingCta } from "@/lib/sanity/homepage-data";
import { useParams } from "@/lib/router";
import { useTranslation } from "react-i18next";
import { withLocalePath, type AppLocale } from "@/lib/i18n/routing";

interface PageProps {
  isChatOpen: boolean;
}

const Services = ({ isChatOpen }: PageProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "en" ? "en" : "nb";
  const routeLocale: AppLocale = params?.locale === "en" ? "en" : "no";
  const { data: page, isPending } = useServicesPage();
  const { data: sanityFaqs } = useFaqs("tjenester");
  const { sorted: allSpecialists } = useSpecialistsData();

  const loadingLabel = locale === "en" ? "Loading services..." : "Laster tjenester...";
  const pageErrorMessage =
    locale === "en"
      ? "We could not load the services page right now."
      : "Vi kunne ikke laste tjenestesiden akkurat nå.";

  const servicesPath = page?.slug
    ? withLocalePath(routeLocale, `/${page.slug}`)
    : withLocalePath(routeLocale, "/tjenester");

  const staticFaqs = useMemo(
    () => [
      {
        id: "henvisning",
        question: t("homeFaq.referral.question"),
        answer: t("homeFaq.referral.answer"),
      },
      {
        id: "ventetid",
        question: t("homeFaq.waitTime.question"),
        answer: t("homeFaq.waitTime.answer"),
      },
      {
        id: "sykemelding",
        question: t("homeFaq.sickLeave.question"),
        answer: t("homeFaq.sickLeave.answer"),
      },
      {
        id: "utredning",
        question: t("homeFaq.assessment.question"),
        answer: t("homeFaq.assessment.answer"),
      },
    ],
    [t],
  );

  const faqs = useMemo(() => {
    const fromPage = (page?.faqs || [])
      .filter((f) => f.question?.trim() && f.answer?.trim())
      .map((f, i) => ({
        id: `faq-page-${i}`,
        question: f.question,
        answer: f.answer,
      }));
    if (fromPage.length > 0) return fromPage;

    if (sanityFaqs?.length) {
      return sanityFaqs.map((f, i) => ({
        id: `faq-sanity-${i}`,
        question: f.question,
        answer: f.answer,
      }));
    }

    return staticFaqs;
  }, [page?.faqs, sanityFaqs, staticFaqs]);

  const moreServicesItems = useMemo(
    () => resolveFlereTjenesterMoreServices(routeLocale),
    [routeLocale],
  );

  const bookingCta = useMemo(
    () => findHomepageBookingCta(page?.pageSections ?? []),
    [page?.pageSections],
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const onSearchChange = useCallback((val: string) => {
    setSearchQuery(val);
    const results = searchSuggestions(val, 6);
    setSearchResults(results);
    setSelectedIdx(-1);
    setShowResults(val.length > 0 && results.length > 0);
  }, []);

  const onSearchKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!showResults) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((prev) => Math.min(prev + 1, searchResults.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && selectedIdx >= 0) {
        e.preventDefault();
        const item = searchResults[selectedIdx];
        if (item) {
          navigate(item.path);
          setShowResults(false);
          setSearchQuery("");
        }
      } else if (e.key === "Escape") {
        setShowResults(false);
      }
    },
    [showResults, searchResults, selectedIdx, navigate],
  );

  if (isPending && !page) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-[40vh] flex items-center justify-center">
          <p className="text-muted-foreground font-light">{loadingLabel}</p>
        </div>
      </PageLayout>
    );
  }

  if (!page) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-[40vh] flex items-center justify-center px-6 text-center">
          <p className="text-muted-foreground font-light max-w-md">{pageErrorMessage}</p>
        </div>
      </PageLayout>
    );
  }

  const heroTitle = page.title?.trim() || t("nav.services");
  const heroIntro = page.introText?.trim() || t("services.findTreatment");
  const searchPlaceholder =
    page.searchPlaceholder?.trim() || t("services.searchPlaceholder");
  const moreSection = page.moreServicesSection;
  const moreEyebrow = moreSection.eyebrow?.trim() || "";
  const moreTitle =
    moreSection.title?.trim() || t("services.moreServices");
  const moreDescription =
    moreSection.description?.trim() || t("services.moreSectionDescription");

  const trustNoReferral =
    locale === "en" ? t("services.noReferral") : TRUST_NO_REFERRAL;
  const trustShortWait =
    locale === "en" ? t("booking.availableTime") : TRUST_SHORT_WAIT;

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={page.seo?.metaTitle || t("services.seoTitle")}
        description={page.seo?.metaDescription || t("services.seoDescription")}
        canonical={servicesPath}
        breadcrumbs={[
          { name: page.breadcrumbHome || t("pricing.breadcrumbHome"), path: "/" },
          { name: heroTitle, path: servicesPath },
        ]}
      />
      <GeoPageEnhancements
        name={heroTitle}
        geoSummary={page.geoSummary}
        fallbackDescription={heroIntro}
        path={servicesPath}
        locale={locale}
        faqs={faqs.map((f) => ({ question: f.question, answer: f.answer }))}
      />

      <section className="bg-background centered-hero">
        <div className="container mx-auto px-6 md:px-16 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground mb-4">
            {heroTitle}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-light max-w-md mx-auto mb-4">
            {heroIntro}
          </p>
          <div className="flex items-center justify-center gap-6 mb-8">
            <span className="inline-flex items-center gap-2 text-sm font-light text-foreground/70">
              <Check className="w-4 h-4 text-foreground/70" aria-hidden="true" />
              {trustNoReferral}
            </span>
            <span className="inline-flex items-center gap-2 text-sm font-light text-foreground/70">
              <Check className="w-4 h-4 text-foreground/70" aria-hidden="true" />
              {trustShortWait}
            </span>
          </div>

          <div ref={searchRef} className="relative max-w-lg mx-auto">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-foreground/60"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={onSearchKeyDown}
                onFocus={() =>
                  searchQuery.length > 0 &&
                  searchResults.length > 0 &&
                  setShowResults(true)
                }
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="w-full pl-12 pr-5 py-3.5 rounded-sm border border-foreground/30 bg-transparent text-[15px] font-light text-foreground placeholder:text-foreground/60 focus:outline-none focus:border-foreground transition-all"
              />
            </div>
            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute z-30 left-0 right-0 mt-1 bg-card border border-border/60 rounded-sm shadow-lg overflow-hidden"
                >
                  {searchResults.map((item, idx) => (
                    <button
                      key={item.label + item.path}
                      type="button"
                      onClick={() => {
                        navigate(item.path);
                        setShowResults(false);
                        setSearchQuery("");
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${idx === selectedIdx ? "bg-muted/60" : "hover:bg-muted/40"} ${idx !== 0 ? "border-t border-border/30" : ""}`}
                    >
                      <div>
                        <span className="text-sm font-light text-foreground">{item.label}</span>
                        <span className="ml-2 text-xs text-muted-foreground/60">
                          {item.category}
                        </span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <div className="pb-10 md:pb-14">
        <HeroCompact showHeader={false} />
      </div>

      {moreServicesItems.length > 0 ? (
        <ServicesListSection
          eyebrow={moreEyebrow}
          title={moreTitle}
          description={moreDescription}
          items={moreServicesItems.map((s) => ({ title: s.title, href: s.path }))}
          bookingCtaTile
        />
      ) : null}

      <SpecialistCarousel
        title={t("services.specialistsPerformTitle", {
          defaultValue: "Spesialistene som utfører behandlingene",
        })}
        description={t("specialists.description")}
        seeAllHref="/spesialister"
        seeAllLabel={t("specialists.seeAll", { count: allSpecialists.length })}
      />

      <FaqSection faqs={faqs} title={page.faqSectionTitle || undefined} />

      <BookingCTA
        title={bookingCta?.title}
        subtitle={bookingCta?.subtitle}
        image={bookingCta?.image}
        imageAlt={bookingCta?.imageAlt}
        variant={bookingCta?.variant}
        primaryLabel={bookingCta?.primaryLabel}
        primaryPath={bookingCta?.primaryPath}
        bookingCategoryId={bookingCta?.bookingCategory?.categoryId}
        showSecondaryButton={bookingCta?.showSecondaryButton}
        secondaryLabel={bookingCta?.secondaryLabel}
        secondaryPath={bookingCta?.secondaryPath}
        quickInfoItems={bookingCta?.quickInfoItems}
      />
    </PageLayout>
  );
};

export default Services;
