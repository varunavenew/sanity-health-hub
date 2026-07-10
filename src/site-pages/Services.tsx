"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { ArrowRight, ChevronRight, Search } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { useNavigate } from "@/lib/router";
import { motion, AnimatePresence } from "framer-motion";
import { useServicesPage } from "@/hooks/useSanity";
import { PageBreadcrumbsJsonLd } from "@/components/seo/PageBreadcrumbsJsonLd";
import { GeoPageEnhancements } from "@/components/seo/GeoPageEnhancements";
import { FaqSection } from "@/components/layout/FaqSection";
import { ServicesListSection } from "@/components/layout/ServicesListSection";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { useParams } from "@/lib/router";
import { withLocalePath, type AppLocale } from "@/lib/i18n/routing";

interface PageProps {
  isChatOpen: boolean;
}

function filterSearchItems(
  items: { title: string; path: string }[],
  query: string,
  limit: number,
) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return items.filter((item) => item.title.toLowerCase().includes(q)).slice(0, limit);
}

const Services = ({ isChatOpen }: PageProps) => {
  const navigate = useNavigate();
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "en" ? "en" : "nb";
  const routeLocale: AppLocale = params?.locale === "en" ? "en" : "no";
  const { data: page, isPending } = useServicesPage();
  const loadingLabel = locale === "en" ? "Loading services..." : "Laster tjenester...";
  const pageErrorMessage =
    locale === "en"
      ? "We could not load the services page right now."
      : "Vi kunne ikke laste tjenestesiden akkurat nå.";
  const servicesPath = page?.slug
    ? withLocalePath(routeLocale, `/${page.slug}`)
    : "";

  const faqs = useMemo(() => {
    return (page?.faqs || [])
      .filter((f) => f.question?.trim() && f.answer?.trim())
      .map((f, i) => ({
        id: `faq-inline-${i}`,
        question: f.question,
        answer: f.answer,
      }));
  }, [page?.faqs]);

  const moreServicesItems = page?.moreServicesItems ?? [];

  const specialistsSections = useMemo(
    () => (page?.pageSections ?? []).filter((s) => s._type === "pageSectionSpecialists"),
    [page?.pageSections],
  );

  const trailingPageSections = useMemo(
    () => (page?.pageSections ?? []).filter((s) => s._type !== "pageSectionSpecialists"),
    [page?.pageSections],
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ title: string; path: string }[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const searchItems = useMemo(() => page?.searchItems ?? [], [page?.searchItems]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const onSearchChange = useCallback(
    (val: string) => {
      setSearchQuery(val);
      const results = filterSearchItems(searchItems, val, 6);
      setSearchResults(results);
      setSelectedIdx(-1);
      setShowResults(val.length > 0 && results.length > 0);
    },
    [searchItems],
  );

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
          <p className="text-muted-foreground font-light max-w-md">
            {pageErrorMessage}
          </p>
        </div>
      </PageLayout>
    );
  }

  const { moreServicesSection, featuredCategories } = page;

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageBreadcrumbsJsonLd
        breadcrumbs={[
          { name: page.breadcrumbHome || page.title, path: "/" },
          { name: page.title, path: servicesPath },
        ]}
      />

      <section className="bg-background pt-28 md:pt-32 pb-10 md:pb-14">
        <div className="container mx-auto px-6 md:px-16 text-center">
          <GeoPageEnhancements
            name={page.title}
            geoSummary={page.geoSummary}
            fallbackDescription={page.introText}
            path={servicesPath}
            locale={locale}
            faqs={faqs.map((f) => ({ question: f.question, answer: f.answer }))}
            className="mb-6 max-w-3xl mx-auto text-left"
          />
          {page.eyebrow ? (
            <p className="text-sm text-muted-foreground font-light mb-2">{page.eyebrow}</p>
          ) : null}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground mb-4">
            {page.title}
          </h1>
          {page.introText ? (
            <p className="text-base md:text-lg text-muted-foreground font-light max-w-md mx-auto mb-4">
              {page.introText}
            </p>
          ) : null}
          {page.badges.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              {page.badges.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex items-center px-4 py-1.5 rounded-full border border-border text-sm font-light text-foreground/70"
                >
                  {badge}
                </span>
              ))}
            </div>
          ) : null}

          {page.searchPlaceholder ? (
            <div ref={searchRef} className="relative max-w-lg mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-foreground/30" />
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
                  placeholder={page.searchPlaceholder}
                  className="w-full pl-12 pr-5 py-3.5 rounded-sm border border-foreground/15 bg-card/80 text-[15px] font-light text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground/30 transition-all"
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
                        key={item.title + item.path}
                        type="button"
                        onClick={() => {
                          navigate(item.path);
                          setShowResults(false);
                          setSearchQuery("");
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${idx === selectedIdx ? "bg-muted/60" : "hover:bg-muted/40"} ${idx !== 0 ? "border-t border-border/30" : ""}`}
                      >
                        <span className="text-sm font-light text-foreground">{item.title}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : null}
        </div>
      </section>

      {featuredCategories.length > 0 ? (
        <section className="bg-background pb-10 md:pb-14">
          {page.featuredSectionTitle ? (
            <p className="text-sm text-muted-foreground font-light mb-6 px-6 md:px-16">
              {page.featuredSectionTitle}
            </p>
          ) : null}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {featuredCategories.map((item, idx) => (
              <motion.button
                key={item.categoryId}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onClick={() => navigate(item.path)}
                className="group relative aspect-[3/4] overflow-hidden"
              >
                {item.heroImage ? (
                  <img
                    src={item.heroImage}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 flex items-center justify-between">
                  <span className="text-base md:text-lg font-light text-white">{item.title}</span>
                  <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      ) : null}

      {moreServicesItems.length > 0 ? (
        <ServicesListSection
          eyebrow={moreServicesSection.eyebrow}
          title={moreServicesSection.title}
          description={moreServicesSection.description}
          items={moreServicesItems.map((s) => ({ title: s.title, href: s.path }))}
        />
      ) : null}

      {featuredCategories.length === 0 || moreServicesItems.length === 0 ? (
        <section className="bg-background px-6 md:px-16 py-12 text-center">
          <p className="text-muted-foreground font-light">{page.emptyCategoriesMessage}</p>
        </section>
      ) : null}

      <PageSectionsRenderer sections={specialistsSections} />

      {faqs.length > 0 ? (
        <FaqSection faqs={faqs} title={page.faqSectionTitle} />
      ) : null}

      <PageSectionsRenderer sections={trailingPageSections} />
    </PageLayout>
  );
};

export default Services;
