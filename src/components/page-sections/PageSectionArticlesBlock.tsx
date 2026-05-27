"use client";

import { useMemo } from "react";
import { Link } from "@/lib/router";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useArticles } from "@/hooks/useSanity";
import { normalizeCategory, type Article } from "@/data/articles";
import type { PageSectionArticlesConfig } from "@/lib/sanity/page-sections";

const CATEGORY_LABELS: Record<string, string> = {
  fagartikkel: "Fagartikler",
  nyheter: "Nytt fra oss",
  prisliste: "Prisliste",
  stillingsutlysning: "Stillingsutlysning",
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" });
}

function displayCategory(cat: string) {
  return CATEGORY_LABELS[cat] || normalizeCategory(cat);
}

function articleLinkTo(article: { slug: string; externalUrl?: string }) {
  return article.externalUrl || `/aktuelt/${article.slug}`;
}

function ArticleGridCard({ article }: { article: Article }) {
  const linkTo = articleLinkTo(article);

  return (
    <Link to={linkTo} className="group">
      <div className="relative aspect-[16/10] rounded-sm overflow-hidden mb-3 bg-secondary">
        {article.image ? (
          <img
            src={article.image}
            alt={article.title}
            loading="lazy"
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-brand-beige/40" />
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-brand-dark/80 backdrop-blur-sm text-white text-xs px-2.5 py-0.5 rounded-full">
            {displayCategory(article.category)}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
        <Calendar className="w-3 h-3" />
        {formatDate(article.date)}
      </div>
      <h3 className="text-sm font-medium text-foreground group-hover:text-foreground/80 transition-colors mb-1 leading-snug">
        {article.title}
      </h3>
      {article.excerpt ? (
        <p className="text-xs text-muted-foreground font-light line-clamp-2">{article.excerpt}</p>
      ) : null}
    </Link>
  );
}

function resolveArticles(config: PageSectionArticlesConfig, all: Article[]): Article[] {
  const limit = config.limit ?? 6;
  const mode = config.displayMode ?? "latest";

  if (mode === "manual" && config.articles?.length) {
    return config.articles.slice(0, limit).map(
      (a): Article => ({
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        image: a.image,
        date: a.date,
        category: a.category,
        externalUrl: a.externalUrl,
      }),
    );
  }

  if (mode === "category" && config.articleCategory) {
    return all
      .filter((a) => a.category === config.articleCategory)
      .slice(0, limit);
  }

  return [...all]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

type Props = {
  config: PageSectionArticlesConfig;
};

export function PageSectionArticlesBlock({ config }: Props) {
  const { data: allArticles = [] } = useArticles();

  const articles = useMemo((): Article[] => {
    const mode = config.displayMode ?? "latest";
    const limit = config.limit ?? 6;

    if (mode === "category" && config.articleCategory) {
      return allArticles
        .filter((a) => a.category === config.articleCategory)
        .slice(0, limit)
        .map(
          (a): Article => ({
            slug: a.slug,
            title: a.title,
            excerpt: a.excerpt,
            image: a.image,
            date: a.date,
            category: normalizeCategory(a.category),
          }),
        );
    }

    const mapped: Article[] = allArticles.map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      image: a.image,
      date: a.date,
      category: normalizeCategory(a.category),
      featured: a.featured,
      pinned: a.pinned,
    }));
    return resolveArticles(config, mapped);
  }, [config, allArticles]);

  if (articles.length === 0) return null;

  const eyebrow = config.eyebrow;
  const title = config.title || "Aktuelt";
  const description = config.description;
  const ctaPath = config.ctaPath || "/aktuelt";
  const ctaLabel = config.ctaLabel || "Se alle artikler";

  const featured = config.variant === "featured" ? articles[0] : null;
  const gridItems = config.variant === "featured" ? articles.slice(1) : articles;

  return (
    <section className="py-16 md:py-24 bg-background border-t border-border/40">
      <div className="container mx-auto px-6 md:px-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="max-w-xl">
            {eyebrow ? (
              <p className="text-sm text-muted-foreground font-light mb-2">{eyebrow}</p>
            ) : null}
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-3">{title}</h2>
            {description ? (
              <p className="text-muted-foreground font-light">{description}</p>
            ) : null}
          </div>
          <Button variant="cta-outline" asChild>
            <Link to={ctaPath}>
              {ctaLabel}
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>

        {featured ? (
          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <Link
              to={articleLinkTo(featured)}
              className="group relative block rounded-sm overflow-hidden md:row-span-2"
            >
              <div className="aspect-[4/3] md:aspect-auto md:h-full min-h-[280px] overflow-hidden">
                {featured.image ? (
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-brand-beige/40" />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="inline-block bg-white/15 text-white text-xs px-2.5 py-0.5 rounded-full mb-2">
                  {displayCategory(featured.category)}
                </span>
                <h3 className="text-lg font-medium text-white leading-snug">{featured.title}</h3>
              </div>
            </Link>
            <div className="grid sm:grid-cols-2 gap-6">
              {gridItems.map((article) => (
                <ArticleGridCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridItems.map((article) => (
              <ArticleGridCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
