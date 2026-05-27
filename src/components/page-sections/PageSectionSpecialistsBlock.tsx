"use client";

import { AssetImg } from "@/components/AssetImg";
import { SpecialistsSection } from "@/components/homepage/SpecialistsSection";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Specialist } from "@/data/specialists";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import {
  sanitySpecialistToCard,
  type PageSectionSpecialistsConfig,
} from "@/lib/sanity/page-sections";
import type { SanitySpecialist } from "@/hooks/useSanity";

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
    return config.specialists
      .map((raw) => {
        const s = raw as SanitySpecialist & { role?: string; specialties?: string[] };
        return sanitySpecialistToCard({
          ...s,
          title: s.title || s.role || "",
          expertise: s.expertise?.length ? s.expertise : s.specialties || [],
          category: s.category || (s as { categories?: { slug?: string }[] }).categories?.[0]?.slug || "",
        });
      })
      .slice(0, limit);
  }

  const categoryKey =
    config.categorySlug ||
    config.treatmentCategory?.categoryId ||
    config.treatmentCategory?.slug;

  if (mode === "category" && categoryKey) {
    return all.filter((s) => s.category === categoryKey).slice(0, limit);
  }

  return all.slice(0, limit);
}

export function PageSectionSpecialistsBlock({ config }: Props) {
  const { t } = useTranslation();
  const { sorted: allSpecialists } = useSpecialistsData();

  const specialists = useMemo(
    () => resolveSpecialists(config, allSpecialists),
    [config, allSpecialists],
  );

  const variant = config.variant ?? "carousel";

  if (variant === "carousel") {
    return (
      <ConfigurableCarouselSection
        config={config}
        specialists={specialists}
        totalCount={allSpecialists.length}
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
              <Link to="/spesialister">
                {t("specialists.seeAll", {
                  count: allSpecialists.length,
                  defaultValue: `Se alle ${allSpecialists.length} spesialister`,
                })}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Carousel with optional CMS headings; falls back to default SpecialistsSection copy when empty */
function ConfigurableCarouselSection({
  config,
  specialists,
  totalCount,
}: {
  config: PageSectionSpecialistsConfig;
  specialists: Specialist[];
  totalCount: number;
}) {
  const { t } = useTranslation();
  const hasCustomCopy = Boolean(config.title || config.description || config.eyebrow);

  if (!hasCustomCopy) {
    return <SpecialistsSection />;
  }

  if (specialists.length === 0) return null;

  return (
    <section className="pt-24 md:pt-32 pb-10 md:pb-14 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-6 md:px-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-xl">
            {config.eyebrow ? (
              <p className="text-sm text-muted-foreground font-light mb-3">{config.eyebrow}</p>
            ) : null}
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-4">
              {config.title}
            </h2>
            {config.description ? (
              <p className="text-muted-foreground font-light">{config.description}</p>
            ) : null}
          </div>
          <Button variant="cta-outline" asChild>
            <Link to="/spesialister">
              {t("specialists.seeAll", {
                count: totalCount,
                defaultValue: `Se alle ${totalCount} spesialister`,
              })}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="flex gap-0 overflow-x-auto scrollbar-hide pb-4 px-6 md:px-16">
        {specialists.map((specialist) => (
          <Link
            to={`/spesialister/${specialist.slug}`}
            key={specialist.slug}
            className="group flex-shrink-0 w-[280px]"
          >
            <div className="relative aspect-[3/4] overflow-hidden mb-3 bg-secondary">
              <AssetImg
                src={specialist.image}
                alt={specialist.name}
                className="w-full h-full object-cover object-top group-hover:scale-[1.05] transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-normal text-white">{specialist.name}</h3>
                <p className="text-sm text-white/70 font-light">{specialist.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
