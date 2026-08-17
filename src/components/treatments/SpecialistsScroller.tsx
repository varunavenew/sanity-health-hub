import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@/lib/router";
import { ArrowRight, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArrows } from "@/components/ui/ScrollArrows";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { specialistMatchesCategory } from "@/lib/sanity/category-keys";

import type { Specialist } from "@/lib/sanity/specialist-types";

function specialistRoleLine(sp: Specialist): string {
  if (sp.subtitle && sp.subtitle !== sp.title) {
    return `${sp.title} · ${sp.subtitle}`;
  }
  return sp.title;
}

interface Props {
  /** Category slug to filter on. Omit/'alle' to show everyone. */
  category?: string;
  /** Custom predicate. Overrides `category` when provided. */
  filter?: (s: Specialist) => boolean;
  /** Pre-resolved list — skips internal filtering when set. */
  items?: Specialist[];
  /** Fallback category when `filter`/`category` returns no matches. */
  fallbackCategory?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Link target for "Se alle". */
  seeAllHref?: string;
  seeAllLabel?: string;
  /**
   * `default` — homepage-style header with nav + see-all button.
   * `category` — treatment-category reference: centered head, flush cards, footer text link.
   */
  layoutVariant?: "default" | "category";
}

/**
 * Unified specialists scroller. Matches the home SpecialistsSection layout
 * (clinic tag top-left, name + role overlaid on image, expertise line under
 * each card) with responsive layouts: 1 → editorial feature, 2–3 → grid,
 * 4+ → horizontal carousel.
 */
