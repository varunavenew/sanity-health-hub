"use client";

import { AssetImg } from "@/components/AssetImg";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronRight, Plus, Minus, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { Link, useNavigate } from "@/lib/router";
import { motion, AnimatePresence } from "framer-motion";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { usePricingPage, useFaqs } from "@/hooks/useSanity";
import { PageSEO } from "@/components/seo/PageSEO";
import { getImageUrl } from "@/lib/sanityClient";
import { SplitHero } from "@/components/layout/SplitHero";
import { useTranslation } from "react-i18next";
import { formatDurationMinutes } from "@/lib/booking/duration";
import type { BookingCategory } from "@/app/api/booking/activity-groups/route";

import pricingHero from "@/assets/hero/pricing-hero.jpg";

interface PageProps { isChatOpen: boolean }

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

// ─── Same concurrency helper as BookingDemo ───────────────────────────────────
async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  if (items.length === 0) return [];
  const results = new Array<R>(items.length);
  let nextIndex = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (nextIndex < items.length) {
      const i = nextIndex++;
      results[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return results;
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
    fetch("/api/booking/activity-groups")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: { ok: boolean; categories?: BookingCategory[]; message?: string }) => {
        if (!data.ok || !data.categories) throw new Error(data.message ?? "Unknown error");

        const mapped: PriceCategory[] = data.categories.map((cat) => ({
          id: cat.clinicServiceId,
          label: cat.label,
          path: `/${cat.clinicServiceId}`,
          subcategories: [
            {
              label: cat.label,
              path: `/${cat.clinicServiceId}`,
              items: cat.services.map((svc) => ({
                name:          svc.name,
                price:         svc.price === "0" ? "Gratis" : `${svc.price},-`,
                duration:      "",
                apiActivityId: svc.apiActivityId,
              })),
            },
          ],
        }));
        setCategories(mapped);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading, error };
}

// ─── Constants ────────────────────────────────────────────────────────────────
const FAQ_FALLBACK_KEYS  = ["referral", "payment", "insurance", "cancellation"] as const;
const TESTIMONIAL_KEYS   = ["one", "two", "three"] as const;
const TESTIMONIAL_NAMES  = ["Maria S.", "Anders L.", "Sofie H."] as const;

const slugifyNo = (value: string) =>
  value
    .toLowerCase()
    .replace(/æ/g, "ae").replace(/ø/g, "o").replace(/å/g, "a")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

// ─── Component ────────────────────────────────────────────────────────────────
const Priser = ({ isChatOpen }: PageProps) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [expandedCategory,    setExpandedCategory]    = useState<string | null>(null);
  const [expandedSubcategory, setExpandedSubcategory] = useState<string | null>(null);
  const [openFaq,             setOpenFaq]             = useState<string | null>(null);

  // ─── Same durationByActivityId pattern as BookingDemo ────────────────────
