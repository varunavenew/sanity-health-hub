import { Calendar } from "lucide-react";
import { Link } from "@/lib/router";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { MediaChip } from "@/components/ui/MediaChip";
import { ReadMoreLink } from "@/components/ui/ReadMoreLink";
import { ArticleFormatBadge } from "@/components/news/ArticleFormatBadge";
import type { Article } from "@/data/articles";

export type ListingArticle = Article;

export function ArticleCard({
  article,
  categoryLabel,
  linkTo,
  dateLocale,
}: {
  article: ListingArticle;
  categoryLabel: string;
  linkTo: string;
  dateLocale: string;
}) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(dateLocale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Link to={linkTo} className="group">
      <div className="relative aspect-[16/10] rounded-sm overflow-hidden mb-3 bg-secondary">
        <ResponsiveImage
          src={article.image}
          alt={article.title}
          variant="card"
          hotspot={article.imageHotspot}
          crop={article.imageCrop}
          loading="lazy"
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <MediaChip>{categoryLabel}</MediaChip>
        </div>
        <ArticleFormatBadge format={article.contentFormat} />
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
        <Calendar className="w-3 h-3" />
        {formatDate(article.date)}
      </div>
      <h3 className="text-sm font-medium text-foreground group-hover:text-foreground/80 transition-colors mb-1 leading-snug">
        {article.title}
      </h3>
      <p className="text-xs text-muted-foreground font-light line-clamp-2">{article.excerpt}</p>
    </Link>
  );
}

export function FeaturedCard({
  article,
  categoryLabel,
  linkTo,
  readMoreLabel,
  dateLocale,
}: {
  article: ListingArticle;
  categoryLabel: string;
  linkTo: string;
  readMoreLabel: string;
  dateLocale: string;
}) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(dateLocale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Link to={linkTo} className="group relative block rounded-sm overflow-hidden">
      <div className="aspect-[4/3] overflow-hidden">
        <ResponsiveImage
          src={article.image}
          alt={article.title}
          variant="card"
          hotspot={article.imageHotspot}
          crop={article.imageCrop}
          className="w-full h-full group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <ArticleFormatBadge format={article.contentFormat} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
        <MediaChip tone="light" className="mb-2">
          {categoryLabel}
        </MediaChip>
        <h3 className="text-base md:text-lg font-medium text-white leading-snug mb-2 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-white/60 text-xs font-light line-clamp-2 mb-2 hidden md:block">
          {article.excerpt}
        </p>
        <div className="flex items-center gap-4">
          <span className="text-white/50 text-xs flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {formatDate(article.date)}
          </span>
          <ReadMoreLink tone="onImage">{readMoreLabel}</ReadMoreLink>
        </div>
      </div>
    </Link>
  );
}
