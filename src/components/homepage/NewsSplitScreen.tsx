"use client";

import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/router";
import { articles, normalizeCategory, type Article } from "@/data/articles";
import { useArticles, useHomepage } from "@/hooks/useSanity";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import type { MediaFocalPoint, SanityCrop, SanityHotspot } from "@/lib/media/focal-point";
import { defaultNewsSplitSection } from "@/lib/sanity/homepage-data";
import { useTranslation } from "react-i18next";

type NewsSplitItem = {
  id: string;
  slug: string;
  title: string;
  image: string;
  imageHotspot?: SanityHotspot | MediaFocalPoint | null;
  imageCrop?: SanityCrop | null;
  eyebrow: string;
};

const FALLBACK_IMAGES = [
  "https://cdn.sanity.io/images/bk8rw7yi/production/1a6b5c045dd900b09dd7dd5e0c2e9683d2d12643-4284x5712.jpg?q=80&fit=crop&auto=format&w=1200",
  "https://cdn.sanity.io/images/bk8rw7yi/production/1b6782dd6bb68860c34de07a6522605faa161d22-4318x2879.jpg?q=80&fit=crop&auto=format&w=1200",
] as const;

function articleToItem(
  article: Article & { id?: string },
  imageFallback: string,
  index: number,
): NewsSplitItem {
  const slug = article.slug || `article-${index}`;
  return {
    id: article.id || `${slug}-${index}`,
    slug,
    title: article.title,
    image: article.image || imageFallback,
    imageHotspot: article.imageHotspot,
    imageCrop: article.imageCrop,
    eyebrow: normalizeCategory(article.category),
  };
}

function dedupeBySlug(items: NewsSplitItem[]): NewsSplitItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (!item.slug || seen.has(item.slug)) return false;
    seen.add(item.slug);
    return true;
  });
}

function sortByDateDesc(source: Article[]): Article[] {
  return [...source].sort((a, b) => (a.date < b.date ? 1 : -1));
}

function buildFallbackItems(source: Article[]): NewsSplitItem[] {
  return dedupeBySlug([
    {
      id: "fallback-0",
      slug: source[0]?.slug ?? "robotassistert-overvektskirurgi-presisjon-trygghet-og-varige-resultater",
      title:
        source.find((a) => a.slug.includes("robotassistert"))?.title ??
        "Robotassistert overvektskirurgi – presisjon, trygghet og varige resultater",
      image: FALLBACK_IMAGES[0],
      eyebrow: "Fagartikler",
    },
    {
      id: "fallback-1",
      slug: source.find((a) => a.slug.includes("livio"))?.slug ?? source[1]?.slug ?? "#",
      title:
        source.find((a) => a.slug.includes("livio"))?.title ??
        "Livio Oslo blir en del av CMedical og tilbudet til pasientene styrkes",
      image: FALLBACK_IMAGES[1],
      eyebrow: "Nytt fra oss",
    },
    {
      id: "fallback-2",
      slug: source[2]?.slug ?? "#",
      title: source[2]?.title ?? "Tverrfaglig oppfølging etter operasjon",
      image: source[2]?.image ?? FALLBACK_IMAGES[0],
      eyebrow: source[2] ? normalizeCategory(source[2].category) : "Fagartikler",
    },
    {
      id: "fallback-3",
      slug: source[3]?.slug ?? "#",
      title: source[3]?.title ?? "Slik forbereder du deg til konsultasjonen",
      image: source[3]?.image ?? FALLBACK_IMAGES[1],
      eyebrow: source[3] ? normalizeCategory(source[3].category) : "Veiledning",
    },
  ]);
}

/**
 * Splitscreen «Nyheter og artikler»:
 * venstre redaksjonell intro, høyre 2×2 artikkelrutenett.
 */
