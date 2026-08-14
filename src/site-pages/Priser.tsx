"use client";

import { AssetImg } from "@/components/AssetImg";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Plus, Minus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { Link, useNavigate } from "@/lib/router";
import { motion, AnimatePresence } from "framer-motion";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { usePricingPage } from "@/hooks/useSanity";
import { PageSectionsRenderer } from "@/components/page-sections/PageSectionsRenderer";
import { PageSEO } from "@/components/seo/PageSEO";
import { buildMedicalWebPageGeoJsonLd } from "@/lib/seo/geo-page";
import { getImageUrl } from "@/lib/sanity/image-url";
import { SplitHero } from "@/components/layout/SplitHero";
import { useParams } from "@/lib/router";
import { useTranslation } from "react-i18next";
import { formatDurationMinutes } from "@/lib/booking/duration";
import { bookingUrlForPricingItem, slugifyNo } from "@/lib/bookingLinks";
import {
  isUsableBookingCtaBody,
  resolveBookingCtaFromCollection,
} from "@/lib/sanity/cta-dual-read";
import { resolveHomepageSpecialists } from "@/lib/sanity/homepage-specialists";
import {
  behandlingerCategorySegment,
  categoryLandingPath,
  FLERE_FAGOMRADER_CATEGORY_ID,
  normalizeCategoryRouteKey,
} from "@/lib/sanity/category-keys";
import { PricingPageCta } from "@/components/pricing/PricingPageCta";

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
  /** CMS origin: Metodika-imported vs Sanity-only. */
  source: "metodika" | "sanity";
  /** Metodika wbactivity id — booking only when source is metodika. */
  apiActivityId?: number;
  bookable: boolean;
}

interface PriceSubcategory {
  label: string;
  /** Localized “Les mer om …” path when a treatment/category target exists. */
  learnMorePath: string | null;
  items: PriceItem[];
}

interface PriceCategory {
  id: string;
  label: string;
  /** Category page slug for booking + “see all” links (Sanity relationship). */
  bookingCategorySlug: string;
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
  // Prefer CMS note (matches curated reference). Only enrich from Metodika when note is empty.
  if (item.duration?.trim()) {
    return { label: item.duration.trim(), loading: false };
  }
  if (item.apiActivityId != null) {
    const state = durationByActivityId[item.apiActivityId];
    if (!state || state.status === "none") {
      return { label: null, loading: false };
    }
    if (state.status === "loading") {
      return { label: null, loading: true };
    }
    return { label: state.label, loading: false };
  }
  return { label: null, loading: false };
}

function mapSanityPriceItem(raw: {
  name?: string;
  price?: number;
  priceLabel?: string;
  note?: string;
  source?: string;
  apiActivityId?: number;
}): PriceItem | null {
  const name = raw?.name?.trim();
  if (!name) return null;
  const source: "metodika" | "sanity" =
    raw.source === "metodika" ? "metodika" : "sanity";
  const apiActivityId =
    typeof raw.apiActivityId === "number" && raw.apiActivityId > 0
      ? raw.apiActivityId
      : undefined;
  const priceLabel = raw.priceLabel?.trim();
  const price =
    priceLabel ||
    (typeof raw.price === "number" ? `${raw.price},-` : "");
  // Booking CTA only for explicit Metodika-origin lines with a valid activity id.
  const bookable = source === "metodika" && apiActivityId != null;
  return {
    name,
    price,
    duration: raw.note?.trim() ?? "",
    source,
    apiActivityId: source === "metodika" ? apiActivityId : undefined,
    bookable,
  };
}

