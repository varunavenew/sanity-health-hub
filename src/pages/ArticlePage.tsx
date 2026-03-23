import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { PageLayout } from "@/components/layout/PageLayout";
import { articles } from "@/data/articles";
import { articleContent, type ContentBlock } from "@/data/articleContent";
import { useArticle, useArticles } from "@/hooks/useSanity";
import { PageSEO } from "@/components/seo/PageSEO";
import { urlFor } from "@/lib/sanityClient";

interface ArticlePageProps {
  isChatOpen: boolean;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" });
};

// Portable Text components for Sanity body content
const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-foreground/80 font-light leading-relaxed mb-5">{children}</p>,
    h2: ({ children }) => <h2 className="text-xl md:text-2xl font-medium text-foreground mt-10 mb-4">{children}</h2>,
    h3: ({ children }) => <h3 className="text-lg font-medium text-foreground mt-8 mb-3">{children}</h3>,
    h4: ({ children }) => <h4 className="text-base font-medium text-foreground mt-6 mb-2">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-brand-dark/30 pl-5 my-6 text-foreground/80 italic font-light leading-relaxed">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="text-foreground/80 font-light leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="text-foreground/80 font-light leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-medium">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.blank ? "_blank" : undefined}
        rel={value?.blank ? "noopener noreferrer" : undefined}
        className="text-brand-dark underline underline-offset-4 hover:text-brand-dark/70 transition-colors"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => (
      <figure className="my-8">
        <img
          src={urlFor(value?.asset?._ref || "")}
          alt={value?.alt || ""}
          className="w-full rounded-sm"
        />
        {value?.caption && (
          <figcaption className="text-sm text-muted-foreground mt-2">{value.caption}</figcaption>
        )}
      </figure>
    ),
  },
};

const renderBlock = (block: ContentBlock, index: number) => {
  switch (block.type) {
    case "paragraph":
      return <p key={index} className="text-foreground/80 font-light leading-relaxed mb-5">{block.text}</p>;
    case "heading":
      return <h2 key={index} className="text-xl md:text-2xl font-medium text-foreground mt-10 mb-4">{block.text}</h2>;
    case "subheading":
      return <h3 key={index} className="text-lg font-medium text-foreground mt-8 mb-3">{block.text}</h3>;
    case "author":
      return <p key={index} className="text-sm text-muted-foreground italic mb-6">{block.text}</p>;
    case "bold-intro":
      return <p key={index} className="text-foreground font-medium leading-relaxed mb-5">{block.text}</p>;
    case "quote":
      return (
        <blockquote key={index} className="border-l-2 border-brand-dark/30 pl-5 my-6 text-foreground/80 italic font-light leading-relaxed">
          {block.text}
        </blockquote>
      );
    case "list":
      return (
        <ul key={index} className="list-disc pl-6 mb-6 space-y-2">
          {block.items.map((item, i) => (
            <li key={i} className="text-foreground/80 font-light leading-relaxed">{item}</li>
          ))}
        </ul>
      );
    case "link":
      return (
        <p key={index} className="mb-5">
          <Link to={block.url} className="text-brand-dark underline underline-offset-4 hover:text-brand-dark/70 transition-colors font-light">
            {block.text}
          </Link>
        </p>
      );
    case "source":
      return (
        <p key={index} className="text-sm text-muted-foreground mt-8 pt-6 border-t border-border">
          {block.url ? (
            <a href={block.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground transition-colors">
              {block.text}
            </a>
          ) : block.text}
        </p>
      );
    default:
      return null;
  }
};

const ArticlePage = ({ isChatOpen }: ArticlePageProps) => {
  const { slug } = useParams<{ slug: string }>();
  const { data: sanityArticle } = useArticle(slug || "");
  const { data: sanityArticles } = useArticles();
  const staticArticle = articles.find((a) => a.slug === slug);
  
  // Prefer Sanity data, fall back to static
  const article = sanityArticle
    ? { ...sanityArticle, image: sanityArticle.image || staticArticle?.image || "" }
    : staticArticle;
  const content = slug ? articleContent[slug] : undefined;

  // Build related articles from Sanity first, then static fallback
  const related = useMemo(() => {
    if (!article) return [];
    const allArticles = sanityArticles && sanityArticles.length > 0
      ? sanityArticles.map((a: any) => ({
          slug: a.slug,
          title: a.title,
          excerpt: a.excerpt,
          image: a.image,
          date: a.date,
          category: a.category,
        }))
      : articles;
    return allArticles
      .filter((a: any) => a.category === article.category && a.slug !== article.slug)
      .slice(0, 3);
  }, [article, sanityArticles]);

  useEffect(() => {
    if (article) {
      document.title = `${article.title} | CMedical`;
    }
  }, [article]);

  if (!article) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-medium text-foreground mb-2">Artikkelen ble ikke funnet</h1>
            <Link to="/aktuelt" className="text-brand-dark underline">Tilbake til Aktuelt</Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={article.title}
        description={article.excerpt || `Les om ${article.title} hos CMedical.`}
        canonical={`/aktuelt/${article.slug}`}
        type="article"
        publishedAt={article.date}
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Aktuelt", path: "/aktuelt" },
          { name: article.title, path: `/aktuelt/${article.slug}` },
        ]}
      />
      {/* Header */}
      <div className="bg-brand-dark pt-24 pb-10 md:pt-28 md:pb-14">
        <div className="container mx-auto px-6 md:px-16">
          <Link
            to="/aktuelt"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Tilbake til Aktuelt
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-white/10 text-white/80 text-xs px-3 py-1 rounded-full">
              {article.category}
            </span>
            <span className="text-white/40 text-xs flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              {formatDate(article.date)}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-light text-white leading-tight max-w-3xl">
            {article.title}
          </h1>
        </div>
      </div>

      {/* Article content */}
      <article className="bg-background">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl mx-auto py-10 md:py-16">
            {/* Featured image */}
            <div className="rounded-sm overflow-hidden mb-10 -mt-0">
              <img
                src={article.image}
                alt={article.title}
                className="w-full rounded-sm"
              />
            </div>

            {/* Body */}
            {/* Body: prefer Sanity Portable Text, then static content, then excerpt */}
            {sanityArticle?.body && sanityArticle.body.length > 0 ? (
              <div><PortableText value={sanityArticle.body} components={portableTextComponents} /></div>
            ) : content ? (
              <div>{content.map(renderBlock)}</div>
            ) : (
              <p className="text-foreground/80 font-light leading-relaxed">{article.excerpt}</p>
            )}
          </div>
        </div>
      </article>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="bg-secondary/30 border-t border-border py-12 md:py-16">
          <div className="container mx-auto px-6 md:px-16">
            <h2 className="text-lg font-medium text-foreground mb-8">Relaterte artikler</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link key={rel.slug} to={`/aktuelt/${rel.slug}`} className="group">
                  <div className="relative aspect-[16/10] rounded-sm overflow-hidden mb-3 bg-secondary">
                    <img
                      src={rel.image}
                      alt={rel.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="bg-brand-dark/80 backdrop-blur-sm text-white text-xs px-2.5 py-0.5 rounded-full">
                        {rel.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                    <Calendar className="w-3 h-3" />
                    {formatDate(rel.date)}
                  </div>
                  <h3 className="text-sm font-medium text-foreground group-hover:text-foreground/80 transition-colors leading-snug">
                    {rel.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PageLayout>
  );
};

export default ArticlePage;
