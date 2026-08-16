"use client";

import { AssetImg } from "@/components/AssetImg";
import { SpecialistCarousel } from "@/components/SpecialistCarousel";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Specialist } from "@/lib/sanity/specialist-types";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { type PageSectionSpecialistsConfig } from "@/lib/sanity/page-sections";
import type { SanitySpecialist } from "@/hooks/useSanity";
import { specialistMatchesCategory } from "@/lib/sanity/category-keys";
import { resolveSpecialistsDisplayMode } from "@/lib/sanity/specialists-display-mode";

type Props = {
  config: PageSectionSpecialistsConfig;
  /** Treatment category landings use flush centered presentation. */
  layoutVariant?: "default" | "category";
};

function resolveSpecialists(
  config: PageSectionSpecialistsConfig,
  all: Specialist[],
): Specialist[] {
  const mode = resolveSpecialistsDisplayMode(config.displayMode);
  if (!mode) return [];

  const limit = typeof config.limit === "number" ? config.limit : 8;

  if (mode === "manual") {
    if (!config.specialists?.length) return [];
    const slugs = config.specialists
      .map((raw) => (raw as SanitySpecialist).slug)
      .filter(Boolean);
    return slugs
      .map((slug) => all.find((s) => s.slug === slug))
      .filter((s): s is Specialist => Boolean(s))
      .slice(0, limit);
  }

  const categoryKey =
    config.categorySlug ||
    config.treatmentCategory?.categoryId ||
    config.treatmentCategory?.slug;

  if (mode === "category") {
    if (!categoryKey) return [];
    return all
      .filter((s) => specialistMatchesCategory(s, categoryKey))
      .sort((a, b) => a.name.localeCompare(b.name, "nb"))
      .slice(0, limit);
  }

  // mode === "all" — only when explicitly stored
  return all.slice(0, limit);
}

function categoryHref(config: PageSectionSpecialistsConfig): string {
  if (config.seeAllHref?.trim()) return config.seeAllHref.trim();
  const categoryKey =
    config.categorySlug ||
    config.treatmentCategory?.categoryId ||
    config.treatmentCategory?.slug;
  return categoryKey ? `/spesialister?kategori=${categoryKey}` : "/spesialister";
}

export function PageSectionSpecialistsBlock({
  config,
  layoutVariant = "default",
}: Props) {
  const { t } = useTranslation();
  const { sorted: allSpecialists, isLoading } = useSpecialistsData();

  const specialists = useMemo(
    () => resolveSpecialists(config, allSpecialists),
    [config, allSpecialists],
  );

  const variant = config.variant ?? "carousel";
  const seeAllHref = categoryHref(config);
  const seeAllLabel =
    config.seeAllLabel?.trim() ||
    t("specialists.seeAll", {
      count: allSpecialists.length || specialists.length,
      defaultValue: `Se alle ${allSpecialists.length || specialists.length} spesialister`,
    });

  if (!resolveSpecialistsDisplayMode(config.displayMode)) {
    return null;
  }

  if (variant === "carousel") {
    // Avoid permanently hiding the band while the specialists query is in flight.
    if (specialists.length === 0) {
      if (isLoading) {
        return (
          <section className="py-16 md:py-20" aria-busy="true" aria-label={config.title || undefined} />
        );
      }
      return null;
    }

    const title =
      config.title?.trim() ||
      t("specialists.title", { defaultValue: "Møt våre spesialister" });
    const description =
      config.description?.trim() ||
      t("specialists.description", {
        defaultValue:
          "Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.",
      });

    if (layoutVariant === "category") {
      return (
        <SpecialistsScroller
          items={specialists}
          fallbackCategory={
            config.categorySlug ||
            config.treatmentCategory?.categoryId ||
            config.treatmentCategory?.slug
          }
          eyebrow={config.eyebrow || undefined}
          title={title}
          description={description}
          seeAllHref={seeAllHref}
          seeAllLabel={seeAllLabel}
          layoutVariant="category"
        />
      );
    }

    return (
      <SpecialistCarousel
        specialists={specialists}
        title={title}
        description={description}
        seeAllHref={seeAllHref}
        seeAllLabel={seeAllLabel}
      />
    );
  }

  const isDark = variant === "gridDark";
  const eyebrow = config.eyebrow || t("specialists.subtitle", { defaultValue: "Vårt team" });
  const title = config.title || t("specialists.title", { defaultValue: "Møt våre spesialister" });
  const description =
    config.description ||
    t("specialists.description", {
      defaultValue: "Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.",
    });

  if (specialists.length === 0) return null;

  if (!isDark) {
    return (
      <section className="py-16 md:py-24 bg-background border-t border-border/40">
        <div className="container mx-auto px-6 md:px-16">
          <div className="mb-10">
            {eyebrow ? <p className="text-muted-foreground text-xs mb-3 uppercase tracking-wide">{eyebrow}</p> : null}
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-3">{title}</h2>
            {description ? <p className="text-muted-foreground font-light max-w-xl">{description}</p> : null}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {specialists.map((specialist) => (
              <Link to={`/spesialister/${specialist.slug}`} key={specialist.slug} className="group">
                <div className="relative aspect-[3/4] rounded-sm overflow-hidden bg-secondary">
                  <AssetImg
                    src={specialist.image}
                    alt={specialist.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                  />
                </div>
                <h3 className="mt-3 text-sm font-medium text-foreground">{specialist.name}</h3>
                <p className="text-xs text-muted-foreground font-light">{specialist.title}</p>
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <Button variant="outline" className="rounded-sm font-light" asChild>
              <Link to={seeAllHref}>
                {seeAllLabel}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-brand-dark py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <p className="text-white/60 text-xs mb-3">{eyebrow}</p>
            <h2 className="text-2xl md:text-3xl font-light text-white mb-3">{title}</h2>
            {description ? (
              <p className="text-white/70 font-light max-w-xl">{description}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
            {specialists.map((specialist) => (
              <Link
                to={`/spesialister/${specialist.slug}`}
                key={specialist.slug}
                className="group"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-brand-dark">
                  <AssetImg
                    src={specialist.image}
                    alt={specialist.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-normal text-white text-sm mb-0.5">{specialist.name}</h3>
                    <p className="text-white/70 text-xs font-light">
                      {specialist.title}
                      {specialist.subtitle &&
                        specialist.subtitle !== specialist.title &&
                        ` · ${specialist.subtitle}`}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-10">
            <Button
              className="rounded-sm bg-transparent border border-white/30 text-white hover:bg-white hover:text-brand-dark transition-colors font-light"
              asChild
            >
              <Link to={seeAllHref}>
                {seeAllLabel}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
