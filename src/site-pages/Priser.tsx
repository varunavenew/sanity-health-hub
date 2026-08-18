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
import {
  cmsCopyOrI18n,
  localizePricingText,
} from "@/lib/pricing/pricing-i18n";
import { syncI18nLanguage } from "@/lib/i18n/sync-language";

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
  /** CMS origin: Metodika (bookable) vs CMedical design-only. */
  source: "metodika" | "cmedical";
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

/** Demo row price: "fra 2.100,-" unless the CMS label is already special (Gratis, Ta kontakt, …). */
function formatDisplayPrice(price: string, locale: "no" | "en"): string {
  const raw = price.trim();
  if (!raw) return "";
  if (/^(fra|from|pris fra|price from)\b/i.test(raw)) return raw;
  if (/ta kontakt|contact us|på forespørsel|on request/i.test(raw)) return raw;
  const digits = raw.replace(/[^0-9]/g, "");
  if (!digits) return raw;
  const n = parseInt(digits, 10);
  if (!Number.isFinite(n) || n <= 0) return raw;
  const formatted = n
    .toLocaleString("nb-NO")
    .replace(/\u00A0/g, ".")
    .replace(/\s/g, ".");
  return locale === "en" ? `from ${formatted},-` : `fra ${formatted},-`;
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
  const source: "metodika" | "cmedical" =
    raw.source === "metodika" ? "metodika" : "cmedical";
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
    // mis-linked treatment.category cannot break Fertilitet → /fertilitet/…
    const segmentSource =
      bookingCategorySlug && bookingCategorySlug !== "flere-fagomrader"
        ? normalizeCategoryRouteKey(bookingCategorySlug) || routeKey
        : routeKey;
    const segment = behandlingerCategorySegment(
      segmentSource === "annet" ? FLERE_FAGOMRADER_CATEGORY_ID : segmentSource,
      locale,
    );
    return `/${segment}/${treatmentSlug}`;
  }

  if (sub.linkToCategoryPage) {
    const key =
      normalizeCategoryRouteKey(bookingCategorySlug) || bookingCategorySlug;
    if (key === FLERE_FAGOMRADER_CATEGORY_ID || key === "annet") {
      return `/${behandlingerCategorySegment(FLERE_FAGOMRADER_CATEGORY_ID, locale)}`;
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
      const label = localizePricingText(
        String(raw?.categoryName ?? "").trim(),
        locale,
      );
      if (!label) return null;

      const bookingCategorySlug =
        String(raw?.bookingCategorySlug ?? raw?.categoryRef?.slug ?? "").trim() ||
        slugifyNo(label);

      const fromSubs: PriceSubcategory[] = Array.isArray(raw?.subcategories)
        ? raw.subcategories
            .map((sub: any) => {
              const subLabel =
                localizePricingText(String(sub?.label ?? "").trim(), locale) ||
                label;
              const items = (Array.isArray(sub?.items) ? sub.items : [])
                .map(mapSanityPriceItem)
                .filter((item: PriceItem | null): item is PriceItem => item != null)
                .map((item) => ({
                  ...item,
                  name: localizePricingText(item.name, locale),
                  duration: localizePricingText(item.duration, locale),
                  price: localizePricingText(item.price, locale),
                }));
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
        .filter((item: PriceItem | null): item is PriceItem => item != null)
        .map((item) => ({
          ...item,
          name: localizePricingText(item.name, locale),
          duration: localizePricingText(item.duration, locale),
          price: localizePricingText(item.price, locale),
        }));

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

  useEffect(() => {
    syncI18nLanguage(locale === "en" ? "en" : "nb");
  }, [locale]);

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
  const routeLocale: "no" | "en" = locale === "en" ? "en" : "no";
  const specialistsConfig = sanityPricing?.specialistsSection;
  const specialists = useMemo(
    () => resolveHomepageSpecialists(specialistsConfig, allSpecialists),
    [specialistsConfig, allSpecialists],
  );

  // Copy comes from CMS when present; i18n fills gaps only when the section actually renders.
  const specialistsEyebrow = cmsCopyOrI18n(
    specialistsConfig?.eyebrow,
    t("pricing.specialistsEyebrow"),
    routeLocale,
  );
  const specialistsTitle = cmsCopyOrI18n(
    specialistsConfig?.heading,
    t("pricing.specialistsTitle"),
    routeLocale,
  );
  const specialistsSubtitle = cmsCopyOrI18n(
    specialistsConfig?.intro,
    t("pricing.specialistsSubtitle"),
    routeLocale,
  );
  const specialistsSeeAllLabel = cmsCopyOrI18n(
    specialistsConfig?.seeAllLabel,
    t("pricing.seeAllSpecialists"),
    routeLocale,
  );
  const specialistsSeeAllHref = specialistsConfig?.seeAllHref?.trim() || "/om-oss";

  const pricingLoading = pricingQueryLoading;
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
    const fromCms = rows
      .filter((item) => Boolean(item?.question?.trim() && item?.answer?.trim()))
      .map((item, index) => ({
        _id: item._id?.trim() || `pricing-faq-${index}`,
        question: item.question!.trim(),
        answer: item.answer!.trim(),
      })) satisfies PricingFaq[];
    const cmsLooksNorwegian =
      routeLocale === "en" &&
      fromCms.some((item) => /[æøåÆØÅ]|henvisning|betaling|forsikring|avbestill/i.test(item.question));
    if (cmsLooksNorwegian || (routeLocale === "en" && fromCms.length === 0)) {
      return [
        {
          _id: "pricing-faq-referral",
          question: t("pricing.faqs.referral.question"),
          answer: t("pricing.faqs.referral.answer"),
        },
        {
          _id: "pricing-faq-payment",
          question: t("pricing.faqs.payment.question"),
          answer: t("pricing.faqs.payment.answer"),
        },
        {
          _id: "pricing-faq-insurance",
          question: t("pricing.faqs.insurance.question"),
          answer: t("pricing.faqs.insurance.answer"),
        },
        {
          _id: "pricing-faq-cancellation",
          question: t("pricing.faqs.cancellation.question"),
          answer: t("pricing.faqs.cancellation.answer"),
        },
      ] satisfies PricingFaq[];
    }
    return fromCms;
  }, [sanityPricing?.faqs, routeLocale, t]);

  const testimonials: PricingTestimonial[] = (sanityPricing?.testimonials ?? [])
    .filter(
      (item): item is PricingTestimonial =>
        Boolean(item?._id && item?.name && item?.text && typeof item.rating === "number"),
    )
    .map((item) => ({
      ...item,
      text: localizePricingText(item.text, routeLocale),
      treatment: item.treatment
        ? localizePricingText(item.treatment, routeLocale)
        : item.treatment,
    }));

  const heroImage    = sanityPricing?.heroImage ? getImageUrl(sanityPricing.heroImage) : undefined;
  const pageTitle = cmsCopyOrI18n(
    sanityPricing?.title,
    t("pricing.title"),
    routeLocale,
  );
  const pageSubtitle = cmsCopyOrI18n(
    sanityPricing?.introText,
    t("pricing.subtitle"),
    routeLocale,
  );
  const seoTitle = cmsCopyOrI18n(
    sanityPricing?.seo?.metaTitle,
    t("pricing.seoTitle"),
    routeLocale,
  );
  const seoDescription = cmsCopyOrI18n(
    sanityPricing?.seo?.metaDescription,
    t("pricing.seoDescription"),
    routeLocale,
  );
  const testimonialsTitle = cmsCopyOrI18n(
    sanityPricing?.testimonialsTitle,
    t("pricing.testimonialsTitle"),
    routeLocale,
  );
  const faqTitle = cmsCopyOrI18n(
    sanityPricing?.faqTitle,
    t("pricing.faqTitle"),
    routeLocale,
  );
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

      {/* Price List Section — layout matches avenewdemo /priser */}
      <section id="prisliste" className="py-16 md:py-24 bg-background">
        <div className="page-shell">
          {pricingLoading && (
            <div>
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
                    className="h-16 rounded-[var(--radius)] bg-muted animate-pulse"
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
              <div className="hidden md:block mb-12 md:mb-16" ref={overviewRef}>
                <h2 className="text-3xl md:text-4xl font-light text-brand-dark">
                  {t("pricing.menuTitle")}
                </h2>
                <p className="text-xs font-light text-brand-dark/60 mb-4">
                  {t("pricing.jumpToCategory")}
                </p>
                <div className="flex flex-wrap justify-start gap-2">
                  {sortedCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => scrollToCat(category.id)}
                      className="inline-flex items-center justify-center px-5 py-3 rounded-[var(--radius)] text-sm font-light whitespace-nowrap border bg-white text-brand-dark border-brand-dark/20 hover:bg-brand-dark hover:text-brand-warm hover:border-brand-dark transition-colors"
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className={`sticky z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 -mx-[var(--gutter)] px-[var(--gutter)] ${
                  showStickyNav
                    ? "mb-8 md:mb-10 py-3"
                    : "mb-6 md:mb-0 md:h-0 md:overflow-hidden md:opacity-0 md:pointer-events-none"
                }`}
                style={{ top: `${navTop}px` }}
              >
                <div
                  ref={navScrollerRef}
                  className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide [scroll-behavior:smooth]"
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
                        type="button"
                        onClick={() => scrollToCat(category.id)}
                        className="chip-filter chip-filter-light"
                        data-active={isActive ? "true" : undefined}
                        aria-current={isActive ? "true" : undefined}
                      >
                        {category.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-16 md:space-y-20">
                {sortedCategories.map((category) => (
                  <section key={category.id} id={`cat-${category.id}`} className="scroll-mt-40">
                    <h2 className="text-2xl md:text-3xl font-light text-brand-dark mb-8 md:mb-10">
                      {category.label}
                    </h2>

                    <div className="space-y-12 md:space-y-16">
                      {category.subcategories.map((sub, subIndex) => (
                        <div
                          key={`${category.id}-${sub.label}`}
                          className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5 md:gap-12 lg:gap-16 md:items-start"
                        >
                          <div className="md:sticky md:top-48 md:self-start">
                            <h3 className="text-sm font-normal text-brand-dark">
                              {sub.label}
                            </h3>
                            {sub.learnMorePath ? (
                              <Link
                                to={sub.learnMorePath}
                                className="inline-flex items-center gap-1 mt-2 text-xs font-light text-brand-dark/70 hover:text-brand-dark hover:gap-2 transition-all"
                              >
                                {t("pricing.learnMoreSubcategory", {
                                  subcategory: sub.label.toLowerCase(),
                                })}
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            ) : null}
                          </div>

                          <div>
                            <ul className="divide-y divide-brand-dark/10">
                              {sub.items.map((item, idx) => {
                                const { label: durationLabel, loading: durationLoading } =
                                  resolveDisplayDuration(item, durationByActivityId);
                                const itemKey = `${category.id}-${subIndex}-${idx}`;
                                const priceLabel =
                                  item.price === "0,-" ||
                                  item.price === "0" ||
                                  /^gratis$/i.test(item.price)
                                    ? t("pricing.free")
                                    : formatDisplayPrice(item.price, routeLocale);
                                const bookingUrl = item.bookable
                                  ? itemBookingUrl(category, item)
                                  : null;

                                return (
                                  <li key={itemKey} className="py-5 first:pt-0">
                                    <div className="flex items-start md:items-center justify-between gap-4 md:gap-6">
                                      <div className="min-w-0 flex-1">
                                        <p className="font-normal text-brand-dark break-words [overflow-wrap:anywhere]">
                                          {item.name}
                                        </p>
                                        {(durationLoading || durationLabel) && (
                                          <p className="mt-1 text-xs font-light text-brand-dark/60">
                                            {durationLoading
                                              ? t("pricing.loadingDuration")
                                              : durationLabel}
                                          </p>
                                        )}
                                      </div>

                                      <div className="shrink-0 flex flex-col items-end gap-2 md:flex-row md:items-center md:gap-4">
                                        <span className="font-normal text-brand-dark tabular-nums whitespace-nowrap">
                                          {priceLabel}
                                        </span>
                                        {bookingUrl ? (
                                          <Link
                                            to={bookingUrl}
                                            className="inline-flex items-center px-4 py-2 rounded-[var(--radius)] text-xs font-light text-brand-dark border border-brand-dark/25 hover:border-brand-dark/60 transition-colors whitespace-nowrap w-28 justify-center"
                                          >
                                            {t("nav.bookAppointment")}
                                          </Link>
                                        ) : (
                                          <span className="hidden md:block w-28 shrink-0" aria-hidden />
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
                    <div className="mt-10 pt-6 border-t border-brand-dark/10">
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
                    type="button"
                    onClick={() => navigate("/booking")}
                    className="chip-filter chip-filter-light"
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
