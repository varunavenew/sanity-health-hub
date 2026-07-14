"use client";

import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/router";
import { articles, normalizeCategory, type Article } from "@/data/articles";
import { useArticles, useHomepage } from "@/hooks/useSanity";

type NewsSplitItem = {
  slug: string;
  title: string;
  image: string;
  eyebrow: string;
};

const FALLBACK_IMAGES = [
  "https://cdn.sanity.io/images/bk8rw7yi/production/1a6b5c045dd900b09dd7dd5e0c2e9683d2d12643-4284x5712.jpg?q=80&fit=crop&auto=format&w=1200",
  "https://cdn.sanity.io/images/bk8rw7yi/production/1b6782dd6bb68860c34de07a6522605faa161d22-4318x2879.jpg?q=80&fit=crop&auto=format&w=1200",
] as const;

function articleToItem(article: Article, imageFallback: string): NewsSplitItem {
  return {
    slug: article.slug,
    title: article.title,
    image: article.image || imageFallback,
    eyebrow: normalizeCategory(article.category),
  };
}

function buildFallbackItems(source: Article[]): NewsSplitItem[] {
  return [
    {
      slug: source[0]?.slug ?? "robotassistert-overvektskirurgi-presisjon-trygghet-og-varige-resultater",
      title:
        source.find((a) => a.slug.includes("robotassistert"))?.title ??
        "Robotassistert overvektskirurgi – presisjon, trygghet og varige resultater",
      image: FALLBACK_IMAGES[0],
      eyebrow: "Fagartikkel",
    },
    {
      slug: source.find((a) => a.slug.includes("livio"))?.slug ?? source[1]?.slug ?? "#",
      title:
        source.find((a) => a.slug.includes("livio"))?.title ??
        "Livio Oslo blir en del av CMedical og tilbudet til pasientene styrkes",
      image: FALLBACK_IMAGES[1],
      eyebrow: "Nytt fra oss",
    },
    {
      slug: source[2]?.slug ?? "#",
      title: source[2]?.title ?? "Tverrfaglig oppfølging etter operasjon",
      image: source[2]?.image ?? FALLBACK_IMAGES[0],
      eyebrow: source[2] ? normalizeCategory(source[2].category) : "Fagartikkel",
    },
    {
      slug: source[3]?.slug ?? "#",
      title: source[3]?.title ?? "Slik forbereder du deg til konsultasjonen",
      image: source[3]?.image ?? FALLBACK_IMAGES[1],
      eyebrow: source[3] ? normalizeCategory(source[3].category) : "Veiledning",
    },
  ];
}

/**
 * Splitscreen «Nyheter og artikler»:
 * venstre redaksjonell intro, høyre 2×2 artikkelrutenett.
 */
export const NewsSplitScreen = () => {
  const { data: sanityArticles } = useArticles();
  const { data: homepage } = useHomepage();
  const copy = homepage?.newsSplitSection;

  const items = useMemo(() => {
    if (homepage?.featuredArticles && homepage.featuredArticles.length > 0) {
      return homepage.featuredArticles.map((article, index) =>
        articleToItem(article, FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]),
      );
    }

    const source =
      sanityArticles && sanityArticles.length > 0
        ? sanityArticles.map(
            (a): Article => ({
              slug: a.slug,
              title: a.title,
              excerpt: a.excerpt,
              image: a.image,
              date: a.date,
              category: normalizeCategory(a.category),
              externalUrl: a.externalUrl,
            }),
          )
        : articles;

    if (source.length >= 4) {
      return source
        .slice(0, 4)
        .map((article, index) =>
          articleToItem(article, FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]),
        );
    }

    return buildFallbackItems(source);
  }, [sanityArticles, homepage?.featuredArticles]);

  return (
    <section aria-labelledby="news-split-heading" className="bg-brand-warm">
      <div className="grid md:grid-cols-2 md:h-screen">
        <div className="bg-brand-light text-brand-dark flex flex-col justify-center px-6 md:px-12 lg:px-16 py-12 md:py-16">
          <div>
            <h2
              id="news-split-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] max-w-md mb-6"
            >
              {copy?.heading}
            </h2>
            <p className="text-base md:text-lg font-light text-brand-dark/70 leading-relaxed max-w-md">
              {copy?.description}
            </p>
          </div>
          <Link
            to={copy?.ctaPath ?? "/aktuelt"}
            className="inline-flex items-center gap-2 text-sm font-light text-brand-dark/80 hover:text-brand-dark mt-10 group w-fit"
          >
            {copy?.ctaLabel}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 grid-rows-2 md:h-screen">
          {items.map((item) => (
            <Link
              key={item.slug}
              to={`/aktuelt/${item.slug}`}
              className="group relative block overflow-hidden min-h-[40vh] md:min-h-0"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
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
      </div>
    </section>
  );
};
