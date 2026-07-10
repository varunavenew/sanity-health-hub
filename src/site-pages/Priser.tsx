"use client";

import { AssetImg } from "@/components/AssetImg";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Plus, Minus, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { Link, useNavigate } from "@/lib/router";
import { motion, AnimatePresence } from "framer-motion";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { usePricingPage } from "@/hooks/useSanity";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { PageSEO } from "@/components/seo/PageSEO";
import { buildMedicalWebPageGeoJsonLd } from "@/lib/seo/geo-page";
import { getImageUrl } from "@/lib/sanityClient";
import { SplitHero } from "@/components/layout/SplitHero";
import { useParams } from "@/lib/router";
import { useTranslation } from "react-i18next";
import { formatDurationMinutes } from "@/lib/booking/duration";
import { bookingCategoryPageIdForClinicService, buildBookingUrl } from "@/lib/bookingLinks";
import type { BookingCategory } from "@/app/api/booking/activity-groups/route";

interface PageProps { isChatOpen: boolean }

interface PricingTestimonial {
  _id: string;
  name: string;
  rating: number;
  text: string;
  treatment?: string;
}

interface PricingFaq {
  _id: string;
  question: string;
  answer: string;
}

interface PriceItem {
  name: string;
  price: string;
  duration: string;
  apiActivityId?: number;
}

interface PriceSubcategory {
  label: string;
  path: string;
  items: PriceItem[];
}

interface PriceCategory {
  id: string;
  label: string;
  path: string;
  subcategories: PriceSubcategory[];
}

// ─── Same duration state shape as BookingDemo ─────────────────────────────────
type DurationState =
  | { status: "loading" }
  | { status: "ready"; label: string }
  | { status: "none" };

// ─── Same resolver as BookingDemo's serviceDurationLabel() ───────────────────
function resolveDisplayDuration(
  item: PriceItem,
  durationByActivityId: Record<number, DurationState>,
): { label: string | null; loading: boolean } {
  if (item.apiActivityId != null) {
    const state = durationByActivityId[item.apiActivityId];
    if (!state || state.status === "none") {
      return { label: item.duration || null, loading: false };
    }
    if (state.status === "loading") {
      return { label: null, loading: true };
    }
    return { label: state.label, loading: false };
  }
  return { label: item.duration || null, loading: false };
}

function mapApiCategoryToPriceCategory(cat: BookingCategory): PriceCategory {
  return {
    id: cat.clinicServiceId,
    label: cat.label,
    path: `/${cat.clinicServiceId}`,
    subcategories: [
      {
        label: cat.label,
        path: `/${cat.clinicServiceId}`,
        items: cat.services.map((svc) => ({
          name: svc.name,
          price: svc.price === "0" ? "Gratis" : `${svc.price},-`,
          duration: "",
          apiActivityId: svc.apiActivityId,
        })),
      },
    ],
  };
}

/** API groups like «Sædanalyse» share clinicServiceId with «Fertilitet» — merge for one accordion. */
function mergePriceCategoriesByClinicServiceId(
  apiCategories: BookingCategory[],
): PriceCategory[] {
  const merged = new Map<string, PriceCategory>();

  for (const cat of apiCategories) {
    const mapped = mapApiCategoryToPriceCategory(cat);
    const existing = merged.get(mapped.id);

    if (!existing) {
      merged.set(mapped.id, mapped);
      continue;
    }

    existing.subcategories.push(...mapped.subcategories);

    // Prefer the label whose API slug matches the shared clinic service id.
    if (cat.id === cat.clinicServiceId) {
      existing.label = mapped.label;
    }
  }

  return Array.from(merged.values());
}

// ─── Hook: fetch booking categories + prices ─────────────────────────────────
function useBookingPriceCategories(): {
  categories: PriceCategory[];
  loading: boolean;
  error: string | null;
} {
  const [categories, setCategories] = useState<PriceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/booking/activity-groups?prices=api")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: { ok: boolean; categories?: BookingCategory[]; message?: string }) => {
        if (!data.ok || !data.categories) throw new Error(data.message ?? "Unknown error");

        setCategories(mergePriceCategoriesByClinicServiceId(data.categories));
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
}

