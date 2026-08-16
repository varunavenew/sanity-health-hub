import { ArticleCard, type ListingArticle } from "@/components/news/ArticleListingCards";
import type { Article } from "@/data/articles";

interface ArticleRelatedSectionProps {
  title: string;
  articles: Article[];
  newsPath: string;
  dateLocale: string;
  getCategoryLabel: (category: string) => string;
}

export function ArticleRelatedSection({
  title,
  articles,
  newsPath,
  dateLocale,
  getCategoryLabel,
}: ArticleRelatedSectionProps) {
  if (!articles.length) return null;

  return (
    <section className="bg-secondary/40 border-t border-border py-12 md:py-16">
      <div className="container mx-auto px-6 md:px-16">
        <h2 className="text-lg font-medium text-foreground mb-8">{title}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((rel) => (
            <ArticleCard
              key={rel.slug}
              article={rel as ListingArticle}
              categoryLabel={getCategoryLabel(rel.category)}
              linkTo={rel.externalUrl || `${newsPath}/${rel.slug}`}
              dateLocale={dateLocale}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
