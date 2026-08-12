import { useEffect, useMemo, useState } from "react";
import { BackLink } from "@/components/ui/BackLink";
import { MediaChip } from "@/components/ui/MediaChip";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, ChevronDown } from "lucide-react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { PageLayout } from "@/components/layout/PageLayout";
import { SplitHeroMedia } from "@/components/layout/SplitHeroMedia";
import { articles } from "@/data/articles";
import { articleContent, type ContentBlock } from "@/data/articleContent";
import { useArticle, useArticles } from "@/hooks/useSanity";
import { PageSEO } from "@/components/seo/PageSEO";
import { urlFor } from "@/lib/sanityClient";
import { VideoPlayer, VideoEmbed } from "@/components/ui/video-player";

interface ArticlePageProps {
  isChatOpen: boolean;
  slug?: string;
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

const ArticlePage = ({ isChatOpen, slug: slugOverride }: ArticlePageProps) => {
  const { slug: routeSlug } = useParams<{ slug: string }>();
  const slug = slugOverride ?? routeSlug;
  const { data: sanityArticle } = useArticle(slug || "");
  const { data: sanityArticles } = useArticles();
  const staticArticle = articles.find((a) => a.slug === slug);
  
  // Prefer Sanity data, fall back to static
  const article = sanityArticle
    ? { ...sanityArticle, image: sanityArticle.image || staticArticle?.image || "" }
    : staticArticle;
  const content = slug ? articleContent[slug] : undefined;

  // Parallax / fade for the mobile hero
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            <BackLink to="/aktuelt" className="justify-center">Tilbake til Aktuelt</BackLink>
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

      {/* Header — mobil: fullskjerms bildehero. Desktop: mørk tekst-header (uendret). */}
      <div className="lg:hidden relative w-full h-[100svh] overflow-hidden bg-brand-dark">
        <img
          src={article.image}
          alt={article.title}
          className="absolute inset-0 w-full h-[118%] object-cover object-[50%_28%] will-change-transform"
          style={{ transform: `translate3d(0, ${scrollY * 0.35}px, 0)` }}
        />
        {/* Sterk gradient fra bunn i brand-mørkbrun — sikrer lys tekst på alle bilder */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(24,4,4,0.94) 0%, rgba(66,51,42,0.88) 22%, rgba(66,51,42,0.72) 40%, rgba(66,51,42,0.48) 58%, rgba(66,51,42,0.24) 78%, rgba(66,51,42,0.10) 100%)",
          }}
        />
        {/* Topp-skygge så header og «Tilbake»-lenken alltid er lesbar */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-dark/70 via-brand-dark/30 to-transparent" />

        <div
          className="absolute inset-x-0 bottom-0 px-6 pb-16"
          style={{ transform: `translate3d(0, ${scrollY * -0.12}px, 0)` }}
        >
          <BackLink to="/aktuelt" tone="onImage" className="mb-5">Tilbake til Aktuelt</BackLink>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-brand-warm text-xs">{article.category}</span>
            <span className="text-brand-warm/90 text-xs flex items-center gap-1.5">
              <Calendar className="w-3 h-3" aria-hidden="true" />
              {formatDate(article.date)}
            </span>
          </div>
          <h1 className="text-2xl font-light text-brand-warm leading-tight">
            {article.title}
          </h1>
        </div>

        {/* Sveip ned-indikator med fade ved scroll */}
        <div
          className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-1 pointer-events-none transition-opacity duration-200"
          style={{ opacity: Math.max(0, 1 - scrollY / 160) }}
          aria-hidden="true"
        >
          <span className="text-brand-warm/80 text-xs">Sveip ned for å lese</span>
          <ChevronDown className="w-4 h-4 text-brand-warm/80 animate-bounce" />
        </div>
      </div>


      {/* Desktop: split-screen hero — tekst venstre, bilde høyre (kant i kant) */}
      <div className="hidden lg:grid lg:grid-cols-2 bg-brand-dark section-flush split-hero">
        <div className="flex flex-col justify-center py-16 lg:py-20 pl-6 md:pl-16 pr-6 md:pr-12">
          <BackLink to="/aktuelt" tone="onImage" className="mb-6">Tilbake til Aktuelt</BackLink>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-white/80 text-xs">
              {article.category}
            </span>
            <span className="text-white/70 text-xs flex items-center gap-1.5">
              <Calendar className="w-3 h-3" aria-hidden="true" />
              {formatDate(article.date)}
            </span>
          </div>
          <h1 className="text-4xl font-light text-white leading-tight">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mt-5 text-white/80 font-light text-base lg:text-lg leading-relaxed max-w-xl">
              {article.excerpt}
            </p>
          )}
        </div>
        <SplitHeroMedia
          src={article.image}
          alt={article.title}
          className="relative h-full w-full overflow-hidden"
          mediaClassName="object-cover"
          objectPosition="50% 35%"
        />
      </div>



      {/* Article content */}
      <article className="bg-background">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-3xl mx-auto py-10 md:py-16">
            {/* Featured video or image */}
            {sanityArticle?.videoUrl ? (
              <figure className="mb-10">
                {sanityArticle.videoUrl.endsWith(".mp4") ? (
                  <VideoPlayer
                    videoUrl={sanityArticle.videoUrl}
                    thumbnailUrl={sanityArticle.videoThumbnail || article.image}
                    title={sanityArticle.videoCaption || article.title}
                  />
                ) : (
                  <VideoEmbed
                    embedUrl={sanityArticle.videoUrl}
                    title={sanityArticle.videoCaption || article.title}
                  />
                )}
                {sanityArticle.videoCaption && (
                  <figcaption className="text-sm text-muted-foreground mt-2">
                    {sanityArticle.videoCaption}
                  </figcaption>
                )}
              </figure>
            ) : (
              <div className="hidden rounded-sm overflow-hidden mb-10 -mt-0">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full rounded-sm"
                />
              </div>
            )}

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
                  <div className="relative aspect-[4/3] rounded-sm overflow-hidden mb-3 bg-secondary">
                    <img
                      src={rel.image}
                      alt={rel.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <MediaChip>
                        {rel.category}
                      </MediaChip>
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