const [durationByActivityId, setDurationByActivityId] = useState<Record<number, DurationState>>({});
  const { sorted }              = useSpecialistsData();
  const specialists             = sorted.slice(0, 8);
  const { data: sanityPricing } = usePricingPage();
  const { data: sanityFaqs }    = useFaqs("priser");

  const {
    categories: bookingCategories,
    loading:    bookingLoading,
    error:      bookingError,
  } = useBookingPriceCategories();

  // FAQs
  const staticFaqs = FAQ_FALLBACK_KEYS.map((key) => ({
    id: key,
    question: t(`pricing.faqs.${key}.question`),
    answer:   t(`pricing.faqs.${key}.answer`),
  }));
  const faqs =
    sanityFaqs && sanityFaqs.length > 0
      ? sanityFaqs.map((f, i) => ({ id: `faq-${i}`, question: f.question, answer: f.answer }))
      : staticFaqs;

  // Testimonials
  const testimonials = TESTIMONIAL_KEYS.map((key, i) => ({
    id:        i + 1,
    name:      TESTIMONIAL_NAMES[i],
    rating:    5,
    text:      t(`pricing.testimonials.${key}.text`),
    treatment: t(`pricing.testimonials.${key}.treatment`),
  }));

  const heroImage    = sanityPricing?.heroImage ? getImageUrl(sanityPricing.heroImage) : pricingHero;
  const pageTitle    = sanityPricing?.title?.trim()     || t("pricing.title");
  const pageSubtitle = sanityPricing?.introText?.trim() || t("pricing.subtitle");
  const sortLocale   = i18n.language?.startsWith("en") ? "en" : "nb";

  // Sanity CMS categories
  const cmsPriceCategories: PriceCategory[] = (sanityPricing?.priceCategories || []).map(
    (category: any, index: number) => {
      const label        = category?.categoryName?.trim() || `Kategori ${index + 1}`;
      const categorySlug = category?.categoryRef?.slug || category?.categoryRef?.id || slugifyNo(label);
      const items        = (category?.items || []).map((item: any) => ({
        name:     item?.name || "",
        price:    item?.priceLabel || (item?.price != null ? `${item.price},-` : ""),
        duration: item?.note || "",
      }));
      return {
        id: categorySlug, label,
        path: `/${categorySlug}`,
        subcategories: [{ label, path: `/${categorySlug}`, items }],
      };
    },
  );

  // Priority: Sanity CMS > Booking API
  const effectivePriceCategories: PriceCategory[] =
    cmsPriceCategories.length > 0 ? cmsPriceCategories : bookingCategories;

  useEffect(() => {
    document.title = `${t("nav.pricing")} | CMedical`;
  }, [t, i18n.language]);

  // ─── Load durations from freetimes when a category is expanded ─────────────
  // Exact same pattern as BookingDemo's expandedCategory effect
  useEffect(() => {
    if (!expandedCategory) return;

    const category = effectivePriceCategories.find((c) => c.id === expandedCategory);
    if (!category) return;

    // Collect all apiActivityIds across all subcategories
    const activityIds = category.subcategories
      .flatMap((sub) => sub.items)
      .map((item) => item.apiActivityId)
      .filter((id): id is number => typeof id === "number");

    if (activityIds.length === 0) return;

    let cancelled = false;

    // Mark all as loading first
    setDurationByActivityId((prev) => {
      const next = { ...prev };
      for (const id of activityIds) next[id] = { status: "loading" };
      return next;
    });

    async function loadDurations() {
      const results = await mapWithConcurrency(activityIds, 3, async (id) => {
        try {
          const res  = await fetch(`/api/booking/freetimes?wbactivityId=${id}`);
          const json = (await res.json()) as {
            ok?: boolean;
            slots?: { durationMinutes?: number }[];
          };
          const slots = res.ok && json.ok && Array.isArray(json.slots) ? json.slots : [];
          const mins  = slots.find((s) => s.durationMinutes != null)?.durationMinutes;
          if (mins == null) return { id, status: "none" as const };
          return { id, status: "ready" as const, label: formatDurationMinutes(mins) };
        } catch {
          return { id, status: "none" as const };
        }
      });

      if (cancelled) return;

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
    }

    loadDurations();
    return () => { cancelled = true; };
  }, [expandedCategory, effectivePriceCategories]);

  const toggleCategory = (id: string) => {
    setExpandedCategory(expandedCategory === id ? null : id);
    setExpandedSubcategory(null);
  };
  const toggleSubcategory = (label: string) =>
    setExpandedSubcategory(expandedSubcategory === label ? null : label);
  const toggleFaq = (id: string) => setOpenFaq(openFaq === id ? null : id);

  const prioritized = ["gynekologi", "urologi", "fertilitet", "ortopedi"];
  const sortedCategories = [
    ...effectivePriceCategories
      .filter((c) => prioritized.includes(c.id))
      .sort((a, b) => prioritized.indexOf(a.id) - prioritized.indexOf(b.id)),
    ...effectivePriceCategories
      .filter((c) => !prioritized.includes(c.id))
      .sort((a, b) => a.label.localeCompare(b.label, sortLocale)),
  ];

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={sanityPricing?.seo?.metaTitle?.trim() || t("pricing.seoTitle")}
        description={sanityPricing?.seo?.metaDescription?.trim() || t("pricing.seoDescription")}
        canonical="/priser"
        breadcrumbs={[
          { name: t("pricing.breadcrumbHome"), path: "/" },
          { name: t("nav.pricing"), path: "/priser" },
        ]}
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
      <section id="prisliste" className="py-10 md:py-14 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-5xl mx-auto mb-6">
            <p className="text-sm text-muted-foreground font-light">
              {t("pricing.disclaimer")}
            </p>
          </div>

          {/* Loading skeletons */}
          {/* Loading state */}
{bookingLoading && cmsPriceCategories.length === 0 && (
  <div className="max-w-5xl mx-auto">
    {/* Spinner */}
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-foreground/10 border-t-foreground animate-spin" />
      <p className="text-sm text-muted-foreground font-light">
        Henter priser…
      </p>
    </div>

    {/* Skeleton rows below spinner */}
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

          {/* Error state */}
          {bookingError && cmsPriceCategories.length === 0 && !bookingLoading && (
            <p className="text-center text-destructive font-light py-8">
              {t("pricing.loadError", {
                defaultValue: "Could not load prices. Please try again later.",
              })}
            </p>
          )}

          {/* Category list */}
          {!bookingLoading && (
            <div className="max-w-5xl mx-auto space-y-4">
              {sortedCategories.map((category) => (
                <div
                  key={category.id}
                  className={`rounded-xl overflow-hidden transition-all duration-300 border ${
                    expandedCategory === category.id
                      ? "bg-white border-border shadow-sm"
                      : "bg-white/60 border-border/50 hover:bg-white hover:border-border"
                  }`}
                >
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between p-5 md:p-6 cursor-pointer text-left"
                    aria-expanded={expandedCategory === category.id}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl md:text-2xl font-light text-foreground">
                        {category.label}
                      </span>
                      <span className="text-sm font-light text-muted-foreground">
                        {expandedCategory === category.id
                          ? t("pricing.closePriceList")
                          : t("pricing.seePrices")}
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-foreground/5 border border-foreground/10">
                      {expandedCategory === category.id
                        ? <Minus className="w-4 h-4 text-foreground/50" />
                        : <Plus  className="w-4 h-4 text-foreground/50" />}
                    </div>
                  </button>

                  {/* Subcategories */}
                  <AnimatePresence>
                    {expandedCategory === category.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 md:px-6 pb-6 md:pb-8 space-y-3">
                          {category.subcategories.map((sub) => (
                            <div
                              key={sub.label}
                              className={`rounded-lg transition-all border ${
                                expandedSubcategory === sub.label
                                  ? "bg-secondary/60 border-border/50"
                                  : "bg-secondary/30 border-transparent hover:bg-secondary/50 hover:border-border/30"
                              }`}
                            >
                              <button
                                onClick={() => toggleSubcategory(sub.label)}
                                className="w-full flex items-center justify-between p-4 cursor-pointer"
                                aria-expanded={expandedSubcategory === sub.label}
                              >
                                <span className={`text-[15px] font-light transition-colors ${
                                  expandedSubcategory === sub.label
                                    ? "text-foreground font-normal"
                                    : "text-foreground/70"
                                }`}>
                                  {sub.label}
                                </span>
                                <div className="flex items-center gap-3">
                                  <span className="text-muted-foreground text-sm">
                                    {sub.items.length} tjenester
                                  </span>
                                  <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${
                                    expandedSubcategory === sub.label ? "rotate-90 text-foreground/50" : ""
                                  }`} />
                                </div>
                              </button>

                              {/* Price items */}
                              <AnimatePresence>
                                {expandedSubcategory === sub.label && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="px-4 pb-4">
                                      <div className="pt-2 border-t border-border/50">
                                        {sub.items.map((item, idx) => {
                                          // ─── Same pattern as BookingDemo ──
                                          const { label: durationLabel, loading: durationLoading } =
                                            resolveDisplayDuration(item, durationByActivityId);

                                          return (
                                            <button
                                              key={idx}
                                              onClick={() =>
                                                navigate(
                                                  `/booking?kategori=${category.id}&tjeneste=${encodeURIComponent(item.name)}`,
                                                )
                                              }
                                              className="w-full flex items-center justify-between py-3 border-b border-border/30 last:border-b-0 hover:bg-white rounded-sm px-2 -mx-2 transition-colors group/item text-left"
                                            >
                                              <div className="flex-1">
                                                <p className="text-foreground text-sm font-light underline underline-offset-4 decoration-foreground/20 group-hover/item:decoration-foreground/60 transition-colors">
                                                  {item.name}
                                                </p>
                                                {/* Duration — loading spinner or label */}
                                                {durationLoading ? (
                                                  <p className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5 animate-pulse">
                                                    <Clock className="w-3 h-3" />
                                                    Henter varighet…
                                                  </p>
                                                ) : durationLabel ? (
                                                  <p className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                                                    <Clock className="w-3 h-3" />
                                                    {durationLabel}
                                                  </p>
                                                ) : null}
                                              </div>
                                              <div className="flex items-center gap-3">
                                                <p className="font-normal text-foreground text-sm whitespace-nowrap">
                                                  {item.price === "0,-" ? "Gratis" : item.price}
                                                </p>
                                                <ArrowRight className="w-3.5 h-3.5 text-foreground/20 group-hover/item:text-foreground/50 transition-colors" />
                                              </div>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {sortedCategories.length === 0 && !bookingLoading && (
                <p className="text-center text-muted-foreground font-light py-8">
                  {t("pricing.subtitle")}
                </p>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 md:mt-20 text-center">
            <button
              onClick={() => navigate("/booking")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-dark text-white rounded-full font-normal hover:bg-brand-dark/90 transition-colors"
            >
              {t("nav.bookAppointment")}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
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
            <h2 className="text-3xl md:text-4xl font-normal text-brand-dark">
              {t("pricing.testimonialsTitle")}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-2xl p-6 shadow-sm">
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
                  <span className="text-xs text-muted-foreground">{testimonial.treatment}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-normal text-foreground mb-8">
              {t("pricing.faqTitle")}
            </h3>
            <div className="space-y-0">
              {faqs.map((faq, index) => (
                <div key={faq.id} className={index !== 0 ? "border-t border-border" : ""}>
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex items-center justify-between py-5 text-left group"
                  >
                    <span className="text-base md:text-lg font-normal text-foreground group-hover:text-foreground/80 transition-colors">
                      {faq.question}
                    </span>
                    <div className={`w-8 h-8 rounded-full border border-border flex items-center justify-center transition-all ${
                      openFaq === faq.id ? "bg-secondary" : ""
                    }`}>
                      {openFaq === faq.id
                        ? <Minus className="w-4 h-4 text-muted-foreground" />
                        : <Plus  className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {openFaq === faq.id && (
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

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-brand-dark">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-normal text-white mb-6">
              {t("cta.title")}
            </h2>
            <p className="text-base md:text-[17px] font-light text-white/70 mb-10 max-w-xl mx-auto">
              {t("cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="cta-dark" size="lg" className="px-8" onClick={() => navigate("/booking")}>
                {t("nav.bookAppointment")}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="cta-outline-dark" size="lg" asChild>
                <Link to="/kontakt">{t("cta.contactUs")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Priser;