// ─── Component ────────────────────────────────────────────────────────────────
const Priser = ({ isChatOpen }: PageProps) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "en" ? "en" : "nb";

  const [activeCategory, setActiveCategory] = useState<string>("");
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [navTop, setNavTop] = useState(80);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const navScrollerRef = useRef<HTMLDivElement | null>(null);
  const overviewRef = useRef<HTMLDivElement | null>(null);
  const pillRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const suspendSpyUntil = useRef(0);

  const [durationByActivityId, setDurationByActivityId] = useState<Record<number, DurationState>>({});
  const { sorted }              = useSpecialistsData();
  const specialists             = sorted.slice(0, 8);
  const { data: sanityPricing } = usePricingPage();

  const {
    categories: bookingCategories,
    loading:    bookingLoading,
    error:      bookingError,
  } = useBookingPriceCategories();

  const hasApiPrices =
    !bookingLoading && !bookingError && bookingCategories.length > 0;

  const faqs: PricingFaq[] = (sanityPricing?.faqs ?? []).filter(
    (item): item is PricingFaq => Boolean(item?._id && item?.question && item?.answer),
  );

  const testimonials: PricingTestimonial[] = (sanityPricing?.testimonials ?? []).filter(
    (item): item is PricingTestimonial =>
      Boolean(item?._id && item?.name && item?.text && typeof item.rating === "number"),
  );

  const heroImage    = sanityPricing?.heroImage ? getImageUrl(sanityPricing.heroImage) : undefined;
  const pageTitle    = sanityPricing?.title?.trim() ?? "";
  const pageSubtitle = sanityPricing?.introText?.trim() ?? "";
  const seoTitle     = sanityPricing?.seo?.metaTitle?.trim() ?? pageTitle;
  const seoDescription = sanityPricing?.seo?.metaDescription?.trim() ?? pageSubtitle;
  const testimonialsTitle = sanityPricing?.testimonialsTitle?.trim() ?? "";
  const faqTitle = sanityPricing?.faqTitle?.trim() ?? "";
  const sortLocale   = i18n.language?.startsWith("en") ? "en" : "nb";

  useEffect(() => {
    if (seoTitle) document.title = `${seoTitle} | CMedical`;
  }, [seoTitle]);

  const prioritized = useMemo(() => ["gynekolog", "urolog", "fertilitet", "ortoped"], []);
  const sortedCategories = useMemo(
    () => [
      ...bookingCategories
        .filter((c) => prioritized.includes(c.id))
        .sort((a, b) => prioritized.indexOf(a.id) - prioritized.indexOf(b.id)),
      ...bookingCategories
        .filter((c) => !prioritized.includes(c.id))
        .sort((a, b) => a.label.localeCompare(b.label, sortLocale)),
    ],
    [bookingCategories, prioritized, sortLocale],
  );

  useEffect(() => {
    if (!activeCategory && sortedCategories.length > 0) {
      setActiveCategory(sortedCategories[0].id);
    }
  }, [activeCategory, sortedCategories]);

  // ─── Load durations from freetimes for Metodika services ───────────────────
  // Same data source as BookingDemo; cached per activity id.
  useEffect(() => {
    const activityIds = sortedCategories
      .flatMap((category) => category.subcategories)
      .flatMap((sub) => sub.items)
      .map((item) => item.apiActivityId)
      .filter((id): id is number => typeof id === "number");

    if (activityIds.length === 0) return;

    let cancelled = false;
    let idsToFetch: number[] = [];

    setDurationByActivityId((prev) => {
      idsToFetch = activityIds.filter((id) => {
        const cached = prev[id];
        return cached?.status !== "ready" && cached?.status !== "none";
      });
      if (idsToFetch.length === 0) return prev;

      const next = { ...prev };
      for (const id of idsToFetch) next[id] = { status: "loading" };
      return next;
    });

    if (idsToFetch.length === 0) return;

    async function loadDurations() {
      try {
        const res = await fetch(
          `/api/booking/freetimes?wbactivityIds=${idsToFetch.join(",")}`,
        );
        const json = (await res.json()) as {
          ok?: boolean;
          byActivityId?: Record<string, { durationMinutes?: number }[]>;
        };

        if (cancelled) return;

        const results = idsToFetch.map((id) => {
          const slots = json.byActivityId?.[String(id)] ?? [];
          const mins = slots.find((s) => s.durationMinutes != null)?.durationMinutes;
          if (mins == null) return { id, status: "none" as const };
          return { id, status: "ready" as const, label: formatDurationMinutes(mins) };
        });

        setDurationByActivityId((prev) => {
          const next = { ...prev };
          for (const result of results) {
            next[result.id] =
              result.status === "ready"
                ? { status: "ready", label: result.label }
                : { status: "none" };
          }
          return next;
        });
      } catch {
        if (cancelled) return;
        setDurationByActivityId((prev) => {
          const next = { ...prev };
          for (const id of idsToFetch) next[id] = { status: "none" };
          return next;
        });
      }
    }

    loadDurations();
    return () => {
      cancelled = true;
      setDurationByActivityId((prev) => {
        const next = { ...prev };
        let changed = false;
        for (const id of idsToFetch) {
          if (next[id]?.status === "loading") {
            delete next[id];
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    };
  }, [sortedCategories]);

  useEffect(() => {
    const sections = sortedCategories
      .map((c) => document.getElementById(`cat-${c.id}`))
      .filter(Boolean) as HTMLElement[];
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < suspendSpyUntil.current) return;
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActiveCategory(visible[0].target.id.replace("cat-", ""));
        }
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [sortedCategories]);

  useEffect(() => {
    const scroller = navScrollerRef.current;
    const pill = pillRefs.current[activeCategory];
    if (!scroller || !pill) return;
    const margin = 24;
    const pillLeft = pill.offsetLeft;
    const pillRight = pillLeft + pill.offsetWidth;
    const visibleLeft = scroller.scrollLeft;
    const visibleRight = visibleLeft + scroller.clientWidth;
    if (pillLeft < visibleLeft + margin) {
      scroller.scrollTo({ left: Math.max(0, pillLeft - margin), behavior: "smooth" });
    } else if (pillRight > visibleRight - margin) {
      scroller.scrollTo({ left: pillRight - scroller.clientWidth + margin, behavior: "smooth" });
    }
  }, [activeCategory]);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        setNavTop(Math.max(0, header.getBoundingClientRect().bottom));
        ticking = false;
      });
      ticking = true;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = overviewRef.current;
    if (!el) return;
    const check = () => {
      setShowStickyNav(el.getBoundingClientRect().bottom < navTop + 8);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [navTop]);

  const scrollToCat = (id: string) => {
    const el = document.getElementById(`cat-${id}`);
    if (!el) return;
    const navHeight = navScrollerRef.current?.getBoundingClientRect().height ?? 48;
    suspendSpyUntil.current = Date.now() + 900;
    setActiveCategory(id);
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - navTop - navHeight - 16,
      behavior: "smooth",
    });
  };

  const categoryBookingUrl = (categoryId: string, serviceName?: string) =>
    buildBookingUrl({
      kategori: bookingCategoryPageIdForClinicService(categoryId),
      tjeneste: serviceName,
    });

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const toggleFaq = (id: string) => setOpenFaq(openFaq === id ? null : id);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={seoTitle}
        description={seoDescription}
        canonical="/priser"
        breadcrumbs={[
          { name: t("pricing.breadcrumbHome"), path: "/" },
          { name: pageTitle || t("nav.pricing"), path: "/priser" },
        ]}
        jsonLd={buildMedicalWebPageGeoJsonLd({
          name: pageTitle,
          geoSummary: sanityPricing?.geoSummary,
          fallbackDescription: pageSubtitle,
          url: "/priser",
          locale,
          faqs: faqs.map((f) => ({ question: f.question, answer: f.answer })),
        })}
      />
      <SplitHero
        eyebrow={t("pricing.heroEyebrow")}
        title={pageTitle}
        description={pageSubtitle}
        image={heroImage}
        imageAlt={pageTitle}
        primaryCta={{ label: t("nav.bookAppointment"), to: "/booking" }}
        secondaryCta={{ label: t("cta.contactUs"), to: "/kontakt" }}
      />

      {/* Price List Section */}
      <section id="prisliste" className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-5xl mx-auto mb-8">
            <p className="text-sm text-muted-foreground font-light">
              {t("pricing.disclaimer")}
            </p>
          </div>

          {bookingLoading && (
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 rounded-full border-2 border-foreground/10 border-t-foreground animate-spin" />
                <p className="text-sm text-muted-foreground font-light">
                  {t("pricing.loadingPrices")}
                </p>
              </div>
              <div className="space-y-4 mt-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="h-16 rounded-xl bg-muted animate-pulse"
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          {bookingError && !bookingLoading && (
            <p className="text-center text-destructive font-light py-8">
              {t("pricing.loadError")}
            </p>
          )}

          {hasApiPrices && (
            <>
              <div className="max-w-5xl mx-auto">
                <div className="hidden md:block mb-10 md:mb-14" ref={overviewRef}>
                  <h2 className="text-3xl md:text-4xl font-light text-brand-dark mb-6">
                    {t("pricing.menuTitle", "Our menu")}
                  </h2>
                  <p className="text-xs font-light text-brand-dark/60 mb-4">
                    {t("pricing.jumpToCategory", "Choose a category to jump directly:")}
                  </p>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {sortedCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => scrollToCat(category.id)}
                        className="inline-flex items-center justify-center px-5 py-3 rounded-full text-sm font-light whitespace-nowrap border bg-white text-brand-dark border-brand-dark/20 hover:bg-brand-dark hover:text-brand-warm hover:border-brand-dark transition-colors"
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className={`sticky z-30 mb-10 md:mb-14 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-y md:border-b md:border-t-0 border-brand-dark/10 transition-opacity duration-200 -mx-4 md:mx-0 ${
                  showStickyNav ? "md:opacity-100" : "md:opacity-0 md:pointer-events-none"
                }`}
                style={{ top: `${navTop}px` }}
              >
                <div className="container mx-auto px-4 md:px-8">
                  <div
                    ref={navScrollerRef}
                    className="flex gap-2 overflow-x-auto py-2 scrollbar-hide [scroll-behavior:smooth]"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  >
                    {sortedCategories.map((category) => {
                      const isActive = activeCategory === category.id;
                      return (
                        <button
                          key={category.id}
                          ref={(el) => {
                            pillRefs.current[category.id] = el;
                          }}
                          onClick={() => scrollToCat(category.id)}
                          className={`inline-flex items-center justify-center px-3 md:px-4 py-1.5 md:py-1 min-h-[36px] md:min-h-[36px] rounded-full md:rounded-full text-xs font-light whitespace-nowrap border transition-colors shrink-0 ${
                            isActive
                              ? "bg-brand-dark text-brand-warm border-brand-dark"
                              : "bg-white text-brand-dark border-brand-dark/20 hover:bg-brand-dark hover:text-brand-warm hover:border-brand-dark"
                          }`}
                          aria-current={isActive ? "true" : undefined}
                        >
                          {category.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="max-w-5xl mx-auto space-y-20 md:space-y-28">
                {sortedCategories.map((category) => (
                  <section key={category.id} id={`cat-${category.id}`} className="scroll-mt-40">
                    <div className="mb-10 pb-4 border-b border-brand-dark/20">
                      <h2 className="text-2xl md:text-3xl font-light text-brand-dark">
                        {category.label}
                      </h2>
                    </div>

                    <div className="space-y-12">
                      {category.subcategories.map((sub, subIndex) => (
                        <div
                          key={`${category.id}-${sub.label}`}
                          className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6 md:gap-10 md:items-start"
                        >
                          <div className="md:sticky md:top-48 md:self-start">
                            <h3 className="text-lg md:text-sm font-normal text-brand-dark">
                              {sub.label}
                            </h3>
                          </div>

                          <div>
                            <ul className="divide-y divide-brand-mid/30">
                              {sub.items.map((item, idx) => {
                                const { label: durationLabel, loading: durationLoading } =
                                  resolveDisplayDuration(item, durationByActivityId);
                                const itemKey = `${category.id}-${subIndex}-${idx}`;
                                const isOpen = !!openItems[itemKey];
                                const priceLabel = item.price === "0,-" ? t("pricing.free", "Free") : item.price;
                                const bookingUrl = categoryBookingUrl(category.id, item.name);

                                return (
                                  <li key={itemKey} className="py-3 md:py-5">
                                    <div className="md:hidden">
                                      <div className="grid grid-cols-[1fr_120px] gap-3 items-start">
                                        <p className="text-[15px] font-normal text-brand-dark leading-snug">
                                          {item.name}
                                        </p>
                                        <span className="text-[15px] font-normal text-brand-dark tabular-nums text-right whitespace-normal leading-snug">
                                          {priceLabel}
                                        </span>
                                      </div>

                                      {(durationLoading || durationLabel) && (
                                        <p className="mt-1 text-xs font-light text-brand-dark/60 flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          {durationLoading
                                            ? t("pricing.loadingDuration", "Loading duration...")
                                            : durationLabel}
                                        </p>
                                      )}

                                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
                                        {(durationLabel || durationLoading) && (
                                          <button
                                            type="button"
                                            onClick={() => toggleItem(itemKey)}
                                            className="inline-flex items-center gap-1.5 text-xs font-light text-brand-dark hover:text-brand-dark/80 transition-colors"
                                            aria-expanded={isOpen}
                                            aria-controls={`info-${itemKey}`}
                                          >
                                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-brand-dark/30 text-brand-dark">
                                              {isOpen ? <Minus className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                            </span>
                                            {isOpen
                                              ? t("pricing.hideDetails", "Hide details")
                                              : t("pricing.aboutService", "About the service")}
                                          </button>
                                        )}

                                        <Link
                                          to={bookingUrl}
                                          className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-light text-brand-dark border border-brand-dark/25 hover:border-brand-dark/60 transition-colors whitespace-nowrap"
                                        >
                                          {t("nav.bookAppointment")}
                                          <ArrowRight className="w-3 h-3" />
                                        </Link>
                                      </div>

                                      <AnimatePresence initial={false}>
                                        {isOpen && (
                                          <motion.div
                                            id={`info-${itemKey}`}
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                          >
                                            <p className="mt-3 text-xs font-light text-brand-dark/75 leading-relaxed">
                                              {durationLabel
                                                ? t("pricing.durationDetail", {
                                                    duration: durationLabel,
                                                    defaultValue: "Estimated duration: {{duration}}",
                                                  })
                                                : t("pricing.durationUnavailable", "Duration is confirmed during booking.")}
                                            </p>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>

                                    <div className="hidden md:flex md:items-start gap-3">
                                      <div className="flex-1 min-w-0">
                                        <p className="font-normal text-brand-dark">{item.name}</p>
                                        {(durationLoading || durationLabel) && (
                                          <p className="mt-1 text-xs font-light text-brand-dark/60 flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {durationLoading
                                              ? t("pricing.loadingDuration", "Loading duration...")
                                              : durationLabel}
                                          </p>
                                        )}
                                      </div>

                                      <div className="flex items-center gap-4 shrink-0 pt-0.5">
                                        <span className="text-sm font-light text-brand-dark tabular-nums whitespace-nowrap w-20 text-right">
                                          {priceLabel}
                                        </span>
                                        <Link
                                          to={bookingUrl}
                                          className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-xs font-light text-brand-dark border border-brand-dark/25 hover:border-brand-dark/60 transition-colors whitespace-nowrap w-28 justify-center"
                                        >
                                          {t("nav.bookAppointment")}
                                          <ArrowRight className="w-3 h-3" />
                                        </Link>
                                      </div>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 pt-6 border-t border-brand-mid/30">
                      <Link
                        to={`/${bookingCategoryPageIdForClinicService(category.id)}`}
                        className="inline-flex items-center gap-2 text-sm font-light text-brand-dark hover:gap-3 transition-all"
                      >
                        {t("pricing.seeAllCategoryServices", {
                          category: category.label.toLowerCase(),
                          defaultValue: "See all {{category}} services",
                        })}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </section>
                ))}
              </div>

              <div className="mt-20 md:mt-24 text-center">
                <button
                  onClick={() => navigate("/booking")}
                  className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full font-normal text-brand-dark border border-brand-dark/25 hover:border-brand-dark/60 transition-colors"
                >
                  {t("nav.bookAppointment")}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Specialists Section */}
      <section className="py-16 md:py-24 bg-brand-dark">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-10">
            <p className="text-sm text-white/60 mb-3 font-light">{t("pricing.specialistsEyebrow")}</p>
            <h2 className="text-3xl md:text-4xl font-normal text-white">{t("pricing.specialistsTitle")}</h2>
            <p className="text-white/70 mt-3 max-w-2xl font-light">{t("pricing.specialistsSubtitle")}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {specialists.map((specialist) => (
              <Link to={`/spesialister/${specialist.slug}`} key={specialist.slug} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-brand-dark">
                  <AssetImg
                    src={specialist.image}
                    alt={specialist.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-normal text-white text-sm md:text-base mb-0.5">{specialist.name}</h3>
                    <p className="text-white/70 text-xs font-light line-clamp-1 pr-4">
                      {specialist.expertise.join(", ")}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button
              variant="ghost"
              className="rounded-full border border-white text-white bg-transparent hover:bg-white hover:text-brand-dark"
              asChild
            >
              <Link to="/om-oss">
                {t("pricing.seeAllSpecialists")}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
      <section className="py-16 md:py-24 bg-brand-warm">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <AssetImg src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              <span className="text-brand-dark font-normal">4.8 / 5</span>
              <div className="flex">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-foreground text-foreground" />
                ))}
              </div>
            </div>
            {testimonialsTitle ? (
              <h2 className="text-3xl md:text-4xl font-normal text-brand-dark">
                {testimonialsTitle}
              </h2>
            ) : null}
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial) => (
              <div key={testimonial._id} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-foreground text-foreground" />
                  ))}
                </div>
                <p className="text-foreground/80 mb-4 font-light leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center justify-between">
                  <p className="font-normal text-foreground">{testimonial.name}</p>
                  {testimonial.treatment ? (
                    <span className="text-xs text-muted-foreground">{testimonial.treatment}</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* FAQ Section */}
      {faqs.length > 0 && (
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            {faqTitle ? (
              <h3 className="text-2xl md:text-3xl font-normal text-foreground mb-8">
                {faqTitle}
              </h3>
            ) : null}
            <div className="space-y-0">
              {faqs.map((faq, index) => (
                <div key={faq._id} className={index !== 0 ? "border-t border-border" : ""}>
                  <button
                    onClick={() => toggleFaq(faq._id)}
                    className="w-full flex items-center justify-between py-5 text-left group"
                  >
                    <span className="text-base md:text-lg font-normal text-foreground group-hover:text-foreground/80 transition-colors">
                      {faq.question}
                    </span>
                    <div className={`w-8 h-8 rounded-full border border-border flex items-center justify-center transition-all ${
                      openFaq === faq._id ? "bg-secondary" : ""
                    }`}>
                      {openFaq === faq._id
                        ? <Minus className="w-4 h-4 text-muted-foreground" />
                        : <Plus  className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {openFaq === faq._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="text-muted-foreground text-sm md:text-base font-light leading-relaxed pb-5 pr-12">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      )}

      <PageSectionsRenderer sections={sanityPricing?.pageSections} />
    </PageLayout>
  );
};

export default Priser;