export const NewsSplitScreen = () => {
  const { data: sanityArticles } = useArticles();
  const { data: homepage } = useHomepage();
  const { i18n } = useTranslation();
  const lang = (i18n.language || "nb").toLowerCase().startsWith("en") ? "en" : "no";
  const defaults = defaultNewsSplitSection(lang);
  const copy = homepage?.newsSplitSection ?? defaults;

  const items = useMemo(() => {
    if (homepage?.featuredArticles && homepage.featuredArticles.length > 0) {
      return dedupeBySlug(
        homepage.featuredArticles.map((article, index) =>
          articleToItem(article, FALLBACK_IMAGES[index % FALLBACK_IMAGES.length], index),
        ),
      ).slice(0, 4);
    }

    const source =
      sanityArticles && sanityArticles.length > 0
        ? sortByDateDesc(
            sanityArticles.map(
              (a): Article & { id?: string } => ({
                id: a._id || a.slug,
                slug: a.slug,
                title: a.title,
                excerpt: a.excerpt,
                image: a.image,
                imageHotspot: a.imageHotspot,
                imageCrop: a.imageCrop,
                date: a.date,
                category: normalizeCategory(a.category),
                externalUrl: a.externalUrl,
              }),
            ),
          )
        : sortByDateDesc(articles);

    if (source.length >= 4) {
      return dedupeBySlug(
        source
          .slice(0, 8)
          .map((article, index) =>
            articleToItem(article, FALLBACK_IMAGES[index % FALLBACK_IMAGES.length], index),
          ),
      ).slice(0, 4);
    }

    return buildFallbackItems(source);
  }, [sanityArticles, homepage?.featuredArticles]);

  const ctaPath = copy.ctaPath || defaults.ctaPath;
  const ctaLabel = copy.ctaLabel || defaults.ctaLabel;

  return (
    <section aria-labelledby="news-split-heading" className="bg-brand-warm py-16 md:py-24 lg:py-28">
      <div className="flex flex-col md:grid md:grid-cols-2 md:h-screen">
        {/* Venstre — redaksjonell intro */}
        <div className="bg-brand-light text-brand-dark flex flex-col justify-center px-6 md:px-12 lg:px-16 py-16 md:py-20">
          <div>
            <h2
              id="news-split-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] max-w-md mb-6"
            >
              {copy.heading || defaults.heading}
            </h2>
            <p className="text-base md:text-lg font-light text-brand-dark/70 leading-relaxed max-w-md">
              {copy.description || defaults.description}
            </p>
          </div>
          <Link
            to={ctaPath}
            className="hidden md:inline-flex items-center gap-2 text-sm font-light text-brand-dark/80 hover:text-brand-dark mt-10 group w-fit"
          >
            {ctaLabel}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Høyre — 2x2 artikler */}
        <div className="grid grid-cols-2 grid-rows-2 md:h-screen">
          {items.map((item) => (
            <Link
              key={item.id}
              to={`/aktuelt/${item.slug}`}
              className="group relative block overflow-hidden min-h-[40vh] md:min-h-0"
            >
              <ResponsiveImage
                src={item.image}
                alt={item.title}
                variant="card"
                hotspot={item.imageHotspot}
                crop={item.imageCrop}
                loading="lazy"
                className="absolute inset-0 w-full h-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5"
              />
              <div className="relative z-10 flex h-full flex-col justify-end px-4 md:px-6 lg:px-8 py-6 md:py-8 text-white">
                <span className="text-[11px] md:text-xs font-light text-white/70 mb-2">
                  {item.eyebrow}
                </span>
                <h3 className="text-sm md:text-base lg:text-lg font-light leading-snug mb-3 line-clamp-3">
                  {item.title}
                </h3>
                <span className="inline-flex items-center gap-1.5 text-xs font-light text-white/80 group-hover:text-white">
                  Les mer
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobil — «Se alle artikler» under artiklene */}
        <div className="md:hidden bg-brand-light px-6 pb-16">
          <Link
            to={ctaPath}
            className="inline-flex items-center gap-2 text-sm font-light text-brand-dark/80 hover:text-brand-dark pt-10 group w-fit"
          >
            {ctaLabel}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};
