"use client";

import { AssetImg } from "@/components/AssetImg";
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

type Props = {
  config: PageSectionSpecialistsConfig;
};

function resolveSpecialists(
  config: PageSectionSpecialistsConfig,
  all: Specialist[],
): Specialist[] {
  const limit = config.limit ?? 8;
  const mode = config.displayMode ?? "all";

  if (mode === "manual" && config.specialists?.length) {
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

  if (mode === "category" && categoryKey) {
    return all.filter((s) => specialistMatchesCategory(s, categoryKey)).slice(0, limit);
  }

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

export function PageSectionSpecialistsBlock({ config }: Props) {
  const { t } = useTranslation();
  const { sorted: allSpecialists } = useSpecialistsData();

  const specialists = useMemo(
    () => resolveSpecialists(config, allSpecialists),
    [config, allSpecialists],
  );

  const variant = config.variant ?? "carousel";
  const seeAllHref = categoryHref(config);
  const seeAllLabel =
    config.seeAllLabel?.trim() ||
    t("specialists.seeAll", {
      count: specialists.length,
      defaultValue: `Se alle ${specialists.length} spesialister`,
    });

  if (variant === "carousel") {
    if (specialists.length === 0) return null;

    return (
      <SpecialistsScroller
        items={specialists}
        eyebrow={config.eyebrow || undefined}
        title={config.title || undefined}
        description={config.description || undefined}
        seeAllHref={seeAllHref}
        seeAllLabel={seeAllLabel}
      />
    );
  }

  const eyebrow = config.eyebrow || t("specialists.subtitle", { defaultValue: "Vårt team" });
  const title = config.title || t("specialists.title", { defaultValue: "Møt våre spesialister" });
  const description =
    config.description ||
    t("specialists.description", {
      defaultValue: "Erfaring, spisskompetanse og moderne teknologi samlet på ett sted.",
    });

  if (specialists.length === 0) return null;

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