function resolveSubcategoryLearnMorePath(
  sub: {
    linkToCategoryPage?: boolean;
    treatmentRef?: {
      slug?: string;
      categorySlug?: string;
      categoryId?: string;
    } | null;
  },
  bookingCategorySlug: string,
  locale: "no" | "en",
): string | null {
  const treatmentSlug = String(sub.treatmentRef?.slug ?? "").trim();
  if (treatmentSlug) {
    const routeKey =
      normalizeCategoryRouteKey(
        String(
          sub.treatmentRef?.categoryId ||
            sub.treatmentRef?.categorySlug ||
            bookingCategorySlug,
        ),
      ) || bookingCategorySlug;
    // Prefer parent pricing category for known top-level booking slugs so a
    // mis-linked treatment.category cannot break Fertilitet → /behandlinger/fertilitet/…
    const segmentSource =
      bookingCategorySlug && bookingCategorySlug !== "flere-fagomrader"
        ? normalizeCategoryRouteKey(bookingCategorySlug) || routeKey
        : routeKey;
    const segment = behandlingerCategorySegment(
      segmentSource === "annet" ? FLERE_FAGOMRADER_CATEGORY_ID : segmentSource,
      locale,
    );
    return `/behandlinger/${segment}/${treatmentSlug}`;
  }

  if (sub.linkToCategoryPage) {
    const key =
      normalizeCategoryRouteKey(bookingCategorySlug) || bookingCategorySlug;
    if (key === FLERE_FAGOMRADER_CATEGORY_ID || key === "annet") {
      return `/behandlinger/${behandlingerCategorySegment(FLERE_FAGOMRADER_CATEGORY_ID, locale)}`;
    }
    return categoryLandingPath(key, locale);
  }

  return null;
}

/** Map CMS priceCategories → UI model. Sanity is the list source of truth. */
function mapSanityPriceCategories(
  rawCategories: unknown,
  locale: "no" | "en",
): PriceCategory[] {
  if (!Array.isArray(rawCategories)) return [];

  return rawCategories
    .map((raw: any, index: number) => {
      const label = String(raw?.categoryName ?? "").trim();
      if (!label) return null;

      const bookingCategorySlug =
        String(raw?.bookingCategorySlug ?? raw?.categoryRef?.slug ?? "").trim() ||
        slugifyNo(label);

      const fromSubs: PriceSubcategory[] = Array.isArray(raw?.subcategories)
        ? raw.subcategories
            .map((sub: any) => {
              const subLabel = String(sub?.label ?? "").trim() || label;
              const items = (Array.isArray(sub?.items) ? sub.items : [])
                .map(mapSanityPriceItem)
                .filter((item: PriceItem | null): item is PriceItem => item != null);
              if (items.length === 0) return null;
              return {
                label: subLabel,
                learnMorePath: resolveSubcategoryLearnMorePath(
                  sub,
                  bookingCategorySlug,
                  locale,
                ),
                items,
              };
            })
            .filter(Boolean)
        : [];

      // Legacy flat items → single subcategory
      const legacyItems = (Array.isArray(raw?.items) ? raw.items : [])
        .map(mapSanityPriceItem)
        .filter((item: PriceItem | null): item is PriceItem => item != null);

      const subcategories =
        fromSubs.length > 0
          ? (fromSubs as PriceSubcategory[])
          : legacyItems.length > 0
            ? [
                {
                  label,
                  learnMorePath: null,
                  items: legacyItems,
                },
              ]
            : [];

      if (subcategories.length === 0) return null;

      return {
        id: `${slugifyNo(label) || "cat"}-${index}`,
        label,
        bookingCategorySlug,
        path: `/${bookingCategorySlug}`,
        subcategories,
      } satisfies PriceCategory;
    })
    .filter((c): c is PriceCategory => c != null);
}

