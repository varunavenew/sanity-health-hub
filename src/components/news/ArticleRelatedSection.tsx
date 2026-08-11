import { Calendar } from "lucide-react";
import { Link } from "@/lib/router";
import { AssetImg } from "@/components/AssetImg";
import type { Article } from "@/data/articles";

interface ArticleRelatedSectionProps {
  title: string;
  articles: Article[];
  newsPath: string;
  dateLocale: string;
  getCategoryLabel: (category: string) => string;
  formatDate: (dateStr: string, locale: string) => string;
}

export function ArticleRelatedSection({
  title,
  articles,
  newsPath,
  dateLocale,
  getCategoryLabel,
  formatDate,
}: ArticleRelatedSectionProps) {
  if (!articles.length) return null;

  return (
    <section className="bg-secondary/30 border-t border-border py-12 md:py-16">
      <div className="container mx-auto px-6 md:px-16">
        <h2 className="text-lg font-medium text-foreground mb-8">{title}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((rel) => (
            <Link
              key={rel.slug}
              to={rel.externalUrl || `${newsPath}/${rel.slug}`}
              className="group"
            >
              <div className="relative aspect-[16/10] rounded-sm overflow-hidden mb-3 bg-secondary">
                <AssetImg
                  src={rel.image}
                  alt={rel.title}
                  preset="card"
                  loading="lazy"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-brand-dark/80 backdrop-blur-sm text-white text-xs px-2.5 py-0.5 rounded-full">
                    {getCategoryLabel(rel.category)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                <Calendar className="w-3 h-3" />
                {formatDate(rel.date, dateLocale)}
              </div>
              <h3 className="text-sm font-medium text-foreground group-hover:text-foreground/80 transition-colors leading-snug">
                {rel.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