export const SpecialistsScroller = ({
  category,
  filter,
  items: itemsOverride,
  fallbackCategory,
  eyebrow,
  title,
  description,
  seeAllHref = "/spesialister",
  seeAllLabel,
  layoutVariant = "default",
}: Props) => {
  const { t, i18n } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { sorted: specialists } = useSpecialistsData();
  const isCategory = layoutVariant === "category";
  const isEn = (i18n.language || "").toLowerCase().startsWith("en");
  const resolvedTitle =
    title?.trim() ||
    t("specialists.title", { defaultValue: "Møt våre spesialister" });
  // Only fall back to the default ingress when the CMS did not set a heading.
  // Treatment pages often use the "Erfaring…" line as the title alone (demo parity).
  const resolvedDescription = description?.trim()
    ? description.trim()
    : title?.trim()
      ? undefined
      : t("specialists.description", {
          defaultValue:
            "Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.",
        });

  const filtered = useMemo(() => {
    if (itemsOverride?.length) return itemsOverride;

    let result = specialists;
    if (filter) {
      result = specialists.filter(filter);
    } else if (category && category !== "alle") {
      result = specialists.filter((s) => specialistMatchesCategory(s, category));
    }

    if (
      result.length === 0 &&
      fallbackCategory &&
      fallbackCategory !== "alle"
    ) {
      result = specialists.filter((s) =>
        specialistMatchesCategory(s, fallbackCategory),
      );
    }

    return result;
  }, [specialists, category, filter, fallbackCategory, itemsOverride]);

  const [progressPct, setProgressPct] = useState(0);
  const [activeIndex, setActiveIndex] = useState(1);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const syncScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el || filtered.length === 0) return;
    const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
    const firstCard = el.querySelector<HTMLElement>(":scope > div");
    const step = firstCard?.offsetWidth || 300;
    const rawIndex = Math.round(el.scrollLeft / Math.max(step, 1));
    const index = Math.min(filtered.length, Math.max(1, rawIndex + 1));
    setActiveIndex(index);
    // Demo: progress ≈ active card / total (e.g. 1/3 at start).
    setProgressPct(Math.min(100, Math.max(0, (index / filtered.length) * 100)));
    setCanPrev(el.scrollLeft > 4);
    setCanNext(maxScroll > 4 && el.scrollLeft < maxScroll - 4);
  }, [filtered.length]);

  useEffect(() => {
    if (!isCategory) return;
    const el = scrollRef.current;
    if (!el) return;
    syncScrollState();
    el.addEventListener("scroll", syncScrollState, { passive: true });
    window.addEventListener("resize", syncScrollState);
    return () => {
      el.removeEventListener("scroll", syncScrollState);
      window.removeEventListener("resize", syncScrollState);
    };
  }, [isCategory, syncScrollState, filtered.length]);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const firstCard = scrollRef.current.querySelector<HTMLElement>(":scope > div");
    const step = firstCard?.offsetWidth || (isCategory ? 300 : 320);
    scrollRef.current.scrollBy({
      left: dir === "left" ? -step : step,
      behavior: "smooth",
    });
  };

  if (filtered.length === 0) return null;

  const computedSeeAllLabel =
    seeAllLabel?.trim() ||
    t("specialists.seeAll", {
      count: filtered.length,
      defaultValue: `Se alle ${filtered.length} spesialister`,
    });
  const showSeeAllButton = filtered.length > 1;
  const useScroller = filtered.length >= 4;
  const prevLabel = isEn ? "Previous" : "Forrige";
  const nextLabel = isEn ? "Next" : "Neste";
  const progressLabel = isEn ? "Carousel progress" : "Fremdrift i karusell";

  const gridClass =
    filtered.length === 2
      ? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto";

  const profileLabel = t("specialists.viewProfile", {
    defaultValue: "Se profil",
  });

  if (isCategory) {
    const seeAllLink = showSeeAllButton ? (
      <Link
        to={seeAllHref}
        className="inline-flex items-center gap-2 text-sm font-light text-foreground hover:opacity-70 transition-opacity"
      >
        {computedSeeAllLabel}
        <ArrowRight className="w-4 h-4" />
      </Link>
    ) : null;

    return (
      <section className="pt-8 md:pt-10 pb-10 md:pb-12 bg-secondary/30 overflow-hidden">
        <div className="page-shell mb-5 md:mb-6">
          {eyebrow ? (
            <p className="text-sm text-muted-foreground font-light mb-3">{eyebrow}</p>
          ) : null}
          {/* Reference: title + ingress stacked left (not split columns / no header CTA). */}
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-light leading-tight text-foreground mb-4">
              {resolvedTitle}
            </h2>
            {resolvedDescription ? (
              <p className="text-muted-foreground font-light max-w-2xl">
                {resolvedDescription}
              </p>
            ) : null}
          </div>
        </div>

        {filtered.length === 1 ? (
          <div className="page-shell">
            <SpecialistFeature sp={filtered[0]} />
            {seeAllLink ? <div className="mt-6 md:mt-8">{seeAllLink}</div> : null}
          </div>
        ) : (
          <div className="relative">
            <div
              ref={scrollRef}
              className="flex gap-0 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory pl-[var(--gutter)] pr-[var(--gutter)] md:pr-0"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {filtered.map((sp) => (
                <div
                  key={sp.slug}
                  className="flex-shrink-0 w-[70vw] sm:w-[240px] md:w-[280px] snap-start"
                >
                  <CategorySpecialistCard sp={sp} profileLabel={profileLabel} />
                </div>
              ))}
            </div>

            <div className="flex flex-col items-start gap-4 w-full max-w-full overflow-x-clip carousel-nav px-[var(--gutter)] mt-4 md:mt-6">
              <div className="flex items-center gap-3 md:gap-4 min-w-0 w-full">
                <div
                  className="relative h-px flex-1 min-w-[48px] bg-brand-dark/15"
                  role="progressbar"
                  aria-valuemin={1}
                  aria-valuemax={filtered.length}
                  aria-valuenow={activeIndex}
                  aria-label={progressLabel}
                >
                  <div
                    className="absolute inset-y-0 left-0 bg-brand-dark transition-[width] duration-300 ease-out"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    aria-label={prevLabel}
                    disabled={!canPrev}
                    onClick={() => scroll("left")}
                    className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-brand-dark/20 flex items-center justify-center text-brand-dark transition-colors hover:bg-brand-dark/5 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    aria-label={nextLabel}
                    disabled={!canNext}
                    onClick={() => scroll("right")}
                    className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-brand-dark/20 flex items-center justify-center text-brand-dark transition-colors hover:bg-brand-dark/5 disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {seeAllLink}
            </div>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="pt-10 md:pt-14 pb-16 md:pb-14 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-6 md:px-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-xl">
            {eyebrow ? (
              <p className="text-sm text-muted-foreground font-light mb-3">
                {eyebrow}
              </p>
            ) : null}
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-4">
              {resolvedTitle}
            </h2>
            {resolvedDescription ? (
              <p className="text-muted-foreground font-light">{resolvedDescription}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            {useScroller ? (
              <div className="hidden md:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scroll("left")}
                  className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-secondary transition-colors text-foreground"
                  aria-label="Scroll venstre"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() => scroll("right")}
                  className="w-10 h-10 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-secondary transition-colors text-foreground"
                  aria-label="Scroll høyre"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            ) : null}
            {showSeeAllButton ? (
              <Button
                variant="cta-outline"
                asChild
                className="hidden md:inline-flex rounded-lg"
              >
                <Link to={seeAllHref}>
                  {computedSeeAllLabel}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {filtered.length === 1 ? (
        <div className="container mx-auto px-6 md:px-16">
          <SpecialistFeature sp={filtered[0]} />
        </div>
      ) : useScroller ? (
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex w-full max-w-full min-w-0 gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {filtered.map((sp) => (
              <div
                key={sp.slug}
                className="flex-shrink-0 w-[300px] snap-start"
              >
                <SpecialistCard sp={sp} showExpertise profileLabel={undefined} />
              </div>
            ))}
            <Link
              to={seeAllHref}
              className="flex-shrink-0 w-[300px] snap-start"
              aria-label={computedSeeAllLabel}
            >
              <div className="aspect-[3/4] bg-secondary border border-border flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/80 transition-colors">
                <div className="w-16 h-16 rounded-full bg-foreground/10 flex items-center justify-center mb-4">
                  <ArrowRight className="w-6 h-6 text-foreground" />
                </div>
                <p className="text-foreground font-normal mb-1">
                  {t("specialists.seeAllShort")}
                </p>
                <p className="text-muted-foreground text-sm font-light">
                  {t("specialists.count", { count: filtered.length })}
                </p>
              </div>
            </Link>
          </div>
          <div className="md:hidden">
            <ScrollArrows scrollRef={scrollRef} />
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-6 md:px-16">
          <div className={`grid gap-6 ${gridClass}`}>
            {filtered.map((sp) => (
              <SpecialistCard key={sp.slug} sp={sp} showExpertise />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

/** Category landing card — matches avenewdemo specialists carousel. */
const CategorySpecialistCard = ({
  sp,
  profileLabel,
}: {
  sp: Specialist;
  profileLabel: string;
}) => (
  <Link
    to={`/spesialister/${sp.slug}`}
    aria-label={`Les mer om ${sp.name}`}
    className="group block"
  >
    <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
      <ResponsiveImage
        src={sp.image}
        alt={sp.name}
        variant="card"
        objectPosition="50% 20%"
        loading="lazy"
        className="w-full h-full transition-transform duration-[900ms] ease-out will-change-transform group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/75 via-brand-dark/10 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/25 to-transparent pointer-events-none" />

      {sp.clinics && sp.clinics.length > 0 ? (
        <div className="absolute top-4 left-4 flex items-center gap-1 text-white/80 text-sm font-light z-[1]">
          <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
          {sp.clinics.join(" · ")}
        </div>
      ) : null}

      <div className="absolute bottom-0 left-0 right-0 p-5 z-[1]">
        <h3 className="font-normal text-white text-lg leading-snug mb-0.5">
          {sp.name}
        </h3>
        <p className="text-sm text-white/70 font-light leading-snug">
          {specialistRoleLine(sp)}
        </p>
        {/* Demo: “Se profil →” expands on hover */}
        <div className="grid grid-rows-[0fr] opacity-0 translate-y-1 transition-[grid-template-rows,opacity,transform] duration-300 ease-out group-hover:grid-rows-[1fr] group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:grid-rows-[1fr] group-focus-visible:opacity-100 group-focus-visible:translate-y-0">
          <div className="overflow-hidden min-h-0">
            <div className="flex items-center gap-1.5 pt-3 text-sm font-light text-brand-yellow">
              <span>{profileLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Link>
);

/**
 * Editorial split layout when there is exactly one specialist for a service.
 * Name as heading, role as subtitle; bio + specialty list + CTA (demo treatment layout).
 */
const SpecialistFeature = ({ sp }: { sp: Specialist }) => {
  const bio = sp.bio ?? "";
  const shortBio = bio ? bio.split("\n\n")[0].slice(0, 280) : "";
  const firstName = sp.name.split(" ")[0] || sp.name;
  const roleLine = specialistRoleLine(sp);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-stretch">
      <Link
        to={`/spesialister/${sp.slug}`}
        aria-label={`Les mer om ${sp.name}`}
        className="group md:col-span-5 md:col-start-1 block"
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
          <ResponsiveImage
            src={sp.image}
            alt={sp.name}
            variant="card"
            objectPosition="50% 20%"
            className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          {sp.clinics && sp.clinics.length > 0 ? (
            <div className="absolute top-4 left-4 flex items-center gap-1 text-white/90 text-sm font-light drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] z-[1]">
              <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
              {sp.clinics.join(" · ")}
            </div>
          ) : null}
        </div>
      </Link>

      <div className="md:col-span-6 md:col-start-7 flex flex-col justify-between border-t border-brand-dark/15 pt-8 md:pt-0 md:border-t-0">
        <div>
          <h3 className="text-3xl md:text-5xl font-light text-foreground leading-[1.05] mb-3 hyphens-auto [overflow-wrap:anywhere]">
            {sp.name}
          </h3>
          {roleLine ? (
            <p className="text-base md:text-lg text-muted-foreground font-light mb-6 max-w-md">
              {roleLine}
            </p>
          ) : null}

          {shortBio ? (
            <p className="text-sm font-light text-foreground/80 mb-8 max-w-md leading-relaxed">
              {shortBio}
              {bio.length > 280 ? " …" : ""}
            </p>
          ) : null}

          {sp.expertise && sp.expertise.length > 0 ? (
            <div className="border-t border-brand-dark/15">
              <ul className="divide-y divide-brand-dark/10">
                {sp.expertise.map((item) => (
                  <li
                    key={item}
                    className="py-3 text-sm font-light text-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="mt-10">
          <Button variant="cta" asChild>
            <Link to="/booking">Finn ledig tid hos {firstName}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

/** Card used in the static grid (few specialists). Mirrors the scroller card. */
const SpecialistCard = ({
  sp,
  flush = false,
  showExpertise = true,
  profileLabel,
}: {
  sp: Specialist;
  flush?: boolean;
  showExpertise?: boolean;
  profileLabel?: string;
}) => (
  <Link
    to={`/spesialister/${sp.slug}`}
    aria-label={`Les mer om ${sp.name}`}
    className="group block"
  >
    <div
      className={`relative aspect-[3/4] overflow-hidden bg-secondary ${flush ? "mb-0" : "mb-3"}`}
    >
      <ResponsiveImage
        src={sp.image}
        alt={sp.name}
        variant="card"
        objectPosition="50% 20%"
        loading="lazy"
        className="w-full h-full saturate-[0.7] brightness-[0.95] contrast-[1.05] transition-transform duration-700 ease-out group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-brand-dark/15 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent" />
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent" />

      {sp.clinics && sp.clinics.length > 0 ? (
        <div className="absolute top-3 left-3 flex items-center gap-1 text-white/90 text-xs font-light drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
          <MapPin className="w-2.5 h-2.5 flex-shrink-0" />
          {sp.clinics.join(" · ")}
        </div>
      ) : null}

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-normal text-white mb-0.5">{sp.name}</h3>
        <p className="text-sm text-white/70 font-light">{specialistRoleLine(sp)}</p>
        {profileLabel ? (
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-light text-brand-yellow opacity-0 group-hover:opacity-100 transition-opacity">
            {profileLabel}
            <ArrowRight className="w-3 h-3" />
          </span>
        ) : null}
      </div>
    </div>

    {showExpertise && sp.expertise && sp.expertise.length > 0 ? (
      <p className="text-sm text-muted-foreground font-normal pl-1 pr-6">
        {sp.expertise.join(", ")}
      </p>
    ) : null}
  </Link>
);