// ─── Component ────────────────────────────────────────────────────────────────
const Priser = ({ isChatOpen }: PageProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "en" ? "en" : "nb";

  const [activeCategory, setActiveCategory] = useState<string>("");
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [navTop, setNavTop] = useState(80);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const navScrollerRef = useRef<HTMLDivElement | null>(null);
  const overviewRef = useRef<HTMLDivElement | null>(null);
  const pillRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const suspendSpyUntil = useRef(0);

  const [durationByActivityId, setDurationByActivityId] = useState<Record<number, DurationState>>({});
  const durationByActivityIdRef = useRef(durationByActivityId);
  durationByActivityIdRef.current = durationByActivityId;
  const { sorted: allSpecialists } = useSpecialistsData();
  const { data: sanityPricing, isLoading: pricingQueryLoading } = usePricingPage();
  const specialistsConfig = sanityPricing?.specialistsSection;
  const specialists = useMemo(
    () => resolveHomepageSpecialists(specialistsConfig, allSpecialists),
    [specialistsConfig, allSpecialists],
  );

  // Copy comes from CMS when present; i18n fills gaps only when the section actually renders.
  const specialistsEyebrow =
    specialistsConfig?.eyebrow?.trim() || t("pricing.specialistsEyebrow");
  const specialistsTitle =
    specialistsConfig?.heading?.trim() || t("pricing.specialistsTitle");
  const specialistsSubtitle =
    specialistsConfig?.intro?.trim() || t("pricing.specialistsSubtitle");
  const specialistsSeeAllLabel =
    specialistsConfig?.seeAllLabel?.trim() || t("pricing.seeAllSpecialists");
  const specialistsSeeAllHref = specialistsConfig?.seeAllHref?.trim() || "/om-oss";

  const pricingLoading = pricingQueryLoading;
  const routeLocale: "no" | "en" = locale === "en" ? "en" : "no";
  const categoriesFromCms = useMemo(
    () => mapSanityPriceCategories(sanityPricing?.priceCategories, routeLocale),
    [sanityPricing?.priceCategories, routeLocale],
  );
  const hasCmsPrices = !pricingLoading && categoriesFromCms.length > 0;

  const faqs = useMemo(() => {
    const rows = (sanityPricing?.faqs ?? []) as Array<{
      _id?: string;
      question?: string;
      answer?: string;
    }>;
    return rows
      .filter((item) => Boolean(item?.question?.trim() && item?.answer?.trim()))
      .map((item, index) => ({
        _id: item._id?.trim() || `pricing-faq-${index}`,
        question: item.question!.trim(),
        answer: item.answer!.trim(),
      })) satisfies PricingFaq[];
  }, [sanityPricing?.faqs]);

  const testimonials: PricingTestimonial[] = (sanityPricing?.testimonials ?? []).filter(
    (item): item is PricingTestimonial =>
      Boolean(item?._id && item?.name && item?.text && typeof item.rating === "number"),
  );

  const heroImage    = sanityPricing?.heroImage ? getImageUrl(sanityPricing.heroImage) : undefined;
  const pageTitle    = sanityPricing?.title?.trim() ?? "";
  const pageSubtitle = sanityPricing?.introText?.trim() ?? "";
  const seoTitle     = sanityPricing?.seo?.metaTitle?.trim() ?? pageTitle;
  const seoDescription = sanityPricing?.seo?.metaDescription?.trim() ?? pageSubtitle;
  const testimonialsTitle =
    sanityPricing?.testimonialsTitle?.trim() || t("pricing.testimonialsTitle");
  const faqTitle = sanityPricing?.faqTitle?.trim() || t("pricing.faqTitle");
  // Reference Pricing keeps a hero “Bestill time” even when the page-owned CTA exists.
  const showHeroBookingCta = true;
  const pricingCtaConfig = useMemo(() => {
    const band = sanityPricing?.pricingCta as
      | {
          title?: string;
          subtitle?: string;
          primaryLabel?: string;
          primaryPath?: string;
          secondaryLabel?: string;
          secondaryPath?: string;
          showSecondaryButton?: boolean;
          bookingCategory?: { categoryId?: string };
          quickInfoItems?: unknown;
          backgroundColor?: string;
          textColor?: string;
          ctaCollection?: unknown;
        }
      | null
      | undefined;
    if (!band) return null;
    return resolveBookingCtaFromCollection(band.ctaCollection, band);
  }, [sanityPricing?.pricingCta]);
  const preferPricingCta = isUsableBookingCtaBody(pricingCtaConfig ?? {});

  useEffect(() => {
    if (seoTitle) document.title = `${seoTitle} | CMedical`;
  }, [seoTitle]);

  // Preserve Sanity/CMS order (matches curated reference). Do not re-sort alphabetically.
  const sortedCategories = categoriesFromCms;

  useEffect(() => {
    if (!activeCategory && sortedCategories.length > 0) {
      setActiveCategory(sortedCategories[0].id);
    }
  }, [activeCategory, sortedCategories]);

  // ─── Load durations from wbfreetimes `timelength` (→ durationMinutes) ───────
  // Same source as BookingDemo. Load per category in small chunks so we do not
  // blast all ~80 activities at once (upstream 429 / long hang left every row
  // stuck on status "loading" → "Loading duration...").
  useEffect(() => {
    if (sortedCategories.length === 0) return;

    let cancelled = false;
    const inFlightIds = new Set<number>();
    const FREETIMES_CHUNK = 8;

    async function loadDurationsForIds(idsToFetch: number[]) {
      if (idsToFetch.length === 0) return;

      for (const id of idsToFetch) inFlightIds.add(id);

      setDurationByActivityId((prev) => {
        const next = { ...prev };
        for (const id of idsToFetch) next[id] = { status: "loading" };
        return next;
      });

      const results: Array<
        | { id: number; status: "ready"; label: string }
        | { id: number; status: "none" }
      > = [];

      try {
        for (let i = 0; i < idsToFetch.length; i += FREETIMES_CHUNK) {
          if (cancelled) return;
          const chunk = idsToFetch.slice(i, i + FREETIMES_CHUNK);
          const res = await fetch(
            `/api/booking/freetimes?wbactivityIds=${chunk.join(",")}`,
          );
          const json = (await res.json()) as {
            ok?: boolean;
            byActivityId?: Record<string, { durationMinutes?: number }[]>;
            slots?: { durationMinutes?: number }[];
          };

          for (const id of chunk) {
            const slots =
              json.byActivityId?.[String(id)] ??
              (chunk.length === 1 && Array.isArray(json.slots) ? json.slots : []);
            const mins = slots.find((s) => s.durationMinutes != null)?.durationMinutes;
            if (mins == null) {
              results.push({ id, status: "none" });
            } else {
              results.push({
                id,
                status: "ready",
                label: formatDurationMinutes(mins),
              });
            }
          }
        }
      } catch {
        for (const id of idsToFetch) {
          if (!results.some((r) => r.id === id)) {
            results.push({ id, status: "none" });
          }
        }
      }

      if (cancelled) return;

      setDurationByActivityId((prev) => {
        const next = { ...prev };
        for (const result of results) {
          next[result.id] =
            result.status === "ready"
              ? { status: "ready", label: result.label }
              : { status: "none" };
          inFlightIds.delete(result.id);
        }
        return next;
      });
    }

    async function loadAllCategories() {
      // Resolve the first (above-the-fold) category first, then the rest.
      for (const category of sortedCategories) {
        if (cancelled) return;
        // Only fetch Metodika duration for bookable Metodika lines when CMS note is empty.
        const activityIds = category.subcategories
          .flatMap((sub) => sub.items)
          .filter(
            (item) =>
              item.bookable &&
              !item.duration?.trim() &&
              typeof item.apiActivityId === "number",
          )
          .map((item) => item.apiActivityId as number);

        const idsToFetch = activityIds.filter((id) => {
          const cached = durationByActivityIdRef.current[id];
          return cached?.status !== "ready" && cached?.status !== "none";
        });

        await loadDurationsForIds(idsToFetch);
      }
    }

    void loadAllCategories();

    return () => {
      cancelled = true;
      if (inFlightIds.size === 0) return;
      setDurationByActivityId((prev) => {
        const next = { ...prev };
        let changed = false;
        for (const id of inFlightIds) {
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
    if (sortedCategories.length === 0) return;

    const pickActiveFromScroll = () => {
      if (Date.now() < suspendSpyUntil.current) return;
      const marker = navTop + 72;
      let currentId = sortedCategories[0]?.id ?? "";
      for (const category of sortedCategories) {
        const el = document.getElementById(`cat-${category.id}`);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= marker) {
          currentId = category.id;
        }
      }
      if (currentId) setActiveCategory(currentId);
    };

    pickActiveFromScroll();
    window.addEventListener("scroll", pickActiveFromScroll, { passive: true });
    window.addEventListener("resize", pickActiveFromScroll);
    return () => {
      window.removeEventListener("scroll", pickActiveFromScroll);
      window.removeEventListener("resize", pickActiveFromScroll);
    };
  }, [sortedCategories, navTop]);

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

  const itemBookingUrl = (category: PriceCategory, item: PriceItem) =>
    bookingUrlForPricingItem({
      kategori: category.bookingCategorySlug,
      aktivitetId: item.apiActivityId,
      tjeneste: item.name,
    });

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
        title={pageTitle}
        description={pageSubtitle}
        image={heroImage}
        imageAlt={pageTitle}
        primaryCta={
          showHeroBookingCta
            ? { label: t("nav.bookAppointment"), to: "/booking" }
            : undefined
        }
        secondaryCta={{ label: t("cta.contactUs"), to: "/kontakt" }}
        footnote={t("pricing.disclaimer")}
      />

      {/* Price List Section */}
      <section id="prisliste" className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          {pricingLoading && (
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

          {!pricingLoading && !hasCmsPrices && (
            <p className="text-center text-destructive font-light py-8">
              {t("pricing.loadError")}
            </p>
          )}

          {hasCmsPrices && (
            <>
              <div className="max-w-5xl mx-auto">
                <div className="hidden md:block mb-10 md:mb-14 text-left" ref={overviewRef}>
                  <h2 className="font-serif text-3xl md:text-[2.75rem] font-normal text-brand-dark mb-3 tracking-tight">
                    {t("pricing.menuTitle")}
                  </h2>
                  <p className="text-sm font-light text-brand-dark/55 mb-7">
                    {t("pricing.jumpToCategory")}
                  </p>
                  <div className="flex flex-wrap justify-start gap-2 md:gap-2.5">
                    {sortedCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => scrollToCat(category.id)}
                        className="inline-flex items-center justify-center px-4 py-2 min-h-[40px] rounded-full text-sm font-light whitespace-nowrap border bg-white text-brand-dark border-brand-dark/20 hover:bg-brand-dark hover:text-brand-warm hover:border-brand-dark transition-colors"
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
                <div className="max-w-5xl mx-auto px-4 md:px-0">
                  <div
                    ref={navScrollerRef}
                    className="flex gap-2 overflow-x-auto py-2.5 scrollbar-hide [scroll-behavior:smooth]"
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
                          className={`inline-flex items-center justify-center px-4 py-2 min-h-[40px] rounded-full text-sm font-light whitespace-nowrap border transition-colors shrink-0 ${
                            isActive
                              ? "bg-brand-dark text-white border-brand-dark"
                              : "bg-white text-brand-dark border-brand-dark/20 hover:bg-brand-dark hover:text-white hover:border-brand-dark"
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
                      <h2 className="font-serif text-2xl md:text-3xl font-normal text-brand-dark">
                        {category.label}
                      </h2>
                    </div>

                    <div className="space-y-14 md:space-y-16">
                      {category.subcategories.map((sub, subIndex) => (
                        <div
                          key={`${category.id}-${sub.label}`}
                          className="grid grid-cols-1 md:grid-cols-[minmax(200px,28%)_1fr] gap-4 md:gap-12 md:items-start"
                        >
                          <div className="md:sticky md:top-48 md:self-start md:pr-2">
                            <h3 className="text-base md:text-lg font-semibold text-brand-dark leading-snug">
                              {sub.label}
                            </h3>
                            {sub.learnMorePath ? (
                              <Link
                                to={sub.learnMorePath}
                                className="mt-2 inline-flex items-center gap-1 text-xs font-light text-brand-dark/70 hover:text-brand-dark transition-colors"
                              >
                                {t("pricing.learnMoreSubcategory", {
                                  subcategory: sub.label.toLowerCase(),
                                })}
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            ) : null}
                          </div>

                          <div>
                            <ul className="divide-y divide-brand-mid/30">
                              {sub.items.map((item, idx) => {
                                const { label: durationLabel, loading: durationLoading } =
                                  resolveDisplayDuration(item, durationByActivityId);
                                const itemKey = `${category.id}-${subIndex}-${idx}`;
                                const priceLabel =
                                  item.price === "0,-" ||
                                  item.price === "0" ||
                                  /^gratis$/i.test(item.price)
                                    ? t("pricing.free")
                                    : item.price;
                                const bookingUrl = item.bookable
                                  ? itemBookingUrl(category, item)
                                  : null;

                                return (
                                  <li key={itemKey} className="py-3 md:py-5">
                                    <div className="flex items-start gap-3">
                                      <div className="flex-1 min-w-0">
                                        <p className="text-[15px] md:text-base font-normal text-brand-dark leading-snug">
                                          {item.name}
                                        </p>
                                        {(durationLoading || durationLabel) && (
                                          <p className="mt-1 text-xs font-light text-brand-dark/60 max-w-xl">
                                            {durationLoading
                                              ? t("pricing.loadingDuration")
                                              : durationLabel}
                                          </p>
                                        )}
                                      </div>

                                      <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-4 shrink-0 pt-0.5">
                                        <span className="text-[15px] md:text-sm font-normal text-brand-dark tabular-nums whitespace-nowrap md:min-w-[5.5rem] text-right">
                                          {priceLabel}
                                        </span>
                                        {bookingUrl ? (
                                          <Link
                                            to={bookingUrl}
                                            className="inline-flex items-center justify-center px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs font-light text-brand-dark border border-brand-dark/25 hover:border-brand-dark/60 transition-colors whitespace-nowrap md:min-w-[7rem]"
                                          >
                                            {t("nav.bookAppointment")}
                                          </Link>
                                        ) : (
                                          <span className="hidden md:block min-w-[7rem] shrink-0" aria-hidden />
                                        )}
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

                    {category.bookingCategorySlug &&
                    category.bookingCategorySlug !== "flere-fagomrader" ? (
                    <div className="mt-10 pt-6 border-t border-brand-mid/30">
                      <Link
                        to={categoryLandingPath(
                          normalizeCategoryRouteKey(category.bookingCategorySlug) ||
                            category.bookingCategorySlug,
                          routeLocale,
                        )}
                        className="inline-flex items-center gap-2 text-sm font-light text-brand-dark hover:gap-3 transition-all"
                      >
                        {t("pricing.seeAllCategoryServices", {
                          category: category.label.toLowerCase(),
                        })}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                    ) : null}
                  </section>
                ))}
              </div>

              {preferPricingCta ? null : (
                <div className="mt-20 md:mt-24 text-center">
                  <button
                    onClick={() => navigate("/booking")}
                    className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-full font-normal text-brand-dark border border-brand-dark/25 hover:border-brand-dark/60 transition-colors"
                  >
                    {t("nav.bookAppointment")}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Specialists Section — page-owned specialistsSection (not Website bands).
          Intentional fixed dark grid (CMS layout is not used on Pricing).
          Hide when displayMode is missing/invalid or resolution returns no specialists. */}
      {specialists.length > 0 ? (
      <section className="py-16 md:py-24 bg-brand-dark">
        <div className="container mx-auto px-4 md:px-8">
          <div className="mb-10">
            {specialistsEyebrow ? (
              <p className="text-sm text-white/60 mb-3 font-light">{specialistsEyebrow}</p>
            ) : null}
            {specialistsTitle ? (
              <h2 className="text-3xl md:text-4xl font-normal text-white">{specialistsTitle}</h2>
            ) : null}
            {specialistsSubtitle ? (
              <p className="text-white/70 mt-3 max-w-2xl font-light">{specialistsSubtitle}</p>
            ) : null}
          </div>
          {/* Fixed Pricing presentation — do not branch on specialistsConfig.layout */}
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
              <Link to={specialistsSeeAllHref}>
                {specialistsSeeAllLabel}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      ) : null}

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

      <PageSectionsRenderer
        sections={(sanityPricing?.pageSections ?? []).filter(
          (section: { _type?: string }) => section?._type !== "pageSectionBookingCta",
        )}
      />
      <PricingPageCta config={pricingCtaConfig} />

    </PageLayout>
  );
};

export default Priser;
